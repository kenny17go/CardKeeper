/* =========================================================
   ocr.js — wraps Tesseract.js for zh-Hant + eng recognition
   ========================================================= */
const CardOCR = (() => {
  let worker = null;

  async function getWorker(onProgress) {
    if (worker) return worker;
    // Tesseract.js v5 API
    worker = await Tesseract.createWorker(['chi_tra', 'eng'], 1, {
      logger: (m) => {
        if (onProgress && m.status) onProgress(m);
      }
    });
    return worker;
  }

  /**
   * Run OCR on an image (dataURL, Blob, or HTMLImageElement).
   * Returns raw recognized text.
   */
  async function recognize(image, onProgress) {
    const w = await getWorker(onProgress);
    const { data } = await w.recognize(image);
    return data.text || '';
  }

  return { recognize };
})();
