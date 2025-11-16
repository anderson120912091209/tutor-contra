# 教學科目自訂指南 📚

## 科目資料位置

所有科目資料存放在：
```
lib/data/subjects.ts
```

## 📝 如何新增/修改科目

### 資料結構

```typescript
export interface SubjectCategory {
  name: string;      // 類別名稱
  icon: string;      // Emoji 圖示
  subjects: string[]; // 該類別的科目列表
}
```

### 完整範例

```typescript
export const SUBJECT_CATEGORIES: SubjectCategory[] = [
  {
    name: "數學",           // ← 類別名稱
    icon: "🔢",            // ← Emoji 圖示
    subjects: [            // ← 科目列表
      "國小數學",
      "國中數學",
      "高中數學",
      "微積分",
      "統計學",
      "線性代數",
    ],
  },
  // ... 更多類別
];
```

## 🎯 自訂步驟

### 1. 新增整個類別

```typescript
// 在 SUBJECT_CATEGORIES 陣列中加入新類別
{
  name: "運動",
  icon: "⚽",
  subjects: [
    "籃球",
    "足球",
    "網球",
    "游泳",
    "羽毛球",
  ],
}
```

### 2. 在現有類別新增科目

```typescript
// 找到對應類別，在 subjects 陣列中加入
{
  name: "數學",
  icon: "🔢",
  subjects: [
    "國小數學",
    "國中數學",
    "高中數學",
    "微積分",
    "統計學",
    "線性代數",
    "離散數學",    // ← 新增
    "數論",        // ← 新增
  ],
}
```

### 3. 修改類別名稱或圖示

```typescript
{
  name: "數理科學",  // ← 改名
  icon: "🧮",       // ← 換圖示
  subjects: [
    // ...
  ],
}
```

### 4. 刪除科目

只需從 `subjects` 陣列中移除該項目：

```typescript
subjects: [
  "國小數學",
  "國中數學",
  // "高中數學",  ← 註解掉或刪除
  "微積分",
]
```

### 5. 刪除整個類別

從 `SUBJECT_CATEGORIES` 陣列中移除該類別：

```typescript
export const SUBJECT_CATEGORIES: SubjectCategory[] = [
  {
    name: "數學",
    // ...
  },
  // {
  //   name: "藝術才藝",  ← 註解掉或刪除
  //   // ...
  // },
  {
    name: "商業管理",
    // ...
  },
];
```

## 🎨 Emoji 圖示建議

### 常用類別 Emoji

```
數學/理科: 🔢 📐 📊 🧮 ➕ ➗
科學: 🔬 🧪 🧬 ⚗️ 🌡️
語言: 💬 📖 ✍️ 🗣️ 📝
電腦: 💻 ⌨️ 🖥️ 📱 🖱️
藝術: 🎨 🎭 🎪 🖼️ 🎬
音樂: 🎵 🎸 🎹 🎤 🎼
運動: ⚽ 🏀 🎾 ⛹️ 🏃
商業: 📊 💼 📈 💰 🏢
語言學習: 🌍 🗺️ 🇺🇸 🇬🇧 🇯🇵
考試: 📝 🎓 📚 ✏️ 📄
```

## 📋 完整範例檔案

```typescript
export const SUBJECT_CATEGORIES: SubjectCategory[] = [
  // 數學類
  {
    name: "數學",
    icon: "🔢",
    subjects: [
      "國小數學",
      "國中數學",
      "高中數學",
      "微積分",
      "統計學",
      "線性代數",
    ],
  },
  
  // 自然科學類
  {
    name: "自然科學",
    icon: "🔬",
    subjects: [
      "國小自然",
      "國中生物",
      "國中理化",
      "高中物理",
      "高中化學",
      "高中生物",
      "高中地科",
    ],
  },
  
  // 語言類
  {
    name: "語言",
    icon: "💬",
    subjects: [
      "國文",
      "英文",
      "日文",
      "韓文",
      "法文",
      "德文",
      "西班牙文",
    ],
  },
  
  // 社會科學類
  {
    name: "社會科學",
    icon: "🌍",
    subjects: [
      "歷史",
      "地理",
      "公民",
      "經濟學",
      "社會學",
    ],
  },
  
  // 資訊科技類
  {
    name: "資訊科技",
    icon: "💻",
    subjects: [
      "程式設計",
      "Python",
      "Java",
      "C++",
      "網頁設計",
      "資料科學",
      "AI/機器學習",
    ],
  },
  
  // 藝術才藝類
  {
    name: "藝術才藝",
    icon: "🎨",
    subjects: [
      "美術",
      "音樂",
      "鋼琴",
      "吉他",
      "小提琴",
      "舞蹈",
      "書法",
    ],
  },
  
  // 商業管理類
  {
    name: "商業管理",
    icon: "📊",
    subjects: [
      "會計",
      "管理學",
      "行銷",
      "財務管理",
      "商用英文",
    ],
  },
  
  // 其他類
  {
    name: "其他",
    icon: "📚",
    subjects: [
      "SAT",
      "TOEFL",
      "IELTS",
      "多益",
      "全民英檢",
      "升學輔導",
    ],
  },
];
```

