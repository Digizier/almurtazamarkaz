import { supabase } from './supabaseClient';

/**
 * Compresses an image file in-browser and converts it to modern .webp format in small KBs.
 * @param file The original image file uploaded by the user or admin
 * @param maxWidth Max pixel width (default: 1200)
 * @param quality Compression quality 0.1 to 1.0 (default: 0.8)
 * @returns Promise<Blob> Compressed WebP blob
 */
export async function compressImageToWebP(
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Image compression failed'));
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Uploads a compressed WebP file directly to Supabase Storage and returns the public CDN URL.
 * NEVER stores Base64 in the database!
 */
export async function uploadMediaToStorage(
  file: File,
  bucket: 'products' | 'categories' | 'banners' | 'brands' | 'payment-proofs' | 'gallery' | 'content',
  folder: string = 'uploads'
): Promise<{ url: string | null; error: string | null }> {
  try {
    // 1. Compress image to WebP in browser
    const compressedBlob = await compressImageToWebP(file, 1600, 0.82);

    // 2. Generate clean, unique filename
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const cleanBase = sanitizedName.substring(0, sanitizedName.lastIndexOf('.')) || 'media';
    const filePath = `${folder}/${Date.now()}_${cleanBase}.webp`;

    // 3. Upload binary to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, compressedBlob, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return { url: null, error: uploadError.message };
    }

    // 4. Retrieve clean public CDN URL
    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: publicData.publicUrl, error: null };
  } catch (err: any) {
    console.error('Image compression or upload error:', err);
    return { url: null, error: err.message || 'Image processing failed' };
  }
}
