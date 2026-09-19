var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import yaml from "js-yaml";
import ClipperLib from "clipper-lib";
import cvModule from "@techstark/opencv-js";
function readString(bytes, start, length) {
  let output = "";
  for (let index = start; index < start + length; index += 1) {
    const value = bytes[index];
    if (value === 0) break;
    output += String.fromCharCode(value);
  }
  return output.replace(/\0.*$/, "").trim();
}
function readOctal(bytes, start, length) {
  const raw = readString(bytes, start, length).replace(/\0/g, "").trim();
  return raw ? Number.parseInt(raw, 8) : 0;
}
function isEmptyBlock(bytes, offset) {
  for (let index = offset; index < offset + 512; index += 1) {
    if (bytes[index] !== 0) return false;
  }
  return true;
}
function normalizeEntryName(name) {
  return name.replace(/^\.?\//, "");
}
function isMetadataEntry(name) {
  const segments = normalizeEntryName(name).split("/");
  const baseName = segments[segments.length - 1] || "";
  return baseName.startsWith("._") || segments.includes("PaxHeader") || segments.includes("__MACOSX");
}
function extractTarEntries(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const entries = /* @__PURE__ */ new Map();
  let offset = 0;
  while (offset + 512 <= bytes.length) {
    if (isEmptyBlock(bytes, offset)) {
      break;
    }
    const name = normalizeEntryName(readString(bytes, offset, 100));
    const size = readOctal(bytes, offset + 124, 12);
    const type = bytes[offset + 156];
    const dataStart = offset + 512;
    const dataEnd = dataStart + size;
    if (type !== 53 && type !== 120 && name && !isMetadataEntry(name)) {
      entries.set(name, bytes.slice(dataStart, dataEnd));
    }
    offset = dataStart + Math.ceil(size / 512) * 512;
  }
  return entries;
}
function pickTarEntry(entries, targetName) {
  const normalizedTarget = normalizeEntryName(targetName);
  const entry = entries.get(normalizedTarget);
  if (entry) {
    return entry;
  }
  for (const [name, value] of entries) {
    if (name.endsWith(`/${normalizedTarget}`) || name === normalizedTarget) {
      return value;
    }
  }
  throw new Error(`Entry "${targetName}" was not found in the tar archive.`);
}
const DEFAULT_MODEL_ASSETS = {
  "PP-OCRv5_mobile_det": {
    url: "https://paddle-model-ecology.bj.bcebos.com/paddlex/official_inference_model/paddle3.0.0/PP-OCRv5_mobile_det_onnx_infer.tar"
  },
  "PP-OCRv5_mobile_rec": {
    url: "https://paddle-model-ecology.bj.bcebos.com/paddlex/official_inference_model/paddle3.0.0/PP-OCRv5_mobile_rec_onnx_infer.tar"
  },
  "PP-OCRv6_small_det": {
    url: "https://paddle-model-ecology.bj.bcebos.com/paddlex/official_inference_model/paddle3.0.0/PP-OCRv6_small_det_onnx_infer.tar"
  },
  "PP-OCRv6_small_rec": {
    url: "https://paddle-model-ecology.bj.bcebos.com/paddlex/official_inference_model/paddle3.0.0/PP-OCRv6_small_rec_onnx_infer.tar"
  },
  "PP-OCRv6_tiny_det": {
    url: "https://paddle-model-ecology.bj.bcebos.com/paddlex/official_inference_model/paddle3.0.0/PP-OCRv6_tiny_det_onnx_infer.tar"
  },
  "PP-OCRv6_tiny_rec": {
    url: "https://paddle-model-ecology.bj.bcebos.com/paddlex/official_inference_model/paddle3.0.0/PP-OCRv6_tiny_rec_onnx_infer.tar"
  }
};
const MODEL_ENTRY_PATHS = Object.freeze({
  model: "inference.onnx",
  config: "inference.yml"
});
function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}
function isObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function normalizeModelAsset(assetName, asset) {
  if (isNonEmptyString(asset)) {
    const resolvedAsset = DEFAULT_MODEL_ASSETS[asset];
    if (!resolvedAsset) {
      throw new Error(`Asset "${assetName}" references unknown model asset "${asset}".`);
    }
    return { url: resolvedAsset.url };
  }
  if (!isObject(asset)) {
    throw new Error(`Asset "${assetName}" must be an object.`);
  }
  if (!isNonEmptyString(asset.url)) {
    throw new Error(`Asset "${assetName}" must define url.`);
  }
  return {
    url: asset.url
  };
}
function assertModelResourceSlot(kind, slot, value) {
  if (slot === "model") {
    if (!(value instanceof Uint8Array) || value.byteLength === 0) {
      throw new Error(`${kind} model requires a non-empty ${MODEL_ENTRY_PATHS.model} resource.`);
    }
    return;
  }
  if (slot === "config") {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`${kind} model requires a non-empty ${MODEL_ENTRY_PATHS.config} resource.`);
    }
    return;
  }
  throw new Error(`Unsupported model resource slot "${slot}".`);
}
function assertModelResources(kind, resources) {
  for (const [slot, value] of Object.entries(resources)) {
    assertModelResourceSlot(kind, slot, value);
  }
}
async function loadModelAsset(asset, fetchImpl = fetch) {
  const response = await fetchImpl(asset.url);
  if (!response.ok) {
    throw new Error(`Failed to download ${asset.url}: HTTP ${String(response.status)}`);
  }
  const buffer = await response.arrayBuffer();
  const entries = extractTarEntries(buffer);
  const modelBytes = pickTarEntry(entries, MODEL_ENTRY_PATHS.model);
  const configBytes = pickTarEntry(entries, MODEL_ENTRY_PATHS.config);
  return {
    modelBytes,
    configText: new TextDecoder().decode(configBytes),
    download: {
      url: asset.url,
      bytes: buffer.byteLength
    }
  };
}
const SUPPORTED_PIPELINE_NAME = "OCR";
function isPlainObject$1(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function toFiniteNumber(value) {
  if (value === null || value === void 0 || value === "") {
    return void 0;
  }
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : void 0;
}
function batchSizeOrOne(value) {
  const n = toFiniteNumber(value);
  return n !== void 0 && n >= 1 ? n : 1;
}
function applyGeneralPipelineRuntimeDefaults(textType, runtimeDefaults) {
  if (textType !== "general") {
    return runtimeDefaults;
  }
  return {
    text_det_limit_side_len: runtimeDefaults.text_det_limit_side_len ?? 960,
    text_det_limit_type: runtimeDefaults.text_det_limit_type ?? "max",
    text_det_max_side_limit: runtimeDefaults.text_det_max_side_limit ?? 4e3,
    text_det_thresh: runtimeDefaults.text_det_thresh ?? 0.3,
    text_det_box_thresh: runtimeDefaults.text_det_box_thresh ?? 0.6,
    text_det_unclip_ratio: runtimeDefaults.text_det_unclip_ratio ?? 2,
    text_rec_score_thresh: runtimeDefaults.text_rec_score_thresh ?? 0
  };
}
function parsePipelineConfigInput(input) {
  if (typeof input === "string") {
    const parsed = yaml.load(input);
    if (!isPlainObject$1(parsed)) {
      throw new Error("OCR pipeline config text must decode to an object.");
    }
    return parsed;
  }
  if (!isPlainObject$1(input)) {
    throw new Error("OCR pipeline config must be an object or YAML text.");
  }
  return input;
}
function addFeatureWarning(warnings, featureName, reason) {
  warnings.push(
    `${featureName} is not yet supported in PaddleOCR.js${`: ${reason}`}.`
  );
}
function getModuleModelName(moduleConfig) {
  return typeof (moduleConfig == null ? void 0 : moduleConfig.model_name) === "string" ? moduleConfig.model_name : null;
}
function validateModuleAsset(modulePath, modelName) {
  if (!modelName) {
    throw new Error(
      `${modulePath}.model_name must be provided when ${modulePath}.model_dir is set.`
    );
  }
}
function getModuleAsset(assetName, modulePath, moduleConfig) {
  if ((moduleConfig == null ? void 0 : moduleConfig.model_dir) == null) {
    return null;
  }
  if (isPlainObject$1(moduleConfig.model_dir)) {
    const asset = normalizeModelAsset(assetName, moduleConfig.model_dir);
    validateModuleAsset(modulePath, getModuleModelName(moduleConfig));
    return asset;
  }
  throw new Error(
    `${modulePath}.model_dir must be null or an asset descriptor object in browser usage.`
  );
}
function parseOcrPipelineConfigText(text) {
  return parsePipelineConfigInput(text);
}
function normalizeOcrPipelineConfig(input) {
  const config = parsePipelineConfigInput(input);
  const pipelineName = config.pipeline_name ?? SUPPORTED_PIPELINE_NAME;
  if (pipelineName !== SUPPORTED_PIPELINE_NAME) {
    throw new Error(
      `Unsupported pipeline_name "${pipelineName}". PaddleOCR.js currently supports only "${SUPPORTED_PIPELINE_NAME}".`
    );
  }
  const warnings = [];
  const subModules = isPlainObject$1(config.SubModules) ? config.SubModules : {};
  const textDetection = isPlainObject$1(subModules.TextDetection) ? subModules.TextDetection : null;
  const textRecognition = isPlainObject$1(subModules.TextRecognition) ? subModules.TextRecognition : null;
  if (!textDetection || !textRecognition) {
    throw new Error(
      'OCR pipeline config must define both "SubModules.TextDetection" and "SubModules.TextRecognition".'
    );
  }
  const useDocPreprocessor = Boolean(config.use_doc_preprocessor);
  const useTextlineOrientation = Boolean(config.use_textline_orientation);
  const subPipelines = config.SubPipelines;
  const docPreprocessor = isPlainObject$1(subPipelines == null ? void 0 : subPipelines.DocPreprocessor) ? subPipelines.DocPreprocessor : null;
  const textLineOrientation = isPlainObject$1(subModules.TextLineOrientation) ? subModules.TextLineOrientation : null;
  if (useDocPreprocessor || docPreprocessor) {
    addFeatureWarning(warnings, "DocPreprocessor", "config will be ignored for now");
  }
  if (useTextlineOrientation || textLineOrientation) {
    addFeatureWarning(warnings, "TextLineOrientation", "config will be ignored for now");
  }
  const textType = typeof config.text_type === "string" && config.text_type.length > 0 ? config.text_type : "general";
  if (config.text_type && config.text_type !== "general") {
    warnings.push(`text_type ${JSON.stringify(config.text_type)} is not used by PaddleOCR.js yet.`);
  }
  const detAsset = getModuleAsset("det", "SubModules.TextDetection", textDetection);
  const recAsset = getModuleAsset("rec", "SubModules.TextRecognition", textRecognition);
  const pipelineBatchSize = batchSizeOrOne(config.batch_size);
  const textDetectionBatchSize = batchSizeOrOne(textDetection.batch_size);
  const textRecognitionBatchSizeFromModule = batchSizeOrOne(textRecognition.batch_size);
  return {
    pipelineName,
    raw: config,
    warnings,
    unsupportedFeatures: [
      ...useDocPreprocessor || docPreprocessor ? ["DocPreprocessor"] : [],
      ...useTextlineOrientation || textLineOrientation ? ["TextLineOrientation"] : []
    ],
    modelSelection: {
      textDetectionModelName: getModuleModelName(textDetection),
      textRecognitionModelName: getModuleModelName(textRecognition)
    },
    assets: {
      ...detAsset ? { det: detAsset } : {},
      ...recAsset ? { rec: recAsset } : {}
    },
    runtimeDefaults: applyGeneralPipelineRuntimeDefaults(textType, {
      text_det_limit_side_len: toFiniteNumber(textDetection.limit_side_len),
      text_det_limit_type: textDetection.limit_type || void 0,
      text_det_max_side_limit: toFiniteNumber(textDetection.max_side_limit),
      text_det_thresh: toFiniteNumber(textDetection.thresh),
      text_det_box_thresh: toFiniteNumber(textDetection.box_thresh),
      text_det_unclip_ratio: toFiniteNumber(textDetection.unclip_ratio),
      text_rec_score_thresh: toFiniteNumber(textRecognition.score_thresh)
    }),
    pipelineBatchSize,
    textDetectionBatchSize,
    textRecognitionBatchSize: textRecognitionBatchSizeFromModule
  };
}
function ensureServedFromHttp() {
  if (globalThis.location.protocol === "file:") {
    throw new Error("PaddleOCR.js requires an HTTP(S) origin so model assets can be fetched.");
  }
}
function hasDomConstructor(name) {
  return typeof globalThis[name] !== "undefined";
}
async function sourceToImageBitmap(source) {
  if (typeof ImageBitmap !== "undefined" && source instanceof ImageBitmap) return source;
  if (source instanceof Blob) return createImageBitmap(source);
  if (hasDomConstructor("HTMLCanvasElement") && source instanceof HTMLCanvasElement) {
    return createImageBitmap(source);
  }
  if (source instanceof ImageData) {
    const canvas = document.createElement("canvas");
    canvas.width = source.width;
    canvas.height = source.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to create a 2D canvas context.");
    ctx.putImageData(source, 0, 0);
    return createImageBitmap(canvas);
  }
  if (hasDomConstructor("HTMLImageElement") && source instanceof HTMLImageElement) {
    return createImageBitmap(source);
  }
  throw new Error("Unsupported image source. Use a Blob, ImageBitmap, ImageData, canvas, or img.");
}
async function sourceToClonedImageBitmap(source) {
  if (typeof ImageBitmap !== "undefined" && source instanceof ImageBitmap) {
    return createImageBitmap(source);
  }
  return sourceToImageBitmap(source);
}
function bitmapToSourceMat(cv, imageBitmap) {
  const canvas = document.createElement("canvas");
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Failed to create a 2D canvas context.");
  ctx.drawImage(imageBitmap, 0, 0);
  return {
    canvas,
    mat: cv.imread(canvas)
  };
}
async function sourceToMat(cv, source) {
  if (typeof cv.Mat === "function" && source instanceof cv.Mat) {
    const cloned = source.clone();
    return {
      width: source.cols,
      height: source.rows,
      mat: cloned,
      dispose() {
        cloned.delete();
      }
    };
  }
  const imageBitmap = await sourceToImageBitmap(source);
  const sourceImage = bitmapToSourceMat(cv, imageBitmap);
  return {
    width: imageBitmap.width,
    height: imageBitmap.height,
    mat: sourceImage.mat,
    dispose() {
      sourceImage.mat.delete();
      imageBitmap.close();
    }
  };
}
async function sourceToWorkerPayload(source) {
  if (typeof ImageBitmap === "undefined" || typeof createImageBitmap !== "function") {
    throw new Error("Worker mode requires ImageBitmap support in this browser.");
  }
  const imageBitmap = await sourceToClonedImageBitmap(source);
  return {
    payload: {
      kind: "imageBitmap",
      imageBitmap
    },
    transferables: [imageBitmap]
  };
}
let ortModulePromise = null;
async function loadOrtModule() {
  if (ortModulePromise) {
    return ortModulePromise;
  }
  ortModulePromise = import("onnxruntime-web");
  return ortModulePromise;
}
async function detectWebGpuAvailability() {
  var _a;
  const gpu = (_a = globalThis.navigator) == null ? void 0 : _a.gpu;
  if (!(gpu == null ? void 0 : gpu.requestAdapter)) {
    return {
      available: false,
      reason: "navigator.gpu is unavailable in this browser."
    };
  }
  try {
    const adapter = await gpu.requestAdapter();
    if (!adapter) {
      return {
        available: false,
        reason: "The browser did not return a WebGPU adapter."
      };
    }
    return {
      available: true,
      reason: ""
    };
  } catch (err) {
    return {
      available: false,
      reason: err instanceof Error ? err.message : "Failed to request a WebGPU adapter."
    };
  }
}
function getProviderCandidates(backend, webgpuState) {
  if (backend === "webgpu") {
    if (!webgpuState.available) {
      throw new Error(`WebGPU is unavailable: ${webgpuState.reason}`);
    }
    return [["webgpu"]];
  }
  if (backend === "wasm") {
    return [["wasm"]];
  }
  return webgpuState.available ? [["webgpu"], ["wasm"]] : [["wasm"]];
}
function applyOrtEnvironmentOptions(ort, ortOptions) {
  const wasmOptions = ort.env.wasm;
  if (ortOptions.wasmPaths !== void 0) {
    wasmOptions.wasmPaths = ortOptions.wasmPaths;
  }
  if (ortOptions.numThreads !== void 0) {
    wasmOptions.numThreads = ortOptions.numThreads;
  }
  if (ortOptions.simd !== void 0) {
    wasmOptions.simd = ortOptions.simd;
  }
  if (ortOptions.proxy !== void 0) {
    wasmOptions.proxy = ortOptions.proxy;
  }
  if (ortOptions.disableWasmProxy) {
    wasmOptions.proxy = false;
  }
}
async function initOrtRuntime(ortOptions = {}) {
  const backend = typeof ortOptions === "string" ? ortOptions : ortOptions.backend === "webgpu" || ortOptions.backend === "wasm" ? ortOptions.backend : "auto";
  const webgpuState = await detectWebGpuAvailability();
  const ort = await loadOrtModule();
  if (typeof ortOptions !== "string") {
    applyOrtEnvironmentOptions(ort, ortOptions);
  }
  return {
    ort,
    webgpuState,
    backend
  };
}
async function createSession(ort, modelBytes, providerCandidates) {
  let lastErr = null;
  for (const executionProviders of providerCandidates) {
    try {
      const session = await ort.InferenceSession.create(modelBytes, {
        executionProviders,
        graphOptimizationLevel: "all"
      });
      return { session, provider: executionProviders[0] };
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Failed to create ONNX session.");
}
async function releaseSessions(...sessions) {
  await Promise.all(
    sessions.map(async (session) => {
      if (!(session == null ? void 0 : session.release)) return;
      await session.release();
    })
  );
}
function nowMs() {
  return performance.now();
}
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function distance2(p0, p1) {
  const dx = p0[0] - p1[0];
  const dy = p0[1] - p1[1];
  return Math.sqrt(dx * dx + dy * dy);
}
function withTimeout(promise, ms, label) {
  let settled = false;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error(`${label} timed out after ${String(ms / 1e3)}s`));
    }, ms);
    promise.then((result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(result);
    }).catch((err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });
  });
}
function resolveRuntimeBatchSize(override, defaultBatchSize) {
  const rawBatch = override ?? defaultBatchSize;
  const coercedBatch = typeof rawBatch === "number" ? rawBatch : typeof rawBatch === "string" ? Number.parseInt(rawBatch, 10) : Number.NaN;
  return Math.max(1, Number.isFinite(coercedBatch) ? coercedBatch : 1);
}
function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
function deepClone(value) {
  return structuredClone(value);
}
async function runInference(session, inputTensor) {
  const inputName = session.inputNames[0];
  const outputMap = await session.run({ [inputName]: inputTensor });
  return outputMap[session.outputNames[0]];
}
function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function parseInferenceConfigText(text) {
  const parsed = yaml.load(text);
  return isPlainObject(parsed) ? parsed : {};
}
function parseScaleValue(rawScale, fallback) {
  if (typeof rawScale === "number") return rawScale;
  if (typeof rawScale !== "string") return fallback;
  const normalized = rawScale.replace(/\s/g, "");
  const direct = Number(normalized);
  if (!Number.isNaN(direct)) return direct;
  const divParts = normalized.split("/");
  if (divParts.length === 2) {
    const numerator = Number(divParts[0].replace(/\.+$/, ""));
    const denominator = Number(divParts[1].replace(/\.+$/, ""));
    if (!Number.isNaN(numerator) && !Number.isNaN(denominator) && denominator !== 0) {
      return numerator / denominator;
    }
  }
  return fallback;
}
function getTransformOp(transformOps, opName) {
  for (const op of transformOps || []) {
    if (Object.prototype.hasOwnProperty.call(op, opName)) {
      return op[opName];
    }
  }
  return null;
}
function findModelNameInYamlNode(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const match = findModelNameInYamlNode(item);
      if (match) return match;
    }
    return null;
  }
  if (!isPlainObject(value)) {
    return null;
  }
  for (const [key, childValue] of Object.entries(value)) {
    if (key === "model_name" && typeof childValue === "string" && childValue.trim()) {
      return childValue;
    }
    const match = findModelNameInYamlNode(childValue);
    if (match) return match;
  }
  return null;
}
function extractInferenceModelName(configText) {
  var _a;
  const parsed = parseInferenceConfigText(configText);
  const preferredCandidates = [
    (_a = parsed.Global) == null ? void 0 : _a.model_name,
    parsed.model_name
  ];
  for (const candidate of preferredCandidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }
  return findModelNameInYamlNode(parsed);
}
function toBgrFloatCHWFromBgr(bgr, width, height, normalizeConfig) {
  const data = new Float32Array(3 * width * height);
  const hw = width * height;
  const mean = normalizeConfig.mean;
  const std = normalizeConfig.std;
  const scale = normalizeConfig.scale;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = y * width + x;
      const p = idx * 3;
      const b = bgr[p];
      const g = bgr[p + 1];
      const r = bgr[p + 2];
      data[idx] = (b * scale - mean[0]) / std[0];
      data[idx + hw] = (g * scale - mean[1]) / std[1];
      data[idx + 2 * hw] = (r * scale - mean[2]) / std[2];
    }
  }
  return data;
}
function orderQuad(pts) {
  const points = pts.slice().sort((a, b) => a[0] - b[0]);
  let indexA;
  let indexB;
  let indexC;
  let indexD;
  if (points[1][1] > points[0][1]) {
    indexA = 0;
    indexD = 1;
  } else {
    indexA = 1;
    indexD = 0;
  }
  if (points[3][1] > points[2][1]) {
    indexB = 2;
    indexC = 3;
  } else {
    indexB = 3;
    indexC = 2;
  }
  return [points[indexA], points[indexB], points[indexC], points[indexD]];
}
function polygonArea(poly) {
  let area = 0;
  for (let i = 0; i < poly.length; i += 1) {
    const j = (i + 1) % poly.length;
    area += poly[i][0] * poly[j][1] - poly[j][0] * poly[i][1];
  }
  return Math.abs(area) * 0.5;
}
function polygonPerimeter(poly) {
  let peri = 0;
  for (let i = 0; i < poly.length; i += 1) {
    const j = (i + 1) % poly.length;
    peri += distance2(poly[i], poly[j]);
  }
  return peri;
}
function chooseMaxAreaPath(paths) {
  let best = null;
  let bestArea = 0;
  for (const path of paths) {
    if (path.length < 4) continue;
    const poly = path.map((pt) => [pt.X, pt.Y]);
    const area = polygonArea(poly);
    if (area > bestArea) {
      bestArea = area;
      best = path;
    }
  }
  return best;
}
function unclip(poly, unclipRatio) {
  const area = polygonArea(poly);
  const perimeter = polygonPerimeter(poly);
  if (perimeter <= 0) return null;
  const distance = area * unclipRatio / perimeter;
  const path = poly.map((p) => ({ X: Math.trunc(p[0]), Y: Math.trunc(p[1]) }));
  const offset = new ClipperLib.ClipperOffset();
  offset.AddPath(path, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
  const expanded = new ClipperLib.Paths();
  offset.Execute(expanded, distance);
  const best = chooseMaxAreaPath(expanded);
  if (!best) return null;
  return best.map((pt) => [pt.X, pt.Y]);
}
function getMiniBoxFromPoints(cv, points) {
  const flat = [];
  for (const p of points) flat.push(p[0], p[1]);
  const contour = cv.matFromArray(points.length, 1, cv.CV_32FC2, flat);
  const rect = cv.minAreaRect(contour);
  const vertices = cv.RotatedRect.points(rect);
  const box = [];
  for (let i = 0; i < 4; i += 1) box.push([vertices[i].x, vertices[i].y]);
  contour.delete();
  const ordered = orderQuad(box);
  const side = Math.min(distance2(ordered[0], ordered[1]), distance2(ordered[1], ordered[2]));
  return { box: ordered, side };
}
function boxScoreFast(cv, predMat, box) {
  const h = predMat.rows;
  const w = predMat.cols;
  let minX = w - 1;
  let maxX = 0;
  let minY = h - 1;
  let maxY = 0;
  for (const p of box) {
    minX = Math.min(minX, p[0]);
    maxX = Math.max(maxX, p[0]);
    minY = Math.min(minY, p[1]);
    maxY = Math.max(maxY, p[1]);
  }
  minX = clamp(Math.floor(minX), 0, w - 1);
  maxX = clamp(Math.ceil(maxX), 0, w - 1);
  minY = clamp(Math.floor(minY), 0, h - 1);
  maxY = clamp(Math.ceil(maxY), 0, h - 1);
  const rw = Math.max(1, maxX - minX + 1);
  const rh = Math.max(1, maxY - minY + 1);
  const roi = predMat.roi(new cv.Rect(minX, minY, rw, rh));
  const mask = cv.Mat.zeros(rh, rw, cv.CV_8UC1);
  const shifted = box.map((p) => [Math.trunc(p[0] - minX), Math.trunc(p[1] - minY)]);
  const flat = [];
  for (const p of shifted) flat.push(p[0], p[1]);
  const pts = cv.matFromArray(shifted.length, 1, cv.CV_32SC2, flat);
  const ptsVec = new cv.MatVector();
  ptsVec.push_back(pts);
  cv.fillPoly(mask, ptsVec, new cv.Scalar(1));
  const mean = cv.mean(roi, mask)[0];
  roi.delete();
  mask.delete();
  pts.delete();
  ptsVec.delete();
  return mean;
}
const DET_BOX_MIN_SIZE = 3;
const DEFAULT_DET_MODEL_PARSE_FALLBACKS = Object.freeze({
  resizeLong: 960,
  limitType: "max",
  maxSideLimit: 4e3,
  normalize: {
    mean: [0.485, 0.456, 0.406],
    std: [0.229, 0.224, 0.225],
    scale: 1 / 255
  },
  postprocess: {
    thresh: 0.3,
    boxThresh: 0.6,
    maxCandidates: 1e3,
    unclipRatio: 2
  }
});
const DEFAULT_DET_MODEL_CONFIG = Object.freeze({
  ...DEFAULT_DET_MODEL_PARSE_FALLBACKS
});
function parseDetLimitType(raw) {
  const v = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  if (v === "min" || v === "max") {
    return v;
  }
  return DEFAULT_DET_MODEL_PARSE_FALLBACKS.limitType;
}
function parseDetModelConfigText(text) {
  const parsed = parseInferenceConfigText(text);
  const preProcess = parsed.PreProcess;
  const transformOps = preProcess == null ? void 0 : preProcess.transform_ops;
  const resize = getTransformOp(transformOps, "DetResizeForTest");
  const normalize = getTransformOp(transformOps, "NormalizeImage");
  const postprocess2 = parsed.PostProcess || {};
  const maxSideRaw = resize == null ? void 0 : resize.max_side_limit;
  const maxSideLimit = Number(maxSideRaw);
  const maxSide = Number.isFinite(maxSideLimit) && maxSideLimit > 0 ? maxSideLimit : DEFAULT_DET_MODEL_PARSE_FALLBACKS.maxSideLimit;
  return {
    resizeLong: Number((resize == null ? void 0 : resize.resize_long) ?? DEFAULT_DET_MODEL_PARSE_FALLBACKS.resizeLong),
    limitType: parseDetLimitType(resize == null ? void 0 : resize.limit_type),
    maxSideLimit: maxSide,
    normalize: {
      mean: (normalize == null ? void 0 : normalize.mean) ?? DEFAULT_DET_MODEL_PARSE_FALLBACKS.normalize.mean,
      std: (normalize == null ? void 0 : normalize.std) ?? DEFAULT_DET_MODEL_PARSE_FALLBACKS.normalize.std,
      scale: parseScaleValue(normalize == null ? void 0 : normalize.scale, DEFAULT_DET_MODEL_PARSE_FALLBACKS.normalize.scale)
    },
    postprocess: {
      thresh: Number(postprocess2.thresh ?? DEFAULT_DET_MODEL_PARSE_FALLBACKS.postprocess.thresh),
      boxThresh: Number(
        postprocess2.box_thresh ?? DEFAULT_DET_MODEL_PARSE_FALLBACKS.postprocess.boxThresh
      ),
      maxCandidates: Number(
        postprocess2.max_candidates ?? DEFAULT_DET_MODEL_PARSE_FALLBACKS.postprocess.maxCandidates
      ),
      unclipRatio: Number(
        postprocess2.unclip_ratio ?? DEFAULT_DET_MODEL_PARSE_FALLBACKS.postprocess.unclipRatio
      )
    }
  };
}
function resolveDetParams(defaults, overrides) {
  return {
    limitSideLen: (overrides == null ? void 0 : overrides.limitSideLen) ?? defaults.limitSideLen,
    limitType: (overrides == null ? void 0 : overrides.limitType) ?? defaults.limitType,
    maxSideLimit: (overrides == null ? void 0 : overrides.maxSideLimit) ?? defaults.maxSideLimit,
    thresh: (overrides == null ? void 0 : overrides.thresh) ?? defaults.thresh,
    boxThresh: (overrides == null ? void 0 : overrides.boxThresh) ?? defaults.boxThresh,
    unclipRatio: (overrides == null ? void 0 : overrides.unclipRatio) ?? defaults.unclipRatio
  };
}
async function createDetModel({
  ort,
  modelBytes,
  configText,
  backend,
  webgpuState,
  batchSize: batchSizeArg
}) {
  assertModelResources("Detection", {
    model: modelBytes,
    config: configText
  });
  const config = parseDetModelConfigText(configText);
  const defaultBatchSize = Math.max(1, batchSizeArg ?? 1);
  const defaultParams = {
    limitSideLen: config.resizeLong,
    limitType: config.limitType,
    maxSideLimit: config.maxSideLimit,
    thresh: config.postprocess.thresh,
    boxThresh: config.postprocess.boxThresh,
    unclipRatio: config.postprocess.unclipRatio
  };
  let sessionState = await createDetModelSession(
    ort,
    modelBytes,
    backend,
    webgpuState
  );
  return {
    kind: "det",
    config,
    get provider() {
      return (sessionState == null ? void 0 : sessionState.provider) || "";
    },
    async predict(cv, mats, overrides) {
      if (!(sessionState == null ? void 0 : sessionState.session)) {
        throw new Error("Detection model session is not initialized.");
      }
      const params = resolveDetParams(defaultParams, overrides);
      const batchSize = resolveRuntimeBatchSize(overrides == null ? void 0 : overrides.batchSize, defaultBatchSize);
      const results = [];
      const runCtx = {
        cv,
        ort,
        config,
        session: sessionState.session
      };
      for (const chunk of chunkArray(mats, batchSize)) {
        const preps = preprocess$1({ cv, ort, config }, chunk, params);
        const inputTensor = packDetBatchTensor(ort, preps);
        const fullOutput = await runInference(sessionState.session, inputTensor);
        const internals = postprocess$1(runCtx, fullOutput, preps, params);
        for (const internal of internals) {
          results.push({
            boxes: internal.boxes,
            srcW: internal.prep.srcW,
            srcH: internal.prep.srcH
          });
        }
      }
      return results;
    },
    async dispose() {
      await releaseSessions(sessionState == null ? void 0 : sessionState.session);
      sessionState = null;
    }
  };
}
async function createDetModelSession(ort, modelBytes, backend, webgpuState) {
  const providerCandidates = getProviderCandidates(backend, webgpuState);
  return withTimeout(createSession(ort, modelBytes, providerCandidates), 6e4, "Detection model");
}
function preprocess$1(context, mats, params) {
  return mats.map((mat) => preprocessSample$1(context, mat, params));
}
function preprocessSample$1(context, sourceMat, params) {
  const { cv, ort, config } = context;
  const srcW = sourceMat.cols;
  const srcH = sourceMat.rows;
  const limitSideLen = Math.max(32, params.limitSideLen);
  const limitType = params.limitType;
  const maxSideLimit = Math.max(32, params.maxSideLimit);
  let scale = 1;
  if (limitType === "max") {
    const maxSide = Math.max(srcW, srcH);
    if (maxSide > limitSideLen) {
      scale = limitSideLen / Math.max(1, maxSide);
    }
  } else {
    const minSide = Math.min(srcW, srcH);
    if (minSide < limitSideLen) {
      scale = limitSideLen / Math.max(1, minSide);
    }
  }
  let dstW = Math.max(32, Math.round(srcW * scale / 32) * 32);
  let dstH = Math.max(32, Math.round(srcH * scale / 32) * 32);
  if (Math.max(dstW, dstH) > maxSideLimit) {
    const limitScale = maxSideLimit / Math.max(dstW, dstH);
    dstW = Math.max(32, Math.floor(dstW * limitScale));
    dstH = Math.max(32, Math.floor(dstH * limitScale));
  }
  dstW = clamp(dstW, 32, maxSideLimit);
  dstH = clamp(dstH, 32, maxSideLimit);
  dstW = Math.max(32, Math.round(dstW / 32) * 32);
  dstH = Math.max(32, Math.round(dstH / 32) * 32);
  const resized = new cv.Mat();
  const bgr = new cv.Mat();
  cv.resize(sourceMat, resized, new cv.Size(dstW, dstH), 0, 0, cv.INTER_LINEAR);
  if (resized.channels() === 4) {
    cv.cvtColor(resized, bgr, cv.COLOR_RGBA2BGR);
  } else if (resized.channels() === 1) {
    cv.cvtColor(resized, bgr, cv.COLOR_GRAY2BGR);
  } else {
    resized.copyTo(bgr);
  }
  const chw = toBgrFloatCHWFromBgr(bgr.data, dstW, dstH, config.normalize);
  resized.delete();
  bgr.delete();
  return {
    tensor: new ort.Tensor("float32", chw, [1, 3, dstH, dstW]),
    srcW,
    srcH,
    dstW,
    dstH
  };
}
function getDetMap(outputTensor) {
  const dims = outputTensor.dims;
  const data = outputTensor.data;
  if (dims.length === 4) return { data, h: dims[2], w: dims[3] };
  if (dims.length === 3) return { data, h: dims[1], w: dims[2] };
  throw new Error(`Unexpected det output dims: [${dims.join(", ")}]`);
}
function createBatchDetTensor(ort, preps, maxH, maxW) {
  const batch = preps.length;
  const plane = 3 * maxH * maxW;
  const out = new Float32Array(batch * plane);
  for (let i = 0; i < batch; i += 1) {
    const prep = preps[i];
    const chw = prep.tensor.data;
    const { dstH, dstW } = prep;
    const base = i * plane;
    for (let c = 0; c < 3; c += 1) {
      const srcChannelBase = c * dstH * dstW;
      const dstChannelBase = base + c * maxH * maxW;
      for (let y = 0; y < dstH; y += 1) {
        const srcRow = srcChannelBase + y * dstW;
        const dstRow = dstChannelBase + y * maxW;
        out.set(chw.subarray(srcRow, srcRow + dstW), dstRow);
      }
    }
  }
  return new ort.Tensor("float32", out, [batch, 3, maxH, maxW]);
}
function packDetBatchTensor(ort, preps) {
  const maxH = Math.max(...preps.map((p) => p.dstH));
  const maxW = Math.max(...preps.map((p) => p.dstW));
  return createBatchDetTensor(ort, preps, maxH, maxW);
}
function batchDetOutputPlaneOffset(dims, batchIndex) {
  const tail = dims.slice(1).reduce((a, b) => a * b, 1);
  return batchIndex * tail;
}
function detFeatureCropDims(dstH, dstW, maxH, maxW, ohFull, owFull) {
  const cropOh = Math.max(1, Math.min(ohFull, Math.round(ohFull * dstH / maxH)));
  const cropOw = Math.max(1, Math.min(owFull, Math.round(owFull * dstW / maxW)));
  return { cropOh, cropOw };
}
function sliceBatchedDetOutputPlane(ort, fullOutput, batchIndex, cropOh, cropOw, ohFull, owFull) {
  const data = fullOutput.data;
  const dims = fullOutput.dims;
  const base = batchDetOutputPlaneOffset(dims, batchIndex);
  const out = new Float32Array(cropOh * cropOw);
  for (let r = 0; r < cropOh; r += 1) {
    const rowStart = base + r * owFull;
    out.set(data.subarray(rowStart, rowStart + cropOw), r * cropOw);
  }
  return new ort.Tensor("float32", out, [1, 1, cropOh, cropOw]);
}
function postprocess$1(context, fullOutput, preps, params) {
  const { cv, ort, config } = context;
  const od = fullOutput.dims;
  if (od.length !== 3 && od.length !== 4) {
    throw new Error(`Unexpected det output dims: [${od.join(", ")}]`);
  }
  const ohFull = od.length === 4 ? od[2] : od[1];
  const owFull = od.length === 4 ? od[3] : od[2];
  const nOut = od.length === 4 ? od[0] : preps.length === 1 ? 1 : od[0];
  if (nOut !== preps.length) {
    throw new Error(
      `Detection batch output N=${String(nOut)} does not match input batch ${String(preps.length)}`
    );
  }
  const maxH = Math.max(...preps.map((p) => p.dstH));
  const maxW = Math.max(...preps.map((p) => p.dstW));
  const items = [];
  for (let i = 0; i < preps.length; i += 1) {
    const prep = preps[i];
    const { cropOh, cropOw } = detFeatureCropDims(prep.dstH, prep.dstW, maxH, maxW, ohFull, owFull);
    const planeTensor = sliceBatchedDetOutputPlane(
      ort,
      fullOutput,
      i,
      cropOh,
      cropOw,
      ohFull,
      owFull
    );
    const boxes = decodeDetOutput(
      { cv, config },
      planeTensor,
      prep,
      params.thresh,
      params.boxThresh,
      params.unclipRatio
    );
    items.push({ prep, boxes });
  }
  return items;
}
function decodeDetOutput(context, detOutput, meta, detThresh, boxThresh, unclipRatio) {
  const { cv, config } = context;
  const { data, h, w } = getDetMap(detOutput);
  const pred = cv.matFromArray(h, w, cv.CV_32FC1, data);
  const maskData = new Uint8Array(h * w);
  for (let i = 0; i < data.length; i += 1) {
    maskData[i] = data[i] > detThresh ? 255 : 0;
  }
  const bitmap = cv.matFromArray(h, w, cv.CV_8UC1, maskData);
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(bitmap, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
  const boxes = [];
  const candidateCount = Math.min(config.postprocess.maxCandidates, contours.size());
  for (let i = 0; i < candidateCount; i += 1) {
    const contour = contours.get(i);
    if (contour.rows < 4) {
      contour.delete();
      continue;
    }
    const points = [];
    for (let row = 0; row < contour.rows; row += 1) {
      points.push([contour.data32S[row * 2], contour.data32S[row * 2 + 1]]);
    }
    const mini = getMiniBoxFromPoints(cv, points);
    if (mini.side < DET_BOX_MIN_SIZE) {
      contour.delete();
      continue;
    }
    const score = boxScoreFast(cv, pred, mini.box);
    if (score < boxThresh) {
      contour.delete();
      continue;
    }
    const expanded = unclip(mini.box, unclipRatio);
    if (!expanded || expanded.length < 4) {
      contour.delete();
      continue;
    }
    const miniUnclip = getMiniBoxFromPoints(cv, expanded);
    if (miniUnclip.side < DET_BOX_MIN_SIZE + 2) {
      contour.delete();
      continue;
    }
    const poly = miniUnclip.box.map((point) => [
      clamp(Math.round(point[0] * meta.srcW / Math.max(1, w)), 0, meta.srcW),
      clamp(Math.round(point[1] * meta.srcH / Math.max(1, h)), 0, meta.srcH)
    ]);
    boxes.push({ poly, score });
    contour.delete();
  }
  pred.delete();
  bitmap.delete();
  contours.delete();
  hierarchy.delete();
  boxes.sort((a, b) => a.poly[0][1] - b.poly[0][1] || a.poly[0][0] - b.poly[0][0]);
  for (let i = 0; i < boxes.length - 1; i += 1) {
    for (let j = i; j >= 0; j -= 1) {
      if (Math.abs(boxes[j + 1].poly[0][1] - boxes[j].poly[0][1]) < 10 && boxes[j + 1].poly[0][0] < boxes[j].poly[0][0]) {
        const tmp = boxes[j];
        boxes[j] = boxes[j + 1];
        boxes[j + 1] = tmp;
      } else {
        break;
      }
    }
  }
  return boxes;
}
const DEFAULT_REC_ALPHANUMERIC_DICT = "0123456789abcdefghijklmnopqrstuvwxyz".split("");
const REC_NORMALIZE = Object.freeze({
  mean: [0.5, 0.5, 0.5],
  std: [0.5, 0.5, 0.5],
  scale: 1 / 255
});
const DEFAULT_REC_MODEL_PARSE_FALLBACKS = Object.freeze({
  imageShape: [3, 48, 320],
  charDict: []
});
const MAX_REC_WIDTH = 3200;
const DEFAULT_REC_MODEL_CONFIG = Object.freeze({
  ...DEFAULT_REC_MODEL_PARSE_FALLBACKS
});
function parseRecModelConfigText(text) {
  const parsed = parseInferenceConfigText(text);
  const preProcess = parsed.PreProcess;
  const transformOps = preProcess == null ? void 0 : preProcess.transform_ops;
  const resize = getTransformOp(transformOps, "RecResizeImg");
  const postprocess2 = parsed.PostProcess || {};
  const baseCharDict = postprocess2.character_dict;
  const imageShape = resize == null ? void 0 : resize.image_shape;
  if (!imageShape || !Array.isArray(imageShape) || imageShape.length < 3) {
    throw new Error("RecResizeImg.image_shape is required in rec inference.yml");
  }
  const charDict = Array.isArray(baseCharDict) && baseCharDict.length > 0 ? [...baseCharDict, " "] : [...DEFAULT_REC_ALPHANUMERIC_DICT, " "];
  return {
    imageShape,
    charDict
  };
}
async function createRecModel({
  ort,
  modelBytes,
  configText,
  backend,
  webgpuState,
  batchSize: batchSizeArg
}) {
  assertModelResources("Recognition", {
    model: modelBytes,
    config: configText
  });
  const config = parseRecModelConfigText(configText);
  const defaultBatchSize = Math.max(1, batchSizeArg ?? 1);
  let sessionState = await createRecModelSession(
    ort,
    modelBytes,
    backend,
    webgpuState
  );
  return {
    kind: "rec",
    config,
    get provider() {
      return (sessionState == null ? void 0 : sessionState.provider) || "";
    },
    async predict(cv, mats, overrides) {
      if (!(sessionState == null ? void 0 : sessionState.session)) {
        throw new Error("Recognition model session is not initialized.");
      }
      const batchSize = resolveRuntimeBatchSize(overrides == null ? void 0 : overrides.batchSize, defaultBatchSize);
      const ctx = { cv, config };
      const samples = preprocess(ctx, mats);
      const charDict = config.charDict;
      const ordered = samples.slice().sort((a, b) => a.width - b.width);
      const decoded = [];
      const targetH = config.imageShape[1];
      for (const batch of chunkArray(ordered, batchSize)) {
        const inputTensor = packRecBatchTensor(ort, batch, targetH);
        const output = await runInference(sessionState.session, inputTensor);
        const batchResults = postprocess(output, charDict);
        for (let index = 0; index < batchResults.length; index += 1) {
          decoded.push({
            inputIndex: batch[index].inputIndex,
            ...batchResults[index]
          });
        }
      }
      decoded.sort((a, b) => a.inputIndex - b.inputIndex);
      return decoded.map(({ text, score }) => ({ text, score }));
    },
    async dispose() {
      await releaseSessions(sessionState == null ? void 0 : sessionState.session);
      sessionState = null;
    }
  };
}
async function createRecModelSession(ort, modelBytes, backend, webgpuState) {
  const providerCandidates = getProviderCandidates(backend, webgpuState);
  return withTimeout(
    createSession(ort, modelBytes, providerCandidates),
    6e4,
    "Recognition model"
  );
}
function preprocess(context, mats) {
  const samples = [];
  for (let i = 0; i < mats.length; i += 1) {
    samples.push(preprocessSample(context, mats[i], i));
  }
  return samples;
}
function preprocessSample(context, cropMat, inputIndex) {
  const { cv, config } = context;
  const [channels, targetH, baseW] = config.imageShape;
  const srcW = cropMat.cols;
  const srcH = cropMat.rows;
  if (channels !== 3) {
    throw new Error(`Unexpected recognition channels: ${String(channels)}`);
  }
  const ratio = srcW / Math.max(1, srcH);
  const maxWhRatio = Math.max(baseW / Math.max(1, targetH), ratio);
  const recW = clamp(Math.trunc(targetH * maxWhRatio), 1, MAX_REC_WIDTH);
  const resizedW = Math.min(recW, Math.ceil(targetH * ratio));
  const resized = new cv.Mat();
  const bgr = new cv.Mat();
  cv.resize(cropMat, resized, new cv.Size(resizedW, targetH), 0, 0, cv.INTER_LINEAR);
  if (resized.channels() === 4) {
    cv.cvtColor(resized, bgr, cv.COLOR_RGBA2BGR);
  } else if (resized.channels() === 1) {
    cv.cvtColor(resized, bgr, cv.COLOR_GRAY2BGR);
  } else {
    resized.copyTo(bgr);
  }
  const resizedChw = toBgrFloatCHWFromBgr(bgr.data, resizedW, targetH, REC_NORMALIZE);
  const chw = new Float32Array(3 * targetH * recW);
  const dstPerChannel = targetH * recW;
  const srcPerChannel = targetH * resizedW;
  for (let channel = 0; channel < 3; channel += 1) {
    for (let row = 0; row < targetH; row += 1) {
      const srcStart = channel * srcPerChannel + row * resizedW;
      const dstStart = channel * dstPerChannel + row * recW;
      chw.set(resizedChw.subarray(srcStart, srcStart + resizedW), dstStart);
    }
  }
  bgr.delete();
  resized.delete();
  return { inputIndex, width: recW, chw };
}
function createBatchTensor(ort, samples, maxW, targetH) {
  const batch = samples.length;
  const out = new Float32Array(batch * 3 * targetH * maxW);
  const dstPerChannel = targetH * maxW;
  for (let index = 0; index < batch; index += 1) {
    const sample = samples[index];
    const srcW = sample.width;
    const srcPerChannel = targetH * srcW;
    for (let channel = 0; channel < 3; channel += 1) {
      const srcBase = channel * srcPerChannel;
      const dstBase = index * (3 * dstPerChannel) + channel * dstPerChannel;
      for (let row = 0; row < targetH; row += 1) {
        const srcStart = srcBase + row * srcW;
        const dstStart = dstBase + row * maxW;
        out.set(sample.chw.subarray(srcStart, srcStart + srcW), dstStart);
      }
    }
  }
  return new ort.Tensor("float32", out, [batch, 3, targetH, maxW]);
}
function packRecBatchTensor(ort, samples, targetH) {
  const maxW = samples.reduce((acc, sample) => Math.max(acc, sample.width), 1);
  return createBatchTensor(ort, samples, maxW, targetH);
}
function decodeCTCSample(data, offset, timeSteps, classes, charDict) {
  let prevIdx = -1;
  let text = "";
  const probs = [];
  for (let step = 0; step < timeSteps; step += 1) {
    let maxIdx = 0;
    let maxVal = -Infinity;
    const stepOffset = offset + step * classes;
    for (let cls = 0; cls < classes; cls += 1) {
      const value = data[stepOffset + cls];
      if (value > maxVal) {
        maxVal = value;
        maxIdx = cls;
      }
    }
    if (maxIdx > 0 && maxIdx !== prevIdx) {
      const dictIdx = maxIdx - 1;
      if (dictIdx >= 0 && dictIdx < charDict.length) {
        text += charDict[dictIdx];
        probs.push(maxVal);
      }
    }
    prevIdx = maxIdx;
  }
  const score = probs.length ? probs.reduce((a, b) => a + b, 0) / probs.length : 0;
  return { text, score };
}
function postprocess(output, charDict) {
  const dims = output.dims;
  if (dims.length !== 3) {
    throw new Error(`Unexpected rec output dims: [${dims.join(", ")}]`);
  }
  const sampleCount = dims[0];
  const timeSteps = dims[1];
  const classes = dims[2];
  const data = output.data;
  const stride = timeSteps * classes;
  const results = [];
  for (let index = 0; index < sampleCount; index += 1) {
    results.push(decodeCTCSample(data, index * stride, timeSteps, classes, charDict));
  }
  return results;
}
function cropByPoly(cv, srcMat, poly) {
  const ordered = getMiniBoxFromPoints(cv, poly).box;
  const widthTop = Math.hypot(ordered[1][0] - ordered[0][0], ordered[1][1] - ordered[0][1]);
  const widthBottom = Math.hypot(ordered[2][0] - ordered[3][0], ordered[2][1] - ordered[3][1]);
  const heightLeft = Math.hypot(ordered[3][0] - ordered[0][0], ordered[3][1] - ordered[0][1]);
  const heightRight = Math.hypot(ordered[2][0] - ordered[1][0], ordered[2][1] - ordered[1][1]);
  const cropW = Math.max(1, Math.floor(Math.max(widthTop, widthBottom)));
  const cropH = Math.max(1, Math.floor(Math.max(heightLeft, heightRight)));
  const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
    ordered[0][0],
    ordered[0][1],
    ordered[1][0],
    ordered[1][1],
    ordered[2][0],
    ordered[2][1],
    ordered[3][0],
    ordered[3][1]
  ]);
  const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, cropW, 0, cropW, cropH, 0, cropH]);
  const transform = cv.getPerspectiveTransform(srcTri, dstTri);
  const warped = new cv.Mat();
  cv.warpPerspective(
    srcMat,
    warped,
    transform,
    new cv.Size(cropW, cropH),
    cv.INTER_CUBIC,
    cv.BORDER_REPLICATE,
    new cv.Scalar()
  );
  srcTri.delete();
  dstTri.delete();
  transform.delete();
  if (warped.rows / Math.max(1, warped.cols) >= 1.5) {
    const rotated = new cv.Mat();
    cv.rotate(warped, rotated, cv.ROTATE_90_COUNTERCLOCKWISE);
    warped.delete();
    return rotated;
  }
  return warped;
}
let cachedCvPromise = null;
async function getOpenCv() {
  let cv;
  if (cvModule instanceof Promise) {
    cv = await cvModule;
  } else {
    const mod = cvModule;
    if (mod.Mat) {
      cv = cvModule;
    } else {
      await new Promise((resolve) => {
        mod.onRuntimeInitialized = () => {
          resolve();
        };
      });
      cv = cvModule;
    }
  }
  return { cv };
}
async function initOpenCvRuntime() {
  if (!cachedCvPromise) {
    cachedCvPromise = getOpenCv().catch((error) => {
      cachedCvPromise = null;
      throw error;
    });
  }
  return cachedCvPromise;
}
function firstDefined(...values) {
  for (const value of values) {
    if (value !== void 0 && value !== null) {
      return value;
    }
  }
  return void 0;
}
function toNumberOrUndefined(value) {
  if (value === void 0 || value === null) return void 0;
  const num = Number(value);
  return Number.isFinite(num) ? num : void 0;
}
function getOcrRuntimeParams(config, defaults = {}, params = {}) {
  return {
    det: {
      limitSideLen: toNumberOrUndefined(
        firstDefined(
          params.text_det_limit_side_len,
          params.textDetLimitSideLen,
          defaults.text_det_limit_side_len,
          defaults.textDetLimitSideLen,
          config.det.resizeLong
        )
      ),
      limitType: firstDefined(
        params.text_det_limit_type,
        params.textDetLimitType,
        defaults.text_det_limit_type,
        defaults.textDetLimitType,
        config.det.limitType
      ),
      maxSideLimit: toNumberOrUndefined(
        firstDefined(
          params.text_det_max_side_limit,
          params.textDetMaxSideLimit,
          defaults.text_det_max_side_limit,
          defaults.textDetMaxSideLimit,
          config.det.maxSideLimit
        )
      ),
      thresh: toNumberOrUndefined(
        firstDefined(
          params.text_det_thresh,
          params.textDetThresh,
          defaults.text_det_thresh,
          defaults.textDetThresh,
          config.det.postprocess.thresh
        )
      ),
      boxThresh: toNumberOrUndefined(
        firstDefined(
          params.text_det_box_thresh,
          params.textDetBoxThresh,
          defaults.text_det_box_thresh,
          defaults.textDetBoxThresh,
          config.det.postprocess.boxThresh
        )
      ),
      unclipRatio: toNumberOrUndefined(
        firstDefined(
          params.text_det_unclip_ratio,
          params.textDetUnclipRatio,
          defaults.text_det_unclip_ratio,
          defaults.textDetUnclipRatio,
          config.det.postprocess.unclipRatio
        )
      )
    },
    pipeline: {
      scoreThresh: Number(
        firstDefined(
          params.text_rec_score_thresh,
          params.textRecScoreThresh,
          defaults.text_rec_score_thresh,
          defaults.textRecScoreThresh,
          0
        )
      )
    }
  };
}
const DEFAULT_OCR_PIPELINE_CONFIG_TEXT = `
pipeline_name: OCR

text_type: general

use_doc_preprocessor: False
use_textline_orientation: False

SubPipelines:
  DocPreprocessor:
    pipeline_name: doc_preprocessor
    use_doc_orientation_classify: False
    use_doc_unwarping: False
    SubModules:
      DocOrientationClassify:
        module_name: doc_text_orientation
        model_name: PP-LCNet_x1_0_doc_ori
        model_dir: null
      DocUnwarping:
        module_name: image_unwarping
        model_name: UVDoc
        model_dir: null

SubModules:
  TextDetection:
    module_name: text_detection
    model_name: PP-OCRv5_mobile_det
    model_dir: null
    limit_side_len: 64
    limit_type: min
    max_side_limit: 4000
    thresh: 0.3
    box_thresh: 0.6
    unclip_ratio: 1.5
  TextLineOrientation:
    module_name: textline_orientation
    model_name: PP-LCNet_x1_0_textline_ori
    model_dir: null
    batch_size: 6
  TextRecognition:
    module_name: text_recognition
    model_name: PP-OCRv5_mobile_rec
    model_dir: null
    batch_size: 6
    score_thresh: 0.0
`.trimStart();
const DEFAULT_OCR_CONFIG = {
  det: DEFAULT_DET_MODEL_CONFIG,
  rec: DEFAULT_REC_MODEL_CONFIG
};
const DEFAULT_NORMALIZED_PIPELINE_CONFIG = normalizeOcrPipelineConfig(
  DEFAULT_OCR_PIPELINE_CONFIG_TEXT
);
const DEFAULT_MODEL_SELECTION = Object.freeze({
  ...DEFAULT_NORMALIZED_PIPELINE_CONFIG.modelSelection
});
const DEFAULT_LANG_VERSION_MODEL_SELECTION = Object.freeze({
  ...DEFAULT_MODEL_SELECTION
});
const PP_OCRV6_LANG_VERSION_MODEL_SELECTION = Object.freeze({
  textDetectionModelName: "PP-OCRv6_small_det",
  textRecognitionModelName: "PP-OCRv6_small_rec"
});
const _LATIN_LANGS = /* @__PURE__ */ new Set([
  "af",
  "az",
  "bs",
  "cs",
  "cy",
  "da",
  "de",
  "es",
  "et",
  "fr",
  "ga",
  "hr",
  "hu",
  "id",
  "is",
  "it",
  "ku",
  "la",
  "lt",
  "lv",
  "mi",
  "ms",
  "mt",
  "nl",
  "no",
  "oc",
  "pi",
  "pl",
  "pt",
  "ro",
  "rs_latin",
  "sk",
  "sl",
  "sq",
  "sv",
  "sw",
  "tl",
  "tr",
  "uz",
  "vi",
  "french",
  "german",
  "fi",
  "eu",
  "gl",
  "lb",
  "rm",
  "ca",
  "qu"
]);
const _PPOCRV6_UNSUPPORTED_LATIN_LANGS = /* @__PURE__ */ new Set(["pi"]);
const _PPOCRV6_LANGS = /* @__PURE__ */ new Set([
  "ch",
  "chinese_cht",
  "en",
  "japan",
  ...[..._LATIN_LANGS].filter((lang) => !_PPOCRV6_UNSUPPORTED_LATIN_LANGS.has(lang))
]);
function isPpOcrV6Lang(lang) {
  return _PPOCRV6_LANGS.has(lang);
}
const OCR_MODEL_ROLES = Object.freeze([
  {
    assetKey: "det",
    modelRole: "TextDetection",
    selectionKey: "textDetectionModelName",
    nameAliases: ["text_detection_model_name", "textDetectionModelName"],
    assetAliases: ["textDetectionModelAsset", "text_detection_model_dir", "textDetectionModelDir"],
    nameLabel: "text detection model name",
    assetLabel: "text detection model asset",
    assetRequirementError: "text_detection_model_dir requires text_detection_model_name."
  },
  {
    assetKey: "rec",
    modelRole: "TextRecognition",
    selectionKey: "textRecognitionModelName",
    nameAliases: ["text_recognition_model_name", "textRecognitionModelName"],
    assetAliases: [
      "textRecognitionModelAsset",
      "text_recognition_model_dir",
      "textRecognitionModelDir"
    ],
    nameLabel: "text recognition model name",
    assetLabel: "text recognition model asset",
    assetRequirementError: "text_recognition_model_dir requires text_recognition_model_name."
  }
]);
const SUPPORTED_LANG_VERSION_MODELS = /* @__PURE__ */ new Map([
  ["ch::PP-OCRv5", DEFAULT_LANG_VERSION_MODEL_SELECTION],
  ["chinese_cht::PP-OCRv5", DEFAULT_LANG_VERSION_MODEL_SELECTION],
  ["en::PP-OCRv5", DEFAULT_LANG_VERSION_MODEL_SELECTION],
  ["japan::PP-OCRv5", DEFAULT_LANG_VERSION_MODEL_SELECTION]
]);
function readAliasedOption(options, aliases, label) {
  let resolved;
  let hasResolvedValue = false;
  for (const alias of aliases) {
    if (!(alias in options)) continue;
    const value = options[alias];
    if (!hasResolvedValue) {
      resolved = value;
      hasResolvedValue = true;
      continue;
    }
    if (value !== resolved) {
      throw new Error(`Conflicting values provided for ${label}: ${aliases.join(", ")}.`);
    }
  }
  return hasResolvedValue ? resolved : void 0;
}
function isLimitType(value) {
  return value === "min" || value === "max";
}
function overlayPipelineRuntimeDefaults(base, explicit) {
  const next = { ...base };
  for (const key of Object.keys(explicit)) {
    const value = explicit[key];
    if (value === void 0) continue;
    next[key] = value;
  }
  return next;
}
function readExplicitPipelineRuntimeDefaults(options) {
  const out = {};
  const limitSide = readAliasedOption(
    options,
    ["text_det_limit_side_len", "textDetLimitSideLen"],
    "text_det_limit_side_len"
  );
  if (limitSide !== void 0) {
    const n = toFiniteNumber(limitSide);
    if (n !== void 0) out.text_det_limit_side_len = n;
  }
  const limitType = readAliasedOption(
    options,
    ["text_det_limit_type", "textDetLimitType"],
    "text_det_limit_type"
  );
  if (limitType !== void 0 && isLimitType(limitType)) {
    out.text_det_limit_type = limitType;
  }
  const maxSide = readAliasedOption(
    options,
    ["text_det_max_side_limit", "textDetMaxSideLimit"],
    "text_det_max_side_limit"
  );
  if (maxSide !== void 0) {
    const n = toFiniteNumber(maxSide);
    if (n !== void 0) out.text_det_max_side_limit = n;
  }
  const detThresh = readAliasedOption(
    options,
    ["text_det_thresh", "textDetThresh"],
    "text_det_thresh"
  );
  if (detThresh !== void 0) {
    const n = toFiniteNumber(detThresh);
    if (n !== void 0) out.text_det_thresh = n;
  }
  const boxThresh = readAliasedOption(
    options,
    ["text_det_box_thresh", "textDetBoxThresh"],
    "text_det_box_thresh"
  );
  if (boxThresh !== void 0) {
    const n = toFiniteNumber(boxThresh);
    if (n !== void 0) out.text_det_box_thresh = n;
  }
  const unclip2 = readAliasedOption(
    options,
    ["text_det_unclip_ratio", "textDetUnclipRatio"],
    "text_det_unclip_ratio"
  );
  if (unclip2 !== void 0) {
    const n = toFiniteNumber(unclip2);
    if (n !== void 0) out.text_det_unclip_ratio = n;
  }
  const recScore = readAliasedOption(
    options,
    ["text_rec_score_thresh", "textRecScoreThresh"],
    "text_rec_score_thresh"
  );
  if (recScore !== void 0) {
    const n = toFiniteNumber(recScore);
    if (n !== void 0) out.text_rec_score_thresh = n;
  }
  return out;
}
function toBatchSizeOption(value) {
  const n = toFiniteNumber(value);
  return n !== void 0 && n >= 1 ? Math.floor(n) : void 0;
}
function readExplicitBatchSizes(options) {
  return {
    det: toBatchSizeOption(
      readAliasedOption(
        options,
        ["textDetectionBatchSize", "text_detection_batch_size"],
        "textDetectionBatchSize"
      )
    ),
    rec: toBatchSizeOption(
      readAliasedOption(
        options,
        ["textRecognitionBatchSize", "text_recognition_batch_size"],
        "textRecognitionBatchSize"
      )
    ),
    pipeline: toBatchSizeOption(
      readAliasedOption(
        options,
        ["pipelineBatchSize", "pipeline_batch_size", "batch_size"],
        "pipelineBatchSize"
      )
    )
  };
}
function mergeNormalizedPipelineConfigWithExplicit(normalized, options) {
  const explicitRuntime = readExplicitPipelineRuntimeDefaults(options);
  const explicitBatch = readExplicitBatchSizes(options);
  const merged = deepClone(normalized);
  merged.runtimeDefaults = overlayPipelineRuntimeDefaults(merged.runtimeDefaults, explicitRuntime);
  if (explicitBatch.det !== void 0) {
    merged.textDetectionBatchSize = explicitBatch.det;
  }
  if (explicitBatch.rec !== void 0) {
    merged.textRecognitionBatchSize = explicitBatch.rec;
  }
  if (explicitBatch.pipeline !== void 0) {
    merged.pipelineBatchSize = explicitBatch.pipeline;
  }
  return merged;
}
function resolveWarningBehavior(value) {
  if (value === "ignore" || value === "error") return value;
  return "warn";
}
function emitPipelineWarnings(warnings, behavior) {
  if (!warnings.length || behavior === "ignore") return;
  if (behavior === "error") {
    throw new Error(warnings.join(" "));
  }
  for (const warning of warnings) {
    console.warn(`[PaddleOCR.js] ${warning}`);
  }
}
function resolveModelAssetByName(_modelRole, modelName) {
  const asset = DEFAULT_MODEL_ASSETS[modelName];
  if (!asset) {
    throw new Error(`Unknown model asset "${modelName}".`);
  }
  return { url: asset.url };
}
function getSelectedModelName(baseSelection, configSelection, explicitSelection, selectionKey) {
  return (explicitSelection == null ? void 0 : explicitSelection[selectionKey]) ?? (configSelection == null ? void 0 : configSelection[selectionKey]) ?? (baseSelection == null ? void 0 : baseSelection[selectionKey]) ?? null;
}
function createResolvedModelSelection(baseSelection, configSelection, explicitSelection) {
  return Object.fromEntries(
    OCR_MODEL_ROLES.map((role) => [
      role.selectionKey,
      getSelectedModelName(baseSelection, configSelection, explicitSelection, role.selectionKey)
    ])
  );
}
function validateLoadedModelName(modelRole, expectedModelName, configText) {
  if (!expectedModelName) {
    throw new Error(`${modelRole} model selection must define model_name.`);
  }
  const declaredModelName = extractInferenceModelName(configText);
  if (!declaredModelName) {
    throw new Error(`${modelRole} in inference.yml must define model_name.`);
  }
  if (declaredModelName !== expectedModelName) {
    throw new Error(
      `${modelRole} in inference.yml declares model_name "${declaredModelName}" but requested model_name is "${expectedModelName}".`
    );
  }
}
function resolveSelectedAsset(assetRole, modelRole, selectionKey, baseSelection, configSelection, explicitSelection, configAssets, explicitAssets) {
  const explicitAsset = explicitAssets == null ? void 0 : explicitAssets[assetRole];
  if (explicitAsset) {
    return explicitAsset;
  }
  const explicitModelName = explicitSelection == null ? void 0 : explicitSelection[selectionKey];
  if (explicitModelName) {
    return resolveModelAssetByName(modelRole, explicitModelName);
  }
  const configAsset = configAssets == null ? void 0 : configAssets[assetRole];
  if (configAsset) {
    return configAsset;
  }
  const configModelName = configSelection == null ? void 0 : configSelection[selectionKey];
  if (configModelName) {
    return resolveModelAssetByName(modelRole, configModelName);
  }
  const baseModelName = baseSelection == null ? void 0 : baseSelection[selectionKey];
  if (baseModelName) {
    return resolveModelAssetByName(modelRole, baseModelName);
  }
  return null;
}
function createOcrAssets(baseSelection, configSelection, explicitSelection, configAssets, explicitAssets) {
  const assets = Object.fromEntries(
    OCR_MODEL_ROLES.map((role) => [
      role.assetKey,
      resolveSelectedAsset(
        role.assetKey,
        role.modelRole,
        role.selectionKey,
        baseSelection,
        configSelection,
        explicitSelection,
        configAssets,
        explicitAssets
      )
    ])
  );
  if (Object.values(assets).some((asset) => !asset)) {
    throw new Error("OCR model selection must define both detection and recognition models.");
  }
  return assets;
}
function getExplicitModelSelection(options) {
  const modelSelection = {};
  const assets = {};
  let hasAnyOption = false;
  for (const role of OCR_MODEL_ROLES) {
    const modelName = readAliasedOption(options, role.nameAliases, role.nameLabel);
    const asset = readAliasedOption(options, role.assetAliases, role.assetLabel);
    if (modelName !== void 0) {
      modelSelection[role.selectionKey] = modelName;
      hasAnyOption = true;
    }
    if (asset !== void 0) {
      if (modelName === void 0) {
        throw new Error(role.assetRequirementError);
      }
      assets[role.assetKey] = asset;
      hasAnyOption = true;
    }
  }
  if (!hasAnyOption) {
    return null;
  }
  return {
    modelSelection,
    assets
  };
}
function resolveBaseModelSelection(options, includeDefaultBase = false) {
  const ocrVersion = readAliasedOption(options, ["ocrVersion", "ocr_version"], "ocrVersion");
  if (!options.lang && !ocrVersion) {
    return includeDefaultBase ? DEFAULT_MODEL_SELECTION : null;
  }
  const lang = options.lang || "ch";
  const resolvedOcrVersion = ocrVersion || "PP-OCRv5";
  if (resolvedOcrVersion === "PP-OCRv6") {
    if (!isPpOcrV6Lang(lang)) {
      throw new Error(
        `Unsupported lang/ocrVersion combination: lang="${lang}", ocrVersion="${resolvedOcrVersion}".`
      );
    }
    return PP_OCRV6_LANG_VERSION_MODEL_SELECTION;
  }
  const modelSelection = SUPPORTED_LANG_VERSION_MODELS.get(`${lang}::${resolvedOcrVersion}`);
  if (!modelSelection) {
    throw new Error(
      `Unsupported lang/ocrVersion combination: lang="${lang}", ocrVersion="${resolvedOcrVersion}".`
    );
  }
  return modelSelection;
}
function resolveConstructionOptions(options = {}) {
  const pipelineInput = options.pipelineConfig;
  const userPipelineConfig = pipelineInput != null ? normalizeOcrPipelineConfig(pipelineInput) : null;
  const warningBehavior = resolveWarningBehavior(options.unsupportedBehavior);
  const warnings = (userPipelineConfig == null ? void 0 : userPipelineConfig.warnings) || [];
  const baseSelection = resolveBaseModelSelection(options, !userPipelineConfig);
  const configSelection = (userPipelineConfig == null ? void 0 : userPipelineConfig.modelSelection) || null;
  const configAssets = (userPipelineConfig == null ? void 0 : userPipelineConfig.assets) || null;
  const explicitOptions = getExplicitModelSelection(options);
  const explicitSelection = (explicitOptions == null ? void 0 : explicitOptions.modelSelection) || null;
  const explicitAssets = (explicitOptions == null ? void 0 : explicitOptions.assets) || null;
  const resolvedModelSelection = createResolvedModelSelection(
    baseSelection,
    configSelection,
    explicitSelection
  );
  const assets = createOcrAssets(
    baseSelection,
    configSelection,
    explicitSelection,
    configAssets,
    explicitAssets
  );
  const baseNormalized = userPipelineConfig ?? DEFAULT_NORMALIZED_PIPELINE_CONFIG;
  if (userPipelineConfig) {
    emitPipelineWarnings(warnings, warningBehavior);
  }
  const merged = mergeNormalizedPipelineConfigWithExplicit(baseNormalized, options);
  merged.modelSelection = resolvedModelSelection;
  merged.assets = { ...assets };
  return merged;
}
function resolveBackend(raw) {
  if (raw === "webgpu" || raw === "wasm") return raw;
  return "auto";
}
function normalizeOrtOptions(ortOptions = {}) {
  const backend = resolveBackend(ortOptions.backend);
  return {
    backend,
    ...ortOptions.wasmPaths !== void 0 ? { wasmPaths: ortOptions.wasmPaths } : {},
    ...ortOptions.numThreads !== void 0 ? { numThreads: ortOptions.numThreads } : {},
    ...ortOptions.simd !== void 0 ? { simd: ortOptions.simd } : {},
    ...ortOptions.proxy !== void 0 ? { proxy: ortOptions.proxy } : {}
  };
}
function resolveWorkerOptions(workerOption) {
  if (!workerOption) {
    return {
      enabled: false,
      createWorker: null
    };
  }
  if (workerOption === true) {
    return {
      enabled: true,
      createWorker: null
    };
  }
  if (typeof workerOption === "object") {
    const opts = workerOption;
    return {
      enabled: true,
      createWorker: typeof opts.createWorker === "function" ? opts.createWorker : null
    };
  }
  throw new Error("worker must be a boolean or an options object.");
}
function resolvePaddleOCROptions(options = {}) {
  return {
    pipelineConfig: resolveConstructionOptions(options),
    ortOptions: normalizeOrtOptions(options.ortOptions || {})
  };
}
function cloneDefaultOcrConfig() {
  return deepClone(DEFAULT_OCR_CONFIG);
}
function noopEnsureServedFromHttp() {
}
function getResolvedAssets(assets) {
  const det = assets == null ? void 0 : assets.det;
  const rec = assets == null ? void 0 : assets.rec;
  if (!det || typeof det !== "object" || !rec || typeof rec !== "object") {
    throw new Error(
      "PaddleOCRCore requires pre-resolved detection and recognition asset descriptors."
    );
  }
  return { det, rec };
}
class OcrPipelineRunner {
  constructor(options) {
    __publicField(this, "options");
    __publicField(this, "modelConfig");
    __publicField(this, "runtimeDefaults");
    __publicField(this, "cv");
    __publicField(this, "ort");
    __publicField(this, "detModel");
    __publicField(this, "recModel");
    __publicField(this, "webgpuState");
    __publicField(this, "pipelineConfig");
    __publicField(this, "lastInitializationSummary");
    __publicField(this, "ensureServedFromHttp");
    __publicField(this, "sourceToMat");
    this.options = options;
    this.modelConfig = cloneDefaultOcrConfig();
    this.pipelineConfig = options.pipelineConfig;
    this.runtimeDefaults = { ...options.pipelineConfig.runtimeDefaults };
    this.cv = null;
    this.ort = null;
    this.detModel = null;
    this.recModel = null;
    this.webgpuState = { available: false, reason: "" };
    this.lastInitializationSummary = null;
    this.ensureServedFromHttp = options.ensureServedFromHttp || noopEnsureServedFromHttp;
    this.sourceToMat = options.sourceToMat;
  }
  async initialize() {
    this.ensureServedFromHttp();
    const start = nowMs();
    const { cv } = await initOpenCvRuntime();
    this.cv = cv;
    const { ort, webgpuState, backend } = await initOrtRuntime(this.options.ortOptions || {});
    this.ort = ort;
    this.webgpuState = webgpuState;
    const assets = getResolvedAssets(this.pipelineConfig.assets);
    const fetchImpl = this.options.fetch || fetch;
    const loadedAssets = await Promise.all([
      loadModelAsset(assets.det, fetchImpl),
      loadModelAsset(assets.rec, fetchImpl)
    ]);
    validateLoadedModelName(
      "TextDetection",
      this.pipelineConfig.modelSelection.textDetectionModelName,
      loadedAssets[0].configText
    );
    validateLoadedModelName(
      "TextRecognition",
      this.pipelineConfig.modelSelection.textRecognitionModelName,
      loadedAssets[1].configText
    );
    await this.disposeModelsOnly();
    const detBatchSize = this.pipelineConfig.textDetectionBatchSize;
    const recBatchSize = this.pipelineConfig.textRecognitionBatchSize;
    const [detModel, recModel] = await Promise.all([
      createDetModel({
        ort: this.ort,
        modelBytes: loadedAssets[0].modelBytes,
        configText: loadedAssets[0].configText,
        backend,
        webgpuState,
        batchSize: detBatchSize
      }),
      createRecModel({
        ort: this.ort,
        modelBytes: loadedAssets[1].modelBytes,
        configText: loadedAssets[1].configText,
        backend,
        webgpuState,
        batchSize: recBatchSize
      })
    ]);
    this.detModel = detModel;
    this.recModel = recModel;
    this.modelConfig = {
      det: this.detModel.config,
      rec: this.recModel.config
    };
    const elapsed = nowMs() - start;
    this.lastInitializationSummary = {
      backend,
      webgpuAvailable: webgpuState.available,
      detProvider: this.detModel.provider,
      recProvider: this.recModel.provider,
      assets: loadedAssets.map((asset) => asset.download),
      elapsedMs: elapsed,
      pipelineConfigWarnings: this.pipelineConfig.warnings
    };
    return this.lastInitializationSummary;
  }
  getInitializationSummary() {
    return this.lastInitializationSummary;
  }
  getModelConfig() {
    return this.modelConfig;
  }
  async predict(input, params = {}) {
    var _a, _b, _c;
    if (!this.sourceToMat) {
      throw new Error("PaddleOCR source adapter is not configured.");
    }
    if (!this.detModel || !this.recModel || !this.cv || !this.ort) {
      await this.initialize();
    }
    const cv = this.cv;
    const detModel = this.detModel;
    const recModel = this.recModel;
    if (!cv || !detModel || !recModel) {
      throw new Error("Initialization did not complete. Call initialize() first.");
    }
    const sources = Array.isArray(input) ? input : [input];
    const sourceToMat2 = this.sourceToMat;
    const pipelineBatchSize = Math.max(1, Math.floor(this.pipelineConfig.pipelineBatchSize) || 1);
    const sourceBatches = chunkArray(sources, pipelineBatchSize);
    const totalStart = nowMs();
    const resolved = getOcrRuntimeParams(this.modelConfig, this.runtimeDefaults, params);
    let sumDetMs = 0;
    let sumRecMs = 0;
    const partials = [];
    for (const batchSources of sourceBatches) {
      const sourceImages = await Promise.all(
        batchSources.map((source) => Promise.resolve(sourceToMat2(cv, source)))
      );
      try {
        const detStart = nowMs();
        const detResults = await detModel.predict(
          cv,
          sourceImages.map((s) => s.mat),
          resolved.det
        );
        sumDetMs += nowMs() - detStart;
        const recStart = nowMs();
        const perImageItems = [];
        for (let imgIdx = 0; imgIdx < detResults.length; imgIdx += 1) {
          const detBoxes = ((_a = detResults[imgIdx]) == null ? void 0 : _a.boxes) ?? [];
          const cropMats = [];
          for (let boxIdx = 0; boxIdx < detBoxes.length; boxIdx += 1) {
            cropMats.push(cropByPoly(cv, sourceImages[imgIdx].mat, detBoxes[boxIdx].poly));
          }
          try {
            const recResults = cropMats.length ? await recModel.predict(cv, cropMats) : [];
            const items = [];
            for (let boxIdx = 0; boxIdx < recResults.length; boxIdx += 1) {
              const rec = recResults[boxIdx];
              if (rec.text && rec.score >= resolved.pipeline.scoreThresh) {
                items.push({
                  poly: detBoxes[boxIdx].poly,
                  text: rec.text,
                  score: rec.score
                });
              }
            }
            perImageItems.push(items);
          } finally {
            for (const mat of cropMats) {
              mat.delete();
            }
          }
        }
        sumRecMs += nowMs() - recStart;
        for (let i = 0; i < sourceImages.length; i += 1) {
          const sourceImage = sourceImages[i];
          const detBoxes = ((_b = detResults[i]) == null ? void 0 : _b.boxes) ?? [];
          const items = perImageItems[i] ?? [];
          partials.push({
            image: {
              width: sourceImage.width,
              height: sourceImage.height
            },
            items,
            detectedBoxes: detBoxes.length,
            recognizedCount: items.length
          });
        }
      } finally {
        for (const sourceImage of sourceImages) {
          sourceImage.dispose();
        }
      }
    }
    const totalElapsed = nowMs() - totalStart;
    const requestedBackend = ((_c = this.options.ortOptions) == null ? void 0 : _c.backend) ?? "auto";
    return partials.map(
      (p) => ({
        image: p.image,
        items: p.items,
        metrics: {
          detMs: sumDetMs,
          recMs: sumRecMs,
          totalMs: totalElapsed,
          detectedBoxes: p.detectedBoxes,
          recognizedCount: p.recognizedCount
        },
        runtime: {
          requestedBackend,
          detProvider: detModel.provider,
          recProvider: recModel.provider,
          webgpuAvailable: this.webgpuState.available
        }
      })
    );
  }
  async disposeModelsOnly() {
    var _a, _b;
    await Promise.all([(_a = this.detModel) == null ? void 0 : _a.dispose(), (_b = this.recModel) == null ? void 0 : _b.dispose()]);
    this.detModel = null;
    this.recModel = null;
  }
  async dispose() {
    await this.disposeModelsOnly();
  }
}
const REQUEST_KIND = "worker-transport-request";
const RESPONSE_KIND = "worker-transport-response";
function createTransportRequest(type, payload, requestId) {
  return {
    kind: REQUEST_KIND,
    type,
    payload,
    requestId
  };
}
function isTransportResponse(message) {
  return typeof message === "object" && message !== null && "kind" in message && message.kind === RESPONSE_KIND;
}
function deserializeError(error) {
  const normalized = error || {};
  const instance = new Error(normalized.message || "Unknown worker error.");
  instance.name = normalized.name || "Error";
  if (normalized.stack) {
    instance.stack = normalized.stack;
  }
  return instance;
}
class WorkerTransportClient {
  constructor(workerOptions = {}) {
    __publicField(this, "workerOptions");
    __publicField(this, "worker");
    __publicField(this, "pending");
    __publicField(this, "nextRequestId");
    __publicField(this, "disposed");
    this.workerOptions = workerOptions;
    this.worker = null;
    this.pending = /* @__PURE__ */ new Map();
    this.nextRequestId = 1;
    this.disposed = false;
  }
  ensureActive() {
    if (this.disposed) {
      throw new Error("Worker transport client has been disposed.");
    }
  }
  ensureWorker() {
    this.ensureActive();
    if (this.worker) {
      return this.worker;
    }
    const workerFactory = this.workerOptions.createWorker;
    if (typeof workerFactory !== "function") {
      throw new Error("Worker transport client requires a createWorker() factory.");
    }
    const worker = workerFactory();
    worker.onmessage = (event) => {
      const message = event.data;
      if (!isTransportResponse(message)) return;
      const pending = this.pending.get(message.requestId);
      if (!pending) return;
      this.pending.delete(message.requestId);
      if (message.status === "success") {
        pending.resolve(message.payload);
      } else {
        pending.reject(deserializeError(message.error));
      }
    };
    worker.onerror = (event) => {
      const error = new Error(event.message || "OCR worker failed.");
      for (const pending of this.pending.values()) {
        pending.reject(error);
      }
      this.pending.clear();
    };
    this.worker = worker;
    return worker;
  }
  request(type, payload, transferables = []) {
    const worker = this.ensureWorker();
    const requestId = this.nextRequestId;
    this.nextRequestId += 1;
    return new Promise((resolve, reject) => {
      this.pending.set(requestId, { resolve, reject });
      worker.postMessage(createTransportRequest(type, payload, requestId), transferables);
    });
  }
  disposeWorker() {
    if (!this.worker) {
      return;
    }
    this.worker.terminate();
    this.worker = null;
  }
  dispose() {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    for (const pending of this.pending.values()) {
      pending.reject(new Error("Worker transport client has been disposed."));
    }
    this.pending.clear();
    this.disposeWorker();
  }
}
function createWorkerTransportClient(workerOptions) {
  return new WorkerTransportClient(workerOptions);
}
function createDefaultWorker() {
  if (typeof Worker !== "function") {
    throw new Error("worker mode requires Web Worker support in this environment.");
  }
  return (() => { const _w = new URL("./assets/worker-entry-C9UNuyOJ.js", import.meta.url); return new Worker(_w, {
    type: "module"
  }); })();
}
class WorkerBackedPaddleOCR {
  constructor(options, transportClient) {
    __publicField(this, "options");
    __publicField(this, "lastInitializationSummary");
    __publicField(this, "modelConfig");
    __publicField(this, "transportClient");
    __publicField(this, "initPromise");
    __publicField(this, "disposed");
    this.options = options;
    this.lastInitializationSummary = null;
    this.modelConfig = cloneDefaultOcrConfig();
    this.transportClient = transportClient;
    this.initPromise = null;
    this.disposed = false;
  }
  ensureActive() {
    if (this.disposed) {
      throw new Error("PaddleOCR worker instance has been disposed.");
    }
  }
  async initialize() {
    this.ensureActive();
    if (this.lastInitializationSummary) {
      return this.lastInitializationSummary;
    }
    if (!this.initPromise) {
      const ortOpts = this.options.ortOptions || {};
      if (ortOpts["wasmPaths"] === void 0 && true) {
        console.warn(
          '[PaddleOCR.js] Worker mode: ortOptions.wasmPaths is not set — falling back to CDN (%s). For version consistency between main thread and worker, set ortOptions.wasmPaths to the path where your bundler outputs the onnxruntime-web WASM files (e.g. ortOptions: { wasmPaths: "/assets/" }).',
          "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/"
        );
      }
      const wasmCdnFallback = ortOpts["wasmPaths"] === void 0 && true ? { wasmPaths: "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/" } : {};
      this.initPromise = this.transportClient.request("init", {
        options: {
          ...this.options,
          ortOptions: {
            ...ortOpts,
            ...wasmCdnFallback,
            disableWasmProxy: true
          }
        }
      }).then((rawPayload) => {
        const payload = rawPayload;
        this.lastInitializationSummary = payload.summary;
        this.modelConfig = payload.modelConfig;
        return this.lastInitializationSummary;
      }).catch((error) => {
        this.initPromise = null;
        this.transportClient.dispose();
        throw error;
      });
    }
    return this.initPromise;
  }
  getInitializationSummary() {
    return this.lastInitializationSummary;
  }
  getModelConfig() {
    return this.modelConfig;
  }
  async predict(input, params = {}) {
    this.ensureActive();
    await this.initialize();
    const sources = Array.isArray(input) ? input : [input];
    const payloads = await Promise.all(
      sources.map(
        (source) => sourceToWorkerPayload(source)
      )
    );
    const combinedPayloads = payloads.map((p) => p.payload);
    const combinedTransferables = payloads.flatMap((p) => p.transferables);
    return this.transportClient.request(
      "predict",
      {
        sources: combinedPayloads,
        params
      },
      combinedTransferables
    );
  }
  async dispose() {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    try {
      await this.transportClient.request("dispose", {});
    } catch {
    }
    this.transportClient.dispose();
  }
}
function createWorkerBackedPaddleOCR(options, workerOptions = {}) {
  const transportClient = createWorkerTransportClient({
    ...workerOptions,
    createWorker: workerOptions.createWorker || createDefaultWorker
  });
  return new WorkerBackedPaddleOCR(options, transportClient);
}
class PaddleOCR extends OcrPipelineRunner {
  constructor(options) {
    super({
      ...options,
      ensureServedFromHttp,
      sourceToMat
    });
  }
  static async create(options = {}) {
    const workerOptions = resolveWorkerOptions(options.worker);
    if (workerOptions.enabled && options.fetch) {
      throw new Error("worker mode does not support a custom fetch implementation.");
    }
    const resolvedOptions = resolvePaddleOCROptions(options);
    const instance = workerOptions.enabled ? createWorkerBackedPaddleOCR(resolvedOptions, {
      createWorker: workerOptions.createWorker ?? void 0
    }) : new PaddleOCR({
      ...resolvedOptions,
      fetch: options.fetch
    });
    if (options.initialize !== false) {
      await instance.initialize();
    }
    return instance;
  }
}
export {
  PaddleOCR,
  normalizeOcrPipelineConfig,
  parseOcrPipelineConfigText
};
//# sourceMappingURL=index.mjs.map
