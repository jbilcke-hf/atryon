import { Settings } from "@/types";

export function getDefaultSettings(): Settings {

  return {
    // DEFAULT: default engine
    // GRADIO_API: url to local or remote gradio spaces
    // REPLICATE: url to replicate api(s)
    engine: "DEFAULT",

    // api key of the Hugging Face account
    huggingfaceApiKey: "",

    // url of the Hugging Face Space for segmentation (Gradio API)
    huggingfaceSegmentationSpaceUrl: "https://jbilcke-hf-oot-segmentation.hf.space",
    
    // url of the Hugging Face Space for substitution (Gradio API)
    huggingfaceSubstitutionSpaceUrl: "https://jbilcke-hf-oot-diffusion-with-mask.hf.space",
    
    // Number of steps for the Hugging Face model
    huggingfaceNumberOfSteps: 20,

    // Guidance scale for the Hugging Face model
    huggingfaceGuidanceScale: 2,


    // Replicate.com api key
    replicateApiKey: "",

    // replicate model name
    replicateSegmentationModel: "viktorfa/oot_segmentation",

    // Replicate model version
    replicateSegmentationModelVersion: "029c7a3275615693983f1186a94d3c02a5a46750a763e5deb30c1b608b7c3003",

    // replicate model name
    replicateSubstitutionModel: "viktorfa/oot_diffusion_with_mask",

    // Replicate model version
    replicateSubstitutionModelVersion: "c890e02d8180bde7eeed1a138217ee154d8cdd8769a29f02bd51fea33d268385",

    // Number of steps for the Replicate model
    replicateNumberOfSteps: 20,

    // Guidance scale for the Replicate model
    replicateGuidanceScale: 2,

    // api key for local usage (eg. for privacy or development purposes)
    customGradioApiKey: "",

    // url of the Hugging Face Space for segmentation (Gradio API)
    customGradioApiSegmentationSpaceUrl:  "http://localhost:7860",

    // url of the local API for substitution (Gradio API)
    customGradioApiSubstitutionSpaceUrl:  "http://localhost:7861",

    // Number of steps for the local model
    customGradioApiNumberOfSteps: 20,

    // Guidance scale f or the local model
    customGradioApiGuidanceScale: 2,

    upperBodyModelImage: "",
    upperBodyModelMaskImage: "",

    fullBodyModelImage: "",
    fullBodyModelMaskImage: "",

    // to enable or disable the substitution
    isEnabled: false,
  }
}