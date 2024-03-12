import { ImageURL, WorkerMessage } from "../types"
import { sendMessage } from "./sendMessage"

export async function runReplaceImages(images: ImageURL[]): Promise<boolean> {
  const result = await sendMessage<{
    action: WorkerMessage
    images: ImageURL[]
  }, boolean>({
    action: "REPLACE_IMAGES" as WorkerMessage,
    images,
  })
  return result
}
