const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.75;

/**
 * Compresses an image blob by resizing to fit within MAX_DIMENSION and
 * re-encoding as JPEG. Non-image blobs are returned unchanged.
 */
export async function compressImage(blob: Blob): Promise<Blob> {
  if (!blob.type.startsWith('image/')) return blob;

  const bitmap = await createImageBitmap(blob);
  const { width, height } = bitmap;

  let targetW = width;
  let targetH = height;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    targetW = Math.round(width * scale);
    targetH = Math.round(height * scale);
  }

  const canvas = new OffscreenCanvas(targetW, targetH);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close();

  return canvas.convertToBlob({ type: 'image/jpeg', quality: JPEG_QUALITY });
}
