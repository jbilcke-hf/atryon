import { ReactNode } from "react"

export function Label({ children }: { children: ReactNode }) {
  return (
    <label className="text-sm font-semibold text-zinc-700">{children}</label>
  )
}