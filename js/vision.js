/* =========================================================
   vision.js — automatic business-card boundary detection,
   perspective correction, orientation normalization.
   Uses OpenCV.js when available; gracefully falls back.
   ========================================================= */
const CardVision = (() => {
  const CARD_RATIO = 1.75;
  const MIN_AREA_RATIO = 0.18;
  const MAX_AREA_RATIO = 0.98;

  async function getCv(timeoutMs = 9000) {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
      try {
        if (typeof cv !== 'undefined') {
          const ready = cv instanceof Promise ? await cv : cv;
          if (ready && ready.Mat && ready.imread) return ready;
        }
      } catch (_) {}
      await new Promise(r => setTimeout(r, 100));
    }
    return null;
  }

  function loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  function dataUrlFromCanvas(canvas, quality = 0.94) {
    return canvas.toDataURL('image/jpeg', quality);
  }

  function orderPoints(points) {
    const pts = points.map(p => ({ x: p.x, y: p.y }));
    const sums = pts.map(p => p.x + p.y);
    const diffs = pts.map(p => p.x - p.y);
    const tl = pts[sums.indexOf(Math.min(...sums))];
    const br = pts[sums.indexOf(Math.max(...sums))];
    const tr = pts[diffs.indexOf(Math.max(...diffs))];
    const bl = pts[diffs.indexOf(Math.min(...diffs))];
    return [tl, tr, br, bl];
  }

  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  function quadrilateralScore(points, imageArea) {
    const [tl, tr, br, bl] = orderPoints(points);
    const width = (distance(tl, tr) + distance(bl, br)) / 2;
    const height = (distance(tl, bl) + distance(tr, br)) / 2;
    if (!width || !height) return -Infinity;
    const ratio = Math.max(width, height) / Math.min(width, height);
    const ratioScore = Math.max(0, 1 - Math.abs(ratio - CARD_RATIO) / CARD_RATIO);
    const polyArea = Math.abs(
      tl.x * tr.y + tr.x * br.y + br.x * bl.y + bl.x * tl.y -
      tr.x * tl.y - br.x * tr.y - bl.x * br.y - tl.x * bl.y
    ) / 2;
    const areaRatio = polyArea / imageArea;
    if (areaRatio < MIN_AREA_RATIO || areaRatio > MAX_AREA_RATIO) return -Infinity;
    const areaScore = Math.min(1, areaRatio / 0.65);
    return ratioScore * 0.58 + areaScore * 0.42;
  }

  function matPoints(approx) {
    const out = [];
    for (let i = 0; i < approx.rows; i++) {
      out.push({ x: approx.intPtr(i, 0)[0], y: approx.intPtr(i, 0)[1] });
    }
    return out;
  }

  async function detectAndCorrect(dataUrl, onStatus) {
    const img = await loadImage(dataUrl);
    const cvx = await getCv();
    if (!cvx) {
      return { imageDataUrl: dataUrl, detected: false, reason: 'OpenCV unavailable', confidence: 0 };
    }

    const maxDetectW = 1600;
    const scale = Math.min(1, maxDetectW / img.naturalWidth);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext('2d', { alpha: false }).drawImage(img, 0, 0, canvas.width, canvas.height);

    let src, gray, blur, edges, contours, hierarchy;
    const candidates = [];
    try {
      onStatus && onStatus('正在偵測名片四邊…');
      src = cvx.imread(canvas);
      gray = new cvx.Mat(); blur = new cvx.Mat(); edges = new cvx.Mat();
      contours = new cvx.MatVector(); hierarchy = new cvx.Mat();
      cvx.cvtColor(src, gray, cvx.COLOR_RGBA2GRAY, 0);
      cvx.GaussianBlur(gray, blur, new cvx.Size(5, 5), 0, 0, cvx.BORDER_DEFAULT);
      cvx.Canny(blur, edges, 60, 160, 3, false);
      const kernel = cvx.Mat.ones(3, 3, cvx.CV_8U);
      cvx.dilate(edges, edges, kernel, new cvx.Point(-1, -1), 1);
      kernel.delete();
      cvx.findContours(edges, contours, hierarchy, cvx.RETR_LIST, cvx.CHAIN_APPROX_SIMPLE);

      const imageArea = src.cols * src.rows;
      for (let i = 0; i < contours.size(); i++) {
        const cnt = contours.get(i);
        const peri = cvx.arcLength(cnt, true);
        const approx = new cvx.Mat();
        cvx.approxPolyDP(cnt, approx, 0.02 * peri, true);
        if (approx.rows === 4 && cvx.isContourConvex(approx)) {
          const pts = matPoints(approx);
          const score = quadrilateralScore(pts, imageArea);
          if (Number.isFinite(score)) candidates.push({ pts, score });
        }
        approx.delete(); cnt.delete();
      }
      candidates.sort((a, b) => b.score - a.score);
      if (!candidates.length || candidates[0].score < 0.36) {
        return { imageDataUrl: dataUrl, detected: false, reason: 'No reliable quadrilateral', confidence: 0 };
      }

      const best = candidates[0];
      const ordered = orderPoints(best.pts);
      const originalPts = ordered.map(p => ({ x: p.x / scale, y: p.y / scale }));
      const [tl, tr, br, bl] = originalPts;
      let outW = Math.round(Math.max(distance(tl, tr), distance(bl, br)));
      let outH = Math.round(Math.max(distance(tl, bl), distance(tr, br)));
      if (outH > outW) { const t = outW; outW = outH; outH = t; }
      const maxOutW = 2200;
      const outScale = Math.min(1, maxOutW / outW);
      outW = Math.max(600, Math.round(outW * outScale));
      outH = Math.max(340, Math.round(outH * outScale));

      onStatus && onStatus('正在校正透視與方向…');
      const fullCanvas = document.createElement('canvas');
      fullCanvas.width = img.naturalWidth; fullCanvas.height = img.naturalHeight;
      fullCanvas.getContext('2d', { alpha: false }).drawImage(img, 0, 0);
      const fullSrc = cvx.imread(fullCanvas);
      const dst = new cvx.Mat();
      const srcTri = cvx.matFromArray(4, 1, cvx.CV_32FC2, [
        tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y
      ]);
      const dstTri = cvx.matFromArray(4, 1, cvx.CV_32FC2, [
        0, 0, outW - 1, 0, outW - 1, outH - 1, 0, outH - 1
      ]);
      const M = cvx.getPerspectiveTransform(srcTri, dstTri);
      cvx.warpPerspective(fullSrc, dst, M, new cvx.Size(outW, outH), cvx.INTER_CUBIC, cvx.BORDER_REPLICATE);
      const outCanvas = document.createElement('canvas');
      cvx.imshow(outCanvas, dst);
      fullSrc.delete(); dst.delete(); srcTri.delete(); dstTri.delete(); M.delete();

      return {
        imageDataUrl: dataUrlFromCanvas(outCanvas, 0.95),
        detected: true,
        confidence: Math.round(Math.min(1, best.score) * 100),
        corners: originalPts
      };
    } finally {
      [src, gray, blur, edges, hierarchy].forEach(m => { try { m && m.delete(); } catch (_) {} });
      try { contours && contours.delete(); } catch (_) {}
    }
  }

  async function detectVideoFrame(videoEl) {
    if (!videoEl?.videoWidth || !videoEl?.videoHeight) return null;
    const cvx = await getCv(250);
    if (!cvx) return null;
    // Keep live analysis intentionally lightweight on iPhone/Safari.
    // Full-resolution detection is still performed after capture.
    const maxW = 300;
    const scale = Math.min(1, maxW / videoEl.videoWidth);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(videoEl.videoWidth * scale));
    canvas.height = Math.max(1, Math.round(videoEl.videoHeight * scale));
    canvas.getContext('2d', {alpha:false}).drawImage(videoEl,0,0,canvas.width,canvas.height);
    let src,gray,blur,edges,contours,hierarchy;
    try {
      src=cvx.imread(canvas); gray=new cvx.Mat(); blur=new cvx.Mat(); edges=new cvx.Mat(); contours=new cvx.MatVector(); hierarchy=new cvx.Mat();
      cvx.cvtColor(src,gray,cvx.COLOR_RGBA2GRAY,0);
      // A tiny blur + Laplacian variance provide a cheap sharpness score.
      cvx.GaussianBlur(gray,blur,new cvx.Size(3,3),0,0,cvx.BORDER_DEFAULT);
      const lap = new cvx.Mat();
      cvx.Laplacian(gray, lap, cvx.CV_64F);
      const mean = new cvx.Mat(), stddev = new cvx.Mat();
      cvx.meanStdDev(lap, mean, stddev);
      const sigma = stddev.doubleAt(0,0);
      const sharpness = Math.max(0, Math.min(100, Math.round((sigma * sigma) / 5)));
      lap.delete(); mean.delete(); stddev.delete();
      cvx.Canny(blur,edges,60,145,3,false);
      cvx.findContours(edges,contours,hierarchy,cvx.RETR_EXTERNAL,cvx.CHAIN_APPROX_SIMPLE);
      const area=src.cols*src.rows,candidates=[];
      for(let i=0;i<contours.size();i++){
        const cnt=contours.get(i),peri=cvx.arcLength(cnt,true),approx=new cvx.Mat(); cvx.approxPolyDP(cnt,approx,.025*peri,true);
        if(approx.rows===4&&cvx.isContourConvex(approx)){const pts=matPoints(approx),score=quadrilateralScore(pts,area);if(Number.isFinite(score))candidates.push({pts,score});}
        approx.delete();cnt.delete();
      }
      candidates.sort((a,b)=>b.score-a.score); if(!candidates.length||candidates[0].score<.34)return null;
      return {confidence:Math.round(Math.min(1,candidates[0].score)*100), sharpness, corners:orderPoints(candidates[0].pts).map(p=>({x:p.x/canvas.width,y:p.y/canvas.height}))};
    } finally {[src,gray,blur,edges,hierarchy].forEach(m=>{try{m&&m.delete()}catch(_){}});try{contours&&contours.delete()}catch(_){}}
  }

  return { detectAndCorrect, detectVideoFrame, getCv };
})();
