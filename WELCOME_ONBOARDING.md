# Welcome Onboarding Feature

## ✨ 概述 / Overview

當教師第一次進入檔案編輯頁面時，會看到一個非常美觀的歡迎流程，使用 Framer Motion 動畫和 React Hook Form 進行表單管理。

## 🎯 功能特點 / Features

### 1. **Welcome 動畫頁面**
- Logo 從上方淡入
- "Welcome" 文字帶漸變色（藍色到紫色）
- 歡迎訊息淡入
- 三個跳動的圓點動畫
- "開始建立檔案" 按鈕帶箭頭動畫

### 2. **基本資料表單**
- **全名輸入**：簡單的文字輸入
- **畢業學校**：整合全球大學搜尋（UniversityAutocompleteGlobal）
- **進度指示器**：顯示 "步驟 1 / 3" 和進度條動畫
- **即時驗證**：使用 Zod schema 和 react-hook-form
- **視覺反饋**：選擇大學後顯示確認圖標

### 3. **美學設計 / Aesthetic Design**
- 漸變背景（from-blue-50 via-white to-purple-50）
- 圓角卡片設計（rounded-3xl）
- 陰影效果（shadow-2xl）
- 裝飾性的模糊圓形背景元素
- 流暢的動畫過渡效果

## 📦 依賴 / Dependencies

```json
{
  "framer-motion": "^11.x.x",
  "react-hook-form": "^7.x.x",
  "@hookform/resolvers": "^3.x.x",
  "zod": "^3.x.x"
}
```

## 🔧 技術實現 / Technical Implementation

### 1. Form Schema

```typescript
const welcomeSchema = z.object({
  fullName: z.string().min(1, "請輸入您的全名"),
  university: z.string().min(1, "請選擇您的畢業學校"),
  universityWebsite: z.string().optional(),
  universityCountry: z.string().optional(),
});
```

### 2. Animation Variants

**Welcome Screen:**
- Logo: `y: -50 → 0`, delay 0.2s
- Title: `y: 30 → 0`, delay 0.4s
- Description: `y: 30 → 0`, delay 0.6s
- Dots: infinite pulsing animation
- Button: `y: 30 → 0`, delay 1s

**Form Screen:**
- Card: `x: 100 → 0`, duration 0.5s
- Progress bar: `width: 0% → 33.33%`, duration 0.6s
- Form fields: sequential delays (0.4s, 0.5s, etc.)

### 3. State Management

```typescript
const [step, setStep] = useState<"welcome" | "form">("welcome");
const [selectedUniversity, setSelectedUniversity] = useState<{
  name: string;
  website?: string;
  country?: string;
} | null>(null);
```

### 4. Integration with Profile Editor

```typescript
// In profile-editor-split.tsx
const [showWelcome, setShowWelcome] = useState(false);

useEffect(() => {
  const isFirstTime = !profile.bio && profile.subjects.length === 0;
  setShowWelcome(isFirstTime);
}, [profile.bio, profile.subjects.length]);

if (showWelcome) {
  return <WelcomeOnboarding onComplete={handleWelcomeComplete} />;
}
```

## 🎨 Design Elements

### Colors
- **Primary Gradient:** `from-blue-600 to-purple-600`
- **Background Gradient:** `from-blue-50 via-white to-purple-50`
- **Success Green:** `text-green-600`
- **Error Red:** `text-red-500`

### Typography
- **Title (Welcome):** `text-6xl font-bold`
- **Section Title:** `text-3xl font-bold`
- **Description:** `text-xl text-gray-600`
- **Labels:** `text-base font-medium`
- **Inputs:** `text-lg py-6`

### Spacing
- **Card Padding:** `p-12`
- **Form Spacing:** `space-y-6`
- **Button:** `px-8 py-6`

## 🚀 User Flow

```
1. 教師首次進入編輯頁面
   ↓
2. 顯示 Welcome 動畫 (3-4秒自動播放)
   ↓
3. 用戶點擊 "開始建立檔案"
   ↓
4. 切換到表單頁面（滑動動畫）
   ↓
5. 輸入全名
   ↓
6. 搜尋並選擇大學
   ↓
7. 點擊 "繼續" 按鈕
   ↓
8. 數據自動儲存到資料庫
   ↓
9. 關閉歡迎流程，進入正常編輯模式
```

## 💾 Data Saved

當用戶完成歡迎流程後，以下數據會自動儲存：

```typescript
{
  display_name: "用戶全名",
  education: [{
    university: "大學名稱",
    universityId: "university-id",
    degree: "",  // 稍後填寫
    major: "",   // 稍後填寫
    startYear: currentYear - 4,
    endYear: currentYear,
    website: "https://university.com",
    country: "Taiwan"
  }]
}
```

