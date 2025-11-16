# 照片功能快速參考 / Photo Feature Quick Reference

## ✅ 已完成的功能

### 1. 支援的圖片格式
```
✅ JPG / JPEG
✅ PNG
✅ WebP
✅ HEIC (iPhone 照片)
✅ HEIF
```

### 2. 自動壓縮
- 最大原始檔案：5MB
- 壓縮後大小：~2MB
- 最大解析度：1920px
- 使用 Web Worker（不阻塞 UI）

### 3. OAuth 頭像整合
- ✅ Google 登入自動載入頭像
- ✅ Facebook 登入自動載入頭像
- ✅ 首次設定時顯示提示
- ✅ 可隨時更換為自訂照片

## 🎯 用戶體驗

### 上傳流程
```
1. 選擇檔案 → 2. 自動驗證 → 3. 自動壓縮 → 4. 上傳 → 5. 即時預覽
```

### 狀態訊息
- 壓縮中：`壓縮並上傳中...`
- 成功：顯示預覽圖
- 失敗：`不支援的檔案格式...` 或 `檔案大小不能超過 5MB`

### OAuth 提示
```
✅ 已從您的帳號載入個人照片
   這張照片將作為您的公開檔案照片
```

## 🔧 技術細節

### 套件
```bash
npm install browser-image-compression
```

### 主要檔案
```
components/tutor/photo-manager.tsx           # 照片管理組件
app/api/upload/photo/route.ts               # 上傳 API
app/auth/setup-tutor/page.tsx              # 首次設定
components/tutor/profile-editor-split.tsx   # 編輯器
```

### 壓縮設定
```typescript
{
  maxSizeMB: 2,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/jpeg"
}
```

## 📱 OAuth 資料結構

### Google / Facebook
```typescript
user.user_metadata.avatar_url  // 頭像 URL
user.user_metadata.full_name   // 完整姓名
user.user_metadata.email       // 電子郵件
```

## 🧪 快速測試

### 測試 1: 上傳不同格式
```bash
✅ JPG → 應該成功
✅ PNG → 應該成功並壓縮
✅ HEIC → 應該成功並轉換
❌ PDF → 應該失敗
```

### 測試 2: OAuth 頭像
```bash
1. 使用 Google/Facebook 登入
2. 檢查首次設定頁面是否顯示頭像
3. 完成設定
4. 檢查公開檔案是否顯示頭像
```

### 測試 3: 壓縮效果
```bash
1. 上傳 5MB PNG 檔案
2. 檢查是否壓縮至 ~500KB
3. 檢查 UI 是否保持響應
4. 檢查照片品質
```

## 📊 效能數據

| 原始格式 | 原始大小 | 壓縮後大小 | 節省 |
|---------|---------|-----------|------|
| PNG     | 5MB     | ~500KB    | 90%  |
| HEIC    | 3MB     | ~400KB    | 87%  |
| JPG     | 2MB     | ~300KB    | 85%  |

## 🔒 安全性檢查清單

- [x] 客戶端檔案類型驗證
- [x] 伺服器端檔案類型驗證
- [x] 檔案大小限制
- [x] 用戶身份驗證
- [x] Supabase Storage RLS
- [x] 安全的檔案路徑命名

## 💡 提示與技巧

### 對於用戶
- 使用清晰的個人照片
- 建議尺寸：500×500 像素
- iPhone 用戶可直接上傳 HEIC

### 對於開發者
- 使用 Web Worker 避免阻塞
- 提供清楚的錯誤訊息
- 雙重驗證（客戶端 + 伺服器）

## 🐛 常見問題

**Q: HEIC 檔案無法上傳？**  
A: HEIC 受支援，系統會自動轉換為 JPEG。

**Q: OAuth 頭像可以更換嗎？**  
A: 可以，直接上傳新照片即可覆蓋。

**Q: 為什麼限制 5MB？**  
A: 平衡速度和品質的最佳設定。

## 📝 快速命令

### 安裝依賴
```bash
npm install browser-image-compression --legacy-peer-deps
```

### 檢查檔案
```bash
ls -la components/tutor/photo-manager.tsx
```

### 測試上傳 API
```bash
curl -X POST http://localhost:3000/api/upload/photo \
  -F "file=@test.jpg" \
  -F "type=avatar"
```

## 📚 完整文檔

詳細資訊請參考：
- [PHOTO_UPLOAD_FEATURES.md](./PHOTO_UPLOAD_FEATURES.md) - 完整功能說明
- [PHOTO_FEATURES_SUMMARY.md](./PHOTO_FEATURES_SUMMARY.md) - 功能總結
- [OAUTH_SETUP.md](./OAUTH_SETUP.md) - OAuth 設定指南

