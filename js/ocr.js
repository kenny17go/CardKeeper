/* =========================================================
   ocr.js — CardKeeper OCR v2
   Multi-pass OCR with adaptive image variants + best-result merge.
   ========================================================= */
const CardOCR = (() => {
  let worker = null;

  async function getWorker(onProgress) {
    if (worker) return worker;
    worker = await Tesseract.createWorker(['chi_tra', 'eng'], 1, {
      logger: (m) => onProgress && m.status && onProgress(m)
    });
    await worker.setParameters({
      tessedit_pageseg_mode: '11',
      preserve_interword_spaces: '1',
      user_defined_dpi: '300'
    });
    return worker;
  }

  function loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = dataUrl;
    });
  }

  async function makeVariants(dataUrl) {
    const img = await loadImage(dataUrl);
    const targetW = Math.min(2400, Math.max(1700, img.naturalWidth));
    const scale = targetW / img.naturalWidth;
    const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);

    const drawVariant = (filter, quality = 0.95) => {
      const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
      ctx.filter = filter; ctx.drawImage(img, 0, 0, w, h); ctx.filter = 'none';
      return canvas.toDataURL('image/jpeg', quality);
    };

    return [
      { id: 'balanced', image: drawVariant('grayscale(1) contrast(1.42) brightness(1.04)') },
      { id: 'high-contrast', image: drawVariant('grayscale(1) contrast(1.82) brightness(1.08)') },
      { id: 'soft', image: drawVariant('grayscale(1) contrast(1.18) brightness(1.12)') }
    ];
  }

  function textQuality(text) {
    const t = (text || '').trim();
    if (!t) return 0;
    const chars = t.replace(/\s/g, '').length;
    const useful = (t.match(/[A-Za-z0-9\u3400-\u9fff@.+()\-]/g) || []).length;
    const replacementPenalty = (t.match(/[�]/g) || []).length * 10;
    const contactBonus = (/@/.test(t) ? 18 : 0) + (/(?:09\d{2}|\+?886)/.test(t) ? 14 : 0) + (/(?:www\.|https?:\/\/)/i.test(t) ? 10 : 0);
    return chars * 0.35 + useful * 0.5 + contactBonus - replacementPenalty;
  }

  function normalizedLines(text) {
    return (text || '').split(/\r?\n/).map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
  }

  function mergeTexts(results) {
    const ordered = [...results].sort((a, b) => b.score - a.score);
    const lines = [];
    const seen = new Set();
    for (const r of ordered) {
      for (const line of normalizedLines(r.text)) {
        const key = line.toLowerCase().replace(/[^a-z0-9\u3400-\u9fff@]/g, '');
        if (key.length < 2 || seen.has(key)) continue;
        seen.add(key); lines.push(line);
      }
    }
    return lines.join('\n');
  }

  async function recognize(image, onProgress) {
    const w = await getWorker(onProgress);
    const variants = typeof image === 'string' ? await makeVariants(image) : [{ id: 'input', image }];
    const results = [];
    for (let i = 0; i < variants.length; i++) {
      onProgress && onProgress({ status: 'ocr-pass', pass: i + 1, total: variants.length, progress: i / variants.length });
      await w.setParameters({ tessedit_pageseg_mode: i === 1 ? '6' : '11' });
      const { data } = await w.recognize(variants[i].image);
      const text = (data.text || '').trim();
      const confidence = Number.isFinite(data.confidence) ? Math.round(data.confidence) : 0;
      const score = textQuality(text) + confidence * 0.7;
      results.push({ text, confidence, score, variant: variants[i].id });
      if (i === 0 && confidence >= 90 && textQuality(text) > 80) break;
    }
    results.sort((a, b) => b.score - a.score);
    const best = results[0] || { text: '', confidence: 0, score: 0, variant: 'none' };
    const merged = mergeTexts(results);
    return {
      text: merged || best.text,
      confidence: best.confidence,
      bestVariant: best.variant,
      passes: results.length,
      alternatives: results
    };
  }

  return { recognize, makeVariants };
})();
