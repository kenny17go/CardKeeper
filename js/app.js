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
  let editingCardId = null;
  let captureMode = 'single';
  let batchSaved = 0;
  let liveEdgeTimer = null;
  let scanningBack = false;
  let pendingDuplicate = null;
  let autoCaptureEnabled = true;
  let liveEdgeBusy = false;
  let stableSince = 0;
  let lastLiveCorners = null;
  let captureInProgress = false;
  let autoCaptureCooldownUntil = 0;

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
  const cardGuide = el('cardGuide');

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
    stopLiveEdges?.();
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
    const weekAgo = Date.now() - 7*86400000;
    if (el('statTotal')) el('statTotal').textContent = allCards.length;
    if (el('statFav')) el('statFav').textContent = allCards.filter(c=>c.favorite).length;
    if (el('statRecent')) el('statRecent').textContent = allCards.filter(c=>(c.createdAt||0)>=weekAgo).length;
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
      list = list.filter(c => [c.name, c.nameEn, c.company, c.title, c.mobile, c.phone, c.phone2, c.fax, c.email, c.address, c.category]
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
      <article class="card-item" data-id="${escapeHtml(c.id)}">
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
  el('btnCloseCamera').addEventListener('click', () => { stopLiveEdges(); CardCamera.stop(); closeAllScreens(); });


  function setCaptureMode(mode) {
    captureMode = mode;
    el('btnModeSingle')?.classList.toggle('active', mode === 'single');
    el('btnModeContinuous')?.classList.toggle('active', mode === 'continuous');
    el('batchCount')?.classList.toggle('hidden', mode !== 'continuous');
    el('btnSaveNext')?.classList.toggle('hidden', mode !== 'continuous');
  }
  el('btnModeSingle')?.addEventListener('click',()=>setCaptureMode('single'));
  el('btnModeContinuous')?.addEventListener('click',()=>setCaptureMode('continuous'));

  function resetAutoCaptureState() {
    stableSince = 0;
    lastLiveCorners = null;
    const p = el('autoCaptureProgress');
    if (p) p.style.setProperty('--progress', '0deg');
  }

  function stopLiveEdges(){
    clearTimeout(liveEdgeTimer);
    liveEdgeTimer = null;
    liveEdgeBusy = false;
    resetAutoCaptureState();
    const c=el('liveEdgeCanvas');
    if(c)c.getContext('2d')?.clearRect(0,0,c.width,c.height);
  }

  function cornerMotion(a, b) {
    if (!a || !b || a.length !== 4 || b.length !== 4) return Infinity;
    return a.reduce((sum, p, i) => sum + Math.hypot(p.x - b[i].x, p.y - b[i].y), 0) / 4;
  }

  function drawLiveCorners(result, progress = 0){
    const c=el('liveEdgeCanvas'),wrap=video.parentElement;if(!c||!wrap)return;
    const r=wrap.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);c.width=Math.round(r.width*dpr);c.height=Math.round(r.height*dpr);c.style.width=r.width+'px';c.style.height=r.height+'px';
    const ctx=c.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,r.width,r.height);if(!result?.corners)return;
    const vw=video.videoWidth,vh=video.videoHeight,scale=Math.max(r.width/vw,r.height/vh),dw=vw*scale,dh=vh*scale,ox=(r.width-dw)/2,oy=(r.height-dh)/2;
    const pts=result.corners.map(p=>({x:ox+p.x*dw,y:oy+p.y*dh}));ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);pts.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();ctx.lineWidth=3;ctx.strokeStyle='rgba(52,199,89,.95)';ctx.stroke();
    pts.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,6,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='rgb(52,199,89)';ctx.stroke();});
    const sharp = Number.isFinite(result.sharpness) ? ` · 清晰 ${result.sharpness}` : '';
    el('guideHint').textContent = progress > 0
      ? `保持不動… ${Math.round(progress*100)}%${sharp}`
      : `已吸附名片四角 · ${result.confidence}%${sharp}`;
  }

  async function shootNow(source = 'manual') {
    if (captureInProgress) return;
    captureInProgress = true;
    autoCaptureCooldownUntil = Date.now() + 1800;
    try {
      stopLiveEdges();
      const dataUrl = CardCamera.captureFromVideo(video, captureCanvas);
      CardCamera.stop();
      await handleCapturedImage(dataUrl);
    } catch (err) {
      console.error(err);
      captureInProgress = false;
      showToast(source === 'auto' ? '自動拍攝失敗，可直接按快門重試' : '拍照失敗，請再試一次');
      if (!screenCamera.classList.contains('hidden')) startLiveEdges();
      return;
    }
    captureInProgress = false;
  }

  function startLiveEdges(){
    stopLiveEdges();
    const loop = async () => {
      if (screenCamera.classList.contains('hidden') || !liveEdgeTimer) return;
      if (liveEdgeBusy || captureInProgress) {
        liveEdgeTimer=setTimeout(loop, 220);
        return;
      }
      liveEdgeBusy = true;
      try {
        const r=await CardVision.detectVideoFrame(video);
        if(r){
          const motion = cornerMotion(r.corners, lastLiveCorners);
          const clearEnough = (r.sharpness ?? 0) >= 24;
          const confident = r.confidence >= 40;
          const steady = motion < 0.018;
          const qualifies = autoCaptureEnabled && clearEnough && confident && steady && Date.now() >= autoCaptureCooldownUntil;
          if (qualifies) {
            if (!stableSince) stableSince = Date.now();
            const progress = Math.min(1, (Date.now() - stableSince) / 900);
            drawLiveCorners(r, progress);
            const p=el('autoCaptureProgress'); if(p)p.style.setProperty('--progress', `${Math.round(progress*360)}deg`);
            if (progress >= 1) {
              stableSince = 0;
              lastLiveCorners = null;
              await shootNow('auto');
              return;
            }
          } else {
            stableSince = 0;
            const p=el('autoCaptureProgress'); if(p)p.style.setProperty('--progress','0deg');
            drawLiveCorners(r, 0);
            if (autoCaptureEnabled && (!clearEnough || !steady)) {
              el('guideHint').textContent = !clearEnough ? '已找到名片，請保持清晰' : '已找到名片，請保持不動';
            }
          }
          lastLiveCorners = r.corners;
        } else {
          resetAutoCaptureState();
          const c=el('liveEdgeCanvas');c?.getContext('2d')?.clearRect(0,0,c.width,c.height);
          el('guideHint').textContent='找不到四角也可直接拍照，或從相簿選取';
        }
      }catch(err){
        console.warn('Live edge detection skipped:', err);
        resetAutoCaptureState();
        el('guideHint').textContent='自動找邊暫不可用，可直接拍照或選相簿';
      }finally{
        liveEdgeBusy=false;
      }
      // Deliberately relaxed cadence: keeps Safari controls responsive.
      if (!screenCamera.classList.contains('hidden')) liveEdgeTimer=setTimeout(loop, 620);
    };
    liveEdgeTimer=setTimeout(loop, 180);
  }

  async function openCamera() {
    editingCardId = null;
    showScreen(screenCamera);
    el('guideHint').textContent='相機準備中…';
    try {
      await CardCamera.start(video);
      el('guideHint').textContent='找不到四角也可直接拍照';
      startLiveEdges();
    } catch (err) {
      stopLiveEdges();
      showToast('無法開啟相機，請改用相簿選取');
      el('guideHint').textContent='相機無法啟用，請點右下角「相簿」';
      console.error(err);
    }
  }

  el('btnShoot').addEventListener('click', () => shootNow('manual'));

  el('btnAutoCapture')?.addEventListener('click', () => {
    autoCaptureEnabled = !autoCaptureEnabled;
    const b=el('btnAutoCapture');
    b.classList.toggle('active', autoCaptureEnabled);
    b.setAttribute('aria-pressed', String(autoCaptureEnabled));
    b.textContent = `自動拍攝：${autoCaptureEnabled ? '開' : '關'}`;
    resetAutoCaptureState();
    showToast(autoCaptureEnabled ? '自動拍攝已開啟' : '自動拍攝已關閉');
  });

  el('btnPickPhoto')?.addEventListener('click', () => {
    stopLiveEdges();
    // Explicit click is more reliable than a <label for=file> in iOS standalone PWA.
    el('fileInput').click();
  });

  el('fileInput').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) {
      if (!screenCamera.classList.contains('hidden') && video.srcObject) startLiveEdges();
      return;
    }
    try {
      stopLiveEdges();
      CardCamera.stop();
      const dataUrl = await CardCamera.fileToDataUrl(file);
      await handleCapturedImage(dataUrl);
    } catch (err) {
      console.error(err);
      showToast('無法讀取照片，請改選另一張圖片');
      if (!screenCamera.classList.contains('hidden')) openCamera();
    }
  });

  function setProcessingStep(step) {
    const order = ['edge','warp','ocr','parse'];
    const active = Math.max(0, order.indexOf(step));
    el('processingSteps')?.querySelectorAll('span').forEach((node, i) => {
      node.classList.toggle('done', i < active);
      node.classList.toggle('active', i === active);
    });
  }

  async function handleCapturedImage(imageDataUrl) {
    showScreen(screenProcessing);
    el('processingPreview').src = imageDataUrl;
    el('processingLabel').textContent = '正在偵測名片邊界…';
    el('processingSub').textContent = '自動找四角並校正透視';
    setProcessingStep('edge');

    let workingImage = imageDataUrl;
    let visionMeta = { detected: false, confidence: 0 };
    try {
      visionMeta = await CardVision.detectAndCorrect(imageDataUrl, (status) => {
        el('processingLabel').textContent = status;
        if (status.includes('校正')) setProcessingStep('warp');
      });
      if (visionMeta.detected) {
        workingImage = visionMeta.imageDataUrl;
        el('processingPreview').src = workingImage;
        el('processingSub').textContent = `已找到名片邊界（信心 ${visionMeta.confidence}%）`;
      } else {
        el('processingSub').textContent = '未找到可靠四角，改用原始裁切影像';
      }
    } catch (visionErr) {
      console.warn('Vision fallback:', visionErr);
      el('processingSub').textContent = '自動找邊未完成，改用原始裁切影像';
    }

    if (scanningBack) {
      scanningBack = false;
      const thumb = await CardCamera.makeThumbnail(workingImage);
      pendingCapture = pendingCapture || { parsed: CardParse.parse(''), rawText:'', imageDataUrl:'', thumb:'' };
      pendingCapture.backPhoto = workingImage; pendingCapture.backThumb = thumb;
      openConfirmScreen(pendingCapture.parsed || {}, pendingCapture.imageDataUrl, pendingCapture.rawText || '', pendingCapture.ocrMeta?.confidence ?? null, pendingCapture.visionMeta);
      showToast('已加入名片背面');
      return;
    }

    try {
      setProcessingStep('ocr');
      el('processingLabel').textContent = '正在進行第二代 OCR…';
      const ocrResult = await CardOCR.recognize(workingImage, (m) => {
        if (m.status === 'ocr-pass') {
          el('processingLabel').textContent = `OCR 第 ${m.pass}/${m.total} 輪…`;
          el('processingSub').textContent = '比對不同影像強化策略';
        } else if (m.status === 'recognizing text') {
          el('processingLabel').textContent = `辨識文字… ${Math.round((m.progress || 0) * 100)}%`;
        }
      });

      setProcessingStep('parse');
      el('processingLabel').textContent = '正在整理姓名與聯絡欄位…';
      el('processingSub').textContent = `完成 ${ocrResult.passes} 輪 OCR，自動選擇最佳結果`;
      const rawText = ocrResult.text;
      const parsed = CardParse.parse(rawText);
      const thumb = await CardCamera.makeThumbnail(workingImage);
      pendingCapture = { imageDataUrl: workingImage, originalImageDataUrl: imageDataUrl, thumb, rawText, parsed, visionMeta, ocrMeta: ocrResult };
      openConfirmScreen(parsed, workingImage, rawText, ocrResult.confidence, visionMeta);
    } catch (err) {
      console.error(err);
      showToast('OCR 辨識失敗，請手動輸入');
      const parsed = CardParse.parse('');
      const thumb = await CardCamera.makeThumbnail(workingImage);
      pendingCapture = { imageDataUrl: workingImage, originalImageDataUrl: imageDataUrl, thumb, rawText: '', parsed, visionMeta };
      openConfirmScreen(parsed, workingImage, '', null, visionMeta);
    }
  }

  // ===================================================
  // Confirm / edit screen
  // ===================================================
  const cardForm = el('cardForm');

  function openConfirmScreen(parsed, imageDataUrl, rawText, confidence = null, visionMeta = null) {
    cardForm.reset();
    for (const key of ['name','nameEn','company','title','mobile','phone','phone2','fax','email','website','address','category','note']) {
      if (cardForm.elements[key]) cardForm.elements[key].value = parsed[key] || '';
    }
    cardForm.elements.favorite.checked = !!parsed.favorite;
    el('confirmThumb').src = imageDataUrl || '';
    const back = pendingCapture?.backPhoto || parsed.backPhoto || '';
    el('backPreviewRow')?.classList.toggle('hidden', !back); if(back) el('confirmBackThumb').src=back;
    el('rawOcrText').textContent = rawText || '（無文字）';
    const q = el('ocrQuality');
    if (q) {
      if (confidence === null) q.textContent = '辨識品質：已儲存資料';
      else {
        const label = confidence >= 80 ? '佳' : confidence >= 60 ? '普通，建議確認' : '偏低，建議手動校正';
        q.textContent = `辨識品質：${label}（OCR ${confidence}%${visionMeta?.detected ? ` · 找邊 ${visionMeta.confidence}%` : ' · 手動框裁切'}）`;
        q.dataset.level = confidence >= 80 ? 'good' : confidence >= 60 ? 'mid' : 'low';
      }
    }
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
      phone2: (fd.get('phone2') || '').trim(),
      fax: (fd.get('fax') || '').trim(),
      email: (fd.get('email') || '').trim(),
      website: (fd.get('website') || '').trim(),
      address: (fd.get('address') || '').trim(),
      category: (fd.get('category') || '').trim() || '未分類',
      note: (fd.get('note') || '').trim(),
      favorite: fd.get('favorite') === 'on',
      rawText: pendingCapture ? pendingCapture.rawText : (editingCardId ? (await CardDB.get(editingCardId))?.rawText : ''),
      photo: pendingCapture ? pendingCapture.imageDataUrl : (editingCardId ? (await CardDB.get(editingCardId))?.photo : ''),
      thumb: pendingCapture ? pendingCapture.thumb : (editingCardId ? (await CardDB.get(editingCardId))?.thumb : ''),
      backPhoto: pendingCapture?.backPhoto || (editingCardId ? (await CardDB.get(editingCardId))?.backPhoto : ''),
      backThumb: pendingCapture?.backThumb || (editingCardId ? (await CardDB.get(editingCardId))?.backThumb : ''),
      createdAt: editingCardId ? (await CardDB.get(editingCardId))?.createdAt || now : now,
      updatedAt: now
    };

    if (!card.name && !card.nameEn && !card.company) {
      showToast('請至少輸入姓名或公司');
      return;
    }

    if (!editingCardId) {
      const dup = findDuplicate(card);
      if (dup) { showDuplicateSheet(card, dup); return; }
    }
    await persistCard(card, false);
  });


  function norm(v){return (v||'').toLowerCase().replace(/[\s()\-+.]/g,'');}
  function findDuplicate(card){
    let best=null,bestScore=0,reasons=[];
    for(const c of allCards){let score=0,rs=[];if(card.email&&c.email&&norm(card.email)===norm(c.email)){score+=70;rs.push('Email 相同');}if(card.mobile&&c.mobile&&norm(card.mobile)===norm(c.mobile)){score+=65;rs.push('手機相同');}if(card.name&&c.name&&norm(card.name)===norm(c.name)){score+=25;rs.push('姓名相同');}if(card.company&&c.company&&norm(card.company)===norm(c.company)){score+=20;rs.push('公司相同');}if(score>bestScore){bestScore=score;best=c;reasons=rs;}}
    return bestScore>=55?{card:best,score:Math.min(100,bestScore),reasons}:null;
  }
  function mergedValue(oldVal,newVal){return oldVal||newVal||'';}
  function mergeCards(oldCard,newCard){
    const merged={...oldCard};['name','nameEn','company','title','mobile','phone','phone2','fax','email','website','address','category','note'].forEach(k=>merged[k]=mergedValue(oldCard[k],newCard[k]));
    if(!merged.phone2 && newCard.phone && norm(newCard.phone)!==norm(merged.phone))merged.phone2=newCard.phone;
    merged.photo=newCard.photo||oldCard.photo; merged.thumb=newCard.thumb||oldCard.thumb; merged.backPhoto=newCard.backPhoto||oldCard.backPhoto; merged.backThumb=newCard.backThumb||oldCard.backThumb; merged.rawText=[oldCard.rawText,newCard.rawText].filter(Boolean).join('\n--- rescanned ---\n'); merged.updatedAt=Date.now(); return merged;
  }
  function showDuplicateSheet(newCard,dup){pendingDuplicate={newCard,dup};el('duplicateReason').textContent=`相似度 ${dup.score}% · ${dup.reasons.join('、')}`;el('duplicateCompare').innerHTML=`<div><strong>${escapeHtml(dup.card.name||dup.card.company||'既有名片')}</strong><span>既有</span></div><div><strong>${escapeHtml(newCard.name||newCard.company||'新掃描')}</strong><span>新掃描</span></div>`;el('duplicateSheet').classList.remove('hidden');}
  el('btnCancelDuplicate')?.addEventListener('click',()=>{pendingDuplicate=null;el('duplicateSheet').classList.add('hidden')});
  el('btnKeepDuplicate')?.addEventListener('click',async()=>{const x=pendingDuplicate;if(!x)return;el('duplicateSheet').classList.add('hidden');pendingDuplicate=null;await persistCard(x.newCard,false);});
  el('btnMergeDuplicate')?.addEventListener('click',async()=>{const x=pendingDuplicate;if(!x)return;const merged=mergeCards(x.dup.card,x.newCard);el('duplicateSheet').classList.add('hidden');pendingDuplicate=null;await CardDB.put(merged);pendingCapture=null;editingCardId=null;await loadCards();showToast('已智慧合併重複名片');if(captureMode==='continuous'){batchSaved++;el('batchCount').textContent=`${batchSaved} 張`;await openCamera();}else openDetail(merged.id);});

  async function persistCard(card, keepScanning){
    const wasEditing=!!editingCardId; await CardDB.put(card); pendingCapture=null; editingCardId=null; await loadCards();
    if(keepScanning||captureMode==='continuous'){batchSaved++;el('batchCount').textContent=`${batchSaved} 張`;showToast(`已儲存第 ${batchSaved} 張`);await openCamera();return;}
    showToast(wasEditing?'已更新名片':'已儲存名片');openDetail(card.id);
  }
  el('btnSaveNext')?.addEventListener('click',()=>{el('btnSaveCard').click();});

  el('btnScanBack')?.addEventListener('click',async()=>{scanningBack=true;showScreen(screenCamera);try{await CardCamera.start(video);startLiveEdges();el('guideHint').textContent='掃描名片背面';}catch(e){showToast('無法開啟相機');}});
  el('btnRemoveBack')?.addEventListener('click',()=>{if(pendingCapture){pendingCapture.backPhoto='';pendingCapture.backThumb='';}el('backPreviewRow').classList.add('hidden');});

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
    el('detailThumb').dataset.side='front'; el('detailThumb').title=card.backPhoto?'點一下切換正反面':'';
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
      ['☎️ 公司電話', card.phone],
      ['☎️ 其他電話', card.phone2],
      ['📠 傳真', card.fax],
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

  el('detailThumb').addEventListener('click', async()=>{const card=await CardDB.get(currentDetailId);if(!card?.backPhoto)return;const img=el('detailThumb');const back=img.dataset.side!=='back';img.src=back?card.backPhoto:(card.photo||card.thumb||'');img.dataset.side=back?'back':'front';showToast(back?'名片背面':'名片正面');});

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

  el('actContact').addEventListener('click', async () => {
    const card = await CardDB.get(currentDetailId);
    if (!card) return;
    try {
      const mode = await CardVCard.addToContacts(card);
      showToast(mode === 'shared' ? '已開啟聯絡人分享/匯入' : '已建立聯絡人 VCF 檔');
    } catch (err) {
      if (err?.name !== 'AbortError') {
        console.error(err);
        showToast('無法建立聯絡人，請稍後再試');
      }
    }
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
