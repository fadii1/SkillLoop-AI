/**
 * Utility to convert an image file (e.g. from user's gallery / file picker)
 * into a lightweight, high-resolution base64 JPEG data URL for profile avatars.
 */
export function readImageAsAvatar(file: File, maxDimension = 360): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please select an image file (JPEG, PNG, WEBP, etc.)."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const rawResult = readerEvent.target?.result as string;
      if (!rawResult) {
        reject(new Error("Could not read image file."));
        return;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(rawResult);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Clean high quality, compact JPEG
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.88);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        resolve(rawResult);
      };

      img.src = rawResult;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
