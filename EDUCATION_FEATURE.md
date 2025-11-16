# 學歷功能與內聯編輯器 🎓

## 新功能概覽

我們重新設計了檔案編輯體驗，並加入了完整的學歷系統！

### ✨ 主要改進

1. **內聯編輯器（Inline Editor）**
   - 不再是傳統的表單介面
   - 點擊任何區塊即可編輯
   - 即時預覽效果
   - 更直觀的編輯體驗

2. **學歷系統**
   - 台灣前 10 大學資料庫（含排名、簡介）
   - 自動完成搜尋功能
   - 精美的展示 UI
   - Hover 顯示大學詳細資訊
   - 可點擊的大學 logo 連結到官網

3. **公開檔案增強**
   - 學歷區塊獨立展示
   - 大學 logo + 排名徽章
   - Hover Card 顯示更多資訊

## 🗄️ 資料庫遷移

**重要：** 您需要執行新的 SQL 遷移來支援學歷功能。

### 步驟：

1. 前往 Supabase Dashboard
2. 進入 **SQL Editor**
3. 複製並執行 `supabase/migrations/003_add_education.sql`

```sql
-- Add education field to tutor_profiles
ALTER TABLE tutor_profiles
ADD COLUMN education JSONB DEFAULT '[]'::jsonb;

CREATE INDEX idx_tutor_profiles_education ON tutor_profiles USING GIN (education);
```

### 資料結構：

```typescript
interface Education {
  university: string;        // "國立台灣大學"
  universityId: string;     // "ntu"
  degree: string;           // "學士" | "碩士" | "博士"
  major: string;            // "資訊工程學系"
  startYear: number;        // 2015
  endYear?: number;         // 2019 (可選，在學中可不填)
}
```

## 🎨 新元件

### 1. InlineProfileEditor
**位置：** `components/tutor/inline-profile-editor.tsx`

所見即所得的編輯器，點擊任何欄位即可編輯：
- 顯示名稱
- 個人簡介
- 教學科目
- 地區、年資
- 線上教學開關
- **學歷區塊（新）**

### 2. EducationEditor
**位置：** `components/tutor/education-editor.tsx`

學歷編輯元件：
- 新增/編輯/刪除學歷
- 支援多筆學歷記錄
- 學位選擇（學士/碩士/博士）
- 主修科系輸入
- 起訖年份

### 3. UniversityAutocomplete
**位置：** `components/tutor/university-autocomplete.tsx`

大學自動完成元件：
- 即時搜尋台灣大學
- 顯示大學 logo、名稱、地點、排名
- 點擊選擇

### 4. EducationDisplay
**位置：** `components/tutor/education-display.tsx`

公開檔案學歷展示：
- 大學 logo（可點擊連官網）
- Hover 顯示大學詳細資訊
- 排名徽章
- 學位、科系、年份資訊

### 5. HoverCard
**位置：** `components/ui/hover-card.tsx`

通用 Hover Card 元件，用於顯示額外資訊。

## 📚 大學資料庫

**位置：** `lib/data/universities.ts`

目前包含台灣前 10 所大學：
1. 🏛️ 國立台灣大學（台大）
2. 🎓 國立清華大學（清大）
3. 🔬 國立陽明交通大學（陽明交大）
4. 🏫 國立成功大學（成大）
5. 📚 國立中央大學（中央）
6. 🌊 國立中山大學（中山）
7. 🌳 國立中興大學（中興）
8. 👨‍🏫 國立台灣師範大學（師大）
9. ⚖️ 國立政治大學（政大）
10. 🏰 淡江大學（淡江）

每所大學包含：
- 中英文名稱
- Logo（目前使用 emoji，未來可替換為真實 logo）
- 簡介
- 台灣排名
- 官網連結
- 所在地點

### 擴充大學資料庫：

編輯 `lib/data/universities.ts`，加入更多大學：

```typescript
{
  id: "ntust",
  name: "國立台灣科技大學",
  nameEn: "National Taiwan University of Science and Technology",
  shortName: "台科大",
  logo: "🔧",
  description: "技術與設計並重的科技大學",
  ranking: 11,
  website: "https://www.ntust.edu.tw",
  location: "台北市",
}
```

## 🚀 使用方式

### 家教端操作：

1. 登入家教帳號
2. 前往「編輯檔案」（`/tutor/profile`）
3. 向下滾動到「學歷」區塊
4. 點擊「+ 新增學歷」
5. 輸入大學名稱（會自動顯示建議）
6. 選擇學位、填寫科系、輸入年份
7. 點擊「儲存檔案」
8. 前往公開檔案查看效果

### 家長/訪客體驗：

1. 訪問家教公開檔案（`/t/[slug]`）
2. 在「學歷」區塊看到家教的教育背景
3. Hover 在大學 logo 上查看更多資訊：
   - 大學完整名稱
   - 英文名稱
   - 簡介說明
   - 台灣排名
   - 所在地點
   - 官網連結
4. 點擊 logo 可直接前往大學官網

## 🎯 UX 亮點

### 1. 所見即所得
不需要在複雜的表單中填寫，直接在接近最終展示的介面上編輯。

### 2. 智慧自動完成
輸入「台」就會顯示台大、台科大等建議，無需完整輸入。

### 3. 資訊分層
- 基本資訊：一眼可見
- 詳細資訊：Hover 顯示
- 官網連結：點擊前往

### 4. 視覺回饋
- 編輯中的欄位高亮顯示
- Hover 效果提示可互動
- 儲存成功後顯示提示訊息

## 🔄 API 更新

**PUT /api/tutor/profile**

新增 `education` 欄位支援：

```typescript
{
  display_name: string;
  bio: string | null;
  subjects: string[];
  location: string | null;
  teaches_online: boolean;
  years_experience: number | null;
  education: Education[];  // 新增！
}
```

## 🧪 測試建議

1. **新增學歷**：測試搜尋、選擇、填寫流程
2. **編輯學歷**：修改現有學歷資訊
3. **刪除學歷**：移除不需要的學歷
4. **多筆學歷**：測試新增 2-3 筆學歷的顯示
5. **公開檔案**：確認 Hover Card 正常運作
6. **響應式**：測試手機版顯示

## 🎨 未來增強

### 短期（建議）：
- [ ] 更換 emoji 為真實大學 logo 圖片
- [ ] 加入更多台灣大學（私立、科技大學）
- [ ] 支援國外大學
- [ ] 學歷驗證徽章（已驗證的學歷加上✓標記）

### 中期：
- [ ] 上傳學歷證明文件
- [ ] 自動從大學 API 抓取最新排名
- [ ] 大學校友網絡（同校的其他家教）
- [ ] 科系推薦（根據教學科目）

### 長期：
- [ ] 學歷對教學成效的分析
- [ ] 家長可篩選特定學歷背景的家教
- [ ] 證書與專業認證系統

## 💡 技巧

### 快速切換編輯模式
連按兩下任何文字區塊即可快速進入編輯狀態。

### 批次編輯
先編輯所有欄位，最後一次儲存即可。

### 預覽公開效果
在新分頁開啟公開檔案，編輯後重新整理即可看到最新版本。

---

有任何問題或建議，歡迎回報！🚀

