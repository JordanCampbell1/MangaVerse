import React, { useState, useEffect } from "react";

export default function MangaReadPage({ manga, chapter, onExit }) {
  /* 
    We simulate chapter images, 
    in real app, you'd fetch image URLs for the particular chapter.
  */

  // Dummy images (using placeholders with chapter and page number)
  const totalPages = 8;
  const [fullscreen, setFullscreen] = useState(false);

  // Detect mobile and go full screen from start
  useEffect(() => {
    if (window.innerWidth < 768) {
      setFullscreen(true);
    }
  }, []);

  // Toggle fullscreen on button click (desktop)
  function toggleFullscreen() {
    setFullscreen((v) => !v);
  }

  // Generate dummy images with text page number
  const images = Array.from({ length: totalPages }, (_, i) => ({
    id: i + 1,
    src: `https://placehold.co/800x1200?text=${encodeURIComponent(
      `${manga.title} - Ch ${chapter.number} Pg ${i + 1}`
    )}`,
    alt: `${manga.title} Chapter ${chapter.number} Page ${i + 1}`,
  }));

  return (
    <div
      className={`flex flex-col ${
        fullscreen ? "h-screen w-screen fixed top-0 left-0 bg-black z-50" : "max-w-4xl mx-auto"
      }`}
    >
      {!fullscreen && (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow sticky top-0 z-10">
          <div>
            <button
              onClick={onExit}
              className="text-indigo-600 hover:underline focus:outline-none"
            >
              ← Back to Details
            </button>
          </div>
          <button
            onClick={toggleFullscreen}
            aria-pressed={fullscreen}
            className="text-indigo-600 hover:underline focus:outline-none"
          >
            Fullscreen Mode
          </button>
        </div>
      )}
      {fullscreen && (
        <div className="flex justify-end p-2 bg-black">
          <button
            onClick={toggleFullscreen}
            className="text-white bg-indigo-600 px-3 py-1 rounded focus:outline-none"
          >
            Exit Fullscreen
          </button>
        </div>
      )}
      <div
        className={`flex-grow overflow-y-auto bg-black flex flex-col items-center ${
          fullscreen ? "p-4" : "p-6 rounded-b-lg"
        }`}
      >
        {images.map(({ id, src, alt }) => (
          <img
            key={id}
            src={src}
            alt={alt}
            className={`my-4 rounded-lg shadow-md ${
              fullscreen ? "max-h-[95vh] w-auto" : "max-w-full h-auto"
            }`}
            loading="lazy"
            draggable="false"
          />
        ))}
      </div>
    </div>
  );
}