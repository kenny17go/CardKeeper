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
  let batchSource = '';
  let reviewFilter = 'all';

  const uid = () => 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  const norm = v => String(v || '').toLowerCase().replace(/[\s()\-+.]/g, '');
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

  async function fileToDataUrl(file, maxSide = 1400, quality = .82) {
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
        dataUrl,
        originalBytes: file.size || 0
      });
    }
    setStatus('');
    renderPhotos();
  }

  function renderPhotos() {
    const grid = $('aiBatchPreviewGrid');
    const totalMB = photos.reduce((sum,p) => sum + Math.round((p.dataUrl?.length || 0) * .75), 0) / 1024 / 1024;
    $('aiBatchCount').textContent = photos.length + ' 張 · ' + totalMB.toFixed(1) + ' MB';
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
    const fieldConfidence = item.fieldConfidence || {};
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
      department: item.department || '',
      extension: item.extension || '',
      taxId: item.taxId || '',
      companyAddress: item.companyAddress || '',
      postalCode: item.postalCode || '',
      country: item.country || '',
      category: item.category || '未分類',
      note: item.note || '',
      rawText: item.rawText || '',
      fieldConfidence,
      duplicateStatus: item.duplicateStatus || '',
      previousId: item.previousId || ''
    };
  }

  function confidenceBadge(r, key, value) {
    if (!value) return '';
    const score = Number(r.fieldConfidence?.[key]);
    if (!Number.isFinite(score)) return '';
    if (score >= 85) return '<span class="ai-field-ok">✓</span>';
    if (score >= 65) return '<span class="ai-field-mid">請確認</span>';
    return '<span class="ai-field-low">低信心</span>';
  }

  function compareWithExisting() {
    const existing = window.CardKeeperBatch?.cards || [];
    for (const r of results) {
      r.duplicateStatus = r.duplicateStatus || '';
      r.previousId = r.previousId || '';
      const email = norm(r.email), mobile = norm(r.mobile), name = norm(r.name), company = norm(r.company);
      let match = existing.find(c => email && norm(c.email) === email)
        || existing.find(c => mobile && norm(c.mobile) === mobile)
        || existing.find(c => name && company && norm(c.name) === name && norm(c.company) === company);
      if (!match) continue;
      r.previousId = match.id;
      const changes = [];
      if (r.title && match.title && norm(r.title) !== norm(match.title)) changes.push(`職稱：${match.title} → ${r.title}`);
      if (r.phone && match.phone && norm(r.phone) !== norm(match.phone)) changes.push('公司電話不同');
      if (r.email && match.email && norm(r.email) !== norm(match.email)) changes.push('Email 不同');
      if (changes.length) r.duplicateStatus = '已有名片，可能是更新版 · ' + changes.join('、');
      else r.duplicateStatus = '疑似既有名片，請確認是否重複';
    }
  }

  function renderBatchSummary() {
    let summary = $('aiBatchSummary');
    if (!summary) {
      summary = document.createElement('div');
      summary.id = 'aiBatchSummary';
      summary.className = 'ai-batch-summary';
      $('aiBatchResults')?.insertAdjacentElement('afterbegin', summary);
    }
    if (!results.length) { summary.innerHTML = ''; return; }
    const companies = new Map();
    for (const r of results) {
      const key = (r.company || '未辨識公司').trim();
      companies.set(key, (companies.get(key) || 0) + 1);
    }
    const duplicateCount = results.filter(r => r.duplicateStatus).length;
    const lowCount = results.filter(r => {
      const vals = Object.values(r.fieldConfidence || {}).map(Number).filter(Number.isFinite);
      return (r.confidence && r.confidence < 70) || vals.some(v => v < 65);
    }).length;
    const companyText = [...companies.entries()]
      .sort((a,b)=>b[1]-a[1])
      .slice(0,4)
      .map(([name,count]) => `<span>${esc(name)} · ${count}</span>`).join('');
    summary.innerHTML = `
      <div class="ai-summary-metrics">
        <div><strong>${results.length}</strong><span>辨識名片</span></div>
        <div><strong>${companies.size}</strong><span>公司</span></div>
        <div><strong>${duplicateCount}</strong><span>疑似重複/更新</span></div>
        <div><strong>${lowCount}</strong><span>需確認</span></div>
      </div>
      <div class="ai-company-chips">${companyText}</div>`;
  }

  function needsReview(r) {
    const vals = Object.values(r.fieldConfidence || {}).map(Number).filter(Number.isFinite);
    return !r.reviewed && (
      !!r.duplicateStatus ||
      (r.confidence && r.confidence < 70) ||
      vals.some(v => v < 65)
    );
  }

  function resultPassesFilter(r) {
    if (reviewFilter === 'review') return needsReview(r);
    if (reviewFilter === 'duplicate') return !!r.duplicateStatus;
    if (reviewFilter === 'confirmed') return !!r.reviewed;
    return true;
  }

  function groupedResults() {
    const groups = new Map();
    results.forEach((r, i) => {
      if (!resultPassesFilter(r)) return;
      const key = (r.company || '未辨識公司').trim();
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({r, i});
    });
    return [...groups.entries()].sort((a,b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'zh-Hant'));
  }

  function editResult(index) {
    const r = results[index];
    if (!r) return;
    const fields = [
      ['name','姓名'],['nameEn','英文姓名'],['company','公司'],['taxId','公司統編'],
      ['department','部門'],['title','職稱'],['mobile','手機'],['phone','公司電話'],
      ['phone2','第二電話'],['extension','分機'],['fax','傳真'],['email','Email'],
      ['website','網址'],['address','地址'],['postalCode','郵遞區號'],['country','國家/地區'],
      ['category','分類'],['note','備註']
    ];
    const overlay = document.createElement('div');
    overlay.className = 'ai-edit-overlay';
    overlay.innerHTML = `<div class="ai-edit-sheet">
      <div class="ai-edit-head"><strong>確認名片資料</strong><button type="button" class="ai-edit-close">×</button></div>
      <div class="ai-edit-fields">${fields.map(([key,label]) => `
        <label><span>${label}${confidenceBadge(r,key,r[key])}</span>
        ${key === 'note' ? `<textarea data-key="${key}" rows="3">${esc(r[key])}</textarea>` : `<input data-key="${key}" value="${esc(r[key])}">`}</label>`).join('')}
      </div>
      <button type="button" class="ai-edit-save">完成確認</button>
    </div>`;
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('.ai-edit-close').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    overlay.querySelector('.ai-edit-save').addEventListener('click', () => {
      overlay.querySelectorAll('[data-key]').forEach(input => r[input.dataset.key] = input.value.trim());
      r.reviewed = true;
      close();
      renderResults();
    });
  }

  function renderResults() {
    const box = $('aiBatchResults');
    box.classList.toggle('hidden', results.length === 0);
    $('aiBatchResultCount').textContent = results.length;
    compareWithExisting();
    renderBatchSummary();
    const counts = {
      all: results.length,
      review: results.filter(needsReview).length,
      duplicate: results.filter(r => r.duplicateStatus).length,
      confirmed: results.filter(r => r.reviewed).length
    };
    let filters = $('aiBatchFilters');
    if (!filters) {
      filters = document.createElement('div');
      filters.id = 'aiBatchFilters';
      filters.className = 'ai-batch-filters';
      $('aiBatchResultList').insertAdjacentElement('beforebegin', filters);
    }
    filters.innerHTML = [
      ['all','全部'],['review','需確認'],['duplicate','重複/更新'],['confirmed','已確認']
    ].map(([key,label]) => `<button type="button" data-filter="${key}" class="${reviewFilter===key?'active':''}">${label}<span>${counts[key]}</span></button>`).join('');
    filters.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
      reviewFilter = btn.dataset.filter;
      renderResults();
    }));

    $('aiBatchResultList').innerHTML = groupedResults().map(([company, items]) => `
      <section class="ai-company-group">
        <div class="ai-company-head"><strong>${esc(company)}</strong><span>${items.length} 張</span></div>
        ${items.map(({r, i}) => {
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
                <button type="button" class="ai-result-edit">${r.reviewed ? '✓ 已確認' : '檢查 / 修改'}</button>
              </div>
            </div>
            <div class="ai-result-grid">
              <div>📱 ${esc(r.mobile || '—')} ${confidenceBadge(r,'mobile',r.mobile)}</div>
              <div>☎️ ${esc(r.phone || '—')} ${confidenceBadge(r,'phone',r.phone)}</div>
              <div>✉️ ${esc(r.email || '—')} ${confidenceBadge(r,'email',r.email)}</div>
              <div>🏷️ ${esc(r.category || '未分類')}</div>
              <div>🏢 ${esc(r.department || '—')} ${confidenceBadge(r,'department',r.department)}</div>
              <div>分機 ${esc(r.extension || '—')} ${confidenceBadge(r,'extension',r.extension)}</div>
              <div>統編 ${esc(r.taxId || '—')} ${confidenceBadge(r,'taxId',r.taxId)}</div>
              <div>🌐 ${esc(r.website || '—')} ${confidenceBadge(r,'website',r.website)}</div>
              <div>📍 ${esc(r.address || r.companyAddress || '—')} ${confidenceBadge(r,'address',r.address || r.companyAddress)}</div>
            </div>
            ${r.duplicateStatus ? `<div class="ai-duplicate-note">${esc(r.duplicateStatus)}</div>` : ''}
          </article>`;
        }).join('')}
      </section>`).join('');
    if (!$('aiBatchResultList').innerHTML) {
      $('aiBatchResultList').innerHTML = '<p class="ai-filter-empty">這個分類目前沒有名片。</p>';
    }

    $('aiBatchResultList').querySelectorAll('.ai-result-card').forEach(card => {
      const i = Number(card.dataset.i);
      card.querySelector('.ai-result-select').addEventListener('change', e => {
        results[i].selected = e.target.checked;
      });
      card.querySelector('.ai-result-edit')?.addEventListener('click', () => editResult(i));
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
          department:r.department, extension:r.extension, taxId:r.taxId,
          companyAddress:r.companyAddress, postalCode:r.postalCode, country:r.country,
          category:r.category || '未分類', note:[batchSource ? '來源：' + batchSource : '', r.note || ''].filter(Boolean).join(' · '),
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
  const sourceInput = document.createElement('input');
  sourceInput.id = 'aiBatchSource';
  sourceInput.className = 'ai-batch-source';
  sourceInput.placeholder = '這批名片來源，例如：2026 金融論壇';
  sourceInput.addEventListener('input', e => batchSource = e.target.value.trim());
  document.querySelector('.ai-batch-intro')?.insertAdjacentElement('afterend', sourceInput);
  $('btnAiBatchBack')?.addEventListener('click', () => { close(); location.reload(); });
  $('aiBatchCameraInput')?.addEventListener('change', async e => {
    await addFiles(e.target.files); e.target.value = '';
  });
  $('aiBatchFiles')?.addEventListener('change', async e => {
    await addFiles(e.target.files); e.target.value = '';
  });
  function mockAiCard(photoIndex, cardIndex = 0) {
    const samples = [
      {
        name:'王志明', company:'星辰科技股份有限公司', title:'業務經理',
        mobile:'0912-345-678', phone:'02-2345-6789', email:'ming.wang@example.com',
        department:'企業金融部', extension:'1688', taxId:'12345678', website:'www.example.com', address:'台北市信義區',
        category:'科技', confidence:96,
        fieldConfidence:{name:97,company:99,title:92,mobile:98,phone:93,email:96}
      },
      {
        name:'林怡君', company:'國際商業銀行', title:'副理',
        mobile:'', phone:'02-8765-4321', email:'yj.lin@example.com',
        department:'法人金融處', extension:'1234', taxId:'87654321', website:'www.bank.example', address:'台北市松山區',
        category:'金融', confidence:78,
        fieldConfidence:{name:90,company:96,title:68,phone:84,email:62}
      },
      {
        name:'陳建宏', company:'遠景顧問有限公司', title:'資深顧問',
        mobile:'0988-123-456', phone:'', email:'jason.chen@example.com',
        department:'策略顧問部', extension:'', taxId:'24681357', website:'www.consult.example', address:'台北市中山區',
        category:'顧問', confidence:88,
        fieldConfidence:{name:92,company:91,title:86,mobile:95,email:87}
      }
    ];
    const s = samples[(photoIndex + cardIndex) % samples.length];
    return normalizeResult({
      ...s,
      sourceIndex: photoIndex,
      cropImage: photos[photoIndex]?.dataUrl || '',
      rawText: [s.name, s.company, s.title, s.mobile, s.phone, s.email].filter(Boolean).join('\n'),
      note: '本地模擬 AI 結果',
      selected: true
    }, results.length + cardIndex);
  }

  async function runMockAnalysis() {
    if (!photos.length) return;
    const btn = $('btnAiAnalyze');
    btn.disabled = true;
    results = [];
    $('aiBatchResults').classList.add('hidden');

    try {
      setStatus('步驟 1/4 · 模擬偵測名片位置…');
      await new Promise(r => setTimeout(r, 450));
      setStatus('步驟 2/4 · 模擬切割與拉正…');
      await new Promise(r => setTimeout(r, 450));
      setStatus('步驟 3/4 · 模擬 OCR 與欄位整理…');
      await new Promise(r => setTimeout(r, 550));

      photos.forEach((_, photoIndex) => {
        // 第一張照片故意模擬同一畫面含兩張名片，
        // 其餘照片各一張，方便先驗證多卡流程的 UI。
        const count = photoIndex === 0 ? 2 : 1;
        for (let cardIndex = 0; cardIndex < count; cardIndex++) {
          results.push(mockAiCard(photoIndex, cardIndex));
        }
      });

      compareWithExisting();
      setStatus('步驟 4/4 · 已完成分組、低信心標示與既有名片比對。這是本地模擬，不會產生 AI 費用。');
      renderResults();
    } finally {
      btn.disabled = photos.length === 0;
    }
  }

  $('btnAiAnalyze')?.addEventListener('click', runMockAnalysis);
  $('aiBatchResultFile')?.addEventListener('change', async e => {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data?.schemaVersion === '1.0' && Array.isArray(data.cards)) {
        list = data.cards.map((card, index) => {
          const fields = card.fields || {};
          const crop = card.crop || {};
          for (const key of ['x','y','width','height']) {
            if (crop[key] != null && (Number(crop[key]) < 0 || Number(crop[key]) > 1)) {
              throw new Error('crop-range');
            }
          }
          const confidence = Number(card.confidence || 0);
          if (confidence < 0 || confidence > 100) throw new Error('confidence-range');
          for (const value of Object.values(card.fieldConfidence || {})) {
            const n = Number(value);
            if (n < 0 || n > 100) throw new Error('field-confidence-range');
          }
          return {
            ...fields,
            sourceIndex: Number.isInteger(card.sourceIndex) ? card.sourceIndex : index,
            cropImage: card.cropImage || '',
            confidence,
            fieldConfidence: card.fieldConfidence || {},
            rawText: card.rawText || ''
          };
        });
      } else {
        list = data.cards || data.results || [];
      }
      if (!Array.isArray(list) || !list.length) throw new Error('empty');
      results = list.map(normalizeResult);
      compareWithExisting();
      setStatus('已載入 AI 結果，格式驗證完成，並已自動分組及比對既有名片。');
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
