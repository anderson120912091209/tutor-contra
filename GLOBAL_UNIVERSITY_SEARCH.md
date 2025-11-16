# 全球大學搜尋系統 🌍

## 概覽

我們整合了 **Hipolabs University API**，支援超過 **9,000 所全球大學**的搜尋！

## 🎯 功能特色

### 1. 雙層搜尋系統

#### 本地台灣大學（優先）
- ✅ 即時搜尋
- ✅ 包含排名資訊
- ✅ 標記為「推薦」
- ✅ 高質量數據

#### 全球大學（API）
- ✅ 9,000+ 所大學
- ✅ 涵蓋全球各國
- ✅ 自動獲取官網
- ✅ 國家旗幟顯示

### 2. 智能篩選

快速國家篩選按鈕：
- 🇹🇼 台灣
- 🇺🇸 美國
- 🇬🇧 英國
- 🇨🇦 加拿大
- 🇦🇺 澳洲
- 🇯🇵 日本
- 更多...

### 3. 防抖搜尋

500ms 延遲，避免過多 API 請求，提升效能。

## 🔧 技術實作

### API 端點

```
GET http://universities.hipolabs.com/search?name={query}
GET http://universities.hipolabs.com/search?country={country}
```

### 資料結構

```typescript
interface UniversityAPIResult {
  name: string;              // "Massachusetts Institute of Technology"
  country: string;           // "United States"
  alpha_two_code: string;    // "US"
  domains: string[];         // ["mit.edu"]
  web_pages: string[];       // ["http://web.mit.edu/"]
  state_province?: string;   // "Massachusetts"
}
```

### 快取策略

```typescript
fetch(url, {
  next: { revalidate: 3600 } // 快取 1 小時
})
```

## 🎨 UI/UX 設計

### 搜尋結果分組

```
┌─────────────────────────────────┐
│ 🇹🇼 台灣大學                     │
├─────────────────────────────────┤
│ 🏛️ 國立台灣大學        [推薦]   │
│    台北市 • 排名 #1              │
├─────────────────────────────────┤
│ 🌍 全球大學                      │
├─────────────────────────────────┤
│ 🇺🇸 MIT                          │
│    Massachusetts, United States │
│ 🇬🇧 Oxford University           │
│    Oxford, United Kingdom       │
└─────────────────────────────────┘
```

### 國家篩選器

```
[全部] [台灣] [美國] [英國] [加拿大] [澳洲]
```

點擊即可快速篩選該國大學。

## 📊 資料來源

### Hipolabs University API

- **免費**: 無需 API key
- **涵蓋**: 9,000+ 所大學
- **更新**: 社群維護
- **文檔**: http://universities.hipolabs.com/

### 資料品質

| 資料欄位 | 可用性 |
|---------|--------|
| 大學名稱 | ✅ 100% |
| 國家 | ✅ 100% |
| 官網 | ✅ 95%+ |
| 州/省 | ⚠️ 部分 |
| 排名 | ❌ 無 |

## 🚀 使用範例

### 搜尋台灣大學
```
輸入：台大 / NTU / National Taiwan
→ 顯示本地數據（排名 #1）
```

### 搜尋國際大學
```
輸入：MIT / Harvard / Oxford
→ 從 API 獲取並顯示
```

### 按國家搜尋
```
1. 點擊「美國」篩選
2. 輸入：stanford
→ 只顯示美國的 Stanford
```

## 🎯 Logo 處理

### 台灣大學（本地）
- 使用 Clearbit API
- 高質量 logo
- 包含排名徽章

### 國際大學（API）
- 自動從官網獲取
- Clearbit Logo API
- 國家旗幟作為 fallback

## ⚡ 效能優化

### 1. 防抖 (Debouncing)
```typescript
setTimeout(async () => {
  const results = await searchUniversitiesGlobal(query);
  // ...
}, 500);
```

### 2. 結果限制
- 本地結果：最多 5 所
- 全球結果：最多 10 所

### 3. 快取
- API 回應快取 1 小時
- 減少重複請求

### 4. 分層載入
1. 先顯示本地結果（即時）
2. 再載入全球結果（延遲）

## 🌟 特殊功能

### 國家旗幟 Emoji

自動將國家代碼轉換為旗幟：

```typescript
function getCountryFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// "US" → 🇺🇸
// "GB" → 🇬🇧
```

### ID 生成

自動為任何大學生成唯一 ID：

```typescript
"Massachusetts Institute of Technology"
→ "massachusetts-institute-of-technology"
```

## 📝 使用流程

### 家教新增學歷：

1. 點擊「新增學歷」
2. 輸入大學名稱（中文或英文）
3. 看到搜尋結果：
   - 台灣大學顯示在上方（標記「推薦」）
   - 全球大學顯示在下方
4. 點擊選擇
5. 填寫學位、科系、年份
6. 儲存

### 搜尋技巧：

**英文搜尋更準確**：
```
✅ MIT, Harvard, Oxford
✅ Stanford, Cambridge
```

**支援簡寫**：
```
✅ UCLA → University of California, Los Angeles
✅ NYU → New York University
```

**使用國家篩選**：
```
點擊「美國」→ 輸入「tech」
→ 只顯示美國的理工大學
```

## 🔮 未來增強

### 短期：
- [ ] 加入更多熱門國家快速篩選
- [ ] 顯示大學所在城市
- [ ] 加入大學類型（公立/私立）

### 中期：
- [ ] 整合 QS/THE 世界排名
- [ ] 顯示大學學生人數
- [ ] 加入大學簡介

### 長期：
- [ ] AI 推薦相關大學
- [ ] 大學地圖視圖
- [ ] 校友網絡功能

## 🛠️ 故障排除

### API 無回應
- 系統會自動降級到本地搜尋
- 只顯示台灣大學結果

### 找不到特定大學
1. 嘗試使用英文名稱
2. 檢查拼寫
3. 使用國家篩選縮小範圍
4. 如仍找不到，可以手動輸入

### Logo 無法顯示
- 國際大學會使用國家旗幟
- Clearbit 可能沒有該大學 logo
- 這是正常的 fallback 機制

## 📊 API 限制

Hipolabs API：
- ✅ 無需註冊
- ✅ 無請求限制
- ✅ 免費使用
- ⚠️ 無官方 SLA
- ⚠️ 可能偶爾不穩定

**備用方案**：
1. 本地台灣大學數據始終可用
2. 可以手動輸入任何大學名稱

## 🎉 支援的大學範例

### 美國頂尖大學
- MIT, Harvard, Stanford
- Yale, Princeton, Caltech
- UC Berkeley, UCLA, Columbia

### 英國頂尖大學
- Oxford, Cambridge
- Imperial College, LSE
- UCL, Edinburgh

### 其他知名大學
- 🇨🇦 Toronto, UBC, McGill
- 🇦🇺 Melbourne, Sydney, ANU
- 🇯🇵 Tokyo, Kyoto, Osaka
- 🇸🇬 NUS, NTU
- 🇰🇷 Seoul, KAIST, Yonsei

## 🌍 結論

現在您的平台支援**全球任何大學**！

從台灣的台大到美國的 MIT，
從英國的 Oxford 到日本的東京大學，
全部都可以搜尋並添加！🚀

