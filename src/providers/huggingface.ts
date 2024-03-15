import { ImageReplacer, ImageSegmenter, Settings } from "@/types"
import { generateSeed } from "@/utils"
import { getDefaultSettings } from "@/utils/getDefaultSettings"

export const replaceImage: ImageReplacer = async (garmentImage) => {
  const settings = await chrome.storage.local.get(getDefaultSettings()) as Settings

  if (settings.engine !== "DEFAULT" && settings.engine !== "GRADIO_API") {
    throw new Error(`replaceImage(): can only be used with the DEFAULT or GRADIO_API engine`)
  }

  // TODO: detect the type of image:
	// lone garment?
	// no garment at all?
	// upper body or full body?
	// has a human model, so it needs segmentation or not?

  const modelImage = settings.upperBodyModelImage
  if (!modelImage) {
    throw new Error(`replaceImage(): the modelImage appears invalid`)
  }

  const modelMaskImage = settings.upperBodyModelMaskImage
  if (!modelMaskImage) {
    throw new Error(`replaceImage(): the modelMaskImage appears invalid`)
  }

  if (!garmentImage) {
    throw new Error(`replaceImage(): the garmentImage appears invalid`)
  }

  if (!settings.huggingfaceApiKey) {
    throw new Error(`replaceImage(): the huggingfaceApiKey appears invalid`)
  }

  const numberOfSteps =
    settings.engine === "GRADIO_API"
    ? settings.customGradioApiNumberOfSteps
    : settings.huggingfaceNumberOfSteps

  const guidanceScale =
    settings.engine === "GRADIO_API"
    ? settings.customGradioApiGuidanceScale
    : settings.huggingfaceGuidanceScale

  const substitutionSpaceUrl =
    settings.engine === "GRADIO_API"
    ? settings.customGradioApiSubstitutionSpaceUrl
    : settings.huggingfaceSubstitutionSpaceUrl

  if (!substitutionSpaceUrl) {
    throw new Error(`replaceImage(): the substitutionSpaceUrl appears invalid`)
  }

  const seed = generateSeed()

  // we had to fork the oot server to make this possible, but this is worth it imho
  const nbSamples = 1

  const gradioUrl = substitutionSpaceUrl + (substitutionSpaceUrl.endsWith("/") ? "" : "/") + "api/predict"
  
  const params = {
    fn_index: 0, // <- important!
    data: [	
      modelImage,
      garmentImage,
      modelMaskImage,
      numberOfSteps,
      guidanceScale,
      seed,
      nbSamples,
    ]
  }

  console.log(`replaceImage(): calling fetch ${gradioUrl} with`, params)
  const res = await fetch(gradioUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
    cache: "no-store",
  })

  const { data } = await res.json()

  if (res.status !== 200 || !Array.isArray(data)) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error(`Failed to fetch data (status: ${res.status})`)
  }

  if (!data[0]) {
    throw new Error(`the returned image was empty`)
  }
  // console.log(`replaceImage:(): data = `, data)
  return data as string[]
}

export const segmentImage: ImageSegmenter = async (modelImage) => {
  const settings = await chrome.storage.local.get(getDefaultSettings()) as Settings

  if (settings.engine !== "DEFAULT" && settings.engine !== "GRADIO_API") {
    throw new Error(`segmentImage(): can only be used with the DEFAULT or GRADIO_API engine`)
  }

  if (!modelImage) {
    throw new Error(`segmentImage(): the modelImage appears invalid`)
  }

  if (!settings.huggingfaceApiKey) {
    throw new Error(`segmentImage(): the huggingfaceApiKey appears invalid`)
  }

  if (!settings.huggingfaceSegmentationSpaceUrl) {
    throw new Error(`segmentImage(): the huggingfaceSegmentationSpaceUrl appears invalid`)
  }

  const segmentationSpaceUrl =
    settings.engine === "GRADIO_API"
    ? settings.customGradioApiSegmentationSpaceUrl
    : settings.huggingfaceSegmentationSpaceUrl

  if (!segmentationSpaceUrl) {
    throw new Error(`segmentImage(): the segmentationSpaceUrl appears invalid`)
  }

  const gradioUrl = segmentationSpaceUrl + (segmentationSpaceUrl.endsWith("/") ? "" : "/") + "api/predict"
  
  const params = {
    fn_index: 0, // <- important!
    data: [	
      modelImage
    ]
  }

  //console.log(`segmentImage(): calling fetch(${gradioUrl}, ${JSON.stringify(params, null, 2)})`)
  
  const res = await fetch(gradioUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
    cache: "no-store",
  })

  const { data } = await res.json()

  if (res.status !== 200 || !Array.isArray(data)) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error(`Failed to fetch data (status: ${res.status})`)
  }

  if (!data[0]) {
    throw new Error(`the returned image was empty`)
  }
  
  const {
    face_mask,
    mask,
    model_mask,
    model_parse,
    original_image
  } = data[0] as {
    face_mask: string
    mask: string

    // this represents the original image, minus the garment (which will become gray)
    model_mask: string
    model_parse: string
    original_image: string
  }

  return mask
}