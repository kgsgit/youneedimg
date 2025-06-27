"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/router";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  // 관리자 이메일 설정 (이 부분에 원하는 관리자 이메일 넣으세요)
  const ADMIN_EMAIL = "okgso@naver.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("로그인이 필요합니다.");
        router.push("/login");
      } else {
        setUserEmail(user.email);
        if (user.email !== ADMIN_EMAIL) {
          alert("접근 권한이 없습니다.");
          router.push("/");
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

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

  if (userEmail !== ADMIN_EMAIL) return null;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>관리자 이미지 업로드</h1>
      <input type="file" accept=".svg" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "업로드 중..." : "업로드"}
      </button>
      {downloadURL && (
        <div style={{ marginTop: "1rem" }}>
          <p>다운로드 URL:</p>
          <a href={downloadURL} target="_blank" rel="noreferrer">
            {downloadURL}
          </a>
        </div>
      )}
    </div>
  );
}
