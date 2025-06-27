"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import Image from "next/image";

const dummyImages = [
  { id: 1, src: "/images/sample1.svg", alt: "Illustration 1" },
  { id: 2, src: "/images/sample2.svg", alt: "Illustration 2" },
  { id: 3, src: "/images/sample3.svg", alt: "Illustration 3" }
];

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleDownload = (src: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const link = document.createElement("a");
    link.href = src;
    link.download = src.split("/").pop() || "image.svg";
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
      <header
        style={{
          background: "#f5f5f5",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
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

      {/* Main Content */}
      <main style={{ padding: "2rem" }}>
        <h1>AI 일러스트</h1>
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
                textAlign: "center",
                cursor: "pointer"
              }}
              onClick={() => setSelectedImage(img)}
            >
              <Image src={img.src} alt={img.alt} width={150} height={150} />
              <p>{img.alt}</p>
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
            zIndex: 1000
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              minWidth: "300px",
              maxWidth: "90vw"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={300}
              height={300}
            />
            <p>{selectedImage.alt}</p>
            <button onClick={() => handleDownload(selectedImage.src)}>다운로드</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        style={{
          marginTop: "3rem",
          padding: "1rem",
          textAlign: "center",
          borderTop: "1px solid #ccc",
          color: "#777"
        }}
      >
        © {new Date().getFullYear()} youneedimg
      </footer>
    </div>
  );
}
