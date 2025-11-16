# 開發指南

## 專案結構

```
tutor-contra/
├── app/                          # Next.js App Router
│   ├── (app)/                   # 私人頁面（需登入）
│   │   ├── tutor/              # 家教相關頁面
│   │   │   ├── dashboard/      # 家教儀表板
│   │   │   ├── students/       # 學生管理
│   │   │   ├── schedule/       # 課程排程
│   │   │   └── profile/        # 編輯檔案
│   │   └── parent/             # 家長相關頁面
│   │       └── dashboard/      # 家長儀表板
│   ├── (public)/               # 公開頁面
│   │   └── t/[slug]/          # 公開家教檔案
│   ├── api/                    # API 路由
│   │   ├── auth/              # 認證相關
│   │   ├── lessons/           # 課程相關
│   │   └── testimonials/      # 評價相關
│   ├── auth/                   # 認證流程頁面
│   ├── globals.css            # 全域樣式
│   ├── layout.tsx             # 根佈局
│   └── page.tsx               # 首頁
├── components/                 # React 元件
│   ├── ui/                    # 通用 UI 元件
│   ├── tutor/                 # 家教專用元件
│   └── parent/                # 家長專用元件
├── lib/                        # 工具函數與業務邏輯
│   ├── supabase/              # Supabase 客戶端
│   ├── db/                    # 資料庫查詢函數
│   ├── types/                 # TypeScript 型別定義
│   └── utils.ts               # 通用工具函數
├── supabase/                   # Supabase 相關
│   └── migrations/            # 資料庫遷移檔案
└── public/                     # 靜態資源
```

## 資料庫架構

### 核心資料表

1. **tutor_profiles** - 家教檔案
2. **parent_profiles** - 家長檔案
3. **students** - 學生（連結家教與家長）
4. **lessons** - 課程紀錄
5. **lesson_confirmations** - 課程確認狀態
6. **testimonials** - 家長評價

### Row Level Security (RLS)

所有資料表都啟用了 RLS，確保：
- 家教只能看到自己的學生和課程
- 家長只能看到自己孩子的課程
- 公開檔案頁面可以讀取已驗證的課程和公開評價

## 開發流程

### 新增功能

1. **資料庫變更**：在 `supabase/migrations/` 建立新的 SQL 檔案
2. **型別定義**：在 `lib/types/` 更新相關型別
3. **資料庫查詢**：在 `lib/db/` 建立查詢函數
4. **API 路由**：如需 POST/PUT/DELETE 操作，在 `app/api/` 建立路由
5. **UI 元件**：在 `components/` 建立可重用元件
6. **頁面**：在 `app/` 適當位置建立或更新頁面

### 範例：新增功能「家教可以上傳頭像」

1. **資料庫**：`avatar_url` 欄位已存在於 `tutor_profiles`
2. **儲存空間**：在 Supabase 建立 Storage bucket
3. **API**：建立 `app/api/upload-avatar/route.ts`
4. **元件**：建立 `components/tutor/avatar-upload.tsx`
5. **整合**：在 `app/(app)/tutor/profile/page.tsx` 使用元件

## 命名慣例

### 檔案命名
- 頁面：`page.tsx`（Next.js App Router 慣例）
- 元件：`kebab-case.tsx`（例如：`teaching-heatmap.tsx`）
- API 路由：`route.ts`
- 型別檔案：`database.ts`, `api.ts` 等

### 變數命名
- React 元件：`PascalCase`
- 函數：`camelCase`
- 常數：`UPPER_SNAKE_CASE`
- 資料庫欄位：`snake_case`

### 資料庫命名
- 資料表：複數形式（`lessons`, `students`）
- 外鍵：`table_id`（例如：`tutor_id`）
- 布林值：`is_` 或 `has_` 前綴

## 樣式指南

### Tailwind CSS
- 使用語義化的顏色變數（`bg-primary`, `text-muted-foreground`）
- 保持極簡設計風格
- 響應式設計優先（`md:`, `lg:` 等前綴）

### 元件設計
- 小而專注的元件
- 使用 TypeScript 介面定義 props
- 適當使用 Server Components vs Client Components

## 測試重點

### 手動測試檢查清單

#### 認證流程
- [ ] 註冊新使用者
- [ ] 登入現有使用者
- [ ] 登出
- [ ] 選擇角色（家教/家長）
- [ ] 建立個人檔案

#### 家教流程
- [ ] 查看儀表板（統計、熱力圖、學生列表）
- [ ] 新增學生
- [ ] 排程課程
- [ ] 標記課程完成
- [ ] 查看公開檔案頁面

#### 家長流程
- [ ] 查看待確認課程
- [ ] 確認課程
- [ ] 查看歷史記錄
- [ ] 撰寫評價

#### 公開頁面
- [ ] 訪問家教公開檔案
- [ ] 查看教學熱力圖
- [ ] 查看公開評價
- [ ] 統計數字正確顯示

## 效能優化

### Server Components
- 預設使用 Server Components
- 只在需要互動時使用 "use client"

### 資料庫查詢
- 使用 `select` 只取需要的欄位
- 適當使用索引（已在遷移中建立）
- 考慮分頁（目前簡化版未實作）

### 快取策略
- Next.js 自動快取 Server Components
- 考慮使用 `revalidatePath` 更新資料

## 安全性考量

### RLS 策略
- 所有資料表都有 RLS
- 雙重檢查權限邏輯

### 輸入驗證
- API 路由使用 zod 驗證（未來增強）
- 前端表單驗證

### XSS 防護
- React 預設跳脫輸出
- 不使用 `dangerouslySetInnerHTML`

## 未來功能擴充點

目前程式碼已預留以下擴充點：

1. **學生管理完整 CRUD**
2. **課程排程增強**（重複課程、行事曆整合）
3. **頭像上傳**
4. **進階篩選與搜尋**
5. **通知系統**
6. **支付整合**
7. **內部訊息系統**
8. **分析與報表**
9. **匯出功能**
10. **多語言支援**

這些功能點在程式碼中標記為 `// TODO` 註解。


