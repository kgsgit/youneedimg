// pages/index.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import { listImages, ImageItem } from "@/utils/listImages";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const router = useRouter();

  // 1) Firebase 로그인 상태 확인
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // 2) Supabase에서 이미지 목록 불러오기
  useEffect(() => {
    listImages()
      .then((list) => setImages(list))
      .catch((err) => {
        console.error("이미지 목록 조회 실패:", err);
        alert("이미지 불러오기 실패");
      });
  }, []);

  const handleDownload = (url: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop() || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      {/* Header */}
      <header style={{ background: "#f5f5f5", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, cursor: "pointer" }} onClick={() => router.push("/")}>
          youneedimg
        </h2>
        <nav>
          {user ? (
            <>
              <span style={{ marginRight: "1rem" }}>{user.email}</span>
              <button onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <button onClick={() => router.push("/login")}>로그인</button>
              <button onClick={() => router.push("/signup")}>회원가입</button>
            </>
          )}
        </nav>
      </header>

      {/* Main */}
      <main style={{ padding: "2rem" }}>
        <h1>AI 일러스트</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {images.map((img) => (
            <div
              key={img.name}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => setSelectedImage(img)}
            >
              <Image src={img.url} alt={img.name} width={150} height={150} />
              <p style={{ marginTop: "0.5rem" }}>{img.name}</p>
              <button onClick={() => handleDownload(img.url)}>다운로드</button>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div
            style={{ background: "#fff", padding: "2rem", borderRadius: "8px", minWidth: "300px", maxWidth: "90vw" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={selectedImage.url} alt={selectedImage.name} width={300} height={300} />
            <p>{selectedImage.name}</p>
            <button onClick={() => handleDownload(selectedImage.url)}>다운로드</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ marginTop: "3rem", padding: "1rem", textAlign: "center", borderTop: "1px solid #ccc", color: "#777" }}>
        © {new Date().getFullYear()} youneedimg
      </footer>
    </div>
  );
}
