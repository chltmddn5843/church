"use client"

import Script from "next/script"
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react"

type TurnstileApi = {
  render(el: HTMLElement, options: Record<string, unknown>): string
  reset(id: string): void
  remove(id: string): void
}
declare global {
  interface Window { turnstile?: TurnstileApi }
}

export type TurnstileHandle = { reset(): void }

// Explicitly rendered so each form can reset its own widget: a token is single-use, and these forms stay on the page
// after a failed attempt. The server (better-auth captcha plugin) checks the token, action "auth" and hostname.
export function TurnstileWidget({ siteKey, onToken, ref }: { siteKey: string; onToken: (token: string | null) => void; ref?: Ref<TurnstileHandle> }) {
  const box = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const latestOnToken = useRef(onToken)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    latestOnToken.current = onToken
  })

  useEffect(() => {
    if (!ready || !box.current || !window.turnstile) return
    widgetId.current = window.turnstile.render(box.current, {
      sitekey: siteKey,
      action: "auth",
      size: "flexible",
      language: "ko",
      callback: (token: string) => latestOnToken.current(token),
      "expired-callback": () => latestOnToken.current(null),
      "error-callback": () => latestOnToken.current(null),
    })
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
      widgetId.current = null
    }
  }, [ready, siteKey])

  useImperativeHandle(ref, () => ({
    reset() {
      latestOnToken.current(null)
      if (widgetId.current) window.turnstile?.reset(widgetId.current)
    },
  }))

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={() => setReady(true)} />
      <div ref={box} className="min-h-[65px] w-full" />
    </>
  )
}
