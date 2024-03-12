import { ImageReplacer, PredictionReplaceImageWithReplicate, Settings } from "@/types"
import { sleep } from "@/utils"
import { getDefaultSettings } from "@/utils/getDefaultSettings"

export const replaceImage: ImageReplacer = async ({ garmentImage, modelImage }) => {
  const settings = await chrome.storage.sync.get(getDefaultSettings()) as Settings

  if (settings.engine !== "REPLICATE") {
    throw new Error(`providers/replicate.ts: can only be used with the REPLICATE engine`)
  }

  if (!garmentImage) {
    throw new Error(`providers/replicate.ts: the garmentImage appears invalid`)
  }

  if (!modelImage) {
    throw new Error(`providers/replicate.ts: the modelImage appears invalid`)
  }

  if (!settings.replicateApiKey) {
    throw new Error(`providers/replicate.ts: the replicateApiKey appears invalid`)
  }

  if (!settings.replicateModel) {
    throw new Error(`providers/replicate.ts: the replicateModel appears invalid`)
  }

  if (!settings.replicateModelVersion) {
    throw new Error(`providers/replicate.ts: the replicateModelVersion appears invalid`)
  }
  

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${settings.replicateApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: settings.replicateModelVersion,
      input: {
        seed: 0, // or generateSeed()
        steps: settings.replicateNumberOfSteps,
        model_image: modelImage,
        garment_image: garmentImage,
        guidance_scale: settings.replicateGuidanceScale
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json()
  const unresolvedPrediction = data as PredictionReplaceImageWithReplicate

  let pollingCount = 0
  do {
    await sleep(4000)
    console.log("providers/replicate.ts: polling Replicate..")

    const response = await fetch(unresolvedPrediction.urls.get, {
      method: "POST",
      headers: {
        "Authorization": `Token ${settings.replicateApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: settings.replicateModelVersion,
        input: {
          seed: 0, // or generateSeed()
          steps: settings.replicateNumberOfSteps,
          model_image: modelImage,
          garment_image: garmentImage,
          guidance_scale: settings.replicateGuidanceScale
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resolvedPrediction = (await response.json()) as PredictionReplaceImageWithReplicate

    if (
      resolvedPrediction.status === "starting" ||
      resolvedPrediction.status === "processing"
    ) {
      console.log("providers/replicate.ts: Replicate is still busy.. maybe it is warming-up")
    } else if (
        resolvedPrediction.status === "failed" ||
        resolvedPrediction.status === "canceled"
    ) {
      throw new Error(`Failed to call Replicate: ${resolvedPrediction.logs || ""}`)
    } else if (
      resolvedPrediction.status === "succeeded"
    ) {
      return Array.isArray(resolvedPrediction.output) ? resolvedPrediction.output : []
    }

    pollingCount++

    // To prevent indefinite polling, we can stop after a certain number
    if (pollingCount >= 40) {
      throw new Error('Replicate request timed out.')
    }
  } while (true)
}