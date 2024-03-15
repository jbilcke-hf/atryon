
export function imageToBase64(
  img: HTMLImageElement,
  format = "image/jpeg" // could also be image/png I guess
  ) {
  var canvas = document.createElement("canvas")

  canvas.width = img.width
  canvas.height = img.height

  var ctx = canvas.getContext("2d")

  ctx!.drawImage(img, 0, 0)

  return canvas.toDataURL(format)
}
