import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Parse the multipart form data
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo fornecido" }, { status: 400 })
    }

    // Try with service role key first (bypasses RLS)
    let supabaseAdmin = null
    try {
      supabaseAdmin = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")
    } catch (err) {
      console.error("Failed to create admin client:", err)
    }

    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Generate a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `entregas/${fileName}`

    // Try with admin client first
    if (supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin.storage.from("materiais-reciclados").upload(filePath, buffer, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        })

        if (!error) {
          // Get the public URL
          const {
            data: { publicUrl },
          } = supabaseAdmin.storage.from("materiais-reciclados").getPublicUrl(filePath)

          return NextResponse.json({
            success: true,
            url: publicUrl,
          })
        }

        // If admin upload fails, log and continue to try with regular client
        console.error("Admin upload failed:", error)
      } catch (err) {
        console.error("Error with admin upload:", err)
      }
    }

    // Try with regular client as fallback
    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase.storage.from("materiais-reciclados").upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Erro ao fazer upload da imagem:", error)

      // If we get an RLS error, return a specific message
      if (error.message.includes("security policy")) {
        return NextResponse.json(
          {
            error: "Permissão negada para upload. Verifique as políticas de segurança do bucket.",
            code: "RLS_VIOLATION",
          },
          { status: 403 },
        )
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("materiais-reciclados").getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: publicUrl,
    })
  } catch (error: any) {
    console.error("Erro ao processar upload:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}