## 🎨 UI 元件說明

### SubjectSelector 元件

**位置**: `components/tutor/subject-selector.tsx`

**功能**:
1. 顯示所有類別和科目
2. 點擊選擇/取消選擇
3. 顯示已選擇的科目
4. 支援自訂科目

**特色**:
- ✨ 現代化的按鈕設計
- 🎯 即時視覺反饋
- 📱 響應式佈局
- ➕ 自訂科目支援

### 視覺效果

```
┌─────────────────────────────────────┐
│ 已選擇 3 個科目                      │
│ [國中數學 ×] [英文 ×] [程式設計 ×]   │
└─────────────────────────────────────┘

🔢 數學
[國小數學] [國中數學✓] [高中數學] ...

💬 語言
[國文] [英文✓] [日文] [韓文] ...

💻 資訊科技
[程式設計✓] [Python] [Java] ...

[+ 新增自訂科目]
```

## 🚀 進階自訂

### 1. 改變顏色

編輯 `subject-selector.tsx`:

```typescript
// 已選擇的科目
className="bg-primary text-primary-foreground"

// 改為其他顏色
className="bg-blue-500 text-white"
```

### 2. 改變佈局

```typescript
// 網格佈局
<div className="grid grid-cols-3 gap-2">

// 或保持 flex 佈局
<div className="flex flex-wrap gap-2">
```

### 3. 新增搜尋功能

```typescript
const [search, setSearch] = useState("");

const filteredCategories = SUBJECT_CATEGORIES.map(category => ({
  ...category,
  subjects: category.subjects.filter(s => 
    s.toLowerCase().includes(search.toLowerCase())
  )
})).filter(c => c.subjects.length > 0);
```

### 4. 限制選擇數量

```typescript
const MAX_SUBJECTS = 5;

const toggleSubject = (subject: string) => {
  if (selected.includes(subject)) {
    onChange(selected.filter((s) => s !== subject));
  } else if (selected.length < MAX_SUBJECTS) {
    onChange([...selected, subject]);
  } else {
    alert(`最多只能選擇 ${MAX_SUBJECTS} 個科目`);
  }
};
```

## 📊 資料來源建議

### 從資料庫載入

如果你想從資料庫載入科目：

```typescript
// 建立 API endpoint
// app/api/subjects/route.ts
export async function GET() {
  const subjects = await db.subjects.findMany();
  return Response.json(subjects);
}

// 在元件中使用
useEffect(() => {
  fetch('/api/subjects')
    .then(res => res.json())
    .then(data => setSubjects(data));
}, []);
```

### CSV 匯入

如果有 CSV 檔案：

```typescript
// subjects.csv
// 類別,圖示,科目
// 數學,🔢,國小數學
// 數學,🔢,國中數學

// 轉換腳本
import { parse } from 'csv-parse';
```

## 🔧 故障排除

### 科目沒有顯示？

1. 檢查 `subjects.ts` 的 export
2. 確認陣列格式正確
3. 重新啟動開發伺服器

### 選擇沒有儲存？

1. 確認 API 有接收到資料
2. 檢查資料庫欄位類型（應該是 TEXT[] 或 JSONB）
3. 查看 console 錯誤訊息

### 自訂科目無法新增？

1. 確認輸入框有值
2. 檢查是否有重複
3. 查看 onChange 是否正確觸發

## 💡 最佳實踐

1. **保持簡潔**: 每個類別 5-10 個科目最佳
2. **清楚命名**: 使用家長能理解的名稱
3. **合理分類**: 相關科目放在一起
4. **定期更新**: 根據需求新增熱門科目
5. **測試**: 新增科目後測試選擇和儲存

---

**現在你可以輕鬆管理所有教學科目了！** 🎉

只需編輯 `lib/data/subjects.ts`，所有變更會自動反映在 UI 上！

