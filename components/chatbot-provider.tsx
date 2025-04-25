"use client"

import type React from "react"

import { useEffect } from "react"

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add chatbot script only once at the root level
    if (!document.getElementById("dify-config-script")) {
      // Create script for config
      const configScript = document.createElement("script")
      configScript.id = "dify-config-script"
      configScript.innerHTML = `
        window.difyChatbotConfig = {
          token: 'Z7BwZVugq2j9YgNp',
          baseUrl: 'https://lendario.pro'
        }
      `
      document.head.appendChild(configScript)

      // Create script for embed
      const embedScript = document.createElement("script")
      embedScript.src = "https://lendario.pro/embed.min.js"
      embedScript.id = "Z7BwZVugq2j9YgNp"
      embedScript.defer = true
      document.body.appendChild(embedScript)

      // Create style element
      const styleElement = document.createElement("style")
      styleElement.id = "dify-style"
      styleElement.innerHTML = `
        #dify-chatbot-bubble-button {
          background-color: #1C64F2 !important;
        }
        #dify-chatbot-bubble-window {
          width: 24rem !important;
          height: 40rem !important;
        }
      `
      document.head.appendChild(styleElement)
    }

    // No cleanup needed as we want the chatbot to persist
  }, [])

  return <>{children}</>
}
