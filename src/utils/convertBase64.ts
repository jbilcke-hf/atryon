/**
 * Convert a base 64 data uri image (whcih can be in any format)
 * to a base64 (jpeg)
 * 
 * @param originalImageBase64 
 * @param desiredFormat 
 * @returns 
 */
export async function convertBase64(
  originalImageBase64: string,
  format = "image/jpeg",
  quality = 0.97
  ): Promise<string> {
  return new Promise((resolve, reject) => {
    // Creating new image object
    const img = new Image();
    // Setting source of the image as base64 string
    img.src = originalImageBase64;

    img.onload = function() {
      let outputBase64 = ""
      try {
        // Creating canvas and getting context
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error(`cannot acquire 2D context`)
        }

        const dpr = window.devicePixelRatio || 1;
        // Applying DPR to the canvas size
        canvas.width = img.width * dpr;
        canvas.height = img.height * dpr;
        
        // Set the CSS size to the original image size
        canvas.style.width = `${img.width}px`;
        canvas.style.height = `${img.height}px`;

        ctx.scale(dpr, dpr);

        // Drawing the image into the canvas
        ctx.drawImage(img, 0, 0);

        // Converting the canvas data to base64 and resolving the promise
        outputBase64 = canvas.toDataURL(format, quality);
      } catch (err) {
        const errorMessage = `failed to convert input image to base64 ${format}: ${err}`
        reject(new Error(errorMessage))
        return
      }

      resolve(outputBase64);
    };

    img.onerror = function(err) {
      reject(`Error while loading the image: ${err}`);
    };
  });
}