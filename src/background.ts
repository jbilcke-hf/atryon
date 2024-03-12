
/*

import { ImageURL, Settings, WorkerMessage } from "./types"
import { runScanImages } from "./utils/runScanImages"
import { replaceImage } from "./components/core/replaceImage"
import { runReplaceImages } from "./utils/runReplaceImages"
import { getDefaultSettings } from "./utils/getDefaultSettings"

const state: {
  isActive: boolean
  isScanningImages: boolean
  isProcessingImages: boolean
  isReplacingImages: boolean
  images: Record<string, ImageURL>
} = {
  isActive: false,
  isScanningImages: false,
  isProcessingImages: false,
  isReplacingImages: false,
  images: {},
}

const askToScanImages = async () => {
  console.log("background.ts: askToScanImages()")
  state.isScanningImages = true
  // first we check to see if there are any new images
  try {
    const images = await runScanImages()
    for (let image of images) {
      const existingImage = state.images[image.originalUri]
      if (existingImage) { continue }
      state.images[image.originalUri] = {
        ...image,
        status: "unprocessed",
        proposedUris: [],
      }
    }
  } catch (err) {
    console.error(err)
  }
  state.isScanningImages = false
}
const askToReplaceImages = async () => {
  console.log("background.ts: askToReplaceImages()")
  state.isReplacingImages = true
  // first we check to see if there are any new images
  try {
    const success = await runReplaceImages(Object.values(state.images))
  } catch (err) {
    console.error(err)
  }
  state.isReplacingImages = false
}
const mainLoop = async () => {
  console.log("background.ts: mainLoop()")
  // update the image index to add new images
  await askToScanImages()
  
  // then we process the queue, X images at a time
  // (eg. 4 requests)
  let maxNbRequests = 1
  let nbRequests = 0
  state.isProcessingImages = true
  const allIndexedImages = Object.values(state.images)
  
  const unprocessedImages = allIndexedImages.filter(image =>
    image.status !== "success" &&
    image.status !== "failed" &&
    image.status !== 'invalid'
  )

	const settings = await chrome.storage.sync.get(getDefaultSettings()) as Settings

  for (let image of unprocessedImages) {
    console.log(`background.ts: asking API to replace this image: ${image.originalUri}`)
    if (settings.engine)
    image.status = "processing"
    try {
      const proposedUris = await replaceImage({
        modelImage: settings.modelImage,
        garmentImage: image.originalUri,
      })
    
      console.log(`background.ts: got ${proposedUris.length} image replacements!`)
      image.proposedUris = [
        ...image.proposedUris,
        ...proposedUris,
      ]
      image.status = "success"
    } catch (err) {
      console.log(`background.ts: failed to replace an image:`, err)
      image.status = "failed"
    }
    if (nbRequests++ >= maxNbRequests) {
      console.log("background.ts: reached the max number of requests")
      break
    }
  }
  state.isProcessingImages = false
  // try to replace the images
  await askToReplaceImages()
  if (state.isActive) {
    setTimeout(async () => {
      await mainLoop()
    }, 2000)
  }
}

chrome.runtime.onMessage.addListener(async function (msg, sender, sendResponse) {
  const action = `${msg.action || "UNKNOWN"}` as WorkerMessage

  self.console.log(`background.ts: action: ${action}`)

	if (action === "ENABLE") {
		state.isActive = true
    mainLoop()

		return Promise.resolve(true)
	}

	if (action === "DISABLE") {
		state.isActive = false


		return Promise.resolve(true)
	}
})
*/

self.console.log(`background.ts: this is the background service worker`);

/*
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(`Change URL: ${tab.url}`);
});

chrome.bookmarks.getRecent(10, (results) => {
  console.log(`bookmarks:`, results);
});
*/

export {};