## 🎯 Trigger Conditions

歡迎流程在以下條件觸發：

```typescript
const isFirstTime = !profile.bio && profile.subjects.length === 0;
```

即：
- ✅ 沒有填寫 bio（自我介紹）
- ✅ 沒有選擇任何 subjects（教學科目）

## 📱 Responsive Design

- **Desktop:** 完整體驗，寬度 max-w-2xl
- **Mobile:** 自動調整為單欄布局
- **Padding:** 響應式調整 (px-6)

## ⚡ Performance

### Optimizations:
1. **Lazy Loading:** 只有在 `showWelcome` 為 true 時才渲染組件
2. **AnimatePresence:** 使用 `mode="wait"` 避免同時渲染多個頁面
3. **Web Worker:** UniversityAutocomplete 使用 debounce 減少 API 調用

### Animation Performance:
- 使用 GPU 加速的 transform 屬性（x, y, scale）
- 避免使用 layout-triggering 屬性
- 使用 `will-change` 優化

## 🧪 Testing

### Manual Testing Checklist:
- [ ] Welcome 動畫正常播放
- [ ] 點擊 "開始建立檔案" 切換到表單
- [ ] 全名輸入驗證工作正常
- [ ] 大學搜尋功能正常
- [ ] 選擇大學後顯示確認訊息
- [ ] 提交按鈕在未填寫時禁用
- [ ] 提交後數據成功儲存
- [ ] 關閉歡迎流程後顯示正常編輯器

### Edge Cases:
- 用戶快速點擊按鈕
- 大學搜尋無結果
- 網路連線問題
- 儲存失敗處理

## 🐛 Known Issues

1. **profile-preview 模組警告**: TypeScript 緩存問題，不影響功能
2. **大學 placeholder**: UniversityAutocompleteGlobal 目前不支援 placeholder prop

## 🔄 Future Enhancements

### Possible Improvements:
- [ ] 添加更多步驟（例如選擇教學科目）
- [ ] 添加跳過選項
- [ ] 保存進度到 localStorage
- [ ] 添加返回上一步功能
- [ ] 支援多語言
- [ ] 添加 welcome video
- [ ] 個性化的歡迎訊息（基於 OAuth 資料）

## 📚 Related Files

```
components/tutor/welcome-onboarding.tsx       - 主組件
components/tutor/profile-editor-split.tsx     - 整合點
components/tutor/university-autocomplete-global.tsx - 大學搜尋
lib/types/database.ts                         - Education 型別定義
app/api/tutor/profile/route.ts               - 儲存 API
```

## 🎬 Animation Timeline

```
Welcome Screen (Total: ~2s):
0.0s - Logo appears (from top)
0.2s - Title fades in
0.4s - Description fades in
0.6s - Dots start animating
0.8s - Button appears

Form Screen (Total: ~0.8s):
0.0s - Card slides in from right
0.2s - Progress bar animates
0.3s - Title fades in
0.4s - Full name input appears
0.5s - University input appears
0.6s - Submit button appears
```

## 🎨 Component Structure

```tsx
<WelcomeOnboarding>
  <AnimatePresence mode="wait">
    {step === "welcome" ? (
      <motion.div>  // Welcome Screen
        <Logo />
        <Title />
        <Description />
        <AnimatedDots />
        <ContinueButton />
      </motion.div>
    ) : (
      <motion.div>  // Form Screen
        <ProgressIndicator />
        <Form>
          <FullNameInput />
          <UniversitySearch />
          <SubmitButton />
        </Form>
        <DecorativeElements />
      </motion.div>
    )}
  </AnimatePresence>
</WelcomeOnboarding>
```

## 💡 Best Practices

1. **Animation Duration:** 保持在 0.3-0.6s 之間
2. **Easing:** 使用 "easeOut" 讓動畫感覺自然
3. **Delays:** 適當的延遲讓動畫有節奏感
4. **Validation:** 即時驗證提供更好的用戶體驗
5. **Error Handling:** 優雅地處理錯誤情況

## 📝 Notes

- 歡迎流程只在第一次編輯時顯示
- 完成後自動儲存基本資料
- 用戶可以稍後在正常編輯器中完善其他資料
- 設計風格與整體平台保持一致（漸變色、圓角等）

---

## ✅ Implementation Checklist

- [x] 安裝依賴（framer-motion, react-hook-form, @hookform/resolvers）
- [x] 創建 WelcomeOnboarding 組件
- [x] 實現 Welcome 動畫頁面
- [x] 實現表單頁面
- [x] 整合到 ProfileEditorSplit
- [x] 添加觸發條件
- [x] 實現數據儲存
- [x] 添加動畫效果
- [x] 測試用戶流程
- [x] 編寫文檔

完成日期：2024-11-16

