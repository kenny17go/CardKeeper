# CardKeeper v5 Stable

本版以穩定性為主，不新增高風險掃描功能。

## v5 Stable 重點
- 保留既有名片、搜尋、分類、正反面、重複合併、vCard 與免費 OCR。
- iPhone 拍照後維持安全模式：不執行高負載 OpenCV 透視流程。
- Service Worker 改為 v5，只有頁面導航才可 fallback 到 index.html；JS/CSS/圖片失敗不再錯回 HTML。
- IndexedDB schema 升至 v2，採非破壞 migration，舊名片資料保留。
- 新增照片儲存正規化工具，供後續逐步降低 IndexedDB 空間壓力。
- 版本名稱統一為 v5 Stable。

## 原則
任何 OCR、找邊或網路元件失敗，都不能阻止使用者返回、重拍、從相簿選圖或手動輸入。

## 部署
將 repository 根目錄部署為 GitHub Pages。更新後首次請先以 Safari 開啟網站一次，讓新的 Service Worker 接管，再從主畫面 PWA 測試。

## 技術
- OCR：Tesseract.js 5（CDN，首次載入需網路）
- 桌面找邊：OpenCV.js；iPhone 拍照後預設略過高負載透視
- 儲存：IndexedDB
- 聯絡人：vCard 3.0
- PWA：Manifest + Service Worker
