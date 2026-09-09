/* =========================================================
   camera.js — camera, guided crop, image normalization
   ========================================================= */
const CardCamera = (() => {
  let stream = null;

  async function start(videoEl) {
    stop();
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera API unavailable');
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920 },
        height: { ideal: 1440 }
      },
      audio: false
    });
    const track = stream.getVideoTracks()[0];
    try {
      const caps = track.getCapabilities ? track.getCapabilities() : {};
      const advanced = [];
      if (caps.focusMode && Array.isArray(caps.focusMode) && caps.focusMode.includes('continuous')) {
        advanced.push({ focusMode: 'continuous' });
      }
      // iPhone multi-camera devices can jump into a very tight macro-like field of view.
      // Prefer the natural 1x view when zoom constraints are exposed by the browser.
      if (caps.zoom && Number.isFinite(caps.zoom.min) && Number.isFinite(caps.zoom.max)) {
        const targetZoom = Math.min(caps.zoom.max, Math.max(caps.zoom.min, 1));
        advanced.push({ zoom: targetZoom });
      }
      if (advanced.length) await track.applyConstraints({ advanced });
    } catch (constraintErr) {
      console.warn('Camera fine-tuning skipped:', constraintErr);
    }
    videoEl.srcObject = stream;
    await videoEl.play();
  }

  function stop() {
    if (stream) stream.getTracks().forEach(t => t.stop());
    stream = null;
  }

  function canvasToJpeg(canvas, quality = 0.92) {
    return canvas.toDataURL('image/jpeg', quality);
  }

  // Converts a crop rectangle drawn over an object-fit:cover <video>
  // back to source video pixels, so OCR receives exactly what the user framed.
  function captureGuide(videoEl, canvasEl, guideEl, maxWidth = 1800) {
    const vw = videoEl.videoWidth, vh = videoEl.videoHeight;
    if (!vw || !vh) throw new Error('Camera not ready');

    const vr = videoEl.getBoundingClientRect();
    const gr = guideEl.getBoundingClientRect();
    const coverScale = Math.max(vr.width / vw, vr.height / vh);
    const displayedW = vw * coverScale;
    const displayedH = vh * coverScale;
    const cropLeft = (displayedW - vr.width) / 2;
    const cropTop = (displayedH - vr.height) / 2;

    let sx = (gr.left - vr.left + cropLeft) / coverScale;
    let sy = (gr.top - vr.top + cropTop) / coverScale;
    let sw = gr.width / coverScale;
    let sh = gr.height / coverScale;

    sx = Math.max(0, Math.min(vw - 1, sx));
    sy = Math.max(0, Math.min(vh - 1, sy));
    sw = Math.max(1, Math.min(vw - sx, sw));
    sh = Math.max(1, Math.min(vh - sy, sh));

    const scale = Math.min(1, maxWidth / sw);
    const outW = Math.max(1, Math.round(sw * scale));
    const outH = Math.max(1, Math.round(sh * scale));
    canvasEl.width = outW;
    canvasEl.height = outH;
    canvasEl.getContext('2d', { alpha: false }).drawImage(videoEl, sx, sy, sw, sh, 0, 0, outW, outH);
    return canvasToJpeg(canvasEl);
  }

  // Kept for compatibility / desktop fallback.
  function captureFromVideo(videoEl, canvasEl, maxWidth = 1800) {
    const vw = videoEl.videoWidth, vh = videoEl.videoHeight;
    if (!vw || !vh) throw new Error('Camera not ready');
    const scale = Math.min(1, maxWidth / vw);
    const w = Math.round(vw * scale), h = Math.round(vh * scale);
    canvasEl.width = w; canvasEl.height = h;
    canvasEl.getContext('2d', { alpha: false }).drawImage(videoEl, 0, 0, w, h);
    return canvasToJpeg(canvasEl);
  }

  function fileToDataUrl(file, maxWidth = 2200) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.naturalWidth);
          const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d', { alpha: false });
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvasToJpeg(canvas));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function makeThumbnail(dataUrl, maxWidth = 420) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.naturalWidth);
        const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d', { alpha: false }).drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  return { start, stop, captureGuide, captureFromVideo, fileToDataUrl, makeThumbnail };
})();
