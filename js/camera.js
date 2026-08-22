/* =========================================================
   camera.js — getUserMedia capture + downscale to dataURL
   ========================================================= */
const CardCamera = (() => {
  let stream = null;

  async function start(videoEl) {
    stop();
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1600 } },
      audio: false
    });
    videoEl.srcObject = stream;
    await videoEl.play();
  }

  function stop() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
  }

  function captureFromVideo(videoEl, canvasEl, maxWidth = 1400) {
    const vw = videoEl.videoWidth, vh = videoEl.videoHeight;
    const scale = Math.min(1, maxWidth / vw);
    const w = Math.round(vw * scale), h = Math.round(vh * scale);
    canvasEl.width = w;
    canvasEl.height = h;
    const ctx = canvasEl.getContext('2d');
    ctx.drawImage(videoEl, 0, 0, w, h);
    return canvasEl.toDataURL('image/jpeg', 0.88);
  }

  function fileToDataUrl(file, maxWidth = 1400) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.width);
          const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.88));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function makeThumbnail(dataUrl, maxWidth = 320) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = dataUrl;
    });
  }

  return { start, stop, captureFromVideo, fileToDataUrl, makeThumbnail };
})();
