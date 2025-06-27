// utils/listImages.ts
import { supabase } from '@/lib/supabase'

export type ImageItem = {
  name: string
  url: string
}

export async function listImages(): Promise<ImageItem[]> {
  // 1) 루트(카테고리) 나열
  const { data: roots, error: rootError } = await supabase.storage
    .from('images')
    .list('', { limit: 100, offset: 0, sortBy: { column: 'name', order: 'asc' } })
  if (rootError) throw rootError

  const paths: string[] = []

  // 2) 폴더인지 파일인지 구분해 전체 경로 수집
  for (const root of roots) {
    if (root.name.includes('.')) {
      // 루트에 직접 올려진 파일
      paths.push(root.name)
    } else {
      // 카테고리(폴더) 안의 파일들
      const { data: files, error: filesError } = await supabase.storage
        .from('images')
        .list(root.name, { limit: 100, offset: 0, sortBy: { column: 'name', order: 'asc' } })
      if (filesError) {
        console.warn(`Failed to list folder "${root.name}":`, filesError)
      } else {
        for (const file of files) {
          paths.push(`${root.name}/${file.name}`)
        }
      }
    }
  }

  // 3) 각 경로에 대해 공개 URL 생성
  return paths.map((path) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from('images').getPublicUrl(path)
    return { name: path, url: publicUrl }
  })
}
