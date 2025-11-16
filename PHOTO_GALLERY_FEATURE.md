# 照片管理與相片集功能 📸

## 功能概述

教師可以上傳個人照片和相片集，並選擇如何在公開檔案上展示這些照片。支持輪播、網格和隱藏三種展示方式。

## 🎯 核心功能

### 1. 個人照片（Profile Photo）
- **用途**：主要個人照片，顯示在公開檔案頂部
- **位置**：圓形頭像，居中顯示
- **規格**：建議 500×500 像素，最大 2MB

### 2. 相片集（Gallery）
- **用途**：展示教學環境、教材、學生作品
- **數量限制**：最多 8 張
- **支持功能**：
  - 上傳照片
  - 新增說明
  - 刪除照片
  - 選擇展示方式

### 3. 展示方式
- **🎠 輪播（Carousel）**：自動播放，每 5 秒切換
- **📷 網格（Grid）**：2×3 或 3×3 網格展示
- **🚫 隱藏（Hidden）**：不在公開檔案顯示

## 📊 數據結構

### 資料庫 Schema
```sql
ALTER TABLE tutor_profiles
ADD COLUMN avatar_photo_url TEXT,
ADD COLUMN gallery_photos JSONB DEFAULT '[]'::jsonb,
ADD COLUMN gallery_display_style TEXT DEFAULT 'carousel'
  CHECK (gallery_display_style IN ('carousel', 'grid', 'hidden'));
```

### TypeScript 類型
```typescript
export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
}

export type GalleryDisplayStyle = 'carousel' | 'grid' | 'hidden';

export interface TutorProfile {
  // ... other fields
  avatar_photo_url: string | null;
  gallery_photos: GalleryPhoto[];
  gallery_display_style: GalleryDisplayStyle;
}
```

### JSON 儲存格式
```json
{
  "avatar_photo_url": "https://...supabase.co/.../avatar.jpg",
  "gallery_photos": [
    {
      "id": "1234-abcd",
      "url": "https://...supabase.co/.../photo1.jpg",
      "caption": "我的教室環境"
    },
    {
      "id": "5678-efgh",
      "url": "https://...supabase.co/.../photo2.jpg",
      "caption": "學生作品"
    }
  ],
  "gallery_display_style": "carousel"
}
```

## 🎨 編輯介面（第 4 步）

### 佈局
```
┌─────────────────────────────────────┐
│ 照片管理                             │
│ 個人照片與相片集                      │
├─────────────────────────────────────┤
│                                     │
│ 個人照片                             │
│ 這張照片會顯示在您的公開檔案頂部       │
│                                     │
│ [預覽圖] [選擇檔案...]               │
│                                     │
│ ────────────────────────────────   │
│                                     │
│ 相片集                               │
│ 展示您的教學環境、教材或學生作品       │
│                                     │
│ 顯示方式：                           │
│ [🎠 輪播] [📷 網格] [🚫 隱藏]        │
│                                     │
│ ┌─────┐ ┌─────┐ ┌─────┐            │
│ │照片1│ │照片2│ │照片3│            │
│ │ × │ │ × │ │ × │            │
│ └─────┘ └─────┘ └─────┘            │
│ [說明] [說明] [說明]               │
│                                     │
│ ┌─────┐                             │
│ │  +  │ 新增照片                     │
│ └─────┘                             │
└─────────────────────────────────────┘
```

### 功能特點
- ✅ 即時預覽上傳的照片
- ✅ 拖拽上傳（未來）
- ✅ 每張照片都有刪除按鈕
- ✅ 每張照片可以新增說明
- ✅ 展示方式一鍵切換
- ✅ 右側即時預覽效果

## 🎠 輪播展示（Carousel）

### 特點
```typescript
- 16:9 寬螢幕比例
- 自動播放，每 5 秒切換
- 手動導航：← → 箭頭
- 底部圓點指示器
- 照片說明顯示在底部
```

### UI 效果
```
┌────────────────────────────────────┐
│                                    │
│       [← 當前照片 →]                │
│                                    │
│       照片說明文字                   │
└────────────────────────────────────┘
         • ━ ━ ━
    (當前頁加長顯示)
```

### 互動邏輯
```typescript
// 自動播放
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, 5000);
  return () => clearInterval(timer);
}, [photos.length]);

// 手動切換
const next = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
const prev = () => setCurrentIndex((prev) => 
  prev === 0 ? photos.length - 1 : prev - 1
);
```

## 📷 網格展示（Grid）

### 特點
```
- 響應式網格：手機 2 列，桌面 3 列
- Hover 顯示說明文字
- 照片放大效果
- 正方形比例
```

