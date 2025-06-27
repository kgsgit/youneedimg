// deletePlaceholders.js
const { createClient } = require('@supabase/supabase-js')

// ① 아래 값을 본인 프로젝트에 맞게 바꿔주세요
const SUPABASE_URL = 'https://bmduyrsgjjwrpvmrrgut.supabase.co'
const SERVICE_ROLE_KEY = '여기에_service_role_키를_붙여넣으세요'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

;(async () => {
  try {
    const toDelete = []
    // ② 폴더 목록(카테고리) 직접 지정
    for (const folder of ['svg','png']) {
      const { data: files, error } = await supabase.storage
        .from('images')
        .list(folder, { limit: 100 })
      if (error) throw error
      for (const f of files) {
        if (f.name === '.emptyFolderPlaceholder') {
          toDelete.push(`${folder}/${f.name}`)
        }
      }
    }
    if (toDelete.length === 0) {
      console.log('삭제할 placeholder 파일이 없습니다.')
      return
    }
    console.log('삭제 대상:', toDelete)
    const { error: delErr } = await supabase.storage
      .from('images')
      .remove(toDelete)
    if (delErr) throw delErr
    console.log('삭제 완료!')
  } catch (e) {
    console.error('오류 발생:', e.message)
  }
})()
