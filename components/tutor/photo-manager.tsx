"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import type { GalleryPhoto, GalleryDisplayStyle } from "@/lib/types/database";

interface PhotoManagerProps {
  userId: string;
  avatarUrl: string | null;
  galleryPhotos: GalleryPhoto[];
  displayStyle: GalleryDisplayStyle;
  onAvatarChange: (url: string) => void;
  onGalleryChange: (photos: GalleryPhoto[]) => void;
  onDisplayStyleChange: (style: GalleryDisplayStyle) => void;
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function PhotoManager({
  userId,
  avatarUrl,
  galleryPhotos,
  displayStyle,
  onAvatarChange,
  onGalleryChange,
  onDisplayStyleChange,
}: PhotoManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const validateAndCompressImage = async (file: File): Promise<File> => {
    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      throw new Error("不支援的檔案格式。請上傳 JPG、JPEG、PNG、WebP 或 HEIC 格式的圖片。");
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("檔案大小不能超過 5MB");
    }

    // Compress image if it's too large
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/jpeg" as const,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Compression error:", error);
      // If compression fails, return original file
      return file;
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);

      // Validate and compress
      const processedFile = await validateAndCompressImage(file);

      const formData = new FormData();
      formData.append("file", processedFile);
      formData.append("type", "avatar");

      const response = await fetch("/api/upload/photo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        onAvatarChange(url);
      } else {
        const { error } = await response.json();
        alert(error || "上傳失敗，請重試");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "上傳失敗，請重試");
    } finally {
      setUploading(false);
    }
  };

  const uploadGalleryPhoto = async (file: File) => {
    try {
      setUploadingGallery(true);

      // Validate and compress
      const processedFile = await validateAndCompressImage(file);

      const formData = new FormData();
      formData.append("file", processedFile);
      formData.append("type", "gallery");

      const response = await fetch("/api/upload/photo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { url, id } = await response.json();
        const newPhoto: GalleryPhoto = { id, url, caption: "" };
        onGalleryChange([...galleryPhotos, newPhoto]);
      } else {
        const { error } = await response.json();
        alert(error || "上傳失敗，請重試");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "上傳失敗，請重試");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryPhoto = (photoId: string) => {
    onGalleryChange(galleryPhotos.filter((p) => p.id !== photoId));
  };

  const updateCaption = (photoId: string, caption: string) => {
    onGalleryChange(
      galleryPhotos.map((p) => (p.id === photoId ? { ...p, caption } : p))
    );
  };

  return (
    <div className="space-y-8">
      {/* Profile Photo */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold">個人照片</Label>
          <p className="text-sm text-muted-foreground mt-1">
            這張照片會顯示在您的公開檔案頂部
          </p>
        </div>

        <div className="flex items-start gap-6">
          {avatarUrl && (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
              <Image
                src={avatarUrl}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex-1">
            <Input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.heic,.heif"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadAvatar(file);
              }}
              disabled={uploading}
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">
              支援格式：JPG、JPEG、PNG、WebP、HEIC<br />
              建議尺寸：500×500 像素，檔案大小不超過 5MB<br />
              {uploading && "壓縮並上傳中..."}
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Photos */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold">相片集</Label>
          <p className="text-sm text-muted-foreground mt-1">
            展示您的教學環境、教材或學生作品（最多 8 張）
          </p>
        </div>

        {/* Display Style Selection */}
        <div>
          <Label className="text-sm">顯示方式</Label>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => onDisplayStyleChange("carousel")}
              className={`flex-1 p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                displayStyle === "carousel"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="mb-1">🎠 輪播</div>
              <div className="text-xs text-muted-foreground">
                自動播放輪播
              </div>
            </button>

            <button
              type="button"
              onClick={() => onDisplayStyleChange("grid")}
              className={`flex-1 p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                displayStyle === "grid"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="mb-1">📷 網格</div>
              <div className="text-xs text-muted-foreground">
                方格展示
              </div>
            </button>

            <button
              type="button"
              onClick={() => onDisplayStyleChange("hidden")}
              className={`flex-1 p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                displayStyle === "hidden"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="mb-1">🚫 隱藏</div>
              <div className="text-xs text-muted-foreground">
                不顯示
              </div>
            </button>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 gap-4">
          {galleryPhotos.map((photo) => (
            <div key={photo.id} className="space-y-2">
              <div className="relative aspect-video rounded-lg overflow-hidden border">
                <Image
                  src={photo.url}
                  alt={photo.caption || "Gallery photo"}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryPhoto(photo.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
              <Input
                placeholder="新增說明（選填）"
                value={photo.caption || ""}
                onChange={(e) => updateCaption(photo.id, e.target.value)}
                className="text-sm"
              />
            </div>
          ))}

          {/* Add Photo Button */}
          {galleryPhotos.length < 8 && (
            <label className="aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center cursor-pointer transition-colors">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.heic,.heif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadGalleryPhoto(file);
                }}
                disabled={uploadingGallery}
              />
              <div className="text-4xl mb-2">+</div>
              <div className="text-sm text-muted-foreground">
                {uploadingGallery ? "壓縮並上傳中..." : "新增照片"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                支援 JPG、PNG、WebP、HEIC
              </div>
            </label>
          )}
        </div>

        {galleryPhotos.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            還沒有照片，上傳您的第一張照片吧！
          </div>
        )}
      </div>
    </div>
  );
}

