import { supabase } from "@/lib/supabase"

// Function to upload an image to Supabase Storage
export async function uploadImageToSupabase(
  file: File,
  bucket = "materiais-reciclados",
): Promise<{ url: string; error: string | null }> {
  try {
    // Generate a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `entregas/${fileName}`

    // Try server-side upload first
    try {
      // Create FormData for server-side upload
      const formData = new FormData()
      formData.append("file", file)

      // Send to our API route
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        return { url: result.url, error: null }
      }

      // If server-side fails, we'll try client-side as fallback
      console.log("Server-side upload failed, trying client-side fallback...")
    } catch (err) {
      console.error("Server-side upload error:", err)
      // Continue to client-side fallback
    }

    // Client-side fallback
    if (!supabase) {
      return {
        url: `/placeholder.svg?height=400&width=600&query=recycling material ${file.name}`,
        error: "Supabase client not available",
      }
    }

    // Upload to Supabase Storage directly from client
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Client-side upload error:", error)

      // If we get a permission error, try with a demo placeholder
      if (error.message.includes("security policy") || error.message.includes("permission")) {
        return {
          url: `/placeholder.svg?height=400&width=600&query=recycling material ${file.name}`,
          error: "Permissão negada para upload. Usando imagem de demonstração.",
        }
      }

      return { url: "", error: error.message }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath)
    return { url: publicUrl, error: null }
  } catch (error: any) {
    console.error("Upload processing error:", error)
    return { url: "", error: error.message || "Erro desconhecido durante o upload" }
  }
}
