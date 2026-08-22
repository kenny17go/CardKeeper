# 名片管家 CardKeeper

拍照 → OCR（中英文）→ 自動整理 → 確認 → 儲存的 iPhone PWA 名片管家。
所有資料都存在你手機本機的瀏覽器資料庫（IndexedDB），不會上傳到任何伺服器。

---

## ⚠️ 重要：必須透過網址（https）開啟，不能直接雙擊 index.html

iPhone 相機（getUserMedia）與 Service Worker（離線快取）這兩個瀏覽器功能，
基於安全性規定，**只有在 `https://` 網址或 `localhost` 底下才能運作**。
如果你直接用「檔案 App」打開 `index.html`（`file://` 開頭），相機會無法啟動。

所以請選擇下面其中一種方式，把這個資料夾放到一個網址上，再用 iPhone 的 Safari 開啟。

### 方法 A（最簡單、免費、5 分鐘）：Netlify Drop
1. 電腦瀏覽器開啟 https://app.netlify.com/drop
2. 把整個 `cardkeeper` 資料夾拖進網頁
3. 完成後會得到一個 `https://xxxx.netlify.app` 的網址
4. 用 iPhone Safari 開啟這個網址

### 方法 B：GitHub Pages
1. 在 GitHub 建一個新 repository，把資料夾內容全部上傳
2. Settings → Pages → 選擇 branch 部署
3. 會得到 `https://你的帳號.github.io/repo名稱/` 網址

### 方法 C：本機測試（同一個 Wi‑Fi）
在電腦上（此資料夾內）執行：
```
python3 -m http.server 8000
```
然後在**電腦**瀏覽器用 `http://localhost:8000` 測試（相機在 localhost 也可正常運作）。
若要在 iPhone 上用同一 Wi-Fi 測試，因為手機不算 localhost，相機仍會被瀏覽器擋下，
建議直接用方法 A 部署到 https 網址即可，最省事。

---

## 📱 加入 iPhone 主畫面（成為 App 圖示）

1. 用 **Safari**（一定要 Safari，不能用 Chrome）開啟你的 https 網址
2. 點下方的「分享」按鈕（方框加箭頭）
3. 選「加入主畫面」
4. 主畫面上就會出現「名片管家」圖示，點開後全螢幕運作，就像原生 App

---

## 🧭 使用方式

1. 點右下角相機按鈕 📷 → 對準名片拍照（或選「相簿」從照片庫選取）
2. 系統會自動用 OCR 讀取中英文文字，並自動分析、帶入以下欄位：
   姓名／英文姓名／公司／職稱／手機／電話／Email／網站／地址／自動分類
3. 確認或修改欄位後按「儲存」
4. 在名片列表可以：搜尋、依分類／最愛篩選、點進名片一鍵打電話／傳簡訊／寄 Email／開 Apple Maps
5. 右上角「備份」可以匯出 / 還原 JSON 備份檔，或清空資料

---

## 🗂️ 檔案結構

```
cardkeeper/
├── index.html          主畫面 HTML（所有畫面：列表/相機/確認/詳情/備份）
├── manifest.json        PWA 設定（圖示、名稱、啟動畫面顏色）
├── sw.js                 Service Worker（離線快取 App 外殼）
├── css/style.css        視覺樣式（卡片目錄櫃設計）
├── js/db.js              IndexedDB 本機資料庫
├── js/parse.js           OCR 文字 → 欄位 的自動判讀邏輯
├── js/ocr.js              Tesseract.js OCR 封裝（中英文）
├── js/camera.js         相機拍照 / 相簿選取 / 縮圖處理
├── js/app.js              主程式：畫面切換、清單、搜尋、CRUD、備份還原
└── icons/                 App 圖示
```

## 🔧 技術說明

- **OCR**：使用開源的 [Tesseract.js](https://tesseract.projectnaptha.com/)（`chi_tra` + `eng` 語言包），
  透過 CDN 載入，於瀏覽器內執行，名片照片不會傳到任何伺服器。
- **自動判讀**：`js/parse.js` 用正規表示式與關鍵字（職稱關鍵字、公司類型關鍵字、地址關鍵字、
  分類關鍵字）從 OCR 原始文字中拆解出各欄位，屬於本地啟發式演算法，非 AI API 呼叫。
- **儲存**：IndexedDB（資料庫）本機儲存，包含名片照片縮圖，離線也能瀏覽已存的名片。
- **PWA**：`manifest.json` + `sw.js` 讓 App 可加入主畫面、離線開啟外殼介面。

## ⚠️ 已知限制

- OCR 準確度取決於名片照片的清晰度、光線與字體，複雜設計/藝術字體辨識率會較低，
  建議拍照時盡量對齊「拍攝名片」畫面中的四角框線、避免反光。
- 首次使用 OCR 時，需要下載 Tesseract 中文語言包（約幾 MB），需要網路連線；
  下載後瀏覽器會快取，之後可離線使用 OCR。
- 這是純前端 App，沒有雲端同步；若要在多台裝置間同步名片，請用「匯出 JSON」→
  在另一台裝置上「匯入 JSON」的方式手動同步。
