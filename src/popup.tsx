import React, { useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom/client"
import { CircularProgressBar } from "@tomickigrzegorz/react-circular-progress-bar";

import "@/globals.css"

import { cn, sleep } from "@/utils"

import { ImageURL } from "./types"
import { useSettings } from "./hooks/useSettings"
import { runScanImages } from "./utils/runScanImages"
import { replaceImage } from "./components/core/replaceImage"
import { runReplaceImages } from "./utils/runReplaceImages"

const initialCircularProgressConfig = {
  id: 0, // important
  percent: 0,
  colorSlice: "#E91E63",
  number: false,
  size: 192,
};

function Popup() {
  const [updatedCircularProgressConfig, setCircularProgressConfig] = useState(initialCircularProgressConfig);
  const circularProgressConfig = { ...initialCircularProgressConfig, ...updatedCircularProgressConfig };

  // do we still need this?
  const [currentURL, setCurrentURL] = useState<string>()

  const settings = useSettings()

  const [isEnabled, setEnabled] = useState(false)

  const state = useRef<{
    isEnabled: boolean
    isScanningImages: boolean
    isProcessingImages: boolean
    isReplacingImages: boolean
    images: Record<string, ImageURL>
    nbProcessedImages: number
    nbImagesToProcess: number
    pageProcessingStartedAt: number
    currentImageProcessingStartedAt: number
    currentImageProcessingEndedAt: number
    pageProcessingEndedAt: number
    progressInterval?: NodeJS.Timeout
  }>({
    isEnabled: false,
    isScanningImages: false,
    isProcessingImages: false,
    isReplacingImages: false,
    images: {},
    nbProcessedImages: 0,
    nbImagesToProcess: 0,
    pageProcessingStartedAt: 0,
    currentImageProcessingStartedAt: 0,
    currentImageProcessingEndedAt: 0,
    pageProcessingEndedAt: 0,
    progressInterval: undefined,
  })


  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url)
    })
  }, [])

  const askToScanImages = async () => {
    console.log("askToScanImages()")
    state.current.isScanningImages = true

    // first we check to see if there are any new images
    try {
      const images = await runScanImages()
      console.log("popup.tsx: images:", images)

      for (let image of images) {
        const existingImage = state.current.images[image.originalUri]
        if (existingImage) { continue }

        state.current.images[image.originalUri] = {
          ...image,
          status: "unprocessed",
          proposedUris: [],
        }
      }
    } catch (err) {
      console.error(err)
    }

    state.current.isScanningImages = false
  }

  const askToReplaceImages = async () => {
    console.log("askToReplaceImages()")
    state.current.isReplacingImages = true

    // first we check to see if there are any new images
    try {
      const success = await runReplaceImages(Object.values(state.current.images))
      console.log("success:", success)
    } catch (err) {
      console.error(err)
    }

    state.current.isReplacingImages = false
  }

  const mainLoop = async () => {
    console.log("mainLoop()")

    // update the image index to add new images
    await askToScanImages()
    
    // then we process the queue, X images at a time
    // (eg. 4 requests)

    let maxNbRequests = 1
    let nbRequests = 0

    state.current.isProcessingImages = true

    state.current.nbProcessedImages = 0
    state.current.nbImagesToProcess = 1

    // note: since we are reading the values from an object,
    // we want to sort them again
    const allIndexedImages = Object.values(state.current.images).sort((a, b) => {
      // calculates the total pixels of the image (width * height)
      const totalPixelsA = a.width * a.height;
      const totalPixelsB = b.width * b.height;

      // sort in descending order
      return totalPixelsB - totalPixelsA;
    });
    
    const unprocessedImages = allIndexedImages.filter(image =>
      image.status === "unprocessed"
    )

    console.log("debug:", {
      "state.current.images:": state.current.images,
      allIndexedImages,
      unprocessedImages,
    })
    
    for (let image of unprocessedImages) {
      
      // console.log(`asking API to replace this b64 image ${image.dataUri.slice(0, 60)}.. (${image.originalUri})`)
      image.status = "processing"

      state.current.currentImageProcessingStartedAt = Date.now()

      try {

        const proposedUris = await replaceImage(image.dataUri)

        // console.log(`got ${proposedUris.length} image replacements!`)

        image.proposedUris = [
          ...image.proposedUris,
          ...proposedUris,
        ]

        image.status = "success"
      } catch (err) {
        console.log(`failed to replace an image:`, err)
        image.status = "failed"
        // image.proposedUris = [] // no need I think
      }


      state.current.currentImageProcessingEndedAt = Date.now()
      state.current.nbProcessedImages = state.current.nbProcessedImages + 1

      // we temporize a bit, to avoid being falsely throttled by "Google's algorithm"
      // (Chrome's DDoS detector gets angry if we do too many requests)
      await sleep(3000)

      if (nbRequests++ >= maxNbRequests) {
        console.log("reached the max number of images.. self-stopping")
        setEnabled(false)
        break
      }
    }

    state.current.isProcessingImages = false

    // try to replace the images
    try {
      await askToReplaceImages()
    } catch (err) {
      console.error(`failed to call askToReplaceImages()`)
    }

    // finally, we try to scan the page again for any new image
    if (state.current.isEnabled) {
      setTimeout(async () => {
        await mainLoop()
      }, 4000)
    }
  }
  useEffect(() => {
    if (isEnabled && !state.current.isEnabled) {
      state.current.isEnabled = true
      mainLoop()
    } else if (!isEnabled && state.current.isEnabled) {
      state.current.isEnabled = false
    }
  }, [JSON.stringify(settings)])

  useEffect(() => {
    // we do a bit of reset
    clearInterval(state.current.progressInterval)
    
    if (isEnabled) {
      // we reset the counters
      state.current.nbProcessedImages = 0
      state.current.nbImagesToProcess = 0
    
      state.current.pageProcessingStartedAt = Date.now()
      state.current.currentImageProcessingStartedAt = Date.now()
      state.current.currentImageProcessingEndedAt = 0
      state.current.pageProcessingEndedAt = 0

      // we reset the circular progress config whenever we start or stop
      setCircularProgressConfig({
        ...initialCircularProgressConfig,
        id: 0, // we indicate which component we want to change
        percent: 0
      })
            
      state.current.progressInterval = setInterval(() => {
        // we compute the progress, which might include multiple phases (based on the nb of images to convert)

        // we use 100% percentage (we could also use seconds)
        const maxProgress = 100

        // COARSE ESTIMATOR
        // gives a value between 0 and 100
        // this will be like 0, 25, 50, 75, 100 etc.. if there are 4 images
        const coarseProgress =
        (state.current.nbProcessedImages  < 1 || state.current.nbImagesToProcess < 1)
          ? 0
          : Math.max(
            0,
            Math.min(
              maxProgress,
              maxProgress * (state.current.nbProcessedImages / state.current.nbImagesToProcess)
            ))

        // gives us how many percent is taken by an image
        // eg if 2 images -> 50%, if 3 images then 33.333..% etc
        let coarseResolution =
          (maxProgress < 1 || state.current.nbProcessedImages < 1)
            ? 100
            : (maxProgress / state.current.nbProcessedImages)
        
        // FINE ESTIMATOR
        // each image should take ~20 seconds with normal server usage
        const expectedTimeSpentOnCurrentImageInMs = 30 * 1000

        const timeSpentOnCurrentImageInMs = Date.now() - state.current.currentImageProcessingStartedAt 

        // gives a value between 0 and coarseResolution
        // if job is taking longer than expected, then the progress bar will be "stuck" on the coarseResolution
        const fineProgress = Math.max(0, Math.min(coarseResolution, coarseResolution * (timeSpentOnCurrentImageInMs / expectedTimeSpentOnCurrentImageInMs)))
    
        // finally we compute the final progress value
        // it is expect that this progress bar gets stuck from tiem to time if the server is busy
        const finalProgress = Math.max(0, Math.min(maxProgress, coarseProgress + fineProgress))
        
        // uncomment during development if you need to investigate
        /*
        console.log(`updating progress:`, {
          coarseProgress,
          coarseResolution,
          expectedTimeSpentOnCurrentImageInMs,
          timeSpentOnCurrentImageInMs,
          fineProgress,
          finalProgress,
        })
        */

        setCircularProgressConfig({
          ...initialCircularProgressConfig,
          id: 0, // we indicate which component we want to change
          percent: finalProgress
        });
      }, 500);
    }

    return () => clearInterval(state.current.progressInterval);
  }, [isEnabled]);

  return (
    <div className={cn(
     // `flex flex-col`,
     //  `items-center`,
     //  `justify-center`,
     `bg-gray-800`,
      `w-64 h-64`,
      `p-4`
    )}>
      {settings.hasValidCredentials && settings.hasValidBodyModels && <div className="fixed top-2 left-8 flex flex-col items-center justify-center">
        <CircularProgressBar {...circularProgressConfig}>
          <div
            className={cn(
              `fixed top-8 left-14`,
              `flex flex-col items-center justify-center`,
              `bg-sky-500 hover:bg-sky-400`,
              `cursor-pointer`,
              `rounded-full`,
              `w-36 h-36`
            )}
            onClick={() => setEnabled(!isEnabled)}>
            <div className="text-lg font-semibold">{isEnabled ? "Stop" : "Start"}</div>
            <div className="text-lg font-semibold">{
              Math.round(circularProgressConfig.percent || 0)
            }%</div>
          </div>
        </CircularProgressBar>
      </div>}
      {(!settings.hasValidCredentials || !settings.hasValidBodyModels) && <div
        onClick={() => {
          chrome.runtime.openOptionsPage()
        }}
        className="text-sm text-gray-300 italic hover:underline cursor-pointer">
        {
        (!settings.hasValidCredentials && settings.hasValidBodyModels)
          ? 'Click here to finish the setup and provide pictures of yourself.' :
          (settings.hasValidCredentials && !settings.hasValidBodyModels)
          ? 'Click here to finish the setup and configure the service provider.' :
          'Click here to configure the service provider and provide pictures of yourself.'
        }
      </div>}
      <div className="fixed bottom-2 text-sm text-gray-300 italic">
        Note: closing this panel will stop<br/> any pending image generation.
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
