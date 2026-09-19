import { PaddleOCR } from '@paddleocr/paddleocr-js';

const $ = id => document.getElementById(id);
let selectedFile = null;
let engine = null;

$('file').addEventListener('change', e => {
  selectedFile = e.target.files?.[0] || null;
  $('run').disabled = !selectedFile;
  $('error').textContent = '';
  if (selectedFile) {
    $('preview').src = URL.createObjectURL(selectedFile);
    $('preview').style.display = 'block';
    $('status').textContent = '已選擇照片';
    $('text').textContent = '等待辨識…';
  }
});

function timeout(promise, ms, label) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(label + '逾時（' + Math.round(ms/1000) + ' 秒）')), ms);
    })
  ]).finally(() => clearTimeout(timer));
}

async function downscale(file, maxSide = 640) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  if (scale === 1) return file;

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();

  return await new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('縮圖失敗')), 'image/jpeg', 0.92);
  });
}

async function getEngine() {
  if (engine) return engine;
  $('status').textContent = '正在載入 PaddleOCR 模型…';
  const t0 = performance.now();

  engine = await timeout(PaddleOCR.create({
    lang: 'ch',
    ocrVersion: 'PP-OCRv5',
    worker: true,
    ortOptions: {
      backend: 'wasm',
      wasmPaths: 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/',
      numThreads: 1,
      simd: true
    }
  }), 30000, '模型載入');

  $('initMs').textContent = Math.round(performance.now() - t0) + ' ms';
  return engine;
}

$('run').addEventListener('click', async () => {
  if (!selectedFile) return;
  $('run').disabled = true;
  $('error').textContent = '';
  $('ocrMs').textContent = '—';
  $('boxes').textContent = '—';
  $('score').textContent = '—';
  $('text').textContent = '辨識中…';

  try {
    const ocr = await getEngine();

    $('status').textContent = '正在縮小測試影像…';
    const input = await timeout(downscale(selectedFile, 640), 8000, '影像縮放');

    $('status').textContent = '正在辨識文字…';
    const t0 = performance.now();
    const [result] = await timeout(ocr.predict(input, {
      textDetLimitSideLen: 640,
      textRecScoreThresh: 0.35
    }), 20000, 'OCR 辨識');
    const elapsed = Math.round(performance.now() - t0);

    const items = result?.items || [];
    const text = items.map(x => x.text).filter(Boolean).join('\n');
    const avg = items.length
      ? Math.round(items.reduce((n,x)=>n+(Number(x.score)||0),0)/items.length*100)
      : 0;

    $('ocrMs').textContent = elapsed + ' ms';
    $('boxes').textContent = String(items.length);
    $('score').textContent = avg + '%';
    $('text').textContent = text || '（沒有辨識到文字）';

    const metrics = result?.metrics || {};
    const runtime = result?.runtime || {};
    $('runtime').textContent =
      'SDK metrics：det ' + Math.round(metrics.detMs||0) + ' ms · rec ' +
      Math.round(metrics.recMs||0) + ' ms · total ' +
      Math.round(metrics.totalMs||0) + ' ms · backend ' +
      (runtime.provider || runtime.backend || 'unknown');

    $('status').textContent = '完成';
  } catch (err) {
    console.error(err);
    $('status').textContent = '測試失敗';
    $('text').textContent = '—';
    $('error').textContent = (err?.message || String(err)) + '\n' + (err?.stack || '');
    try { await engine?.terminate?.(); } catch (_) {}
    engine = null;
  } finally {
    $('run').disabled = !selectedFile;
  }
});
