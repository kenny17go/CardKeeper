/* CardKeeper AI batch scan test controller
   Phase 1: batch image intake -> structured AI result review -> selected save.
   No AI provider is connected yet; existing single-card flow remains unchanged. */
(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const screen = $('screenAiBatch');
  if (!screen) return;

  let photos = [];
  let results = [];

  const uid = () => 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  const esc = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function setStatus(text) {
    let node = $('aiBatchStatus');
    if (!node) {
      node = document.createElement('p');
      node.id = 'aiBatchStatus';
      node.className = 'ai-batch-status';
      $('btnAiAnalyze').insertAdjacentElement('afterend', node);
    }
    node.textContent = text || '';
  }

  function open() {
    screen.classList.remove('hidden');
    renderPhotos();
  }

  function close() {
    screen.classList.add('hidden');
  }

  async function fileToDataUrl(file, maxSide = 1800, quality = .9) {
    const original = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });
    try {
      const img = new Image();
      img.src = original;
      await img.decode();
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      if (scale === 1) return original;
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(img.naturalWidth * scale));
      c.height = Math.max(1, Math.round(img.naturalHeight * scale));
      c.getContext('2d', { alpha:false }).drawImage(img, 0, 0, c.width, c.height);
      return c.toDataURL('image/jpeg', quality);
    } catch (_) {
      return original;
    }
  }

  async function addFiles(fileList) {
    const incoming = [...(fileList || [])].filter(f => f.type.startsWith('image/'));
    if (!incoming.length) return;
    setStatus('正在準備照片…');
    for (const file of incoming) {
      const dataUrl = await fileToDataUrl(file);
      photos.push({
        id: 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
        name: file.name || 'camera.jpg',
        dataUrl
      });
    }
    setStatus('');
    renderPhotos();
  }

  function renderPhotos() {
    const grid = $('aiBatchPreviewGrid');
    $('aiBatchCount').textContent = photos.length + ' 張照片';
    $('aiBatchEmpty').classList.toggle('hidden', photos.length > 0);
    $('btnAiAnalyze').disabled = photos.length === 0;
    grid.innerHTML = photos.map((p, i) => `
      <div class="ai-batch-preview" data-i="${i}">
        <img src="${p.dataUrl}" alt="">
        <button type="button" aria-label="移除">×</button>
      </div>`).join('');
    grid.querySelectorAll('.ai-batch-preview button').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = Number(btn.parentElement.dataset.i);
        photos.splice(i, 1);
        renderPhotos();
      });
    });
  }

  function normalizeResult(item, index) {
    return {
      id: item.id || ('ai_' + index + '_' + Date.now().toString(36)),
      selected: item.selected !== false,
      sourceIndex: Number.isInteger(item.sourceIndex) ? item.sourceIndex : index,
      cropImage: item.cropImage || item.photo || '',
      confidence: Number(item.confidence || 0),
      name: item.name || '',
      nameEn: item.nameEn || '',
      company: item.company || '',
      title: item.title || '',
      mobile: item.mobile || '',
      phone: item.phone || '',
      phone2: item.phone2 || '',
      fax: item.fax || '',
      email: item.email || '',
      website: item.website || '',
      address: item.address || '',
      category: item.category || '未分類',
      note: item.note || '',
      rawText: item.rawText || ''
    };
  }

  function renderResults() {
    const box = $('aiBatchResults');
    box.classList.toggle('hidden', results.length === 0);
    $('aiBatchResultCount').textContent = results.length;
    $('aiBatchResultList').innerHTML = results.map((r, i) => {
      const source = r.cropImage || photos[r.sourceIndex]?.dataUrl || '';
      return `
      <article class="ai-result-card" data-i="${i}">
        <div class="ai-result-top">
          <input class="ai-result-select" type="checkbox" ${r.selected ? 'checked' : ''} aria-label="選取名片">
          ${source ? `<img class="ai-result-thumb" src="${source}" alt="">` : '<div class="ai-result-thumb"></div>'}
          <div class="ai-result-main">
            <strong>${esc(r.name || r.nameEn || r.company || '待確認名片')}</strong>
            <span>${esc([r.title, r.company].filter(Boolean).join(' · ') || '尚未辨識完整')}</span>
            <span>${r.confidence ? 'AI 信心 ' + Math.round(r.confidence) + '%' : 'AI 信心未提供'}</span>
          </div>
        </div>
        <div class="ai-result-grid">
          <div>📱 ${esc(r.mobile || '—')}</div><div>☎️ ${esc(r.phone || '—')}</div>
          <div>✉️ ${esc(r.email || '—')}</div><div>🏷️ ${esc(r.category || '未分類')}</div>
        </div>
      </article>`;
    }).join('');

    $('aiBatchResultList').querySelectorAll('.ai-result-card').forEach(card => {
      const i = Number(card.dataset.i);
      card.querySelector('.ai-result-select').addEventListener('change', e => {
        results[i].selected = e.target.checked;
      });
    });
  }

  async function saveSelected() {
    const chosen = results.filter(r => r.selected);
    if (!chosen.length) {
      setStatus('請至少勾選一張名片。');
      return;
    }
    $('btnAiSaveSelected').disabled = true;
    setStatus('正在儲存…');
    let saved = 0;
    try {
      for (const r of chosen) {
        const now = Date.now();
        let photo = r.cropImage || photos[r.sourceIndex]?.dataUrl || '';
        try {
          if (photo && window.CardCamera?.normalizeForStorage) photo = await CardCamera.normalizeForStorage(photo);
        } catch (_) {}
        let thumb = '';
        try {
          if (photo && window.CardCamera?.makeThumbnail) thumb = await CardCamera.makeThumbnail(photo);
        } catch (_) {}
        await CardDB.put({
          id: uid(),
          name:r.name, nameEn:r.nameEn, company:r.company, title:r.title,
          mobile:r.mobile, phone:r.phone, phone2:r.phone2, fax:r.fax,
          email:r.email, website:r.website, address:r.address,
          category:r.category || '未分類', note:r.note || '',
          favorite:false, rawText:r.rawText || '', photo, thumb,
          backPhoto:'', backThumb:'', createdAt:now, updatedAt:now,
          aiBatch:true, aiConfidence:r.confidence || 0
        });
        saved++;
      }
      setStatus(`已儲存 ${saved} 張名片。返回首頁即可看到資料。`);
      results = results.filter(r => !r.selected);
      renderResults();
    } catch (err) {
      console.error('AI batch save failed', err);
      setStatus('儲存失敗，尚未完成的資料仍保留在此頁。');
    } finally {
      $('btnAiSaveSelected').disabled = false;
    }
  }

  $('btnAiBatch')?.addEventListener('click', open);
  $('btnAiBatchBack')?.addEventListener('click', () => { close(); location.reload(); });
  $('aiBatchCameraInput')?.addEventListener('change', async e => {
    await addFiles(e.target.files); e.target.value = '';
  });
  $('aiBatchFiles')?.addEventListener('change', async e => {
    await addFiles(e.target.files); e.target.value = '';
  });
  $('btnAiAnalyze')?.addEventListener('click', () => {
    setStatus('批次上傳介面已完成。下一階段接 AI 後端後，這裡會自動切割、OCR、分類並回傳確認清單。');
  });
  $('aiBatchResultFile')?.addEventListener('change', async e => {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const list = Array.isArray(data) ? data : (data.cards || data.results || []);
      if (!Array.isArray(list) || !list.length) throw new Error('empty');
      results = list.map(normalizeResult);
      setStatus('已載入 AI 結果，可先測試批次確認與儲存。');
      renderResults();
    } catch (err) {
      console.error(err);
      setStatus('AI 結果 JSON 格式不正確。');
    }
  });
  $('btnAiSelectAll')?.addEventListener('click', () => {
    const allSelected = results.length && results.every(r => r.selected);
    results.forEach(r => r.selected = !allSelected);
    renderResults();
  });
  $('btnAiSaveSelected')?.addEventListener('click', saveSelected);
})();
