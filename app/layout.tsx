import type React from "react"
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AuthProvider from "./auth-provider"
import { ChatbotProvider } from "@/components/chatbot-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Green SaaS - Coleta de Resíduos Recicláveis",
  description: "Aplicativo para coleta e gestão de resíduos recicláveis",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ChatbotProvider>{children}</ChatbotProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
