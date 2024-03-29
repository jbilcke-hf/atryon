import { ImageReplacer, Settings } from "@/types"
import { getDefaultSettings } from "@/utils/getDefaultSettings"
import { replaceImage as replaceImageWithReplicate } from "../../providers/replicate"
import { replaceImage as replaceImageWithHuggingface } from "../../providers/huggingface"

export const replaceImage: ImageReplacer = async (params) => {
  const settings = await chrome.storage.local.get(getDefaultSettings()) as Settings

  const fn: ImageReplacer =
    settings.engine === "REPLICATE"
    ? replaceImageWithReplicate
    : replaceImageWithHuggingface
  
  const results = await fn(params)

  return results
}
