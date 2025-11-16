# 分屏編輯器設計 📝

## 設計概念

參考現代履歷編輯器（如 TopResume），採用**左右分屏**設計：
- **左側**：表單輸入區域
- **右側**：即時預覽區域

## 🎨 UI 架構

```
┌────────────────────────────────────────────────────────────┐
│  ← 回儀表板  |  編輯個人檔案    [查看公開頁] [儲存變更]     │  ← Top Bar
├──────────────────────┬─────────────────────────────────────┤
│                      │                                     │
│  📝 表單輸入          │  👁️  即時預覽                        │
│                      │                                     │
│  基本資訊             │  ┌─────────────────────────────┐   │
│  ├─ 顯示名稱         │  │                             │   │
│  ├─ 個人簡介         │  │    王老師                    │   │
│  └─ 教學科目         │  │    數學、物理專業教師          │   │
│                      │  │                             │   │
│  教學資訊             │  │    📚 數學 物理 化學         │   │
│  ├─ 地區             │  │    📍 台北市                │   │
│  ├─ 年資             │  │    👨‍🏫 5年經驗              │   │
│  └─ 線上教學         │  │    💻 提供線上教學           │   │
│                      │  │                             │   │
│  學歷背景             │  │    ─────────                │   │
│  + 新增學歷          │  │    學歷背景                  │   │
│                      │  │    🏛️ 台大 資工系           │   │
│  [💾 儲存所有變更]    │  └─────────────────────────────┘   │
│                      │                                     │
│                      │  即時預覽                            │
│  (可滾動)            │  (可滾動)                           │
│                      │                                     │
└──────────────────────┴─────────────────────────────────────┘
```

## ✨ 主要特色

### 1. **即時預覽**
- 任何輸入變更立即反映在右側
- 無需儲存即可看到效果
- 完全模擬公開頁面外觀

### 2. **分段式表單**
```
基本資訊
├─ 顯示名稱 (必填)
├─ 個人簡介 (建議)
└─ 教學科目 (必填)

教學資訊
├─ 地區
├─ 教學年資
└─ 線上教學選項

學歷背景
└─ 可新增多筆學歷
```

### 3. **智能提示**
- 必填欄位標記 `*`
- 欄位說明與範例
- 空白狀態提示

### 4. **Sticky Top Bar**
- 固定在頂部
- 快速存取儲存按鈕
- 顯示儲存狀態

## 🎯 元件架構

### 1. ProfileEditorSplit (主元件)
**位置**: `components/tutor/profile-editor-split.tsx`

**職責**:
- 管理表單狀態
- 處理儲存邏輯
- 協調左右兩側

**特色**:
- 單一狀態管理
- 即時同步到預覽
- 自動防抖儲存（可選）

### 2. ProfilePreview (預覽元件)
**位置**: `components/tutor/profile-preview.tsx`

**職責**:
- 顯示公開頁面預覽
- 使用相同的顯示元件
- 響應式設計

**特色**:
- 完全模擬公開頁
- 空白狀態處理
- 提示完善資訊

## 📐 佈局細節

### 尺寸規格
```css
Top Bar: height: 73px (固定)
Left Panel: width: 50%
Right Panel: width: 50%
Content Height: calc(100vh - 73px)
```

### 響應式設計
```
Desktop (1024px+):
├─ 50% | 50% 分屏

Tablet (768px - 1023px):
├─ 上下堆疊
├─ 表單在上
└─ 預覽在下

Mobile (< 768px):
└─ 只顯示表單
    └─ 預覽按鈕打開modal
```

## 🎨 樣式指南

### 顏色
```css
Background (Left): white
Background (Right): gray-50
Border: gray-200
Primary: 根據 theme
```

### 間距
```css
Section Gap: 2rem (8)
Field Gap: 1rem (4)
Padding: 2rem (8)
```

### 字體
```css
Title: text-xl font-semibold
Label: text-sm font-medium
Input: text-sm
Hint: text-xs text-muted-foreground
```

## 🔄 資料流

### 表單 → 預覽
```typescript
1. 用戶輸入 displayName
   ↓
2. useState 更新 displayName
   ↓
3. previewProfile 計算屬性自動更新
   ↓
4. ProfilePreview 重新渲染
   ↓
5. 右側立即顯示新名稱
```

### 儲存流程
```typescript
1. 點擊「儲存變更」
   ↓
2. 收集所有表單狀態
   ↓
3. PUT /api/tutor/profile
   ↓
4. 成功 → 顯示 ✓ 已儲存
   失敗 → 顯示錯誤訊息
   ↓
5. 3秒後自動隱藏訊息
```

