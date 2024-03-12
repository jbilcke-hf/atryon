import { WorkerMessage, ImageURL } from "@/types"
import { getImageDimension } from "@/utils/getImageDimension"

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  const message = JSON.parse(JSON.stringify(msg))
  const action = `${message.action || "UNKNOWN"}` as WorkerMessage

  console.log(`content_script.tsx: action: ${action}`)

    const fn = async () => {

    if (action === "SCAN_IMAGES") {
        
      let images: ImageURL[] = []

      try {

        console.log(`ON SCAN_IMAGES..`)
        // main job: to regularly update the currentImages object
        const currentImages = document.getElementsByTagName("img")

        for (let i = 0, l = currentImages.length; i<l; i++) {
          const originalUri = currentImages[i].src

          let resolution: { width: number; height: number } = { width: 0, height: 0 }
          try {
            resolution = await getImageDimension(originalUri)
          } catch (err) {
            // resolution = { width: 0, height: 0 }
            console.error(`failed to detect resolution of image ${originalUri}: ${err}`)
          }
          
          const { width, height } = resolution
     
          images.push({
            originalUri,
            width,
            height,
            goodCandidate: width >= 640 && height >= 640,
            status: "unprocessed",
            proposedUris: [],
          })
        }

      } catch (err) {
        console.error(`failed to scan the images!`, err)
      }

      console.log("returning an ImageURL array:", images)
      sendResponse(images)
    } else if (action === "REPLACE_IMAGES") {

      console.log("content_script.tsx: got action to replace the image..")
      const index: Record<string, ImageURL> = {}
      const images = message.images as ImageURL[]
      for (let image of images) {
        index[image.originalUri] = image
      }

      let replacedImages: ImageURL[] = []

      try {

        console.log(`ON REPLACE_IMAGES..`)
        // main job: to regularly update the currentImages object
        const currentImages = document.getElementsByTagName("img")

        for (let i = 0, l = currentImages.length; i<l; i++) {
          const originalUri = currentImages[i].src
          // console.log(`image ${i}:`, originalUri)
          const match = index[originalUri]
          // console.log("match:", match)
          if (match && match?.proposedUris?.length) {
            // console.log("match is valid!")
            currentImages[i].src = match.proposedUris[0]
            replacedImages.push(match)
          }
        }

        console.log(`replaced ${replacedImages.length} images`)

      } catch (err) {
        console.error("failed to replace the image:", err)
      }

      sendResponse(true)
    } else if (action === "RESET") {
      sendResponse("success")
    } else {
      sendResponse("unknown action")
    }
  }

  setTimeout(() => {
    fn()
  }, 10)

  // we return true as sendResponse will be async
  return true
})