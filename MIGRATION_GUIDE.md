# 数据库迁移指南 🗄️

## 问题：找不到 social_links 列

如果您看到错误：
```
Could not find the 'social_links' column of 'tutor_profiles' in the schema cache
```

这意味着数据库迁移还没有运行。

## 🚀 运行迁移

### 方法 1：使用 Supabase Dashboard（推荐）

1. **登录 Supabase Dashboard**
   - 访问 https://supabase.com/dashboard
   - 选择您的项目

2. **打开 SQL Editor**
   - 点击左侧菜单的 "SQL Editor"
   - 点击 "New query"

3. **运行迁移 004 - Social Links**
   ```sql
   -- Add social media links to tutor_profiles
   ALTER TABLE tutor_profiles
   ADD COLUMN social_links JSONB DEFAULT '{}'::jsonb;

   -- Comment explaining the structure
   COMMENT ON COLUMN tutor_profiles.social_links IS 'Social media links in JSON format: {"facebook": "url", "instagram": "url", "threads": "url", "github": "url"}';
   ```

4. **运行迁移 005 - Photos**
   ```sql
   -- Add photos and gallery settings to tutor_profiles
   ALTER TABLE tutor_profiles
   ADD COLUMN avatar_photo_url TEXT,
   ADD COLUMN gallery_photos JSONB DEFAULT '[]'::jsonb,
   ADD COLUMN gallery_display_style TEXT DEFAULT 'carousel' CHECK (gallery_display_style IN ('carousel', 'grid', 'hidden'));

   -- Comment explaining the structure
   COMMENT ON COLUMN tutor_profiles.avatar_photo_url IS 'Main profile photo URL';
   COMMENT ON COLUMN tutor_profiles.gallery_photos IS 'Array of photo objects: [{"id": "uuid", "url": "...", "caption": "..."}]';
   COMMENT ON COLUMN tutor_profiles.gallery_display_style IS 'How to display photos: carousel, grid, or hidden';

   -- Create storage bucket for tutor photos
   INSERT INTO storage.buckets (id, name, public) 
   VALUES ('tutor-photos', 'tutor-photos', true)
   ON CONFLICT (id) DO NOTHING;

   -- Set up storage policies
   CREATE POLICY "Tutors can upload their own photos"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'tutor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

   CREATE POLICY "Tutors can update their own photos"
   ON storage.objects FOR UPDATE
   TO authenticated
   USING (bucket_id = 'tutor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

   CREATE POLICY "Tutors can delete their own photos"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (bucket_id = 'tutor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

   CREATE POLICY "Anyone can view tutor photos"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'tutor-photos');
   ```

5. **点击 "Run"** 执行每个迁移

### 方法 2：使用 Supabase CLI

如果您有 Supabase CLI：

```bash
# 1. 确保已登录
supabase login

# 2. 链接到您的项目
supabase link --project-ref YOUR_PROJECT_REF

# 3. 推送迁移
supabase db push

# 或者运行特定迁移文件
supabase db execute --file supabase/migrations/004_add_social_links.sql
supabase db execute --file supabase/migrations/005_add_photos.sql
```

## ✅ 验证迁移

运行迁移后，验证列已添加：

```sql
-- 查看 tutor_profiles 表结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'tutor_profiles'
AND column_name IN ('social_links', 'avatar_photo_url', 'gallery_photos', 'gallery_display_style');
```

应该看到：
```
column_name              | data_type | is_nullable
-------------------------|-----------|------------
social_links             | jsonb     | YES
avatar_photo_url         | text      | YES
gallery_photos           | jsonb     | YES
gallery_display_style    | text      | YES
```

## 🔄 如果出错

### 错误：列已存在
```
ERROR: column "social_links" of relation "tutor_profiles" already exists
```

**解决方案**：列已经存在，无需重新添加。

### 错误：权限不足
```
ERROR: permission denied for table tutor_profiles
```

**解决方案**：确保您以 postgres 用户或有足够权限的用户运行。

### 错误：Storage bucket 已存在
```
ERROR: duplicate key value violates unique constraint "buckets_pkey"
```

**解决方案**：Bucket 已存在，可以跳过该步骤。使用 `ON CONFLICT (id) DO NOTHING` 已经处理了这种情况。

## 📋 迁移顺序

务必按照顺序运行迁移：

1. `001_initial_schema.sql` - 初始表结构
2. `002_rls_policies.sql` - 行级安全策略
3. `003_add_education.sql` - 教育背景
4. `004_add_social_links.sql` - 社交媒体链接 ⬅️ **您在这里**
5. `005_add_photos.sql` - 照片管理 ⬅️ **您在这里**

## 🎯 快速检查清单

- [ ] 登录 Supabase Dashboard
- [ ] 打开 SQL Editor
- [ ] 复制并运行 004_add_social_links.sql
- [ ] 复制并运行 005_add_photos.sql
- [ ] 验证列已添加
- [ ] 刷新应用程序
- [ ] 测试功能

## 💡 提示

### 开发环境
在开发时，您可能需要多次重置数据库。使用以下命令：

```bash
# 重置本地数据库
supabase db reset

# 这会：
# 1. 删除所有数据
# 2. 重新运行所有迁移
# 3. 重新生成 TypeScript 类型
```

### 生产环境
在生产环境中，**永远不要**删除列或表。始终使用：

```sql
-- ✅ 好的做法
ALTER TABLE tutor_profiles ADD COLUMN IF NOT EXISTS new_column TEXT;

-- ❌ 坏的做法（会丢失数据）
ALTER TABLE tutor_profiles DROP COLUMN old_column;
```

### 备份
在运行迁移前，始终备份生产数据库：

1. 在 Supabase Dashboard 中
2. 点击 "Database" → "Backups"
3. 点击 "Create backup"
4. 等待备份完成
5. 然后运行迁移

## 🔍 故障排除

### 查看当前表结构
```sql
\d+ tutor_profiles
```

### 查看所有迁移历史
```sql
SELECT * FROM supabase_migrations.schema_migrations ORDER BY version;
```

### 手动标记迁移为已完成
```sql
-- 如果迁移已手动运行但未记录
INSERT INTO supabase_migrations.schema_migrations (version)
VALUES ('004'), ('005');
```

---

**运行迁移后，刷新您的应用程序，问题应该解决了！** ✨

