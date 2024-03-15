import { ImageReplacer, ImageSegmenter, PredictionReplaceImageWithReplicate, Settings } from "@/types"
import { generateSeed, sleep } from "@/utils"
import { getDefaultSettings } from "@/utils/getDefaultSettings"


export const segmentImage: ImageSegmenter = async (modelImage) => {
  const settings = await chrome.storage.local.get(getDefaultSettings()) as Settings

  if (settings.engine !== "REPLICATE") {
    throw new Error(`segmentImage(): can only be used with the REPLICATE engine`)
  }

  if (!modelImage) {
    throw new Error(`segmentImage(): the modelImage appears invalid`)
  }

  if (!settings.replicateApiKey) {
    throw new Error(`segmentImage(): the replicateApiKey appears invalid`)
  }

  if (!settings.replicateSegmentationModel) {
    throw new Error(`segmentImage(): the replicateSegmentationModel appears invalid`)
  }

  if (!settings.replicateSegmentationModelVersion) {
    throw new Error(`segmentImage(): the replicateSegmentationModelVersion appears invalid`)
  }
  
  if (!settings.replicateSubstitutionModel) {
    throw new Error(`segmentImage(): the replicateSubstitutionModel appears invalid`)
  }

  if (!settings.replicateSubstitutionModelVersion) {
    throw new Error(`segmentImage(): the replicateSubstitutionModelVersion appears invalid`)
  }
  
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${settings.replicateApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: settings.replicateSegmentationModelVersion,
      input: {
        model_image: modelImage,
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
    console.log("segmentImage(): polling Replicate..")

    const response = await fetch(unresolvedPrediction.urls.get, {
      method: "GET",
      headers: {
        "Authorization": `Token ${settings.replicateApiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resolvedPrediction = (await response.json()) as PredictionReplaceImageWithReplicate

    if (
      resolvedPrediction.status === "starting" ||
      resolvedPrediction.status === "processing"
    ) {
      console.log("segmentImage(): Replicate is still busy.. maybe it is warming-up")
    } else if (
        resolvedPrediction.status === "failed" ||
        resolvedPrediction.status === "canceled"
    ) {
      throw new Error(`Failed to call Replicate: ${resolvedPrediction.logs || ""}`)
    } else if (
      resolvedPrediction.status === "succeeded"
    ) {
      return typeof resolvedPrediction.output === "string" ? resolvedPrediction.output : ""
    }

    pollingCount++

    // To prevent indefinite polling, we can stop after a certain number
    if (pollingCount >= 40) {
      throw new Error('Replicate request timed out.')
    }
  } while (true)
}

export const replaceImage: ImageReplacer = async (garmentImage) => {
  const settings = await chrome.storage.local.get(getDefaultSettings()) as Settings

  if (settings.engine !== "REPLICATE") {
    throw new Error(`replaceImage(): can only be used with the REPLICATE engine`)
  }

  if (!garmentImage) {
    throw new Error(`replaceImage(): the garmentImage appears invalid`)
  }

  const modelImage = settings.upperBodyModelImage
  if (!modelImage) {
    throw new Error(`replaceImage(): the modelImage appears invalid`)
  }

  const modelMaskImage = settings.upperBodyModelMaskImage
  if (!modelMaskImage) {
    throw new Error(`replaceImage(): the modelMaskImage appears invalid`)
  }

  if (!settings.replicateApiKey) {
    throw new Error(`replaceImage(): the replicateApiKey appears invalid`)
  }

  if (!settings.replicateSegmentationModel) {
    throw new Error(`replaceImage(): the replicateSegmentationModel appears invalid`)
  }

  if (!settings.replicateSegmentationModelVersion) {
    throw new Error(`replaceImage(): the replicateSegmentationModelVersion appears invalid`)
  }
  
  if (!settings.replicateSubstitutionModel) {
    throw new Error(`replaceImage(): the replicateSubstitutionModel appears invalid`)
  }

  if (!settings.replicateSubstitutionModelVersion) {
    throw new Error(`replaceImage(): the replicateSubstitutionModelVersion appears invalid`)
  }
  
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${settings.replicateApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: settings.replicateSubstitutionModel,
      input: {
        model_image: modelImage,
        garment_image: garmentImage,
        person_mask: modelMaskImage,
        steps: settings.replicateNumberOfSteps,
        guidance_scale: settings.replicateGuidanceScale,
        seed: generateSeed()
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
    console.log(`replaceImage(): polling Replicate..`)

    const response = await fetch(unresolvedPrediction.urls.get, {
      method: "GET",
      headers: {
        "Authorization": `Token ${settings.replicateApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: settings.replicateSubstitutionModelVersion,
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
      console.log("replaceImage(): Replicate is still busy.. maybe it is warming-up")
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