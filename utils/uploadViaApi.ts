export async function uploadViaApi(file: File, category: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('category', category)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({}))
    throw new Error(error || `Upload failed with status ${res.status}`)
  }

  const { publicUrl } = await res.json()
  return publicUrl
}
