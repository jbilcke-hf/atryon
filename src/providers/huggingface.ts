import { ImageReplacer, ImageSegmenter, Settings } from "@/types"
import { getDefaultSettings } from "@/utils/getDefaultSettings"

export const replaceImage: ImageReplacer = async (modelImage) => {
  const settings = await chrome.storage.sync.get(getDefaultSettings()) as Settings

  if (settings.engine !== "DEFAULT" && settings.engine !== "GRADIO_API") {
    throw new Error(`segmentImage(): can only be used with the DEFAULT or GRADIO_API engine`)
  }

  if (!modelImage) {
    throw new Error(`segmentImage(): the modelImage appears invalid`)
  }

  if (!settings.huggingfaceApiKey) {
    throw new Error(`segmentImage(): the huggingfaceApiKey appears invalid`)
  }

  const substitutionSpaceUrl =
    settings.engine === "GRADIO_API"
    ? settings.customGradioApiSubstitutionSpaceUrl
    : settings.huggingfaceSubstitutionSpaceUrl

  if (!substitutionSpaceUrl) {
    throw new Error(`segmentImage(): the huggingfaceSegmentationSpaceUrl appears invalid`)
  }

  const gradioUrl = substitutionSpaceUrl + (substitutionSpaceUrl.endsWith("/") ? "" : "/") + "api/predict"
  
  const params = {
    fn_index: 0, // <- important!
    data: [	
      modelImage
    ]
  }

  console.log(`segmentImage(): calling fetch(${gradioUrl}, ${JSON.stringify(params, null, 2)})`)
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
  console.log(`segmentImage:(): data = `, data)
  if (res.status !== 200 || !Array.isArray(data)) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error(`Failed to fetch data (status: ${res.status})`)
  }

  if (!data[0]) {
    throw new Error(`the returned image was empty`)
  }

  return data[0] as string[]
}

export const segmentImage: ImageSegmenter = async (modelImage) => {
  const settings = await chrome.storage.sync.get(getDefaultSettings()) as Settings

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

  console.log(`segmentImage(): calling fetch(${gradioUrl}, ${JSON.stringify(params, null, 2)})`)
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
  console.log(`segmentImage:(): data = `, data)
  if (res.status !== 200 || !Array.isArray(data)) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error(`Failed to fetch data (status: ${res.status})`)
  }

  if (!data[0]) {
    throw new Error(`the returned image was empty`)
  }

  return data[0] as string
}