### UI 效果
```
┌──────┐ ┌──────┐ ┌──────┐
│照片1 │ │照片2 │ │照片3 │
└──────┘ └──────┘ └──────┘

┌──────┐ ┌──────┐ ┌──────┐
│照片4 │ │照片5 │ │照片6 │
└──────┘ └──────┘ └──────┘

Hover 效果：
┌──────┐
│      │ ← 照片放大 1.05x
│說明文│ ← 黑色半透明遮罩
└──────┘
```

### CSS 實現
```css
.photo-card {
  aspect-ratio: 1;
  overflow: hidden;
  transition: transform 300ms;
}

.photo-card:hover img {
  transform: scale(1.05);
}

.photo-card:hover .caption {
  opacity: 1;
  background: rgba(0, 0, 0, 0.6);
}
```

## 📤 上傳流程

### 1. 前端處理
```typescript
const uploadPhoto = async (file: File) => {
  // 驗證檔案類型
  if (!file.type.startsWith('image/')) {
    alert('只能上傳圖片');
    return;
  }

  // 驗證檔案大小 (2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('檔案大小不能超過 2MB');
    return;
  }

  // 上傳到 API
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'gallery'); // or 'avatar'

  const response = await fetch('/api/upload/photo', {
    method: 'POST',
    body: formData,
  });

  const { url, id } = await response.json();
  // 更新狀態
};
```

### 2. 後端處理（Supabase Storage）
```typescript
// API Route: /api/upload/photo
export async function POST(request: Request) {
  // 1. 驗證用戶登入
  const user = await getUser();
  
  // 2. 驗證檔案
  const file = await request.formData().get('file');
  validateFile(file);
  
  // 3. 生成唯一檔名
  const fileName = `${user.id}/${type}-${Date.now()}.${ext}`;
  
  // 4. 上傳到 Supabase Storage
  await supabase.storage
    .from('tutor-photos')
    .upload(fileName, file);
  
  // 5. 返回公開 URL
  const publicUrl = supabase.storage
    .from('tutor-photos')
    .getPublicUrl(fileName);
  
  return { url: publicUrl, id: generateId() };
}
```

### 3. Supabase Storage 策略
```sql
-- 教師只能上傳自己的照片
CREATE POLICY "Tutors can upload their own photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'tutor-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 任何人都可以查看照片
CREATE POLICY "Anyone can view tutor photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'tutor-photos');
```

## 🎨 公開檔案設計（重新設計）

### 新設計理念
1. **簡潔居中**：所有內容居中對齊
2. **卡片式佈局**：每個區塊獨立卡片
3. **圓角柔和**：使用 `rounded-2xl`
4. **漸層背景**：`from-gray-50 to-white`
5. **視覺層次**：陰影 + 邊框

### 佈局結構
```
┌────────────────────────────────────┐
│ ← 返回首頁                          │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│         ⭕ 個人照片                 │
│                                    │
│         陳老師                      │
│    [F] [I] [G] 社交圖標             │
│    [數學] [物理] 科目標籤           │
│    📍台北 👨‍🏫5年 💻線上             │
│                                    │
│    我是一位經驗豐富的...             │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ 相片集                              │
│ [輪播或網格展示]                     │
└────────────────────────────────────┘

┌─────┬─────┬─────┐
│ 50  │  8  │ 4.8 │
│時數 │學生 │評分 │
└─────┴─────┴─────┘

┌────────────────────────────────────┐
│ 教學記錄                            │
│ [GitHub 風格 Heatmap]               │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ 學歷背景                            │
│ [大學列表 + Logo]                   │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ 學生評價                            │
│ [評價列表]                          │
└────────────────────────────────────┘
```

### 設計對比

**舊設計：**
```
- 左右不對稱
- 扁平灰色背景
- 緊湊的間距
- 信息密集
```

**新設計：**
```
- ✅ 完全居中對齊
- ✅ 漸層白色背景
- ✅ 寬鬆的間距
- ✅ 卡片式分區
- ✅ 圓形頭像突出
- ✅ 大膽的字體
- ✅ 柔和的陰影
```

## 💡 進度計算

### 更新後的進度系統
```typescript
const completionPercentage = () => {
  let completed = 0;
  let total = 9;  // 從 8 增加到 9

  if (displayName) completed++;
  if (bio) completed++;
  if (subjects.length > 0) completed++;
  if (location) completed++;
  if (yearsExperience) completed++;
  if (education.length > 0) completed += 2;
  if (avatarPhotoUrl || galleryPhotos.length > 0) completed++;  // 新增
  if (hasSocialLinks) completed++;

  return Math.round((completed / total) * 100);
};
```

