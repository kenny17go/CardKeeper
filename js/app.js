/* =========================================================
   app.js — main application controller
   ========================================================= */
(() => {
  'use strict';

  // ---------- state ----------
  let allCards = [];
  let activeTab = 'all';       // 'all' | 'fav' | category name
  let searchQuery = '';
  let pendingCapture = null;   // { imageDataUrl, thumbDataUrl, rawText, parsed }
  let editingCardId = null;    // set when confirm screen is editing an existing card

  // ---------- element refs ----------
  const el = (id) => document.getElementById(id);
  const cardList = el('cardList');
  const emptyState = el('emptyState');
  const tagTabs = el('tagTabs');
  const searchInput = el('searchInput');
  const toast = el('toast');

  const screenCamera = el('screenCamera');
  const screenProcessing = el('screenProcessing');
  const screenConfirm = el('screenConfirm');
  const screenDetail = el('screenDetail');
  const screenBackup = el('screenBackup');

  const video = el('video');
  const captureCanvas = el('captureCanvas');

  // ===================================================
  // Utilities
  // ===================================================
  function uid() {
    return 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.add('hidden'), 2200);
  }

  function showScreen(screenEl) {
    [screenCamera, screenProcessing, screenConfirm, screenDetail, screenBackup].forEach(s => s.classList.add('hidden'));
    if (screenEl) screenEl.classList.remove('hidden');
  }

  function closeAllScreens() {
    showScreen(null);
    CardCamera.stop();
  }

  function escapeHtml(s) {
    return (s || '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ===================================================
  // Load + render card list
  // ===================================================
  async function loadCards() {
    allCards = await CardDB.getAll();
    renderTabs();
    renderList();
  }

  function getCategories() {
    const set = new Set();
    allCards.forEach(c => set.add(c.category || '未分類'));
    return [...set].sort();
  }

  function renderTabs() {
    const cats = getCategories();
    const favCount = allCards.filter(c => c.favorite).length;
    const tabs = [
      { key: 'all', label: '全部', count: allCards.length },
      { key: 'fav', label: '⭐ 最愛', count: favCount },
      ...cats.map(c => ({ key: c, label: c, count: allCards.filter(x => (x.category || '未分類') === c).length }))
    ];
    tagTabs.innerHTML = tabs.map(t => `
      <button class="tag-tab ${activeTab === t.key ? 'active' : ''}" data-tab="${escapeHtml(t.key)}">
        ${escapeHtml(t.label)}<span class="count">${t.count}</span>
      </button>
    `).join('');
    tagTabs.querySelectorAll('.tag-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        renderTabs();
        renderList();
      });
    });
  }

  function filteredCards() {
    let list = allCards;
    if (activeTab === 'fav') list = list.filter(c => c.favorite);
    else if (activeTab !== 'all') list = list.filter(c => (c.category || '未分類') === activeTab);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(c => [c.name, c.nameEn, c.company, c.title, c.mobile, c.phone, c.email, c.address, c.category]
        .filter(Boolean).some(v => v.toLowerCase().includes(q)));
    }
    return list;
  }

  function renderList() {
    const list = filteredCards();
    emptyState.classList.toggle('hidden', allCards.length !== 0);
    if (allCards.length === 0) { cardList.innerHTML = ''; return; }

    if (list.length === 0) {
      cardList.innerHTML = `<p style="grid-column:1/-1;color:var(--ink-soft);text-align:center;padding:40px 0;">找不到符合的名片</p>`;
      return;
    }

    cardList.innerHTML = list.map(c => `
      <article class="card-item" data-id="${c.id}">
        <div class="tab">${escapeHtml(c.category || '未分類')}</div>
        ${c.favorite ? '<div class="fav-star">⭐</div>' : ''}
        <div class="card-row">
          ${c.thumb ? `<img class="card-thumb" src="${c.thumb}" alt="">` : `<div class="card-thumb placeholder">${escapeHtml((c.name || c.nameEn || '?')[0] || '?')}</div>`}
          <div>
            <p class="card-name">${escapeHtml(c.name || c.nameEn || '（未命名）')}</p>
            <p class="card-role">${escapeHtml([c.title, c.company].filter(Boolean).join(' · '))}</p>
          </div>
        </div>
        <hr class="card-divider">
        <div class="card-meta">
          ${c.mobile ? `<span>📱 ${escapeHtml(c.mobile)}</span>` : ''}
          ${!c.mobile && c.phone ? `<span>☎️ ${escapeHtml(c.phone)}</span>` : ''}
          ${c.email ? `<span>✉️ ${escapeHtml(c.email)}</span>` : ''}
        </div>
      </article>
    `).join('');

    cardList.querySelectorAll('.card-item').forEach(node => {
      node.addEventListener('click', () => openDetail(node.dataset.id));
    });
  }

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderList();
  });

  // ===================================================
  // Camera flow
  // ===================================================
  el('btnCapture').addEventListener('click', openCamera);
  el('btnCloseCamera').addEventListener('click', () => { CardCamera.stop(); closeAllScreens(); });

  async function openCamera() {
    editingCardId = null;
    showScreen(screenCamera);
    try {
      await CardCamera.start(video);
    } catch (err) {
      showToast('無法開啟相機，請改用相簿選取');
      console.error(err);
    }
  }

  el('btnShoot').addEventListener('click', async () => {
    try {
      const dataUrl = CardCamera.captureFromVideo(video, captureCanvas);
      CardCamera.stop();
      await handleCapturedImage(dataUrl);
    } catch (err) {
      console.error(err);
      showToast('拍照失敗，請再試一次');
    }
  });

  el('fileInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    CardCamera.stop();
    const dataUrl = await CardCamera.fileToDataUrl(file);
    await handleCapturedImage(dataUrl);
  });

  async function handleCapturedImage(imageDataUrl) {
    showScreen(screenProcessing);
    el('processingPreview').src = imageDataUrl;
    el('processingLabel').textContent = '正在讀取名片文字…';
    el('processingSub').textContent = '啟動 OCR 引擎（首次使用需下載語言檔）';

    try {
      const rawText = await CardOCR.recognize(imageDataUrl, (m) => {
        if (m.status === 'recognizing text') {
          el('processingLabel').textContent = `辨識中… ${Math.round((m.progress || 0) * 100)}%`;
          el('processingSub').textContent = '正在分析中英文字元';
        } else if (m.status) {
          el('processingSub').textContent = m.status;
        }
      });

      const parsed = CardParse.parse(rawText);
      const thumb = await CardCamera.makeThumbnail(imageDataUrl);
      pendingCapture = { imageDataUrl, thumb, rawText, parsed };
      openConfirmScreen(parsed, imageDataUrl, rawText);
    } catch (err) {
      console.error(err);
      showToast('OCR 辨識失敗，請手動輸入');
      const parsed = CardParse.parse('');
      const thumb = await CardCamera.makeThumbnail(imageDataUrl);
      pendingCapture = { imageDataUrl, thumb, rawText: '', parsed };
      openConfirmScreen(parsed, imageDataUrl, '');
    }
  }

  // ===================================================
  // Confirm / edit screen
  // ===================================================
  const cardForm = el('cardForm');

  function openConfirmScreen(parsed, imageDataUrl, rawText) {
    cardForm.reset();
    for (const key of ['name','nameEn','company','title','mobile','phone','email','website','address','category','note']) {
      if (cardForm.elements[key]) cardForm.elements[key].value = parsed[key] || '';
    }
    cardForm.elements.favorite.checked = !!parsed.favorite;
    el('confirmThumb').src = imageDataUrl || '';
    el('rawOcrText').textContent = rawText || '（無文字）';
    refreshCategoryDatalist();
    showScreen(screenConfirm);
  }

  function refreshCategoryDatalist() {
    const dl = el('categoryOptions');
    const cats = new Set(CardParse.CATEGORY_MAP.map(c => c.cat));
    getCategories().forEach(c => cats.add(c));
    dl.innerHTML = [...cats].map(c => `<option value="${escapeHtml(c)}">`).join('');
  }

  el('btnConfirmBack').addEventListener('click', () => {
    editingCardId = null;
    closeAllScreens();
  });

  el('btnSaveCard').addEventListener('click', async () => {
    const fd = new FormData(cardForm);
    const now = Date.now();

    const card = {
      id: editingCardId || uid(),
      name: (fd.get('name') || '').trim(),
      nameEn: (fd.get('nameEn') || '').trim(),
      company: (fd.get('company') || '').trim(),
      title: (fd.get('title') || '').trim(),
      mobile: (fd.get('mobile') || '').trim(),
      phone: (fd.get('phone') || '').trim(),
      email: (fd.get('email') || '').trim(),
      website: (fd.get('website') || '').trim(),
      address: (fd.get('address') || '').trim(),
      category: (fd.get('category') || '').trim() || '未分類',
      note: (fd.get('note') || '').trim(),
      favorite: fd.get('favorite') === 'on',
      rawText: pendingCapture ? pendingCapture.rawText : (editingCardId ? (await CardDB.get(editingCardId))?.rawText : ''),
      photo: pendingCapture ? pendingCapture.imageDataUrl : (editingCardId ? (await CardDB.get(editingCardId))?.photo : ''),
      thumb: pendingCapture ? pendingCapture.thumb : (editingCardId ? (await CardDB.get(editingCardId))?.thumb : ''),
      createdAt: editingCardId ? (await CardDB.get(editingCardId))?.createdAt || now : now,
      updatedAt: now
    };

    if (!card.name && !card.nameEn && !card.company) {
      showToast('請至少輸入姓名或公司');
      return;
    }

    await CardDB.put(card);
    pendingCapture = null;
    const wasEditing = !!editingCardId;
    editingCardId = null;
    await loadCards();
    showToast(wasEditing ? '已更新名片' : '已儲存名片');
    openDetail(card.id);
  });

  // ===================================================
  // Detail screen
  // ===================================================
  let currentDetailId = null;

  async function openDetail(id) {
    const card = await CardDB.get(id);
    if (!card) { showToast('找不到這張名片'); return; }
    currentDetailId = id;

    el('detailTag').textContent = card.category || '未分類';
    el('detailThumb').src = card.photo || card.thumb || '';
    el('detailName').textContent = card.name || card.nameEn || '（未命名）';
    el('detailNameEn').textContent = card.name ? (card.nameEn || '') : '';
    el('detailNameEn').classList.toggle('hidden', !card.name || !card.nameEn);
    el('detailTitleCompany').textContent = [card.title, card.company].filter(Boolean).join(' · ') || '—';

    el('btnDetailFav').innerHTML = card.favorite
      ? `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#B3432B" d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
      : `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

    el('actCall').disabled = !(card.mobile || card.phone);
    el('actMobile').disabled = !card.mobile;
    el('actEmail').disabled = !card.email;
    el('actMap').disabled = !card.address;

    const fieldRows = [
      ['📱 手機', card.mobile],
      ['☎️ 電話', card.phone],
      ['✉️ Email', card.email],
      ['🌐 網站', card.website],
      ['📍 地址', card.address],
      ['📝 備註', card.note]
    ].filter(([, v]) => v);
    el('detailFields').innerHTML = fieldRows.map(([k, v]) => `
      <div class="row"><span class="k">${k}</span><span class="v">${escapeHtml(v)}</span></div>
    `).join('') || `<div class="row"><span class="k">—</span><span class="v">尚無其他資料</span></div>`;

    showScreen(screenDetail);
  }

  el('btnDetailBack').addEventListener('click', closeAllScreens);

  el('btnDetailFav').addEventListener('click', async () => {
    const card = await CardDB.get(currentDetailId);
    card.favorite = !card.favorite;
    card.updatedAt = Date.now();
    await CardDB.put(card);
    await loadCards();
    openDetail(currentDetailId);
  });

  el('actCall').addEventListener('click', async () => {
    const card = await CardDB.get(currentDetailId);
    const num = card.mobile || card.phone;
    if (num) window.location.href = `tel:${num.replace(/[^\d+]/g, '')}`;
  });
  el('actMobile').addEventListener('click', async () => {
    const card = await CardDB.get(currentDetailId);
    if (card.mobile) window.location.href = `sms:${card.mobile.replace(/[^\d+]/g, '')}`;
  });
  el('actEmail').addEventListener('click', async () => {
    const card = await CardDB.get(currentDetailId);
    if (card.email) window.location.href = `mailto:${card.email}`;
  });
  el('actMap').addEventListener('click', async () => {
    const card = await CardDB.get(currentDetailId);
    if (card.address) window.location.href = `https://maps.apple.com/?q=${encodeURIComponent(card.address)}`;
  });

  el('btnEditCard').addEventListener('click', async () => {
    const card = await CardDB.get(currentDetailId);
    editingCardId = card.id;
    pendingCapture = null;
    openConfirmScreen(card, card.photo || card.thumb, card.rawText || '');
  });

  el('btnDeleteCard').addEventListener('click', async () => {
    if (!confirm('確定要刪除這張名片嗎？此操作無法復原。')) return;
    await CardDB.delete(currentDetailId);
    await loadCards();
    closeAllScreens();
    showToast('已刪除名片');
  });

  // ===================================================
  // Backup / restore
  // ===================================================
  el('btnBackup').addEventListener('click', async () => {
    el('backupCardCount').textContent = allCards.length;
    showScreen(screenBackup);
  });
  el('btnBackupBack').addEventListener('click', closeAllScreens);

  el('btnExportJson').addEventListener('click', async () => {
    const cards = await CardDB.getAll();
    const payload = {
      app: 'CardKeeper',
      version: 1,
      exportedAt: new Date().toISOString(),
      count: cards.length,
      cards
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `cardkeeper-backup-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('已匯出 JSON 備份');
  });

  el('importFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const cards = Array.isArray(data) ? data : (data.cards || []);
      if (!Array.isArray(cards) || cards.length === 0) throw new Error('empty');
      const normalized = cards.map(c => ({
        id: c.id || uid(),
        name: c.name || '', nameEn: c.nameEn || '',
        company: c.company || '', title: c.title || '',
        mobile: c.mobile || '', phone: c.phone || '',
        email: c.email || '', website: c.website || '',
        address: c.address || '', category: c.category || '未分類',
        note: c.note || '', favorite: !!c.favorite,
        rawText: c.rawText || '', photo: c.photo || '', thumb: c.thumb || '',
        createdAt: c.createdAt || Date.now(), updatedAt: c.updatedAt || Date.now()
      }));
      const added = await CardDB.bulkPutIfNotExists(normalized);
      await loadCards();
      el('backupCardCount').textContent = allCards.length;
      showToast(`已還原 ${added} 張新名片`);
    } catch (err) {
      console.error(err);
      showToast('備份檔案格式錯誤');
    }
  });

  el('btnClearAll').addEventListener('click', async () => {
    if (!confirm('確定要清空所有名片嗎？建議先匯出備份。此操作無法復原。')) return;
    await CardDB.clearAll();
    await loadCards();
    el('backupCardCount').textContent = 0;
    showToast('已清空所有名片');
  });

  // ===================================================
  // Init
  // ===================================================
  async function init() {
    await loadCards();

    if ('serviceWorker' in navigator) {
      try { await navigator.serviceWorker.register('sw.js'); }
      catch (e) { console.warn('SW registration failed', e); }
    }
  }

  init();
})();
