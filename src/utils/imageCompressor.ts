/**
 * Compresses an image data URL (Base64) to a lightweight client-side JPEG data URL.
 * Extends LocalStorage lifecycle limits indefinitely by taking large images (e.g., 5MB 4K screenshots)
 * and compressing them down into clean web-optimized sizes (e.g., < 100KB).
 */
export async function compressImage(dataUrl: string, maxWidth = 1920, quality = 0.95): Promise<string> {
  // If not a data URL (e.g. an external web URL link), return as is
  if (!dataUrl.startsWith('data:')) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = dataUrl;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Restrict maximum width or height to preserve proportions while lowering memory load
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl); // Return source image as fallback
        return;
      }

      // Draw and export as compressed quality JPEG
      ctx.fillStyle = '#FFFFFF'; // Ensure transparent PNG background gets filled cleanly
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } catch (err) {
        console.warn('Canvas scaling failed, fallback to original:', err);
        resolve(dataUrl);
      }
    };

    img.onerror = () => {
      resolve(dataUrl); // Fallback on load failure
    };
  });
}

/**
 * Crops an image data URL to a selected aspect ratio first, then compresses/handles high quality.
 * Supported aspect ratios: '16:9' | '9:16' | '3:4' | '1:1' | 'original'
 */
export async function cropAndCompressImage(
  dataUrl: string, 
  ratio: '16:9' | '9:16' | '3:4' | '1:1' | 'original', 
  maxWidth = 1920, 
  quality = 0.95
): Promise<string> {
  if (!dataUrl.startsWith('data:')) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = dataUrl;
    img.onload = () => {
      const srcWidth = img.width;
      const srcHeight = img.height;

      let cropX = 0;
      let cropY = 0;
      let cropWidth = srcWidth;
      let cropHeight = srcHeight;

      if (ratio !== 'original') {
        let targetRatio = 1;
        if (ratio === '16:9') targetRatio = 16 / 9;
        else if (ratio === '9:16') targetRatio = 9 / 16;
        else if (ratio === '3:4') targetRatio = 3 / 4;
        else if (ratio === '1:1') targetRatio = 1 / 1;

        const srcRatio = srcWidth / srcHeight;

        if (srcRatio > targetRatio) {
          // Source image is wider than target aspect ratio -> crop width from horizontal center
          cropHeight = srcHeight;
          cropWidth = Math.round(srcHeight * targetRatio);
          cropX = Math.round((srcWidth - cropWidth) / 2);
          cropY = 0;
        } else {
          // Source image is taller than target aspect ratio -> crop height from vertical center
          cropWidth = srcWidth;
          cropHeight = Math.round(srcWidth / targetRatio);
          cropX = 0;
          cropY = Math.round((srcHeight - cropHeight) / 2);
        }
      }

      // Determine dimensions of target canvas
      let targetWidth = cropWidth;
      let targetHeight = cropHeight;

      if (targetWidth > maxWidth) {
        targetHeight = Math.round((targetHeight * maxWidth) / targetWidth);
        targetWidth = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      // Draw and export as high quality JPEG
      ctx.fillStyle = '#FFFFFF'; // Ensure transparent background gets filled with white cleanly
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      
      // Draw selected crop area
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        targetWidth,
        targetHeight
      );

      try {
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } catch (err) {
        console.warn('Canvas cropping & scaling failed, fallback to original:', err);
        resolve(dataUrl);
      }
    };

    img.onerror = () => {
      resolve(dataUrl);
    };
  });
}
