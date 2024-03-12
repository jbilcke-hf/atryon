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
              <SelectItem value="HUGGINGFACE">Hugging Face (free, recommended)</SelectItem>
              <SelectItem value="REPLICATE">Replicate (will use your own account)</SelectItem>
              <SelectItem value="LOCALHOST">Localhost (max privacy - for expert users only)</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {settings.engine === "HUGGINGFACE" && <>
          <Field>
            <Label>Hugging Face API Token:</Label>
            <Input
              className="font-mono"
              type="password"
              placeholder="Hugging Face API Key"
              onChange={(x) => {
                settings.setHuggingfaceApiKey(x.target.value)
              }}
              value={settings.huggingfaceApiKey}
            />
          </Field>
          <Field>
            <Label>Space API:</Label>
            <Input
              className="font-mono"
              type="text"
              placeholder={settings.defaultSettings.huggingfaceSpaceUrl}
              onChange={(x) => {
                settings.setHuggingfaceSpaceUrl(x.target.value)
              }}
              value={settings.huggingfaceSpaceUrl}
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
            <Label>Replicate Model:</Label>
            <Input
              className="font-mono"
              type="text"
              placeholder={settings.defaultSettings.replicateModel}
              onChange={(x) => {
                settings.setReplicateModel(x.target.value)
              }}
              value={settings.replicateModel}
            />
          </Field>
          <Field>
            <Label>Replicate Model Version:</Label>
            <Input
              className="font-mono"
              type="text"
              placeholder={settings.defaultSettings.replicateModelVersion}
              onChange={(x) => {
                settings.setReplicateModelVersion(x.target.value)
              }}
              value={settings.replicateModelVersion}
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


          {settings.engine === "LOCALHOST" && <>
          <Field>
            <Label>Local API Token (optional):</Label>
            <Input
              className="font-mono"
              type="password"
              placeholder="Enter your local server API Key (if any)"
              onChange={(x) => {
                settings.setLocalhostApiKey(x.target.value)
              }}
              value={settings.localhostApiKey}
            />
          </Field>
          <Field>
            <Label>Local server URL:</Label>
            <Input
              className="font-mono"
              type="text"
              placeholder={settings.defaultSettings.localhostApiUrl}
              onChange={(x) => {
                settings.setLocalhostApiUrl(x.target.value)
              }}
              value={settings.localhostApiUrl}
            />
          </Field>
          <Field>
            <Label>Inference steps ({settings.localhostNumberOfSteps}):</Label>
            <Slider
              min={1}
              max={40}
              step={1}
              onValueChange={(value: any) => {
                let nbSteps = Number(value[0])
                nbSteps = !isNaN(value[0]) && isFinite(value[0]) ? nbSteps : 0
                nbSteps = Math.min(40, Math.max(1, nbSteps))
                settings.setLocalhostNumberOfSteps(nbSteps)
              }}
              defaultValue={[settings.defaultSettings.localhostNumberOfSteps]}
              value={[settings.localhostNumberOfSteps]}
            />
          </Field>
          <Field>
            <Label>Guidance scale ({settings.localhostGuidanceScale}):</Label>
            <Slider
              min={1}
              max={10}
              step={0.1}
              onValueChange={(value: any) => {
                let guidanceScale = Number(value[0])
                guidanceScale = !isNaN(value[0]) && isFinite(value[0]) ? guidanceScale : 0
                guidanceScale = Math.min(10, Math.max(1, guidanceScale))
                settings.setLocalhostGuidanceScale(guidanceScale)
              }}
              defaultValue={[settings.defaultSettings.localhostGuidanceScale]}
              value={[settings.localhostGuidanceScale]}
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