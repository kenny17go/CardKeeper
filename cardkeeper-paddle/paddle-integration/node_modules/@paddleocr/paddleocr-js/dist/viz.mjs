var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
async function loadFontFace(config) {
  const source = typeof config.source === "string" ? `url(${config.source})` : config.source;
  const face = new FontFace(config.family, source, config.descriptors);
  await face.load();
  document.fonts.add(face);
  return face;
}
function removeFontFace(face) {
  document.fonts.delete(face);
}
function deterministicColor(index) {
  let seed = (index + 1) * 1103515245 + 12345;
  seed >>>= 0;
  const r = seed >> 16 & 255;
  seed = seed * 1103515245 + 12345 >>> 0;
  const g = seed >> 16 & 255;
  seed = seed * 1103515245 + 12345 >>> 0;
  const b = seed >> 16 & 255;
  return [r, g, b];
}
const DEFAULT_FILL_OPACITY = 0.5;
function drawPolygonPath$1(ctx, poly) {
  ctx.beginPath();
  ctx.moveTo(poly[0][0], poly[0][1]);
  for (let i = 1; i < poly.length; i += 1) {
    ctx.lineTo(poly[i][0], poly[i][1]);
  }
  ctx.closePath();
}
function drawBoxesPanel(ctx, image, items, style) {
  const fillOpacity = style.fillOpacity ?? DEFAULT_FILL_OPACITY;
  const getColor = style.colorFn ?? deterministicColor;
  ctx.drawImage(image, 0, 0);
  for (let i = 0; i < items.length; i += 1) {
    const [r, g, b] = getColor(i);
    ctx.save();
    ctx.fillStyle = `rgba(${String(r)}, ${String(g)}, ${String(b)}, ${String(fillOpacity)})`;
    drawPolygonPath$1(ctx, items[i].poly);
    ctx.fill();
    ctx.restore();
  }
}
const DEFAULT_BG = "#ffffff";
const OUTLINE_LINE_WIDTH = 1;
const TEXT_COLOR = "#000000";
const ROTATION_THRESHOLD_DEG = 5;
const VERTICAL_LINE_SPACING = 2;
function topEdgeAngle(poly) {
  const dx = poly[1][0] - poly[0][0];
  const dy = poly[1][1] - poly[0][1];
  return Math.atan2(dy, dx);
}
function polyBounds(poly) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of poly) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}
function drawPolygonPath(ctx, poly, offsetX) {
  ctx.beginPath();
  ctx.moveTo(poly[0][0] + offsetX, poly[0][1]);
  for (let i = 1; i < poly.length; i += 1) {
    ctx.lineTo(poly[i][0] + offsetX, poly[i][1]);
  }
  ctx.closePath();
}
function drawVerticalText(ctx, text, x, startY, fontSize, fontFamily) {
  ctx.font = `${String(fontSize)}px "${fontFamily}"`;
  let y = startY;
  for (const char of text) {
    ctx.fillText(char, x, y);
    y += fontSize + VERTICAL_LINE_SPACING;
  }
}
function drawTextPanel(ctx, offsetX, height, items, style, fontFamily, background) {
  const getColor = style.colorFn ?? deterministicColor;
  const bg = background ?? DEFAULT_BG;
  ctx.save();
  ctx.fillStyle = bg;
  ctx.fillRect(offsetX, 0, offsetX, height);
  ctx.restore();
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const [r, g, b] = getColor(i);
    const bounds = polyBounds(item.poly);
    const angle = topEdgeAngle(item.poly);
    const absDeg = Math.abs(angle * (180 / Math.PI));
    const needsRotation = absDeg > ROTATION_THRESHOLD_DEG && absDeg < 180 - ROTATION_THRESHOLD_DEG;
    const isVertical = bounds.height > 2 * bounds.width && bounds.height > 30;
    ctx.save();
    ctx.lineWidth = OUTLINE_LINE_WIDTH;
    ctx.strokeStyle = `rgb(${String(r)}, ${String(g)}, ${String(b)})`;
    drawPolygonPath(ctx, item.poly, offsetX);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = TEXT_COLOR;
    if (isVertical) {
      ctx.textBaseline = "top";
      const chars = Array.from(item.text);
      const charCount = Math.max(1, chars.length);
      let fontSize = Math.max(8, Math.floor(bounds.width * 0.8));
      const totalHeight = charCount * (fontSize + VERTICAL_LINE_SPACING);
      if (totalHeight > bounds.height) {
        fontSize = Math.max(8, Math.floor(bounds.height / charCount * 0.8));
      }
      ctx.font = `${String(fontSize)}px "${fontFamily}"`;
      const maxCharWidth = Math.max(...chars.map((c) => ctx.measureText(c).width));
      if (maxCharWidth > bounds.width) {
        fontSize = Math.max(8, Math.floor(fontSize * (bounds.width / maxCharWidth)));
      }
      const x = bounds.minX + offsetX + (bounds.width - fontSize) / 2;
      const y = bounds.minY + 2;
      drawVerticalText(ctx, item.text, x, y, fontSize, fontFamily);
    } else {
      ctx.textBaseline = "middle";
      let fontSize = Math.max(12, Math.floor(bounds.height * 0.8));
      ctx.font = `${String(fontSize)}px "${fontFamily}"`;
      const measured = ctx.measureText(item.text);
      if (measured.width > bounds.width && bounds.width > 0) {
        fontSize = Math.max(8, Math.floor(fontSize * (bounds.width / measured.width)));
        ctx.font = `${String(fontSize)}px "${fontFamily}"`;
      }
      if (needsRotation) {
        const cx = bounds.minX + bounds.width / 2 + offsetX;
        const cy = bounds.minY + bounds.height / 2;
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.fillText(item.text, -bounds.width / 2, 0);
      } else {
        const x = bounds.minX + offsetX + 2;
        const y = bounds.minY + bounds.height / 2;
        ctx.fillText(item.text, x, y);
      }
    }
    ctx.restore();
  }
}
function createCanvas(width, height) {
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(width, height);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
function getContext2D(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to create 2D rendering context.");
  }
  return ctx;
}
function canvasToBlob(canvas, type, quality) {
  if (canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob({ type, quality });
  }
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("canvas.toBlob() returned null."));
        }
      },
      type,
      quality
    );
  });
}
function imageWidth(image) {
  return image instanceof HTMLImageElement ? image.naturalWidth : image.width;
}
function imageHeight(image) {
  return image instanceof HTMLImageElement ? image.naturalHeight : image.height;
}
function renderSideBySideToCanvas(image, result, options) {
  const w = imageWidth(image);
  const h = imageHeight(image);
  const canvas = createCanvas(w * 2, h);
  const ctx = getContext2D(canvas);
  drawBoxesPanel(ctx, image, result.items, options.boxStyle);
  drawTextPanel(
    ctx,
    w,
    h,
    result.items,
    options.boxStyle,
    options.fontFamily,
    options.textPanelBackground
  );
  return canvas;
}
async function renderSideBySideToImageBitmap(image, result, options) {
  const canvas = renderSideBySideToCanvas(image, result, options);
  return createImageBitmap(canvas);
}
async function renderSideBySideToBlob(image, result, options) {
  const canvas = renderSideBySideToCanvas(image, result, options);
  return canvasToBlob(canvas, `image/${options.outputFormat}`, options.outputQuality);
}
const DEFAULT_FONT_FAMILY = "sans-serif";
const DEFAULT_OUTPUT_FORMAT = "png";
const DEFAULT_OUTPUT_QUALITY = 0.92;
const DEFAULT_TEXT_PANEL_BG = "#ffffff";
function resolveOptions(base, overrides) {
  var _a;
  const merged = overrides ? { ...base, ...overrides } : base;
  return {
    boxStyle: merged.boxStyle ?? {},
    fontFamily: ((_a = merged.font) == null ? void 0 : _a.family) ?? DEFAULT_FONT_FAMILY,
    textPanelBackground: merged.textPanelBackground ?? DEFAULT_TEXT_PANEL_BG,
    outputFormat: merged.outputFormat ?? DEFAULT_OUTPUT_FORMAT,
    outputQuality: merged.outputQuality ?? DEFAULT_OUTPUT_QUALITY
  };
}
class OcrVisualizer {
  constructor(options) {
    __publicField(this, "options");
    __publicField(this, "loadedFace", null);
    this.options = options ?? {};
  }
  async loadFont() {
    if (!this.options.font) return;
    if (this.loadedFace) return;
    this.loadedFace = await loadFontFace(this.options.font);
  }
  async renderSideBySide(image, result, overrides) {
    await this.loadFont();
    const opts = resolveOptions(this.options, overrides);
    return renderSideBySideToImageBitmap(image, result, opts);
  }
  async toBlob(image, result, overrides) {
    await this.loadFont();
    const opts = resolveOptions(this.options, overrides);
    return renderSideBySideToBlob(image, result, opts);
  }
  dispose() {
    if (this.loadedFace) {
      removeFontFace(this.loadedFace);
      this.loadedFace = null;
    }
  }
}
async function renderOcrToBlob(image, result, options) {
  const viz = new OcrVisualizer(options);
  try {
    return await viz.toBlob(image, result);
  } finally {
    viz.dispose();
  }
}
export {
  OcrVisualizer,
  deterministicColor,
  renderOcrToBlob
};
//# sourceMappingURL=viz.mjs.map
