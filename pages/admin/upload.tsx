"use client";

import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../../lib/firebase";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const storage = getStorage();
    const fileRef = ref(storage, `images/${file.name}`);
    setUploading(true);

    try {
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setDownloadURL(url);
      alert("업로드 성공");
    } catch (error: any) {
      alert("업로드 실패: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>이미지 업로드 (관리자)</h1>
      <input type="file" accept=".svg" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "업로드 중..." : "업로드"}
      </button>
      {downloadURL && (
        <div style={{ marginTop: "1rem" }}>
          <p>업로드된 이미지 URL:</p>
          <a href={downloadURL} target="_blank" rel="noreferrer">
            {downloadURL}
          </a>
        </div>
      )}
    </div>
  );
}
