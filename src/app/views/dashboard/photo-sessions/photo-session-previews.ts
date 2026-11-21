/** Derived previews only. The original File is never resized or transcoded. */
export async function photoPreviews(file: File): Promise<{ size: string; blob: Blob }[]> {
  if (file.size > 100 * 1024 ** 2 || !['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) return [];
  const image = await createImageBitmap(file);
  try {
    const previews: { size: string; blob: Blob }[] = [];
    for (const [size, limit] of [['thumb', 320], ['medium', 960], ['large', 1920]] as const) {
      const scale = Math.min(1, limit / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale)); canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext('2d')!.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', .86));
      if (blob?.type === 'image/webp') previews.push({ size, blob });
      canvas.width = canvas.height = 0;
    }
    return previews;
  } finally { image.close(); }
}
