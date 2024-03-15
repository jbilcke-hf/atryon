
import { useEffect, useState } from "react"

import { getDefaultSettings } from "@/utils/getDefaultSettings"
import { Engine, SettingsSaveStatus } from "@/types"

export function useSettings() {
  const defaultSettings = getDefaultSettings()

  const [status, setStatus] = useState<SettingsSaveStatus>("idle")

  // DEFAULT: default engine
  // GRADIO_API: url to local or remote gradio spaces
  // REPLICATE: url to replicate api(s)
  const [engine, setEngine] = useState<Engine>(defaultSettings.engine)

  // api key of the Hugging Face account
  const [huggingfaceApiKey, setHuggingfaceApiKey] = useState<string>(defaultSettings.huggingfaceApiKey)
  
  // url of the Hugging Face Space for segmentation (Gradio API)
  const [huggingfaceSegmentationSpaceUrl, setHuggingfaceSegmentationSpaceUrl] = useState<string>(defaultSettings.huggingfaceSegmentationSpaceUrl)

  // url of the Hugging Face Space for substitution (Gradio API)
  const [huggingfaceSubstitutionSpaceUrl, setHuggingfaceSubstitutionSpaceUrl] = useState<string>(defaultSettings.huggingfaceSubstitutionSpaceUrl)

  // Number of steps for the Hugging Face model
  const [huggingfaceNumberOfSteps, setHuggingfaceNumberOfSteps] = useState<number>(defaultSettings.huggingfaceNumberOfSteps)

  // Guidance scale for the Hugging Face model
  const [huggingfaceGuidanceScale, setHuggingfaceGuidanceScale] = useState<number>(defaultSettings.huggingfaceGuidanceScale)
  
  // Replicate.com api key
  const [replicateApiKey, setReplicateApiKey] = useState<string>(defaultSettings.replicateApiKey)

  // replicate model name
  const [replicateSegmentationModel, setReplicateSegmentationModel] = useState<string>(defaultSettings.replicateSegmentationModel)

  // Replicate model version
  const [replicateSegmentationModelVersion, setReplicateSegmentationModelVersion] = useState<string>(defaultSettings.replicateSegmentationModelVersion)

  // replicate model name
  const [replicateSubstitutionModel, setReplicateSubstitutionModel] = useState<string>(defaultSettings.replicateSubstitutionModel)

  // Replicate model version
  const [replicateSubstitutionModelVersion, setReplicateSubstitutionModelVersion] = useState<string>(defaultSettings.replicateSubstitutionModelVersion)

  // Number of steps for the Replicate model
  const [replicateNumberOfSteps, setReplicateNumberOfSteps] = useState<number>(defaultSettings.replicateNumberOfSteps)

  // Guidance scale for the Replicate model
  const [replicateGuidanceScale, setReplicateGuidanceScale] = useState<number>(defaultSettings.replicateGuidanceScale)

  // api key for local usage (eg. for privacy or development purposes)
  const [customGradioApiKey, setCustomGradioApiKey] = useState<string>(defaultSettings.customGradioApiKey)

  // url of the Hugging Face Space for segmentation (Gradio API)
  const [customGradioApiSegmentationSpaceUrl, setCustomGradioApiSegmentationSpaceUrl] = useState<string>(defaultSettings.customGradioApiSegmentationSpaceUrl)

  //  url of the local API for substitution (Gradio API)
  const [customGradioApiSubstitutionSpaceUrl, setCustomGradioApiSubstitutionSpaceUrl] = useState<string>(defaultSettings.customGradioApiSubstitutionSpaceUrl)

  // Number of steps for the local model
  const [customGradioApiNumberOfSteps, setCustomGradioApiNumberOfSteps] = useState<number>(defaultSettings.customGradioApiNumberOfSteps)

  // Guidance scale for the local model
  const [customGradioApiGuidanceScale, setCustomGradioApiGuidanceScale] = useState<number>(defaultSettings.customGradioApiGuidanceScale)

  const [upperBodyModelImage, setUpperBodyModelImage] = useState<string>(defaultSettings.upperBodyModelImage)
  const [upperBodyModelMaskImage, setUpperBodyModelMaskImage] = useState<string>(defaultSettings.upperBodyModelMaskImage)
  const [fullBodyModelImage, setFullBodyModelImage] = useState<string>(defaultSettings.fullBodyModelImage)
  const [fullBodyModelMaskImage, setFullBodyModelMaskImage] = useState<string>(defaultSettings.fullBodyModelMaskImage)

  // to enable or disable the substitution
  const [isEnabled, setEnabled] = useState<boolean>(defaultSettings.isEnabled)

  useEffect(() => {
    // Restores state using the preferences stored in chrome.storage.
    chrome.storage.local.get(
      getDefaultSettings(),
      (settings) => {
        setEngine(settings.engine)

        setHuggingfaceApiKey(settings.huggingfaceApiKey)
        setHuggingfaceSegmentationSpaceUrl(settings.huggingfaceSegmentationSpaceUrl)
        setHuggingfaceSubstitutionSpaceUrl(settings.huggingfaceSubstitutionSpaceUrl)
        setHuggingfaceNumberOfSteps(settings.huggingfaceNumberOfSteps)
        setHuggingfaceGuidanceScale(settings.huggingfaceGuidanceScale)

        setReplicateApiKey(settings.replicateApiKey)
        setReplicateSegmentationModel(settings.replicateSegmentationModel)
        setReplicateSegmentationModelVersion(settings.replicateSegmentationModelVersion)
        setReplicateSubstitutionModel(settings.replicateSubstitutionModel)
        setReplicateSubstitutionModelVersion(settings.replicateSubstitutionModelVersion)
        setReplicateNumberOfSteps(settings.replicateNumberOfSteps)
        setReplicateGuidanceScale(settings.replicateGuidanceScale)

        setCustomGradioApiKey(settings.customGradioApiKey)
        setCustomGradioApiSegmentationSpaceUrl(settings.customGradioApiSegmentationSpaceUrl)
        setCustomGradioApiSubstitutionSpaceUrl(settings.customGradioApiSubstitutionSpaceUrl)
        setCustomGradioApiNumberOfSteps(settings.customGradioApiNumberOfSteps)
        setCustomGradioApiGuidanceScale(settings.customGradioApiGuidanceScale)

        setUpperBodyModelImage(settings.upperBodyModelImage)
        setUpperBodyModelMaskImage(settings.upperBodyModelMaskImage)
        setFullBodyModelImage(settings.fullBodyModelImage)
        setFullBodyModelMaskImage(settings.fullBodyModelMaskImage)

        setEnabled(settings.isEnabled)
      }
    )
  }, [])

  const saveSettings = () => {
    setStatus("saving")
    // Saves options to chrome.storage.local.
    chrome.storage.local.set(
      {
        engine,

        huggingfaceApiKey,
        huggingfaceSegmentationSpaceUrl,
        huggingfaceSubstitutionSpaceUrl,
        huggingfaceNumberOfSteps,
        huggingfaceGuidanceScale,

        replicateApiKey,
        replicateSegmentationModel,
        replicateSegmentationModelVersion,
        replicateSubstitutionModel,
        replicateSubstitutionModelVersion,
        replicateNumberOfSteps,
        replicateGuidanceScale,

        customGradioApiKey,
        customGradioApiSegmentationSpaceUrl,
        customGradioApiSubstitutionSpaceUrl,
        customGradioApiNumberOfSteps,
        customGradioApiGuidanceScale,

        upperBodyModelImage,
        upperBodyModelMaskImage,
        fullBodyModelImage,
        fullBodyModelMaskImage,

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

  useEffect(() => {
    console.log(`autosave settings..`)
    saveSettings()
  }, [
    engine,
    huggingfaceApiKey,
    huggingfaceSegmentationSpaceUrl,
    huggingfaceSubstitutionSpaceUrl,
    huggingfaceNumberOfSteps,
    huggingfaceGuidanceScale,
    replicateApiKey,
    replicateSegmentationModel,
    replicateSegmentationModelVersion,
    replicateSubstitutionModel,
    replicateSubstitutionModelVersion,
    replicateNumberOfSteps,
    replicateGuidanceScale,
    customGradioApiKey,
    customGradioApiSegmentationSpaceUrl,
    customGradioApiSubstitutionSpaceUrl,
    customGradioApiNumberOfSteps,
    customGradioApiGuidanceScale,
    upperBodyModelImage,
    upperBodyModelMaskImage,
    fullBodyModelImage,
    fullBodyModelMaskImage,
    isEnabled,
  ])

  // set to true to disable validation
  const debugMode = false

  const hasValidDefaultCredentials = debugMode || (engine === "DEFAULT" && huggingfaceApiKey.length > 8)
  const hasValidCustomGradioApiCredentials = debugMode || (engine === "GRADIO_API" && customGradioApiKey.length > 8)
  const hasValidReplicateCredentials = debugMode || (engine === "REPLICATE" && replicateApiKey.length > 8)
  
  const hasValidCredentials = debugMode || (
    hasValidDefaultCredentials || hasValidCustomGradioApiCredentials || hasValidReplicateCredentials
  )
  
  const hasValidUpperBodyModel = debugMode || (
    upperBodyModelImage.length > 100 && upperBodyModelMaskImage.length > 100
  )
  
  const hasValidFullBodyModel = debugMode || (
    fullBodyModelImage.length > 100 && fullBodyModelMaskImage.length > 100
  )
  
  const hasValidBodyModels = debugMode || (
    hasValidUpperBodyModel && hasValidFullBodyModel
  )

  return {
    defaultSettings,
    
    status, setStatus,

    // DEFAULT: default engine
    // GRADIO_API: url to local or remote gradio spaces
    // REPLICATE: url to replicate api(s)
    engine, setEngine,

    // api key of the Hugging Face account
    huggingfaceApiKey, setHuggingfaceApiKey,

    // url of the Hugging Face Spaces (Gradio API)
    huggingfaceSegmentationSpaceUrl, setHuggingfaceSegmentationSpaceUrl,
    huggingfaceSubstitutionSpaceUrl, setHuggingfaceSubstitutionSpaceUrl,
    
    // Number of steps for the Hugging Face model
    huggingfaceNumberOfSteps, setHuggingfaceNumberOfSteps,

    // Guidance scale for the Hugging Face model
    huggingfaceGuidanceScale, setHuggingfaceGuidanceScale,

    // Replicate.com api key
    replicateApiKey, setReplicateApiKey,

    // replicate model name
    replicateSegmentationModel, setReplicateSegmentationModel,

    // Replicate model version
    replicateSegmentationModelVersion, setReplicateSegmentationModelVersion,

    // replicate model name
    replicateSubstitutionModel, setReplicateSubstitutionModel,

    // Replicate model version
    replicateSubstitutionModelVersion, setReplicateSubstitutionModelVersion,

    // Number of steps for the Replicate model
    replicateNumberOfSteps, setReplicateNumberOfSteps,

    // Guidance scale for the Replicate model
    replicateGuidanceScale, setReplicateGuidanceScale,

    // api key for local usage (eg. for privacy or development purposes)
    customGradioApiKey, setCustomGradioApiKey,

    // url of the local APIs (eg. for privacy or development purposes)
    customGradioApiSegmentationSpaceUrl, setCustomGradioApiSegmentationSpaceUrl,
    customGradioApiSubstitutionSpaceUrl, setCustomGradioApiSubstitutionSpaceUrl,

    // Number of steps for the local model
    customGradioApiNumberOfSteps, setCustomGradioApiNumberOfSteps,

    // Guidance scale for the local model
    customGradioApiGuidanceScale, setCustomGradioApiGuidanceScale,

    upperBodyModelImage, setUpperBodyModelImage,
    upperBodyModelMaskImage, setUpperBodyModelMaskImage,
    fullBodyModelImage, setFullBodyModelImage,
    fullBodyModelMaskImage, setFullBodyModelMaskImage,

    // to enable or disable the substitution
    isEnabled, setEnabled,

    // trigger to save the options
    saveSettings,

    debugMode,

    hasValidDefaultCredentials,
    hasValidCustomGradioApiCredentials,
    hasValidReplicateCredentials,
    hasValidCredentials,
    hasValidUpperBodyModel,
    hasValidBodyModels,
  }
}