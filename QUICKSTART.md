# 快速開始指南 ⚡

5 分鐘內啟動專案！

## 步驟 1: 克隆專案（如果還沒有）

```bash
cd tutor-contra
```

## 步驟 2: 安裝依賴

```bash
npm install
```

## 步驟 3: 設定 Supabase

### 3.1 建立 Supabase 專案

1. 前往 https://supabase.com
2. 點擊 "New Project"
3. 填寫專案資訊（記住資料庫密碼）

### 3.2 執行資料庫遷移

1. 在 Supabase Dashboard，前往 **SQL Editor**
2. 點擊 "New Query"
3. 複製 `supabase/migrations/001_initial_schema.sql` 內容，貼上並執行
4. 再複製 `supabase/migrations/002_rls_policies.sql` 內容，貼上並執行

### 3.3 取得 API 金鑰

1. 在 Supabase Dashboard，前往 **Settings** > **API**
2. 複製以下資訊：
   - **Project URL**
   - **anon public** key

## 步驟 4: 設定環境變數

建立 `.env` 檔案：

```bash
cp .env.example .env
```

編輯 `.env`，填入您的 Supabase 資訊：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 步驟 5: 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 http://localhost:3000

## 步驟 6: 測試功能

### 註冊新帳號
1. 點擊「註冊」
2. 輸入 Email 和密碼
3. 選擇角色（家教或家長）
4. 填寫檔案資料

### 家教測試流程
1. 完成註冊後，會自動進入家教儀表板
2. 查看統計數據、熱力圖（目前為空，因為還沒有課程）
3. 點擊「查看公開檔案」看到您的公開頁面
4. URL 格式為：`/t/your-slug`

### 家長測試流程
1. 用另一個 Email 註冊家長帳號
2. 進入家長入口
3. 目前沒有待確認課程（需要家教先建立課程）

## 🎉 完成！

您現在已經成功啟動了家教聲譽平台！

## 下一步

- 📖 閱讀 [DEVELOPMENT.md](./DEVELOPMENT.md) 了解架構
- 🚀 閱讀 [DEPLOYMENT.md](./DEPLOYMENT.md) 學習部署
- 📊 查看 [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) 了解功能

## 常見問題

### Q: 註冊後收不到確認信？
A: 開發環境下，Supabase 預設不需要 Email 確認。如需測試 Email 功能，請在 Supabase 設定中配置 SMTP。

### Q: 無法連接到 Supabase？
A: 
1. 確認 `.env` 檔案存在且資訊正確
2. 檢查 Supabase 專案是否正常運行
3. 確認已執行兩個 SQL 遷移檔案

### Q: 頁面顯示錯誤？
A: 
1. 檢查終端機是否有錯誤訊息
2. 確認 Node.js 版本 >= 18
3. 嘗試刪除 `.next` 資料夾後重新執行 `npm run dev`

### Q: 熱力圖沒有資料？
A: 這是正常的！目前還沒有已驗證的課程紀錄。需要：
1. 家教建立課程
2. 標記為完成
3. 家長確認
4. 才會在熱力圖顯示

## 需要幫助？

- 查看 [README.md](./README.md) 瞭解專案概況
- 閱讀詳細的文件
- 檢查程式碼中的 `// TODO` 註解了解待開發功能

---

祝您使用愉快！🎓✨


