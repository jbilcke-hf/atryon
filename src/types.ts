export type Engine =
  | "HUGGINGFACE"
  | "REPLICATE"
  | "LOCALHOST"

export type SettingsSaveStatus =
  | "idle"
  | "saving"
  | "saved"

export type ImageStatus =
  | "invalid"
  | "unprocessed"
  | "processing"
  | "success"
  | "failed"

export type WorkerMessage =
  | "ENABLE"
  | "DISABLE"
  | "SCAN_IMAGES"
  | "SCANNED_IMAGES"
  | "REPLACE_IMAGES"
  | "SUCCESS"
  | "RESET"
  | "UNKNOWN"

export type ImageURL = {
  originalUri: string
  width: number
  height: number
  goodCandidate: boolean
  status: ImageStatus

  // we often generate 4 variants
  proposedUris: string[]
}

export type ImageReplacer = ({ garmentImage, modelImage }: { garmentImage: string; modelImage: string; }) => Promise<string[]>

export type ReplaceImageWithReplicate = {
  seed: number;
  steps: number;
  model_image: string;
  garment_image: string;
  guidance_scale: number;
};

export type PredictionReplaceImageWithReplicate = {
  id: string
  model: string
  version: string
  input: ReplaceImageWithReplicate
  logs: string
  error?: string
  output?: string[]
  status:
    | "starting"
    | "processing"
    | "failed"
    | "canceled"
    | "succeeded"
  created_at: string
  urls: {
    cancel: string
    get: string
  }
}

export type Settings = {
  // engine (HUGGINGFACE, REPLICATE or LOCALHOST)
  engine: Engine

  // --------------- HUGGING FACE ----------------------------

  // api key of the Hugging Face account
  huggingfaceApiKey: string

  // url of the Hugging Face Space (Gradio API)
  huggingfaceSpaceUrl: string

  // Number of steps for the Huging Face model
  huggingfaceNumberOfSteps: number

  // Guidance scale for the Hugging Face model
  huggingfaceGuidanceScale: number


  // --------------- REPLICATE-- ----------------------------

  // Replicate.com api key
  replicateApiKey: string

  // replicate model name
  replicateModel: string

  // Replicate model version
  replicateModelVersion: string

  // Number of steps for the Replicate model
  replicateNumberOfSteps: number

  // Guidance scale for the Replicate model
  replicateGuidanceScale: number


  // --------------- LOCAL SERVER ---------------------------

  // api key for local usage (eg. for privacy or development purposes)
  localhostApiKey: string

  // url of the local API (eg. for privacy or development purposes)
  localhostApiUrl: string

  // Number of steps for the local model
  localhostNumberOfSteps: 20

  // Guidance scale for the local model
  localhostGuidanceScale: 2

  // the current active image
  modelImage: string

  // list of available images
  modelImages: string[]

  // to enable or disable the substitution
  isEnabled: boolean
}