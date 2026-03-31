export interface CompressOptions {
  quality: number
  maxWidth: number
  maxHeight: number
  keepAspectRatio: boolean
  outputFormat: 'image/jpeg' | 'image/png' | 'image/webp'
}

export interface CompressResult {
  blob: Blob
  dataUrl: string
  width: number
  height: number
  size: number
}

export function compressImage(file: File, options: CompressOptions): Promise<CompressResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      const ratio = width / height;

      if (options.keepAspectRatio) {
        if (width > options.maxWidth) {
          width = options.maxWidth;
          height = Math.round(width / ratio);
        }
        if (height > options.maxHeight) {
          height = options.maxHeight;
          width = Math.round(height * ratio);
        }
      }
      else {
        width = Math.min(width, options.maxWidth);
        height = Math.min(height, options.maxHeight);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Compression failed'));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              blob,
              dataUrl: reader.result as string,
              width,
              height,
              size: blob.size,
            });
          };
          reader.readAsDataURL(blob);
        },
        options.outputFormat,
        options.quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image load failed'));
    };

    img.src = url;
  });
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
