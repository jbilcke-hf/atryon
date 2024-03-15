import { urlMightBeInvalid } from "@/heuristics/urlMightBeInvalid"
import { WorkerMessage, ImageURL } from "@/types"
import { downloadImageToBase64 } from "@/utils/downloadImageToBase64"
import { getImageDimension } from "@/utils/getImageDimension"
import { getVisibleImages } from "@/utils/getVisibleImages"

const state = {
  index: {} as Record<string, ImageURL>
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  const message = JSON.parse(JSON.stringify(msg))
  const action = `${message.action || "UNKNOWN"}` as WorkerMessage

  // console.log(`content_script.tsx: action: ${action}`)

  const fn = async () => {

    if (action === "SCAN_IMAGES") {
        
      let goodImages: ImageURL[] = []

      try {


        // main job: to regularly update the currentImages object
        const visibleImages = getVisibleImages()
        console.log(`Found ${visibleImages.length} visible images:`, visibleImages)

        for (let element of visibleImages) {
          const originalUri = element.src || ""

          // we try to avoid obviously "wrong" images
          if (urlMightBeInvalid(originalUri)) {
            continue
          }

          // finally, to optimize things and avoid endless download,
          // we also skip images that are already in the index
          if (state.index[originalUri]) {
            continue
          }

          let goodCandidate = true

          let dataUri = ""
          
          // now, the issue is that the image element might contain a low resolution version
          // so we want to actually re-download the original
          try {

            // TODO: maybe we should look into the src set, for an even higher resolution?
            const bestImageSrc = element.currentSrc || element.src || ""

            dataUri = await downloadImageToBase64(bestImageSrc)
          } catch (err) {
            // console.log(`failed to download an image: ${err}`)
            goodCandidate = false
          }

          let resolution: { width: number; height: number } = { width: 0, height: 0 }
  
          try {
            resolution = await getImageDimension(dataUri)
          } catch (err) {
            // resolution = { width: 0, height: 0 }
            // console.error(`failed to detect resolution of the image: ${err}`)
            goodCandidate = false
          }
          
          const { width, height } = resolution

          // we want to be a bit strict here
          // however we can't be *too* strict either,
          // as some sites don't pass the 1024px size limit
          // eg. https://www.checkpoint-tshirt.com/cdn/shop/products/empire-wave-tee-shirt-homme_denim_2048x.jpg?v=1680850296
          
          if (width < 1000) {
            goodCandidate = false
          }
          
          if (height < 1000) {
           goodCandidate = false
          }
   

          const imageURL: ImageURL = {
            originalUri,
            dataUri,
            width,
            height,
            goodCandidate,
            status: goodCandidate ? "unprocessed" : "invalid",
            proposedUris: [],
          }

          state.index[originalUri] = imageURL

          if (goodCandidate) {
            goodImages.push(imageURL)
          }
        }

      } catch (err) {
        console.error(`failed to scan the images:`, err)
      }

      console.log(`Found ${goodImages.length} good candidates:`, goodImages)
      sendResponse(goodImages)
    } else if (action === "REPLACE_IMAGES") {

      console.log("Replacing images in the page with those:",  message.images)
      const index: Record<string, ImageURL> = {}
      const images = message.images as ImageURL[]
      for (let image of images) {
        index[image.originalUri] = image
      }

      let replacedImages: ImageURL[] = []

      try {

        // note: here we replace images everywhere, even the invisible one
        // that's because the user might have scrolled within the page
        // while the request was running in the background
        const currentImages = document.images

        for (let i = 0, l = currentImages.length; i<l; i++) {
          const originalUri = currentImages[i].src
     
          const match = index[originalUri]

          // console.log(`image ${i}:`, originalUri)

          if (
            match &&
            match.goodCandidate &&
            match.status === "success" &&
            match?.proposedUris?.length) {
            console.log("match is valid! replacing image:", match)
            const firstProposal = match.proposedUris[0]

            // we need to replace both src and srcset
            currentImages[i].src = firstProposal
            currentImages[i].srcset = firstProposal

            replacedImages.push(match)
          }
        }

        console.log(`Replaced ${replacedImages.length} images within the page`)

      } catch (err) {
        console.error("failed to replace the images:", err)
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