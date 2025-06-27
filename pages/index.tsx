import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import ImageModal from '../components/ImageModal';
import { listImages, ImageItem } from '../utils/listImages';

function getDownloadUrl(img: ImageItem, type: 'svg' | 'png') {
  if (type === 'svg') return img.url;
  if (type === 'png') {
    return img.url.replace(/\.svg$/, '.png');
  }
  return img.url;
}

function Page() {
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [selected, setSelected] = useState<string>('all');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<ImageItem | null>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('카테고리 로드 실패:', err));
  }, []);

  useEffect(() => {
    listImages()
      .then(result => {
        const filtered = result
          .filter(item => item.name.includes('/'))
          .filter(item => selected === 'all' || item.name.startsWith(selected + '/'));
        setImages(filtered);
      })
      .catch(err => console.error('이미지 로드 실패:', err));
  }, [selected]);

  const openModal = (img: ImageItem) => {
    setModalImage(img);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      <Head>
        <title>YouNeedImg</title>
      </Head>
      <Header />
      <main className="flex flex-col items-center max-w-4xl mx-auto px-4 py-12">
        {/* 카테고리 버튼 그룹 */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            className={
              "px-6 py-2 rounded-full font-semibold shadow transition " +
              (selected === 'all' ? 'bg-blue-600 text-white' : 'bg-white border border-blue-300 hover:bg-blue-100')
            }
            onClick={() => setSelected('all')}
          >
            전체
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={
                "px-6 py-2 rounded-full font-semibold shadow transition " +
                (selected === cat.slug ? 'bg-blue-600 text-white' : 'bg-white border border-blue-300 hover:bg-blue-100')
              }
              onClick={() => setSelected(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        {/* 이미지 그리드 */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-items-center">
          {images.map(img => (
            <div
              key={img.name}
              className="rounded-xl bg-white border shadow-md hover:shadow-xl cursor-pointer transition flex flex-col items-center p-4"
              onClick={() => openModal(img)}
              style={{ minWidth: 140, minHeight: 140 }}
            >
              <img
                src={img.url}
                alt={img.name}
                className="w-24 h-24 object-contain bg-gray-100 rounded mb-2"
              />
            </div>
          ))}
        </div>
      </main>
      <ImageModal
        open={modalOpen}
        onClose={closeModal}
        image={modalImage}
        getDownloadUrl={getDownloadUrl}
      />
    </div>
  );
}

export default Page;
