import { ImageURL, WorkerMessage } from "../types"
import { sendMessage } from "./sendMessage"

export async function runScanImages(): Promise<ImageURL[]> {
  console.log(`runScanImages()`)
  const images = await sendMessage<{
    action: WorkerMessage
  }, ImageURL[]>({
    action: "SCAN_IMAGES" as WorkerMessage,
  })
  return Array.isArray(images) ? images : []
}
