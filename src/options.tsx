import React, { useEffect } from "react"
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
import { fileToBase64 } from "./utils/fileToBase64"
import { segmentImage } from "./components/core/segmentImage"


function Options() {
  const settings = useSettings()

  return (
    <div className={cn(
      `flex flex-col`,
      `items-center`,
      // `bg-zinc-300`
    )}>
      <div className={cn(
        `flex flex-col w-full max-w-xl`,
        `space-y-6`,
        // `bg-zinc-300`
        )}>
        <div className="mt-6">
          <h1 className="text-lg">Atryon Chrome Plugin: AI Virtual Try-On</h1>
        </div>

        <div className="flex flex-col space-y-6 bg-zinc-200 p-4 rounded-2xl shadow-lg border-1 border-zinc-700">
          <Field>
            <div className="flex flex-row space-x-2 mb-2 items-center">
              <div className="w-8 h-8 flex flex-col items-center justify-center text-center rounded-full bg-zinc-700 text-zinc-200 text-xl font-semibold">1</div>
              <div className="text-2xl font-semibold text-zinc-700">Select the service provider</div>
            </div>
            <Select
              onValueChange={(value: string) => {
                settings.setEngine(value as Engine)
              }}
              defaultValue={settings.engine}>
              <SelectTrigger className="">
                <SelectValue placeholder="Engine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEFAULT">Hugging Face Cloud (default, free for Hugging Face users 🤗)</SelectItem>
                <SelectItem value="GRADIO_API">Custom&sol;local Gradio server (need a GPU or your own server)</SelectItem>
                <SelectItem value="REPLICATE">Replicate.com (uses your Replicate account for billing)</SelectItem>
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
          </>}

          {settings.engine === "REPLICATE" && <>
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
            </>}

            {settings.engine === "GRADIO_API" && <>
            <Field>
              <Label>Gradio API Token (optional):</Label>
              <Input
                className="font-mono"
                type="password"
                placeholder="Enter your Gradio server API Key (if any)"
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
          </>}
        </div>

        {settings.hasValidCredentials && <div className="flex flex-col space-y-5 bg-zinc-200 p-4 rounded-2xl shadow-lg border-1 border-zinc-700">
          <div className="flex flex-row space-x-2 items-center">
            <div className="w-8 h-8 flex flex-col items-center justify-center text-center rounded-full bg-zinc-700 text-zinc-200 text-xl font-semibold">2</div>
            <div className="text-2xl font-semibold text-zinc-700">Add pictures of yourself</div>
          </div>

          <p className="text-zinc-700 text-base font-semibold">
            Please follow those instructions for best results:
          </p>

          <ul className="text-zinc-700 text-base">
            <li><span className="text-2xl">👕</span> Wear simple clothes (eg. white t-shirt, trousers)</li>
            <li><span className="text-2xl">🧍</span> Face the camera, with arms hanging on the sides</li>
            <li><span className="text-2xl">💡</span> Use a well lit environment, with a neutral background</li>
            <li><span className="text-2xl">📸</span> Use a portrait orientation (beware of hidden photo settings!)</li>
          </ul>

          {/*
          <Field>
            <Label className="">Upper-body picture 🙎</Label>

            <div className="grid grid-cols-2 gap-4">
              {settings.upperBodyModelImage && <div className="flex flex-col items-center">
                <img
                  src={settings.upperBodyModelImage}
                  className="w-full h-auto my-4 rounded-xl overflow-hidden"
                />
                <p>Your upper body</p>
              </div>}

              {settings.upperBodyModelMaskImage ? <div className="flex flex-col items-center">
                 <img
                  src={settings.upperBodyModelMaskImage}
                  className="w-full h-auto my-4 rounded-xl overflow-hidden"
                />
                <p>Body mask</p>
              </div>
              : <div className="w-full h-auto flex flex-col items-center justify-center">
                {settings.upperBodyModelMaskImage ? "Segmenting image, please wait.." : "Please select a file"}
             </div>}
            </div>

            <Input
              type="file"
              className=""
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  const file = e.target.files[0];
                  const newImageBase64 = await fileToBase64(file)
                  settings.setUpperBodyModelImage(newImageBase64)

                  if (!newImageBase64) {
                    console.log(`no upper body image to segment, aborting`)
                    return
                  }
                  console.log(`calling model image segmenter on the upper body..`)
                  try {
                    const segmentationResult = await segmentImage(newImageBase64)
                    if (!segmentationResult) { throw new Error(`segmentationResult is empty`) }
                    settings.setUpperBodyModelMaskImage(segmentationResult)
                  } catch (err) {
                    console.log(`failed to segment the upper body: `, err)
                  }
                }
              }}
              accept="image/*"
            />
          </Field>
          */}


          <Field>
            <Label className="">Full-body picture 🧍</Label>
              
            <div className="grid grid-cols-2 gap-4">
              {settings.fullBodyModelImage && <div className="flex flex-col items-center">
                <img
                  src={settings.fullBodyModelImage}
                  className="w-full h-auto my-4 rounded-xl overflow-hidden"
                />
                <p>Your full body</p>
              </div>}
              {settings.fullBodyModelMaskImage ? <div className="flex flex-col items-center">
                <img
                  src={settings.fullBodyModelMaskImage}
                  className="w-full h-auto my-4 rounded-xl overflow-hidden"
                />
                <p>Body mask</p>
              </div>
              : <div className="w-full h-autoflex flex-col items-center justify-center">
                {settings.fullBodyModelImage ? "Segmenting image, please wait.." : "Please select a file"}
              </div>}
            </div>
            <Input
              type="file"
              className=""
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  const file = e.target.files[0];
                  const newImageBase64 = await fileToBase64(file)
                  settings.setFullBodyModelImage(newImageBase64)

                  if (!newImageBase64) {
                    console.log(`no full body image to segment, aborting`)
                    return
                  }
                  console.log(`calling model image segmenter on the full body..`)
                  try {
                    const segmentationResult = await segmentImage(newImageBase64)
                    if (!segmentationResult) { throw new Error(`segmentationResult is empty`) }
                    settings.setFullBodyModelMaskImage(segmentationResult)
                  } catch (err) {
                    console.log(`failed to segment the full body: `, err)
                  }
                }
              }}
              accept="image/*"
            />
          </Field>

        </div>}

        {settings.hasValidCredentials && settings.hasValidBodyModels && <div className="flex flex-col space-y-6 bg-zinc-200 px-4 pt-4 pb-6 rounded-2xl shadow-lg border-1 border-zinc-700">
          <div className="flex flex-row space-x-2 mb-2 items-center">
            <div className="w-8 h-8 flex flex-col items-center justify-center text-center rounded-full bg-zinc-700 text-zinc-200 text-xl font-semibold">3</div>
            <div className="text-2xl font-semibold text-zinc-700">Customize provider settings (optional)</div>
          </div>

          {settings.engine === "DEFAULT" && <>
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

          {settings.engine === "REPLICATE" && <>
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

        </div>}

        <div className="pt-2 h-16">
          <div className="flex flex-row w-full items-center justify-center">
            <Button
              className="text-xl py-2"
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
