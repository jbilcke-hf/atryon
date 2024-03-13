import React from "react"
import ReactDOM from "react-dom/client"

import "@/globals.css"

import { Engine } from "@/types"
import { cn } from "@/utils"
import { useSettings } from "@/hooks/useSettings"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field } from "@/components/forms/field"
import { Label } from "@/components/forms/label"
import { Input } from "@/components/forms/input"
import { toBase64 } from "./utils/toBase64"


function Options() {
  const settings = useSettings()

  console.log(`this is the options panel`)


  return (
    <div className={cn(
      `flex flex-col`,
      `items-center`,
      // `bg-gray-300`
    )}>
      <div className={cn(
        `flex flex-col w-full max-w-lg`,
        `p-4 space-y-5`,
        // `bg-gray-300`
        )}>
        <div className="mb-2">
          <h1 className="text-lg">Atryon Chrome Plugin: AI Virtual Try-On</h1>
        </div>

        <Field>
          <Label>Select upper-body image (please take a picture with a neutral background)</Label>

          <div className="grid grid-cols-2 gap-4">
            {settings.upperBodyModelImage && <div className="flex flex-col items-center">
              <img
                src={settings.upperBodyModelImage}
                className="w-full h-auto my-4 rounded-xl overflow-hidden"
              />
              <p>Your upper body</p>
            </div>}

            {settings.upperBodyModelMaskImage && <div className="flex flex-col items-center">
              <img
                src={settings.upperBodyModelMaskImage}
                className="w-full h-auto my-4 rounded-xl overflow-hidden"
              />
              <p>Body mask</p>
            </div>}
          </div>

          <Input
            type="file"
            className=""
            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                const newImageBase64 = await toBase64(file)
                settings.setUpperBodyModelImage(newImageBase64)
              }
            }}
            accept="image/*"
          />
        </Field>

        <Field>
          <Label>Select full-body image (please take a picture with a neutral background)</Label>
            
          <div className="grid grid-cols-2 gap-4">
            {settings.fullBodyModelImage && <div className="flex flex-col items-center">
              <img
                src={settings.fullBodyModelImage}
                className="w-full h-auto my-4 rounded-xl overflow-hidden"
              />
              <p>Your full body</p>
            </div>}
            {settings.fullBodyModelMaskImage && <div className="flex flex-col items-center">
              <img
                src={settings.fullBodyModelMaskImage}
                className="w-full h-auto my-4 rounded-xl overflow-hidden"
              />
              <p>Body mask</p>
            </div>}
          </div>
          <Input
            type="file"
            className=""
            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                const newImageBase64 = await toBase64(file)
                settings.setFullBodyModelImage(newImageBase64)
              }
            }}
            accept="image/*"
          />
        </Field>

        <Field>
          <Label>Please select a server/provider:</Label>
          <Select
            onValueChange={(value: string) => {
              settings.setEngine(value as Engine)
            }}
            defaultValue={settings.engine}>
            <SelectTrigger className="">
              <SelectValue placeholder="Engine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DEFAULT">Default (free for Hugging Face users)</SelectItem>
              {/* <SelectItem value="CUSTOM">Custom (max privacy - for expert users only)</SelectItem> */}
            </SelectContent>
          </Select>
        </Field>

        {settings.engine === "DEFAULT" && <>
          <Field>
            <Label>Hugging Face API key:</Label>
            <Input
              className="font-mono"
              type="password"
              placeholder="Hugging Face API key"
              onChange={(x) => {
                settings.setHuggingfaceApiKey(x.target.value)
              }}
              value={settings.huggingfaceApiKey}
            />
          </Field>
          <Field>
            <Label>Inference steps ({settings.huggingfaceNumberOfSteps}):</Label>
            <Slider
              min={1}
              max={40}
              step={1}
              onValueChange={(value: any) => {
                let nbSteps = Number(value[0])
                nbSteps = !isNaN(value[0]) && isFinite(value[0]) ? nbSteps : 0
                nbSteps = Math.min(40, Math.max(1, nbSteps))
                settings.setHuggingfaceNumberOfSteps(nbSteps)
              }}
              defaultValue={[settings.defaultSettings.huggingfaceNumberOfSteps]}
              value={[settings.huggingfaceNumberOfSteps]}
            />
          </Field>
          <Field>
            <Label>Guidance scale ({settings.huggingfaceGuidanceScale}):</Label>
            <Slider
              min={1}
              max={10}
              step={0.1}
              onValueChange={(value: any) => {
                let guidanceScale = Number(value[0])
                guidanceScale = !isNaN(value[0]) && isFinite(value[0]) ? guidanceScale : 0
                guidanceScale = Math.min(10, Math.max(1, guidanceScale))
                settings.setHuggingfaceGuidanceScale(guidanceScale)
              }}
              defaultValue={[settings.defaultSettings.huggingfaceGuidanceScale]}
              value={[settings.huggingfaceGuidanceScale]}
            />
          </Field>
        </>}

        {settings.engine === "CUSTOM_REPLICATE" && <>
          <Field>
            <Label>Replicate API Token:</Label>
            <Input
              className="font-mono"
              type="password"
              placeholder="Enter your Replicate API Key"
              onChange={(x) => {
                settings.setReplicateApiKey(x.target.value)
              }}
              value={settings.replicateApiKey}
            />
          </Field>
          <Field>
            <Label>Segmentation model:</Label>
            <Input
              className="font-mono"
              type="text"
              placeholder={settings.defaultSettings.replicateSegmentationModel}
              onChange={(x) => {
                settings.setReplicateSegmentationModel(x.target.value)
              }}
              value={settings.replicateSegmentationModel}
            />
          </Field>
          <Field>
            <Label>Segmentation model version:</Label>
            <Input
              className="font-mono"
              type="text"
              placeholder={settings.defaultSettings.replicateSegmentationModelVersion}
              onChange={(x) => {
                settings.setReplicateSegmentationModelVersion(x.target.value)
              }}
              value={settings.replicateSegmentationModelVersion}
            />
          </Field>
          <Field>
            <Label>Substitution model:</Label>
            <Input
              className="font-mono"
              type="text"
              placeholder={settings.defaultSettings.replicateSubstitutionModel}
              onChange={(x) => {
                settings.setReplicateSubstitutionModel(x.target.value)
              }}
              value={settings.replicateSubstitutionModel}
            />
          </Field>
          <Field>
            <Label>Substitution model version:</Label>
            <Input
              className="font-mono"
              type="text"
              placeholder={settings.defaultSettings.replicateSubstitutionModelVersion}
              onChange={(x) => {
                settings.setReplicateSubstitutionModelVersion(x.target.value)
              }}
              value={settings.replicateSubstitutionModelVersion}
            />
          </Field>
          <Field>
            <Label>Inference steps ({settings.replicateNumberOfSteps}):</Label>
            <Slider
              min={1}
              max={40}
              step={1}
              onValueChange={(value: any) => {
                let nbSteps = Number(value[0])
                nbSteps = !isNaN(value[0]) && isFinite(value[0]) ? nbSteps : 0
                nbSteps = Math.min(40, Math.max(1, nbSteps))
                settings.setReplicateNumberOfSteps(nbSteps)
              }}
              defaultValue={[settings.defaultSettings.replicateNumberOfSteps]}
              value={[settings.replicateNumberOfSteps]}
            />
          </Field>
          <Field>
            <Label>Guidance scale ({settings.replicateGuidanceScale}):</Label>
            <Slider
              min={1}
              max={10}
              step={0.1}
              onValueChange={(value: any) => {
                let guidanceScale = Number(value[0])
                guidanceScale = !isNaN(value[0]) && isFinite(value[0]) ? guidanceScale : 0
                guidanceScale = Math.min(10, Math.max(1, guidanceScale))
                settings.setReplicateGuidanceScale(guidanceScale)
              }}
              defaultValue={[settings.defaultSettings.replicateGuidanceScale]}
              value={[settings.replicateGuidanceScale]}
            />
          </Field>
          </>}


          {settings.engine === "GRADIO_API" && <>
          <Field>
            <Label>Local API Token (optional):</Label>
            <Input
              className="font-mono"
              type="password"
              placeholder="Enter your local server API Key (if any)"
              onChange={(x) => {
                settings.setCustomGradioApiKey(x.target.value)
              }}
              value={settings.customGradioApiKey}
            />
          </Field>
          <Field>
            <Label>Segmentation server (Gradio API):</Label>
            <Input
              className="font-mono"
              type="text"
              placeholder={settings.defaultSettings.customGradioApiSegmentationSpaceUrl}
              onChange={(x) => {
                settings.setCustomGradioApiSegmentationSpaceUrl(x.target.value)
              }}
              value={settings.customGradioApiSegmentationSpaceUrl}
            />
          </Field>
          <Field>
            <Label>Substitution server (Gradio API):</Label>
            <Input
              className="font-mono"
              type="text"
              placeholder={settings.defaultSettings.customGradioApiSubstitutionSpaceUrl}
              onChange={(x) => {
                settings.setCustomGradioApiSubstitutionSpaceUrl(x.target.value)
              }}
              value={settings.customGradioApiSubstitutionSpaceUrl}
            />
          </Field>
          <Field>
            <Label>Inference steps ({settings.customGradioApiNumberOfSteps}):</Label>
            <Slider
              min={1}
              max={40}
              step={1}
              onValueChange={(value: any) => {
                let nbSteps = Number(value[0])
                nbSteps = !isNaN(value[0]) && isFinite(value[0]) ? nbSteps : 0
                nbSteps = Math.min(40, Math.max(1, nbSteps))
                settings.setCustomGradioApiNumberOfSteps(nbSteps)
              }}
              defaultValue={[settings.defaultSettings.customGradioApiNumberOfSteps]}
              value={[settings.customGradioApiNumberOfSteps]}
            />
          </Field>
          <Field>
            <Label>Guidance scale ({settings.customGradioApiGuidanceScale}):</Label>
            <Slider
              min={1}
              max={10}
              step={0.1}
              onValueChange={(value: any) => {
                let guidanceScale = Number(value[0])
                guidanceScale = !isNaN(value[0]) && isFinite(value[0]) ? guidanceScale : 0
                guidanceScale = Math.min(10, Math.max(1, guidanceScale))
                settings.setCustomGradioApiGuidanceScale(guidanceScale)
              }}
              defaultValue={[settings.defaultSettings.customGradioApiGuidanceScale]}
              value={[settings.customGradioApiGuidanceScale]}
            />
          </Field>
          </>}
        
        <div className="flex flex-row pt-4">
          <Button
            disabled={settings.status !== "idle"}
            onClick={() => {
              settings.saveSettings()
            }}>{
              settings.status === "saved" ? "Saved!" : 
              settings.status === "saving" ? "Saving.." :
              "Save settings"
            }</Button>
        </div>
      </div>
    </div>
  );
}

const index = document.createElement("div");
index.id = "options";
document.body.appendChild(index);

ReactDOM.createRoot(index).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
