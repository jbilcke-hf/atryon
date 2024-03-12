import React, { useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom/client"

import "@/globals.css"

import { Button } from "@/components/ui/button"
import { cn } from "@/utils"
import { ImageURL } from "./types"
import { useSettings } from "./hooks/useSettings"
import { runScanImages } from "./utils/runScanImages"
import { replaceImage } from "./components/core/replaceImage"
import { runReplaceImages } from "./utils/runReplaceImages"

function Popup() {
	const [currentURL, setCurrentURL] = useState<string>()
	const settings = useSettings()
	const [count, setCount] = useState(0)
	const state = useRef<{
		isActive: boolean
		isScanningImages: boolean
		isProcessingImages: boolean
		isReplacingImages: boolean
		images: Record<string, ImageURL>
	}>({
		isActive: false,
		isScanningImages: false,
		isProcessingImages: false,
		isReplacingImages: false,
		images: {},
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

		const allIndexedImages = Object.values(state.current.images)
		
		const unprocessedImages = allIndexedImages.filter(image =>
			image.status !== "success" &&
			image.status !== "failed" &&
			image.status !== 'invalid'
		)

		for (let image of unprocessedImages) {
			console.log(`asking API to replace this image: ${image.originalUri}`)

			if (settings.engine)
			image.status = "processing"

			try {
        /*
				const proposedUris = await replaceImage({
					modelImage: settings.modelImage,
					garmentImage: image.originalUri,
				})
        */
       const proposedUris = [
        "test_julian"
       ]
			
				console.log(`got ${proposedUris.length} image replacements!`)

				image.proposedUris = [
					...image.proposedUris,
					...proposedUris,
				]

				image.status = "success"
			} catch (err) {
				console.log(`failed to replace an image:`, err)
				image.status = "failed"
			}

			if (nbRequests++ >= maxNbRequests) {
				console.log("reached the max number of requests")
				break
			}
		}


		state.current.isProcessingImages = false

		// try to replace the images
		await askToReplaceImages()

		if (state.current.isActive) {
			setTimeout(async () => {
				await mainLoop()
			}, 2000)
		}
	}
	useEffect(() => {
		if (settings.isEnabled && !state.current.isActive) {
			state.current.isActive = true
			mainLoop()
		} else if (!settings.isEnabled && state.current.isActive) {
			state.current.isActive = false
		}
	}, [JSON.stringify(settings)])

	return (
		<div className={cn(
			`flex flex-col`,
			`items-center`,
			`w-96 h-64`,
			`p-4`
		)}>
			<div className="">
				<div>Atryon: AI Virtual Try-On!</div>
				<div>
					<Button
					  onClick={() => {
							if (settings.isEnabled) {
								settings.setEnabled(false)
							} else {
								settings.setEnabled(true)
							}
						}}>
						{settings.isEnabled ? "Disable" : "Enable"}
					</Button>
				</div>
        <div>
        {settings.isEnabled && <p>Replacing images..<br />(please don&aps;t close this popup!)</p>}
        </div>
				{/*
				<div>
					<Button
					  onClick={() => sendMessage("RESET")}>
						Reset
					</Button>
				</div>
					*/}
			</div>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>
);
