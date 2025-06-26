import Image from "next/image";
import { useState } from "react";

const dummyImages = [
  { id: 1, src: "/images/sample1.svg", alt: "Illustration 1" },
  { id: 2, src: "/images/sample2.svg", alt: "Illustration 2" },
  { id: 3, src: "/images/sample3.svg", alt: "Illustration 3" },
  { id: 4, src: "/images/sample4.svg", alt: "Illustration 4" },
  { id: 5, src: "/images/sample5.svg", alt: "Illustration 5" },
  { id: 6, src: "/images/sample6.svg", alt: "Illustration 6" }
];

export default function ImagesPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>AI 일러스트 목록</h1>
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
          </div>
        ))}
      </div>
    </div>
  );
}
