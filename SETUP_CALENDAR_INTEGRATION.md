# 日曆整合設置指南 🔧

## 📋 前置準備

### 1. 安裝依賴套件

```bash
npm install googleapis @notionhq/client
```

### 2. 運行數據庫遷移

在 Supabase Dashboard 的 SQL Editor 中運行：

```sql
-- 檔案：supabase/migrations/006_add_availability.sql
-- 複製整個文件內容並執行
```

## 🔐 Google Calendar 設置

### Step 1: 創建 Google Cloud Project

1. 訪問 [Google Cloud Console](https://console.cloud.google.com/)
2. 點擊 "Select a project" → "New Project"
3. 輸入項目名稱：`tutor-contra` → 點擊 "Create"

### Step 2: 啟用 Google Calendar API

1. 在左側菜單選擇 "APIs & Services" → "Library"
2. 搜尋 "Google Calendar API"
3. 點擊並選擇 "Enable"

### Step 3: 設置 OAuth 2.0

1. 在左側菜單選擇 "APIs & Services" → "Credentials"
2. 點擊 "Create Credentials" → "OAuth client ID"
3. 如果提示需要配置 OAuth consent screen：
   - User Type: External
   - App name: Tutor Contra
   - User support email: your@email.com
   - Developer contact: your@email.com
   - Scopes: 添加 `../auth/calendar` scope
   - Test users: 添加您的測試帳號
   - 點擊 "Save and Continue"

4. 創建 OAuth Client ID：
   - Application type: Web application
   - Name: Tutor Contra Web Client
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `https://yourdomain.com` (生產環境)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/calendar/google/callback`
     - `https://yourdomain.com/api/calendar/google/callback`
   - 點擊 "Create"

5. 複製 Client ID 和 Client Secret

### Step 4: 添加到環境變數

在 `.env.local` 中添加：

```bash
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

## 📝 Notion Calendar 設置

### Step 1: 創建 Notion Integration

1. 訪問 [Notion Integrations](https://www.notion.so/my-integrations)
2. 點擊 "+ New integration"
3. 填寫資訊：
   - Name: Tutor Contra
   - Logo: (可選)
   - Associated workspace: 選擇您的工作區
   - Type: Public
4. 點擊 "Submit"

### Step 2: 設置 OAuth

1. 在 Integration 設置頁面
2. 找到 "OAuth Domain & URIs" 部分
3. 添加 Redirect URIs:
   - `http://localhost:3000/api/calendar/notion/callback`
   - `https://yourdomain.com/api/calendar/notion/callback`
4. 複製 OAuth client ID 和 OAuth client secret

### Step 3: 設置 Capabilities

在 "Capabilities" 部分啟用：
- ✅ Read content
- ✅ Update content
- ✅ Insert content

### Step 4: 添加到環境變數

在 `.env.local` 中添加：

```bash
NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
```

## 🚀 測試集成

### 測試 Google Calendar

1. 啟動開發服務器：
```bash
npm run dev
```

2. 訪問 `http://localhost:3000/tutor/profile`

3. 進入「可用時間」步驟

4. 點擊 "連結 Google Calendar"

5. 授權後應該看到 "✓ 已連結"

### 測試 Notion Calendar

1. 在同一頁面點擊 "連結 Notion Calendar"

2. 選擇要連結的工作區

3. 授權後應該看到 "✓ 已連結"

## 🔍 故障排除

### Google Calendar 錯誤

#### 錯誤：redirect_uri_mismatch
```
Error: redirect_uri_mismatch
```

**解決方案**：
1. 確保 `.env.local` 中的 `NEXT_PUBLIC_APP_URL` 正確
2. 在 Google Cloud Console 中檢查 Redirect URI 是否完全匹配
3. 注意 `http` vs `https` 和結尾斜線

#### 錯誤：invalid_scope
```
Error: invalid_scope
```

**解決方案**：
1. 在 OAuth consent screen 中添加 Calendar scope
2. Scopes: `https://www.googleapis.com/auth/calendar`

### Notion Calendar 錯誤

#### 錯誤：unauthorized_client
```
Error: unauthorized_client
```

**解決方案**：
1. 確保 Redirect URI 在 Notion Integration 設置中正確配置
2. 檢查 Client ID 和 Secret 是否正確

#### 錯誤：access_denied
```
Error: access_denied
```

**解決方案**：
1. 用戶在授權頁面點擊了拒絕
2. 確保 Integration 有正確的 Capabilities
3. 重新嘗試授權

## 📊 驗證設置

### 檢查數據庫

```sql
-- 查看教師的日曆設置
SELECT 
  display_name,
  google_calendar_enabled,
  notion_calendar_enabled
FROM tutor_profiles
WHERE user_id = 'your_user_id';
```

### 查看可用時間

```sql
-- 查看教師的可用時間設定
SELECT *
FROM tutor_availability
WHERE tutor_id = 'tutor_profile_id'
ORDER BY day_of_week, start_time;
```

## 🎯 完整的 .env.local 範例

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Calendar OAuth
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx

# Notion OAuth
NOTION_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NOTION_CLIENT_SECRET=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## ✅ 設置檢查清單

### 數據庫
- [ ] 運行遷移 006_add_availability.sql
- [ ] 驗證 tutor_availability 表已創建
- [ ] 驗證 tutor_profiles 表已添加日曆欄位

### Google Calendar
- [ ] 創建 Google Cloud Project
- [ ] 啟用 Google Calendar API
- [ ] 創建 OAuth 2.0 Client ID
- [ ] 配置 Redirect URIs
- [ ] 複製 Client ID 和 Secret
- [ ] 添加到 .env.local

### Notion Calendar
- [ ] 創建 Notion Integration
- [ ] 設置 OAuth Redirect URIs
- [ ] 啟用必要的 Capabilities
- [ ] 複製 Client ID 和 Secret
- [ ] 添加到 .env.local

### 測試
- [ ] 重啟開發服務器
- [ ] 測試 Google Calendar 連結
- [ ] 測試 Notion Calendar 連結
- [ ] 創建測試可用時間
- [ ] 驗證公開檔案顯示

## 🔄 自動同步測試

### 創建測試課程

```typescript
// 測試腳本
const testLesson = {
  tutor_id: 'tutor_id',
  student_id: 'student_id',
  scheduled_at: new Date('2024-01-15T14:00:00+08:00'),
  duration_minutes: 60,
  subject: '數學',
};

// 應該自動：
// 1. 在 Google Calendar 創建事件
// 2. 在 Notion 創建頁面
// 3. 保存 event_id 和 page_id 到數據庫
```

## 📝 注意事項

### 生產環境部署

1. **更新 Redirect URIs**：
   - 在 Google Cloud Console 添加生產 URL
   - 在 Notion Integration 添加生產 URL

2. **環境變數**：
   - 在 Vercel/Netlify 等平台設置環境變數
   - 確保 `NEXT_PUBLIC_APP_URL` 指向正確的域名

3. **OAuth Consent Screen**：
   - Google: 從 Testing 改為 Published
   - 可能需要 Google 審核（如果使用敏感 scope）

4. **安全性**：
   - 永遠不要提交 `.env.local` 到 Git
   - 使用 Secret 管理工具
   - 定期輪換 Client Secrets

---

**設置完成後，您就可以使用完整的日曆整合功能了！** 📅✨

