var Da=Object.defineProperty,Gg=Object.getOwnPropertyDescriptor,Hg=Object.getOwnPropertyNames,Fg=Object.prototype.hasOwnProperty,jg=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),P=(e,t,r)=>()=>{if(r)throw r[0];try{return e&&(t=e(e=0)),t}catch(i){throw r=[i],i}},Ht=(e,t)=>{for(var r in t)Da(e,r,{get:t[r],enumerable:!0})},Kg=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Hg(t))!Fg.call(e,a)&&a!==r&&Da(e,a,{get:()=>t[a],enumerable:!(i=Gg(t,a))||i.enumerable});return e},pr=e=>Kg(Da({},"__esModule",{value:!0}),e),Xt,ht,Lt,so,jd,Kd=P(()=>{"use strict";Xt=new Map,ht=[],Lt=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=Xt.get(e);if(i===void 0)Xt.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let a=ht.indexOf(e);a!==-1&&ht.splice(a,1);for(let n=0;n<ht.length;n++)if(Xt.get(ht[n]).priority<=r){ht.splice(n,0,e);return}ht.push(e)}return}throw new TypeError("not a valid backend")},so=async e=>{let t=Xt.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},jd=async e=>{let t=e.executionProviders||[],r=t.map(l=>typeof l=="string"?l:l.name),i=r.length===0?ht:r,a,n=[],s=new Set;for(let l of i){let p=await so(l);typeof p=="string"?n.push({name:l,err:p}):(a||(a=p),a===p&&s.add(l))}if(!a)throw new Error(`no available backend found. ERR: ${n.map(l=>`[${l.name}] ${l.err}`).join(", ")}`);for(let{name:l,err:p}of n)r.includes(l)&&console.warn(`removing requested execution provider "${l}" from session options because it is not available: ${p}`);let u=t.filter(l=>s.has(typeof l=="string"?l:l.name));return[a,new Proxy(e,{get:(l,p)=>p==="executionProviders"?u:Reflect.get(l,p)})]}}),Zg=P(()=>{"use strict";Kd()}),Zd,Xg=P(()=>{"use strict";Zd="1.30.0"}),$i,ze,Xd=P(()=>{"use strict";Xg(),$i="warning",ze={wasm:{},webgl:{},webgpu:{},versions:{common:Zd},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);$i=e}},get logLevel(){return $i}},Object.defineProperty(ze,"logLevel",{enumerable:!0})}),$e,Qg=P(()=>{"use strict";Xd(),$e=ze}),Qd,Yd,Yg=P(()=>{"use strict";Qd=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let a,n;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],n=e.dims[3]):(a=e.dims[3],n=e.dims[2]);let s=t?.format!==void 0?t.format:"RGB",u=t?.norm,l,p;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],0],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?p=[0,0,0,0]:typeof u.bias=="number"?p=[u.bias,u.bias,u.bias,u.bias]:(p=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(p[3]=u.bias[3]));let f=n*a,h=0,g=f,_=f*2,y=-1;s==="RGBA"?(h=0,g=f,_=f*2,y=f*3):s==="RGB"?(h=0,g=f,_=f*2):s==="RBG"&&(h=0,_=f,g=f*2);for(let $=0;$<n;$++)for(let S=0;S<a;S++){let x=(e.data[h++]-p[0])*l[0],b=(e.data[g++]-p[1])*l[1],E=(e.data[_++]-p[2])*l[2],k=y===-1?255:(e.data[y++]-p[3])*l[3];i.fillStyle="rgba("+x+","+b+","+E+","+k+")",i.fillRect(S,$,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Yd=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let a,n,s;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],n=e.dims[1],s=e.dims[3]):(a=e.dims[3],n=e.dims[2],s=e.dims[1]);let u=t!==void 0&&t.format!==void 0?t.format:"RGB",l=t?.norm,p,f;l===void 0||l.mean===void 0?p=[255,255,255,255]:typeof l.mean=="number"?p=[l.mean,l.mean,l.mean,l.mean]:(p=[l.mean[0],l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(p[3]=l.mean[3])),l===void 0||l.bias===void 0?f=[0,0,0,0]:typeof l.bias=="number"?f=[l.bias,l.bias,l.bias,l.bias]:(f=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(f[3]=l.bias[3]));let h=n*a;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let g=4,_=0,y=1,$=2,S=3,x=0,b=h,E=h*2,k=-1;u==="RGBA"?(x=0,b=h,E=h*2,k=h*3):u==="RGB"?(x=0,b=h,E=h*2):u==="RBG"&&(x=0,E=h,b=h*2),i=r.createImageData(a,n);for(let I=0;I<n*a;_+=g,y+=g,$+=g,S+=g,I++)i.data[_]=(e.data[x++]-f[0])*p[0],i.data[y]=(e.data[b++]-f[1])*p[1],i.data[$]=(e.data[E++]-f[2])*p[2],i.data[S]=k===-1?255:(e.data[k++]-f[3])*p[3]}else throw new Error("Can not access image data");return i}}),Tr,Jd,ep,tp,rp,ip,Jg=P(()=>{"use strict";Ua(),Tr=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,a=t.norm??{mean:255,bias:0},n,s;typeof a.mean=="number"?n=[a.mean,a.mean,a.mean,a.mean]:n=[a.mean[0],a.mean[1],a.mean[2],a.mean[3]??255],typeof a.bias=="number"?s=[a.bias,a.bias,a.bias,a.bias]:s=[a.bias[0],a.bias[1],a.bias[2],a.bias[3]??0];let u=t.format!==void 0?t.format:"RGBA",l=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",p=r*i,f=l==="RGBA"?new Float32Array(p*4):new Float32Array(p*3),h=4,g=0,_=1,y=2,$=3,S=0,x=p,b=p*2,E=-1;u==="RGB"&&(h=3,g=0,_=1,y=2,$=-1),l==="RGBA"?E=p*3:l==="RBG"?(S=0,b=p,x=p*2):l==="BGR"&&(b=0,x=p,S=p*2);for(let k=0;k<p;k++,g+=h,y+=h,_+=h,$+=h)f[S++]=(e[g]+s[0])/n[0],f[x++]=(e[_]+s[1])/n[1],f[b++]=(e[y]+s[2])/n[2],E!==-1&&$!==-1&&(f[E++]=(e[$]+s[3])/n[3]);return l==="RGBA"?new Me("float32",f,[1,4,r,i]):new Me("float32",f,[1,3,r,i])},Jd=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,a=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,n=typeof e=="string",s,u=t??{},l=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},p=f=>typeof HTMLCanvasElement<"u"&&f instanceof HTMLCanvasElement||f instanceof OffscreenCanvas?f.getContext("2d"):null;if(r){let f=l();f.width=e.width,f.height=e.height;let h=p(f);if(h!=null){let g=e.height,_=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(g=t.resizedHeight,_=t.resizedWidth),t!==void 0){if(u=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=g,u.width=_}else u.tensorFormat="RGBA",u.height=g,u.width=_;h.drawImage(e,0,0),s=h.getImageData(0,0,_,g).data}else throw new Error("Can not access image data")}else if(i){let f,h;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(f=t.resizedHeight,h=t.resizedWidth):(f=e.height,h=e.width),t!==void 0&&(u=t),u.format="RGBA",u.height=f,u.width=h,t!==void 0){let g=l();g.width=h,g.height=f;let _=p(g);if(_!=null)_.putImageData(e,0,0),s=_.getImageData(0,0,h,f).data;else throw new Error("Can not access image data")}else s=e.data}else if(a){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let f=l();f.width=e.width,f.height=e.height;let h=p(f);if(h!=null){let g=e.height,_=e.width;return h.drawImage(e,0,0,_,g),s=h.getImageData(0,0,_,g).data,u.height=g,u.width=_,Tr(s,u)}else throw new Error("Can not access image data")}else{if(n)return new Promise((f,h)=>{let g=l(),_=p(g);if(!e||!_)return h();let y=new Image;y.crossOrigin="Anonymous",y.src=e,y.onload=()=>{g.width=y.width,g.height=y.height,_.drawImage(y,0,0,g.width,g.height);let $=_.getImageData(0,0,g.width,g.height);u.height=g.height,u.width=g.width,f(Tr($.data,u))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return Tr(s,u);throw new Error("Input data provided is not supported - aborted tensor creation")},ep=(e,t)=>{let{width:r,height:i,download:a,dispose:n}=t,s=[1,i,r,4];return new Me({location:"texture",type:"float32",texture:e,dims:s,download:a,dispose:n})},tp=(e,t)=>{let{dataType:r,dims:i,download:a,dispose:n}=t;return new Me({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:a,dispose:n})},rp=(e,t)=>{let{dataType:r,dims:i,download:a,dispose:n}=t;return new Me({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:a,dispose:n})},ip=(e,t,r)=>new Me({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),Et,or,vi,ap,e0=P(()=>{"use strict";Et=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),or=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),vi=!1,ap=()=>{if(!vi){vi=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(Et.set("int64",BigInt64Array),or.set(BigInt64Array,"int64")),t&&(Et.set("uint64",BigUint64Array),or.set(BigUint64Array,"uint64")),i?(Et.set("float16",r),or.set(r,"float16")):Et.set("float16",Uint16Array)}}}),np,sp,t0=P(()=>{"use strict";Ua(),np=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},sp=(e,t)=>{switch(e.location){case"cpu":return new Me(e.type,e.data,t);case"cpu-pinned":return new Me({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Me({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Me({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Me({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Me,Ua=P(()=>{"use strict";Yg(),Jg(),e0(),t0(),Me=class{constructor(e,t,r){ap();let i,a;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,a=e.dims,e.location){case"cpu-pinned":{let s=Et.get(i);if(!s)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,u;if(typeof e=="string")if(i=e,u=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let l=Et.get(e);if(l===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&l===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);e==="uint64"||e==="int64"?s=l.from(t,BigInt):s=l.from(t)}else if(t instanceof l)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&l!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${l}`)}else if(u=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")i="string",s=e;else if(l==="boolean")i="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",s=Uint8Array.from(e);else{let l=or.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=l,s=e}if(u===void 0)u=[s.length];else if(!Array.isArray(u))throw new TypeError("A tensor's dims must be a number array");a=u,this.cpuData=s,this.dataLocation="cpu"}let n=np(a);if(this.cpuData&&n!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(n/2)===this.cpuData.length))throw new Error(`Tensor's size(${n}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=a,this.size=n}static async fromImage(e,t){return Jd(e,t)}static fromTexture(e,t){return ep(e,t)}static fromGpuBuffer(e,t){return tp(e,t)}static fromMLTensor(e,t){return rp(e,t)}static fromPinnedBuffer(e,t,r){return ip(e,t,r)}toDataURL(e){return Qd(this,e)}toImageData(e){return Yd(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return sp(this,e)}}}),et,op=P(()=>{"use strict";Ua(),et=Me}),Wr,xi,tt,Ke,At,Ot,up=P(()=>{"use strict";Xd(),Wr=(e,t)=>{(typeof ze.trace>"u"?!ze.wasm.trace:!ze.trace)||console.timeStamp(`${e}::ORT::${t}`)},xi=(e,t)=>{let r=new Error().stack?.split(/\r\n|\r|\n/g)||[],i=!1;for(let a=0;a<r.length;a++){if(i&&!r[a].includes("TRACE_FUNC")){let n=`FUNC_${e}::${r[a].trim().split(" ")[1]}`;t&&(n+=`::${t}`),Wr("CPU",n);return}r[a].includes("TRACE_FUNC")&&(i=!0)}},tt=e=>{(typeof ze.trace>"u"?!ze.wasm.trace:!ze.trace)||xi("BEGIN",e)},Ke=e=>{(typeof ze.trace>"u"?!ze.wasm.trace:!ze.trace)||xi("END",e)},At=e=>{(typeof ze.trace>"u"?!ze.wasm.trace:!ze.trace)||console.time(`ORT::${e}`)},Ot=e=>{(typeof ze.trace>"u"?!ze.wasm.trace:!ze.trace)||console.timeEnd(`ORT::${e}`)}}),lp,r0=P(()=>{"use strict";Kd(),op(),up(),lp=class dp{constructor(t){this.handler=t}async run(t,r,i){tt(),At("InferenceSession.run");let a={},n={};if(typeof t!="object"||t===null||t instanceof et||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof et)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let p of r){if(typeof p!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(p)===-1)throw new RangeError(`'fetches' contains invalid output name: ${p}.`);a[p]=null}if(typeof i=="object"&&i!==null)n=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let p=!1,f=Object.getOwnPropertyNames(r);for(let h of this.outputNames)if(f.indexOf(h)!==-1){let g=r[h];(g===null||g instanceof et)&&(p=!0,s=!1,a[h]=g)}if(p){if(typeof i=="object"&&i!==null)n=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else n=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let p of this.inputNames)if(typeof t[p]>"u")throw new Error(`input '${p}' is missing in 'feeds'.`);if(s)for(let p of this.outputNames)a[p]=null;let u=await this.handler.run(t,a,n),l={};for(let p in u)if(Object.hasOwnProperty.call(u,p)){let f=u[p];f instanceof et?l[p]=f:l[p]=new et(f.type,f.data,f.dims)}return Ot("InferenceSession.run"),Ke(),l}async release(){return this.handler.dispose()}static async create(t,r,i,a){tt(),At("InferenceSession.create");let n,s={};if(typeof t=="string"){if(n=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(n=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let f=t,h=0,g=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(h=r,!Number.isSafeInteger(h))throw new RangeError("'byteOffset' must be an integer.");if(h<0||h>=f.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${f.byteLength}).`);if(g=t.byteLength-h,typeof i=="number"){if(g=i,!Number.isSafeInteger(g))throw new RangeError("'byteLength' must be an integer.");if(g<=0||h+g>f.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${f.byteLength-h}].`);if(typeof a=="object"&&a!==null)s=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");n=new Uint8Array(f,h,g)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,l]=await jd(s),p=await u.createInferenceSessionHandler(n,l);return Ot("InferenceSession.create"),Ke(),new dp(p)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),pp,i0=P(()=>{"use strict";r0(),pp=lp}),a0=P(()=>{"use strict"}),n0=P(()=>{"use strict"}),s0=P(()=>{"use strict"}),o0=P(()=>{"use strict"}),cp={};Ht(cp,{InferenceSession:()=>pp,TRACE:()=>Wr,TRACE_EVENT_BEGIN:()=>At,TRACE_EVENT_END:()=>Ot,TRACE_FUNC_BEGIN:()=>tt,TRACE_FUNC_END:()=>Ke,Tensor:()=>et,env:()=>$e,registerBackend:()=>Lt});var qe=P(()=>{"use strict";Zg(),Qg(),i0(),op(),a0(),n0(),up(),s0(),o0()}),Pa=P(()=>{"use strict"}),hp={};Ht(hp,{default:()=>fp});var Si,ki,fp,u0=P(()=>{"use strict";xf(),Mt(),qa(),Si="ort-wasm-proxy-worker",ki=globalThis.self?.name===Si,ki&&(self.onmessage=e=>{let{type:t,in:r}=e.data;try{switch(t){case"init-wasm":La(r.wasm).then(()=>{nn(r).then(()=>{postMessage({type:t})},i=>{postMessage({type:t,err:i})})},i=>{postMessage({type:t,err:i})});break;case"init-ep":{let{epName:i,env:a}=r;sn(a,i).then(()=>{postMessage({type:t})},n=>{postMessage({type:t,err:n})});break}case"copy-from":{let{buffer:i}=r,a=Zr(i);postMessage({type:t,out:a});break}case"create":{let{model:i,options:a}=r;on(i,a).then(n=>{postMessage({type:t,out:n})},n=>{postMessage({type:t,err:n})});break}case"release":un(r),postMessage({type:t});break;case"run":{let{sessionId:i,inputIndices:a,inputs:n,outputIndices:s,options:u}=r;ln(i,a,n,s,new Array(s.length).fill(null),u).then(l=>{l.some(p=>p[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:t,out:l},pn([...n,...l]))},l=>{postMessage({type:t,err:l})});break}case"end-profiling":dn(r),postMessage({type:t});break;default:}}catch(i){postMessage({type:t,err:i})}}),fp=ki?null:e=>new Worker(e??Ne,{type:"module",name:Si})}),mp={};Ht(mp,{default:()=>gp});async function oo(e={}){var t=e,r=!!globalThis.window,i=!!globalThis.WorkerGlobalScope,a=i&&self.name?.startsWith("em-pthread");t.mountExternalData=(o,d)=>{o.startsWith("./")&&(o=o.substring(2)),(t.ad||(t.ad=new Map)).set(o,d)},t.unmountExternalData=()=>{delete t.ad,delete t.Yd,delete t.Xd,delete t.be},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let n=o=>async(...d)=>{try{if(t.$c)throw Error("Session already started");let m=t.$c={Nd:d[0],errors:[]},c=await o(...d);if(t.$c!==m)throw Error("Session mismatch");t.hd?.flush();let w=m.errors;if(0<w.length){let T=await Promise.all(w);if(T=T.filter(C=>C),0<T.length)throw Error(T.join(`
`))}return c}finally{t.$c=null}};t.jsepInit=(o,d)=>{if(o==="webgpu"){[t.hd,t.Dd,t.Hd,t.jd,t.Gd,t.bc,t.Id,t.Kd,t.Ed,t.Fd,t.Jd]=d;let m=t.hd;t.jsepRegisterBuffer=(c,w,T,C)=>m.registerBuffer(c,w,T,C),t.jsepGetBuffer=c=>m.getBuffer(c),t.jsepCreateDownloader=(c,w,T)=>m.createDownloader(c,w,T),t.jsepOnCreateSession=c=>{m.onCreateSession(c)},t.jsepOnReleaseSession=c=>{m.onReleaseSession(c)},t.jsepOnRunStart=c=>m.onRunStart(c),t.Ld=(c,w)=>{m.upload(c,w)}}else if(o==="webnn"){let m=d[0];[t.Vd,t.vd,t.webnnEnsureTensor,t.wd,t.webnnDownloadTensor,t.Ud,t.webnnEnableTraceEvent]=d.slice(1),t.webnnReleaseTensorId=t.vd,t.webnnUploadTensor=t.wd,t.webnnRegisterMLContext=t.Ud,t.webnnOnRunStart=c=>m.onRunStart(c),t.webnnOnRunEnd=m.onRunEnd.bind(m),t.webnnOnReleaseSession=c=>{m.onReleaseSession(c)},t.webnnCreateMLTensorDownloader=(c,w)=>m.createMLTensorDownloader(c,w),t.webnnRegisterMLTensor=(c,w,T,C)=>m.registerMLTensor(c,w,T,C),t.webnnCreateMLContext=c=>m.createMLContext(c),t.webnnRegisterGraphInput=m.registerGraphInput.bind(m),t.webnnIsGraphInput=m.isGraphInput.bind(m),t.webnnRegisterGraphOutput=m.registerGraphOutput.bind(m),t.webnnIsGraphOutput=m.isGraphOutput.bind(m),t.webnnCreateTemporaryTensor=m.createTemporaryTensor.bind(m),t.webnnIsGraphInputOutputTypeSupported=m.isGraphInputOutputTypeSupported.bind(m)}};let s=()=>{let o=d=>(...m)=>{let c=Qe;return m=d(...m),Qe!=c?new Promise((w,T)=>{ui={resolve:w,reject:T}}):m};(()=>{for(let d of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])t[d]=o(t[d])})(),n!==void 0&&(t._OrtRun=n(t._OrtRun),t._OrtRunWithBinding=n(t._OrtRunWithBinding)),s=void 0};t.asyncInit=()=>{s?.()};var u,l,p=(o,d)=>{throw d},f=import.meta.url,h="";if(r||i){try{h=new URL(".",f).href}catch{}i&&(l=o=>{var d=new XMLHttpRequest;return d.open("GET",o,!1),d.responseType="arraybuffer",d.send(null),new Uint8Array(d.response)}),u=async o=>{if(A(o))return new Promise((m,c)=>{var w=new XMLHttpRequest;w.open("GET",o,!0),w.responseType="arraybuffer",w.onload=()=>{w.status==200||w.status==0&&w.response?m(w.response):c(w.status)},w.onerror=c,w.send(null)});var d=await fetch(o,{credentials:"same-origin"});if(d.ok)return d.arrayBuffer();throw Error(d.status+" : "+d.url)}}var g,_,y,$,S,x,b=console.log.bind(console),E=console.error.bind(console),k=b,I=E,z=!1,A=o=>o.startsWith("file://");function v(){lt.buffer!=q.buffer&&Y()}if(a){let o=function(d){try{var m=d.data,c=m.Vc;if(c==="load"){let w=[];self.onmessage=T=>w.push(T),x=()=>{postMessage({Vc:"loaded"});for(let T of w)o(T);self.onmessage=o};for(let T of m.Ad)t[T]&&!t[T].proxy||(t[T]=(...C)=>{postMessage({Vc:"callHandler",yd:T,args:C})},T=="print"&&(k=t[T]),T=="printErr"&&(I=t[T]));lt=m.Rd,Y(),_=m.Sd,Ae(),kr()}else if(c==="run"){(function(w){var T=(v(),M)[w+52>>>2>>>0];w=(v(),M)[w+56>>>2>>>0],ms(T,T-w),oe(T)})(m.Uc),hi(m.Uc,0,0,1,0,0),mn(),ni(m.Uc),D||(ls(),D=!0);try{Nf(m.Pd,m.ed)}catch(w){if(w!="unwind")throw w}}else m.target!=="setimmediate"&&(c==="checkMailbox"?D&&_r():c&&(I(`worker: received unknown command ${c}`),I(m)))}catch(w){throw ds(),w}};var D=!1;self.onunhandledrejection=d=>{throw d.reason||d},self.onmessage=o}var q,Q,F,j,B,M,G,J,ee,re,ne,U=!1;function Y(){var o=lt.buffer;t.HEAP8=q=new Int8Array(o),F=new Int16Array(o),t.HEAPU8=Q=new Uint8Array(o),j=new Uint16Array(o),t.HEAP32=B=new Int32Array(o),t.HEAPU32=M=new Uint32Array(o),G=new Float32Array(o),J=new Float64Array(o),ee=new BigInt64Array(o),re=new BigUint64Array(o)}function X(){U=!0,a?x():it.ub()}function V(o){throw I(o="Aborted("+o+")"),z=!0,o=new WebAssembly.RuntimeError(o+". Build with -sASSERTIONS for more info."),S?.(o),o}function Te(){return{a:{ma:ag,hb:ig,g:Mf,J:Df,f:Uf,o:Pf,i:qf,$:Lf,b:Wf,S:Vf,Ha:$n,n:Gf,aa:kn,Ya:Tn,Da:In,Fa:En,Za:zn,Wa:Cn,Pa:An,Va:On,ka:Bn,Ea:Rn,Ba:Nn,Xa:Mn,Ca:Dn,cb:Hf,fa:Ff,wa:jf,ua:Zf,ea:Qf,N:Yf,H:Jf,va:em,_:om,xa:um,Sa:lm,za:pm,Ia:cm,sa:hm,ga:fm,Ra:ni,$a:mm,Q:bm,r:Sm,c:ii,ib:km,y:Tm,M:Im,D:Em,l:zm,s:Hn,jb:Cm,I:Am,R:Om,j:Bm,u:Rm,q:Nm,k:Mm,Ma:Dm,Na:Um,Oa:Pm,Ka:Zn,La:Xn,ta:Qn,eb:Lm,bb:Vm,v:Gm,ba:Hm,ha:Fm,ab:Wm,V:jm,_a:Km,Aa:Zm,F:qm,U:Xm,la:xr,ya:Ym,gb:Qm,fb:Jm,Ta:ts,Ua:rs,Ga:Yr,T:is,Ja:as,ja:ns,Qa:ss,ia:os,lb:Lg,na:Mg,mb:qg,oa:Ng,G:Sg,e:ug,t:sg,w:ng,B:_g,nb:Og,Z:Ag,x:pg,pa:Bg,X:Dg,ca:Cg,ob:zg,pb:Eg,O:bg,qb:Tg,qa:Ig,rb:kg,L:vg,Y:Rg,d:og,A:dg,m:lg,kb:Wg,p:hg,z:fg,C:cg,E:mg,K:wg,ra:xg,P:Ug,da:$g,W:Pg,sb:yg,tb:gg,h:tg,a:lt,db:Qr}}}async function Ae(){function o(c,w){var T=it=c.exports;c={};for(let[C,N]of Object.entries(T))typeof N=="function"?(T=gm(N),c[C]=T):c[C]=N;return it=c,it=(function(){var C=it,N=W=>se=>W(se)>>>0,L=W=>()=>W()>>>0;return(C=Object.assign({},C)).vb=N(C.vb),C.Zb=L(C.Zb),C.$b=N(C.$b),C.nc=N(C.nc),C.oc=L(C.oc),C.sc=N(C.sc),C})(),hn.push(it.ac),us=(c=it).vb,ls=c.wb,t._OrtInit=c.xb,t._OrtGetLastError=c.yb,t._OrtCreateSessionOptions=c.zb,t._OrtAppendExecutionProvider=c.Ab,t._OrtAddFreeDimensionOverride=c.Bb,t._OrtAddSessionConfigEntry=c.Cb,t._OrtReleaseSessionOptions=c.Db,t._OrtCreateSession=c.Eb,t._OrtReleaseSession=c.Fb,t._OrtGetInputOutputCount=c.Gb,t._OrtGetInputOutputMetadata=c.Hb,t._OrtFree=c.Ib,t._OrtCreateTensor=c.Jb,t._OrtGetTensorData=c.Kb,t._OrtReleaseTensor=c.Lb,t._OrtCreateRunOptions=c.Mb,t._OrtAddRunConfigEntry=c.Nb,t._OrtReleaseRunOptions=c.Ob,t._OrtCreateBinding=c.Pb,t._OrtBindInput=c.Qb,t._OrtBindOutput=c.Rb,t._OrtClearBoundOutputs=c.Sb,t._OrtReleaseBinding=c.Tb,t._OrtRunWithBinding=c.Ub,t._OrtRun=c.Vb,t._OrtEndProfiling=c.Wb,t._JsepOutput=c.Xb,t._JsepGetNodeName=c.Yb,Sr=c.Zb,Ye=t._free=c._b,Kt=t._malloc=c.$b,hi=c.cc,ds=c.dc,ps=c.ec,cs=c.fc,fi=c.gc,hs=c.hc,fs=c.ic,le=c.jc,Zt=c.kc,ms=c.lc,oe=c.mc,mi=c.nc,ue=c.oc,gs=c.pc,gi=c.qc,ys=c.rc,_s=c.sc,bs=c.tc,yi=c.uc,ws=c.vc,$s=c.wc,vs=c.xc,xs=c.yc,Ss=c.zc,ks=c.Ac,Ts=c.Bc,Is=c.Cc,Es=c.Dc,zs=c.Ec,Cs=c.Fc,As=c.Gc,Os=c.Hc,Bs=c.Ic,Rs=c.Jc,Ns=c.Kc,Ms=c.Lc,Ds=c.Mc,Us=c.Nc,Ps=c.Oc,qs=c.Pc,Ls=c.Qc,Ws=c.Sc,Vs=c.Tc,Gs=c.cd,Hs=c.dd,Fs=c.id,js=c.nd,Ks=c.od,Zs=c.pd,Xs=c.qd,Qs=c.rd,Ys=c.sd,Js=c.td,eo=c.ud,to=c.zd,ro=c.Zd,io=c._d,ao=c.$d,no=c.ae,_=w,it}var d,m=Te();return t.instantiateWasm?new Promise(c=>{t.instantiateWasm(m,(w,T)=>{c(o(w,T))})}):a?o(new WebAssembly.Instance(_,Te()),_):(ne??=t.locateFile?t.locateFile?t.locateFile("ort-wasm-simd-threaded.jsep.wasm",h):h+"ort-wasm-simd-threaded.jsep.wasm":new URL(""+new URL("ort-wasm-simd-threaded.jsep-MDYUKy93.wasm",import.meta.url).href,import.meta.url).href,d=await(async function(c){var w=ne;if(!g&&!A(w))try{var T=fetch(w,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(T,c)}catch(C){I(`wasm streaming compile failed: ${C}`),I("falling back to ArrayBuffer instantiation")}return(async function(C,N){try{var L=await(async function(W){if(!g)try{var se=await u(W);return new Uint8Array(se)}catch{}if(W==ne&&g)W=new Uint8Array(g);else{if(!l)throw"both async and sync fetching of the wasm failed";W=l(W)}return W})(C);return await WebAssembly.instantiate(L,N)}catch(W){I(`failed to asynchronously prepare wasm: ${W}`),V(W)}})(w,c)})(m),o(d.instance,d.module))}class ve{name="ExitStatus";constructor(d){this.message=`Program terminated with exit(${d})`,this.status=d}}var Oe=o=>{o.terminate(),o.onmessage=()=>{}},me=[],be=0,Be=null,hr=o=>{ut.length==0&&(yn(),gn(ut[0]));var d=ut.pop();if(!d)return 6;Ft.push(d),wt[o.Uc]=d,d.Uc=o.Uc;var m={Vc:"run",Pd:o.Od,ed:o.ed,Uc:o.Uc};return d.postMessage(m,o.md),0},Ze=0,we=(o,d,...m)=>{var c,w=16*m.length,T=ue(),C=mi(w),N=C>>>3;for(c of m)typeof c=="bigint"?((v(),ee)[N++>>>0]=1n,(v(),ee)[N++>>>0]=c):((v(),ee)[N++>>>0]=0n,(v(),J)[N++>>>0]=c);return o=ps(o,0,w,C,d),oe(T),o};function Qr(o){if(a)return we(0,1,o);if(y=o,!(0<Ze)){for(var d of Ft)Oe(d);for(d of ut)Oe(d);ut=[],Ft=[],wt={},z=!0}p(0,new ve(o))}function cn(o){if(a)return we(1,0,o);Yr(o)}var Yr=o=>{if(y=o,a)throw cn(o),"unwind";Qr(o)},ut=[],Ft=[],hn=[],wt={},fn=o=>{var d=o.Uc;delete wt[d],ut.push(o),Ft.splice(Ft.indexOf(o),1),o.Uc=0,cs(d)};function mn(){hn.forEach(o=>o())}var gn=o=>new Promise(d=>{o.onmessage=w=>{var T=w.data;if(w=T.Vc,T.bd&&T.bd!=Sr()){var C=wt[T.bd];C?C.postMessage(T,T.md):I(`Internal error! Worker sent a message "${w}" to target pthread ${T.bd}, but that thread no longer exists!`)}else w==="checkMailbox"?_r():w==="spawnThread"?hr(T):w==="cleanupThread"?yr(()=>{fn(wt[T.Qd])}):w==="loaded"?(o.loaded=!0,d(o)):T.target==="setimmediate"?o.postMessage(T):w==="uncaughtException"?o.onerror(T.error):w==="callHandler"?t[T.yd](...T.args):w&&I(`worker sent an unknown command ${w}`)},o.onerror=w=>{throw I(`worker sent an error! ${w.filename}:${w.lineno}: ${w.message}`),w};var m,c=[];for(m of[])t.propertyIsEnumerable(m)&&c.push(m);o.postMessage({Vc:"load",Ad:c,Rd:lt,Sd:_})});function yn(){var o=new Worker((()=>{let d=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new d("ort.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});ut.push(o)}var lt,Nf=(o,d)=>{Ze=0,o=yi(o,d),0<Ze?y=o:fi(o)},fr=[],mr=0;function Mf(o){var d=new Jr(o>>>=0);return(v(),q)[d.Wc+12>>>0]==0&&(_n(d,!0),mr--),bn(d,!1),fr.push(d),_s(o)}var Ut=0,Df=()=>{le(0,0);var o=fr.pop();gs(o.gd),Ut=0};function _n(o,d){d=d?1:0,(v(),q)[o.Wc+12>>>0]=d}function bn(o,d){d=d?1:0,(v(),q)[o.Wc+13>>>0]=d}class Jr{constructor(d){this.gd=d,this.Wc=d-24}}var ei=o=>{var d=Ut;if(!d)return Zt(0),0;var m=new Jr(d);(v(),M)[m.Wc+16>>>2>>>0]=d;var c=(v(),M)[m.Wc+4>>>2>>>0];if(!c)return Zt(0),d;for(var w of o){if(w===0||w===c)break;if(ys(w,c,m.Wc+16))return Zt(w),d}return Zt(c),d};function Uf(){return ei([])}function Pf(o){return ei([o>>>0])}function qf(o,d,m,c){return ei([o>>>0,d>>>0,m>>>0,c>>>0])}var Lf=()=>{var o=fr.pop();o||V("no exception to throw");var d=o.gd;throw(v(),q)[o.Wc+13>>>0]==0&&(fr.push(o),bn(o,!0),_n(o,!1),mr++),gi(d),Ut=d};function Wf(o,d,m){var c=new Jr(o>>>=0);throw d>>>=0,m>>>=0,(v(),M)[c.Wc+16>>>2>>>0]=0,(v(),M)[c.Wc+4>>>2>>>0]=d,(v(),M)[c.Wc+8>>>2>>>0]=m,gi(o),mr++,Ut=o}var Vf=()=>mr;function wn(o,d,m,c){return a?we(2,1,o,d,m,c):$n(o,d,m,c)}function $n(o,d,m,c){if(o>>>=0,d>>>=0,m>>>=0,c>>>=0,!globalThis.SharedArrayBuffer)return 6;var w=[];return a&&w.length===0?wn(o,d,m,c):(o={Od:m,Uc:o,ed:c,md:w},a?(o.Vc="spawnThread",postMessage(o,w),0):hr(o))}function Gf(o){throw Ut||=o>>>0,Ut}var vn=globalThis.TextDecoder&&new TextDecoder,xn=(o,d,m,c)=>{if(m=d+m,c)return m;for(;o[d]&&!(d>=m);)++d;return d},Sn=(o,d=0,m,c)=>{if(16<(m=xn(o,d>>>=0,m,c))-d&&o.buffer&&vn)return vn.decode(o.buffer instanceof ArrayBuffer?o.subarray(d,m):o.slice(d,m));for(c="";d<m;){var w=o[d++];if(128&w){var T=63&o[d++];if((224&w)==192)c+=String.fromCharCode((31&w)<<6|T);else{var C=63&o[d++];65536>(w=(240&w)==224?(15&w)<<12|T<<6|C:(7&w)<<18|T<<12|C<<6|63&o[d++])?c+=String.fromCharCode(w):(w-=65536,c+=String.fromCharCode(55296|w>>10,56320|1023&w))}}else c+=String.fromCharCode(w)}return c},ke=(o,d,m)=>(o>>>=0)?Sn((v(),Q),o,d,m):"";function kn(o,d,m){return a?we(3,1,o,d,m):0}function Tn(o,d){if(a)return we(4,1,o,d)}function In(o,d){if(a)return we(5,1,o,d)}function En(o,d,m){if(a)return we(6,1,o,d,m)}function zn(o,d,m){return a?we(7,1,o,d,m):0}function Cn(o,d){if(a)return we(8,1,o,d)}function An(o,d,m){if(a)return we(9,1,o,d,m)}function On(o,d,m,c){if(a)return we(10,1,o,d,m,c)}function Bn(o,d,m,c){if(a)return we(11,1,o,d,m,c)}function Rn(o,d,m,c){if(a)return we(12,1,o,d,m,c)}function Nn(o){if(a)return we(13,1,o)}function Mn(o,d){if(a)return we(14,1,o,d)}function Dn(o,d,m){if(a)return we(15,1,o,d,m)}var Hf=()=>V(""),Xe=o=>{o>>>=0;for(var d="";;){var m=(v(),Q)[o++>>>0];if(!m)return d;d+=String.fromCharCode(m)}},ti={},ri={},Pt=class extends Error{constructor(o){super(o),this.name="BindingError"}};function rt(o,d,m={}){return(function(c,w,T={}){var C=w.name;if(!c)throw new Pt(`type "${C}" must have a positive integer typeid pointer`);if(ri.hasOwnProperty(c)){if(T.Bd)return;throw new Pt(`Cannot register type '${C}' twice`)}ri[c]=w,ti.hasOwnProperty(c)&&(w=ti[c],delete ti[c],w.forEach(N=>N()))})(o,d,m)}var Un=(o,d,m)=>{switch(d){case 1:return m?c=>(v(),q)[c>>>0]:c=>(v(),Q)[c>>>0];case 2:return m?c=>(v(),F)[c>>>1>>>0]:c=>(v(),j)[c>>>1>>>0];case 4:return m?c=>(v(),B)[c>>>2>>>0]:c=>(v(),M)[c>>>2>>>0];case 8:return m?c=>(v(),ee)[c>>>3>>>0]:c=>(v(),re)[c>>>3>>>0];default:throw new TypeError(`invalid integer width (${d}): ${o}`)}};function Ff(o,d,m,c,w){o>>>=0,m>>>=0,d=Xe(d>>>0);let T=C=>C;if(c=c===0n){let C=8*m;T=N=>BigInt.asUintN(C,N),w=T(w)}rt(o,{name:d,Rc:T,Yc:(C,N)=>(typeof N=="number"&&(N=BigInt(N)),N),Xc:Un(d,m,!c),Zc:null})}function jf(o,d,m,c){rt(o>>>=0,{name:d=Xe(d>>>0),Rc:function(w){return!!w},Yc:function(w,T){return T?m:c},Xc:function(w){return this.Rc((v(),Q)[w>>>0])},Zc:null})}var Pn=[],$t=[0,1,,1,null,1,!0,1,!1,1];function ii(o){9<(o>>>=0)&&--$t[o+1]===0&&($t[o]=void 0,Pn.push(o))}var Ue=o=>{if(!o)throw new Pt(`Cannot use deleted val. handle = ${o}`);return $t[o]},Le=o=>{switch(o){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let d=Pn.pop()||$t.length;return $t[d]=o,$t[d+1]=1,d}};function ai(o){return this.Rc((v(),M)[o>>>2>>>0])}var Kf={name:"emscripten::val",Rc:o=>{var d=Ue(o);return ii(o),d},Yc:(o,d)=>Le(d),Xc:ai,Zc:null};function Zf(o){return rt(o>>>0,Kf)}var Xf=(o,d)=>{switch(d){case 4:return function(m){return this.Rc((v(),G)[m>>>2>>>0])};case 8:return function(m){return this.Rc((v(),J)[m>>>3>>>0])};default:throw new TypeError(`invalid float width (${d}): ${o}`)}};function Qf(o,d,m){m>>>=0,rt(o>>>=0,{name:d=Xe(d>>>0),Rc:c=>c,Yc:(c,w)=>w,Xc:Xf(d,m),Zc:null})}function Yf(o,d,m,c,w){o>>>=0,m>>>=0,d=Xe(d>>>0);let T=N=>N;if(c===0){var C=32-8*m;T=N=>N<<C>>>C,w=T(w)}rt(o,{name:d,Rc:T,Yc:(N,L)=>L,Xc:Un(d,m,c!==0),Zc:null})}function Jf(o,d,m){function c(T){var C=(v(),M)[T>>>2>>>0];return T=(v(),M)[T+4>>>2>>>0],new w((v(),q).buffer,T,C)}var w=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][d];rt(o>>>=0,{name:m=Xe(m>>>0),Rc:c,Xc:c},{Bd:!0})}var dt=(o,d,m)=>{var c=(v(),Q);if(d>>>=0,0<m){var w=d;m=d+m-1;for(var T=0;T<o.length;++T){var C=o.codePointAt(T);if(127>=C){if(d>=m)break;c[d++>>>0]=C}else if(2047>=C){if(d+1>=m)break;c[d++>>>0]=192|C>>6,c[d++>>>0]=128|63&C}else if(65535>=C){if(d+2>=m)break;c[d++>>>0]=224|C>>12,c[d++>>>0]=128|C>>6&63,c[d++>>>0]=128|63&C}else{if(d+3>=m)break;c[d++>>>0]=240|C>>18,c[d++>>>0]=128|C>>12&63,c[d++>>>0]=128|C>>6&63,c[d++>>>0]=128|63&C,T++}}c[d>>>0]=0,o=d-w}else o=0;return o},gr=o=>{for(var d=0,m=0;m<o.length;++m){var c=o.charCodeAt(m);127>=c?d++:2047>=c?d+=2:55296<=c&&57343>=c?(d+=4,++m):d+=3}return d};function em(o,d){rt(o>>>=0,{name:d=Xe(d>>>0),Rc(m){var c=(v(),M)[m>>>2>>>0];return c=ke(m+4,c,!0),Ye(m),c},Yc(m,c){c instanceof ArrayBuffer&&(c=new Uint8Array(c));var w=typeof c=="string";if(!(w||ArrayBuffer.isView(c)&&c.BYTES_PER_ELEMENT==1))throw new Pt("Cannot pass non-string to std::string");var T=w?gr(c):c.length,C=Kt(4+T+1),N=C+4;return(v(),M)[C>>>2>>>0]=T,w?dt(c,N,T+1):(v(),Q).set(c,N>>>0),m!==null&&m.push(Ye,C),C},Xc:ai,Zc(m){Ye(m)}})}var qn=globalThis.TextDecoder?new TextDecoder("utf-16le"):void 0,tm=(o,d,m)=>{if(o>>>=1,16<(d=xn((v(),j),o,d/2,m))-o&&qn)return qn.decode((v(),j).slice(o,d));for(m="";o<d;++o){var c=(v(),j)[o>>>0];m+=String.fromCharCode(c)}return m},rm=(o,d,m)=>{if(m??=2147483647,2>m)return 0;var c=d;m=(m-=2)<2*o.length?m/2:o.length;for(var w=0;w<m;++w){var T=o.charCodeAt(w);(v(),F)[d>>>1>>>0]=T,d+=2}return(v(),F)[d>>>1>>>0]=0,d-c},im=o=>2*o.length,am=(o,d,m)=>{var c="";o>>>=2;for(var w=0;!(w>=d/4);w++){var T=(v(),M)[o+w>>>0];if(!T&&!m)break;c+=String.fromCodePoint(T)}return c},nm=(o,d,m)=>{if(d>>>=0,m??=2147483647,4>m)return 0;var c=d;m=c+m-4;for(var w=0;w<o.length;++w){var T=o.codePointAt(w);if(65535<T&&w++,(v(),B)[d>>>2>>>0]=T,(d+=4)+4>m)break}return(v(),B)[d>>>2>>>0]=0,d-c},sm=o=>{for(var d=0,m=0;m<o.length;++m)65535<o.codePointAt(m)&&m++,d+=4;return d};function om(o,d,m){if(o>>>=0,d>>>=0,m=Xe(m>>>=0),d===2)var c=tm,w=rm,T=im;else c=am,w=nm,T=sm;rt(o,{name:m,Rc:C=>{var N=(v(),M)[C>>>2>>>0];return N=c(C+4,N*d,!0),Ye(C),N},Yc:(C,N)=>{if(typeof N!="string")throw new Pt(`Cannot pass non-string to C++ string type ${m}`);var L=T(N),W=Kt(4+L+d);return(v(),M)[W>>>2>>>0]=L/d,w(N,W+4,L+d),C!==null&&C.push(Ye,W),W},Xc:ai,Zc(C){Ye(C)}})}function um(o,d){rt(o>>>=0,{Cd:!0,name:d=Xe(d>>>0),Rc:()=>{},Yc:()=>{}})}function lm(o){hi(o>>>0,!i,1,!r,131072,!1),mn()}var yr=o=>{if(!z)try{if(o(),!(0<Ze))try{a?Sr()&&fi(y):Yr(y)}catch(d){d instanceof ve||d=="unwind"||p(0,d)}}catch(d){d instanceof ve||d=="unwind"||p(0,d)}},dm=!Atomics.waitAsync||globalThis.navigator?.userAgent&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function ni(o){o>>>=0,dm||(Atomics.waitAsync((v(),B),o>>>2,o).value.then(_r),o+=128,Atomics.store((v(),B),o>>>2,1))}var _r=()=>yr(()=>{var o=Sr();o&&(ni(o),fs())});function pm(o,d){(o>>>=0)==d>>>0?setTimeout(_r):a?postMessage({bd:o,Vc:"checkMailbox"}):(o=wt[o])&&o.postMessage({Vc:"checkMailbox"})}var si=[];function cm(o,d,m,c,w){for(d>>>=0,w>>>=0,si.length=0,m=w>>>3,c=w+c>>>3;m<c;){var T;T=(v(),ee)[m++>>>0]?(v(),ee)[m++>>>0]:(v(),J)[m++>>>0],si.push(T)}return(d?_i[d]:rg[o])(...si)}var hm=()=>{Ze=0};function fm(o){o>>>=0,a?postMessage({Vc:"cleanupThread",Qd:o}):fn(wt[o])}function mm(o){}var br=o=>{try{o()}catch(d){V(d)}};function gm(o){var d=(...m)=>{wr.push(o);try{return o(...m)}finally{z||(wr.pop(),Qe&&pt===1&&wr.length===0&&(pt=0,Ze+=1,br(io),typeof Fibers<"u"&&Fibers.de()))}};return Vn.set(o,d),d}var pt=0,Qe=null,Ln=0,wr=[],oi=new Map,Wn=new Map,Vn=new Map,ym=0,ui=null,_m=[],Gn=o=>(function(d){if(!z){if(pt===0){var m=!1,c=!1;d((w=0)=>{if(!z&&(Ln=w,m=!0,c)){pt=2,br(()=>ao(Qe)),typeof MainLoop<"u"&&MainLoop.xd&&MainLoop.resume(),w=!1;try{var T=(function(){var L=(v(),B)[Qe+8>>>2>>>0];return L=Wn.get(L),L=Vn.get(L),--Ze,L()})()}catch(L){T=L,w=!0}var C=!1;if(!Qe){var N=ui;N&&(ui=null,(w?N.reject:N.resolve)(T),C=!0)}if(w&&!C)throw T}}),c=!0,m||(pt=1,Qe=(function(){var w=Kt(65548),T=w+12;if((v(),M)[w>>>2>>>0]=T,(v(),M)[w+4>>>2>>>0]=T+65536,T=wr[0],!oi.has(T)){var C=ym++;oi.set(T,C),Wn.set(C,T)}return T=oi.get(T),(v(),B)[w+8>>>2>>>0]=T,w})(),typeof MainLoop<"u"&&MainLoop.xd&&MainLoop.pause(),br(()=>ro(Qe)))}else pt===2?(pt=0,br(no),Ye(Qe),Qe=null,_m.forEach(yr)):V(`invalid state: ${pt}`);return Ln}})(d=>{o().then(d)});function bm(o){return o>>>=0,Gn(async()=>{var d=await Ue(o);return Le(d)})}var li=[],wm=o=>{var d=li.length;return li.push(o),d},$m=(o,d)=>{for(var m=Array(o),c=0;c<o;++c){var w=c,T=(v(),M)[d+4*c>>>2>>>0],C=ri[T];if(C===void 0)throw o=`parameter ${c}`,T=us(T),d=Xe(T),Ye(T),new Pt(`${o} has unknown type ${d}`);m[w]=C}return m},vm=(o,d,m)=>{var c=[];return o=o(c,m),c.length&&((v(),M)[d>>>2>>>0]=Le(c)),o},xm={},$r=o=>{var d=xm[o];return d===void 0?Xe(o):d};function Sm(o,d,m){var[c,...w]=$m(o,d>>>0);d=c.Yc.bind(c);var T=w.map(L=>L.Xc.bind(L));o--;var C={toValue:Ue};switch(o=T.map((L,W)=>{var se=`argFromPtr${W}`;return C[se]=L,`${se}(args${W?"+"+8*W:""})`}),m){case 0:var N="toValue(handle)";break;case 2:N="new (toValue(handle))";break;case 3:N="";break;case 1:C.getStringOrSymbol=$r,N="toValue(handle)[getStringOrSymbol(methodName)]"}return N+=`(${o})`,c.Cd||(C.toReturnWire=d,C.emval_returnValue=vm,N=`return emval_returnValue(toReturnWire, destructorsRef, ${N})`),N=`return function (handle, methodName, destructorsRef, args) {
  ${N}
  }`,m=new Function(Object.keys(C),N)(...Object.values(C)),N=`methodCaller<(${w.map(L=>L.name)}) => ${c.name}>`,wm(Object.defineProperty(m,"name",{value:N}))}function km(o,d){return d>>>=0,(o=Ue(o>>>0))==Ue(d)}function Tm(o){return(o>>>=0)?(o=$r(o),Le(globalThis[o])):Le(globalThis)}function Im(o){return o=$r(o>>>0),Le(t[o])}function Em(o,d){return d>>>=0,o=Ue(o>>>0),d=Ue(d),Le(o[d])}function zm(o){9<(o>>>=0)&&($t[o+1]+=1)}function Hn(o,d,m,c,w){return li[o>>>0](d>>>0,m>>>0,c>>>0,w>>>0)}function Cm(o,d,m,c,w){return Hn(o>>>0,d>>>0,m>>>0,c>>>0,w>>>0)}function Am(){return Le([])}function Om(o){o=Ue(o>>>0);for(var d=Array(o.length),m=0;m<o.length;m++)d[m]=o[m];return Le(d)}function Bm(o){return Le($r(o>>>0))}function Rm(){return Le({})}function Nm(o){for(var d=Ue(o>>>=0);d.length;){var m=d.pop();d.pop()(m)}ii(o)}function Mm(o,d,m){d>>>=0,m>>>=0,o=Ue(o>>>0),d=Ue(d),m=Ue(m),o[d]=m}function Dm(o,d){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),d>>>=0,o=new Date(1e3*o),(v(),B)[d>>>2>>>0]=o.getUTCSeconds(),(v(),B)[d+4>>>2>>>0]=o.getUTCMinutes(),(v(),B)[d+8>>>2>>>0]=o.getUTCHours(),(v(),B)[d+12>>>2>>>0]=o.getUTCDate(),(v(),B)[d+16>>>2>>>0]=o.getUTCMonth(),(v(),B)[d+20>>>2>>>0]=o.getUTCFullYear()-1900,(v(),B)[d+24>>>2>>>0]=o.getUTCDay(),o=(o.getTime()-Date.UTC(o.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,(v(),B)[d+28>>>2>>>0]=o}var Fn=o=>o%4==0&&(o%100!=0||o%400==0),jn=[0,31,60,91,121,152,182,213,244,274,305,335],Kn=[0,31,59,90,120,151,181,212,243,273,304,334];function Um(o,d){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),d>>>=0,o=new Date(1e3*o),(v(),B)[d>>>2>>>0]=o.getSeconds(),(v(),B)[d+4>>>2>>>0]=o.getMinutes(),(v(),B)[d+8>>>2>>>0]=o.getHours(),(v(),B)[d+12>>>2>>>0]=o.getDate(),(v(),B)[d+16>>>2>>>0]=o.getMonth(),(v(),B)[d+20>>>2>>>0]=o.getFullYear()-1900,(v(),B)[d+24>>>2>>>0]=o.getDay();var m=(Fn(o.getFullYear())?jn:Kn)[o.getMonth()]+o.getDate()-1|0;(v(),B)[d+28>>>2>>>0]=m,(v(),B)[d+36>>>2>>>0]=-60*o.getTimezoneOffset(),m=new Date(o.getFullYear(),6,1).getTimezoneOffset();var c=new Date(o.getFullYear(),0,1).getTimezoneOffset();o=0|(m!=c&&o.getTimezoneOffset()==Math.min(c,m)),(v(),B)[d+32>>>2>>>0]=o}function Pm(o){o>>>=0;var d=new Date((v(),B)[o+20>>>2>>>0]+1900,(v(),B)[o+16>>>2>>>0],(v(),B)[o+12>>>2>>>0],(v(),B)[o+8>>>2>>>0],(v(),B)[o+4>>>2>>>0],(v(),B)[o>>>2>>>0],0),m=(v(),B)[o+32>>>2>>>0],c=d.getTimezoneOffset(),w=new Date(d.getFullYear(),6,1).getTimezoneOffset(),T=new Date(d.getFullYear(),0,1).getTimezoneOffset(),C=Math.min(T,w);return 0>m?(v(),B)[o+32>>>2>>>0]=+(w!=T&&C==c):0<m!=(C==c)&&(w=Math.max(T,w),d.setTime(d.getTime()+6e4*((0<m?C:w)-c))),(v(),B)[o+24>>>2>>>0]=d.getDay(),m=(Fn(d.getFullYear())?jn:Kn)[d.getMonth()]+d.getDate()-1|0,(v(),B)[o+28>>>2>>>0]=m,(v(),B)[o>>>2>>>0]=d.getSeconds(),(v(),B)[o+4>>>2>>>0]=d.getMinutes(),(v(),B)[o+8>>>2>>>0]=d.getHours(),(v(),B)[o+12>>>2>>>0]=d.getDate(),(v(),B)[o+16>>>2>>>0]=d.getMonth(),(v(),B)[o+20>>>2>>>0]=d.getYear(),o=d.getTime(),BigInt(isNaN(o)?-1:o/1e3)}function Zn(o,d,m,c,w,T,C){return a?we(16,1,o,d,m,c,w,T,C):-52}function Xn(o,d,m,c,w,T){if(a)return we(17,1,o,d,m,c,w,T)}var jt={},qm=()=>performance.timeOrigin+performance.now();function Qn(o,d){if(a)return we(18,1,o,d);if(jt[o]&&(clearTimeout(jt[o].id),delete jt[o]),!d)return 0;var m=setTimeout(()=>{delete jt[o],yr(()=>hs(o,performance.timeOrigin+performance.now()))},d);return jt[o]={id:m,ce:d},0}function Lm(o,d,m,c){o>>>=0,d>>>=0,m>>>=0,c>>>=0;var w=new Date().getFullYear(),T=new Date(w,0,1).getTimezoneOffset();w=new Date(w,6,1).getTimezoneOffset();var C=Math.max(T,w);(v(),M)[o>>>2>>>0]=60*C,(v(),B)[d>>>2>>>0]=+(T!=w),o=(d=N=>{var L=Math.abs(N);return`UTC${0<=N?"-":"+"}${String(Math.floor(L/60)).padStart(2,"0")}${String(L%60).padStart(2,"0")}`})(T),d=d(w),w<T?(dt(o,m,17),dt(d,c,17)):(dt(o,c,17),dt(d,m,17))}var Wm=()=>Date.now();function Vm(o,d,m){return m>>>=0,0<=o&&3>=o?(o===0?o=Date.now():o=performance.timeOrigin+performance.now(),o=Math.round(1e6*o),(v(),ee)[m>>>3>>>0]=BigInt(o),0):28}var di=[],Yn=(o,d)=>{di.length=0;for(var m;m=(v(),Q)[o++>>>0];){var c=m!=105;d+=(c&=m!=112)&&d%8?4:0,di.push(m==112?(v(),M)[d>>>2>>>0]:m==106?(v(),ee)[d>>>3>>>0]:m==105?(v(),B)[d>>>2>>>0]:(v(),J)[d>>>3>>>0]),d+=c?8:4}return di};function Gm(o,d,m){return o>>>=0,d=Yn(d>>>0,m>>>0),_i[o](...d)}function Hm(o,d,m){return o>>>=0,d=Yn(d>>>0,m>>>0),_i[o](...d)}var Fm=()=>{};function jm(o,d){return I(ke(o>>>0,d>>>0))}var Km=()=>{throw Ze+=1,"unwind"};function Zm(){return 4294901760}var Xm=()=>navigator.hardwareConcurrency,vt={},vr=o=>{var d;return(d=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(o))?+d[1]:(d=/:(\d+):\d+(?:\)|$)/.exec(o))?2147483648|+d[1]:0},Jn=o=>{for(var d of o)(o=vr(d))&&(vt[o]=d)};function Qm(){var o=Error().stack.toString().split(`
`);return o[0]=="Error"&&o.shift(),Jn(o),vt.kd=vr(o[3]),vt.Md=o,vt.kd}function xr(o){if(!(o=vt[o>>>0]))return 0;var d;if(d=/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(o))o=d[1];else if(d=/^\s+at (.*) \(.*\)$/.exec(o))o=d[1];else{if(!(d=/^(.+?)@/.exec(o)))return 0;o=d[1]}Ye(xr.ld??0),d=gr(o)+1;var m=Kt(d);return m&&dt(o,m,d),xr.ld=m,xr.ld}function Ym(o){o>>>=0;var d=(v(),Q).length;if(o<=d||4294901760<o)return!1;for(var m=1;4>=m;m*=2){var c=d*(1+.2/m);c=Math.min(c,o+100663296);e:{c=(Math.min(4294901760,65536*Math.ceil(Math.max(o,c)/65536))-lt.buffer.byteLength+65535)/65536|0;try{lt.grow(c),Y();var w=1;break e}catch{}w=void 0}if(w)return!0}return!1}function Jm(o,d,m){if(o>>>=0,d>>>=0,vt.kd==o)var c=vt.Md;else(c=Error().stack.toString().split(`
`))[0]=="Error"&&c.shift(),Jn(c);for(var w=3;c[w]&&vr(c[w])!=o;)++w;for(o=0;o<m&&c[o+w];++o)(v(),B)[d+4*o>>>2>>>0]=vr(c[o+w]);return o}var pi,ci={},es=()=>{if(!pi){var o,d={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(globalThis.navigator?.language??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(o in ci)ci[o]===void 0?delete d[o]:d[o]=ci[o];var m=[];for(o in d)m.push(`${o}=${d[o]}`);pi=m}return pi};function ts(o,d){if(a)return we(19,1,o,d);o>>>=0,d>>>=0;var m,c=0,w=0;for(m of es()){var T=d+c;(v(),M)[o+w>>>2>>>0]=T,c+=dt(m,T,1/0)+1,w+=4}return 0}function rs(o,d){if(a)return we(20,1,o,d);o>>>=0,d>>>=0;var m=es();for(var c of((v(),M)[o>>>2>>>0]=m.length,o=0,m))o+=gr(c)+1;return(v(),M)[d>>>2>>>0]=o,0}function is(o){return a?we(21,1,o):52}function as(o,d,m,c,w){return a?we(22,1,o,d,m,c,w):52}function ns(o,d,m,c){return a?we(23,1,o,d,m,c):52}function ss(o,d,m,c){return a?we(24,1,o,d,m,c):70}var eg=[null,[],[]];function os(o,d,m,c){if(a)return we(25,1,o,d,m,c);d>>>=0,m>>>=0,c>>>=0;for(var w=0,T=0;T<m;T++){var C=(v(),M)[d>>>2>>>0],N=(v(),M)[d+4>>>2>>>0];d+=8;for(var L=0;L<N;L++){var W=o,se=(v(),Q)[C+L>>>0],pe=eg[W];se===0||se===10?((W===1?k:I)(Sn(pe)),pe.length=0):pe.push(se)}w+=N}return(v(),M)[c>>>2>>>0]=w,0}function tg(o){return o>>>0}a||(function(){for(var o=t.numThreads-1;o--;)yn();me.push(async()=>{var d=(async function(){if(!a)return Promise.all(ut.map(gn))})();be++,await d,--be==0&&Be&&(d=Be,Be=null,d())})})(),a||(lt=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),Y()),t.wasmBinary&&(g=t.wasmBinary),t.stackSave=()=>ue(),t.stackRestore=o=>oe(o),t.stackAlloc=o=>mi(o),t.setValue=function(o,d,m="i8"){switch(m.endsWith("*")&&(m="*"),m){case"i1":case"i8":(v(),q)[o>>>0]=d;break;case"i16":(v(),F)[o>>>1>>>0]=d;break;case"i32":(v(),B)[o>>>2>>>0]=d;break;case"i64":(v(),ee)[o>>>3>>>0]=BigInt(d);break;case"float":(v(),G)[o>>>2>>>0]=d;break;case"double":(v(),J)[o>>>3>>>0]=d;break;case"*":(v(),M)[o>>>2>>>0]=d;break;default:V(`invalid type for setValue: ${m}`)}},t.getValue=function(o,d="i8"){switch(d.endsWith("*")&&(d="*"),d){case"i1":case"i8":return(v(),q)[o>>>0];case"i16":return(v(),F)[o>>>1>>>0];case"i32":return(v(),B)[o>>>2>>>0];case"i64":return(v(),ee)[o>>>3>>>0];case"float":return(v(),G)[o>>>2>>>0];case"double":return(v(),J)[o>>>3>>>0];case"*":return(v(),M)[o>>>2>>>0];default:V(`invalid type for getValue: ${d}`)}},t.UTF8ToString=ke,t.stringToUTF8=dt,t.lengthBytesUTF8=gr;var us,ls,Sr,Ye,Kt,hi,ds,ps,cs,fi,hs,fs,le,Zt,ms,oe,mi,ue,gs,gi,ys,_s,bs,yi,ws,$s,vs,xs,Ss,ks,Ts,Is,Es,zs,Cs,As,Os,Bs,Rs,Ns,Ms,Ds,Us,Ps,qs,Ls,Ws,Vs,Gs,Hs,Fs,js,Ks,Zs,Xs,Qs,Ys,Js,eo,to,ro,io,ao,no,it,rg=[Qr,cn,wn,kn,Tn,In,En,zn,Cn,An,On,Bn,Rn,Nn,Mn,Dn,Zn,Xn,Qn,ts,rs,is,as,ns,ss,os],_i={1086876:(o,d,m,c,w)=>{if(t===void 0||!t.ad)return 1;if((o=ke(Number(o>>>0))).startsWith("./")&&(o=o.substring(2)),!(o=t.ad.get(o)))return 2;if(d=Number(d>>>0),m=Number(m>>>0),c=Number(c>>>0),d+m>o.byteLength)return 3;try{let T=o.subarray(d,d+m);switch(w){case 0:(v(),Q).set(T,c>>>0);break;case 1:t.Td?t.Td(c,T):t.Ld(c,T);break;default:return 4}return 0}catch{return 4}},1087700:(o,d,m)=>{t.wd(o,(v(),Q).subarray(d>>>0,d+m>>>0))},1087764:()=>t.Vd(),1087806:o=>{t.vd(o)},1087843:()=>{t.Ed()},1087874:()=>{t.Fd()},1087903:()=>{t.Jd()},1087928:o=>t.Dd(o),1087961:o=>t.Hd(o),1087993:(o,d,m)=>{t.jd(Number(o),Number(d),Number(m),!0)},1088056:(o,d,m)=>{t.jd(Number(o),Number(d),Number(m))},1088113:()=>typeof wasmOffsetConverter<"u",1088170:o=>{t.bc("Abs",o,void 0)},1088221:o=>{t.bc("Neg",o,void 0)},1088272:o=>{t.bc("Floor",o,void 0)},1088325:o=>{t.bc("Ceil",o,void 0)},1088377:o=>{t.bc("Reciprocal",o,void 0)},1088435:o=>{t.bc("Sqrt",o,void 0)},1088487:o=>{t.bc("Exp",o,void 0)},1088538:o=>{t.bc("Erf",o,void 0)},1088589:o=>{t.bc("Sigmoid",o,void 0)},1088644:(o,d,m)=>{t.bc("HardSigmoid",o,{alpha:d,beta:m})},1088723:o=>{t.bc("HardSwish",o,void 0)},1088780:o=>{t.bc("Log",o,void 0)},1088831:o=>{t.bc("Sin",o,void 0)},1088882:o=>{t.bc("Cos",o,void 0)},1088933:o=>{t.bc("Tan",o,void 0)},1088984:o=>{t.bc("Asin",o,void 0)},1089036:o=>{t.bc("Acos",o,void 0)},1089088:o=>{t.bc("Atan",o,void 0)},1089140:o=>{t.bc("Sinh",o,void 0)},1089192:o=>{t.bc("Cosh",o,void 0)},1089244:o=>{t.bc("Asinh",o,void 0)},1089297:o=>{t.bc("Acosh",o,void 0)},1089350:o=>{t.bc("Atanh",o,void 0)},1089403:o=>{t.bc("Tanh",o,void 0)},1089455:o=>{t.bc("Not",o,void 0)},1089506:(o,d,m)=>{t.bc("Clip",o,{min:d,max:m})},1089575:o=>{t.bc("Clip",o,void 0)},1089627:(o,d)=>{t.bc("Elu",o,{alpha:d})},1089685:o=>{t.bc("Gelu",o,void 0)},1089737:o=>{t.bc("Relu",o,void 0)},1089789:(o,d)=>{t.bc("LeakyRelu",o,{alpha:d})},1089853:(o,d)=>{t.bc("ThresholdedRelu",o,{alpha:d})},1089923:(o,d)=>{t.bc("Cast",o,{to:d})},1089981:o=>{t.bc("Add",o,void 0)},1090032:o=>{t.bc("Sub",o,void 0)},1090083:o=>{t.bc("Mul",o,void 0)},1090134:o=>{t.bc("Div",o,void 0)},1090185:o=>{t.bc("Pow",o,void 0)},1090236:o=>{t.bc("Equal",o,void 0)},1090289:o=>{t.bc("Greater",o,void 0)},1090344:o=>{t.bc("GreaterOrEqual",o,void 0)},1090406:o=>{t.bc("Less",o,void 0)},1090458:o=>{t.bc("LessOrEqual",o,void 0)},1090517:(o,d,m,c,w)=>{t.bc("ReduceMean",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),B).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1090692:(o,d,m,c,w)=>{t.bc("ReduceMax",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),B).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1090866:(o,d,m,c,w)=>{t.bc("ReduceMin",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),B).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1091040:(o,d,m,c,w)=>{t.bc("ReduceProd",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),B).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1091215:(o,d,m,c,w)=>{t.bc("ReduceSum",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),B).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1091389:(o,d,m,c,w)=>{t.bc("ReduceL1",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),B).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1091562:(o,d,m,c,w)=>{t.bc("ReduceL2",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),B).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1091735:(o,d,m,c,w)=>{t.bc("ReduceLogSum",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),B).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1091912:(o,d,m,c,w)=>{t.bc("ReduceSumSquare",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),B).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1092092:(o,d,m,c,w)=>{t.bc("ReduceLogSumExp",o,{keepDims:!!d,noopWithEmptyAxes:!!m,axes:c?Array.from((v(),B).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1092272:o=>{t.bc("Where",o,void 0)},1092325:(o,d,m)=>{t.bc("Transpose",o,{perm:d?Array.from((v(),B).subarray(Number(d)>>>0,Number(m)>>>0)):[]})},1092449:(o,d,m,c)=>{t.bc("DepthToSpace",o,{blocksize:d,mode:ke(m),format:c?"NHWC":"NCHW"})},1092582:(o,d,m,c)=>{t.bc("DepthToSpace",o,{blocksize:d,mode:ke(m),format:c?"NHWC":"NCHW"})},1092715:(o,d,m,c)=>{t.bc("DFT",o,{axis:d,inverse:m,onesided:c})},1092807:(o,d,m,c,w,T,C,N,L,W,se,pe,ge,_e,ct)=>{t.bc("ConvTranspose",o,{format:L?"NHWC":"NCHW",autoPad:d,dilations:[m],group:c,kernelShape:[w],pads:[T,C],strides:[N],wIsConst:()=>!!(v(),q)[W>>>0],outputPadding:se?Array.from((v(),B).subarray(Number(se)>>>0,Number(pe)>>>0)):[],outputShape:ge?Array.from((v(),B).subarray(Number(ge)>>>0,Number(_e)>>>0)):[],activation:ke(ct)})},1093240:(o,d,m,c,w,T,C,N,L,W,se,pe,ge,_e)=>{t.bc("ConvTranspose",o,{format:N?"NHWC":"NCHW",autoPad:d,dilations:Array.from((v(),B).subarray(Number(m)>>>0,(Number(m)>>>0)+2>>>0)),group:c,kernelShape:Array.from((v(),B).subarray(Number(w)>>>0,(Number(w)>>>0)+2>>>0)),pads:Array.from((v(),B).subarray(Number(T)>>>0,(Number(T)>>>0)+4>>>0)),strides:Array.from((v(),B).subarray(Number(C)>>>0,(Number(C)>>>0)+2>>>0)),wIsConst:()=>!!(v(),q)[L>>>0],outputPadding:W?Array.from((v(),B).subarray(Number(W)>>>0,Number(se)>>>0)):[],outputShape:pe?Array.from((v(),B).subarray(Number(pe)>>>0,Number(ge)>>>0)):[],activation:ke(_e)})},1093901:(o,d,m,c,w,T,C,N,L,W,se,pe,ge,_e,ct)=>{t.bc("ConvTranspose",o,{format:L?"NHWC":"NCHW",autoPad:d,dilations:[m],group:c,kernelShape:[w],pads:[T,C],strides:[N],wIsConst:()=>!!(v(),q)[W>>>0],outputPadding:se?Array.from((v(),B).subarray(Number(se)>>>0,Number(pe)>>>0)):[],outputShape:ge?Array.from((v(),B).subarray(Number(ge)>>>0,Number(_e)>>>0)):[],activation:ke(ct)})},1094334:(o,d,m,c,w,T,C,N,L,W,se,pe,ge,_e)=>{t.bc("ConvTranspose",o,{format:N?"NHWC":"NCHW",autoPad:d,dilations:Array.from((v(),B).subarray(Number(m)>>>0,(Number(m)>>>0)+2>>>0)),group:c,kernelShape:Array.from((v(),B).subarray(Number(w)>>>0,(Number(w)>>>0)+2>>>0)),pads:Array.from((v(),B).subarray(Number(T)>>>0,(Number(T)>>>0)+4>>>0)),strides:Array.from((v(),B).subarray(Number(C)>>>0,(Number(C)>>>0)+2>>>0)),wIsConst:()=>!!(v(),q)[L>>>0],outputPadding:W?Array.from((v(),B).subarray(Number(W)>>>0,Number(se)>>>0)):[],outputShape:pe?Array.from((v(),B).subarray(Number(pe)>>>0,Number(ge)>>>0)):[],activation:ke(_e)})},1094995:(o,d)=>{t.bc("GlobalAveragePool",o,{format:d?"NHWC":"NCHW"})},1095086:(o,d,m,c,w,T,C,N,L,W,se,pe,ge,_e)=>{t.bc("AveragePool",o,{format:_e?"NHWC":"NCHW",auto_pad:d,ceil_mode:m,count_include_pad:c,storage_order:w,dilations:T?Array.from((v(),B).subarray(Number(T)>>>0,Number(C)>>>0)):[],kernel_shape:N?Array.from((v(),B).subarray(Number(N)>>>0,Number(L)>>>0)):[],pads:W?Array.from((v(),B).subarray(Number(W)>>>0,Number(se)>>>0)):[],strides:pe?Array.from((v(),B).subarray(Number(pe)>>>0,Number(ge)>>>0)):[]})},1095565:(o,d)=>{t.bc("GlobalAveragePool",o,{format:d?"NHWC":"NCHW"})},1095656:(o,d,m,c,w,T,C,N,L,W,se,pe,ge,_e)=>{t.bc("AveragePool",o,{format:_e?"NHWC":"NCHW",auto_pad:d,ceil_mode:m,count_include_pad:c,storage_order:w,dilations:T?Array.from((v(),B).subarray(Number(T)>>>0,Number(C)>>>0)):[],kernel_shape:N?Array.from((v(),B).subarray(Number(N)>>>0,Number(L)>>>0)):[],pads:W?Array.from((v(),B).subarray(Number(W)>>>0,Number(se)>>>0)):[],strides:pe?Array.from((v(),B).subarray(Number(pe)>>>0,Number(ge)>>>0)):[]})},1096135:(o,d)=>{t.bc("GlobalMaxPool",o,{format:d?"NHWC":"NCHW"})},1096222:(o,d,m,c,w,T,C,N,L,W,se,pe,ge,_e)=>{t.bc("MaxPool",o,{format:_e?"NHWC":"NCHW",auto_pad:d,ceil_mode:m,count_include_pad:c,storage_order:w,dilations:T?Array.from((v(),B).subarray(Number(T)>>>0,Number(C)>>>0)):[],kernel_shape:N?Array.from((v(),B).subarray(Number(N)>>>0,Number(L)>>>0)):[],pads:W?Array.from((v(),B).subarray(Number(W)>>>0,Number(se)>>>0)):[],strides:pe?Array.from((v(),B).subarray(Number(pe)>>>0,Number(ge)>>>0)):[]})},1096697:(o,d)=>{t.bc("GlobalMaxPool",o,{format:d?"NHWC":"NCHW"})},1096784:(o,d,m,c,w,T,C,N,L,W,se,pe,ge,_e)=>{t.bc("MaxPool",o,{format:_e?"NHWC":"NCHW",auto_pad:d,ceil_mode:m,count_include_pad:c,storage_order:w,dilations:T?Array.from((v(),B).subarray(Number(T)>>>0,Number(C)>>>0)):[],kernel_shape:N?Array.from((v(),B).subarray(Number(N)>>>0,Number(L)>>>0)):[],pads:W?Array.from((v(),B).subarray(Number(W)>>>0,Number(se)>>>0)):[],strides:pe?Array.from((v(),B).subarray(Number(pe)>>>0,Number(ge)>>>0)):[]})},1097259:(o,d,m,c,w)=>{t.bc("Gemm",o,{alpha:d,beta:m,transA:c,transB:w})},1097363:o=>{t.bc("MatMul",o,void 0)},1097417:(o,d,m,c)=>{t.bc("ArgMax",o,{keepDims:!!d,selectLastIndex:!!m,axis:c})},1097525:(o,d,m,c)=>{t.bc("ArgMin",o,{keepDims:!!d,selectLastIndex:!!m,axis:c})},1097633:(o,d)=>{t.bc("Softmax",o,{axis:d})},1097696:(o,d)=>{t.bc("Concat",o,{axis:d})},1097756:(o,d,m,c,w)=>{t.bc("Split",o,{axis:d,numOutputs:m,splitSizes:c?Array.from((v(),B).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1097912:o=>{t.bc("Expand",o,void 0)},1097966:(o,d)=>{t.bc("Gather",o,{axis:Number(d)})},1098037:(o,d)=>{t.bc("GatherElements",o,{axis:Number(d)})},1098116:(o,d)=>{t.bc("GatherND",o,{batch_dims:Number(d)})},1098195:(o,d,m,c,w,T,C,N,L,W,se)=>{t.bc("Resize",o,{antialias:d,axes:m?Array.from((v(),B).subarray(Number(m)>>>0,Number(c)>>>0)):[],coordinateTransformMode:ke(w),cubicCoeffA:T,excludeOutside:C,extrapolationValue:N,keepAspectRatioPolicy:ke(L),mode:ke(W),nearestMode:ke(se)})},1098557:(o,d,m,c,w,T,C)=>{t.bc("Slice",o,{starts:d?Array.from((v(),B).subarray(Number(d)>>>0,Number(m)>>>0)):[],ends:c?Array.from((v(),B).subarray(Number(c)>>>0,Number(w)>>>0)):[],axes:T?Array.from((v(),B).subarray(Number(T)>>>0,Number(C)>>>0)):[]})},1098821:o=>{t.bc("Tile",o,void 0)},1098873:(o,d,m)=>{t.bc("InstanceNormalization",o,{epsilon:d,format:m?"NHWC":"NCHW"})},1098987:(o,d,m)=>{t.bc("InstanceNormalization",o,{epsilon:d,format:m?"NHWC":"NCHW"})},1099101:o=>{t.bc("Range",o,void 0)},1099154:(o,d)=>{t.bc("Einsum",o,{equation:ke(d)})},1099235:(o,d,m,c,w)=>{t.bc("Pad",o,{mode:d,value:m,pads:c?Array.from((v(),B).subarray(Number(c)>>>0,Number(w)>>>0)):[]})},1099378:(o,d,m,c,w,T)=>{t.bc("BatchNormalization",o,{epsilon:d,momentum:m,spatial:!!w,trainingMode:!!c,format:T?"NHWC":"NCHW"})},1099547:(o,d,m,c,w,T)=>{t.bc("BatchNormalization",o,{epsilon:d,momentum:m,spatial:!!w,trainingMode:!!c,format:T?"NHWC":"NCHW"})},1099716:(o,d,m)=>{t.bc("CumSum",o,{exclusive:Number(d),reverse:Number(m)})},1099813:(o,d,m)=>{t.bc("DequantizeLinear",o,{axis:d,blockSize:m})},1099903:(o,d,m,c,w)=>{t.bc("GridSample",o,{align_corners:d,mode:ke(m),padding_mode:ke(c),format:w?"NHWC":"NCHW"})},1100073:(o,d,m,c,w)=>{t.bc("GridSample",o,{align_corners:d,mode:ke(m),padding_mode:ke(c),format:w?"NHWC":"NCHW"})},1100243:(o,d)=>{t.bc("ScatterND",o,{reduction:ke(d)})},1100328:(o,d,m,c,w,T,C,N,L)=>{t.bc("Attention",o,{numHeads:d,isUnidirectional:m,maskFilterValue:c,scale:w,doRotary:T,qkvHiddenSizes:C?Array.from((v(),B).subarray(Number(N)>>>0,Number(N)+C>>>0)):[],pastPresentShareBuffer:!!L})},1100600:o=>{t.bc("BiasAdd",o,void 0)},1100655:o=>{t.bc("BiasSplitGelu",o,void 0)},1100716:o=>{t.bc("FastGelu",o,void 0)},1100772:(o,d,m,c,w,T,C,N,L,W,se,pe,ge,_e,ct,bi)=>{t.bc("Conv",o,{format:pe?"NHWC":"NCHW",auto_pad:d,dilations:m?Array.from((v(),B).subarray(Number(m)>>>0,Number(c)>>>0)):[],group:w,kernel_shape:T?Array.from((v(),B).subarray(Number(T)>>>0,Number(C)>>>0)):[],pads:N?Array.from((v(),B).subarray(Number(N)>>>0,Number(L)>>>0)):[],strides:W?Array.from((v(),B).subarray(Number(W)>>>0,Number(se)>>>0)):[],w_is_const:()=>!!(v(),q)[Number(ge)>>>0],activation:ke(_e),activation_params:ct?Array.from((v(),G).subarray(Number(ct)>>>0,Number(bi)>>>0)):[]})},1101356:o=>{t.bc("Gelu",o,void 0)},1101408:(o,d,m,c,w,T,C,N,L)=>{t.bc("GroupQueryAttention",o,{numHeads:d,kvNumHeads:m,scale:c,softcap:w,doRotary:T,rotaryInterleaved:C,smoothSoftmax:N,localWindowSize:L})},1101625:(o,d,m,c)=>{t.bc("LayerNormalization",o,{axis:d,epsilon:m,simplified:!!c})},1101736:(o,d,m,c)=>{t.bc("LayerNormalization",o,{axis:d,epsilon:m,simplified:!!c})},1101847:(o,d,m,c,w,T)=>{t.bc("MatMulNBits",o,{k:d,n:m,accuracyLevel:c,bits:w,blockSize:T})},1101974:(o,d,m,c,w,T)=>{t.bc("MultiHeadAttention",o,{numHeads:d,isUnidirectional:m,maskFilterValue:c,scale:w,doRotary:T})},1102133:(o,d)=>{t.bc("QuickGelu",o,{alpha:d})},1102197:(o,d,m,c,w)=>{t.bc("RotaryEmbedding",o,{interleaved:!!d,numHeads:m,rotaryEmbeddingDim:c,scale:w})},1102336:(o,d,m)=>{t.bc("SkipLayerNormalization",o,{epsilon:d,simplified:!!m})},1102438:(o,d,m)=>{t.bc("SkipLayerNormalization",o,{epsilon:d,simplified:!!m})},1102540:(o,d,m,c)=>{t.bc("GatherBlockQuantized",o,{gatherAxis:d,quantizeAxis:m,blockSize:c})},1102661:o=>{t.Id(o)},1102695:(o,d)=>t.Kd(Number(o),Number(d),t.$c.Nd,t.$c.errors)};function ig(o,d,m){return Gn(async()=>{await t.Gd(Number(o),Number(d),Number(m))})}function ag(){return typeof wasmOffsetConverter<"u"}function ng(o,d,m,c){var w=ue();try{return Is(o,d,m,c)}catch(T){if(oe(w),T!==T+0)throw T;le(1,0)}}function sg(o,d,m){var c=ue();try{return xs(o,d,m)}catch(w){if(oe(c),w!==w+0)throw w;le(1,0)}}function og(o){var d=ue();try{ws(o)}catch(m){if(oe(d),m!==m+0)throw m;le(1,0)}}function ug(o,d){var m=ue();try{return yi(o,d)}catch(c){if(oe(m),c!==c+0)throw c;le(1,0)}}function lg(o,d,m){var c=ue();try{bs(o,d,m)}catch(w){if(oe(c),w!==w+0)throw w;le(1,0)}}function dg(o,d){var m=ue();try{Es(o,d)}catch(c){if(oe(m),c!==c+0)throw c;le(1,0)}}function pg(o,d,m,c,w,T,C){var N=ue();try{return ks(o,d,m,c,w,T,C)}catch(L){if(oe(N),L!==L+0)throw L;le(1,0)}}function cg(o,d,m,c,w,T){var C=ue();try{$s(o,d,m,c,w,T)}catch(N){if(oe(C),N!==N+0)throw N;le(1,0)}}function hg(o,d,m,c){var w=ue();try{Ts(o,d,m,c)}catch(T){if(oe(w),T!==T+0)throw T;le(1,0)}}function fg(o,d,m,c,w){var T=ue();try{vs(o,d,m,c,w)}catch(C){if(oe(T),C!==C+0)throw C;le(1,0)}}function mg(o,d,m,c,w,T,C){var N=ue();try{Cs(o,d,m,c,w,T,C)}catch(L){if(oe(N),L!==L+0)throw L;le(1,0)}}function gg(o,d,m,c,w,T,C){var N=ue();try{As(o,d,m,c,w,T,C)}catch(L){if(oe(N),L!==L+0)throw L;le(1,0)}}function yg(o,d,m,c,w,T,C,N){var L=ue();try{Ns(o,d,m,c,w,T,C,N)}catch(W){if(oe(L),W!==W+0)throw W;le(1,0)}}function _g(o,d,m,c,w){var T=ue();try{return zs(o,d,m,c,w)}catch(C){if(oe(T),C!==C+0)throw C;le(1,0)}}function bg(o,d,m){var c=ue();try{return Ms(o,d,m)}catch(w){if(oe(c),w!==w+0)throw w;le(1,0)}}function wg(o,d,m,c,w,T,C,N){var L=ue();try{Ds(o,d,m,c,w,T,C,N)}catch(W){if(oe(L),W!==W+0)throw W;le(1,0)}}function $g(o,d,m,c,w,T,C,N,L,W,se,pe){var ge=ue();try{Os(o,d,m,c,w,T,C,N,L,W,se,pe)}catch(_e){if(oe(ge),_e!==_e+0)throw _e;le(1,0)}}function vg(o,d,m){var c=ue();try{return Us(o,d,m)}catch(w){if(oe(c),w!==w+0)throw w;return le(1,0),0n}}function xg(o,d,m,c,w,T,C,N,L){var W=ue();try{Ss(o,d,m,c,w,T,C,N,L)}catch(se){if(oe(W),se!==se+0)throw se;le(1,0)}}function Sg(o){var d=ue();try{return Ps(o)}catch(m){if(oe(d),m!==m+0)throw m;le(1,0)}}function kg(o,d){var m=ue();try{return to(o,d)}catch(c){if(oe(m),c!==c+0)throw c;return le(1,0),0n}}function Tg(o,d,m,c){var w=ue();try{return qs(o,d,m,c)}catch(T){if(oe(w),T!==T+0)throw T;le(1,0)}}function Ig(o){var d=ue();try{return Ls(o)}catch(m){if(oe(d),m!==m+0)throw m;return le(1,0),0n}}function Eg(o,d,m,c){var w=ue();try{return js(o,d,m,c)}catch(T){if(oe(w),T!==T+0)throw T;le(1,0)}}function zg(o,d,m,c,w){var T=ue();try{return Ks(o,d,m,c,w)}catch(C){if(oe(T),C!==C+0)throw C;le(1,0)}}function Cg(o,d,m,c,w,T){var C=ue();try{return Zs(o,d,m,c,w,T)}catch(N){if(oe(C),N!==N+0)throw N;le(1,0)}}function Ag(o,d,m,c,w,T){var C=ue();try{return Bs(o,d,m,c,w,T)}catch(N){if(oe(C),N!==N+0)throw N;le(1,0)}}function Og(o,d,m,c,w,T){var C=ue();try{return Xs(o,d,m,c,w,T)}catch(N){if(oe(C),N!==N+0)throw N;le(1,0)}}function Bg(o,d,m,c,w,T,C,N){var L=ue();try{return Rs(o,d,m,c,w,T,C,N)}catch(W){if(oe(L),W!==W+0)throw W;le(1,0)}}function Rg(o,d,m,c,w){var T=ue();try{return Qs(o,d,m,c,w)}catch(C){if(oe(T),C!==C+0)throw C;return le(1,0),0n}}function Ng(o,d,m,c){var w=ue();try{return Ys(o,d,m,c)}catch(T){if(oe(w),T!==T+0)throw T;le(1,0)}}function Mg(o,d,m,c){var w=ue();try{return Js(o,d,m,c)}catch(T){if(oe(w),T!==T+0)throw T;le(1,0)}}function Dg(o,d,m,c,w,T,C,N,L,W,se,pe){var ge=ue();try{return eo(o,d,m,c,w,T,C,N,L,W,se,pe)}catch(_e){if(oe(ge),_e!==_e+0)throw _e;le(1,0)}}function Ug(o,d,m,c,w,T,C,N,L,W,se){var pe=ue();try{Hs(o,d,m,c,w,T,C,N,L,W,se)}catch(ge){if(oe(pe),ge!==ge+0)throw ge;le(1,0)}}function Pg(o,d,m,c,w,T,C,N,L,W,se,pe,ge,_e,ct,bi){var Vg=ue();try{Fs(o,d,m,c,w,T,C,N,L,W,se,pe,ge,_e,ct,bi)}catch(wi){if(oe(Vg),wi!==wi+0)throw wi;le(1,0)}}function qg(o,d,m){var c=ue();try{return Ws(o,d,m)}catch(w){if(oe(c),w!==w+0)throw w;le(1,0)}}function Lg(o,d,m){var c=ue();try{return Vs(o,d,m)}catch(w){if(oe(c),w!==w+0)throw w;le(1,0)}}function Wg(o,d,m,c){var w=ue();try{Gs(o,d,m,c)}catch(T){if(oe(w),T!==T+0)throw T;le(1,0)}}function kr(){if(0<be)Be=kr;else if(a)$?.(t),X();else{for(var o=me;0<o.length;)o.shift()(t);0<be?Be=kr:(t.calledRun=!0,z||(X(),$?.(t)))}}return a||(it=await Ae(),kr()),t.PTR_SIZE=4,U?t:new Promise((o,d)=>{$=o,S=d})}var gp,uo,l0=P(()=>{"use strict";gp=oo,uo=globalThis.self?.name?.startsWith("em-pthread"),uo&&oo()}),Ti,va,lo,Ne,yp,Ir,po,co,Ii,ho,Ei,_p,zi,bp,qa=P(()=>{"use strict";Pa(),Ti=typeof location>"u"?void 0:location.origin,va=import.meta.url>"file:"&&import.meta.url<"file;",lo=()=>{if(va){let e=URL;return new URL(new e("ort.bundle.min.mjs",import.meta.url).href,Ti).href}return import.meta.url},Ne=lo(),yp=()=>{if(Ne&&!Ne.startsWith("blob:"))return Ne.substring(0,Ne.lastIndexOf("/")+1)},Ir=(e,t)=>{try{let r=t??Ne;return(r?new URL(e,r):new URL(e)).origin===Ti}catch{return!1}},po=(e,t)=>{let r=t??Ne;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},co=(e,t)=>`${t??"./"}${e}`,Ii=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},ho=async e=>(await import(e)).default,Ei=(u0(),pr(hp)).default,_p=async()=>{if(!Ne)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Ir(Ne))return[void 0,Ei()];let e=await Ii(Ne);return[e,Ei(e)]},zi=(l0(),pr(mp)).default,bp=async(e,t,r,i)=>{let a=zi&&!(e||t);if(a)if(Ne)a=Ir(Ne)||i&&!r;else if(i&&!r)a=!0;else throw new Error("cannot determine the script source URL.");if(a)return[void 0,zi];{let n="ort-wasm-simd-threaded.jsep.mjs",s=e??po(n,t),u=r&&s&&!Ir(s,t),l=u?await Ii(s):s??co(n,t);return[u?l:void 0,await ho(l)]}}}),Ci,Er,Qt,Ai,fo,mo,go,La,ye,Mt=P(()=>{"use strict";qa(),Er=!1,Qt=!1,Ai=!1,fo=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},mo=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},go=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},La=async e=>{if(Er)return Promise.resolve();if(Qt)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(Ai)throw new Error("previous call to 'initializeWebAssembly()' failed.");Qt=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!go())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!mo())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=fo();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let a=e.wasmPaths,n=typeof a=="string"?a:void 0,s=a?.mjs,u=s?.href??s,l=a?.wasm,p=l?.href??l,f=e.wasmBinary,[h,g]=await bp(u,n,r>1,!!f||!!p),_=!1,y=[];if(t>0&&y.push(new Promise($=>{setTimeout(()=>{_=!0,$()},t)})),y.push(new Promise(($,S)=>{let x={numThreads:r};if(f)x.wasmBinary=f,x.locateFile=b=>b;else if(p||n)x.locateFile=b=>p??n+b;else if(u&&u.indexOf("blob:")!==0)x.locateFile=b=>new URL(b,u).href;else if(h){let b=yp();b&&(x.locateFile=E=>b+E)}g(x).then(b=>{Qt=!1,Er=!0,Ci=b,$(),h&&URL.revokeObjectURL(h)},b=>{Qt=!1,Ai=!0,S(b)})})),await Promise.race(y),_)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},ye=()=>{if(Er&&Ci)return Ci;throw new Error("WebAssembly is not initialized yet.")}}),je,Vr,fe,Wa=P(()=>{"use strict";Mt(),je=(e,t)=>{let r=ye(),i=r.lengthBytesUTF8(e)+1,a=r._malloc(i);return r.stringToUTF8(e,a,i),t.push(a),a},Vr=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([a,n])=>{let s=t?t+a:a;if(typeof n=="object")Vr(n,s+".",r,i);else if(typeof n=="string"||typeof n=="number")i(s,n.toString());else if(typeof n=="boolean")i(s,n?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof n}`)})},fe=e=>{let t=ye(),r=t.stackSave();try{let i=t.PTR_SIZE,a=t.stackAlloc(2*i);t._OrtGetLastError(a,a+i);let n=Number(t.getValue(a,i===4?"i32":"i64")),s=t.getValue(a+i,"*"),u=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${n}, ERROR_MESSAGE: ${u}`)}finally{t.stackRestore(r)}}}),wp,d0=P(()=>{"use strict";Mt(),Wa(),wp=e=>{let t=ye(),r=0,i=[],a=e||{};try{if(e?.logSeverityLevel===void 0)a.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)a.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(a.terminate=!1);let n=0;return e?.tag!==void 0&&(n=je(e.tag,i)),r=t._OrtCreateRunOptions(a.logSeverityLevel,a.logVerbosityLevel,!!a.terminate,n),r===0&&fe("Can't create run options."),e?.extra!==void 0&&Vr(e.extra,"",new WeakSet,(s,u)=>{let l=je(s,i),p=je(u,i);t._OrtAddRunConfigEntry(r,l,p)!==0&&fe(`Can't set a run config entry: ${s} - ${u}.`)}),[r,i]}catch(n){throw r!==0&&t._OrtReleaseRunOptions(r),i.forEach(s=>t._free(s)),n}}}),yo,_o,bo,xt,wo,$p,p0=P(()=>{"use strict";Mt(),Wa(),yo=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},_o=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},bo=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},xt=(e,t,r,i)=>{let a=je(t,i),n=je(r,i);ye()._OrtAddSessionConfigEntry(e,a,n)!==0&&fe(`Can't set a session config entry: ${t} - ${r}.`)},wo=async(e,t,r)=>{let i=t.executionProviders;for(let a of i){let n=typeof a=="string"?a:a.name,s=[];switch(n){case"webnn":if(n="WEBNN",xt(e,"session.disable_quant_qdq","1",r),xt(e,"session.disable_qdq_constant_folding","1",r),typeof a!="string"){let h=a?.deviceType;h&&xt(e,"deviceType",h,r)}break;case"webgpu":if(n="JS",typeof a!="string"){let h=a;if(h?.preferredLayout){if(h.preferredLayout!=="NCHW"&&h.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${h.preferredLayout}`);xt(e,"preferredLayout",h.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${n}`)}let u=je(n,r),l=s.length,p=0,f=0;if(l>0){p=ye()._malloc(l*ye().PTR_SIZE),r.push(p),f=ye()._malloc(l*ye().PTR_SIZE),r.push(f);for(let h=0;h<l;h++)ye().setValue(p+h*ye().PTR_SIZE,s[h][0],"*"),ye().setValue(f+h*ye().PTR_SIZE,s[h][1],"*")}await ye()._OrtAppendExecutionProvider(e,u,p,f,l)!==0&&fe(`Can't append execution provider: ${n}.`)}},$p=async e=>{let t=ye(),r=0,i=[],a=e||{};bo(a);try{let n=yo(a.graphOptimizationLevel??"all"),s=_o(a.executionMode??"sequential"),u=typeof a.logId=="string"?je(a.logId,i):0,l=a.logSeverityLevel??2;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log severity level is not valid: ${l}`);let p=a.logVerbosityLevel??0;if(!Number.isInteger(p)||p<0||p>4)throw new Error(`log verbosity level is not valid: ${p}`);let f=typeof a.optimizedModelFilePath=="string"?je(a.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(n,!!a.enableCpuMemArena,!!a.enableMemPattern,s,!!a.enableProfiling,0,u,l,p,f),r===0&&fe("Can't create session options."),a.executionProviders&&await wo(r,a,i),a.enableGraphCapture!==void 0){if(typeof a.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${a.enableGraphCapture}`);xt(r,"enableGraphCapture",a.enableGraphCapture.toString(),i)}if(a.freeDimensionOverrides)for(let[h,g]of Object.entries(a.freeDimensionOverrides)){if(typeof h!="string")throw new Error(`free dimension override name must be a string: ${h}`);if(typeof g!="number"||!Number.isInteger(g)||g<0)throw new Error(`free dimension override value must be a non-negative integer: ${g}`);let _=je(h,i);t._OrtAddFreeDimensionOverride(r,_,g)!==0&&fe(`Can't set a free dimension override: ${h} - ${g}.`)}return a.extra!==void 0&&Vr(a.extra,"",new WeakSet,(h,g)=>{xt(r,h,g,i)}),[r,i]}catch(n){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&fe("Can't release session options."),i.forEach(s=>t._free(s)),n}}}),zt,st,Ct,Xr,Gr,Va,Ga,xa,te=P(()=>{"use strict";zt=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},st=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Ct=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((a,n)=>a*n,1);return r>0?Math.ceil(i*r):void 0},Xr=e=>{switch(e){case"float16":return typeof Float16Array<"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},Gr=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},Va=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Ga=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",xa=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),Ha,vp=P(()=>{"use strict";Pa(),Ha=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let a=t.body.getReader(),n;try{n=new ArrayBuffer(i)}catch(u){if(u instanceof RangeError){let l=Math.ceil(i/65536);n=new WebAssembly.Memory({initial:l,maximum:l}).buffer}else throw u}let s=0;for(;;){let{done:u,value:l}=await a.read();if(u)break;let p=l.byteLength;new Uint8Array(n,s,p).set(l),s+=p}return new Uint8Array(n,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),$o,vo,xo,So,Fa,ko,de,ot=P(()=>{"use strict";te(),$o=["V","I","W","E","F"],vo=(e,t)=>{console.log(`[${$o[e]},${new Date().toISOString()}]${t}`)},Fa=(e,t)=>{xo=e,So=t},ko=(e,t)=>{let r=Gr(e),i=Gr(xo);r>=i&&vo(r,typeof t=="function"?t():t)},de=(...e)=>{So&&ko(...e)}}),To,Vt,O,Hr,xp,Sp,kp,ie=P(()=>{"use strict";To=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Vt=class{static calcShape(e,t,r=!1){let i=e.length,a=t.length;if(i===0)return t;if(a===0)return e;let n=Math.max(e.length,t.length),s=new Array(n);if(r){if(i<2||a<2)return;let u=To.calcMatMulShape([e[i-2],e[i-1]],[t[a-2],t[a-1]]);if(u===void 0)return;[s[n-2],s[n-1]]=u}for(let u=r?3:1;u<=n;u++){let l=i-u<0?1:e[i-u],p=a-u<0?1:t[a-u];if(l!==p&&l>1&&p>1)return;let f=Math.max(l,p);if(l&&p)s[n-u]=Math.max(l,p);else{if(f>1)return;s[n-u]=0}}return s}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let a=1;a<=r;a++)if(e[r-a]!==1&&e[r-a]!==t[i-a])return!1;return!0}},O=class qr{static size(t){return qr.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let a=new Array(i),n=i-1;for(;n>=0;){if(t[n]%r===0){a[n]=t[n]/r;break}if(r%t[n]!==0)throw new Error("cannot convert shape");a[n]=1,r/=t[n],n--}for(n--;n>=0;n--)a[n]=t[n];return a}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return qr.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return qr.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let a=1;for(let n=r;n<i;n++){if(t[n]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");a*=Number(t[n])}return a}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let a=r-3;a>=0;--a)i[a]=i[a+1]*t[a+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((a,n)=>a+r[n]+r[n+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,a)=>i===r[a])}},Hr=class yt{static adjustPoolAttributes(t,r,i,a,n,s){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let u=0;u<r.length-2;u++)u>=i.length?i.push(r[u+2]):i[u]=r[u+2];for(let u=0;u<i.length;u++)if(u<a.length){if(a[u]<0)throw new Error("strides should be greater than or equal to 1")}else a.push(1);for(let u=0;u<i.length;u++)if(u<n.length){if(n[u]<0)throw new Error("dilations should be greater than or equal to 1")}else n.push(1);for(let u=0;u<i.length*2;u++)if(u<s.length){if(s[u]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let u=0;u<i.length;u++){if(i[u]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[u]>=i[u]||s[u+i.length]>=i[u])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,a,n,s,u){if(u){if(n.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(a.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let l=0;l<t.length-2;l++)yt.adjustPadAndReturnShape(t[l+(s?1:2)],r[l],i[l],a[l],n,l,l+t.length-2,u)}}static computePoolOutputShape(t,r,i,a,n,s,u,l=0){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let p=[r[0],r[1]];return yt.computeShapeHelper(t,r,p,i,a,n,s,u,l),p}static computeConvOutputShape(t,r,i,a,n,s,u){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let l=[t[0],r[0]];return yt.computeShapeHelper(!1,t,l,i,a,n,s,u),l}static computeShapeHelper(t,r,i,a,n,s,u,l,p=0){if(t)for(let f=0;f<r.length-2;f++)i.push(1);else for(let f=0;f<r.length-2;f++)i.push(yt.adjustPadAndReturnShape(r[f+2],a[f],n[f],s[f],u,f,f+r.length-2,l,p))}static computeOutputSize(t,r,i,a,n){let s=Math.floor(t/r)+1;return n===1&&(s=Math.ceil(t/r)+1,(s-1)*r>=i+a&&(s-=1)),s}static adjustPadAndReturnShape(t,r,i,a,n,s,u,l,p=0){let f=i*(a-1)+1;if(l&&l!=="NOTSET")switch(l){case"VALID":return n[s]=0,n[u]=0,yt.computeOutputSize(t-f,r,t,0,p);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let h=(Math.floor((t+r-1)/r)-1)*r+a-t;return n[s]=Math.floor(l==="SAME_LOWER"?(h+1)/2:h/2),n[u]=h-n[s],yt.computeOutputSize(t+n[s]+n[u]-f,r,t,n[s],p)}default:throw new Error("Unsupported AutoPad type")}else return yt.computeOutputSize(t+n[s]+n[u]-f,r,t,n[s],p)}},xp=class{static getShapeOfGemmResult(e,t,r,i,a){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let n,s,u;t?(n=e[1],s=e[0]):(n=e[0],s=e[1]);let l=-1;if(i?(u=r[0],l=1):(u=r[1],l=0),r[l]!==s)throw new Error("dimension mismatch");if(n<=0||u<=0||s<=0)throw new Error("invalid shape specified");if(a&&!Vt.isValidBroadcast(a,[n,u]))throw new Error("gemm: invalid bias shape for broadcast");return[n,u,s]}},Sp=-34028234663852886e22,kp=34028234663852886e22}),ja,Tp=P(()=>{"use strict";te(),ja=(e,t)=>new(Xr(t))(e)}),Oi,Io,Bi,Eo,Ri,zo,Ni,Mi,Di,Co,Ip,c0=P(()=>{"use strict";te(),ot(),Oi=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),Io=(e,t)=>{if(t==="int32")return e;let r=Oi.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let i=r/8;if(e.byteLength%i!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${i}.`);let a=e.byteLength/i,n=new(Xr(t))(e.buffer,e.byteOffset,a);switch(t){case"int64":case"uint64":{let s=new Int32Array(a);for(let u=0;u<a;u++){let l=n[u];if(l>2147483647n||l<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");s[u]=Number(l)}return new Uint8Array(s.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&n.some(u=>u>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let s=Int32Array.from(n,Number);return new Uint8Array(s.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},Bi=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let a=BigInt64Array.from(i,BigInt);return new Uint8Array(a.buffer)}case"uint64":{if(i.some(n=>n<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let a=BigUint64Array.from(i,BigInt);return new Uint8Array(a.buffer)}case"int8":{if(i.some(n=>n<-128||n>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let a=Int8Array.from(i,Number);return new Uint8Array(a.buffer)}case"uint8":{if(i.some(a=>a<0||a>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(i,Number)}case"uint32":{if(i.some(n=>n<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let a=Uint32Array.from(i,Number);return new Uint8Array(a.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},Eo=1,Ri=()=>Eo++,zo=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),Ni=(e,t)=>{let r=Oi.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((i,a)=>i*a)*r/8):0},Mi=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:i,dataType:a,shape:n,fallbackDataType:s}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=a,this.tensorShape=n,this.fallbackDataType=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return Ni(this.dataType,this.tensorShape)}destroy(){de("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=Bi(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return new Uint8Array(r).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,a)=>i===r[a])}setIsDataConverted(e){this.isDataConverted=e}},Di=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let a=this.tensorManager.getMLContext(e),n=this.tensorManager.getMLOpSupportLimits(e),s;if(!n?.input.dataTypes.includes(t)){if(s=zo.get(t),!s||!n?.input.dataTypes.includes(s))throw new Error(`WebNN backend does not support data type: ${t}`);de("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${s}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(a,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==Ni(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let u=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,u,!0,!0,s),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=Io(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else de("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){if(this.activeUpload){let t=this.wrapper?.isDataConverted?Bi(this.activeUpload,this.wrapper?.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(t):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(t);return}else return t.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},Co=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=Ri();return this.tensorTrackersById.set(e,new Di(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,a){de("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${a}}`);let n=this.tensorTrackersById.get(t);if(!n)throw new Error("Tensor not found.");return n.ensureTensor(e,r,i,a)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){de("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let a=this.getMLContext(e),n=Ri(),s=new Mi({sessionId:e,context:a,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(n,new Di(this,s)),this.externalTensors.add(s),n}async getCachedTensor(e,t,r,i,a,n,s){let u=this.getMLContext(e);for(let[p,f]of this.freeTensors.entries())if(f.canReuseTensor(u,t,r)){de("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}`);let h=this.freeTensors.splice(p,1)[0];return h.sessionId=e,h}de("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}}`);let l=await u.createTensor({dataType:s??t,shape:r,dimensions:r,usage:i,writable:a,readable:n});return new Mi({sessionId:e,context:u,tensor:l,dataType:t,shape:r,fallbackDataType:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},Ip=(...e)=>new Co(...e)}),Yt,Ao,Ep,h0=P(()=>{"use strict";te(),Mt(),Tp(),c0(),ot(),Yt=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),Ao=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((a,n)=>a===i[n]&&e[a]===t[a])},Ep=class{constructor(e){this.tensorManager=Ip(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,Fa(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){de("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){de("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)de("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>Ao(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(a=>a.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){de("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,a){let n=Yt.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,n,i,a)}async createTemporaryTensor(e,t,r){de("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=Yt.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let a=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,a,i,r,!1);let n=this.temporarySessionTensorIds.get(e);return n?n.push(a):this.temporarySessionTensorIds.set(e,[a]),a}uploadTensor(e,t){if(!ye().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");de("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return ja(r,t)}}registerMLTensor(e,t,r,i){let a=Yt.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);let n=this.tensorManager.registerTensor(e,t,a,i);return de("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${a}, dimensions: ${i}} -> {tensorId: ${n}}`),n}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let i=Yt.get(zt(t)),a=this.mlOpSupportLimitsBySessionId.get(e);return typeof i>"u"?!1:r?!!a?.input.dataTypes.includes(i):!!a?.output.dataTypes.includes(i)}flush(){}}}),Ka=P(()=>{"use strict"}),Ui,zr,Cr,Oo,Bo,Pi,Sa,Ro,zp,f0=P(()=>{"use strict";ot(),Ka(),Ui=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),zr=[],Cr=e=>Math.ceil(Number(e)/16)*16,Oo=e=>{for(let t=0;t<zr.length;t++){let r=zr[t];if(e<=r)return r}return Math.ceil(e/16)*16},Bo=1,Pi=()=>Bo++,Sa=async(e,t,r,i)=>{let a=Cr(r),n=e.device.createBuffer({size:a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,n,0,a),e.flush(),await n.mapAsync(GPUMapMode.READ);let u=n.getMappedRange();if(i){let l=i();return l.set(new Uint8Array(u,0,r)),l}else return new Uint8Array(u.slice(0,r))}finally{n.destroy()}},Ro=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of Ui)zr.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,a=t.byteLength,n=Cr(a),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==a)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${a}`);if(n===a&&i%4===0)this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,r,i,a);else{let u=new Uint8Array(n);u.set(t),this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,u,0,n)}de("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let a=Cr(r.originalSize),n=this.backend.getCommandEncoder();this.backend.endComputePass(),n.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,a)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return de("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=Pi();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),de("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),de("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=Oo(e),i,a=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,n=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(a||n){let u=(a?this.freeBuffers:this.freeUniformBuffers).get(r);u?u.length>0?i=u.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let s={id:Pi(),type:0,buffer:i};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),de("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return de("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await Sa(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=Ui.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(de("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},zp=(...e)=>new Ro(...e)}),No,he,Se=P(()=>{"use strict";No=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},he=e=>new No(e)}),Gt,Ar,Ee,Ie,Z,xe,ka,Wt,_t,K,Jt,R,H,Cp,Za,Mo,Ap,ae=P(()=>{"use strict";te(),ie(),Gt=64,Ar=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},Ee=(e,t=1)=>{let r=Ar(e,t);return typeof r=="string"?r:r[0]},Ie=(e,t=1)=>{let r=Ar(e,t);return typeof r=="string"?r:r[1]},Z=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:O.computeStrides(r)})}),t},xe=e=>e%4===0?4:e%2===0?2:1,ka=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,Wt=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,_t=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,K=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,Jt=(e,t,r,i,a)=>{let n=typeof r=="number",s=n?r:r.length,u=[...new Array(s).keys()],l=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,p=Ar(t,a),f=typeof p=="string"?p:p[1],h=typeof p=="string"?p:p[0],g={indices:l,value:f,storage:h,tensor:t},_=U=>typeof U=="string"?U:`${U}u`,y={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},$=n?"uniforms.":"",S=`${$}${e}_shape`,x=`${$}${e}_strides`,b="";for(let U=0;U<s-1;U++)b+=`
    let dim${U} = current / ${K(x,U,s)};
    let rest${U} = current % ${K(x,U,s)};
    indices[${U}] = dim${U};
    current = rest${U};
    `;b+=`indices[${s-1}] = current;`;let E=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${g.indices} {
    var indices: ${g.indices};
    var current = offset;
    ${b}
    return indices;
  }`,k=U=>(y.offsetToIndices=!0,s<2?U:`o2i_${e}(${U})`),I=[];if(s>=2)for(let U=s-1;U>=0;U--)I.push(`${K(x,U,s)} * (indices[${U}])`);let z=s<2?"":`
  fn i2o_${e}(indices: ${g.indices}) -> u32 {
    return ${I.join("+")};
  }`,A=U=>(y.indicesToOffset=!0,s<2?U:`i2o_${e}(${U})`),v=(...U)=>s===0?"0u":`${g.indices}(${U.map(_).join(",")})`,D=(U,Y)=>s<2?`${U}`:`${K(U,Y,s)}`,q=(U,Y,X)=>s<2?`${U}=${X};`:`${K(U,Y,s)}=${X};`,Q={},F=(U,Y)=>{y.broadcastedIndicesToOffset=!0;let X=`${Y.name}broadcastedIndicesTo${e}Offset`;if(X in Q)return`${X}(${U})`;let V=[];for(let Te=s-1;Te>=0;Te--){let Ae=Y.indicesGet("outputIndices",Te+Y.rank-s);V.push(`${D(x,Te)} * (${Ae} % ${D(S,Te)})`)}return Q[X]=`fn ${X}(outputIndices: ${Y.type.indices}) -> u32 {
             return ${V.length>0?V.join("+"):"0u"};
           }`,`${X}(${U})`},j=(U,Y)=>(()=>{if(g.storage===g.value)return`${e}[${U}]=${Y};`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`${e}[${U}]=vec2<u32>(u32(${Y}), select(0u, 0xFFFFFFFFu, ${Y} < 0));`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`${e}[${U}]=vec2<u32>(u32(${Y}), 0u);`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`${e}[${U}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${Y}));`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),B=U=>(()=>{if(g.storage===g.value)return`${e}[${U}]`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`i32(${e}[${U}].x)`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`u32(${e}[${U}].x)`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${U}] & 0xFFu), bool(${e}[${U}] & 0xFF00u), bool(${e}[${U}] & 0xFF0000u), bool(${e}[${U}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),M=s<2?"":`
  fn get_${e}ByIndices(indices: ${g.indices}) -> ${f} {
    return ${B(`i2o_${e}(indices)`)};
  }`,G=s<2?"":(()=>{let U=u.map(X=>`d${X}: u32`).join(", "),Y=u.map(X=>`d${X}`).join(", ");return`
  fn get_${e}(${U}) -> ${f} {
    return get_${e}ByIndices(${v(Y)});
  }`})(),J=(...U)=>{if(U.length!==s)throw new Error(`indices length must be ${s}`);let Y=U.map(_).join(",");return s===0?B("0u"):s===1?B(Y[0]):(y.get=!0,y.getByIndices=!0,y.indicesToOffset=!0,`get_${e}(${Y})`)},ee=U=>s<2?B(U):(y.getByIndices=!0,y.indicesToOffset=!0,`get_${e}ByIndices(${U})`),re=s<2?"":`
  fn set_${e}ByIndices(indices: ${g.indices}, value: ${f}) {
    ${j(`i2o_${e}(indices)`,"value")}
  }`,ne=s<2?"":(()=>{let U=u.map(X=>`d${X}: u32`).join(", "),Y=u.map(X=>`d${X}`).join(", ");return`
  fn set_${e}(${U}, value: ${f}) {
    set_${e}ByIndices(${v(Y)}, value);
  }`})();return{impl:()=>{let U=[],Y=!1;return y.offsetToIndices&&(U.push(E),Y=!0),y.indicesToOffset&&(U.push(z),Y=!0),y.broadcastedIndicesToOffset&&(Object.values(Q).forEach(X=>U.push(X)),Y=!0),y.set&&(U.push(ne),Y=!0),y.setByIndices&&(U.push(re),Y=!0),y.get&&(U.push(G),Y=!0),y.getByIndices&&(U.push(M),Y=!0),!n&&Y&&U.unshift(`const ${S} = ${g.indices}(${r.join(",")});`,`const ${x} = ${g.indices}(${O.computeStrides(r).join(",")});`),U.join(`
`)},type:g,offsetToIndices:k,indicesToOffset:A,broadcastedIndicesToOffset:F,indices:v,indicesGet:D,indicesSet:q,set:(...U)=>{if(U.length!==s+1)throw new Error(`indices length must be ${s}`);let Y=U[s];if(typeof Y!="string")throw new Error("value must be string");let X=U.slice(0,s).map(_).join(",");return s===0?j("0u",Y):s===1?j(X[0],Y):(y.set=!0,y.setByIndices=!0,y.indicesToOffset=!0,`set_${e}(${X}, ${Y})`)},setByOffset:j,setByIndices:(U,Y)=>s<2?j(U,Y):(y.setByIndices=!0,y.indicesToOffset=!0,`set_${e}ByIndices(${U}, ${Y});`),get:J,getByOffset:B,getByIndices:ee,usage:i,name:e,strides:x,shape:S,rank:s}},R=(e,t,r,i=1)=>Jt(e,t,r,"input",i),H=(e,t,r,i=1)=>Jt(e,t,r,"output",i),Cp=(e,t,r)=>Jt(e,t,r,"atomicOutput",1),Za=(e,t,r,i=1)=>Jt(e,t,r,"internal",i),Mo=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=Gt){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let a=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,n=a?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,s=a?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*i}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${i})
  fn main(${n}) {
    ${s}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",i=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${i}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:i}of this.uniforms)if(i&&i>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(i/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(i/4)}>`);else{let a=i==null||i===1?r:`vec${i}<${r}>`;e.push(`${t}:${a}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},Ap=(e,t)=>new Mo(e,t)}),Do,qi,Uo,Po,qo,Lo,De,Op,Bp,bt=P(()=>{"use strict";te(),ie(),Se(),ae(),Do=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},qi=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),Uo=(e,t)=>O.sortBasedOnPerm(e,qi(e.length,t)),Po=(e,t,r,i)=>{let a=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let n=0;n<t;++n)a+=`a[${e[n]}]=i[${n}];`;return a+="return a;}"},qo=(e,t)=>{let r=[],i=[];for(let a=0;a<e.length;++a)e[a]!==1&&r.push(e[a]),e[t[a]]!==1&&i.push(t[a]);return{newShape:r,newPerm:i}},Lo=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},De=(e,t)=>{let r=e.dataType,i=e.dims.length,a=qi(i,t),n=Uo(e.dims,a),s=e.dims,u=n,l=i<2||Lo(a,e.dims),p;if(l)return p=y=>{let $=R("input",r,s,4),S=H("output",r,u,4);return`
  ${y.registerUniform("output_size","u32").declareVariables($,S)}
  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let y=O.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(y/64/4)},programUniforms:[{type:12,data:Math.ceil(y/4)}]}},getShaderSource:p};let{newShape:f,newPerm:h}=qo(e.dims,a),g=O.areEqual(h,[2,3,1]),_=O.areEqual(h,[3,1,2]);if(f.length===2||g||_){s=g?[f[0],f[1]*f[2]]:_?[f[0]*f[1],f[2]]:f,u=[s[1],s[0]];let y=16;return p=$=>{let S=R("a",r,s.length),x=H("output",r,u.length);return`
  ${$.registerUniform("output_size","u32").declareVariables(S,x)}
  var<workgroup> tile : array<array<${x.type.value}, ${y+1}>, ${y}>;
  ${$.mainStart([y,y,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${y} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${y}u + local_id.x;
    let input_row = workgroup_id_x * ${y}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${S.getByIndices(`${S.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${y}u + local_id.x;
    let output_row = workgroup_id_y * ${y}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${x.setByIndices(`${x.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let $=O.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(u[1]/y),y:Math.ceil(u[0]/y)},programUniforms:[{type:12,data:$},...Z(s,u)]}},getShaderSource:p}}return p=y=>{let $=R("a",r,s.length),S=H("output",r,u.length);return`
  ${y.registerUniform("output_size","u32").declareVariables($,S)}

  ${Po(a,i,$,S)}

  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${S.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${S.setByOffset("global_idx",$.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let y=O.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:[{type:12,data:y},...Z(s,u)]}},getShaderSource:p}},Op=(e,t)=>{Do(e.inputs,t.perm),e.compute(De(e.inputs[0],t.perm))},Bp=e=>he({perm:e.perm})}),Wo,Vo,Go,Ho,Fo,jo,Ko,Zo,Xo,Qo,We,Rp,Np,Mp,Dp,Up,Pp,qp,Lp,Wp,Vp,m0=P(()=>{"use strict";te(),ie(),ae(),Xa(),bt(),Wo={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},Vo={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},Go={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},Ho={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},Fo=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},jo=(e,t)=>{let r=[],i=e.length;for(let n=0;n<i;n++)t.indexOf(n)===-1&&r.push(e[n]);let a=t.map(n=>e[n]);return[r,a]},Ko=(e,t)=>{let r=e.length+t.length,i=[],a=0;for(let n=0;n<r;n++)t.indexOf(n)===-1?i.push(e[a++]):i.push(1);return i},Zo=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},Xo=(e,t)=>{let r=[];if(!Zo(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},Qo=(e,t,r,i,a,n,s)=>{let u=r[0].dims,l=O.size(n),p=O.size(s),f=R("_A",r[0].dataType,u),h=H("output",a,n),g=64;l===1&&(g=256);let _=`
          var<workgroup> aBestValues : array<f32, ${g}>;
       `,y=$=>`
        ${$.registerUniform("reduceSize","u32").declareVariables(f,h)}
        ${_}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${$.mainStart(g)}

          let outputIndex = global_idx / ${g};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${Go[i]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${g}) {
           let candidate = f32(${f.getByOffset("offset + k")});
           bestValue = ${Wo[i]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${g}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Vo[i]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${h.setByOffset("outputIndex",`${i==="mean"?`${h.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${h.type.storage}(${Ho[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${g}`,inputDependencies:["type"]},getShaderSource:y,getRunData:()=>({outputs:[{dims:n,dataType:a}],dispatchGroup:{x:l},programUniforms:[{type:12,data:p}]})}},We=(e,t,r,i)=>{let a=e.inputs.length===1?r:Ta(e.inputs,r),n=a.axes;n.length===0&&!a.noopWithEmptyAxes&&(n=e.inputs[0].dims.map((_,y)=>y));let s=O.normalizeAxes(n,e.inputs[0].dims.length),u=s,l=e.inputs[0],p=Xo(u,e.inputs[0].dims.length);p.length>0&&(l=e.compute(De(e.inputs[0],p),{inputs:[0],outputs:[-1]})[0],u=Fo(u.length,l.dims.length));let[f,h]=jo(l.dims,u),g=f;a.keepDims&&(g=Ko(f,s)),e.compute(Qo(t,a.cacheKey,[l],i,e.inputs[0].dataType,g,h),{inputs:[l]})},Rp=(e,t)=>{We(e,"ReduceMeanShared",t,"mean")},Np=(e,t)=>{We(e,"ReduceL1Shared",t,"l1")},Mp=(e,t)=>{We(e,"ReduceL2Shared",t,"l2")},Dp=(e,t)=>{We(e,"ReduceLogSumExpShared",t,"logSumExp")},Up=(e,t)=>{We(e,"ReduceMaxShared",t,"max")},Pp=(e,t)=>{We(e,"ReduceMinShared",t,"min")},qp=(e,t)=>{We(e,"ReduceProdShared",t,"prod")},Lp=(e,t)=>{We(e,"ReduceSumShared",t,"sum")},Wp=(e,t)=>{We(e,"ReduceSumSquareShared",t,"sumSquare")},Vp=(e,t)=>{We(e,"ReduceLogSumShared",t,"logSum")}}),Ve,Yo,Fr,Ta,Ge,Jo,eu,tu,ru,iu,au,nu,su,ou,uu,He,Gp,Hp,Fp,jp,Kp,Zp,Xp,Qp,Yp,Jp,Xa=P(()=>{"use strict";te(),ie(),Se(),ae(),m0(),Ve=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Yo=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Fr=(e,t,r,i,a,n,s=!1,u=!1)=>{let l=[],p=r[0].dims,f=p.length,h=O.normalizeAxes(a,f),g=!u&&h.length===0;p.forEach(($,S)=>{g||h.indexOf(S)>=0?s&&l.push(1):l.push($)});let _=l.length,y=O.size(l);return{name:e,shaderCache:t,getShaderSource:$=>{let S=[],x=R("_A",r[0].dataType,f),b=H("output",n,_),E=i(x,b,h),k=E[2];for(let I=0,z=0;I<f;I++)g||h.indexOf(I)>=0?(s&&z++,k=`for(var j${I}: u32 = 0; j${I} < ${p[I]}; j${I}++) {
                  ${E[2].includes("last_index")?`let last_index = j${I};`:""}
                  ${x.indicesSet("input_indices",I,`j${I}`)}
                  ${k}
                }`):(S.push(`${x.indicesSet("input_indices",I,b.indicesGet("output_indices",z))};`),z++);return`

        ${$.registerUniform("output_size","u32").declareVariables(x,b)}

        ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${x.type.indices};
          let output_indices = ${b.offsetToIndices("global_idx")};

          ${S.join(`
`)}
          ${E[0]}       // init ops for reduce max/min
          ${E[1]}
          ${k}
          ${E[3]}
          ${E.length===4?b.setByOffset("global_idx","value"):E.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:l,dataType:n}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:[{type:12,data:y},...Z(p,l)]})}},Ta=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),he({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},Ge=(e,t,r,i)=>{let a=e.inputs,n=a.length===1?r:Ta(a,r);e.compute(Fr(t,{hint:n.cacheKey,inputDependencies:["rank"]},[a[0]],n.noopWithEmptyAxes&&n.axes.length===0?Yo:i,n.axes,a[0].dataType,n.keepDims,n.noopWithEmptyAxes),{inputs:[0]})},Jo=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},eu=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},tu=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},ru=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},iu=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceMax",t,(r,i,a)=>{let n=[];for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&n.push(r.indicesSet("input_indices",s,0));return[`${n.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},au=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceMean",t,(r,i,a)=>{let n=1;for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&(n*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${n});`]})},nu=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceMin",t,(r,i,a)=>{let n=[];for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&n.push(`input_indices[${s}] = 0;`);return[`${n.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},su=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},ou=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},uu=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},He=(e,t,r)=>{if(t.length===0)return r;let i=1,a=1;for(let n=0;n<t.length;n++)t.indexOf(n)===-1?i*=e[n]:a*=e[n];return a<32&&i>1024},Gp=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?au(e,t):Rp(e,t)},Hp=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?eu(e,t):Np(e,t)},Fp=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?tu(e,t):Mp(e,t)},jp=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?ru(e,t):Dp(e,t)},Kp=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?iu(e,t):Up(e,t)},Zp=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?nu(e,t):Pp(e,t)},Xp=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?su(e,t):qp(e,t)},Qp=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?ou(e,t):Lp(e,t)},Yp=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?uu(e,t):Wp(e,t)},Jp=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Jo(e,t):Vp(e,t)}}),Li,ec,tc,Ia,g0=P(()=>{"use strict";te(),Se(),Xa(),Li=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},ec=(e,t)=>{Li(e.inputs);let r=(i,a,n)=>{let s=[];for(let u=0;u<i.rank;u++)(n.indexOf(u)>=0||n.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(Fr("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},tc=(e,t)=>{Li(e.inputs);let r=(i,a,n)=>{let s=[];for(let u=0;u<i.rank;u++)(n.indexOf(u)>=0||n.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(Fr("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Ia=e=>he(e)}),lu,Or,du,pu,cu,cr,hu,rc,Qa=P(()=>{"use strict";te(),ie(),Ka(),ae(),lu=(e,t)=>{let r=e[0],i=e[1],a=e[2],n=e[3],s=e[4],u=e[5];if(s&&u)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let l=r.dims[0],p=r.dims[1],f=r.dims[2];if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==f)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(a.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let h=a.dims[0]/3,g=h,_=g;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let E of t.qkvHiddenSizes)if(E%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");h=t.qkvHiddenSizes[0],g=t.qkvHiddenSizes[1],_=t.qkvHiddenSizes[2]}let y=p;if(h!==g)throw new Error("qkv_hidden_sizes first element should be same as the second");if(a.dims[0]!==h+g+_)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let $=0;if(s){if(g!==_)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==l)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==g/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||($=s.dims[3])}let S=y+$,x=-1,b=0;if(n)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(u){if(u.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==l||u.dims[1]!==t.numHeads||u.dims[2]!==p||u.dims[3]!==S)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:l,sequenceLength:p,pastSequenceLength:$,kvSequenceLength:y,totalSequenceLength:S,maxSequenceLength:x,inputHiddenSize:f,hiddenSize:h,vHiddenSize:_,headSize:Math.floor(h/t.numHeads),vHeadSize:Math.floor(_/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Or=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e?.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,du=(e,t,r,i,a,n,s,u)=>{let l=xe(s?1:n),p=64,f=n/l;f<p&&(p=32);let h=Math.ceil(n/l/p),g=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:a},{type:12,data:f},{type:12,data:h}],_=Ee(e.dataType,l),y=Ie(1,l),$=["type"];s&&$.push("type"),u&&$.push("type");let S=x=>{let b=H("x",e.dataType,e.dims,l),E=[b],k=s?R("seq_lens",s.dataType,s.dims):void 0;k&&E.push(k);let I=u?R("total_sequence_length_input",u.dataType,u.dims):void 0;I&&E.push(I);let z=Ie(e.dataType),A=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${p}>;
  var<workgroup> thread_sum: array<f32, ${p}>;
  ${x.registerUniforms(A).declareVariables(...E)}
  ${x.mainStart([p,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Or(k,I,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${p}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${y}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${y}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(l){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${p}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${y}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${y}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(l){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${p}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${b.type.value}(${z}(1.0) / ${z}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${y}(x[offset + i]);
        x[offset + i] = ${b.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${b.type.value}(${z}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${p};${_};${l}`,inputDependencies:$},getShaderSource:S,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:a,z:t*r},programUniforms:g})}},pu=(e,t,r,i,a,n,s,u,l)=>{let p=s+n.kvSequenceLength,f=[n.batchSize,n.numHeads,n.sequenceLength,p],h=e>1&&i,g=n.kvNumHeads?n.kvNumHeads:n.numHeads,_=h?[n.batchSize,g,p,n.headSize]:void 0,y=n.nReps?n.nReps:1,$=n.scale===0?1/Math.sqrt(n.headSize):n.scale,S=xe(n.headSize),x=n.headSize/S,b=12,E={x:Math.ceil(p/b),y:Math.ceil(n.sequenceLength/b),z:n.batchSize*n.numHeads},k=[{type:12,data:n.sequenceLength},{type:12,data:x},{type:12,data:p},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:1,data:$},{type:12,data:s},{type:12,data:n.kvSequenceLength},{type:12,data:y}],I=h&&i&&O.size(i.dims)>0,z=["type","type"];I&&z.push("type"),a&&z.push("type"),u&&z.push("type"),l&&z.push("type");let A=[{dims:f,dataType:t.dataType,gpuDataType:0}];h&&A.push({dims:_,dataType:t.dataType,gpuDataType:0});let v=D=>{let q=R("q",t.dataType,t.dims,S),Q=R("key",r.dataType,r.dims,S),F=[q,Q];if(I){let re=R("past_key",i.dataType,i.dims,S);F.push(re)}a&&F.push(R("attention_bias",a.dataType,a.dims));let j=u?R("seq_lens",u.dataType,u.dims):void 0;j&&F.push(j);let B=l?R("total_sequence_length_input",l.dataType,l.dims):void 0;B&&F.push(B);let M=H("output",t.dataType,f),G=[M];h&&G.push(H("present_key",t.dataType,_,S));let J=Ie(1,S),ee=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${b}u;

  var<workgroup> tileQ: array<${q.type.storage}, ${b*b}>;
  var<workgroup> tileK: array<${q.type.storage}, ${b*b}>;
  ${D.registerUniforms(ee).declareVariables(...F,...G)}
  ${D.mainStart([b,b,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${y===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${y===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Or(j,B,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${I&&h?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${h?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${J}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${I&&h?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${h?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${J}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(S){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${S}`)}})()};
        output[outputIdx] = ${M.type.value} (sum * uniforms.alpha) + ${a?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${S};${a!==void 0};${i!==void 0};${e}`,inputDependencies:z},getRunData:()=>({outputs:A,dispatchGroup:E,programUniforms:k}),getShaderSource:v}},cu=(e,t,r,i,a,n,s=void 0,u=void 0)=>{let l=n+a.kvSequenceLength,p=a.nReps?a.nReps:1,f=a.vHiddenSize*p,h=e>1&&i,g=a.kvNumHeads?a.kvNumHeads:a.numHeads,_=h?[a.batchSize,g,l,a.headSize]:void 0,y=[a.batchSize,a.sequenceLength,f],$=12,S={x:Math.ceil(a.vHeadSize/$),y:Math.ceil(a.sequenceLength/$),z:a.batchSize*a.numHeads},x=[{type:12,data:a.sequenceLength},{type:12,data:l},{type:12,data:a.vHeadSize},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:12,data:f},{type:12,data:n},{type:12,data:a.kvSequenceLength},{type:12,data:p}],b=h&&i&&O.size(i.dims)>0,E=["type","type"];b&&E.push("type"),s&&E.push("type"),u&&E.push("type");let k=[{dims:y,dataType:t.dataType,gpuDataType:0}];h&&k.push({dims:_,dataType:t.dataType,gpuDataType:0});let I=z=>{let A=R("probs",t.dataType,t.dims),v=R("v",r.dataType,r.dims),D=[A,v];b&&D.push(R("past_value",i.dataType,i.dims));let q=s?R("seq_lens",s.dataType,s.dims):void 0;s&&D.push(q);let Q=u?R("total_sequence_length_input",u.dataType,u.dims):void 0;u&&D.push(Q);let F=[H("output",t.dataType,y)];h&&F.push(H("present_value",t.dataType,_));let j=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${$}u;
  var<workgroup> tileQ: array<${A.type.value}, ${$*$}>;
  var<workgroup> tileV: array<${A.type.value}, ${$*$}>;
  ${z.registerUniforms(j).declareVariables(...D,...F)}
  ${z.mainStart([$,$,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${p===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${p===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Or(q,Q,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${b&&h?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${h?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${A.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${b&&h?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${h?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:E},getRunData:()=>({outputs:k,dispatchGroup:S,programUniforms:x}),getShaderSource:I}},cr=(e,t,r,i,a,n,s,u,l,p,f=void 0,h=void 0)=>{let g=Math.min(e.outputCount,1+(s?1:0)+(u?1:0)),_=g>1?s:void 0,y=g>1?u:void 0,$=g>1?p.pastSequenceLength:0,S=$+p.kvSequenceLength,x=l&&O.size(l.dims)>0?l:void 0,b=[t,r];_&&O.size(_.dims)>0&&b.push(_),x&&b.push(x),f&&b.push(f),h&&b.push(h);let E=e.compute(pu(g,t,r,_,x,p,$,f,h),{inputs:b,outputs:g>1?[-1,1]:[-1]})[0];e.compute(du(E,p.batchSize,p.numHeads,$,p.sequenceLength,S,f,h),{inputs:f&&h?[E,f,h]:[E],outputs:[]});let k=[E,i];y&&O.size(y.dims)>0&&k.push(y),f&&k.push(f),h&&k.push(h),e.compute(cu(g,E,i,y,p,$,f,h),{inputs:k,outputs:g>1?[0,2]:[0]})},hu=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,a=t.inputHiddenSize,n=t.headSize,s=12,u={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},l=[e.inputs[0],e.inputs[1],e.inputs[2]],p=[{type:12,data:i},{type:12,data:a},{type:12,data:n},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],f=h=>{let g=H("output_q",l[0].dataType,r),_=H("output_k",l[0].dataType,r),y=H("output_v",l[0].dataType,r),$=R("input",l[0].dataType,l[0].dims),S=R("weight",l[1].dataType,l[1].dims),x=R("bias",l[2].dataType,l[2].dims),b=$.type.storage,E=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${b}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${b}, ${s*s}>;
  var<workgroup> tileWeightK: array<${b}, ${s*s}>;
  var<workgroup> tileWeightV: array<${b}, ${s*s}>;
  ${h.registerUniforms(E).declareVariables($,S,x,g,_,y)}
  ${h.mainStart([s,s,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${b}(0);
    var valueK = ${b}(0);
    var valueV = ${b}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:u,programUniforms:p}),getShaderSource:f},{inputs:l,outputs:[-1,-1,-1]})},rc=(e,t)=>{let r=lu(e.inputs,t),[i,a,n]=hu(e,r);return cr(e,i,a,n,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),fu,mu,gu,ic,y0=P(()=>{"use strict";qe(),te(),ie(),Se(),ae(),fu=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,a,n)=>{let s=a.length;if(s!==i.length)throw new Error(`${n}: num dimensions != ${s}`);a.forEach((u,l)=>{if(u!==i[l])throw new Error(`${n}: dim[${l}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},mu=(e,t)=>{let{epsilon:r,spatial:i,format:a}=t,n=e[0].dims,s=i?xe(n[n.length-1]):1,u=a==="NHWC"&&n.length>1?s:1,l=O.size(n)/s,p=i,f=p?n.length:n,h=R("x",e[0].dataType,e[0].dims,s),g=R("scale",e[1].dataType,e[1].dims,u),_=R("bias",e[2].dataType,e[2].dims,u),y=R("inputMean",e[3].dataType,e[3].dims,u),$=R("inputVar",e[4].dataType,e[4].dims,u),S=H("y",e[0].dataType,f,s),x=()=>{let E="";if(i)E=`let cOffset = ${n.length===1?"0u":a==="NHWC"?`outputIndices[${n.length-1}] / ${s}`:"outputIndices[1]"};`;else if(a==="NCHW")E=`
            ${S.indicesSet("outputIndices","0","0")}
            let cOffset = ${S.indicesToOffset("outputIndices")};`;else{E=`var cIndices = ${g.type.indices}(0);
                       cIndices[0] = outputIndices[${n.length-1}];`;for(let k=1;k<g.rank;k++)E+=`cIndices[${k}] = outputIndices[${k}];`;E+=`let cOffset = ${g.indicesToOffset("cIndices")};`}return E},b=E=>`
  const epsilon = ${r};
  ${E.registerUniform("outputSize","u32").declareVariables(h,g,_,y,$,S)}
  ${E.mainStart()}
  ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${S.offsetToIndices(`global_idx * ${s}`)};
    ${x()}
    let scale = ${g.getByOffset("cOffset")};
    let bias = ${_.getByOffset("cOffset")};
    let inputMean = ${y.getByOffset("cOffset")};
    let inputVar = ${$.getByOffset("cOffset")};
    let x = ${h.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${S.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${s}`,inputDependencies:p?["rank","type","type","type","type"]:void 0},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:p?[{type:12,data:l},...Z(n)]:[{type:12,data:l}]})}},gu=e=>he(e),ic=(e,t)=>{let{inputs:r,outputCount:i}=e,a=gu({...t,outputCount:i});if($e.webgpu.validateInputContent&&fu(r,a),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(mu(r,a))}}),yu,_u,ac,_0=P(()=>{"use strict";ie(),ae(),yu=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},_u=e=>{let t=e[0].dims,r=e[0].dims[2],i=O.size(t)/4,a=e[0].dataType,n=R("input",a,t,4),s=R("bias",a,[r],4),u=R("residual",a,t,4),l=H("output",a,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:p=>`
  const channels = ${r}u / 4;
  ${p.declareVariables(n,s,u,l)}

  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${n.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${l.setByOffset("global_idx","value")}
  }`}},ac=e=>{yu(e.inputs),e.compute(_u(e.inputs))}}),bu,ce,nc,sc,oc,uc,lc,dc,pc,cc,hc,wu,fc,mc,gc,yc,ur,_c,Lr,bc,wc,$c,vc,xc,Sc,kc,Tc,Ic,Ec,zc,Cc,Ac,Oc,Bc,Rc,Nc,Wi,Mc,Ea,za,Dc,Uc,Pc,$u,vu,qc,Ya=P(()=>{"use strict";te(),ie(),Se(),ae(),bu=(e,t,r,i,a,n,s)=>{let u=Math.ceil(t/4),l="";typeof a=="string"?l=`${a}(a)`:l=a("a");let p=R("inputData",r,[u],4),f=H("outputData",i,[u],4),h=[{name:"vec_size",type:"u32"}];return s&&h.push(...s),`
      ${e.registerUniforms(h).declareVariables(p,f)}

  ${n??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${p.getByOffset("global_idx")};
    ${f.setByOffset("global_idx",l)}
  }`},ce=(e,t,r,i,a,n=e.dataType,s,u)=>{let l=[{type:12,data:Math.ceil(O.size(e.dims)/4)}];return s&&l.push(...s),{name:t,shaderCache:{hint:a,inputDependencies:["type"]},getShaderSource:p=>bu(p,O.size(e.dims),e.dataType,n,r,i,u),getRunData:p=>({outputs:[{dims:e.dims,dataType:n}],dispatchGroup:{x:Math.ceil(O.size(p[0].dims)/64/4)},programUniforms:l})}},nc=e=>{e.compute(ce(e.inputs[0],"Abs","abs"))},sc=e=>{e.compute(ce(e.inputs[0],"Acos","acos"))},oc=e=>{e.compute(ce(e.inputs[0],"Acosh","acosh"))},uc=e=>{e.compute(ce(e.inputs[0],"Asin","asin"))},lc=e=>{e.compute(ce(e.inputs[0],"Asinh","asinh"))},dc=e=>{e.compute(ce(e.inputs[0],"Atan","atan"))},pc=e=>{e.compute(ce(e.inputs[0],"Atanh","atanh"))},cc=e=>he(e),hc=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(ce(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},wu=e=>{let t,r,i=e.length>=2&&e[1].data!==0,a=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=a?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=a?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return he({min:t,max:r})},fc=(e,t)=>{let r=t||wu(e.inputs),i=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Clip",a=>`clamp(${a}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},mc=e=>{e.compute(ce(e.inputs[0],"Ceil","ceil"))},gc=e=>{e.compute(ce(e.inputs[0],"Cos","cos"))},yc=e=>{e.compute(ce(e.inputs[0],"Cosh","cosh"))},ur=e=>he(e),_c=(e,t)=>{let r=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Lr=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,bc=e=>{let t=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,Lr(t)))},wc=e=>{e.compute(ce(e.inputs[0],"Exp","exp"))},$c=e=>{e.compute(ce(e.inputs[0],"Floor","floor"))},vc=e=>{let t=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,Lr(t)))},xc=(e,t)=>{let r=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},Sc=e=>{e.compute(ce(e.inputs[0],"Not",t=>`!${t}`))},kc=e=>{e.compute(ce(e.inputs[0],"Neg",t=>`-${t}`))},Tc=e=>{e.compute(ce(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},Ic=e=>{let t=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},Ec=e=>{e.compute(ce(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},zc=e=>he(e),Cc=(e,t)=>{let r=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},Ac=e=>{let t=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"HardSwish",r=>`${r} * max(vec4<${t}>(0.0), min(vec4<${t}>(1.0), vec4<${t}>(${t}(1.0 / 6.0)) * ${r} + vec4<${t}>(0.5)))`))},Oc=e=>{e.compute(ce(e.inputs[0],"Sin","sin"))},Bc=e=>{e.compute(ce(e.inputs[0],"Sinh","sinh"))},Rc=e=>{e.compute(ce(e.inputs[0],"Sqrt","sqrt"))},Nc=e=>{e.compute(ce(e.inputs[0],"Tan","tan"))},Wi=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,Mc=e=>{e.compute(ce(e.inputs[0],"Tanh",Wi))},Ea=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${Wi("v")};
}
`,za=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,Dc=e=>{let t=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"FastGelu",za,Ea(t),void 0,e.inputs[0].dataType))},Uc=(e,t)=>{let r=Ie(e.inputs[0].dataType);return e.compute(ce(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},Pc=e=>{e.compute(ce(e.inputs[0],"Log","log"))},$u=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,vu=e=>`quick_gelu_impl(${e})`,qc=(e,t)=>{let r=Ie(e.inputs[0].dataType);e.compute(ce(e.inputs[0],"QuickGelu",vu,$u(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),xu,Su,Lc,b0=P(()=>{"use strict";ie(),ae(),Ya(),xu=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Su=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=R("input",e[0].dataType,e[0].dims,4),i=R("bias",e[0].dataType,[e[0].dims[2]],4),a=H("output",e[0].dataType,t,4),n=O.size(t)/4,s=Ee(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)}}),getShaderSource:u=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${u.declareVariables(r,i,a)}

  ${Lr(s)}

  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes(n)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${a.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},Lc=e=>{xu(e.inputs),e.compute(Su(e.inputs))}}),ku,Tu,Fe,Wc,Vc,Gc,Hc,Fc,jc,Kc,Zc,Xc,Qc,w0=P(()=>{"use strict";te(),ie(),ae(),ku=(e,t,r,i,a,n,s,u,l,p,f,h)=>{let g,_;typeof u=="string"?g=_=(b,E)=>`${u}((${b}),(${E}))`:typeof u=="function"?g=_=u:(g=u.scalar,_=u.vector);let y=H("outputData",f,i.length,4),$=R("aData",l,t.length,4),S=R("bData",p,r.length,4),x;if(a)if(n){let b=O.size(t)===1,E=O.size(r)===1,k=t.length>0&&t[t.length-1]%4===0,I=r.length>0&&r[r.length-1]%4===0;b||E?x=y.setByOffset("global_idx",_(b?`${$.type.value}(${$.getByOffset("0")}.x)`:$.getByOffset("global_idx"),E?`${S.type.value}(${S.getByOffset("0")}.x)`:S.getByOffset("global_idx"))):x=`
            let outputIndices = ${y.offsetToIndices("global_idx * 4u")};
            let offsetA = ${$.broadcastedIndicesToOffset("outputIndices",y)};
            let offsetB = ${S.broadcastedIndicesToOffset("outputIndices",y)};
            ${y.setByOffset("global_idx",_(s||k?$.getByOffset("offsetA / 4u"):`${$.type.value}(${$.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||I?S.getByOffset("offsetB / 4u"):`${S.type.value}(${S.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else x=y.setByOffset("global_idx",_($.getByOffset("global_idx"),S.getByOffset("global_idx")));else{if(!n)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let b=(E,k,I="")=>{let z=`aData[indexA${k}][componentA${k}]`,A=`bData[indexB${k}][componentB${k}]`;return`
            let outputIndices${k} = ${y.offsetToIndices(`global_idx * 4u + ${k}u`)};
            let offsetA${k} = ${$.broadcastedIndicesToOffset(`outputIndices${k}`,y)};
            let offsetB${k} = ${S.broadcastedIndicesToOffset(`outputIndices${k}`,y)};
            let indexA${k} = offsetA${k} / 4u;
            let indexB${k} = offsetB${k} / 4u;
            let componentA${k} = offsetA${k} % 4u;
            let componentB${k} = offsetB${k} % 4u;
            ${E}[${k}] = ${I}(${g(z,A)});
          `};f===9?x=`
            var data = vec4<u32>(0);
            ${b("data",0,"u32")}
            ${b("data",1,"u32")}
            ${b("data",2,"u32")}
            ${b("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:x=`
            ${b("outputData[global_idx]",0)}
            ${b("outputData[global_idx]",1)}
            ${b("outputData[global_idx]",2)}
            ${b("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables($,S,y)}

        ${h??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${x}
      }`},Tu=(e,t,r,i,a,n,s=r.dataType)=>{let u=r.dims.map(Number),l=i.dims.map(Number),p=!O.areEqual(u,l),f=u,h=O.size(u),g=!1,_=!1,y=[p];if(p){let $=Vt.calcShape(u,l,!1);if(!$)throw new Error("Can't perform binary op on the given tensors");f=$.slice(),h=O.size(f);let S=O.size(u)===1,x=O.size(l)===1,b=u.length>0&&u[u.length-1]%4===0,E=l.length>0&&l[l.length-1]%4===0;y.push(S),y.push(x),y.push(b),y.push(E);let k=1;for(let I=1;I<f.length;I++){let z=u[u.length-I],A=l[l.length-I];if(z===A)k*=z;else break}k%4===0?(_=!0,g=!0):(S||x||b||E)&&(g=!0)}else g=!0;return y.push(g),{name:e,shaderCache:{hint:t+y.map($=>$.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:$=>ku($,u,l,f,g,p,_,a,r.dataType,i.dataType,s,n),getRunData:()=>({outputs:[{dims:f,dataType:s}],dispatchGroup:{x:Math.ceil(h/64/4)},programUniforms:[{type:12,data:Math.ceil(O.size(f)/4)},...Z(u,l,f)]})}},Fe=(e,t,r,i,a,n)=>{e.compute(Tu(t,a??"",e.inputs[0],e.inputs[1],r,i,n))},Wc=e=>{Fe(e,"Add",(t,r)=>`${t}+${r}`)},Vc=e=>{Fe(e,"Div",(t,r)=>`${t}/${r}`)},Gc=e=>{Fe(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},Hc=e=>{Fe(e,"Mul",(t,r)=>`${t}*${r}`)},Fc=e=>{let t=R("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;Fe(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},jc=e=>{Fe(e,"Sub",(t,r)=>`${t}-${r}`)},Kc=e=>{Fe(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},Zc=e=>{Fe(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},Xc=e=>{Fe(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},Qc=e=>{Fe(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),Iu,Eu,zu,Cu,Yc,Jc,$0=P(()=>{"use strict";te(),ie(),Se(),ae(),Iu=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],a=i.dataType,n=i.dims.length;e.forEach((s,u)=>{if(u!==r){if(s.dataType!==a)throw new Error("input tensors should be one type");if(s.dims.length!==n)throw new Error("input tensors should have the same shape");s.dims.forEach((l,p)=>{if(p!==t&&l!==i.dims[p])throw new Error("non concat dimensions must match")})}})},Eu=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,zu=(e,t)=>{let r=e.length,i=[];for(let a=0;a<r;++a){let n=t.setByOffset("global_idx",e[a].getByIndices("indices"));r===1?i.push(n):a===0?i.push(`if (inputIndex == ${a}u) { ${n} }`):a===r-1?i.push(`else { ${n} }`):i.push(`else if (inputIndex == ${a}) { ${n} }`)}return i.join(`
`)},Cu=(e,t,r,i)=>{let a=O.size(r),n=new Array(e.length),s=new Array(e.length),u=0,l=[],p=[],f=[{type:12,data:a}];for(let $=0;$<e.length;++$)u+=e[$].dims[t],n[$]=u,p.push(e[$].dims.length),s[$]=R(`input${$}`,i,p[$]),l.push("rank"),f.push({type:12,data:n[$]});for(let $=0;$<e.length;++$)f.push(...Z(e[$].dims));f.push(...Z(r));let h=H("output",i,r.length),g=h.indicesGet("indices",t),_=Array.from(Array(n.length).keys()).map($=>`uniforms.sizeInConcatAxis${$}`).join(","),y=$=>`

  ${(()=>{$.registerUniform("outputSize","u32");for(let S=0;S<e.length;S++)$.registerUniform(`sizeInConcatAxis${S}`,"u32");return $.declareVariables(...s,h)})()}

  ${Eu(n.length,_)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${h.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${g});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${n.length}u>(${_});
      ${g} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${zu(s,h)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:f}),getShaderSource:y}},Yc=(e,t)=>{let r=e.inputs,i=r[0].dims,a=O.normalizeAxis(t.axis,i.length);Iu(r,a);let n=i.slice();n[a]=r.reduce((u,l)=>u+(l.dims.length>a?l.dims[a]:0),0);let s=r.filter(u=>O.size(u.dims)>0);e.compute(Cu(s,a,n,r[0].dataType),{inputs:s})},Jc=e=>he({axis:e.axis})}),Bt,Rt,Nt,Ja,Dt=P(()=>{"use strict";te(),ie(),Bt=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Rt=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Nt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Ja=e=>{let t=e?.activation||"";if(t==="HardSigmoid"){let[r,i]=e?.activation_params||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=e?.activation_params||[Sp,kp];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=e?.activation_params||[.01];return{activation:t,alpha:r}}return{activation:t}}}),Ce,eh,en=P(()=>{"use strict";Ce=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},eh=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),th,v0=P(()=>{"use strict";th=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),dr,tn,rn=P(()=>{"use strict";te(),ie(),ae(),Dt(),dr=(e,t,r,i,a)=>{let n=i-r;return`
      ${Array.from({length:r}).map((s,u)=>`
      if (${K(t.shape,u,t.rank)} != 1) {
        ${t.indicesSet(e,u,K(a,u+n,i))}
      } else {
        ${t.indicesSet(e,u,0)}
      }`).join("")}
`},tn=(e,t,r,i,a=!1,n)=>{let s=e[0].dims,u=e[1].dims,l=s[s.length-2],p=u[u.length-1],f=s[s.length-1],h=xe(p),g=xe(f),_=xe(l),y=O.size(r)/h/_,$=e.length>2,S=i?i.slice(0,-2):r.slice(0,-2),x=[O.size(S),l,p],b=[{type:12,data:y},{type:12,data:l},{type:12,data:p},{type:12,data:f}];Rt(t,b),b.push(...Z(S,s,u)),$&&b.push(...Z(e[2].dims)),b.push(...Z(x));let E=k=>{let I=Za("batch_dims",e[0].dataType,S.length),z=R("a",e[0].dataType,s.length,g),A=R("b",e[1].dataType,u.length,h),v=H("output",e[0].dataType,x.length,h),D=Ee(v.type.tensor),q=Bt(t,v.type.value,D),Q=[z,A],F="";if($){let M=a?h:1;Q.push(R("bias",e[2].dataType,e[2].dims.length,M)),F=`${a?`value += bias[col / ${M}];`:`value += ${v.type.value}(bias[row + i]);`}`}let j=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Nt(t,j);let B=()=>{let M=`var a_data: ${z.type.value};`;for(let G=0;G<g;G++)M+=`
              let b_data${G} = b[(b_offset + (k + ${G}) * uniforms.N + col) / ${h}];`;for(let G=0;G<_;G++){M+=`a_data = a[(a_offset + (row + ${G}) * uniforms.K + k) / ${g}];`;for(let J=0;J<g;J++)M+=`
            values[${G}] = fma(${A.type.value}(a_data${g===1?"":`[${J}]`}), b_data${J}, values[${G}]);
`}return M};return`
  ${k.registerUniforms(j).registerInternalVariables(I).declareVariables(...Q,v)}
  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${h})) * ${h};
    var index1 = global_idx / (uniforms.N / ${h});
    let stride1 = uniforms.M / ${_};
    let row = (index1 % stride1) * ${_};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${I.offsetToIndices("batch")};`}

    var a_indices: ${z.type.indices};
    ${dr("a_indices",z,z.rank-2,I.rank,"batch_indices")}
    ${z.indicesSet("a_indices",z.rank-2,0)}
    ${z.indicesSet("a_indices",z.rank-1,0)}
    let a_offset = ${z.indicesToOffset("a_indices")};

    var b_indices: ${A.type.indices};
    ${dr("b_indices",A,A.rank-2,I.rank,"batch_indices")}
    ${A.indicesSet("b_indices",A.rank-2,0)}
    ${A.indicesSet("b_indices",A.rank-1,0)}
    let b_offset = ${A.indicesToOffset("b_indices")};
    var values: array<${v.type.value}, ${_}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${g}) {
      ${B()}
    }
    for (var i = 0u; i < ${_}u; i++) {
      var value = values[i];
      ${F}
      ${q}
      let cur_indices = ${v.type.indices}(batch, row + i, col);
      let offset = ${v.indicesToOffset("cur_indices")};
      ${v.setByOffset(`offset / ${h}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${h};${g};${_};${a}`,inputDependencies:$?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:b}),getShaderSource:E}}}),Au,Ou,Ca,Vi,Bu,Aa,Ru,jr,an=P(()=>{"use strict";te(),ie(),ae(),Dt(),rn(),en(),Au=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,Ou=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,Ca=(e,t,r="f32",i,a=!1,n=32,s=!1,u=32)=>{let l=t[1]*e[1],p=t[0]*e[0],f=a?l:n,h=a?n:l,g=f/t[0],_=n/t[1];if(!((a&&g===4&&e[1]===4||!a&&(g===3||g===4))&&f%t[0]===0&&n%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${a} is true, innerElementSize ${g} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${g} must be 3 or 4.
  tileAWidth ${f} must be divisible by workgroupSize[0]${t[0]}. tileInner ${n} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${g}<${r}>, ${f/g}>, ${h}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${p/e[0]}>, ${n}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${g};
const tileInner = ${n};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${s?"0":"i32(globalId.z)"};
  ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${l};

  let num_tiles = ${s?`${Math.ceil(u/n)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${_};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${Au(a,i)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${i?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${g===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${Ou(a,g)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Vi=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,Bu=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",Aa=(e,t,r="f32",i,a=!1,n=32,s=!1,u=32,l=!1)=>{let p=e[1]*t[1],f=e[0]*t[0],h=a?p:n,g=a?n:p;if(!(g%t[1]===0&&h%t[0]===0&&n%t[1]===0))throw new Error(`tileAHight ${g} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${h} must be divisible by workgroupSize[0]${t[0]}, tileInner ${n} must be divisible by workgroupSize[1]${t[1]}`);let _=g/t[1],y=h/t[0],$=n/t[1],S=l?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${p};
    let globalColStart = i32(workgroupId.x) * ${f};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${g}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${h}; inputCol = inputCol + ${t[0]}) {
          ${Vi(a,i)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${n}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${f}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${i?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${a?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${p};

let tileRowA = i32(localId.y) * ${_};
let tileColA = i32(localId.x) * ${y};
let tileRowB = i32(localId.y) * ${$};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${y}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Vi(a,i)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${$}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${i?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Bu(a)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${h}>, ${g}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${f}>, ${n}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${n};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s?"0":"i32(globalId.z)"};
    ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${s?`${Math.ceil(u/n)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${S}
  }
`},Ru=(e,t,r,i,a=!1)=>{let[n,s,u,l]=i,p=Ee(i[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${n.type.indices}) -> ${Ce(e,p)} {
      var value = ${Ce(e,p)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${dr("aIndices",s,s.rank-2,n.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${n.type.indices}) -> ${Ce(e,p)} {
      var value = ${Ce(e,p)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${dr("bIndices",u,u.rank-2,n.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Ce(e,p)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${a?"bias[colIn]":`${Ce(e,p)}(bias[row])`};`:""}
        ${r}
        ${l.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},jr=(e,t,r,i,a=!1,n)=>{let s=e[0].dims,u=e[1].dims,l=s.slice(0,-2),p=u.slice(0,-2),f=i?i.slice(0,-2):r.slice(0,-2),h=O.size(f),g=s[s.length-2],_=s[s.length-1],y=u[u.length-1],$=_%4===0&&y%4===0,S=g<=8?[4,1,1]:[4,4,1],x=[8,8,1],b=[Math.ceil(y/x[0]/S[0]),Math.ceil(g/x[1]/S[1]),Math.ceil(h/x[2]/S[2])],E=$?4:1,k=[...l,g,_/E],I=k.length,z=[...p,_,y/E],A=z.length,v=[h,g,y/E],D=[{type:6,data:g},{type:6,data:y},{type:6,data:_}];Rt(t,D),D.push(...Z(f,k,z));let q=["rank","rank"],Q=e.length>2;Q&&(D.push(...Z(e[2].dims)),q.push("rank")),D.push(...Z(v));let F=j=>{let B=f.length,M=Za("batchDims",e[0].dataType,B,1),G=Ee(e[0].dataType),J=R("a",e[0].dataType,I,E),ee=R("b",e[1].dataType,A,E),re=H("result",e[0].dataType,v.length,E),ne=[J,ee];if(Q){let Te=a?E:1;ne.push(R("bias",e[2].dataType,e[2].dims.length,Te))}let U=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Nt(t,U);let Y=Ee(re.type.tensor),X=Bt(t,re.type.value,Y),V=Ru(E,Q,X,[M,J,ee,re],a);return`
  ${j.registerUniforms(U).registerInternalVariables(M).declareVariables(...ne,re)}
  ${V}
  ${$?Ca(S,x,G,M):Aa(S,x,G,M)}
                   `};return{name:"MatMul",shaderCache:{hint:`${S};${t.activation};${$};${a}`,inputDependencies:q},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:b[0],y:b[1],z:b[2]},programUniforms:D}),getShaderSource:F}}}),Nu,rh,x0=P(()=>{"use strict";te(),ot(),ae(),Dt(),en(),v0(),an(),Nu=(e,t,r,i,a=!1,n,s=4,u=4,l=4,p="f32")=>{let f=D=>{switch(D){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${p}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${D} is not supported.`)}},h=D=>{switch(D){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${D} is not supported.`)}},g=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,_=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,y=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",$=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",S=e?"row":"col",x=e?"col":"row",b=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${S} / outWidth;
    let outCol = ${S} % outWidth;

    let WRow = ${x} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${x} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${x} % inChannels;
    var resData = ${Ce(s,p)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${y} && xCol >= 0 && xCol < ${$}) {
      ${g}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${f(s)}
    }
    return resData;`,E=e?t&&i?`
    let col = colIn * ${s};
    ${b}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${b}
    }
    return ${Ce(s,p)}(0.0);`:i&&r?`
    let col = colIn * ${s};
    ${b}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${b}
    }
    return ${Ce(s,p)}(0.0);`,k=e?i&&r?h(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${h(u)}
    }
    return ${Ce(u,p)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${h(u)}
    }
    return ${Ce(u,p)}(0.0);`,I=Ce(l,p),z=Ce(e?s:u,p),A=Ce(e?u:s,p),v=Bt(n,I,p);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${z} {
      ${e?E:k}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${A} {
      ${e?k:E}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${I}) {
      let col = colIn * ${l};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${_}
      ${eh(a)}
      ${v}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},rh=(e,t,r,i,a,n,s,u,l)=>{let p=t.format==="NHWC",f=p?e[0].dims[3]:e[0].dims[1],h=r[0],g=p?r[2]:r[3],_=p?r[1]:r[2],y=p?r[3]:r[1],$=p&&(f%4===0||f%3===0)&&y%4===0,S=p?y:g*_,x=p?g*_:y,b=[8,8,1],E=i<=8?[4,1,1]:[4,4,1],k=[Math.ceil(S/b[0]/E[0]),Math.ceil(x/b[1]/E[1]),Math.ceil(h/b[2]/E[2])];de("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${k}`);let I=$?p&&f%4!==0?3:4:1,z=b[1]*E[1],A=b[0]*E[0],v=Math.max(b[0]*I,b[1]),D=i%z===0,q=a%A===0,Q=n%v===0,F=$?[I,4,4]:[1,1,1],j=[{type:6,data:i},{type:6,data:a},{type:6,data:n},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Rt(t,j),j.push(...Z(e[0].dims,e[1].dims));let B=["rank","rank"];s&&(j.push(...Z(e[2].dims)),B.push("rank")),j.push(...Z(r));let M=G=>{let J=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Nt(t,J);let ee=$?4:1,re=Ee(e[0].dataType),ne=`
      fn setOutputAtIndex(flatIndex : i32, value : ${$?`vec4<${re}>`:re}) {
        result[flatIndex] = ${$?`vec4<${re}>`:re}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${$?`vec4<${re}>`:re}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${$?"/ 4":""}, value);
      }`,U=R("x",e[0].dataType,e[0].dims.length,I===3?1:I),Y=R("w",e[1].dataType,e[1].dims.length,ee),X=[U,Y],V=H("result",e[0].dataType,r.length,ee);if(s){let Te=R("bias",e[2].dataType,e[2].dims.length,ee);X.push(Te),ne+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${$?`vec4<${re}>`:re} {
          return bias[coords.${p?"w":"y"}${$?"/ 4":""}];
        }`}return`
        ${th("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${G.registerUniforms(J).declareVariables(...X,V)}
        ${ne}
        ${Nu(p,D,q,Q,s,t,F[0],F[1],F[2],re)}
        ${$?Ca(E,b,re,void 0,!p,v):Aa(E,b,re,void 0,!p,v,!1,void 0,u)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${I};${$};${D};${q};${Q};${z};${A};${v}`,inputDependencies:B},getRunData:()=>({outputs:[{dims:l?l(r):r,dataType:e[0].dataType}],dispatchGroup:{x:k[0],y:k[1],z:k[2]},programUniforms:j}),getShaderSource:M}}}),Mu,Gi,er,Du,Hi,Uu,ih,ah,S0=P(()=>{"use strict";te(),ot(),ie(),ae(),Dt(),en(),Mu=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},Gi=e=>typeof e=="number"?[e,e,e]:e,er=(e,t)=>t<=1?e:e+(e-1)*(t-1),Du=(e,t,r,i=1)=>{let a=er(t,i);return Math.floor((e[0]*(r-1)-r+a)/2)},Hi=(e,t,r,i,a)=>{a==null&&(a=Du(e,t[0],i[0]));let n=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*a>=t[s]&&(n[s]=Math.trunc((e[s]-t[s]+2*a)/i[s]+1));return n},Uu=(e,t,r,i,a,n,s,u,l,p)=>{let f,h,g,_;if(e==="VALID"&&(e=0),typeof e=="number"){f={top:e,bottom:e,left:e,right:e,front:e,back:e};let y=Hi([t,r,i,1],[u,l,p],1,[a,n,s],e);h=y[0],g=y[1],_=y[2]}else if(Array.isArray(e)){if(!e.every(($,S,x)=>$===x[0]))throw Error(`Unsupported padding parameter: ${e}`);f={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let y=Hi([t,r,i,1],[u,l,p],1,[a,n,s],e[0]);h=y[0],g=y[1],_=y[2]}else if(e==="SAME_UPPER"){h=Math.ceil(t/a),g=Math.ceil(r/n),_=Math.ceil(i/s);let y=(h-1)*a+u-t,$=(g-1)*n+l-r,S=(_-1)*s+p-i,x=Math.floor(y/2),b=y-x,E=Math.floor($/2),k=$-E,I=Math.floor(S/2),z=S-I;f={top:E,bottom:k,left:I,right:z,front:x,back:b}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:f,outDepth:h,outHeight:g,outWidth:_}},ih=(e,t,r,i,a,n=!1,s="channelsLast")=>{let u,l,p,f,h;if(s==="channelsLast")[u,l,p,f,h]=e;else if(s==="channelsFirst")[u,h,l,p,f]=e;else throw new Error(`Unknown dataFormat ${s}`);let[g,,_,y,$]=t,[S,x,b]=Gi(r),[E,k,I]=Gi(i),z=er(_,E),A=er(y,k),v=er($,I),{padInfo:D,outDepth:q,outHeight:Q,outWidth:F}=Uu(a,l,p,f,S,x,b,z,A,v),j=n?g*h:g,B=[0,0,0,0,0];return s==="channelsFirst"?B=[u,j,q,Q,F]:s==="channelsLast"&&(B=[u,q,Q,F,j]),{batchSize:u,dataFormat:s,inDepth:l,inHeight:p,inWidth:f,inChannels:h,outDepth:q,outHeight:Q,outWidth:F,outChannels:j,padInfo:D,strideDepth:S,strideHeight:x,strideWidth:b,filterDepth:_,filterHeight:y,filterWidth:$,effectiveFilterDepth:z,effectiveFilterHeight:A,effectiveFilterWidth:v,dilationDepth:E,dilationHeight:k,dilationWidth:I,inShape:e,outShape:B,filterShape:t}},ah=(e,t,r,i,a,n)=>{let s=n==="channelsLast",u=s?e[0].dims[3]:e[0].dims[1],l=!1,p=[64,1,1],f={x:r.map((b,E)=>E)},h=[Math.ceil(Mu(f.x.map(b=>r[b]))/p[0]),1,1];de("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${h}`);let g=l?s&&u%4!==0?3:4:1,_=O.size(r),y=[{type:12,data:_},{type:12,data:i},{type:12,data:a},{type:12,data:t.strides},{type:12,data:t.dilations}];Rt(t,y),y.push(...Z(e[0].dims,e[1].dims));let $=["rank","rank"],S=e.length===3;S&&(y.push(...Z(e[2].dims)),$.push("rank")),y.push(...Z(r));let x=b=>{let E=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:a.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Nt(t,E);let k=l?4:1,I=Ee(e[0].dataType),z=R("x",e[0].dataType,e[0].dims.length,g===3?1:g),A=R("W",e[1].dataType,e[1].dims.length,k),v=[z,A],D=H("result",e[0].dataType,r.length,k),q="";if(S){let j=R("bias",e[2].dataType,e[2].dims.length,k);v.push(j),q+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${l?`vec4<${I}>`:I} {
          return bias[${s?K("coords",4,5):K("coords",1,5)}${l?"/ 4":""}];
        }`}let Q=Ce(g,I),F=Bt(t,Q,I);return`
            ${q}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${I} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${z.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${I} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${A.getByIndices("aIndices")};
            }
          ${b.registerUniforms(E).declareVariables(...v,D)}
          ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${D.offsetToIndices("global_idx")};
              let batch = ${K("coords",0,z.rank)};
              let d2 = ${s?K("coords",z.rank-1,z.rank):K("coords",1,z.rank)};
              let xFRCCorner = vec3<u32>(${s?K("coords",1,z.rank):K("coords",2,z.rank)},
              ${s?K("coords",2,z.rank):K("coords",3,z.rank)},
              ${s?K("coords",3,z.rank):K("coords",4,z.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?K("uniforms.x_shape",1,z.rank):K("uniforms.x_shape",2,z.rank)};
              let xShapeZ = ${s?K("uniforms.x_shape",2,z.rank):K("uniforms.x_shape",3,z.rank)};
              let xShapeW = ${s?K("uniforms.x_shape",3,z.rank):K("uniforms.x_shape",4,z.rank)};
              let xShapeU = ${s?K("uniforms.x_shape",4,z.rank):K("uniforms.x_shape",1,z.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = ${I}(0);
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${s?`let xValues = vec4<${I}>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<${I}>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<${I}>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${s?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${s?`let xValues = vec2<${I}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<${I}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<${I}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s?`let xValues = vec3<${I}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<${I}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<${I}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${S?"value = value + getBiasByOutputCoords(coords)":""};
              ${F}
              result[global_idx] = ${I}(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${g};${S}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:h[0],y:h[1],z:h[2]},programUniforms:y}),getShaderSource:x}}}),nh,sh,k0=P(()=>{"use strict";te(),ie(),ae(),Dt(),nh=(e,t,r,i)=>{let a=e.length>2,n=a?"value += b[output_channel];":"",s=e[0].dims,u=e[1].dims,l=t.format==="NHWC",p=l?r[3]:r[1],f=p/t.group,h=l&&f>=4?xe(p):1,g=O.size(r)/h,_=[{type:12,data:g},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:f}];Rt(t,_),_.push(...Z(s,[u[0],u[1],u[2],u[3]/h]));let y=a?["rank","rank","rank"]:["rank","rank"];_.push(...Z([r[0],r[1],r[2],r[3]/h]));let $=S=>{let x=H("output",e[0].dataType,r.length,h),b=Ee(x.type.tensor),E=Bt(t,x.type.value,b),k=R("x",e[0].dataType,s.length),I=R("w",e[1].dataType,u.length,h),z=[k,I];a&&z.push(R("b",e[2].dataType,e[2].dims,h));let A=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Nt(t,A);let v=l?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${k.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${I.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${k.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${I.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${S.registerUniforms(A).declareVariables(...z,x)}

  ${S.mainStart()}
    ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${x.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${l?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${l?1:2}], outputIndices[${l?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${h} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${l?2:1}];

    var value: ${x.type.value} = ${x.type.value}(0);
    ${v}
    ${n}
    ${E}
    ${x.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${h}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:_}),getShaderSource:$}},sh=(e,t,r,i)=>{let a=e.length>2,n=xe(r[3]),s=xe(r[2]),u=O.size(r)/n/s,l=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/n],p=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/n],f=[r[0],r[1],r[2],r[3]/n],h=[{type:12,data:u},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Rt(t,h),h.push(...Z(l,p,f));let g=(s-1)*t.strides[1]+p[1],_=y=>{let $=H("output",e[0].dataType,f.length,n),S=Ee($.type.tensor),x=Bt(t,$.type.value,S),b=R("x",e[0].dataType,l.length,n),E=R("w",e[1].dataType,p.length,n),k=[b,E];a&&k.push(R("b",e[2].dataType,e[2].dims,n));let I=a?"value += b[output_channel];":"",z=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Nt(t,z),`
  ${y.registerUniforms(z).declareVariables(...k,$)}
  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${b.type.value}, ${g}>;
    var values: array<${$.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${p[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${g}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${b.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${b.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${p[1]}; w_width++) {
          let w_val = ${E.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${I}
      ${x}
      ${$.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${n};${s};${g};${p[0]};${p[1]}`,inputDependencies:a?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:h}),getShaderSource:_}}}),Pu,Br,qu,Rr,Oa,Fi,Lu,Wu,Ba,T0=P(()=>{"use strict";ie(),x0(),S0(),an(),k0(),Dt(),rn(),bt(),Pu=(e,t,r,i,a,n)=>{let s=e[0],u=e.slice(n?1:2,n?3:4),l=u.length,p=t[0],f=t.slice(2).map((g,_)=>g+(g-1)*(r[_]-1)),h=u.map((g,_)=>g+i[_]+i[_+l]).map((g,_)=>Math.floor((g-f[_]+a[_])/a[_]));return h.splice(0,0,s),h.splice(n?3:1,0,p),h},Br=[2,3,1,0],qu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Rr=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let n=2;n<t[1].dims.length;++n)r[n-2]===0&&(r[n-2]=t[1].dims[n]);let i=e.pads.slice();Hr.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let a=Object.assign({},e);return Object.assign(a,{kernelShape:r,pads:i}),a},Oa=e=>{let t=Ja(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],a=e.dilations,n=e.group,s=e.kernel_shape,u=e.pads,l=e.strides,p=e.w_is_const();return{autoPad:i,format:r,dilations:a,group:n,kernelShape:s,pads:u,strides:l,wIsConst:p,...t,cacheKey:`${e.format};${t.activation};`}},Fi=(e,t,r,i)=>{let a=r.format==="NHWC",n=Pu(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,a);if(r.group!==1){let z=[t[0]];if(a){let A=e.kernelCustomData.wT??e.compute(De(t[1],Br),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=A),z.push(A)}else z.push(t[1]);t.length===3&&z.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&a&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(sh(z,r,n,i),{inputs:z}):e.compute(nh(z,r,n,i),{inputs:z});return}let s=t.length===3,u=t[0].dims[a?1:2],l=t[0].dims[a?2:3],p=t[0].dims[a?3:1],f=t[1].dims[2],h=t[1].dims[3],g=n[a?1:2],_=n[a?2:3],y=n[a?3:1],$=a&&f===u&&h===l&&r.pads[0]===0&&r.pads[1]===0;if($||f===1&&h===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let z=n[0],A,v,D,q=[];if(a){let j=e.kernelCustomData.wT??e.compute(De(t[1],Br),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=j),$){let B=u*l*p;A=t[0].reshape([1,z,B]),v=j.reshape([1,B,y]),D=[1,z,y]}else A=t[0].reshape([z,u*l,p]),v=j.reshape([1,p,y]),D=[z,g*_,y];q.push(A),q.push(v)}else A=t[0].reshape([z,p,u*l]),v=t[1].reshape([1,y,p]),D=[z,y,g*_],q.push(v),q.push(A);s&&q.push(t[2]);let Q=D[2],F=q[0].dims[q[0].dims.length-1];Q<8&&F<8?e.compute(tn(q,r,n,D,a,i),{inputs:q}):e.compute(jr(q,r,n,D,a,i),{inputs:q});return}let S=!0,x=e.kernelCustomData.wT??e.compute(De(t[1],Br),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=x);let b=[t[0],x];s&&b.push(t[2]);let E=a?g*_:y,k=a?y:g*_,I=f*h*p;e.compute(rh(b,r,n,E,k,I,s,S,i),{inputs:b})},Lu=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let a=[0,t.pads[0],0,t.pads[1]],n=[1].concat(t.strides),s=[1].concat(t.dilations),u=[1].concat(t.kernelShape),l=Rr({...t,pads:a,strides:n,dilations:s,kernelShape:u},i);Fi(e,i,l,p=>r?[p[0],p[2],p[3]]:[p[0],p[1],p[3]])},Wu=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",a=Rr(r,t),n=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=ih(t[0].dims,t[1].dims,r.strides,r.dilations,n,!1,i);e.compute(ah(t,a,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],i))},Ba=(e,t)=>{if(qu(e.inputs,t),e.inputs[0].dims.length===3)Lu(e,t);else if(e.inputs[0].dims.length===5)Wu(e,e.inputs,t);else{let r=Rr(t,e.inputs);Fi(e,e.inputs,r)}}}),oh,I0=P(()=>{"use strict";te(),ot(),ie(),ae(),oh=(e,t,r)=>{let i=e.length>2,a=t.outputShape,n=t.format==="NHWC",s=t.group,u=e[1].dims,l=u[2]/s,p=u[3],f=n?xe(l):1,h=n&&p===1&&l>=4,g=h?Math.floor(l/4)*4:Math.floor(l/f)*f,_=l-g,y=n?xe(p):1,$=n?p===1?f:y:1,S=O.size(a)/y,x=[Math.ceil(S/64),1,1];de("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${x}`);let b=["rank","rank"],E=[t.strides[0],t.strides[1]],k=[t.kernelShape[n?1:2],t.kernelShape[n?2:3]],I=[t.dilations[0],t.dilations[1]],z=[k[0]+(t.dilations[0]<=1?0:(t.kernelShape[n?1:2]-1)*(t.dilations[0]-1)),k[1]+(t.dilations[1]<=1?0:(t.kernelShape[n?2:3]-1)*(t.dilations[1]-1))],A=[z[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),z[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],v=[{type:12,data:S},{type:12,data:E},{type:12,data:k},{type:12,data:I},{type:12,data:z},{type:6,data:A},{type:12,data:g},{type:12,data:l},{type:12,data:p},...Z(e[0].dims,e[1].dims)];i&&(v.push(...Z(e[2].dims)),b.push("rank")),v.push(...Z(a));let D=q=>{let Q=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:E.length},{name:"filter_dims",type:"u32",length:k.length},{name:"dilations",type:"u32",length:k.length},{name:"effective_filter_dims",type:"u32",length:z.length},{name:"pads",type:"i32",length:A.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],F=Ee(e[0].dataType),j=n?1:2,B=n?2:3,M=n?3:1,G=R("W",e[1].dataType,e[1].dims.length,$),J=R("Dy",e[0].dataType,e[0].dims.length,f),ee=[J,G];i&&ee.push(R("bias",e[2].dataType,[a[M]].length,y));let re=H("result",e[0].dataType,a.length,y),ne=()=>{let X="";if(h)f===4?X+=`
        let xValue = ${J.getByOffset("x_offset")};
        let wValue = ${G.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:f===2?X+=`
          dotProd = dotProd + dot(vec4<${F}>(${J.getByOffset("x_offset")}, ${J.getByOffset("x_offset + 1u")}), vec4<${F}>(${G.getByOffset("w_offset")}, ${G.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:f===1&&(X+=`
          dotProd = dotProd + dot(vec4<${F}>(${J.getByOffset("x_offset")}, ${J.getByOffset("x_offset + 1u")}, ${J.getByOffset("x_offset + 2u")}, ${J.getByOffset("x_offset + 3u")}), vec4<${F}>(${G.getByOffset("w_offset")}, ${G.getByOffset("w_offset + 1u")}, ${G.getByOffset("w_offset + 2u")}, ${G.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(X+=`
                  let xValue = ${n?J.getByOffset(`${J.indicesToOffset(`${J.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${f}`):J.get("batch","inputChannel","idyR","idyC")};
        `,f===1)X+=`
          let w_offset = ${G.indicesToOffset(`${G.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${G.getByOffset(`w_offset / ${$}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let V=0;V<f;V++)X+=`
            let wValue${V} = ${G.getByOffset(`${G.indicesToOffset(`${G.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${V}, wOutChannel)`)} / ${$}`)};
            dotProd = dotProd + xValue[${V}] * wValue${V};`;return X},U=()=>{if(_===0)return"";if(!h)throw new Error(`packInputAs4 ${h} is not true.`);let X="";if(f===1){X+="dotProd = dotProd";for(let V=0;V<_;V++)X+=`
            + ${J.getByOffset(`x_offset + ${V}`)} * ${G.getByOffset(`w_offset + ${V}`)}`;X+=";"}else if(f===2){if(_!==2)throw new Error(`Invalid inputChannelsRemainder ${_}.`);X+=`
          let xValue = ${J.getByOffset("x_offset")};
          let wValue = ${G.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return X},Y=`
            let outputIndices = ${re.offsetToIndices(`global_idx * ${y}`)};
            let batch = ${re.indicesGet("outputIndices",0)};
            let d1 = ${re.indicesGet("outputIndices",M)};
            let r = ${re.indicesGet("outputIndices",j)};
            let c = ${re.indicesGet("outputIndices",B)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${re.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${F}(dyRCorner) + ${F}(wR)) / ${F}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${F}(uniforms.Dy_shape[${j}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${F}(dyCCorner) + ${F}(wC)) / ${F}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${F}(uniforms.Dy_shape[${B}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${h?`
                var x_offset = ${J.indicesToOffset(`${J.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${f};
                var w_offset = ${G.indicesToOffset(`${G.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${$};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${h?4:f}) {
                  ${ne()}
                  inputChannel = inputChannel + ${h?4:f};
                }
                ${U()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${y}]`:""};
            ${re.setByOffset("global_idx","value")};
          `;return`
    ${q.registerUniforms(Q).declareVariables(...ee,re)}
      ${q.mainStart()}
      ${q.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${Y}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${f}${$}${y}${h}${_}`,inputDependencies:b},getRunData:()=>({dispatchGroup:{x:x[0],y:x[1],z:x[2]},outputs:[{dims:r?r(a):a,dataType:e[0].dataType}],programUniforms:v}),getShaderSource:D}}}),Vu,Gu,Hu,ji,uh,Fu,Ki,ju,lh,E0=P(()=>{"use strict";I0(),Dt(),bt(),Vu=(e,t,r,i,a,n)=>(e-1)*t+r+(i-1)*a+1-n,Gu=(e,t,r,i,a)=>{let n=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=n,r[a]=e-n):t==="SAME_LOWER"&&(r[i]=e-n,r[a]=n)},Hu=(e,t,r,i,a,n,s,u,l,p)=>{let f=e.length-2,h=p.length===0;l.length<f&&l.push(...Array(f-l.length).fill(0));let g=e[0],_=t[u?3:1]*a;for(let y=0,$=e.length-f-(u?1:0);y<f;++y,++$){let S=e[$],x=h?S*s[y]:p[y],b=Vu(S,s[y],n[y],t[$],r[y],x);Gu(b,i,n,y,y+f),h&&p.push(s[y]*(S-1)+l[y]+(t[$]-1)*r[y]+1-n[y]-n[y+f])}p.splice(0,0,g),p.splice(u?3:1,0,_)},ji=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((h,g)=>h*g,1)===0){r.length=0;for(let h=2;h<t[1].dims.length;++h)r.push(t[1].dims[h])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let a=e.pads.slice(),n=e.outputShape.slice(),s=e.outputPadding.slice(),u=t[0].dims,l=e.dilations.slice();if(l.reduce((h,g)=>h+g,0)===0){let h=t[0].dims.length-2;l=new Array(h).fill(1)}let p=e.strides.slice();if(p.reduce((h,g)=>h+g,0)===0){let h=t[0].dims.length-2;p=new Array(h).fill(1)}Hu(u,r,l,e.autoPad,e.group,a,p,i,s,n);let f=Object.assign({},e);return Object.assign(f,{kernelShape:r,pads:a,outputPadding:s,outputShape:n,dilations:l,strides:p}),f},uh=e=>{let t=Ja(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],a=e.dilations,n=e.group??1,s=e.kernelShape,u=e.pads,l=e.strides,p=e.wIsConst(),f=e.outputPadding,h=e.outputShape;return{autoPad:i,format:r,dilations:a,group:n,kernelShape:s,outputPadding:f,outputShape:h,pads:u,strides:l,wIsConst:p,...t,cacheKey:`${e.format};${t.activation};`}},Fu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let a=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==a))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.reduce((s,u)=>s+u,0)>0&&t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.reduce((s,u)=>s+u,0)>0&&t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.reduce((s,u)=>s+u,0)>0&&t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.outputPadding.length!==n&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${n}D`);if(t.kernelShape.reduce((s,u)=>s+u,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},Ki=(e,t,r,i)=>{let a=e.kernelCustomData.wT??e.compute(De(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=a);let n=[t[0],a];t.length===3&&n.push(t[2]),e.compute(oh(n,r,i),{inputs:n})},ju=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let a=t.kernelShape;(a.length===0||a[0]===0)&&(a=[e.inputs[1].dims[2]]);let n=t.dilations;(n.length===0||n[0]===0)&&(n=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let u=t.pads;u.length===0&&(u=[0,0]),u=[0,u[0],0,u[1]],s=[1].concat(s),n=[1].concat(n),a=[1].concat(a);let l=t.outputPadding;l=[0].concat(l);let p=ji({...t,pads:u,strides:s,dilations:n,kernelShape:a,outputPadding:l},i);Ki(e,i,p,f=>r?[f[0],f[2],f[3]]:[f[0],f[1],f[3]])},lh=(e,t)=>{if(Fu(e.inputs,t),e.inputs[0].dims.length===3)ju(e,t);else{let r=ji(t,e.inputs);Ki(e,e.inputs,r)}}}),Ku,dh,ph,z0=P(()=>{"use strict";te(),ie(),Se(),ae(),Ku=(e,t,r,i)=>{let a=O.size(t),n=t.length,s=R("input",e,n),u=H("output",e,n),l=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),p=O.normalizeAxis(l,n),f=h=>{let g=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,_=K("uniforms.input_shape","uniforms.axis",n),y=i.reverse?g+(i.exclusive?" + 1":""):"0",$=i.reverse?_:g+(i.exclusive?"":" + 1");return`
                ${h.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,u)}
                ${h.mainStart()}
                  ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${y};
                  let last : i32 = ${$};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},{type:12,data:p},...Z(t,t)]}),getShaderSource:f}},dh=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,a=e.inputs[1];e.compute(Ku(i,r,a,t),{inputs:[0]})},ph=e=>{let t=e.exclusive===1,r=e.reverse===1;return he({exclusive:t,reverse:r})}}),Zu,Xu,Qu,ch,hh,C0=P(()=>{"use strict";te(),ie(),Se(),ae(),Zu=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},Xu=(e,t,r,i)=>{let a=[];a.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let n=0;n<t;++n)a.push(r.indicesSet("a",e[n],`i[${n}]`));return a.push("return a;}"),a.join(`
`)},Qu=(e,t)=>{let r,i,a,n,s,u,l=t.format==="NHWC",p=t.blocksize,f=t.mode==="DCR";l?([r,i,a,n]=e.dims,s=f?[r,i,a,p,p,n/p**2]:[r,i,a,n/p**2,p,p],u=f?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,a,n]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=f?[r,p,p,n/p**2,i,a]:[r,n/p**2,p,p,i,a],u=f?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let h=e.reshape(s),g=h.dims.length,_=e.dataType,y=R("a",_,g),$=H("output",_,g),S=x=>`
  ${x.registerUniform("output_size","u32").declareVariables(y,$)}

  ${Xu(u,g,y,$)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${$.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${$.setByOffset("global_idx",y.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:x=>{let b=l?[r,i*p,a*p,n/p**2]:[r,n/p**2,i*p,a*p],E=O.size(b),k=h.dims,I=O.sortBasedOnPerm(k,u);return{outputs:[{dims:b,dataType:x[0].dataType}],dispatchGroup:{x:Math.ceil(E/64)},programUniforms:[{type:12,data:E},...Z(k,I)]}},getShaderSource:S}},ch=(e,t)=>{Zu(e.inputs),e.compute(Qu(e.inputs[0],t))},hh=e=>he({blocksize:e.blocksize,mode:e.mode,format:e.format})}),at,tr,Nr,Zi,ft,Yu,Ju,el,Xi,Qi,Yi,tl,rl,Ji,il,fh,mh,A0=P(()=>{"use strict";te(),ie(),Se(),ae(),at=256,tr=512,Nr=2*Math.PI,Zi=e=>{let t=[],r=e;for(let i of[4,2,3,5])for(;r%i===0;)t.push(i),r/=i;return r===1?t:void 0},ft=e=>{let t=e.toPrecision(9);return/[.eE]/.test(t)?t:`${t}.0`},Yu=(e,t,r,i,a)=>{let n=r/e,s=tr-i,u=p=>`smem[${s}u + base + ${p*t}u]`,l=`  for (var t = local_idx; t < ${n}u; t += ${at}u) {
`;l+=`    let twiddleIndex = t % ${t}u;
    let angleUnit = f32(twiddleIndex);
`,l+=`    var leg: array<vec2<f32>, 5>;
`;for(let p=0;p<e;p++){let f=`${i}u + t + ${p*n}u`;if(p===0)l+=`    leg[0] = smem[${f}];
`;else{let h=a*Nr*p/(e*t);l+=`    { let a = ${ft(h)} * angleUnit; leg[${p}] = cmul(smem[${f}], vec2<f32>(cos(a), sin(a))); }
`}}if(l+=`    let base = (t / ${t}u) * ${t*e}u + twiddleIndex;
`,e===2)l+=`    ${u(0)} = leg[0] + leg[1];
    ${u(1)} = leg[0] - leg[1];
`;else if(e===4){let p=a<0?"vec2<f32>(oddDiff.y, -oddDiff.x)":"vec2<f32>(-oddDiff.y, oddDiff.x)";l+=`    let evenSum = leg[0] + leg[2]; let evenDiff = leg[0] - leg[2];
`,l+=`    let oddSum = leg[1] + leg[3]; let oddDiff = leg[1] - leg[3];
`,l+=`    let oddRot = ${p};
`,l+=`    ${u(0)} = evenSum + oddSum;
    ${u(1)} = evenDiff + oddRot;
`,l+=`    ${u(2)} = evenSum - oddSum;
    ${u(3)} = evenDiff - oddRot;
`}else for(let p=0;p<e;p++){let f=["leg[0]"];for(let h=1;h<e;h++){let g=a*Nr*(h*p)/e,_=ft(Math.cos(g)),y=ft(Math.sin(g));f.push(`vec2<f32>(leg[${h}].x*${_} - leg[${h}].y*${y}, leg[${h}].x*${y} + leg[${h}].y*${_})`)}l+=`    ${u(p)} = ${f.join(" + ")};
`}return`${l}  }
  workgroupBarrier();
`},Ju=(e,t,r)=>{let i="",a=1,n=0;for(let s of e)i+=Yu(s,a,t,n,r),a*=s,n=tr-n;return{code:i,resultOffset:n}},el=(e,t,r,i,a)=>{let n=e.dims,s=n.length,u=n[s-1],l=n[t],p=r&&i?(l-1)*2:l;a!==void 0&&(p=a);let f=r&&i?1:2,h=i&&!r?Math.floor(p/2)+1:p,g=n.slice();g[t]=h,g[s-1]=f;let _=1;for(let $=t+1;$<s-1;$++)_*=n[$];let y=O.size(n)/u/l;return{dataType:e.dataType,outputDims:g,length:p,signalLength:l,inner:_,batch:y,inputComponents:u,outputComponents:f,outputLength:h,inverse:r,onesided:i}},Xi=(e,t)=>[t,e.length,e.inputComponents,e.outputComponents,e.inverse,e.onesided].join(";"),Qi=e=>[{type:12,data:e.batch},{type:12,data:e.signalLength},{type:12,data:e.inner},{type:12,data:e.outputLength}],Yi=(e,t,r)=>e.registerUniform("batch","u32").registerUniform("signalLength","u32").registerUniform("inner","u32").registerUniform("outputLength","u32").declareVariables(t,r),tl=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:a,inverse:n,onesided:s}=e,u=Ie(t),l=n?1:-1,p=n?1/r:1,f=Zi(r),h=g=>{let _=R("x",t,[1]),y=H("y",t,[1]),$=I=>{let z=`inBase + (${I}) * uniforms.inner * ${i}u`,A=`f32(${_.getByOffset(z)})`,v=i===2?`f32(${_.getByOffset(`${z} + 1u`)})`:"0.0";return`vec2<f32>(${A}, ${v})`},S;if(n&&s){let I=Math.floor(r/2)+1,z=r%2===0?`select(provided, provided - 1u, provided == ${I}u)`:"provided";S=`
    let provided = min(uniforms.signalLength, ${I}u);
    for (var i = local_idx; i < ${r}u; i += ${at}u) {
      if (i < provided) { smem[i] = ${$("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();
    for (var k = local_idx + 1u; k < ${z}; k += ${at}u) {
      let h = smem[k];
      smem[${r}u - k] = vec2<f32>(h.x, -h.y);
    }
    workgroupBarrier();`}else S=`
    let loadCount = min(uniforms.signalLength, ${r}u);
    for (var i = local_idx; i < ${r}u; i += ${at}u) {
      if (i < loadCount) { smem[i] = ${$("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();`;let{code:x,resultOffset:b}=Ju(f,r,l),E=p===1?`smem[${b}u + i]`:`smem[${b}u + i] * ${ft(p)}`,k=a===2?y.setByOffset("off + 1u",`${u}(v.y)`):"";return`
  ${Yi(g,_,y)}
  var<workgroup> smem: array<vec2<f32>, ${2*tr}>;
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${g.mainStart(at)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${a}u;
    ${S}
${x}    for (var i = local_idx; i < uniforms.outputLength; i += ${at}u) {
      let v = ${E};
      let off = outBase + i * uniforms.inner * ${a}u;
      ${y.setByOffset("off",`${u}(v.x)`)}
      ${k}
    }
  }`};return{name:"DFT",shaderCache:{hint:Xi(e,"fft"),inputDependencies:["type"]},getShaderSource:h,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:Qi(e),dispatchGroup:{x:e.batch}})}},rl=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:a,inverse:n,onesided:s}=e,u=Ie(t),l=n?1:-1,p=n?1/r:1,f=h=>{let g=R("x",t,[1]),_=H("y",t,[1]),y=E=>{let k=`inBase + (${E}) * uniforms.inner * ${i}u`,I=`f32(${g.getByOffset(k)})`,z=i===2?`f32(${g.getByOffset(`${k} + 1u`)})`:"0.0";return`vec2<f32>(${I}, ${z})`},$=n&&s?`fn spectrum(inBase: u32, k: u32) -> vec2<f32> {
    let provided = min(uniforms.signalLength, ${Math.floor(r/2)+1}u);
    if (k < provided) { return ${y("k")}; }
    let m = ${r}u - k;
    if (m < provided) {
      let h = ${y("m")};
      return vec2<f32>(h.x, -h.y);
    }
    return vec2<f32>(0.0, 0.0);
  }`:`fn spectrum(inBase: u32, n: u32) -> vec2<f32> {
    if (n < uniforms.signalLength) { return ${y("n")}; }
    return vec2<f32>(0.0, 0.0);
  }`,S=`
      let angle = ${ft(l*Nr)} * f32(knMod) / ${ft(r)};
      acc += cmul(spectrum(inBase, n), vec2<f32>(cos(angle), sin(angle)));
      knMod += k;
      if (knMod >= ${r}u) { knMod -= ${r}u; }`,x=a===2?_.setByOffset("off + 1u",`${u}(v.y)`):"",b=p===1?"acc":`acc * ${ft(p)}`;return`
  ${Yi(h,g,_)}
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${$}
  ${h.mainStart(at)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${a}u;
    for (var k = local_idx; k < uniforms.outputLength; k += ${at}u) {
      var acc = vec2<f32>(0.0, 0.0);
      var knMod = 0u;
      for (var n = 0u; n < ${r}u; n++) {${S}
      }
      let v = ${b};
      let off = outBase + k * uniforms.inner * ${a}u;
      ${_.setByOffset("off",`${u}(v.x)`)}
      ${x}
    }
  }`};return{name:"DFT",shaderCache:{hint:Xi(e,"direct"),inputDependencies:["type"]},getShaderSource:f,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:Qi(e),dispatchGroup:{x:e.batch}})}},Ji=e=>{if(!e||e.dataType===0)return;if(O.size(e.dims)!==1)throw new Error("DFT optional scalar inputs must have exactly 1 element.");if(e.dataType===6)return e.getInt32Array()[0];let t=Number(e.getBigInt64Array()[0]);if(!Number.isSafeInteger(t))throw new Error("DFT optional scalar inputs are out of JavaScript safe integer range.");return t},il=e=>{if(!e||e.length<1)throw new Error("DFT requires at least 1 input.");let t=e[0].dims;if(t.length<2)throw new Error("DFT input must have at least 2 dimensions.");let r=t[t.length-1];if(r!==1&&r!==2)throw new Error("DFT input's innermost dimension must be 1 (real) or 2 (complex).")},fh=(e,t)=>{il(e.inputs);let r=e.inputs[0],i=r.dims.length,a=t.inverse!==0,n=t.onesided!==0,s=Ji(e.inputs[1]);if(s!==void 0&&s<=0)throw new Error("dft_length must be greater than zero.");let u=O.normalizeAxis(Ji(e.inputs[2])??t.axis,i);if(u===i-1)throw new Error("DFT axis must refer to a signal dimension, not the innermost (real/imaginary) dimension.");if(a&&n&&r.dims[i-1]!==2)throw new Error("Inverse one-sided DFT (IRFFT) requires complex-valued input (innermost dimension 2).");let l=el(r,u,a,n,s);if(l.length<=0)throw new Error(`Invalid DFT length: ${l.length}`);let p=l.length<=tr&&Zi(l.length)!==void 0?tl(l):rl(l);e.compute(p,{inputs:[0]})},mh=e=>he({axis:e.axis??1,inverse:e.inverse??0,onesided:e.onesided??0})}),Mr,rr,ea,al,nl,sl,ol,ta,ul,gh,yh,O0=P(()=>{"use strict";te(),ie(),Se(),ae(),Mr="[a-zA-Z]|\\.\\.\\.",rr="("+Mr+")+",ea="^"+rr+"$",al="("+rr+",)*"+rr,nl="^"+al+"$",sl=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},ol=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(nl)))throw new Error("Invalid LHS term");if(r.split(",").forEach((a,n)=>{let s=e[n].dims.slice();if(!a.match(RegExp(ea)))throw new Error("Invalid LHS term");let u=this.processTerm(a,!0,s,n);this.lhs.push(u)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([a,n])=>n.count===1||a==="...").map(([a])=>a).join("");else if(!i.match(RegExp(rr)))throw new Error("Invalid RHS");i.match(RegExp(Mr,"g"))?.forEach(a=>{if(a==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let n=this.symbolToInfo.get(a);if(n===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(n.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let a=r.length,n=!1,s=[],u=0;if(!e.match(RegExp(ea))&&!t&&e!=="")throw new Error("Invalid LHS term");let l=e.match(RegExp(Mr,"g")),p=new sl(i);return l?.forEach((f,h)=>{if(f==="..."){if(n)throw new Error("Only one ellipsis is allowed per input term");n=!0;let g=a-l.length+1;if(g<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(u,u+g),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let _=0;_<s.length;_++){let y=String.fromCharCode(48+_);p.addSymbol(y,h+_),this.addSymbol(y,r[u++],i)}}else p.addSymbol(f,h+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(f,r[u++],i)}),p}},ta=e=>e+"_max",ul=(e,t,r,i)=>{let a=e.map(p=>p.length).map((p,f)=>R(`input${f}`,t,p)),n=O.size(i),s=H("output",t,i.length),u=[...r.symbolToInfo.keys()].filter(p=>!r.rhs.symbolToIndices.has(p)),l=p=>{let f=[],h="var prod = 1.0;",g="var sum = 0.0;",_="sum += prod;",y=[],$=[],S=[],x=[],b=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((k,I)=>{if(r.rhs.symbolToIndices.has(I)){let z=r.rhs.symbolToIndices.get(I)?.[0];z!==void 0&&r.lhs.forEach((A,v)=>{if(k.inputIndices.includes(v)){let D=A.symbolToIndices.get(I);if(D===void 0)throw new Error("Invalid symbol error");D.forEach(q=>{f.push(`${a[v].indicesSet(`input${v}Indices`,q,s.indicesGet("outputIndices",z))}`)})}})}else r.lhs.forEach((z,A)=>{if(k.inputIndices.includes(A)){let v=z.symbolToIndices.get(I);if(v===void 0)throw new Error("Invalid symbol error");v.forEach(D=>{y.push(`${a[A].indicesSet(`input${A}Indices`,D,`${I}`)}`)}),x.push(`prod *= ${a[A].getByIndices(`input${A}Indices`)};`)}}),$.push(`for(var ${I}: u32 = 0; ${I} < uniforms.${ta(I)}; ${I}++) {`),S.push("}")});let E=b?[...f,`let sum = ${a.map((k,I)=>k.getByIndices(`input${I}Indices`)).join(" * ")};`]:[...f,g,...$,...y,h,...x,_,...S];return`
            ${p.registerUniforms(u.map(k=>({name:`${ta(k)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...a,s)}

            ${p.mainStart()}
            ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${a.map((k,I)=>`var input${I}Indices: ${a[I].type.indices};`).join(`
`)}
            ${E.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let p=u.filter(h=>r.symbolToInfo.has(h)).map(h=>({type:12,data:r.symbolToInfo.get(h)?.dimValue||0}));p.push({type:12,data:n});let f=e.map((h,g)=>[...Z(h)]).reduce((h,g)=>h.concat(g),p);return f.push(...Z(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:f}},getShaderSource:l}},gh=(e,t)=>{let r=new ol(e.inputs,t.equation),i=r.outputDims,a=e.inputs.map((n,s)=>n.dims);e.compute(ul(a,e.inputs[0].dataType,r,i))},yh=e=>{let t=e.equation.replace(/\s+/g,"");return he({equation:t})}}),ll,ra,dl,pl,_h,B0=P(()=>{"use strict";te(),ie(),ae(),ll=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,a=t.length<r.length?0:t.length-r.length;for(;i<r.length&&a<t.length;++i,++a)if(r[i]!==t[a]&&r[i]!==1&&t[a]!==1)throw new Error("Expand requires shape to be broadcastable to input")},ra=(e,t)=>{let r=e.length-t.length,i=[];for(let a=0;a<r;++a)i.push(e[a]);for(let a=0;a<t.length;++a)i.push(t[a]===1?e[a+r]:t[a]);return i},dl=(e,t)=>e.length>t.length?ra(e,t):ra(t,e),pl=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=dl(t,r),a=e[0].dataType,n=a===9||O.size(t)===1,s=a===9||t.length>0&&t[t.length-1]%4===0?4:1,u=n||i.length>0&&i[i.length-1]%4===0?4:1,l=Math.ceil(O.size(i)/u),p=h=>{let g=R("input",a,t.length,s),_=H("output",a,i.length,u),y;if(a===9){let $=(S,x,b="")=>`
          let outputIndices${x} = ${_.offsetToIndices(`outputOffset + ${x}u`)};
          let offset${x} = ${g.broadcastedIndicesToOffset(`outputIndices${x}`,_)};
          let index${x} = offset${x} / 4u;
          let component${x} = offset${x} % 4u;
          ${S}[${x}] = ${b}(${g.getByOffset(`index${x}`)}[component${x}]);
        `;y=`
        let outputOffset = global_idx * ${u};
        var data = vec4<u32>(0);
        ${$("data",0,"u32")}
        ${$("data",1,"u32")}
        ${$("data",2,"u32")}
        ${$("data",3,"u32")}
        ${_.setByOffset("global_idx","data")}
      }`}else y=`
        let outputIndices = ${_.offsetToIndices(`global_idx * ${u}`)};
        let inputOffset = ${g.broadcastedIndicesToOffset("outputIndices",_)};
        let data = ${_.type.value}(${g.getByOffset(`inputOffset / ${s}`)});
        ${_.setByOffset("global_idx","data")}
      }`;return`
    ${h.registerUniform("vec_size","u32").declareVariables(g,_)}
    ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${y}`},f=[{type:12,data:l},...Z(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${s}${u}`,inputDependencies:["rank"]},getShaderSource:p,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:f})}},_h=e=>{ll(e.inputs),e.compute(pl(e.inputs),{inputs:[0]})}}),cl,bh,R0=P(()=>{"use strict";te(),ie(),ae(),Ya(),cl=e=>{let t=e[0].dataType,r=O.size(e[0].dims),i=O.size(e[1].dims),a=i%4===0,n=s=>{let u=R("x",t,[1],4),l=R("bias",t,[1],4),p=H("y",t,[1],4),f=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],h=_=>`
      let bias${_}_offset: u32 = (global_idx * 4 + ${_}) % uniforms.bias_size;
      let bias${_} = ${l.getByOffset(`bias${_}_offset / 4`)}[bias${_}_offset % 4];`,g=a?`
      let bias = ${l.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${h(0)}${h(1)}${h(2)}${h(3)}
      let bias = ${u.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(f).declareVariables(u,l,p)}

    ${Ea(Ie(t))}

    ${s.mainStart(Gt)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${u.getByOffset("global_idx")};
      ${g}
      let x_in = x + bias;
      ${p.setByOffset("global_idx",za("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${a}`,inputDependencies:["type","type"]},getShaderSource:n,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/Gt/4)}})}},bh=e=>{e.inputs.length<2||O.size(e.inputs[1].dims)===0?Dc(e):e.compute(cl(e.inputs))}}),hl,fl,wh,$h,N0=P(()=>{"use strict";te(),ie(),Se(),ae(),hl=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},fl=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r.length,n=O.normalizeAxis(t.axis,a),s=r.slice(0);s.splice(n,1,...i);let u=r[n],l=e[0].dataType===9?4:1,p=Math.ceil(O.size(s)/l),f=[{type:12,data:p},{type:6,data:u},{type:12,data:n},...Z(e[0].dims,e[1].dims,s)],h=g=>{let _=R("data",e[0].dataType,e[0].dims.length,l),y=R("inputIndices",e[1].dataType,e[1].dims.length),$=H("output",e[0].dataType,s.length,l),S=b=>{let E=i.length,k=`var indicesIndices${b}  = ${y.type.indices}(0);`;for(let I=0;I<E;I++)k+=`${E>1?`indicesIndices${b}[${I}]`:`indicesIndices${b}`} = ${s.length>1?`outputIndices${b}[uniforms.axis + ${I}]`:`outputIndices${b}`};`;k+=`
          var idx${b} = ${y.getByIndices(`indicesIndices${b}`)};
          if (idx${b} < 0) {
            idx${b} = idx${b} + uniforms.axisDimLimit;
          }
          var dataIndices${b} : ${_.type.indices};
        `;for(let I=0,z=0;I<a;I++)I===n?(k+=`${a>1?`dataIndices${b}[${I}]`:`dataIndices${b}`} = u32(idx${b});`,z+=E):(k+=`${a>1?`dataIndices${b}[${I}]`:`dataIndices${b}`} = ${s.length>1?`outputIndices${b}[${z}]`:`outputIndices${b}`};`,z++);return k},x;if(e[0].dataType===9){let b=(E,k,I="")=>`
          let outputIndices${k} = ${$.offsetToIndices(`outputOffset + ${k}u`)};
          ${S(k)};
          let offset${k} = ${_.indicesToOffset(`dataIndices${k}`)};
          let index${k} = offset${k} / 4u;
          let component${k} = offset${k} % 4u;
          ${E}[${k}] = ${I}(${_.getByOffset(`index${k}`)}[component${k}]);
        `;x=`
        let outputOffset = global_idx * ${l};
        var value = vec4<u32>(0);
        ${b("value",0,"u32")}
        ${b("value",1,"u32")}
        ${b("value",2,"u32")}
        ${b("value",3,"u32")}
        ${$.setByOffset("global_idx","value")}
      `}else x=`
      let outputIndices = ${$.offsetToIndices("global_idx")};
      ${S("")};
      let value = ${_.getByIndices("dataIndices")};
      ${$.setByOffset("global_idx","value")};
      `;return`
      ${g.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(_,y,$)}
      ${g.mainStart()}
        ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${x}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:f}),getShaderSource:h}},wh=e=>he({axis:e.axis}),$h=(e,t)=>{let r=e.inputs;hl(r),e.compute(fl(e.inputs,t))}}),ml,vh,xh,M0=P(()=>{"use strict";te(),ie(),ae(),ml=(e,t,r,i,a,n,s,u,l)=>{let p=[{type:12,data:n},{type:12,data:i},{type:12,data:a},{type:12,data:r},{type:12,data:s},{type:12,data:u},{type:12,data:l}],f=[n];p.push(...Z(t.dims,f));let h=g=>{let _=R("indices_data",t.dataType,t.dims.length),y=H("input_slice_offsets_data",12,1,1),$=[_,y],S=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:a.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${g.registerUniforms(S).declareVariables(...$)}
  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${a.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${a.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:f,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:p}),getShaderSource:h},{inputs:[t],outputs:[-1]})[0]},vh=(e,t)=>{let r=e.inputs,i=r[0].dims,a=r[0].dataType,n=r[1].dims,s=n[n.length-1],u=O.sizeToDimension(n,n.length-1),l=O.sizeFromDimension(i,t.batchDims+s),p=O.sizeToDimension(i,t.batchDims),f=O.sizeFromDimension(i,t.batchDims),h=u/p,g=new Array(s),_=l;for(let k=0;k<s;++k)g[s-1-k]=_,_*=i[t.batchDims+s-1-k];let y=ml(e,r[1],g,t.batchDims,i,u,h,f,s),$=t.batchDims+s;if($>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let S=n.slice(0,-1).concat(i.slice($)),x=O.size(S),b=[{type:12,data:x},{type:12,data:l},...Z(r[0].dims,y.dims,S)],E=k=>{let I=R("data",r[0].dataType,r[0].dims.length),z=R("slice_offsets",12,y.dims.length),A=H("output",r[0].dataType,S.length);return`
          ${k.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(I,z,A)}
            ${k.mainStart()}
            ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:S,dataType:a}],dispatchGroup:{x:Math.ceil(x/64)},programUniforms:b}),getShaderSource:E},{inputs:[r[0],y]})},xh=e=>({batchDims:e.batch_dims,cacheKey:""})}),gl,yl,Sh,kh,D0=P(()=>{"use strict";te(),ie(),Se(),ae(),gl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=O.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,a=e[0],n=e[2],s=e.length===4?e[3]:void 0;if(n.dims.length!==a.dims.length||!a.dims.map((u,l)=>l===r?Math.ceil(u/i)===n.dims[l]:u===n.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==a.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==n.dims.length||!s.dims.map((u,l)=>u===n.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},yl=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r.length,n=O.normalizeAxis(t.gatherAxis,a),s=O.normalizeAxis(t.quantizeAxis,a),u=r.slice(0);u.splice(n,1,...i);let l=O.size(u),p=e[2].dataType,f=e[0].dataType===22,h=[{type:12,data:l},{type:12,data:s},{type:12,data:n},{type:12,data:t.blockSize},...Z(...e.map((_,y)=>_.dims),u)],g=_=>{let y=R("data",e[0].dataType,e[0].dims.length),$=R("inputIndices",e[1].dataType,e[1].dims.length),S=R("scales",e[2].dataType,e[2].dims.length),x=e.length>3?R("zeroPoint",e[3].dataType,e[3].dims.length):void 0,b=H("output",p,u.length),E=[y,$,S];x&&E.push(x);let k=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${_.registerUniforms(k).declareVariables(...E,b)}
        ${_.mainStart()}
        let output_indices = ${b.offsetToIndices("global_idx")};
        var indices_indices = ${$.type.indices}(0);
        ${i.length>1?`
          for (var i: u32 = 0; i < ${i.length}; i++) {
            let index = ${b.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${$.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${b.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${y.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${b.indicesGet("output_indices","i")};
          ${y.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${$.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[n]};
        }
        ${y.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${b.indicesGet("output_indices",`i + ${i.length} - 1`)};
          ${y.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${y.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${y.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${f?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${S.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${S.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${S.getByIndices("scale_indices")};
        ${x?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${x.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${x.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${f?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${Ie(p)}(quantized_data - zero_point) * scale;
        ${b.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((_,y)=>y!==1).map(_=>_.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(_,y)=>"rank")},getRunData:()=>({outputs:[{dims:u,dataType:p}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:h}),getShaderSource:g}},Sh=(e,t)=>{let r=e.inputs;gl(r,t),e.compute(yl(e.inputs,t))},kh=e=>he({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),_l,bl,Th,Ih,U0=P(()=>{"use strict";te(),ie(),Se(),ae(),_l=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},bl=(e,t)=>{let r=e[0].dims,i=e[0].dataType,a=r.length,n=e[1].dims,s=e[1].dataType,u=O.normalizeAxis(t.axis,a),l=r[u],p=n.slice(0),f=O.size(p),h=R("input",i,a),g=R("indicesInput",s,n.length),_=H("output",i,p.length),y=[{type:12,data:f},{type:6,data:l},{type:12,data:u}];return y.push(...Z(r,n,p)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:p,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:y}),getShaderSource:$=>`
      ${$.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(h,g,_)}
      ${$.mainStart()}
      ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${_.offsetToIndices("global_idx")};

      var idx = ${g.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${h.type.indices}(outputIndices);
      ${h.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${h.getByIndices("inputIndices")};

      ${_.setByOffset("global_idx","value")};
  }`}},Th=e=>he({axis:e.axis}),Ih=(e,t)=>{let r=e.inputs;_l(r),e.compute(bl(e.inputs,t))}}),wl,$l,Eh,zh,P0=P(()=>{"use strict";te(),ie(),ae(),wl=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},$l=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[a,n,s]=xp.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),u=[a,n];if(!u)throw new Error("Can't use gemm on the given tensors");let l=16,p=Math.ceil(n/l),f=Math.ceil(a/l),h=!0,g=O.size(u),_=[{type:12,data:h?p:g},{type:12,data:a},{type:12,data:n},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],y=["type","type"];e.length===3&&(_.push(...Z(e[2].dims)),y.push("rank")),_.push(...Z(u));let $=x=>{let b="";t.transA&&t.transB?b="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?b="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?b="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(b="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let E=t.alpha===1?"":"value *= uniforms.alpha;",k=R("a",e[0].dataType,e[0].dims),I=R("b",e[1].dataType,e[1].dims),z=k.type.value,A=null,v=[k,I];e.length===3&&(A=R("c",e[2].dataType,e[2].dims.length),v.push(A));let D=H("output",e[0].dataType,u.length);v.push(D);let q=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${x.registerUniforms(q).declareVariables(...v)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${z}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${b}
    }

    ${E}
    ${A!=null?`let cOffset = ${A.broadcastedIndicesToOffset("vec2(m, n)",D)}; value += ${z}(uniforms.beta) * ${A.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},S=x=>{let b=R("a",e[0].dataType,e[0].dims),E=R("b",e[1].dataType,e[1].dims),k=null,I=[b,E];e.length===3&&(k=R("c",e[2].dataType,e[2].dims.length),I.push(k));let z=H("output",e[0].dataType,u.length);I.push(z);let A=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],v="",D="";t.transA&&t.transB?(D=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${E.type.value}(0);
      }
      `,v="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(D=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${E.type.value}(0);
      }
      `,v="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(D=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${E.type.value}(0);
      }
      `,v="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(D=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${E.type.value}(0);
      }
      `,v="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let q=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${x.registerUniforms(A).declareVariables(...I)}
  var<workgroup> tile_a: array<array<${b.type.storage}, ${l}>, ${l}>;
  var<workgroup> tile_b: array<array<${E.type.storage}, ${l}>, ${l}>;
  ${x.mainStart([l,l,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${l};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${l};
    let num_tiles = (uniforms.K - 1) / ${l} + 1;
    var k_start = 0u;
    var value = ${z.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${D}
      k_start = k_start + ${l};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${l}; k++) {
        ${v}
      }
      workgroupBarrier();
    }

    ${q}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${k!=null?`let cOffset = ${k.broadcastedIndicesToOffset("vec2(m, n)",z)}; value += ${z.type.value}(uniforms.beta) * ${k.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return h?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:p*f},programUniforms:_}),getShaderSource:S}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:_}),getShaderSource:$}},Eh=e=>{let t=e.transA,r=e.transB,i=e.alpha,a=e.beta;return{transA:t,transB:r,alpha:i,beta:a,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},zh=(e,t)=>{wl(e.inputs),e.compute($l(e.inputs,t))}}),Je,nt,St,kt,vl,xl,Sl,kl,Tl,Il,El,zl,Ch,Ah,q0=P(()=>{"use strict";te(),ie(),Se(),ae(),[Je,nt,St,kt]=[0,1,2,3],vl=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},xl=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,Sl=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,kl=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,Tl=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,Il=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${Je}] = batch;
     indices[${nt}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${St}] = u32(r);
            indices[${kt}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${St}] = u32(clamp(r, 0, H - 1));
          indices[${kt}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${St}] = gs_reflect(r, border[1], border[3]);
          indices[${kt}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,El=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${Je}], indices[${nt}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${Je}], indices[${nt}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${Je}], indices[${nt}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${Je}], indices[${nt}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${Je}], indices[${nt}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${Je}], indices[${nt}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,zl=(e,t)=>{let r=R("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],a=R("grid",e[1].dataType,i.length,2),n=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(n=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[Je,nt,St,kt]=[0,3,1,2]);let s=H("output",e[0].dataType,n.length),u=r.type.value,l=O.size(n),p=[{type:12,data:l},...Z(e[0].dims,i,n)],f=h=>`
  ${h.registerUniform("output_size","u32").declareVariables(r,a,s)}
  ${xl}
  ${Sl(u)}
  ${kl(t)}
  ${Tl(t)}
  ${Il(r,u,t)}

  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${St}]);
      let W_in = i32(uniforms.x_shape[${kt}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${s.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${Je}], indices[${St}], indices[${kt}]);
      let nxy = ${a.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${El(s,u,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:h=>{let g=O.size(n);return{outputs:[{dims:n,dataType:h[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:p}},getShaderSource:f}},Ch=(e,t)=>{vl(e.inputs),e.compute(zl(e.inputs,t))},Ah=e=>he({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Re,Cl,Oh,ia,Al,lr,Bh,Rh=P(()=>{"use strict";te(),ie(),Se(),Ka(),Qa(),ae(),bt(),Re=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Cl=(e,t)=>{let r=e[0],i=Re(e,1),a=Re(e,2),n=Re(e,3),s=Re(e,4),u=Re(e,5),l=Re(e,6),p=Re(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let f=r.dims[0],h=r.dims[1],g=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],_=h,y=0,$=0,S=Math.floor(g/t.numHeads);if(l&&p&&O.size(l.dims)&&O.size(p.dims)){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(l.dims[0]!==f||l.dims[1]!==t.numHeads||l.dims[3]!==S)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(p.dims[0]!==f||p.dims[1]!==t.numHeads||p.dims[3]!==S)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[2]!==p.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(p.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');y=l.dims[2],$=l.dims[2]}else if(l&&O.size(l.dims)||p&&O.size(p.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let x;if(i&&O.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');x=2,_=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==S)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');x=5,_=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==S)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');x=0,_=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');x=3}if(n&&O.size(n.dims)>0){if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let b=y+_,E=0;if(s&&O.size(s.dims)>0){E=8;let A=s.dims;throw A.length===1?A[0]===f?E=1:A[0]===3*f+2&&(E=3):A.length===2&&A[0]===f&&A[1]===b&&(E=5),E===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let k=!1,I=g;if(a&&O.size(a.dims)>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(_!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');I=a.dims[2]}else{if(_!==a.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');I=a.dims[1]*a.dims[3],k=!0}}let z=!1;if(s&&O.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(u&&O.size(u.dims)>0){if(u.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(u.dims[0]!==f||u.dims[1]!==t.numHeads||u.dims[2]!==h||u.dims[3]!==b)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:f,sequenceLength:h,pastSequenceLength:y,kvSequenceLength:_,totalSequenceLength:b,maxSequenceLength:$,inputHiddenSize:0,hiddenSize:g,vHiddenSize:I,headSize:S,vHeadSize:Math.floor(I/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:E,scale:t.scale,broadcastResPosBias:z,passPastInKv:k,qkvFormat:x}},Oh=e=>he({...e}),ia=he({perm:[0,2,1,3]}),Al=(e,t,r,i,a,n,s)=>{let u=[i,a,n],l=O.size(u),p=[{type:12,data:l},{type:12,data:s},{type:12,data:n}],f=h=>{let g=H("qkv_with_bias",t.dataType,u),_=R("qkv",t.dataType,u),y=R("bias",r.dataType,u),$=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${h.registerUniforms($).declareVariables(_,y,g)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:u,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:p}),getShaderSource:f},{inputs:[t,r],outputs:[-1]})[0]},lr=(e,t,r,i,a,n,s,u)=>{let l=n;if(s&&O.size(s.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return l=Al(e,n,s,t,i,r*a,u),l=l.reshape([t,i,r,a]),r===1||i===1?l:e.compute(De(l,ia.perm),{inputs:[l],outputs:[-1]})[0]}else return n.dims.length===3&&(l=n.reshape([t,i,r,a])),r===1||i===1?l:e.compute(De(l,ia.perm),{inputs:[l],outputs:[-1]})[0]},Bh=(e,t)=>{let r=Cl(e.inputs,t),i=e.inputs[0],a=Re(e.inputs,1),n=Re(e.inputs,2),s=Re(e.inputs,3),u=Re(e.inputs,4),l=Re(e.inputs,5),p=Re(e.inputs,6),f=Re(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if(a?.dims.length===5)throw new Error("Packed KV is not implemented");let h=a&&n&&a.dims.length===4&&n.dims.length===4,g=lr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,s,0);if(h)return cr(e,g,a,n,u,void 0,p,f,l,r);if(!a||!n)throw new Error("key and value must be provided");let _=lr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,a,s,r.hiddenSize),y=lr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,n,s,2*r.hiddenSize);cr(e,g,_,y,u,void 0,p,f,l,r)}}),Ol,Bl,Rl,Nl,Ra,Nh,Mh,Dh=P(()=>{"use strict";te(),ie(),Se(),ae(),Ol=e=>{if(!e||e.length<1)throw new Error("too few inputs")},Bl=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(a=>r.push(Number(a))),i=r.length),he({numOutputs:i,axis:t.axis,splitSizes:r})},Rl=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${K("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,Nl=e=>{let t=e.length,r=[];for(let i=0;i<t;++i){let a=e[i].setByIndices("indices","input[global_idx]");t===1?r.push(a):i===0?r.push(`if (output_number == ${i}u) { ${a} }`):i===t-1?r.push(`else { ${a} }`):r.push(`else if (output_number == ${i}) { ${a} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},Ra=(e,t)=>{let r=e[0].dims,i=O.size(r),a=e[0].dataType,n=O.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),u=R("input",a,r.length),l=new Array(t.numOutputs),p=[],f=[],h=0,g=[{type:12,data:i}];for(let y=0;y<t.numOutputs;y++){h+=t.splitSizes[y],l[y]=h;let $=r.slice();$[n]=t.splitSizes[y],f.push($),s[y]=H(`output${y}`,a,$.length),p.push({dims:f[y],dataType:e[0].dataType})}g.push({type:12,data:l},...Z(r,...f));let _=y=>`
  ${y.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",l.length).declareVariables(u,...s)}
  ${Rl(l.length)}
  ${Nl(s)}

  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",n)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${K("uniforms.size_in_split_axis","output_number - 1u",l.length)};
      ${u.indicesSet("indices",n,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:_,getRunData:()=>({outputs:p,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:g})}},Nh=(e,t)=>{Ol(e.inputs);let r=e.inputs.length===1?t:Bl(e.inputs,t);e.compute(Ra(e.inputs,r),{inputs:[0]})},Mh=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes length must be equal");return he({axis:t,numOutputs:i,splitSizes:r})}}),Ml,Kr,Uh,Ph=P(()=>{"use strict";te(),ie(),Se(),ae(),Ml=(e,t)=>{let[r,i,a,n]=e,{numHeads:s,rotaryEmbeddingDim:u}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!O.areEqual(i.dims,[])&&!O.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(!O.areEqual(a.dims,n.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let l=r.dims[0],p=r.dims[r.dims.length-2],f=a.dims[0],h=O.sizeFromDimension(r.dims,1)/p,g=u===0?a.dims[1]*2:h/s;if(u>g)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(l!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(p!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(p>f)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported");if(g/2!==a.dims[1]&&u/2!==a.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${a.dims[1]}`)},Kr=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:a,scale:n}=t,s=e[0].dims[0],u=O.sizeFromDimension(e[0].dims,1),l=e[0].dims[e[0].dims.length-2],p=u/l,f=e[2].dims[1],h=a===0?f*2:p/i,g=new Array(s,l,p/h,h-f),_=O.computeStrides(g),y=[{type:1,data:n},{type:12,data:g},{type:12,data:_},...e[0].dims.length===3?new Array({type:12,data:[u,p,h,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[u,h,l*h,1]}):[],...Z(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],$=S=>{let x=R("input",e[0].dataType,e[0].dims.length),b=R("position_ids",e[1].dataType,e[1].dims.length),E=R("cos_cache",e[2].dataType,e[2].dims.length),k=R("sin_cache",e[3].dataType,e[3].dims.length),I=H("output",e[0].dataType,e[0].dims.length);return S.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:g.length},{name:"global_strides",type:"u32",length:_.length},{name:"input_output_strides",type:"u32",length:_.length}]),`
        ${S.declareVariables(x,b,E,k,I)}

        ${S.mainStart(Gt)}
          let half_rotary_emb_dim = uniforms.${E.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${S.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${b.broadcastedIndicesToOffset("bsnh.xy",H("",b.type.tensor,2))};
            let position_id =
                u32(${b.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${x.getByOffset("i")} * ${E.get("position_id","bsnh[3]")} -
                ${x.getByOffset("j")} * ${k.get("position_id","bsnh[3]")};
            ${I.setByOffset("i","re")}
            let im = ${x.getByOffset("i")} * ${k.get("position_id","bsnh[3]")} +
                ${x.getByOffset("j")} * ${E.get("position_id","bsnh[3]")};
            ${I.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${I.setByOffset("k",x.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:he({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:$,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(O.size(g)/Gt)},programUniforms:y})}},Uh=(e,t)=>{Ml(e.inputs,t),e.compute(Kr(e.inputs,t))}}),Dl,Ul,aa,Pl,qh,L0=P(()=>{"use strict";Se(),te(),Qa(),Rh(),Dh(),bt(),Ph(),ae(),Dl=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],a=e[2],n=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let u=!1,l=r.dims[0],p=r.dims[1],f=r.dims.length===3?u?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],h=p,g=0,_=!i||i.dims.length===0,y=Math.floor(_?f/(t.numHeads+2*t.kvNumHeads):f/t.numHeads);_&&(f=y*t.numHeads);let $=n&&n.dims.length!==0,S=s&&s.dims.length!==0;if($&&n.dims.length===4&&n.dims[0]===l&&n.dims[1]!==t.kvNumHeads&&n.dims[2]===t.kvNumHeads&&n.dims[3]===y)throw new Error("BSNH pastKey/pastValue is not supported");if($&&S){if(n.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');g=n.dims[2]}else if($||S)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let x=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');h=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==y)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');h=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==y)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');h=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');x=3}let b=0,E=!1,k=t.kvNumHeads?y*t.kvNumHeads:f;if(a&&a.dims.length>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(h!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');k=a.dims[2]}else{if(h!==a.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');k=a.dims[1]*a.dims[3],E=!0}}let I=e.length>4?e[5]:void 0;if(I){if(I.dims.length===0)throw new Error("seqlens_k must be at least 1D, got scalar.");let z=I.dims.reduce((A,v)=>A*v,1);if(z!==l)throw new Error(`seqlens_k must have batch_size (${l}) elements, got ${z}.`);for(let A=0;A<I.dims.length;A++)if(I.dims[A]!==1&&I.dims[A]!==l)throw new Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${l}), got dims[${A}] = ${I.dims[A]}.`)}return{batchSize:l,sequenceLength:p,pastSequenceLength:g,kvSequenceLength:h,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:f,vHiddenSize:k,headSize:y,vHeadSize:Math.floor(k/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:E,qkvFormat:x}},Ul=he({perm:[0,2,1,3]}),aa=(e,t,r)=>{let i=t,a=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,a,r.headSize]),i=e.compute(De(i,Ul.perm),{inputs:[i],outputs:[-1]})[0]),i},Pl=(e,t,r,i)=>{let a=7,n=["type","type"],s=[e*t],u=e*t,l=[{type:12,data:u},{type:12,data:t},{type:12,data:e}],p=f=>{let h=R("seq_lens",r.dataType,r.dims),g=R("total_seq_lens",i.dataType,i.dims),_=H("pos_ids",a,s),y=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${f.registerUniforms(y).declareVariables(h,g,_)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${g.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${h.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${_.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${_.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${_.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:n},getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:p}},qh=(e,t)=>{if(e.inputs.length>14&&e.inputs[14]||e.inputs.length>15&&e.inputs[15])throw new Error("GroupQueryAttention (JSEP): q_norm_weight / k_norm_weight inputs are not supported. The per-head Q/K RMS normalization prologue is implemented only on the CUDA and native WebGPU EPs.");let r=Dl(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(e.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],a=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,n=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,u=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,l=e.inputs.length>4?e.inputs[5]:void 0,p=e.inputs.length>5?e.inputs[6]:void 0,f=r.kvNumHeads?r.kvNumHeads:r.numHeads,h=he({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,f*r.headSize,f*r.headSize]}),[g,_,y]=!a&&!n?e.compute(Ra([i],h),{inputs:[i],outputs:[-1,-1,-1]}):[i,a,n],$,S;if(t.doRotary){let k=e.compute(Pl(r.batchSize,r.sequenceLength,l,p),{inputs:[l,p],outputs:[-1]})[0],I=e.inputs[7],z=e.inputs[8],A=he({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),v=[g,k,I,z],D=[-1];$=e.compute(Kr(v,A),{inputs:v,outputs:D})[0],v.splice(0,1,_);let q=he({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});S=e.compute(Kr(v,q),{inputs:v,outputs:D})[0]}let x=lr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?$:g,void 0,0),b=aa(e,t.doRotary?S:_,r),E=aa(e,y,r);cr(e,x,b,E,void 0,void 0,s,u,void 0,r,l,p)}}),na,ql,Ll,Lh,W0=P(()=>{"use strict";te(),ie(),bt(),ae(),na=(e,t,r,i,a,n,s,u)=>{let l=xe(n),p=l===1?"f32":`vec${l}f`,f=l===1?"vec2f":`mat2x${l}f`,h=a*s,g=64;h===1&&(g=256);let _=[a,s,n/l],y=[a,s,2],$=["rank","type","type"],S=[];S.push(...Z(_,y));let x=b=>{let E=R("x",t.dataType,3,l),k=R("scale",r.dataType,r.dims),I=R("bias",i.dataType,i.dims),z=H("output",1,3,2),A=[E,k,I,z];return`
  var<workgroup> workgroup_shared : array<${f}, ${g}>;
  const workgroup_size = ${g}u;
  ${b.declareVariables(...A)}
  ${b.mainStart(g)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${p}(0);
    var squared_sum = ${p}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${p}(${E.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${f}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${_t("workgroup_shared[0][0]",l)} / f32(hight * ${l});
      let squared_sum_final = ${_t("workgroup_shared[0][1]",l)} / f32(hight * ${l});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${l};${u};${g}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:y,dataType:1}],dispatchGroup:{x:h},programUniforms:S}),getShaderSource:x},{inputs:[t,r,i],outputs:[-1]})[0]},ql=(e,t,r)=>{let i=t[0].dims,a=i,n=2,s=i[0],u=i[1],l=O.sizeFromDimension(i,n),p=xe(l),f=O.size(a)/p,h=na(e,t[0],t[1],t[2],s,l,u,r.epsilon),g=[s,u,l/p],_=[s,u],y=["type","none"],$=S=>{let x=R("x",t[0].dataType,g.length,p),b=R("scale_shift",1,_.length,2),E=H("output",t[0].dataType,g.length,p),k=[x,b,E];return`
  ${S.registerUniform("output_size","u32").declareVariables(...k)}
  ${S.mainStart()}
  ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${E.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${b.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${x.getByOffset("global_idx")} * ${E.type.value}(scale_shift.x) + ${E.type.value}(scale_shift.y);
      ${E.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${p}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},...Z(g,_,g)]}),getShaderSource:$},{inputs:[t[0],h]})},Ll=(e,t,r)=>{let i=t[0].dims,a=i,n=i[0],s=i[i.length-1],u=O.sizeFromDimension(i,1)/s,l=xe(s),p=O.size(a)/l,f=[{type:12,data:u},{type:12,data:Math.floor(s/l)}],h=["type","type"],g=!1,_=[0,i.length-1];for(let x=0;x<i.length-2;x++)g=g||i[x+1]!==1,_.push(x+1);g=g&&i[i.length-1]!==1;let y=g?e.compute(De(e.inputs[0],_),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},(x,b)=>i[_[b]])),$=na(e,y,t[1],t[2],n,u,s,r.epsilon),S=x=>{let b=Ee(t[0].dataType),E=l===1?"vec2f":`mat${l}x2f`,k=A=>{let v=A===0?"x":"y",D=l===1?"f32":`vec${l}f`;switch(l){case 1:return`${b}(${D}(scale.${v}))`;case 2:return`vec2<${b}>(${D}(scale[0].${v}, scale[1].${v}))`;case 4:return`vec4<${b}>(${D}(scale[0].${v}, scale[1].${v}, scale[2].${v}, scale[3].${v}))`;default:throw new Error(`Not supported compoents ${l}`)}},I=R("input",t[0].dataType,t[0].dims,l),z=H("output",t[0].dataType,a,l);return`
  @group(0) @binding(0) var<storage, read> input : array<${I.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${E}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${z.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${x.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${k(0)}, ${k(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${l}`,inputDependencies:h},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:f}),getShaderSource:S},{inputs:[t[0],$]})},Lh=(e,t)=>{t.format==="NHWC"?Ll(e,e.inputs,t):ql(e,e.inputs,t)}}),Wl,Vl,Wh,V0=P(()=>{"use strict";te(),ie(),ae(),Wl=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},Vl=(e,t,r)=>{let i=t.simplified,a=e[0].dims,n=e[1],s=!i&&e[2],u=a,l=O.normalizeAxis(t.axis,a.length),p=O.sizeToDimension(a,l),f=O.sizeFromDimension(a,l),h=O.size(n.dims),g=s?O.size(s.dims):0;if(h!==f||s&&g!==f)throw new Error(`Size of X.shape()[axis:] == ${f}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${h} and bias size of ${g}`);let _=[];for(let I=0;I<a.length;++I)I<l?_.push(a[I]):_.push(1);let y=xe(f),$=["type","type"],S=[{type:12,data:p},{type:1,data:f},{type:12,data:Math.floor(f/y)},{type:1,data:t.epsilon}];s&&$.push("type");let x=r>1,b=r>2,E=I=>{let z=Ee(e[0].dataType),A=[R("x",e[0].dataType,e[0].dims,y),R("scale",n.dataType,n.dims,y)];s&&A.push(R("bias",s.dataType,s.dims,y)),A.push(H("output",e[0].dataType,u,y)),x&&A.push(H("mean_data_output",1,_)),b&&A.push(H("inv_std_output",1,_));let v=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${I.registerUniforms(v).declareVariables(...A)}
  ${I.mainStart()}
    ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${ka("f32",y)};
    var mean_square_vector = ${ka("f32",y)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Wt(z,y,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${_t("mean_vector",y)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${_t("mean_square_vector",y)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Wt(z,y,"x[j + offset]")};
      let f32scale = ${Wt(z,y,"scale[j]")};
      output[j + offset] = ${A[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${Wt(z,y,"bias[j]")}`:""}
      );
    }

    ${x?"mean_data_output[global_idx] = mean":""};
    ${b?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},k=[{dims:u,dataType:e[0].dataType}];return x&&k.push({dims:_,dataType:1}),b&&k.push({dims:_,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${y};${r};${i}`,inputDependencies:$},getRunData:()=>({outputs:k,dispatchGroup:{x:Math.ceil(p/64)},programUniforms:S}),getShaderSource:E}},Wh=(e,t)=>{Wl(e.inputs),e.compute(Vl(e.inputs,t,e.outputCount))}}),Gl,Vh,G0=P(()=>{"use strict";ie(),rn(),an(),Gl=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},Vh=e=>{Gl(e.inputs);let t=Vt.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(tn(e.inputs,{activation:""},t));else{let a=t[t.length-2],n=O.size(e.inputs[0].dims.slice(0,-2)),s=O.size(e.inputs[1].dims.slice(0,-2));if(n!==1&&a===1&&s===1){let u=e.inputs[0].reshape([1,n,i]),l=e.inputs[1].reshape([1,i,r]),p=[1,n,r],f=[u,l];e.compute(jr(f,{activation:""},t,p),{inputs:f})}else e.compute(jr(e.inputs,{activation:""},t))}}}),Hl,Fl,jl,Gh,Hh,H0=P(()=>{"use strict";te(),ie(),Se(),ae(),Hl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let a=Math.floor((t.k+t.blockSize-1)/t.blockSize),n=t.blockSize/8*t.bits,s=e[1];if(!O.areEqual(s.dims,[t.n,a,n]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=e[2].dims;if(O.size(u)!==t.n*a)throw new Error("scales input size error.");if(e.length===4){let l=e[3].dims,p=t.n*(t.bits===8?a:Math.floor((a*t.bits+7)/8));if(O.size(l)!==p)throw new Error("zeroPoints input size error.")}},Fl=(e,t)=>{let r=e[0].dims,i=r.length,a=r[i-2],n=t.k,s=t.n,u=r.slice(0,i-2),l=O.size(u),p=e[1].dims[2]/4,f=e[0].dataType,h=xe(t.k),g=xe(p),_=xe(s),y=u.concat([a,s]),$=a>1&&s/_%2===0?2:1,S=O.size(y)/_/$,x=64,b=[],E=[l,a,n/h],k=O.convertShape(e[1].dims).slice();k.splice(-1,1,p/g),b.push(...Z(E)),b.push(...Z(k)),b.push(...Z(e[2].dims)),e.length===4&&b.push(...Z(O.convertShape(e[3].dims)));let I=[l,a,s/_];b.push(...Z(I));let z=A=>{let v=E.length,D=R("a",e[0].dataType,v,h),q=R("b",12,k.length,g),Q=R("scales",e[2].dataType,e[2].dims.length),F=[D,q,Q],j=e.length===4?R("zero_points",12,e[3].dims.length):void 0;j&&F.push(j);let B=I.length,M=H("output",e[0].dataType,B,_),G=Ee(e[0].dataType),J=(()=>{switch(h){case 1:return`array<${G}, 8>`;case 2:return`mat4x2<${G}>`;case 4:return`mat2x4<${G}>`;default:throw new Error(`${h}-component is not supported.`)}})(),ee=Math.floor(32/t.bits),re=Math.floor(ee/8),ne=()=>{let X="";for(let V=0;V<re;V++){let Te=V*t.bits*4,Ae=Te+t.bits;X+=`
          // reuse a data (pass ${V})
            var input_offset${V>0?V:""} = ${V===0?D.indicesToOffset(`${D.type.indices}(batch, row, word_offset)`):"input_offset"};
            var a_data${V>0?V:""}: ${J};
            for (var j${V>0?V:""}: u32 = 0; j${V>0?V:""} < ${8/h}; j${V>0?V:""}++) {
              a_data${V>0?V:""}[j${V>0?V:""}] = ${D.getByOffset(`input_offset${V>0?V:""}`)};
              input_offset${V>0?V:""}++;
            }
          `;for(let ve=0;ve<_*$;ve++)X+=`
            b_value = ${g===1?`b${ve}_data`:`b${ve}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${V*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${Te}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${Ae}u) & b_mask);`}
            b_quantized_values = ${J}(${Array.from({length:4},(Oe,me)=>`${G}(b_value_lower[${me}]), ${G}(b_value_upper[${me}])`).join(", ")});
            b_dequantized_values = ${h===1?`${J}(${Array.from({length:8},(Oe,me)=>`(b_quantized_values[${me}] - ${j?`zero_point${ve}`:"zero_point"}) * scale${ve}`).join(", ")});`:`(b_quantized_values - ${J}(${Array(8).fill(`${j?`zero_point${ve}`:"zero_point"}`).join(",")})) * scale${ve};`};
            workgroup_shared[local_id.x * ${$} + ${Math.floor(ve/_)}]${_>1?`[${ve%_}]`:""} += ${Array.from({length:8/h},(Oe,me)=>`${h===1?`a_data${V>0?V:""}[${me}] * b_dequantized_values[${me}]`:`dot(a_data${V>0?V:""}[${me}], b_dequantized_values[${me}])`}`).join(" + ")};
          `}return X},U=()=>{let X=`
            var col_index = col * ${_};
            ${j?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${G}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            `;for(let V=0;V<_*$;V++)X+=`
            let scale${V} = ${Q.getByOffset("col_index * nBlocksPerCol + block")};
            ${j?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${j.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${V} = ${G}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:""}
            col_index += 1;`;return X},Y=()=>{let X=`col_index = col * ${_};`;for(let V=0;V<_*$;V++)X+=`
            let b${V}_data = ${q.getByIndices(`${q.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return X+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?"0x03030303u":"0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${J};
            var b_dequantized_values: ${J};`,X};return`
        var<workgroup> workgroup_shared: array<${M.type.value}, ${$*x}>;
        ${A.declareVariables(...F,M)}
        ${A.mainStart([x,1,1])}
          let output_indices = ${M.offsetToIndices(`(global_idx / ${x}) * ${$}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${x}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/h};
            ${U()}
            for (var word: u32 = 0; word < ${p}; word += ${g}) {
              ${Y()}
              for (var i: u32 = 0; i < ${g}; i++) {
                ${ne()}
                word_offset += ${ee/h};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${$}) {
            var output_value: ${M.type.value} = ${M.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${x}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${$};
            }
            ${M.setByIndices(`${M.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${h};${g};${_};${$};${x}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:y,dataType:f}],dispatchGroup:{x:S},programUniforms:b}),getShaderSource:z}},jl=(e,t)=>{let r=e[0].dims,i=r.length,a=r[i-2],n=t.k,s=t.n,u=r.slice(0,i-2),l=O.size(u),p=e[1].dims[2]/4,f=e[0].dataType,h=xe(t.k),g=xe(p),_=u.concat([a,s]),y=128,$=s%8===0?8:s%4===0?4:1,S=y/$,x=Math.floor(32/t.bits),b=S*g*x,E=b/h,k=b/t.blockSize,I=O.size(_)/$,z=[],A=[l,a,n/h],v=O.convertShape(e[1].dims).slice();v.splice(-1,1,p/g),z.push(...Z(A)),z.push(...Z(v)),z.push(...Z(e[2].dims)),e.length===4&&z.push(...Z(O.convertShape(e[3].dims)));let D=[l,a,s];z.push(...Z(D));let q=Q=>{let F=A.length,j=R("a",e[0].dataType,F,h),B=R("b",12,v.length,g),M=R("scales",e[2].dataType,e[2].dims.length),G=[j,B,M],J=e.length===4?R("zero_points",12,e[3].dims.length):void 0;J&&G.push(J);let ee=D.length,re=H("output",e[0].dataType,ee),ne=Ee(e[0].dataType),U=()=>{switch(h){case 1:return`
          let a_data0 = vec4<${ne}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${ne}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${ne}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${ne}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${h}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${j.type.value}, ${E}>;
        var<workgroup> inter_results: array<array<${re.type.value}, ${S}>, ${$}>;
        ${Q.declareVariables(...G,re)}
        ${Q.mainStart([S,$,1])}
          let output_indices = ${re.offsetToIndices(`workgroup_index * ${$}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${k} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${E};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${E}; a_offset += ${y})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${j.getByIndices(`${j.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${j.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${k} + local_id.x;
            ${J?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${J.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${ne}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${ne}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            let scale = ${M.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${B.getByIndices(`${B.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/h};
            for (var i: u32 = 0; i < ${g}; i++) {
              let b_value = ${g===1?"b_data":"b_data[i]"};
              ${(()=>{let Y=Math.floor(x/8),X="";for(let V=0;V<Y;V++){let Te=V*t.bits*4,Ae=Te+t.bits;X+=`
              ${U()}
              {${t.bits===2?`
                let half_word = b_value >> ${V*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${Te}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${Ae}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${ne}>(${Array.from({length:4},(ve,Oe)=>`${ne}(b_value_lower[${Oe}]), ${ne}(b_value_upper[${Oe}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${ne}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(ve,Oe)=>`${`dot(a_data${Oe}, b_dequantized_values[${Oe}])`}`).join(" + ")};
              }
              word_offset += ${8/h};`}return X})()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${$}) {
            var output_value: ${re.type.value} = ${re.type.value}(0);
            for (var b = 0u; b < ${S}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${re.setByIndices(`${re.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${h};${g};${S};${$}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:f}],dispatchGroup:{x:I},programUniforms:z}),getShaderSource:q}},Gh=(e,t)=>{Hl(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(jl(e.inputs,t)):e.compute(Fl(e.inputs,t))},Hh=e=>he(e)}),Kl,Zl,Xl,Ql,Yl,Jl,ed,td,Fh,F0=P(()=>{"use strict";te(),ie(),ae(),Kl=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Zl=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
            k = i32(${e.indicesGet("indices",a)}) - ${K("uniforms.pads",a,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${K("uniforms.x_shape",a,t)})) {
              break;
            }
            offset += k * i32(${K("uniforms.x_strides",a,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${i}
            value = x[offset];
          }
      `},Xl=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${K("uniforms.pads",a,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${K("uniforms.x_shape",a,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${K("uniforms.x_shape",a,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${K("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Ql=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${K("uniforms.pads",a,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${K("uniforms.x_shape",a,t)})) {
                  k = i32(${K("uniforms.x_shape",a,t)}) - 1;
                }
                offset += k * i32(${K("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Yl=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${K("uniforms.pads",a,r)};
                if (k < 0)  {
                  k += i32(${K("uniforms.x_shape",a,t)}]);
                }
                if (k >= i32(${K("uniforms.x_shape",a,t)})) {
                  k -= i32(${K("uniforms.x_shape",a,t)});
                }
                offset += k * i32(${K("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Jl=(e,t,r)=>{switch(r.mode){case 0:return Zl(e,t,r.pads.length);case 1:return Xl(e,t,r.pads.length);case 2:return Ql(e,t,r.pads.length);case 3:return Yl(e,t,r.pads.length);default:throw new Error("Invalid mode")}},ed=(e,t)=>{let r=O.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,a=O.size(r),n=[{type:12,data:a},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&n.push({type:s?e[2].dataType:1,data:t.value}),n.push(...Z(e[0].dims,r));let u=["rank"],l=p=>{let f=H("output",e[0].dataType,r.length),h=R("x",e[0].dataType,i.length),g=h.type.value,_=Jl(f,i.length,t),y=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&y.push({name:"constant_value",type:s?g:"f32"}),`
            ${p.registerUniforms(y).declareVariables(h,f)}
            ${p.mainStart()}
            ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${f.offsetToIndices("global_idx")};

            var value = ${g}(0);
            ${_}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(O.size(r)/64)},programUniforms:n}),getShaderSource:l}},td=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,a=e[0].dims.length,n=new Int32Array(2*a).fill(0);if(e.length>=4){let u=e[3].getBigInt64Array();for(let l=0;l<u.length;l++)n[Number(u[l])]=Number(r[l]),n[Number(u[l])+a]=Number(r[l+u.length])}else r.forEach((u,l)=>n[Number(l)]=Number(u));let s=[];return n.forEach(u=>s.push(u)),{mode:t.mode,value:i,pads:s}}else return t},Fh=(e,t)=>{Kl(e.inputs);let r=td(e.inputs,t);e.compute(ed(e.inputs,r),{inputs:[0]})}}),ir,sa,oa,ua,la,rd,id,da,pa,jh,Kh,ca,Zh,Xh,ha,Qh,Yh,Jh,ef,j0=P(()=>{"use strict";qe(),te(),ie(),ae(),ir=e=>{if($e.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},sa=(e,t,r)=>{let i=t.format==="NHWC",a=e.dims.slice();i&&a.splice(1,0,a.pop());let n=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),u=t.strides.slice(),l=n?t.dilations.slice():[],p=t.pads.slice();Hr.adjustPoolAttributes(r,a,s,u,l,p);let f=Hr.computePoolOutputShape(r,a,u,l,s,p,t.autoPad,t.ceilMode),h=Object.assign({},t);n?Object.assign(h,{kernelShape:s,strides:u,pads:p,dilations:l,cacheKey:t.cacheKey}):Object.assign(h,{kernelShape:s,strides:u,pads:p,cacheKey:t.cacheKey});let g=f.slice();return g.push(g.splice(1,1)[0]),[h,i?g:f]},oa=(e,t)=>{let r=t.format==="NHWC",i=O.size(e),a=O.size(t.kernelShape),n=[{type:12,data:i},{type:12,data:a}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let u=t.kernelShape[t.kernelShape.length-1],l=t.strides[t.strides.length-1],p=t.pads[t.pads.length/2-1],f=t.pads[t.pads.length-1],h=!!(p+f);n.push({type:12,data:u},{type:12,data:l},{type:12,data:p},{type:12,data:f}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let g=!1;if(t.kernelShape.length===2){let _=t.kernelShape[t.kernelShape.length-2],y=t.strides[t.strides.length-2],$=t.pads[t.pads.length/2-2],S=t.pads[t.pads.length-2];g=!!($+S),n.push({type:12,data:_},{type:12,data:y},{type:12,data:$},{type:12,data:S}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[n,s,!0,h,g]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let u=O.computeStrides(t.kernelShape);n.push({type:12,data:u},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:u.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let l=t.pads.reduce((p,f)=>p+f);return[n,s,!!l,!1,!1]}},ua=(e,t,r,i,a,n,s,u,l,p,f,h)=>{let g=a.format==="NHWC",_=t.type.value,y=H("output",t.type.tensor,i);if(a.kernelShape.length<=2){let $="",S="",x="",b=r-(g?2:1);if(f?$=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${b}] < 0 || xIndices[${b}]
                      >= uniforms.x_shape[${b}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${n}
                }`:$=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${n}
                }`,a.kernelShape.length===2){let E=r-(g?3:2);h?S=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${E}] = indices[${E}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${E}] < 0 || xIndices[${E}] >= uniforms.x_shape[${E}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:S=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${E}] = indices[${E}] * uniforms.sh - uniforms.phStart + j;
                `,x=`
              }
            `}return`
            ${e.registerUniforms(l).declareVariables(t,y)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${y.offsetToIndices("global_idx")};
              var xIndices = ${y.offsetToIndices("global_idx")};

              var value = ${_}(${u});
              var pad = 0;
              ${S}
              ${$}
              ${x}
              ${s}

              output[global_idx] = value;
            }`}else{if(g)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let $=a.kernelShape.length,S=a.pads.length,x="";return p?x=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${n}
              }`:x=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${n}
            `,`
            ${e.registerUniforms(l).declareVariables(t,y)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${y.offsetToIndices("global_idx")};
              var xIndices = ${y.offsetToIndices("global_idx")};

              var offsets: array<u32, ${$}>;

              var value = ${_}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${$-1}u; j++) {
                  offsets[j] = offset / ${K("uniforms.kernelStrides","j",$)};
                  offset -= offsets[j] * ${K("uniforms.kernelStrides","j",$)};
                }
                offsets[${$-1}] = offset;

                isPad = false;
                for (var j = ${r-$}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${K("uniforms.strides",`j - ${r-$}u`,$)}
                    + offsets[j - ${r-$}u] - ${K("uniforms.pads","j - 2u",S)};
                  ${x}
              }
              ${s}

              output[global_idx] = value;
            }`}},la=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,rd=e=>`${la(e)};${e.countIncludePad}`,id=e=>`${la(e)};${e.storageOrder};${e.dilations}`,da=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),pa=(e,t,r,i)=>{let[a,n]=sa(t,i,r),s=R("x",t.dataType,t.dims.length),u=s.type.value,l="value += x_val;",p="";a.countIncludePad?p+=`value /= ${u}(uniforms.kernelSize);`:p+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[f,h,g,_,y]=oa(n,a);f.push(...Z(t.dims,n));let $=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${g};${_};${y}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:n,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(O.size(n)/64)},programUniforms:f}),getShaderSource:S=>ua(S,s,t.dims.length,n.length,a,l,p,0,h,g,_,y)}},jh=e=>{let t=e.count_include_pad!==0,r=da(e);if(r.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding/divisor) is not yet implemented in the WebGPU AveragePool kernel");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:rd(i)}},Kh=(e,t)=>{ir(e.inputs),e.compute(pa("AveragePool",e.inputs[0],!1,t))},ca={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},Zh=e=>{let t=e.format;return{format:t,...ca,cacheKey:t}},Xh=(e,t)=>{ir(e.inputs),e.compute(pa("GlobalAveragePool",e.inputs[0],!0,t))},ha=(e,t,r,i)=>{let[a,n]=sa(t,i,r),s=`
      value = max(x_val, value);
    `,u="",l=R("x",t.dataType,t.dims.length),p=["rank"],[f,h,g,_,y]=oa(n,a);return f.push(...Z(t.dims,n)),{name:e,shaderCache:{hint:`${i.cacheKey};${g};${_};${y}`,inputDependencies:p},getRunData:()=>({outputs:[{dims:n,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(O.size(n)/64)},programUniforms:f}),getShaderSource:$=>ua($,l,t.dims.length,n.length,a,s,u,t.dataType===10?-65504:-1e5,h,g,_,y)}},Qh=(e,t)=>{ir(e.inputs),e.compute(ha("MaxPool",e.inputs[0],!1,t))},Yh=e=>{let t=e.storage_order,r=e.dilations,i=da(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding) is not yet implemented in the WebGPU MaxPool kernel");let a={storageOrder:t,dilations:r,...i,cacheKey:""};return{...a,cacheKey:id(a)}},Jh=e=>{let t=e.format;return{format:t,...ca,cacheKey:t}},ef=(e,t)=>{ir(e.inputs),e.compute(ha("GlobalMaxPool",e.inputs[0],!0,t))}}),ad,nd,tf,rf,K0=P(()=>{"use strict";te(),ie(),Se(),ae(),ad=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((a,n)=>n===t.axis||a===e[0].dims[n]).reduce((a,n)=>a&&n,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},nd=(e,t)=>{let r=O.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,a=i===3,n=e[0].dims,s=e[1].dataType,u=O.size(n),l=i===3||i===2,p=l?[Math.ceil(O.size(e[0].dims)/4)]:e[0].dims,f=e[1].dims,h=e.length>2?e[2]:void 0,g=h?l?[Math.ceil(O.size(h.dims)/4)]:h.dims:void 0,_=f.length===0||f.length===1&&f[0]===1,y=_===!1&&f.length===1,$=xe(u),S=_&&(!l||$===4),x=S?$:1,b=S&&!l?$:1,E=R("input",l?12:i,p.length,b),k=R("scale",s,f.length),I=h?R("zero_point",l?12:i,g.length):void 0,z=H("output",s,n.length,x),A=[E,k];I&&A.push(I);let v=[p,f];h&&v.push(g);let D=[{type:12,data:u/x},{type:12,data:r},{type:12,data:t.blockSize},...Z(...v,n)],q=Q=>{let F=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${Q.registerUniforms(F).declareVariables(...A,z)}
      ${Q.mainStart()}
          ${Q.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${z.offsetToIndices("global_idx")};

          // Set input x
          ${l?`
            let input = ${E.getByOffset("global_idx / 4")};
            let x_vec = ${a?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${x===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${E.getByOffset("global_idx")};`};

          // Set scale input
          ${_?`let scale_value= ${k.getByOffset("0")}`:y?`
            let scale_index = ${z.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${k.getByOffset("scale_index")};`:`
            var scale_indices: ${k.type.indices} = output_indices;
            let index = ${k.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${k.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${k.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${I?_?l?`
                let zero_point_input = ${I.getByOffset("0")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${I.getByOffset("0")}`:y?l?`
                let zero_point_index = ${z.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${I.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${z.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${I.getByOffset("zero_point_index")};`:l?`
                let zero_point_offset = ${k.indicesToOffset("scale_indices")};
                let zero_point_input = ${I.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${I.getByIndices("scale_indices")};`:`let zero_point_value = ${l?a?"i32":"u32":E.type.value}(0);`};
      // Compute and write output
      ${z.setByOffset("global_idx",`${z.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:I?["rank","rank","rank"]:["rank","rank"]},getShaderSource:q,getRunData:()=>({outputs:[{dims:n,dataType:s}],dispatchGroup:{x:Math.ceil(u/x/64),y:1,z:1},programUniforms:D})}},tf=(e,t)=>{ad(e.inputs,t),e.compute(nd(e.inputs,t))},rf=e=>he({axis:e.axis,blockSize:e.blockSize})}),sd,od,af,Z0=P(()=>{"use strict";qe(),te(),ae(),sd=(e,t,r)=>{let i=e===t,a=e<t&&r<0,n=e>t&&r>0;if(i||a||n)throw new Error("Range these inputs' contents are invalid.")},od=(e,t,r,i)=>{let a=Math.abs(Math.ceil((t-e)/r)),n=[a],s=a,u=[{type:12,data:s},{type:i,data:e},{type:i,data:r},...Z(n)],l=p=>{let f=H("output",i,n.length),h=f.type.value,g=[{name:"outputSize",type:"u32"},{name:"start",type:h},{name:"delta",type:h}];return`
        ${p.registerUniforms(g).declareVariables(f)}
        ${p.mainStart()}
        ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${h}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:l,getRunData:()=>({outputs:[{dims:n,dataType:i}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:u})}},af=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),$e.webgpu.validateInputContent&&sd(t,r,i),e.compute(od(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),ud,ld,nf,sf,X0=P(()=>{"use strict";te(),ie(),Se(),ae(),ud=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let a=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,n=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return i==="i32"||i==="u32"?`atomicAdd(&${t}, bitcast<${i}>(${r}));`:`
              ${a}bitcast<${i}>(oldValue) + (${r})${n}`;case"max":return i==="i32"||i==="u32"?`atomicMax(&${t}, bitcast<${i}>(${r}));`:`
                ${a}max(bitcast<f32>(oldValue), (${r}))${n}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${a}min(bitcast<${i}>(oldValue), (${r}))${n}`;case"mul":return`${a}(bitcast<${i}>(oldValue) * (${r}))${n}`;default:throw new Error(`Reduction ${e} is not supported.`)}},ld=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r,n=1,s=Math.ceil(O.sizeToDimension(i,i.length-1)/n),u=i[i.length-1],l=O.sizeFromDimension(r,u),p=[{type:12,data:s},{type:12,data:u},{type:12,data:l},...Z(e[1].dims,e[2].dims,a)],f=h=>{let g=R("indices",e[1].dataType,e[1].dims.length),_=R("updates",e[2].dataType,e[2].dims.length,n),y=t.reduction!=="none"&&t.reduction!==""?Cp("output",e[0].dataType,a.length):H("output",e[0].dataType,a.length,n);return`
      ${h.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(g,_,y)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${ud(t.reduction,"output[data_offset + i]","value",y.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:p}),getShaderSource:f}},nf=e=>he({reduction:e.reduction}),sf=(e,t)=>{e.compute(ld(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),dd,pd,cd,fa,hd,fd,md,gd,yd,_d,bd,wd,ma,$d,vd,xd,Sd,kd,of,uf,Q0=P(()=>{"use strict";te(),ie(),Se(),ae(),dd=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},pd=(e,t,r)=>{t.every(a=>a>=0&&a<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((a,n)=>i[a]=e[n]),i},cd=(e,t,r,i,a,n)=>{let[s,u,l]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],p=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(f=>n.push(f));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0){if(e[u].getFloat32Array().forEach(f=>i.push(f)),i.length!==0&&i.length!==p&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");dd(i,t),t.axes.length>0&&pd(i,t.axes,p).forEach((f,h)=>i[h]=f)}if(l>0&&e.length>l&&e[l].dims.length===1&&e[l].dims[0]>0&&(e[l].getBigInt64Array().forEach(f=>a.push(Number(f))),a.length!==0&&a.length!==p&&r>=18&&a.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(a.length!==0&&a.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof a<"u"&&i.length>0&&a.length>p)throw new Error("Resize requires only of scales or sizes to be specified")},fa=(e,t,r,i)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${i}(big / (${r}));
  let fract = ${i}(big % (${r})) / ${i}(${r});
  return whole + fract;
`,hd=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${fa("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${fa("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",fd=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",md=(e,t,r)=>{let i=new Array(r).fill(0).concat(new Array(r).fill(1)),a=e.length===0?i:e.slice();return t.length>0?(t.forEach((n,s)=>{i[n]=a[s],i[s+r]=a[t.length+s]}),i):a},gd=(e,t,r,i)=>{let a=[];if(r.length>0)if(i.length>0){if(e.forEach(n=>a.push(n)),Math.max(...i)>e.length)throw new Error("axes is out of bound");i.forEach((n,s)=>a[n]=r[s])}else r.forEach(n=>a.push(n));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");a=e.map((n,s)=>Math.round(n*t[s]))}return a},yd=(e,t,r)=>{let i=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(n=>t[n]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(n=>t[n]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let a=e.slice();return r.axes.length>0?(r.axes.forEach(n=>t[n]=i),r.axes.forEach(n=>a[n]=Math.round(e[n]*t[n]))):(t.fill(i,0,t.length),a.forEach((n,s)=>a[s]=Math.round(n*t[s]))),a},_d=(e,t,r,i,a)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${K("uniforms.scales","i",i)};
        var roi_low = ${K("uniforms.roi","i",a)};
        var roi_hi = ${K("uniforms.roi",`i + ${t.length}`,a)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${K("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${K("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,bd=(e,t,r,i,a,n,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${K("uniforms.scales","i",a)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${K("uniforms.roi","i",n)};
          var roi_hi = ${K("uniforms.roi",`i + ${r.length}`,n)};
          var input_shape_i = ${K("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${K("uniforms.output_shape","i",i.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${s} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,wd=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${K("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,ma=(e,t,r,i)=>e.rank>i?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",$d=(e,t,r,i,a)=>{let[n,s,u,l]=r.length===2?[-1,0,1,-1]:[0,2,3,1],p=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${p} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(col, ${r[u]} - 1))`)};
      ${ma(e,l,n,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${p} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${p} = originalIndices[${s}];
      var col:${p} = originalIndices[${u}];
      ${i?`if (row < 0 || row > (${r[s]} - 1) || col < 0 || col > (${r[u]} - 1)) {
        return ${a};
      }`:""};
      row = max(0, min(row, ${r[s]} - 1));
      col = max(0, min(col, ${r[u]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${n}])`:"0"};
      var x11: ${p} = getInputValue(batch, channel, row1, col1);
      var x12: ${p} = getInputValue(batch, channel, row1, col2);
      var x21: ${p} = getInputValue(batch, channel, row2, col1);
      var x22: ${p} = getInputValue(batch, channel, row2, col2);
      var dx1: ${p} = abs(row - ${p}(row1));
      var dx2: ${p} = abs(${p}(row2) - row);
      var dy1: ${p} = abs(col - ${p}(col1));
      var dy2: ${p} = abs(${p}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},vd=(e,t,r,i,a,n,s,u,l,p)=>{let f=r.length===2,h=!0,[g,_]=f?[0,1]:h?[2,3]:[1,2],y=e.type.value,$=S=>{let x=S===g?"row":"col";return`
      fn ${x}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${y} {
        var output_index = ${t.indicesGet("output_indices",S)};
        var originalIdx: ${y} = getOriginalCoordinateFromResizedCoordinate(output_index, ${a[S]},
        ${i[S]}, ${r[S]}, ${n[S]}, ${n[S]} + ${r.length});
        var fractOriginalIdx: ${y} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${r[S]} - 1))) {
          return ${l};
        }
        var data: array<${y}, 4> = array<${y}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${x}: ${y} = originalIdx + ${y}(i);
          if (${x} < 0 || ${x} >= ${r[S]}) {
            ${p?`coefs[i + 1] = 0.0;
                        continue;`:u?`return ${l};`:`${x} = max(0, min(${x}, ${r[S]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",S,`u32(${x})`)};
          data[i + 1] = ${S===g?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${$(g)};
    ${$(_)};
  fn getCubicInterpolationCoefs(s: ${y}) -> array<${y}, 4> {
    var absS = abs(s);
    var coeffs: array<${y}, 4> = array<${y}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${y} = 1.0 - absS;
    var twoMinusAbsS: ${y} = 2.0 - absS;
    var onePlusAbsS: ${y} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${y}, 4>, coefs: array<${y}, 4>) -> ${y} {
    var coefsSum: ${y} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${y} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},xd=(e,t,r,i,a)=>{let[n,s,u,l,p]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],f=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${f} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(height, ${r[u]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(width, ${r[l]} - 1))`)};
      ${ma(e,p,n,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${f} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${f} = originalIndices[${s}];
      var height:${f} = originalIndices[${u}];
      var width:${f} = originalIndices[${l}];
      ${i?`if (depth < 0 || depth > (${r[s]} - 1) || height < 0 || height > (${r[u]} - 1) || width < 0 || (width > ${r[l]} - 1)) {
      return ${a};
        }`:""};

    depth = max(0, min(depth, ${r[s]} - 1));
      height = max(0, min(height, ${r[u]} - 1));
      width = max(0, min(width, ${r[l]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${p}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${n}])`:"0"};

      var x111: ${f} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${f} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${f} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${f} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${f} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${f} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${f} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${f} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${f} = abs(depth - ${f}(depth1));
      var dx2: ${f} = abs(${f}(depth2) - depth);
      var dy1: ${f} = abs(height - ${f}(height1));
      var dy2: ${f} = abs(${f}(height2) - height);
      var dz1: ${f} = abs(width - ${f}(width1));
      var dz2: ${f} = abs(${f}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},Sd=(e,t,r,i,a,n)=>{let s=e.dims,u=md(n,t.axes,s.length),l=gd(s,i,a,t.axes),p=i.slice();i.length===0&&(p=s.map((b,E)=>b===0?1:l[E]/b),t.keepAspectRatioPolicy!=="stretch"&&(l=yd(s,p,t)));let f=H("output",e.dataType,l.length),h=R("input",e.dataType,s.length),g=O.size(l),_=s.length===l.length&&s.every((b,E)=>b===l[E]),y=t.coordinateTransformMode==="tf_crop_and_resize",$=t.extrapolationValue,S=h.type.value,x=b=>`
      ${_?"":`
      ${hd(t.coordinateTransformMode,S)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${wd(h,s)};
              ${fd(t.nearestMode,r,S)};
              ${bd(h,f,s,l,p.length,u.length,y)};
              `;case"linear":return`
              ${_d(f,s,l,p.length,u.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${$d(h,f,s,y,$)}`;if(s.length===3||s.length===5)return`${xd(h,f,s,y,$)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${vd(h,f,s,l,p,u,t.cubicCoeffA,y,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${b.registerUniform("output_size","u32").registerUniform("scales","f32",p.length).registerUniform("roi","f32",u.length).declareVariables(h,f)}
      ${b.mainStart()}
        ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${_?"output[global_idx] = input[global_idx];":`
        let output_indices = ${f.offsetToIndices("global_idx")};
        var input_indices: ${h.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${h.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${p.length>0?t.mode==="cubic"?p:p.length:""}|${a.length>0?a:""}|${u.length>0?u:""}|${_}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:[{type:12,data:g},{type:1,data:p},{type:1,data:u},...Z(s,l)]})}},kd=e=>{let t=e.customDataBuffer;return new Uint32Array(t.buffer,t.byteOffset,1)[0]},of=(e,t)=>{let r=[],i=[],a=[],n=kd(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");cd(e.inputs,t,n,r,i,a),e.compute(Sd(e.inputs[0],t,n,r,i,a),{inputs:[0]})},uf=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,a=e.cubicCoeffA,n=e.excludeOutside!==0,s=e.extrapolationValue,u=e.keepAspectRatioPolicy,l=e.mode,p=e.nearestMode===""?"simple":e.nearestMode;return he({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:a,excludeOutside:n,extrapolationValue:s,keepAspectRatioPolicy:u,mode:l,nearestMode:p})}}),Td,Id,lf,Y0=P(()=>{"use strict";te(),ie(),ae(),Td=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let a=t.dims[t.dims.length-1],n=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==a)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==n)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==a)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Bias must have the same hidden size as input")}},Id=(e,t,r,i)=>{let a=t.simplified,n=e[0].dims,s=O.size(n),u=n,l=s,p=n.slice(-1)[0],f=i?n.slice(0,-1).concat(1):[],h=!a&&e.length>3,g=e.length>4,_=i&&r>1,y=i&&r>2,$=r>3,S=64,x=xe(p),b=[{type:12,data:l},{type:12,data:x},{type:12,data:p},{type:1,data:t.epsilon}],E=I=>{let z=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],A=[R("x",e[0].dataType,e[0].dims,x),R("skip",e[1].dataType,e[1].dims,x),R("gamma",e[2].dataType,e[2].dims,x)];h&&A.push(R("beta",e[3].dataType,e[3].dims,x)),g&&A.push(R("bias",e[4].dataType,e[4].dims,x)),A.push(H("output",e[0].dataType,u,x)),_&&A.push(H("mean_output",1,f)),y&&A.push(H("inv_std_output",1,f)),$&&A.push(H("input_skip_bias_sum",e[0].dataType,u,x));let v=Ee(e[0].dataType),D=Ee(1,x);return`

      ${I.registerUniforms(z).declareVariables(...A)}
      var<workgroup> sum_shared : array<${D}, ${S}>;
      var<workgroup> sum_squared_shared : array<${D}, ${S}>;

      ${I.mainStart([S,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${S};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${S};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${S-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${g?"bias[offset1d + i]":v+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${$?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${Wt(v,x,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${S};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${_t("sum",x)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${_t("square_sum",x)} / f32(uniforms.hidden_size) ${a?"":"- mean * mean"} + uniforms.epsilon);
        ${_?"mean_output[global_idx] = mean;":""}
        ${y?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${a?"":`- ${v}(mean)`}) *
            ${v}(inv_std_dev) * gamma[offset1d + i]
            ${h?"+ beta[offset1d + i]":""};
        }
      }`},k=[{dims:u,dataType:e[0].dataType}];return r>1&&k.push({dims:f,dataType:1}),r>2&&k.push({dims:f,dataType:1}),r>3&&k.push({dims:n,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${x};${_};${y};${$}`,inputDependencies:e.map((I,z)=>"type")},getShaderSource:E,getRunData:()=>({outputs:k,dispatchGroup:{x:Math.ceil(l/p)},programUniforms:b})}},lf=(e,t)=>{Td(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(Id(e.inputs,t,e.outputCount,!1),{outputs:r})}}),Ed,ar,zd,ga,Cd,Ad,df,pf,J0=P(()=>{"use strict";te(),ie(),Se(),ae(),Ed=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},ar=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},zd=(e,t)=>{if(e.length>1){let r=ar(e,1),i=ar(e,2),a=ar(e,3);return a.length===0&&(a=[...Array(e[0].dims.length).keys()]),he({starts:r,ends:i,axes:a})}else return t},ga=(e,t,r,i,a)=>{let n=e;return e<0&&(n+=r[i[t]]),a[t]<0?Math.max(0,Math.min(n,r[i[t]]-1)):Math.max(0,Math.min(n,r[i[t]]))},Cd=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length-1}; i >= 0; i--) {
            let input_shape_i = ${K("uniforms.input_shape","i",r.length)};
            let steps_i = ${K("uniforms.steps","i",r.length)};
            let signs_i = ${K("uniforms.signs","i",r.length)};
            let starts_i = ${K("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,Ad=(e,t)=>{let r=e[0].dims,i=O.size(r),a=t.axes.length>0?O.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],n=ar(e,4);n.forEach(x=>x!==0||(()=>{throw new Error("step cannot be 0")})),n.length===0&&(n=Array(a.length).fill(1));let s=t.starts.map((x,b)=>ga(x,b,r,a,n)),u=t.ends.map((x,b)=>ga(x,b,r,a,n));if(a.length!==s.length||a.length!==u.length)throw new Error("start, ends and axes should have the same number of elements");if(a.length!==r.length)for(let x=0;x<r.length;++x)a.includes(x)||(s.splice(x,0,0),u.splice(x,0,r[x]),n.splice(x,0,1));let l=n.map(x=>Math.sign(x));n.forEach((x,b,E)=>{if(x<0){let k=(u[b]-s[b])/x,I=s[b],z=I+k*n[b];s[b]=z,u[b]=I,E[b]=-x}});let p=r.slice(0);a.forEach((x,b)=>{p[x]=Math.ceil((u[x]-s[x])/n[x])});let f={dims:p,dataType:e[0].dataType},h=H("output",e[0].dataType,p.length),g=R("input",e[0].dataType,e[0].dims.length),_=O.size(p),y=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:l.length},{name:"steps",type:"u32",length:n.length}],$=[{type:12,data:_},{type:12,data:s},{type:6,data:l},{type:12,data:n},...Z(e[0].dims,p)],S=x=>`
      ${x.registerUniforms(y).declareVariables(g,h)}
        ${Cd(g,h,r)}
        ${x.mainStart()}
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${h.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${h.setByOffset("global_idx",g.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${l.length}_${s.length}_${n.length}`,inputDependencies:["rank"]},getShaderSource:S,getRunData:()=>({outputs:[f],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:$})}},df=(e,t)=>{Ed(e.inputs,t);let r=zd(e.inputs,t);e.compute(Ad(e.inputs,r),{inputs:[0]})},pf=e=>{let t=e.starts,r=e.ends,i=e.axes;return he({starts:t,ends:r,axes:i})}}),Od,Bd,cf,hf,ey=P(()=>{"use strict";te(),ie(),Se(),bt(),ae(),Od=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},Bd=(e,t)=>{let r=e.inputs[0],i=r.dims,a=O.size(i),n=i.length,s=O.normalizeAxis(t.axis,n),u=s<i.length-1,l,p=[];u?(p=Array.from({length:n},(A,v)=>v),p[s]=n-1,p[n-1]=s,l=e.compute(De(r,p),{inputs:[r],outputs:[-1]})[0]):l=r;let f=l.dims,h=f[n-1],g=a/h,_=xe(h),y=h/_,$=64;g===1&&($=256);let S=(A,v)=>v===4?`max(max(${A}.x, ${A}.y), max(${A}.z, ${A}.w))`:v===2?`max(${A}.x, ${A}.y)`:v===3?`max(max(${A}.x, ${A}.y), ${A}.z)`:A,x=R("x",l.dataType,l.dims,_),b=H("result",l.dataType,l.dims,_),E=x.type.value,k=Ee(l.dataType)==="f32"?`var threadMax = ${E}(-3.4028234663852886e+38f);`:`var threadMax = ${E}(-65504.0h);`,I=A=>`
      var<workgroup> rowMaxShared : ${E};
      var<workgroup> rowSumShared : ${E};
      var<workgroup> threadShared : array<${E}, ${$}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${E} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${E}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${A.registerUniform("packedCols","i32").declareVariables(x,b)}
      ${A.mainStart($)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${$};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${k}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${E}(${S("threadShared[0]",_)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${E}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${E}(${_t("threadShared[0]",_)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${E}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,z=e.compute({name:"Softmax",shaderCache:{hint:`${_};${$}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:f,dataType:l.dataType}],dispatchGroup:{x:g},programUniforms:[{type:6,data:y}]}),getShaderSource:I},{inputs:[l],outputs:[u?-1:0]})[0];u&&e.compute(De(z,p),{inputs:[z]})},cf=(e,t)=>{Od(e.inputs),Bd(e,t)},hf=e=>he({axis:e.axis})}),ya,Rd,Nd,Md,ff,ty=P(()=>{"use strict";te(),ie(),ae(),ya=e=>Array.from(e.getBigInt64Array(),Number),Rd=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(ya(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},Nd=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},Md=(e,t)=>{let r=e[0].dims,i=t??ya(e[1]),a=Nd(r,i),n=O.size(a),s=e[0].dataType,u=R("input",s,r.length),l=H("output",s,a.length),p=f=>`
      const inputShape = ${u.indices(...r)};
      ${f.registerUniform("output_size","u32").declareVariables(u,l)}
      ${f.mainStart()}
      ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${l.offsetToIndices("global_idx")};
      var input_indices: ${u.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${u.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${l.indicesGet("output_indices","i")}  % input_dim_i;

        ${u.indicesSet("input_indices","i","input_dim_value")}
      }
      ${l.setByOffset("global_idx",u.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},...Z(e[0].dims,a)]}),getShaderSource:p}},ff=e=>{Rd(e.inputs),e.compute(Md(e.inputs),{inputs:[0]})}}),Dd,Ud,mf,ry=P(()=>{"use strict";te(),ie(),ae(),Dd=(e,t,r,i,a)=>{let n=H("output_data",a,r.length,4),s=R("a_data",t[1].dataType,t[1].dims.length,4),u=R("b_data",t[2].dataType,t[2].dims.length,4),l=R("c_data",t[0].dataType,t[0].dims.length,4),p,f=(h,g,_)=>`select(${g}, ${h}, ${_})`;if(!i)p=n.setByOffset("global_idx",f(s.getByOffset("global_idx"),u.getByOffset("global_idx"),l.getByOffset("global_idx")));else{let h=(g,_,y="")=>{let $=`a_data[index_a${_}][component_a${_}]`,S=`b_data[index_b${_}][component_b${_}]`,x=`bool(c_data[index_c${_}] & (0xffu << (component_c${_} * 8)))`;return`
            let output_indices${_} = ${n.offsetToIndices(`global_idx * 4u + ${_}u`)};
            let offset_a${_} = ${s.broadcastedIndicesToOffset(`output_indices${_}`,n)};
            let offset_b${_} = ${u.broadcastedIndicesToOffset(`output_indices${_}`,n)};
            let offset_c${_} = ${l.broadcastedIndicesToOffset(`output_indices${_}`,n)};
            let index_a${_} = offset_a${_} / 4u;
            let index_b${_} = offset_b${_} / 4u;
            let index_c${_} = offset_c${_} / 4u;
            let component_a${_} = offset_a${_} % 4u;
            let component_b${_} = offset_b${_} % 4u;
            let component_c${_} = offset_c${_} % 4u;
            ${g}[${_}] = ${y}(${f($,S,x)});
          `};a===9?p=`
            var data = vec4<u32>(0);
            ${h("data",0,"u32")}
            ${h("data",1,"u32")}
            ${h("data",2,"u32")}
            ${h("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:p=`
            ${h("output_data[global_idx]",0)}
            ${h("output_data[global_idx]",1)}
            ${h("output_data[global_idx]",2)}
            ${h("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(l,s,u,n)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${p}
      }`},Ud=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,a=e[1].dataType,n=!(O.areEqual(t,r)&&O.areEqual(r,i)),s=t,u=O.size(t);if(n){let p=Vt.calcShape(Vt.calcShape(t,r,!1),i,!1);if(!p)throw new Error("Can't perform where op on the given tensors");s=p,u=O.size(s)}let l=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:p=>Dd(p,e,s,n,a),getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:l},...Z(i,t,r,s)]})}},mf=e=>{e.compute(Ud(e.inputs))}}),gf,iy=P(()=>{"use strict";g0(),Qa(),y0(),_0(),b0(),w0(),$0(),T0(),E0(),z0(),C0(),A0(),O0(),B0(),R0(),N0(),M0(),D0(),U0(),P0(),q0(),L0(),W0(),V0(),G0(),H0(),Rh(),F0(),j0(),K0(),Z0(),X0(),Xa(),Q0(),Ph(),Y0(),J0(),ey(),Dh(),ty(),bt(),Ya(),ry(),gf=new Map([["Abs",[nc]],["Acos",[sc]],["Acosh",[oc]],["Add",[Wc]],["ArgMax",[tc,Ia]],["ArgMin",[ec,Ia]],["Asin",[uc]],["Asinh",[lc]],["Atan",[dc]],["Atanh",[pc]],["Attention",[rc]],["AveragePool",[Kh,jh]],["BatchNormalization",[ic]],["BiasAdd",[ac]],["BiasSplitGelu",[Lc]],["Cast",[hc,cc]],["Ceil",[mc]],["Clip",[fc]],["Concat",[Yc,Jc]],["Conv",[Ba,Oa]],["ConvTranspose",[lh,uh]],["Cos",[gc]],["Cosh",[yc]],["CumSum",[dh,ph]],["DepthToSpace",[ch,hh]],["DequantizeLinear",[tf,rf]],["DFT",[fh,mh]],["Div",[Vc]],["Einsum",[gh,yh]],["Elu",[_c,ur]],["Equal",[Gc]],["Erf",[bc]],["Exp",[wc]],["Expand",[_h]],["FastGelu",[bh]],["Floor",[$c]],["FusedConv",[Ba,Oa]],["Gather",[$h,wh]],["GatherElements",[Ih,Th]],["GatherBlockQuantized",[Sh,kh]],["GatherND",[vh,xh]],["Gelu",[vc]],["Gemm",[zh,Eh]],["GlobalAveragePool",[Xh,Zh]],["GlobalMaxPool",[ef,Jh]],["Greater",[Kc]],["GreaterOrEqual",[Xc]],["GridSample",[Ch,Ah]],["GroupQueryAttention",[qh]],["HardSigmoid",[Cc,zc]],["HardSwish",[Ac]],["InstanceNormalization",[Lh]],["LayerNormalization",[Wh]],["LeakyRelu",[xc,ur]],["Less",[Zc]],["LessOrEqual",[Qc]],["Log",[Pc]],["MatMul",[Vh]],["MatMulNBits",[Gh,Hh]],["MaxPool",[Qh,Yh]],["Mul",[Hc]],["MultiHeadAttention",[Bh,Oh]],["Neg",[kc]],["Not",[Sc]],["Pad",[Fh]],["Pow",[Fc]],["QuickGelu",[qc,ur]],["Range",[af]],["Reciprocal",[Tc]],["ReduceMin",[Zp]],["ReduceMean",[Gp]],["ReduceMax",[Kp]],["ReduceSum",[Qp]],["ReduceProd",[Xp]],["ReduceL1",[Hp]],["ReduceL2",[Fp]],["ReduceLogSum",[Jp]],["ReduceLogSumExp",[jp]],["ReduceSumSquare",[Yp]],["Relu",[Ic]],["Resize",[of,uf]],["RotaryEmbedding",[Uh]],["ScatterND",[sf,nf]],["Sigmoid",[Ec]],["Sin",[Oc]],["Sinh",[Bc]],["Slice",[df,pf]],["SkipLayerNormalization",[lf]],["Split",[Nh,Mh]],["Sqrt",[Rc]],["Softmax",[cf,hf]],["Sub",[jc]],["Tan",[Nc]],["Tanh",[Mc]],["ThresholdedRelu",[Uc,ur]],["Tile",[ff]],["Transpose",[Op,Bp]],["Where",[mf]]])}),yf,ay=P(()=>{"use strict";qe(),ot(),ae(),yf=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,a){tt(e.programInfo.name);let n=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let u=[];for(let p of t)u.push({binding:u.length,resource:{buffer:p.buffer}});for(let p of r)u.push({binding:u.length,resource:{buffer:p.buffer}});a&&u.push({binding:u.length,resource:a});let l=n.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let p={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:l,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(p)}s.setPipeline(e.computePipeline),s.setBindGroup(0,l),s.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Ke(e.programInfo.name)}dispose(){}build(e,t){tt(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(p=>{r.features.has(p.feature)&&i.push(`enable ${p.extension};`)});let a=Ap(t,this.backend.device.limits),n=e.getShaderSource(a),s=`${i.join(`
`)}
${a.additionalImplementations}
${n}`,u=r.createShaderModule({code:s,label:e.name});de("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let l=r.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:e.name});return Ke(e.name),{programInfo:e,computePipeline:l,uniformVariablesInfo:a.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,a=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=a&&r<=a&&i<=a)return[t,r,i];let n=t*r*i,s=Math.ceil(Math.sqrt(n));if(s>a){if(s=Math.ceil(Math.cbrt(n)),s>a)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),_f={};Ht(_f,{WebGpuBackend:()=>bf});var Pd,qd,Ld,bf,ny=P(()=>{"use strict";qe(),te(),ot(),Tp(),f0(),iy(),ay(),Pd=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let a=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${a}`);break}case"rank":{let n=e[i].dims.length;r.push(`${a};${n}`);break}case"dims":{let n=e[i].dims.join(",");r.push(`${a};${n}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},qd=(e,t,r)=>{let i=e.name;return e.shaderCache?.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${Pd(t,e.shaderCache?.inputDependencies??new Array(t.length).fill("dims"))}`,i},Ld=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},bf=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},a=u=>t.features.has(u)&&r.push(u)&&!0;a("chromium-experimental-timestamp-query-inside-passes")||a("timestamp-query"),a("shader-f16"),a("subgroups"),this.device=await t.requestDevice(i);let n=t,s=t.info??(typeof n.requestAdapterInfo=="function"?await n.requestAdapterInfo():void 0);this.adapterInfo=new Ld(s),this.gpuDataManager=zp(this),this.programManager=new yf(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Fa(e.logLevel,!!e.debug),this.device.onuncapturederror=u=>{u.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${u.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&this.env?.webgpu&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;tt(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let i=0;i<t.length/2;i++){let a=r[i],n=a.kernelId,s=this.kernels.get(n),u=s.kernelType,l=s.kernelName,p=a.programName,f=a.inputTensorViews,h=a.outputTensorViews,g=t[i*2],_=t[i*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=g);let y=Number(g-this.queryTimeBase),$=Number(_-this.queryTimeBase);if(!Number.isSafeInteger(y)||!Number.isSafeInteger($))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:f.map(S=>({dims:S.dims,dataType:st(S.dataType)})),outputsMetadata:h.map(S=>({dims:S.dims,dataType:st(S.dataType)})),kernelId:n,kernelType:u,kernelName:l,programName:p,startTime:y,endTime:$});else{let S="";f.forEach((b,E)=>{S+=`input[${E}]: [${b.dims}] | ${st(b.dataType)}, `});let x="";h.forEach((b,E)=>{x+=`output[${E}]: [${b.dims}] | ${st(b.dataType)}, `}),console.log(`[profiling] kernel "${n}|${u}|${l}|${p}" ${S}${x}start time: ${y} ns, execution time: ${$-y} ns`)}Wr("GPU",`${p}::${g}::${_}`)}e.unmap(),this.pendingQueries.delete(e)}),Ke()}run(e,t,r,i,a,n){tt(e.name);let s=[];for(let b=0;b<t.length;++b){let E=t[b].data;if(E===0)continue;let k=this.gpuDataManager.get(E);if(!k)throw new Error(`no GPU data for input: ${E}`);s.push(k)}let{outputs:u,dispatchGroup:l,programUniforms:p}=e.getRunData(t),f=r.length===0?u.map((b,E)=>E):r;if(f.length!==u.length)throw new Error(`Output size ${f.length} must be equal to ${u.length}.`);let h=[],g=[];for(let b=0;b<u.length;++b){if(!Number.isInteger(f[b])||f[b]<-3||f[b]>=n)throw new Error(`Invalid output index: ${f[b]}`);if(f[b]===-3)continue;let E=f[b]===-1,k=f[b]===-2,I=E||k?a(u[b].dataType,u[b].dims):i(f[b],u[b].dataType,u[b].dims);if(h.push(I),I.data===0)continue;let z=this.gpuDataManager.get(I.data);if(!z)throw new Error(`no GPU data for output: ${I.data}`);if(E&&this.temporaryData.push(z),k){let A=this.kernelPersistentData.get(this.currentKernelId);A||(A=[],this.kernelPersistentData.set(this.currentKernelId,A)),A.push(z)}g.push(z)}if(s.length!==t.length||g.length!==h.length){if(g.length===0)return Ke(e.name),h;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let _;if(p){let b=0,E=[];p.forEach(A=>{let v=typeof A.data=="number"?[A.data]:A.data;if(v.length===0)return;let D=A.type===10?2:4,q,Q;A.type===10?(Q=v.length>4?16:v.length>2?8:v.length*D,q=v.length>4?16:D*v.length):(Q=v.length<=2?v.length*D:16,q=16),b=Math.ceil(b/Q)*Q,E.push(b);let F=A.type===10?8:4;b+=v.length>4?Math.ceil(v.length/F)*q:v.length*D});let k=16;b=Math.ceil(b/k)*k;let I=new ArrayBuffer(b);p.forEach((A,v)=>{let D=E[v],q=typeof A.data=="number"?[A.data]:A.data;if(A.type===6)new Int32Array(I,D,q.length).set(q);else if(A.type===12)new Uint32Array(I,D,q.length).set(q);else if(A.type===10)new Uint16Array(I,D,q.length).set(q);else if(A.type===1)new Float32Array(I,D,q.length).set(q);else throw new Error(`Unsupported uniform type: ${st(A.type)}`)});let z=this.gpuDataManager.create(b,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(z.buffer,0,I,0,b),this.gpuDataManager.release(z.id),_={offset:0,size:b,buffer:z.buffer}}let y=this.programManager.normalizeDispatchGroupSize(l),$=y[1]===1&&y[2]===1,S=qd(e,t,$),x=this.programManager.getArtifact(S);if(x||(x=this.programManager.build(e,y),this.programManager.setArtifact(S,x),de("info",()=>`[artifact] key: ${S}, programName: ${e.name}`)),p&&x.uniformVariablesInfo){if(p.length!==x.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${x.uniformVariablesInfo.length}, got ${p.length} in program "${x.programInfo.name}".`);for(let b=0;b<p.length;b++){let E=p[b],k=E.type,I=typeof E.data=="number"?1:E.data.length,[z,A]=x.uniformVariablesInfo[b];if(k!==z||I!==A)throw new Error(`Uniform variable ${b} mismatch: expect type ${z} with size ${A}, got type ${k} with size ${I} in program "${x.programInfo.name}".`)}}if(de("info",()=>`[ProgramManager] run "${e.name}" (key=${S}) with ${y[0]}x${y[1]}x${y[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let b={kernelId:this.currentKernelId,programName:x.programInfo.name,inputTensorViews:t,outputTensorViews:h};this.pendingKernels.push(b),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(b)}return this.programManager.run(x,s,g,y,_),Ke(e.name),h}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let a=gf.get(e);if(!a)throw new Error(`kernel not implemented: ${e}`);let n={kernelType:e,kernelName:i,kernelEntry:a[0],attributes:[a[1],r]};this.kernels.set(t,n)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let a=i.kernelType,n=i.kernelName,s=i.kernelEntry,u=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${a}] ${n}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),de("info",()=>`[WebGPU] Start to run kernel "[${a}] ${n}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),s(t,u[1]),0}catch(p){return r.push(Promise.resolve(`[WebGPU] Kernel "[${a}] ${n}" failed. ${p}`)),1}finally{l&&r.push(this.device.popErrorScope().then(p=>p?`GPU validation error for kernel "[${a}] ${n}": ${p.message}`:null));for(let p of this.temporaryData)this.gpuDataManager.release(p.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let a=this.sessionExternalDataMapping.get(e);a||(a=new Map,this.sessionExternalDataMapping.set(e,a));let n=a.get(t),s=this.gpuDataManager.registerExternalBuffer(r,i,n);return a.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await Sa(this,e,t);return ja(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){de("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){de("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){de("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let a=this.getComputePassEncoder(),n=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),a.setPipeline(n.computePipeline),a.setBindGroup(0,n.bindGroup),a.dispatchWorkgroups(...n.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),wf={};Ht(wf,{init:()=>$f});var Dr,Wd,$f,sy=P(()=>{"use strict";te(),ot(),ie(),h0(),Dr=class vf{constructor(t,r,i,a){this.module=t,this.dataType=r,this.data=i,this.dims=a}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=O.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(O.size(t)!==O.size(this.dims))throw new Error("Invalid new shape");return new vf(this.module,this.dataType,this.data,t)}},Wd=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let i=e.PTR_SIZE,a=r/e.PTR_SIZE,n=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*a++,n));let s=Number(e.getValue(i*a++,n));this.outputCount=Number(e.getValue(i*a++,n)),this.customDataOffset=Number(e.getValue(i*a++,"*")),this.customDataSize=Number(e.getValue(i*a++,n));let u=[];for(let l=0;l<s;l++){let p=Number(e.getValue(i*a++,n)),f=Number(e.getValue(i*a++,"*")),h=Number(e.getValue(i*a++,n)),g=[];for(let _=0;_<h;_++)g.push(Number(e.getValue(i*a++,n)));u.push(new Dr(e,p,f,g))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let r=t?.inputs?.map(s=>typeof s=="number"?this.inputs[s]:s)??this.inputs,i=t?.outputs??[],a=(s,u,l)=>new Dr(this.module,u,this.output(s,l),l),n=(s,u)=>{let l=Ct(s,u);if(!l)throw new Error(`Unsupported data type: ${s}`);let p=l>0?this.backend.gpuDataManager.create(l).id:0;return new Dr(this.module,s,p,u)};return this.backend.run(e,r,i,a,n,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,a=i===4?"i32":"i64",n=this.module.stackAlloc((1+t.length)*i);this.module.setValue(n,t.length,a);for(let s=0;s<t.length;s++)this.module.setValue(n+i*(s+1),t[s],a);return this.module._JsepOutput(this.opKernelContext,e,n)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},$f=async(e,t,r,i)=>{let a=t.jsepInit;if(!a)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let n=(ny(),pr(_f)).WebGpuBackend,s=new n;await s.initialize(r,i),a("webgpu",[s,u=>s.alloc(Number(u)),u=>s.free(u),(u,l,p,f=!1)=>{if(f)de("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(u)}, dst=${Number(l)}, size=${Number(p)}`),s.memcpy(Number(u),Number(l));else{de("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(u)}, gpuDataId=${Number(l)}, size=${Number(p)}`);let h=t.HEAPU8.subarray(Number(u>>>0),Number(u>>>0)+Number(p));s.upload(Number(l),h)}},async(u,l,p)=>{de("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${u}, dataOffset=${l}, size=${p}`),await s.download(Number(u),()=>t.HEAPU8.subarray(Number(l)>>>0,Number(l+p)>>>0))},(u,l,p)=>s.createKernel(u,Number(l),p,t.UTF8ToString(t._JsepGetNodeName(Number(l)))),u=>s.releaseKernel(u),(u,l,p,f)=>{de("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${p}, kernel=${u}, contextDataOffset=${l}`);let h=new Wd(t,s,Number(l));return s.computeKernel(Number(u),h,f)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let n=new Ep(r);a("webnn",[n,()=>n.reserveTensorId(),s=>n.releaseTensorId(s),async(s,u,l,p,f)=>n.ensureTensor(s,u,l,p,f),(s,u)=>{n.uploadTensor(s,u)},async(s,u)=>n.downloadTensor(s,u),(s,u)=>n.registerMLContext(s,u),!!r.trace])}}}),Vd,nn,sn,mt,Gd,_a,Zr,on,un,ba,ln,dn,pn,xf=P(()=>{"use strict";qe(),d0(),p0(),te(),Mt(),Wa(),vp(),Vd=(e,t)=>{ye()._OrtInit(e,t)!==0&&fe("Can't initialize onnxruntime.")},nn=async e=>{Vd(e.wasm.numThreads,Gr(e.logLevel))},sn=async(e,t)=>{ye().asyncInit?.();let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let i=e.webgpu.powerPreference;if(i!==void 0&&i!=="low-power"&&i!=="high-performance")throw new Error(`Invalid powerPreference setting: "${i}"`);let a=e.webgpu.forceFallbackAdapter;if(a!==void 0&&typeof a!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${a}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:i,forceFallbackAdapter:a}),!r)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let i=(sy(),pr(wf)).init;t==="webgpu"&&await i("webgpu",ye(),e,r),t==="webnn"&&await i("webnn",ye(),e)}},mt=new Map,Gd=e=>{let t=ye(),r=t.stackSave();try{let i=t.PTR_SIZE,a=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,a,a+i)!==0&&fe("Can't get session input/output count.");let n=i===4?"i32":"i64";return[Number(t.getValue(a,n)),Number(t.getValue(a+i,n))]}finally{t.stackRestore(r)}},_a=(e,t)=>{let r=ye(),i=r.stackSave(),a=0;try{let n=r.PTR_SIZE,s=r.stackAlloc(2*n);r._OrtGetInputOutputMetadata(e,t,s,s+n)!==0&&fe("Can't get session input/output metadata.");let u=Number(r.getValue(s,"*"));a=Number(r.getValue(s+n,"*"));let l=r.HEAP32[a/4];if(l===0)return[u,0];let p=r.HEAPU32[a/4+1],f=[];for(let h=0;h<p;h++){let g=Number(r.getValue(a+8+h*n,"*"));f.push(g!==0?r.UTF8ToString(g):Number(r.getValue(a+8+(h+p)*n,"*")))}return[u,l,f]}finally{r.stackRestore(i),a!==0&&r._OrtFree(a)}},Zr=e=>{let t=ye(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},on=async(e,t)=>{let r,i,a=ye();Array.isArray(e)?[r,i]=e:e.buffer===a.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=Zr(e);let n=0,s=0,u=0,l=[],p=[],f=[];try{if([s,l]=await $p(t),t?.externalData&&a.mountExternalData){let k=[];for(let I of t.externalData){let z=typeof I=="string"?I:I.path,A=typeof I=="string"?I:I.data;k.push(Ha(A).then(v=>{a.mountExternalData(z,v)}))}await Promise.all(k)}for(let k of t?.executionProviders??[])if((typeof k=="string"?k:k.name)==="webnn"){if(a.shouldTransferToMLTensor=!1,typeof k!="string"){let I=k,z=I?.context,A=I?.gpuDevice,v=I?.deviceType,D=I?.powerPreference;z?a.currentContext=z:A?a.currentContext=await a.webnnCreateMLContext(A):a.currentContext=await a.webnnCreateMLContext({deviceType:v,powerPreference:D})}else a.currentContext=await a.webnnCreateMLContext();break}n=await a._OrtCreateSession(r,i,s),a.webgpuOnCreateSession?.(n),n===0&&fe("Can't create a session."),a.jsepOnCreateSession?.(),a.currentContext&&(a.webnnRegisterMLContext(n,a.currentContext),a.currentContext=void 0,a.shouldTransferToMLTensor=!0);let[h,g]=Gd(n),_=!!t?.enableGraphCapture,y=[],$=[],S=[],x=[],b=[];for(let k=0;k<h;k++){let[I,z,A]=_a(n,k);I===0&&fe("Can't get an input name."),p.push(I);let v=a.UTF8ToString(I);y.push(v),S.push(z===0?{name:v,isTensor:!1}:{name:v,isTensor:!0,type:st(z),shape:A})}for(let k=0;k<g;k++){let[I,z,A]=_a(n,k+h);I===0&&fe("Can't get an output name."),f.push(I);let v=a.UTF8ToString(I);$.push(v),x.push(z===0?{name:v,isTensor:!1}:{name:v,isTensor:!0,type:st(z),shape:A});{if(_&&t?.preferredOutputLocation===void 0){b.push("gpu-buffer");continue}let D=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[v]??"cpu",q=a.webnnIsGraphOutput;if(D==="cpu"&&q&&q(n,v)){b.push("ml-tensor-cpu-output");continue}if(D!=="cpu"&&D!=="cpu-pinned"&&D!=="gpu-buffer"&&D!=="ml-tensor")throw new Error(`Not supported preferred output location: ${D}.`);if(_&&D!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${D}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);b.push(D)}}let E=null;return b.some(k=>k==="gpu-buffer"||k==="ml-tensor"||k==="ml-tensor-cpu-output")&&(u=a._OrtCreateBinding(n),u===0&&fe("Can't create IO binding."),E={handle:u,outputPreferredLocations:b,outputPreferredLocationsEncoded:b.map(k=>k==="ml-tensor-cpu-output"?"ml-tensor":k).map(k=>xa(k))}),mt.set(n,[n,p,f,E,_,!1]),[n,y,$,S,x]}catch(h){throw p.forEach(g=>a._OrtFree(g)),f.forEach(g=>a._OrtFree(g)),u!==0&&a._OrtReleaseBinding(u)!==0&&fe("Can't release IO binding."),n!==0&&a._OrtReleaseSession(n)!==0&&fe("Can't release session."),h}finally{a._free(r),s!==0&&a._OrtReleaseSessionOptions(s)!==0&&fe("Can't release session options."),l.forEach(h=>a._free(h)),a.unmountExternalData?.()}},un=e=>{let t=ye(),r=mt.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,a,n,s,u]=r;s&&(u&&t._OrtClearBoundOutputs(s.handle)!==0&&fe("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&fe("Can't release IO binding.")),t.jsepOnReleaseSession?.(e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),a.forEach(l=>t._OrtFree(l)),n.forEach(l=>t._OrtFree(l)),t._OrtReleaseSession(i)!==0&&fe("Can't release session."),mt.delete(e)},ba=async(e,t,r,i,a,n,s=!1)=>{if(!e){t.push(0);return}let u=ye(),l=u.PTR_SIZE,p=e[0],f=e[1],h=e[3],g=h,_,y;if(p==="string"&&(h==="gpu-buffer"||h==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&h!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${n} when enableGraphCapture is true.`);if(h==="gpu-buffer"){let x=e[2].gpuBuffer;y=Ct(zt(p),f);{let b=u.jsepRegisterBuffer;if(!b)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');_=b(i,n,x,y)}}else if(h==="ml-tensor"){let x=e[2].mlTensor;y=Ct(zt(p),f);let b=u.webnnRegisterMLTensor;if(!b)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');_=b(i,x,zt(p),f)}else{let x=e[2];if(Array.isArray(x)){y=l*x.length,_=u._malloc(y),r.push(_);for(let b=0;b<x.length;b++){if(typeof x[b]!="string")throw new TypeError(`tensor data at index ${b} is not a string`);u.setValue(_+b*l,je(x[b],r),"*")}}else{let b=u.webnnIsGraphInput,E=u.webnnIsGraphOutput;if(p!=="string"&&b&&E){let k=u.UTF8ToString(a);if(b(i,k)||E(i,k)){let I=zt(p);y=Ct(I,f),g="ml-tensor";let z=u.webnnCreateTemporaryTensor,A=u.webnnUploadTensor;if(!z||!A)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let v=await z(i,I,f);A(v,new Uint8Array(x.buffer,x.byteOffset,x.byteLength)),_=v}else y=x.byteLength,_=u._malloc(y),r.push(_),u.HEAPU8.set(new Uint8Array(x.buffer,x.byteOffset,y),_)}else y=x.byteLength,_=u._malloc(y),r.push(_),u.HEAPU8.set(new Uint8Array(x.buffer,x.byteOffset,y),_)}}let $=u.stackSave(),S=u.stackAlloc(4*f.length);try{f.forEach((b,E)=>u.setValue(S+E*l,b,l===4?"i32":"i64"));let x=u._OrtCreateTensor(zt(p),_,y,S,f.length,xa(g));x===0&&fe(`Can't create tensor for input/output. session=${i}, index=${n}.`),t.push(x)}finally{u.stackRestore($)}},ln=async(e,t,r,i,a,n)=>{let s=ye(),u=s.PTR_SIZE,l=mt.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let p=l[0],f=l[1],h=l[2],g=l[3],_=l[4],y=l[5],$=t.length,S=i.length,x=0,b=[],E=[],k=[],I=[],z=[],A=s.stackSave(),v=s.stackAlloc($*u),D=s.stackAlloc($*u),q=s.stackAlloc(S*u),Q=s.stackAlloc(S*u);try{[x,b]=wp(n),At("wasm prepareInputOutputTensor");for(let M=0;M<$;M++)await ba(r[M],E,I,e,f[t[M]],t[M],_);for(let M=0;M<S;M++)await ba(a[M],k,I,e,h[i[M]],$+i[M],_);Ot("wasm prepareInputOutputTensor");for(let M=0;M<$;M++)s.setValue(v+M*u,E[M],"*"),s.setValue(D+M*u,f[t[M]],"*");for(let M=0;M<S;M++)s.setValue(q+M*u,k[M],"*"),s.setValue(Q+M*u,h[i[M]],"*");if(g&&!y){let{handle:M,outputPreferredLocations:G,outputPreferredLocationsEncoded:J}=g;if(f.length!==$)throw new Error(`input count from feeds (${$}) is expected to be always equal to model's input count (${f.length}).`);At("wasm bindInputsOutputs");for(let ee=0;ee<$;ee++){let re=t[ee];await s._OrtBindInput(M,f[re],E[ee])!==0&&fe(`Can't bind input[${ee}] for session=${e}.`)}for(let ee=0;ee<S;ee++){let re=i[ee];a[ee]?.[3]?(z.push(k[ee]),s._OrtBindOutput(M,h[re],k[ee],0)!==0&&fe(`Can't bind pre-allocated output[${ee}] for session=${e}.`)):s._OrtBindOutput(M,h[re],0,J[re])!==0&&fe(`Can't bind output[${ee}] to ${G[ee]} for session=${e}.`)}Ot("wasm bindInputsOutputs"),mt.set(e,[p,f,h,g,_,!0])}s.jsepOnRunStart?.(p),s.webnnOnRunStart?.(p);let F;g?F=await s._OrtRunWithBinding(p,g.handle,S,q,x):F=await s._OrtRun(p,D,v,$,Q,S,q,x),F!==0&&fe("failed to call OrtRun().");let j=[],B=[];At("wasm ProcessOutputTensor");for(let M=0;M<S;M++){let G=Number(s.getValue(q+M*u,"*"));if(G===k[M]||z.includes(k[M])){j.push(a[M]),G!==k[M]&&s._OrtReleaseTensor(G)!==0&&fe("Can't release tensor.");continue}let J=s.stackSave(),ee=s.stackAlloc(4*u),re=!1,ne,U=0;try{s._OrtGetTensorData(G,ee,ee+u,ee+2*u,ee+3*u)!==0&&fe(`Can't access output tensor data on index ${M}.`);let Y=u===4?"i32":"i64",X=Number(s.getValue(ee,Y));U=s.getValue(ee+u,"*");let V=s.getValue(ee+u*2,"*"),Te=Number(s.getValue(ee+u*3,Y)),Ae=[];for(let me=0;me<Te;me++)Ae.push(Number(s.getValue(V+me*u,Y)));s._OrtFree(V)!==0&&fe("Can't free memory for tensor dims.");let ve=Ae.reduce((me,be)=>me*be,1);ne=st(X);let Oe=g?.outputPreferredLocations[i[M]];if(ne==="string"){if(Oe==="gpu-buffer"||Oe==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let me=[];for(let be=0;be<ve;be++){let Be=s.getValue(U+be*u,"*"),hr=s.getValue(U+(be+1)*u,"*"),Ze=be===ve-1?void 0:hr-Be;me.push(s.UTF8ToString(Be,Ze))}j.push([ne,Ae,me,"cpu"])}else if(Oe==="gpu-buffer"&&ve>0){let me=s.jsepGetBuffer;if(!me)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let be=me(U),Be=Ct(X,ve);if(Be===void 0||!Va(ne))throw new Error(`Unsupported data type: ${ne}`);re=!0,j.push([ne,Ae,{gpuBuffer:be,download:s.jsepCreateDownloader(be,Be,ne),dispose:()=>{s._OrtReleaseTensor(G)!==0&&fe("Can't release tensor.")}},"gpu-buffer"])}else if(Oe==="ml-tensor"&&ve>0){let me=s.webnnEnsureTensor,be=s.webnnIsGraphInputOutputTypeSupported;if(!me||!be)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Ct(X,ve)===void 0||!Ga(ne))throw new Error(`Unsupported data type: ${ne}`);if(!be(e,ne,!1))throw new Error(`preferredLocation "ml-tensor" for ${ne} output is not supported by current WebNN Context.`);let Be=await me(e,U,X,Ae,!1);re=!0,j.push([ne,Ae,{mlTensor:Be,download:s.webnnCreateMLTensorDownloader(U,ne),dispose:()=>{s.webnnReleaseTensorId(U),s._OrtReleaseTensor(G)}},"ml-tensor"])}else if(Oe==="ml-tensor-cpu-output"&&ve>0){let me=s.webnnCreateMLTensorDownloader(U,ne)(),be=j.length;re=!0,B.push((async()=>{let Be=[be,await me];return s.webnnReleaseTensorId(U),s._OrtReleaseTensor(G),Be})()),j.push([ne,Ae,[],"cpu"])}else{let me=Xr(ne),be=new me(ve);new Uint8Array(be.buffer,be.byteOffset,be.byteLength).set(s.HEAPU8.subarray(U,U+be.byteLength)),j.push([ne,Ae,be,"cpu"])}}finally{s.stackRestore(J),ne==="string"&&U&&s._free(U),re||s._OrtReleaseTensor(G)}}g&&!_&&(s._OrtClearBoundOutputs(g.handle)!==0&&fe("Can't clear bound outputs."),mt.set(e,[p,f,h,g,_,!1]));for(let[M,G]of await Promise.all(B))j[M][2]=G;return Ot("wasm ProcessOutputTensor"),j}finally{s.webnnOnRunEnd?.(p),s.stackRestore(A),E.forEach(F=>s._OrtReleaseTensor(F)),k.forEach(F=>s._OrtReleaseTensor(F)),I.forEach(F=>s._free(F)),x!==0&&s._OrtReleaseRunOptions(x),b.forEach(F=>s._free(F))}},dn=e=>{let t=ye(),r=mt.get(e);if(!r)throw new Error("invalid session id");let i=r[0],a=t._OrtEndProfiling(i);a===0&&fe("Can't get an profile file name."),t._OrtFree(a)},pn=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),gt,Pe,qt,nr,sr,Ur,wa,Pr,Tt,It,Hd,Sf,kf,Tf,If,Ef,zf,Cf,Af=P(()=>{"use strict";qe(),xf(),Mt(),qa(),gt=()=>!!$e.wasm.proxy&&typeof document<"u",qt=!1,nr=!1,sr=!1,Pr=new Map,Tt=(e,t)=>{let r=Pr.get(e);r?r.push(t):Pr.set(e,[t])},It=()=>{if(qt||!nr||sr||!Pe)throw new Error("worker not ready")},Hd=e=>{switch(e.data.type){case"init-wasm":qt=!1,e.data.err?(sr=!0,wa[1](e.data.err)):(nr=!0,wa[0]()),Ur&&(URL.revokeObjectURL(Ur),Ur=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Pr.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},Sf=async()=>{if(!nr){if(qt)throw new Error("multiple calls to 'initWasm()' detected.");if(sr)throw new Error("previous call to 'initWasm()' failed.");if(qt=!0,gt())return new Promise((e,t)=>{Pe?.terminate(),_p().then(([r,i])=>{try{Pe=i,Pe.onerror=n=>t(n),Pe.onmessage=Hd,wa=[e,t];let a={type:"init-wasm",in:$e};!a.in.wasm.wasmPaths&&(r||va)&&(a.in.wasm.wasmPaths={wasm:new URL(""+new URL("ort-wasm-simd-threaded.jsep-MDYUKy93.wasm",import.meta.url).href,import.meta.url).href}),Pe.postMessage(a),Ur=r}catch(a){t(a)}},t)});try{await La($e.wasm),await nn($e),nr=!0}catch(e){throw sr=!0,e}finally{qt=!1}}},kf=async e=>{if(gt())return It(),new Promise((t,r)=>{Tt("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:$e}};Pe.postMessage(i)});await sn($e,e)},Tf=async e=>gt()?(It(),new Promise((t,r)=>{Tt("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};Pe.postMessage(i,[e.buffer])})):Zr(e),If=async(e,t)=>{if(gt()){if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return It(),new Promise((r,i)=>{Tt("create",[r,i]);let a={type:"create",in:{model:e,options:{...t}}},n=[];e instanceof Uint8Array&&n.push(e.buffer),Pe.postMessage(a,n)})}else return on(e,t)},Ef=async e=>{if(gt())return It(),new Promise((t,r)=>{Tt("release",[t,r]);let i={type:"release",in:e};Pe.postMessage(i)});un(e)},zf=async(e,t,r,i,a,n)=>{if(gt()){if(r.some(s=>s[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(a.some(s=>s))throw new Error("pre-allocated output tensor is not supported for proxy.");return It(),new Promise((s,u)=>{Tt("run",[s,u]);let l=r,p={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:i,options:n}};Pe.postMessage(p,pn(l))})}else return ln(e,t,r,i,a,n)},Cf=async e=>{if(gt())return It(),new Promise((t,r)=>{Tt("end-profiling",[t,r]);let i={type:"end-profiling",in:e};Pe.postMessage(i)});dn(e)}}),$a,Fd,Of,oy=P(()=>{"use strict";qe(),Af(),te(),Pa(),vp(),$a=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},Fd=e=>{switch(e[3]){case"cpu":return new et(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Va(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:a}=e[2];return et.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:a})}case"ml-tensor":{let t=e[0];if(!Ga(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:a}=e[2];return et.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:a})}default:throw new Error(`invalid data location: ${e[3]}`)}},Of=class{async fetchModelAndCopyToWasmMemory(e){return Tf(await Ha(e))}async loadModel(e,t){tt();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await If(r,t),Ke()}async dispose(){return Ef(this.sessionId)}async run(e,t,r){tt();let i=[],a=[];Object.entries(e).forEach(h=>{let g=h[0],_=h[1],y=this.inputNames.indexOf(g);if(y===-1)throw new Error(`invalid input '${g}'`);i.push(_),a.push(y)});let n=[],s=[];Object.entries(t).forEach(h=>{let g=h[0],_=h[1],y=this.outputNames.indexOf(g);if(y===-1)throw new Error(`invalid output '${g}'`);n.push(_),s.push(y)});let u=i.map((h,g)=>$a(h,()=>`input "${this.inputNames[a[g]]}"`)),l=n.map((h,g)=>h?$a(h,()=>`output "${this.outputNames[s[g]]}"`):null),p=await zf(this.sessionId,a,u,s,l,r),f={};for(let h=0;h<p.length;h++)f[this.outputNames[s[h]]]=n[h]??Fd(p[h]);return Ke(),f}startProfiling(){}endProfiling(){Cf(this.sessionId)}}}),Bf={};Ht(Bf,{OnnxruntimeWebAssemblyBackend:()=>Ma,initializeFlags:()=>Na,wasmBackend:()=>Rf});var Na,Ma,Rf,uy=P(()=>{"use strict";qe(),Af(),oy(),Na=()=>{(typeof $e.wasm.initTimeout!="number"||$e.wasm.initTimeout<0)&&($e.wasm.initTimeout=0);let e=$e.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),$e.wasm.simd=!1),typeof $e.wasm.proxy!="boolean"&&($e.wasm.proxy=!1),typeof $e.wasm.trace!="boolean"&&($e.wasm.trace=!1),typeof $e.wasm.numThreads!="number"||!Number.isInteger($e.wasm.numThreads)||$e.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)$e.wasm.numThreads=1;else{let t=typeof navigator>"u"?jg("node:os").cpus().length:navigator.hardwareConcurrency;$e.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},Ma=class{async init(e){Na(),await Sf(),await kf(e)}async createInferenceSessionHandler(e,t){let r=new Of;return await r.loadModel(e,t),r}},Rf=new Ma});qe();qe();qe();var ly="1.30.0",dy=cp;{let e=(uy(),pr(Bf)).wasmBackend;Lt("webgpu",e,5),Lt("webnn",e,5),Lt("cpu",e,10),Lt("wasm",e,10)}Object.defineProperty($e.versions,"web",{value:ly,enumerable:!0});export{pp as InferenceSession,Wr as TRACE,At as TRACE_EVENT_BEGIN,Ot as TRACE_EVENT_END,tt as TRACE_FUNC_BEGIN,Ke as TRACE_FUNC_END,et as Tensor,dy as default,$e as env,Lt as registerBackend};
