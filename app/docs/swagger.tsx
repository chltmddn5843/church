"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    SwaggerUIBundle?: (options: Record<string, unknown>) => void
  }
}

const swaggerUiVersion = "5.32.11"

export function SwaggerDocs() {
  useEffect(() => {
    if (window.SwaggerUIBundle) {
      window.SwaggerUIBundle({
        url: "/api/openapi",
        dom_id: "#swagger-ui",
        deepLinking: true,
        displayRequestDuration: true,
      })
      return
    }

    const script = document.createElement("script")
    script.src = `https://unpkg.com/swagger-ui-dist@${swaggerUiVersion}/swagger-ui-bundle.js`
    script.async = true
    script.onload = () => {
      window.SwaggerUIBundle?.({
        url: "/api/openapi",
        dom_id: "#swagger-ui",
        deepLinking: true,
        displayRequestDuration: true,
      })
    }
    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return (
    <>
      <link rel="stylesheet" href={`https://unpkg.com/swagger-ui-dist@${swaggerUiVersion}/swagger-ui.css`} />
      <div id="swagger-ui" />
    </>
  )
}
