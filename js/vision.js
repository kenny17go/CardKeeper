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

  // Lightweight live detector. Intentionally avoids OpenCV/WASM so Safari UI
  // stays responsive. Full OpenCV detection still runs after the photo is taken.
  const liveCanvas = document.createElement('canvas');
  const liveCtx = liveCanvas.getContext('2d', { alpha:false, willReadFrequently:true });

  function bestProjectionPeak(values, from, to) {
    let best = from, bestVal = -1;
    const a = Math.max(1, Math.floor(from)), b = Math.min(values.length - 2, Math.ceil(to));
    for (let i=a;i<=b;i++) if (values[i] > bestVal) { bestVal=values[i]; best=i; }
    return { index:best, value:bestVal };
  }

  async function detectVideoFrame(videoEl) {
    if (!videoEl?.videoWidth || !videoEl?.videoHeight) return null;
    const maxW = 176;
    const scale = Math.min(1, maxW / videoEl.videoWidth);
    const w = Math.max(96, Math.round(videoEl.videoWidth * scale));
    const h = Math.max(72, Math.round(videoEl.videoHeight * scale));
    liveCanvas.width=w; liveCanvas.height=h;
    liveCtx.drawImage(videoEl,0,0,w,h);
    const rgba=liveCtx.getImageData(0,0,w,h).data;
    const gray=new Uint8Array(w*h);
    let mean=0;
    for(let i=0,j=0;i<rgba.length;i+=4,j++){
      const g=(rgba[i]*77 + rgba[i+1]*150 + rgba[i+2]*29) >> 8;
      gray[j]=g; mean+=g;
    }
    mean/=gray.length;

    // Gradient projections: cheap approximation of the four card borders.
    const vx=new Float32Array(w), hy=new Float32Array(h);
    let sharpSum=0, sharpN=0;
    for(let y=1;y<h-1;y++){
      const row=y*w;
      for(let x=1;x<w-1;x++){
        const i=row+x;
        const dx=Math.abs(gray[i+1]-gray[i-1]);
        const dy=Math.abs(gray[i+w]-gray[i-w]);
        vx[x]+=dx; hy[y]+=dy;
        sharpSum += dx+dy; sharpN++;
      }
    }
    const sharpness=Math.max(0,Math.min(100,Math.round((sharpSum/Math.max(1,sharpN))*2.15)));
    const left=bestProjectionPeak(vx,w*.04,w*.38);
    const right=bestProjectionPeak(vx,w*.62,w*.96);
    const top=bestProjectionPeak(hy,h*.05,h*.45);
    const bottom=bestProjectionPeak(hy,h*.55,h*.95);
    const bw=right.index-left.index, bh=bottom.index-top.index;
    if(bw < w*.42 || bh < h*.20) return null;

    const physicalRatio=(bw/bh)*(h/w)*(videoEl.videoWidth/videoEl.videoHeight);
    const ratio=Math.max(physicalRatio,1/Math.max(.001,physicalRatio));
    const ratioScore=Math.max(0,1-Math.abs(ratio-CARD_RATIO)/1.05);
    const normEdge=((left.value+right.value)/(2*h)+(top.value+bottom.value)/(2*w))/2;
    const edgeScore=Math.max(0,Math.min(1,(normEdge-8)/28));
    const brightnessScore=mean>35 && mean<245 ? 1 : .45;
    const score=.48*edgeScore+.38*ratioScore+.14*brightnessScore;
    if(score<.34) return null;

    return {
      confidence:Math.round(Math.min(1,score)*100),
      sharpness,
      corners:[
        {x:left.index/w,y:top.index/h},
        {x:right.index/w,y:top.index/h},
        {x:right.index/w,y:bottom.index/h},
        {x:left.index/w,y:bottom.index/h}
      ]
    };
  }

  return { detectAndCorrect, detectVideoFrame, getCv };
})();
