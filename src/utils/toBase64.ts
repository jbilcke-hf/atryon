export function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => { resolve(`${fileReader.result}`); };
    fileReader.onerror = (error) => { reject(error); };
  });
}