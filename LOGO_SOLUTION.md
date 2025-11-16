# 大學 Logo 智能方案 🎨

## 問題
手動為每個大學添加 SVG logo 不切實際且難以維護。

## 解決方案：多層次 Fallback 系統

### 🌟 方法 1: Clearbit Logo API（主要）
**免費、高質量、自動**

```typescript
const clearbitUrl = `https://logo.clearbit.com/${domain}`;
```

**優點：**
- ✅ 完全免費
- ✅ 高質量 SVG/PNG
- ✅ 自動獲取（通過網站域名）
- ✅ 覆蓋大多數知名機構
- ✅ 自動更新（logo 變更時）

**如何使用：**
```tsx
<Image 
  src={`https://logo.clearbit.com/www.ntu.edu.tw`}
  alt="NTU Logo"
  width={64}
  height={64}
/>
```

### 🔄 方法 2: Google Favicon API（備用）
當 Clearbit 無法加載時自動使用

```typescript
const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
```

### 🎯 方法 3: Emoji（最終備用）
如果前兩個都失敗，顯示 emoji

## 🏗️ 架構設計

### 新增元件：

#### 1. `UniversityLogo` 元件
智能處理 logo 加載：
- 嘗試 Clearbit API
- 失敗時嘗試 Favicon
- 都失敗時顯示 emoji
- 加載時顯示骨架屏

#### 2. `UniversityCard` 元件
精美的大學卡片：
- Logo + Hover Card
- 學位與科系資訊
- 年份範圍
- 排名徽章
- 漸變背景
- 懸停動畫

## 🎨 UI 特色

### 視覺效果：
1. **Logo 環**：Logo 周圍有微妙的環效果
2. **漸變背景**：白色到淺灰的漸變
3. **排名徽章**：黃橙色漸變圓形徽章
4. **前三名特效**：Top 3 有跳動的獎杯 emoji
5. **懸停效果**：
   - Logo 放大
   - 卡片陰影增強
   - 環效果高亮

### 響應式設計：
- 桌面：大卡片，完整資訊
- 平板：中等尺寸
- 手機：堆疊佈局

## 📊 效能優化

### 圖片優化：
```tsx
<Image
  src={logoUrl}
  width={64}
  height={64}
  loading="lazy"  // 延遲加載
  quality={90}    // 高質量
/>
```

### 錯誤處理：
```typescript
onError={() => {
  // 自動嘗試備用方案
  tryFallbackLogo();
}}
```

### 加載狀態：
```tsx
{loading && (
  <div className="animate-pulse">
    {/* 骨架屏 */}
  </div>
)}
```

## 🚀 使用範例

### 基本使用：
```tsx
<UniversityLogo
  university={university}
  size={64}
/>
```

### 完整卡片：
```tsx
<UniversityCard
  university={university}
  degree="學士"
  major="資訊工程學系"
  startYear={2015}
  endYear={2019}
  size="lg"
/>
```

## 🎯 替代方案

如果 Clearbit 不夠用，還有這些選項：

### A. Brandfetch API
```bash
https://api.brandfetch.io/v2/brands/{domain}
```
- 需要 API key（有免費額度）
- 更多品牌資訊

### B. 手動優質 Logo（推薦混合）
對於台灣前 10 大學，可以放在 `public/logos/`:
```
public/logos/
├── ntu.svg
├── nthu.svg
├── nycu.svg
└── ...
```

然後優先檢查本地：
```typescript
const localLogo = `/logos/${university.id}.svg`;
// 如果存在用本地，否則用 Clearbit
```

### C. Logo CDN（進階）
建立自己的 logo CDN：
```bash
https://your-cdn.com/university-logos/{id}.svg
```

## 💡 最佳實踐

### 1. 優先級：
```
本地高質量 SVG > Clearbit API > Google Favicon > Emoji
```

### 2. 快取策略：
```tsx
<Image
  src={logoUrl}
  unoptimized={false}  // 啟用 Next.js 優化
/>
```

### 3. 預加載重要 Logo：
```tsx
<link
  rel="preload"
  as="image"
  href={clearbitUrl}
/>
```

## 🔧 維護指南

### 添加新大學：
1. 在 `universities.ts` 加入大學資料
2. 確保 `website` 欄位正確
3. Logo 會自動通過 Clearbit 獲取

### 更換特定 Logo：
1. 下載高質量 SVG
2. 放到 `public/logos/{id}.svg`
3. 修改 `UniversityLogo` 優先使用本地

### 監控 Logo 質量：
定期檢查 Clearbit 是否成功加載：
```bash
# 測試腳本
curl -I https://logo.clearbit.com/www.ntu.edu.tw
```

## 🎉 效果展示

### Before（Emoji）：
```
🏛️ 國立台灣大學
```

### After（真實 Logo）：
```
[NTU Logo SVG] 國立台灣大學 [台灣 #1 徽章]
```

## 📈 擴展性

### 支援國際大學：
只需在資料庫加入：
```typescript
{
  id: "mit",
  name: "Massachusetts Institute of Technology",
  website: "https://www.mit.edu",
  // Clearbit 會自動處理
}
```

### 批次處理：
```typescript
const logos = await Promise.all(
  universities.map(uni => 
    fetch(`https://logo.clearbit.com/${getDomain(uni.website)}`)
  )
);
```

## 🔒 備用計畫

如果 Clearbit 未來收費或關閉：
1. 已有 Google Favicon 作為備用
2. 可快速切換到其他 API
3. 本地 logo 不受影響
4. Emoji 永遠可用

---

**總結：** 這個方案讓你無需手動管理 logo，同時保持高質量展示。完全自動化且易於維護！🚀

