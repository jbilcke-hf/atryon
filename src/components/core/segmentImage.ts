import { ImageSegmenter, Settings } from "@/types"
import { getDefaultSettings } from "@/utils/getDefaultSettings"
import { segmentImage as segmentImageWithReplicate } from "../../providers/replicate"
import { segmentImage as segmentImageWithHuggingface } from "../../providers/huggingface"

export const segmentImage: ImageSegmenter = async (params) => {
  const settings = await chrome.storage.sync.get(getDefaultSettings()) as Settings

  const fn: ImageSegmenter =
    settings.engine === "CUSTOM_REPLICATE"
    ? segmentImageWithReplicate
    : segmentImageWithHuggingface
  
  const results = await fn(params)

  return results
}
