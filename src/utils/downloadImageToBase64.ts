import { convertBase64 } from "./convertBase64";

export async function downloadImageToBase64(url: string, format = "image/jpeg", quality = 0.97): Promise<string> {
  const response = await fetch(url)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(blob);
    fileReader.onload = async () => {
      let base64Jpeg = ""
      try {
        // e-commerce websites supports a variety of format,
        // like webp or avif
        // for our own sanity, we convert everything to one format (jpeg)
        const base64InUnknownFormat = `${fileReader.result}`
        base64Jpeg = await convertBase64(base64InUnknownFormat)

        if (base64Jpeg.length < 256) { throw new Error(`the base64 data uri looks invalid`) }
      } catch (err) {
        const errorMessage = `Error: failed to convert ${url} to ${format}: ${err}`
        reject(new Error(errorMessage))
        return
      }
      resolve(base64Jpeg)
    };
    fileReader.onerror = (error) => { reject(error); };
  });
}