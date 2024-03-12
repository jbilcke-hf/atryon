
import { useEffect, useState } from "react"

import { getDefaultSettings } from "@/utils/getDefaultSettings"
import { Engine, SettingsSaveStatus } from "@/types"

export function useSettings() {
  const defaultSettings = getDefaultSettings()

  const [status, setStatus] = useState<SettingsSaveStatus>("idle")

  // engine (HUGGINGFACE, REPLICATE or LOCALHOST)
  const [engine, setEngine] = useState<Engine>(defaultSettings.engine)

  // api key of the Hugging Face account
  const [huggingfaceApiKey, setHuggingfaceApiKey] = useState<string>(defaultSettings.huggingfaceApiKey)

  // url of the Hugging Face Space (Gradio API)
  const [huggingfaceSpaceUrl, setHuggingfaceSpaceUrl] = useState<string>(defaultSettings.huggingfaceSpaceUrl)

  // Number of steps for the Hugging Face model
  const [huggingfaceNumberOfSteps, setHuggingfaceNumberOfSteps] = useState<number>(defaultSettings.huggingfaceNumberOfSteps)

  // Guidance scale for the Hugging Face model
  const [huggingfaceGuidanceScale, setHuggingfaceGuidanceScale] = useState<number>(defaultSettings.huggingfaceGuidanceScale)
  
  // Replicate.com api key
  const [replicateApiKey, setReplicateApiKey] = useState<string>(defaultSettings.replicateApiKey)

  // replicate model name
  const [replicateModel, setReplicateModel] = useState<string>(defaultSettings.replicateModel)

  // Replicate model version
  const [replicateModelVersion, setReplicateModelVersion] = useState<string>(defaultSettings.replicateModelVersion)

  // Number of steps for the Replicate model
  const [replicateNumberOfSteps, setReplicateNumberOfSteps] = useState<number>(defaultSettings.replicateNumberOfSteps)

  // Guidance scale for the Replicate model
  const [replicateGuidanceScale, setReplicateGuidanceScale] = useState<number>(defaultSettings.replicateGuidanceScale)

  // api key for local usage (eg. for privacy or development purposes)
  const [localhostApiKey, setLocalhostApiKey] = useState<string>(defaultSettings.localhostApiKey)

  // url of the local API (eg. for privacy or development purposes)
  const [localhostApiUrl, setLocalhostApiUrl] = useState<string>(defaultSettings.localhostApiUrl)

  // Number of steps for the local model
  const [localhostNumberOfSteps, setLocalhostNumberOfSteps] = useState<number>(defaultSettings.localhostNumberOfSteps)

  // Guidance scale for the local model
  const [localhostGuidanceScale, setLocalhostGuidanceScale] = useState<number>(defaultSettings.localhostGuidanceScale)
  
  // the current active model image
  const [modelImage, setModelImage] = useState<string>(defaultSettings.modelImage)

  // list of available model images
  const [modelImages, setModelImages] = useState<string[]>(defaultSettings.modelImages)

  // to enable or disable the substitution
  const [isEnabled, setEnabled] = useState<boolean>(defaultSettings.isEnabled)

  useEffect(() => {
    // Restores state using the preferences stored in chrome.storage.
    chrome.storage.sync.get(
      getDefaultSettings(),
      (settings) => {
        setEngine(settings.engine)

        setHuggingfaceApiKey(settings.huggingfaceApiKey)
        setHuggingfaceSpaceUrl(settings.huggingfaceSpaceUrl)
        setHuggingfaceNumberOfSteps(settings.huggingfaceNumberOfSteps)
        setHuggingfaceGuidanceScale(settings.huggingfaceGuidanceScale)

        setReplicateApiKey(settings.replicateApiKey)
        setReplicateModel(settings.replicateModel)
        setReplicateModelVersion(settings.replicateModelVersion)
        setReplicateNumberOfSteps(settings.replicateNumberOfSteps)
        setReplicateGuidanceScale(settings.replicateGuidanceScale)

        setLocalhostApiKey(settings.localhostApiKey)
        setLocalhostApiUrl(settings.localhostApiUrl)
        setLocalhostNumberOfSteps(settings.localhostNumberOfSteps)
        setLocalhostGuidanceScale(settings.localhostGuidanceScale)

        setModelImage(settings.modelImage)
        setModelImages(settings.modelImages)

        setEnabled(settings.isEnabled)
      }
    )
  }, [])

  const saveSettings = () => {
    setStatus("saving")
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      {
        engine,

        huggingfaceApiKey,
        huggingfaceSpaceUrl,
        huggingfaceNumberOfSteps,
        huggingfaceGuidanceScale,

        replicateApiKey,
        replicateModel,
        replicateModelVersion,
        replicateNumberOfSteps,
        replicateGuidanceScale,

        localhostApiKey,
        localhostApiUrl,
        localhostNumberOfSteps,
        localhostGuidanceScale,

        modelImage,
        modelImages,

        isEnabled,
      },
      () => {
        // Update status to let user know options were saved.
        setStatus("saved")

        let id = setTimeout(() => {
          setStatus("idle")
        }, 2000);

        return () => clearTimeout(id);
      }
    )
  }

  return {
    defaultSettings,
    
    status, setStatus,

    // engine (HUGGINGFACE, REPLICATE or LOCALHOST)
    engine, setEngine,

    // api key of the Hugging Face account
    huggingfaceApiKey, setHuggingfaceApiKey,

    // url of the Hugging Face Space (Gradio API)
    huggingfaceSpaceUrl, setHuggingfaceSpaceUrl,

    // Number of steps for the Hugging Face model
    huggingfaceNumberOfSteps, setHuggingfaceNumberOfSteps,

    // Guidance scale for the Hugging Face model
    huggingfaceGuidanceScale, setHuggingfaceGuidanceScale,

    // Replicate.com api key
    replicateApiKey, setReplicateApiKey,

    // replicate model name
    replicateModel, setReplicateModel,

    // Replicate model version
    replicateModelVersion, setReplicateModelVersion,

    // Number of steps for the Replicate model
    replicateNumberOfSteps, setReplicateNumberOfSteps,

    // Guidance scale for the Replicate model
    replicateGuidanceScale, setReplicateGuidanceScale,

    // api key for local usage (eg. for privacy or development purposes)
    localhostApiKey, setLocalhostApiKey,

    // url of the local API (eg. for privacy or development purposes)
    localhostApiUrl, setLocalhostApiUrl,

    // Number of steps for the local model
    localhostNumberOfSteps, setLocalhostNumberOfSteps,

    // Guidance scale for the local model
    localhostGuidanceScale, setLocalhostGuidanceScale,

    // the current active model image
    modelImage, setModelImage,

    // list of available model images
    modelImages, setModelImages,

    // to enable or disable the substitution
    isEnabled,
    
    // only needf for setEnabled which is often called
    setEnabled: (newValue: boolean) => {
      setEnabled(newValue)
      saveSettings()
    },

    // trigger to save the options
    saveSettings,
  }
}