### 進度對照表
| 完成項目 | 進度 |
|---------|------|
| 姓名 | 11% |
| + 自我介紹 | 22% |
| + 科目 | 33% |
| + 地點 | 44% |
| + 年資 | 55% |
| + 學歷 | 77% |
| + 照片 | 88% |
| + 社交連結 | 100% |

## 🔄 用戶流程

### 教師上傳流程
```
1. 進入編輯頁面 → 步驟 4「照片管理」
2. 上傳個人照片
   → 點擊選擇檔案
   → 選擇照片
   → 即時預覽
   → 右側看到效果
3. 上傳相片集
   → 點擊「+ 新增照片」
   → 選擇照片（最多 8 張）
   → 為每張照片新增說明
4. 選擇展示方式
   → [🎠 輪播] - 自動播放
   → [📷 網格] - 方格展示
   → [🚫 隱藏] - 不顯示
5. 即時預覽
   → 右側看到實際效果
   → 確認滿意
6. 點擊「下一步」或「儲存」
```

### 家長瀏覽流程
```
1. 進入教師公開檔案
2. 看到圓形個人照片
   → 專業形象
   → 增加信任
3. 向下滾動看到相片集
   → 輪播模式：自動播放
   → 網格模式：Hover 看說明
4. 更全面了解教師
   → 教學環境
   → 教學風格
   → 學生作品
```

## 🎯 展示方式對比

### 輪播（Carousel）
**優點：**
- ✅ 視覺吸引力強
- ✅ 自動播放省力
- ✅ 適合展示精選照片
- ✅ 支持照片說明

**缺點：**
- ❌ 一次只能看一張
- ❌ 需要等待或手動切換

**適合場景：**
- 照片數量較少（1-4張）
- 想突出每張照片
- 照片品質高

### 網格（Grid）
**優點：**
- ✅ 一次看到所有照片
- ✅ 快速瀏覽
- ✅ 適合展示多樣性

**缺點：**
- ❌ 單張照片較小
- ❌ 需要 Hover 看說明

**適合場景：**
- 照片數量較多（4-8張）
- 想展示多樣性
- 照片主題豐富

### 隱藏（Hidden）
**用途：**
- 暫時不想展示
- 還在準備照片
- 更新照片時

## 📱 響應式設計

### 桌面版（> 1024px）
```
個人照片：128×128 px
相片集輪播：16:9
相片集網格：3 列
卡片間距：24px
容器寬度：max-w-4xl
```

### 平板版（768px - 1024px）
```
個人照片：96×96 px
相片集輪播：16:9
相片集網格：2 列
卡片間距：16px
容器寬度：max-w-3xl
```

### 手機版（< 768px）
```
個人照片：80×80 px
相片集輪播：4:3
相片集網格：2 列
卡片間距：12px
容器寬度：全寬
```

## 🚀 效能優化

### 1. **Image Optimization**
```tsx
<Image
  src={photo.url}
  alt={caption}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 50vw, 33vw"
  loading="lazy"  // 延遲載入
/>
```

### 2. **Progressive Loading**
```typescript
// 先載入低解析度版本
<Image
  src={photo.url}
  placeholder="blur"
  blurDataURL={generateBlurDataURL(photo.url)}
/>
```

### 3. **Lazy Loading Gallery**
```typescript
// 只在視窗內才載入照片
{photos.map((photo, index) => (
  <Image
    key={photo.id}
    loading={index < 3 ? "eager" : "lazy"}
    // 前 3 張立即載入，其他延遲
  />
))}
```

## 🔮 未來增強

### Phase 2
- [ ] 拖拽排序照片
- [ ] 批次上傳
- [ ] 照片編輯（裁剪、濾鏡）
- [ ] 照片壓縮

### Phase 3
- [ ] 照片標籤
- [ ] 照片分類
- [ ] Lightbox 放大查看
- [ ] 影片支持

### Phase 4
- [ ] AI 自動生成說明
- [ ] AI 美化照片
- [ ] 智能推薦展示方式
- [ ] 照片品質分析

## 💪 優勢總結

### 對教師的好處
1. **展示專業**：高品質照片提升形象
2. **建立信任**：真實環境增加可信度
3. **吸引家長**：視覺化內容更吸引
4. **自由控制**：選擇展示方式

### 對家長的好處
1. **視覺化了解**：看到教學環境
2. **增加信任**：真實照片不是空話
3. **更好決策**：更全面的資訊
4. **節省時間**：快速了解教師

### 對平台的好處
1. **提高完整度**：鼓勵填寫更多資訊
2. **差異化功能**：獨特的展示功能
3. **增加互動**：視覺內容更吸引
4. **SEO 優化**：圖片提升搜索排名

---

**現在教師可以用照片展示自己的專業！** 📸

上傳個人照片和相片集，選擇輪播或網格展示，讓家長更直觀地了解教學環境和風格！