## 💡 UX 增強

### 1. 即時反饋
```typescript
// 任何輸入變更立即預覽
onChange={(e) => setDisplayName(e.target.value)}
// ↓ 立即反映
<ProfilePreview profile={previewProfile} />
```

### 2. 視覺提示
```typescript
// 必填欄位
<Label>顯示名稱 *</Label>

// 欄位說明
<p className="text-xs text-muted-foreground">
  讓家長更了解您的教學風格
</p>

// 空白提示
{!profile.bio && (
  <div className="bg-yellow-50...">
    💡 完善您的檔案
  </div>
)}
```

### 3. 儲存狀態
```typescript
{message && (
  <div className={message.type === "success" 
    ? "bg-green-50" 
    : "bg-red-50"
  }>
    {message.text}
  </div>
)}
```

## 🚀 使用範例

### 基本編輯流程

1. **進入編輯頁**
```
/tutor/profile
↓
載入現有檔案資料
↓
左右分屏顯示
```

2. **編輯資訊**
```
左側：修改「顯示名稱」
↓
右側：立即看到新名稱
↓
繼續編輯其他欄位
↓
全部完成後點「儲存」
```

3. **查看效果**
```
儲存成功
↓
點「查看公開頁」
↓
新分頁開啟實際公開頁面
```

## 🎯 與舊版比較

### 舊版 (InlineProfileEditor)
```
優點：
- 點擊即編輯，直觀
- 類似所見即所得

缺點：
- 無法同時看到最終效果
- 編輯與預覽混在一起
- 複雜內容難以管理
```

### 新版 (ProfileEditorSplit)
```
優點：
✅ 清晰的表單結構
✅ 即時預覽最終效果
✅ 分離關注點
✅ 更適合複雜內容
✅ 專業的編輯體驗

缺點：
- 需要較大螢幕空間
```

## 📱 行動版適配

### Tablet / Mobile
```typescript
// 待實作
<div className="lg:flex lg:flex-row flex flex-col">
  <div className="lg:w-1/2 w-full">
    {/* Form */}
  </div>
  <div className="lg:w-1/2 w-full lg:block hidden">
    {/* Preview - 手機版隱藏 */}
  </div>
</div>

// 手機版：按鈕打開預覽 Modal
<Button onClick={() => setShowPreview(true)}>
  預覽效果
</Button>
```

## 🔧 客製化選項

### 自動儲存 (可選)
```typescript
// 使用 debounce 自動儲存
useEffect(() => {
  const timer = setTimeout(() => {
    handleAutoSave();
  }, 2000); // 2秒後自動儲存

  return () => clearTimeout(timer);
}, [displayName, bio, subjects...]); // 監聽所有欄位
```

### 離開警告 (可選)
```typescript
// 未儲存變更時警告
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [hasUnsavedChanges]);
```

## 🎉 最佳實踐

### 1. 資料驗證
```typescript
const handleSave = async () => {
  // 前端驗證
  if (!displayName.trim()) {
    setMessage({ type: "error", text: "請填寫顯示名稱" });
    return;
  }
  
  // 後端驗證 (API 會再次驗證)
  // ...
};
```

### 2. 錯誤處理
```typescript
try {
  const response = await fetch(...);
  if (!response.ok) {
    // 處理 API 錯誤
    const error = await response.json();
    setMessage({ type: "error", text: error.message });
  }
} catch (error) {
  // 處理網路錯誤
  setMessage({ type: "error", text: "網路錯誤" });
}
```

### 3. 效能優化
```typescript
// 使用 useMemo 計算預覽資料
const previewProfile = useMemo(() => ({
  ...profile,
  display_name: displayName,
  // ...
}), [profile, displayName, bio, subjects, ...]);
```

## 📊 未來增強

### Phase 1 (目前)
- ✅ 基本分屏佈局
- ✅ 即時預覽
- ✅ 表單驗證
- ✅ 儲存功能

### Phase 2 (下一步)
- [ ] 響應式設計 (手機版)
- [ ] 自動儲存
- [ ] 離開警告
- [ ] 鍵盤快捷鍵 (Ctrl+S 儲存)

### Phase 3 (進階)
- [ ] 版本歷史
- [ ] 協作編輯
- [ ] 範本選擇
- [ ] AI 建議

---

**現在的編輯體驗像專業的履歷編輯器！**  
左側輸入，右側立即看到效果，超直觀！🎉

