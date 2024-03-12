import { ImageReplacer, Settings } from "@/types"
import { getDefaultSettings } from "@/utils/getDefaultSettings"
import { replaceImage as replaceImageWithReplicate } from "../../providers/replicate"
import { replaceImageWithNothing } from "./replaceImageWithNothing"

export const replaceImage: ImageReplacer = async (params) => {
  const settings = await chrome.storage.sync.get(getDefaultSettings()) as Settings

  const fn: ImageReplacer =
    settings.engine === "REPLICATE"
    ? replaceImageWithReplicate
    : replaceImageWithNothing
  
  const results = await fn(params)

  return results
}
