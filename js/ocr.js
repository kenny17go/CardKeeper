/* =========================================================
   ocr.js — CardKeeper OCR v3 (v5.1)
   Adaptive multi-pass OCR + contact-aware result merge.
   ========================================================= */
const CardOCR = (() => {
  let worker = null;
  let workerReady = null;
  let workerGeneration = 0;

  async function getWorker(onProgress) {
    if (worker) return worker;
    if (!workerReady) {
      const myGeneration = workerGeneration;
      workerReady = (async () => {
        const w = await Tesseract.createWorker(['chi_tra', 'eng'], 1, {
          logger: (m) => onProgress && m.status && onProgress(m)
        });
        try {
          await w.setParameters({
            tessedit_pageseg_mode: '11',
            preserve_interword_spaces: '1',
            user_defined_dpi: '300'
          });
          if (myGeneration !== workerGeneration) {
            try { await w.terminate(); } catch (_) {}
            throw new DOMException('OCR worker superseded by reset', 'AbortError');
          }
          worker = w;
          return w;
        } catch (err) {
          if (worker !== w) {
            try { await w.terminate(); } catch (_) {}
          }
          throw err;
        }
      })();
    }
    const ready = workerReady;
    try {
      return await ready;
    } finally {
      if (workerReady === ready) workerReady = null;
    }
  }

  async function reset() {
    workerGeneration++;
    const w = worker;
    const pending = workerReady;
    worker = null;
    workerReady = null;

    if (w) {
      try { await w.terminate(); } catch (_) {}
    }
    if (pending) {
      try {
        const pendingWorker = await pending;
        if (pendingWorker && pendingWorker !== w) {
          try { await pendingWorker.terminate(); } catch (_) {}
        }
      } catch (_) {}
    }
  }

  function loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  function cleanupOcrText(text) {
    return (text || '')
      .replace(/\u3000/g, ' ')
      .replace(/[＠﹫]/g, '@')
      .replace(/[：﹕]/g, ':')
      .replace(/[，]/g, ',')
      .replace(/[；]/g, ';')
      .replace(/[．]/g, '.')
      .replace(/[–—−]/g, '-')
      .replace(/[｜¦]/g, '|')
      .replace(/[ \t]+/g, ' ')
      .replace(/ *\n */g, '\n')
      .trim();
  }

  async function makeVariants(dataUrl) {
    const img = await loadImage(dataUrl);
    const minTarget = 1800;
    const maxTarget = 2400;
    const upscaled = Math.min(img.naturalWidth * 2, Math.max(minTarget, img.naturalWidth));
    const targetW = Math.max(1, Math.min(maxTarget, Math.round(upscaled)));
    const scale = targetW / img.naturalWidth;
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));

    const drawVariant = (filter, quality = 0.94) => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.filter = filter;
      ctx.drawImage(img, 0, 0, w, h);
      ctx.filter = 'none';
      return canvas.toDataURL('image/jpeg', quality);
    };

    return [
      { id: 'balanced', psm: '11', image: drawVariant('grayscale(1) contrast(1.38) brightness(1.05)') },
      { id: 'color', psm: '11', image: drawVariant('contrast(1.14) saturate(.88) brightness(1.04)') },
      { id: 'dense', psm: '6', image: drawVariant('grayscale(1) contrast(1.72) brightness(1.08)') }
    ];
  }

  function contactSignals(text) {
    const t = text || '';
    let n = 0;
    if (/[\w.%+-]+\s*@\s*[\w.-]+/i.test(t)) n++;
    if (/(?:\+?886[\s-]?)?0?9\d{2}[\s-]?\d{3}[\s-]?\d{3}/.test(t)) n++;
    if (/(?:tel|phone|mobile|fax|電話|手機|傳真)/i.test(t)) n++;
    if (/(?:www\.|https?:\/\/|\.(?:com|tw|net|org|io|co)\b)/i.test(t)) n++;
    return n;
  }

  function textQuality(text) {
    const t = cleanupOcrText(text);
    if (!t) return 0;
    const chars = t.replace(/\s/g, '').length;
    const useful = (t.match(/[A-Za-z0-9\u3400-\u9fff@.+()\-]/g) || []).length;
    const replacementPenalty = (t.match(/[�]/g) || []).length * 12;
    const signalBonus = contactSignals(t) * 14;
    return chars * 0.34 + useful * 0.52 + signalBonus - replacementPenalty;
  }

  function normalizedLines(text) {
    return cleanupOcrText(text)
      .split(/\r?\n/)
      .map(s => s.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
  }

  function lineKey(line) {
    return line.toLowerCase()
      .replace(/[oＯ]/g, '0')
      .replace(/[^a-z0-9\u3400-\u9fff@]/g, '');
  }

  function mergeTexts(results) {
    const ordered = [...results].sort((a, b) => b.score - a.score);
    const lines = [];
    const seen = new Set();

    for (const r of ordered) {
      for (const line of normalizedLines(r.text)) {
        const key = lineKey(line);
        if (key.length < 2 || seen.has(key)) continue;
        seen.add(key);
        lines.push(line);
      }
    }
    return lines.join('\n');
  }

  function canStop(results, passIndex) {
    const ranked = [...results].sort((a, b) => b.score - a.score);
    const best = ranked[0];
    if (!best) return false;
    if (passIndex === 0) {
      return best.confidence >= 91 && textQuality(best.text) >= 85 && contactSignals(best.text) >= 1;
    }
    if (passIndex === 1) {
      return best.confidence >= 87 && textQuality(best.text) >= 72 && contactSignals(best.text) >= 2;
    }
    return false;
  }

  async function recognize(image, onProgress) {
    const w = await getWorker(onProgress);
    const variants = typeof image === 'string'
      ? await makeVariants(image)
      : [{ id: 'input', psm: '11', image }];

    const results = [];
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      onProgress && onProgress({
        status: 'ocr-pass',
        pass: i + 1,
        total: variants.length,
        progress: i / variants.length
      });

      await w.setParameters({ tessedit_pageseg_mode: v.psm || '11' });
      const { data } = await w.recognize(v.image);
      const text = cleanupOcrText(data.text || '');
      const confidence = Number.isFinite(data.confidence) ? Math.round(data.confidence) : 0;
      const score = textQuality(text) + confidence * 0.72;
      results.push({ text, confidence, score, variant: v.id });

      if (canStop(results, i)) break;
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

  return { recognize, makeVariants, reset, cleanupOcrText };
})();
