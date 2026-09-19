import { PaddleOCR } from '@paddleocr/paddleocr-js';

let engine = null;
let engineReady = null;

function timeout(promise, ms, label) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(label + '逾時')), ms);
    })
  ]).finally(() => clearTimeout(timer));
}

async function downscale(dataUrl, maxSide = 720) {
  const blob = await (await fetch(dataUrl)).blob();
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  if (scale === 1) { bitmap.close?.(); return blob; }
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return await new Promise((resolve, reject) =>
    canvas.toBlob(b => b ? resolve(b) : reject(new Error('縮圖失敗')), 'image/jpeg', 0.92)
  );
}

async function getEngine() {
  if (engine) return engine;
  if (!engineReady) {
    engineReady = timeout(PaddleOCR.create({
      lang: 'ch',
      ocrVersion: 'PP-OCRv5',
      worker: true,
      ortOptions: {
        backend: 'wasm',
        wasmPaths: 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/',
        numThreads: 1,
        simd: true
      }
    }), 30000, 'PaddleOCR 模型載入').then(x => (engine = x)).finally(() => { engineReady = null; });
  }
  return engineReady;
}

async function recognize(image, onProgress) {
  onProgress?.({ status: 'paddle-loading', progress: 0 });
  const ocr = await getEngine();
  const input = await timeout(downscale(image, 720), 8000, '影像縮放');
  onProgress?.({ status: 'paddle-recognizing', progress: 0.5 });
  const [result] = await timeout(ocr.predict(input, {
    textDetLimitSideLen: 720,
    textRecScoreThresh: 0.35
  }), 20000, 'PaddleOCR 辨識');
  const items = result?.items || [];
  const text = items.map(x => x.text).filter(Boolean).join('\n');
  const confidence = items.length
    ? Math.round(items.reduce((n, x) => n + (Number(x.score) || 0), 0) / items.length * 100)
    : 0;
  return { text, confidence, engine: 'paddle', boxes: items.length };
}

async function reset() {
  const e = engine;
  engine = null;
  engineReady = null;
  try { await e?.terminate?.(); } catch (_) {}
}

window.CardPaddleOCR = { recognize, reset, preload: getEngine };
