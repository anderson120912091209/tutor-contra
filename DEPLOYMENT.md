# 部署指南

## 前置需求

1. Node.js 18+ 和 npm
2. Supabase 專案（免費方案即可開始使用）

## 步驟 1: 設定 Supabase

1. 前往 [Supabase](https://supabase.com) 建立新專案
2. 在專案中，前往 **SQL Editor**
3. 依序執行以下 SQL 檔案：
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`

## 步驟 2: 環境變數設定

1. 複製 `.env.example` 為 `.env`：
```bash
cp .env.example .env
```

2. 在 Supabase 專案設定中找到以下資訊並填入 `.env`：
   - 前往 **Settings** > **API**
   - 複製 **Project URL** 到 `NEXT_PUBLIC_SUPABASE_URL`
   - 複製 **anon public** key 到 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 步驟 3: 安裝依賴

```bash
npm install
```

## 步驟 4: 本地開發

```bash
npm run dev
```

應用程式將在 http://localhost:3000 啟動

## 步驟 5: 部署到 Vercel（建議）

1. 將程式碼推送到 GitHub
2. 前往 [Vercel](https://vercel.com)
3. 匯入 GitHub 專案
4. 在環境變數設定中加入：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. 部署！

## 驗證部署

部署完成後，測試以下流程：

1. ✅ 註冊新帳號
2. ✅ 選擇角色（家教或家長）
3. ✅ 建立個人檔案
4. ✅ 家教：查看儀表板
5. ✅ 家教：訪問公開檔案頁面 `/t/[your-slug]`
6. ✅ 家長：查看儀表板

## 疑難排解

### 無法連接到 Supabase
- 確認環境變數正確設定
- 檢查 Supabase 專案是否正常運行
- 確認已執行所有 SQL 遷移

### 頁面顯示 404
- 確認 Next.js 路由結構正確
- 檢查是否有未編譯的 TypeScript 錯誤

### RLS 權限錯誤
- 確認已執行 `002_rls_policies.sql`
- 檢查使用者是否已登入
- 驗證資料庫策略是否正確套用

## 進階設定

### 自訂網域
在 Vercel 專案設定中加入自訂網域

### Email 認證
在 Supabase 專案設定中：
1. 前往 **Authentication** > **Email Templates**
2. 自訂註冊確認信件模板
3. 設定 **Site URL** 為您的網域

### 儲存空間（頭像上傳）
未來功能：在 Supabase Storage 設定圖片上傳桶


