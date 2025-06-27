"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";

const dummyImages = [
  { id: 1, src: "/images/sample1.svg", alt: "Illustration 1" },
  { id: 2, src: "/images/sample2.svg", alt: "Illustration 2" },
  { id: 3, src: "/images/sample3.svg", alt: "Illustration 3" }
];

export default function ImagesPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleDownload = (src: string) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    // 다운로드 실행
    const link = document.createElement("a");
    link.href = src;
    link.download = src.split("/").pop() || "image.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>AI 일러스트 모음</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1.5rem"
        }}
      >
        {dummyImages.map((img) => (
          <div
            key={img.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              textAlign: "center"
            }}
          >
            <Image src={img.src} alt={img.alt} width={150} height={150} />
            <p style={{ marginTop: "0.5rem" }}>{img.alt}</p>
            <button onClick={() => handleDownload(img.src)}>다운로드</button>
          </div>
        ))}
      </div>
    </div>
  );
}
