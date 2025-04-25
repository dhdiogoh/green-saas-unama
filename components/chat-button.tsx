"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  // Handle clicks outside the chat window to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node) && isOpen && !isMinimized) {
        // Don't close if clicking on the chat button
        const target = event.target as HTMLElement
        if (target.closest('[data-chat-button="true"]')) {
          return
        }
        setIsMinimized(true)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, isMinimized])

  const toggleChat = () => {
    if (isOpen) {
      setIsMinimized(!isMinimized)
    } else {
      setIsOpen(true)
      setIsMinimized(false)
    }
  }

  const closeChat = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700 z-50"
        size="icon"
        aria-label="Abrir chat"
        data-chat-button="true"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {isOpen && (
        <div
          ref={chatRef}
          className={`fixed z-50 transition-all duration-300 shadow-xl rounded-lg overflow-hidden ${
            isMinimized ? "bottom-20 right-6 w-72 h-12" : "bottom-24 right-6 w-80 sm:w-96 h-[500px] sm:h-[600px]"
          }`}
        >
          <div className="flex items-center justify-between bg-blue-600 p-3 text-white">
            <h2 className="font-medium">Chat de Suporte</h2>
            <div className="flex items-center space-x-1">
              {!isMinimized ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMinimized(true)}
                    className="h-6 w-6 text-white hover:bg-blue-700"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeChat}
                    className="h-6 w-6 text-white hover:bg-blue-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(false)}
                  className="h-6 w-6 text-white hover:bg-blue-700"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {!isMinimized && (
            <div className="w-full h-[calc(100%-48px)] bg-white">
              <iframe
                src="https://lendario.pro/chat/Z7BwZVugq2j9YgNp"
                className="w-full h-full border-0"
                title="Chat de Suporte"
                allow="microphone; camera"
              ></iframe>
            </div>
          )}
        </div>
      )}
    </>
  )
}
