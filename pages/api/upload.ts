// pages/api/upload.ts

import type { NextApiRequest, NextApiResponse } from "next"
import { IncomingForm } from "formidable"
import fs from "fs"
import { createClient } from "@supabase/supabase-js"

// Supabase Admin 클라이언트 (service_role 키 사용)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Next.js 기본 바디 파서 비활성화
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed")
  }

  try {
    // 1) multipart 파싱
    const form = new IncomingForm()
    const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        else resolve({ fields, files })
      })
    })

    // 2) 파일 객체 꺼내기 (단일 또는 배열)
    const fileField = files.file
    const fileObj = Array.isArray(fileField) ? fileField[0] : fileField

    // 3) 실제 임시 저장된 경로 찾기
    const filepath = 
      (fileObj as any).filepath ||  // 새로운 버전의 formidable
      (fileObj as any).path         // 구버전 지원
    if (!filepath || typeof filepath !== "string") {
      throw new Error("파일 경로를 찾을 수 없습니다.")
    }

    // 4) 카테고리 및 파일 버퍼 준비
    const category = fields.category as string
    const fileBuffer = fs.readFileSync(filepath)
    const originalName = (fileObj as any).originalFilename || "file"
    const ext = originalName.split(".").pop() || "bin"
    const filePath = `${category}/${Date.now()}.${ext}`

    // 5) MIME 타입 추출 (formidable이 제공하는 mimetype 또는 파일 확장자 기준)
    const mimetype = (fileObj as any).mimetype || `image/${ext}`

    // 6) Supabase에 업로드 (contentType 포함)
    const { error } = await supabaseAdmin.storage
      .from("images")
      .upload(filePath, fileBuffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: mimetype,
      })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    // 7) 공개 URL 생성 및 반환
    const { data } = supabaseAdmin.storage.from("images").getPublicUrl(filePath)
    return res.status(200).json({ publicUrl: data.publicUrl })
  } catch (err: any) {
    console.error("API 업로드 에러:", err)
    return res.status(500).json({ error: err.message || "Unknown error" })
  }
}
