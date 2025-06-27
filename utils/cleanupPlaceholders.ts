// utils/cleanupPlaceholders.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function cleanup() {
  // 1) images 버킷 전체 리스트(최대 1000개) 조회
  const { data: files, error } = await supabase.storage
    .from('images')
    .list('', { limit: 1000 })
  if (error) throw error

  // 2) “.emptyFolderPlaceholder” 경로만 필터링
  const toDelete = files
    .filter((f) => f.name === '.emptyFolderPlaceholder' || f.name.endsWith('/.emptyFolderPlaceholder'))
    .map((f) => f.name)

  if (toDelete.length === 0) {
    console.log('삭제할 placeholder가 없습니다.')
    return
  }

  // 3) 일괄 삭제
  const { error: delErr } = await supabase.storage
    .from('images')
    .remove(toDelete)
  if (delErr) console.error('삭제 실패:', delErr)
  else console.log('삭제 완료:', toDelete)
}

cleanup()
