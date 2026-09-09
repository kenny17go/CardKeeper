# CardKeeper Smart Scan v4

可直接部署到 GitHub Pages 的純前端名片掃描 / 管理 PWA。

## v4 新功能

- 即時相機名片四角偵測與綠色吸附框（OpenCV.js）
- 拍照後高解析度重新找邊、透視校正與 OCR v2
- 單張 / 連續掃描模式；連續模式儲存後自動返回相機
- 正面 + 背面名片保存，詳情頁點名片可切換正反面
- 重複名片智慧偵測：Email、手機、姓名、公司加權比對
- 重複資料可智慧合併或保留新名片
- 多電話解析：手機、公司電話、其他電話、分機文字、傳真
- vCard 匯出同步包含多電話與傳真
- iOS 原生風格首頁：大標題、摘要數字、iOS 搜尋框、分類膠囊、白色列表卡片
- IndexedDB 本機保存、JSON 備份 / 還原、PWA 安裝

## GitHub Pages 部署

1. 建立一個 GitHub repository。
2. 將本 ZIP **解壓後的所有檔案與資料夾**放在 repository 根目錄；不要再多包一層資料夾。
3. GitHub → Settings → Pages。
4. Build and deployment 選 `Deploy from a branch`。
5. Branch 選 `main` / `(root)` 並儲存。
6. 使用 GitHub Pages 提供的 HTTPS 網址開啟。
7. iPhone Safari 可用「分享 → 加入主畫面」安裝成 PWA。

> 相機 API 必須在 HTTPS 或 localhost 執行，因此直接用 GitHub Pages 最方便。

## 使用方式

- 點右下角相機開始掃描。
- 名片進入畫面後，若偵測成功會看到綠色四角吸附框。
- 可切換「單張」或「連續掃描」。
- OCR 後可在確認頁點「掃描名片背面」。
- 儲存前若偵測到疑似重複名片，會提供「智慧合併」或「仍然建立新名片」。
- 已存名片若有背面，在詳情頁點名片圖片即可切換正反面。

## 技術說明

- OCR：Tesseract.js 5
- 找邊 / 透視：OpenCV.js 4.13
- 儲存：IndexedDB
- 聯絡人：vCard 3.0 + Web Share / `.vcf` fallback
- PWA：Manifest + Service Worker

## 瀏覽器限制

純 Web App 無法繞過 iOS 權限直接靜默寫入通訊錄，因此「加入聯絡人」會開啟 iOS 分享 / VCF 匯入流程。即時找邊與 OCR 使用 CDN 程式庫，第一次開啟需要網路；名片資料本身只保存在本機 IndexedDB，除非使用者自行匯出。
