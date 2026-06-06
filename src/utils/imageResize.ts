export interface ResizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maintainAspectRatio?: boolean;
}

export async function resizeImage(
  file: File,
  options: ResizeOptions = {}
): Promise<{ blob: Blob; width: number; height: number; originalSize: number; newSize: number }> {
  const {
    maxWidth = 1000,
    maxHeight = 100,
    quality = 0.9,
    maintainAspectRatio = true,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (maintainAspectRatio) {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          width = Math.min(width, maxWidth);
          height = Math.min(height, maxHeight);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not create blob'));
              return;
            }

            resolve({
              blob,
              width: Math.round(width),
              height: Math.round(height),
              originalSize: file.size,
              newSize: blob.size,
            });
          },
          file.type === 'image/png' ? 'image/png' : 'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Could not load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Could not read file'));
    };

    reader.readAsDataURL(file);
  });
}

export function validateImageDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { valid: boolean; message?: string } {
  if (height > maxHeight * 2) {
    return {
      valid: false,
      message: `L'image est trop haute (${height}px). Maximum recommandé : ${maxHeight}px`,
    };
  }

  if (width < 50) {
    return {
      valid: false,
      message: `L'image est trop petite (${width}px de large). Minimum : 50px`,
    };
  }

  return { valid: true };
}

export function getImageInfo(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };

      img.onerror = () => {
        reject(new Error('Could not load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Could not read file'));
    };

    reader.readAsDataURL(file);
  });
}
