import { Settings } from "@/types";

export function getDefaultSettings(): Settings {

  return {
    // engine (HUGGINGFACE, REPLICATE or LOCALHOST)
    engine: "REPLICATE",

    // api key of the Hugging Face account
    huggingfaceApiKey: "",

    // url of the Hugging Face Space (Gradio API)
    huggingfaceSpaceUrl: "localhost:3000",


    // Number of steps for the Hugging Face model
    huggingfaceNumberOfSteps: 20,

    // Guidance scale for the Hugging Face model
    huggingfaceGuidanceScale: 2,


    // Replicate.com api key
    replicateApiKey: "",

    // replicate model name
    replicateModel: "viktorfa/oot_diffusion",

    // Replicate model version
    replicateModelVersion: "9f8fa4956970dde99689af7488157a30aa152e23953526a605df1d77598343d7",

    // Number of steps for the Replicate model
    replicateNumberOfSteps: 20,

    // Guidance scale for the Replicate model
    replicateGuidanceScale: 2,

    // api key for local usage (eg. for privacy or development purposes)
    localhostApiKey: "",

    // url of the local API (eg. for privacy or development purposes)
    localhostApiUrl: "localhost:3000",

    // Number of steps for the local model
    localhostNumberOfSteps: 20,

    // Guidance scale f or the local model
    localhostGuidanceScale: 2,

    // the current active model image
    modelImage: "",

    // list of available model images
    modelImages: [],

    // to enable or disable the substitution
    isEnabled: false,
  }
}