"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import { uploadViaApi } from "@/utils/uploadViaApi";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("svg");
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

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

    setUploading(true);
    try {
      const publicUrl = await uploadViaApi(file, category);
      setDownloadURL(publicUrl);
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

      <label>
        카테고리:
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginLeft: "1rem" }}
        >
          <option value="svg">SVG</option>
          <option value="png">PNG</option>
          <option value="ai">AI</option>
        </select>
      </label>

      <div style={{ marginTop: "1rem" }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{ marginLeft: "1rem" }}
        >
          {uploading ? "업로드 중..." : "업로드"}
        </button>
      </div>

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
