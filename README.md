# 家教聲譽平台 Tutor Contra

一個為私人家教打造的「活履歷」平台，提供第三方課程驗證與公開個人檔案。

## 技術架構

- **前端**: Next.js 15 (App Router) + TypeScript + React
- **樣式**: Tailwind CSS (極簡風格)
- **後端/資料庫**: Supabase (PostgreSQL + Auth)
- **認證**: Supabase Auth

## 開始使用

1. 安裝依賴：
```bash
npm install
```

2. 設定環境變數：
複製 `.env.example` 為 `.env` 並填入你的 Supabase 憑證

3. 在 Supabase 執行資料庫遷移：
見 `supabase/migrations/` 資料夾

4. 啟動開發伺服器：
```bash
npm run dev
```

5. 開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 核心功能

### 家教端
- 私人儀表板（今日課程、教學熱力圖、學生列表、聲譽統計）
- 課程排程與管理
- 公開個人檔案頁

### 家長端
- 課程確認功能
- 歷史紀錄查看
- 撰寫評價

### 公開功能
- 家教公開個人檔案
- 已驗證課程熱力圖
- 家長評價展示

## 專案結構

```
app/
├── (app)/              # 私人頁面（需登入）
│   ├── tutor/         # 家教儀表板
│   └── parent/        # 家長入口
├── (public)/          # 公開頁面
│   └── t/[slug]/     # 公開家教檔案
├── api/               # API 路由
└── auth/              # 認證相關頁面

lib/
├── supabase/          # Supabase 客戶端工具
├── db/                # 資料庫查詢函數
└── utils/             # 通用工具函數

components/
├── tutor/             # 家教專用元件
├── parent/            # 家長專用元件
└── ui/                # 共用 UI 元件

supabase/
└── migrations/        # 資料庫遷移檔案
```

## 資料模型

- **User**: Supabase Auth 使用者
- **TutorProfile**: 家教個人檔案
- **ParentProfile**: 家長檔案
- **Student**: 學生（家教-家長關聯）
- **Lesson**: 課程紀錄
- **LessonConfirmation**: 課程確認狀態
- **Testimonial**: 家長評價

## 開發原則

- 類型安全優先（TypeScript everywhere）
- 元件小而可重用
- 極簡 UX 與語意化設計
- Server Components 優先，Client Components 用於互動


