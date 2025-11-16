# 社交媒體連結功能 🔗

## 功能概述

在編輯流程的最後一步（第 4 步），教師可以新增他們的社交媒體連結。這些連結會以精美的圖標形式顯示在他們的公開檔案上。

## 🎯 支援的社交平台

### 1. Facebook
- **圖標**：Facebook logo
- **顏色**：藍色 (#1877F2)
- **URL 格式**：`https://facebook.com/yourpage`

### 2. Instagram
- **圖標**：Instagram logo
- **顏色**：粉紅色/紫色漸層 (#E4405F)
- **URL 格式**：`https://instagram.com/yourusername`

### 3. Threads
- **圖標**：Threads logo
- **顏色**：黑色
- **URL 格式**：`https://threads.net/@yourusername`

### 4. GitHub
- **圖標**：GitHub logo
- **顏色**：深灰色 (#181717)
- **URL 格式**：`https://github.com/yourusername`

## 📊 數據結構

### 資料庫 Schema
```sql
ALTER TABLE tutor_profiles
ADD COLUMN social_links JSONB DEFAULT '{}'::jsonb;
```

### TypeScript 類型
```typescript
export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  threads?: string;
  github?: string;
}

export interface TutorProfile {
  // ... other fields
  social_links: SocialLinks;
}
```

### JSON 儲存格式
```json
{
  "facebook": "https://facebook.com/johntutor",
  "instagram": "https://instagram.com/johntutor",
  "threads": "https://threads.net/@johntutor",
  "github": "https://github.com/johntutor"
}
```

## 🎨 UI/UX 設計

### 編輯介面（第 4 步）

#### 佈局
```
┌─────────────────────────────────────┐
│ 社交連結                             │
│ 社交媒體帳號                          │
├─────────────────────────────────────┤
│                                     │
│ 新增您的社交媒體連結，讓家長更了解您    │
│                                     │
│ [Facebook圖標] Facebook              │
│ https://facebook.com/yourpage       │
│                                     │
│ [Instagram圖標] Instagram           │
│ https://instagram.com/yourusername  │
│                                     │
│ [Threads圖標] Threads               │
│ https://threads.net/@yourusername   │
│                                     │
│ [GitHub圖標] GitHub                 │
│ https://github.com/yourusername     │
│                                     │
│ 💡 提示                              │
│ 這些連結是選填的。添加社交媒體可以讓   │
│ 家長更全面地了解您的教學風格和專業背景。│
└─────────────────────────────────────┘
```

#### 特點
- ✅ 每個平台都有對應的彩色圖標
- ✅ 清楚的 placeholder 顯示 URL 格式
- ✅ 提示訊息說明這是選填的
- ✅ 簡潔的設計，不會感到壓力

### 公開檔案顯示

#### 位置
顯示在教師名稱的右側，與標題平行：

```
┌──────────────────────────────────────────┐
│ 陳老師                    [圖] [圖] [圖]   │
└──────────────────────────────────────────┘
```

#### 圖標設計
```css
/* 基礎樣式 */
- 圓形背景
- 白色底色 + 灰色邊框
- 灰色圖標

/* Hover 效果 */
- 放大 10%
- 背景變成平台顏色
- 圖標變成白色
- 顯示陰影
- 平滑動畫
```

#### 實際效果
```
默認狀態：
○ ○ ○ ○  （灰色圓圈，白底，灰色圖標）

Hover 狀態：
● ○ ○ ○  （放大，藍色底，白色圖標）
```

## 🔄 用戶流程

### 教師編輯流程
```
1. 完成基本資訊（步驟 1）
2. 完成教學資訊（步驟 2）
3. 完成學歷背景（步驟 3）
4. 進入社交連結（步驟 4）
   → 看到 4 個輸入框
   → 選擇要填寫的平台
   → 輸入完整 URL
5. 點擊「完成」
6. 儲存成功
```

### 家長瀏覽流程
```
1. 進入教師公開檔案
2. 看到教師名稱旁邊有社交圖標
3. Hover 看到平台名稱
4. 點擊圖標
5. 在新分頁打開社交媒體頁面
6. 更全面了解教師
```

## 💡 進度計算

### 更新後的進度系統
```typescript
const completionPercentage = () => {
  let completed = 0;
  let total = 8;  // 從 7 增加到 8

  if (displayName) completed++;              // 12.5%
  if (bio) completed++;                      // 12.5%
  if (subjects.length > 0) completed++;      // 12.5%
  if (location) completed++;                 // 12.5%
  if (yearsExperience) completed++;          // 12.5%
  if (education.length > 0) completed += 2;  // 25%
  if (hasSocialLinks) completed++;           // 12.5%

  return Math.round((completed / total) * 100);
};
```

### 進度對照表
| 完成項目 | 進度 |
|---------|------|
| 姓名 | 12% |
| + 自我介紹 | 25% |
| + 科目 | 37% |
| + 地點 | 50% |
| + 年資 | 62% |
| + 學歷 | 87% |
| + 社交連結 | 100% |

## 🎯 驗證邏輯

### URL 驗證（Zod Schema）
```typescript
const socialLinksSchema = z.object({
  facebook: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  threads: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
});
```

### 特點
- ✅ 驗證是否為有效的 URL
- ✅ 允許空字串（選填）
- ✅ 儲存前清理空字串

### 資料清理
```typescript
const cleanSocialLinks = validatedData.social_links
  ? Object.fromEntries(
      Object.entries(validatedData.social_links)
        .filter(([_, value]) => value && value.trim() !== "")
    )
  : {};
```

**目的**：只儲存有值的連結，避免資料庫存儲空字串。

## 🎨 圖標設計細節

### SVG 圖標
所有圖標都是內聯 SVG，優點：
- ✅ 不需額外 HTTP 請求
- ✅ 可以用 CSS 控制顏色
- ✅ 支援 Hover 動畫
- ✅ 完美的清晰度（向量圖）

### 互動效果
```css
/* 預設 */
.social-icon {
  padding: 10px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  background: white;
  color: #6b7280;
  transition: all 200ms;
}

/* Hover - Facebook */
.social-icon:hover {
  background: #1877F2;
  color: white;
  border-color: transparent;
  transform: scale(1.1);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
```

### 響應式設計
```
桌面版：
- 圖標大小：40px × 40px
- 間距：12px
- 顯示在右上角

平板版：
- 圖標大小：36px × 36px
- 間距：10px

手機版：
- 圖標大小：32px × 32px
- 間距：8px
- 或移到名稱下方一排
```

## 📊 資料流程

### 1. 教師輸入
```
表單 (SocialLinksEditor)
↓
State 更新 (setSocialLinks)
↓
即時預覽更新 (ProfilePreview)
```

### 2. 儲存到資料庫
```
點擊「完成」
↓
POST /api/tutor/profile
↓
Zod 驗證
↓
清理空字串
↓
更新 Supabase
↓
返回成功
```

### 3. 公開顯示
```
訪問 /t/[slug]
↓
查詢 tutor_profiles
↓
獲取 social_links JSON
↓
渲染 SocialLinksDisplay
↓
顯示圖標
```

## 🔮 未來增強

### Phase 2（可選平台）
- [ ] LinkedIn
- [ ] Twitter/X
- [ ] YouTube
- [ ] TikTok
- [ ] Medium
- [ ] 個人網站

### Phase 3（進階功能）
- [ ] 自動驗證帳號存在
- [ ] 顯示關注人數
- [ ] 顯示最新貼文
- [ ] 一鍵分享到社交媒體

### Phase 4（AI 功能）
- [ ] 從社交媒體自動填充簡介
- [ ] 分析社交媒體活躍度
- [ ] 推薦關聯教師

## 💪 優勢總結

### 對教師的好處
1. **建立信任**：家長可以看到真實的社交媒體
2. **展示專業**：GitHub 展示技術能力
3. **個人品牌**：統一線上形象
4. **增加曝光**：多個渠道展示

### 對家長的好處
1. **更多資訊**：全面了解教師
2. **真實性驗證**：可以查看社交媒體
3. **教學風格**：從貼文了解教學理念
4. **互動機會**：可以追蹤教師動態

### 對平台的好處
1. **提高完整度**：鼓勵教師填寫更多資訊
2. **增加信任度**：透明化資訊
3. **差異化功能**：其他平台可能沒有
4. **SEO 優化**：更多外部連結

## 🎯 設計原則

### 1. **選填不強制**
- 不是所有教師都有社交媒體
- 不應成為使用障礙
- 但鼓勵填寫（進度條）

### 2. **視覺清晰**
- 每個平台有獨特顏色
- 圖標易於識別
- Hover 效果明顯

### 3. **安全性**
- 使用 `target="_blank"`
- 添加 `rel="noopener noreferrer"`
- URL 格式驗證

### 4. **效能優化**
- 內聯 SVG（不需載入圖片）
- 條件渲染（沒有連結就不顯示）
- 輕量級動畫

## 📝 使用範例

### 教師端
```tsx
<SocialLinksEditor
  socialLinks={{
    facebook: "https://facebook.com/mathtutor",
    instagram: "https://instagram.com/mathtutor",
    github: "https://github.com/mathtutor"
  }}
  onChange={(links) => setSocialLinks(links)}
/>
```

### 公開端
```tsx
<SocialLinksDisplay
  socialLinks={{
    facebook: "https://facebook.com/mathtutor",
    instagram: "https://instagram.com/mathtutor",
    github: "https://github.com/mathtutor"
  }}
/>
```

結果：
```
[F] [I] [G]  （三個漂亮的圓形圖標）
```

---

**現在教師可以展示他們的社交媒體！** 🎉

第 4 步讓教師輕鬆添加社交連結，公開檔案上美觀的圖標讓家長一鍵訪問，建立更深的信任和連結！

