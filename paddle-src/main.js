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

async function getEngine() {
  if (engine) return engine;
  $('status').textContent = '正在載入 PaddleOCR 模型…';
  const t0 = performance.now();
  engine = await PaddleOCR.create({
    lang: 'ch',
    ocrVersion: 'PP-OCRv5',
    ortOptions: { backend: 'auto' }
  });
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
    $('status').textContent = '正在辨識文字…';
    const t0 = performance.now();
    const [result] = await ocr.predict(selectedFile, {
      textDetLimitSideLen: 1280,
      textRecScoreThresh: 0.35
    });
    const elapsed = Math.round(performance.now() - t0);
    const items = result?.items || [];
    const text = items.map(x => x.text).filter(Boolean).join('\n');
    const avg = items.length ? Math.round(items.reduce((n,x)=>n+(Number(x.score)||0),0)/items.length*100) : 0;
    $('ocrMs').textContent = elapsed + ' ms';
    $('boxes').textContent = String(items.length);
    $('score').textContent = avg + '%';
    $('text').textContent = text || '（沒有辨識到文字）';
    const metrics = result?.metrics || {};
    const runtime = result?.runtime || {};
    $('runtime').textContent = 'SDK metrics：det ' + Math.round(metrics.detMs||0) + ' ms · rec ' + Math.round(metrics.recMs||0) + ' ms · total ' + Math.round(metrics.totalMs||0) + ' ms · backend ' + (runtime.provider || runtime.backend || 'unknown');
    $('status').textContent = '完成';
  } catch (err) {
    console.error(err);
    $('status').textContent = '測試失敗';
    $('text').textContent = '—';
    $('error').textContent = (err?.message || String(err)) + '\n' + (err?.stack || '');
  } finally {
    $('run').disabled = !selectedFile;
  }
});
