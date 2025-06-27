import React from 'react';

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  image: { name: string; url: string } | null;
  getDownloadUrl: (img: { name: string; url: string }, type: 'svg' | 'png') => string;
}

export default function ImageModal({ open, onClose, image, getDownloadUrl }: ImageModalProps) {
  if (!open || !image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-800"
        >✕</button>
        <div className="flex flex-col items-center">
          <img src={image.url} alt={image.name} className="mb-4 w-64 h-64 object-contain bg-gray-100" />
          <div className="flex gap-4 mt-2">
            <a
              href={getDownloadUrl(image, 'svg')}
              download
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              SVG로 다운로드
            </a>
            <a
              href={getDownloadUrl(image, 'png')}
              download
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              PNG로 다운로드
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}