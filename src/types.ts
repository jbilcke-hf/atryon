export type Engine =
  | "DEFAULT" // default engine
  | "GRADIO_API" // url to local or remote gradio spaces
  | "CUSTOM_REPLICATE" // url to replicate api(s)

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

export type ImageSegmenter = (modelImage: string) => Promise<string>

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
  // DEFAULT: default engine
  // GRADIO_API: url to local or remote gradio spaces
  // CUSTOM_REPLICATE: url to replicate api(s)
  engine: Engine

  // --------------- HUGGING FACE ----------------------------

  // api key of the Hugging Face account
  huggingfaceApiKey: string

  // url of the Hugging Face Space for segmentation (Gradio API)
  huggingfaceSegmentationSpaceUrl: string

  // url of the Hugging Face Space for substitution (Gradio API)
  huggingfaceSubstitutionSpaceUrl: string

  // Number of steps for the Huging Face model
  huggingfaceNumberOfSteps: number

  // Guidance scale for the Hugging Face model
  huggingfaceGuidanceScale: number


  // --------------- REPLICATE-- ----------------------------

  // Replicate.com api key
  replicateApiKey: string

  // replicate model name
  replicateSegmentationModel: string

  // Replicate model version
  replicateSegmentationModelVersion: string

  // replicate model name
  replicateSubstitutionModel: string

  // Replicate model version
  replicateSubstitutionModelVersion: string

  // Number of steps for the Replicate model
  replicateNumberOfSteps: number

  // Guidance scale for the Replicate model
  replicateGuidanceScale: number


  // --------------- LOCAL SERVER ---------------------------

  // optional api key in case local usage (eg. for privacy or development purposes)
  customGradioApiKey: string

  // url of the Hugging Face Space for segmentation (Gradio API)
  customGradioApiSegmentationSpaceUrl: string

  // url of the Hugging Face Space for substitution (Gradio API)
  customGradioApiSubstitutionSpaceUrl: string

  // Number of steps for the local model
  customGradioApiNumberOfSteps: number

  // Guidance scale for the local model
  customGradioApiGuidanceScale: number

  upperBodyModelImage: string
  upperBodyModelMaskImage: string

  fullBodyModelImage: string
  fullBodyModelMaskImage: string

  // to enable or disable the substitution
  isEnabled: boolean
}