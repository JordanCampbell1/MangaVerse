import React from "react";

export default function MangaDetailsPage({ manga, onReadChapter, onBack }) {
  // Dummy chapters
  const chapters = Array.from({ length: 20 }, (_, i) => ({
    number: i + 1,
    title: `Chapter ${i + 1}`,
  }));

  return (
    <section>
      <button
        onClick={onBack}
        className="mb-4 text-indigo-600 hover:underline focus:outline-none"
      >
        ← Back to list
      </button>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0 w-48 md:w-64 rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800">
          <img
            src={
              manga.cover ||
              `https://placehold.co/256x360?text=${encodeURIComponent(manga.title)}`
            }
            alt={`${manga.title} cover`}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
        <div className="flex-grow">
          <h1 className="text-4xl font-bold mb-2">{manga.title}</h1>
          {manga.genres && (
            <div className="mb-2 flex flex-wrap gap-2">
              {manga.genres.map((genre) => (
                <span
                  key={genre}
                  className="bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
          {manga.year && (
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Released: {manga.year}
            </p>
          )}
          {(manga.description || manga.synopsis) && (
            <div className="mb-6 whitespace-pre-line text-gray-700 dark:text-gray-300">
              {manga.description || manga.synopsis || "No description available."}
            </div>
          )}
          <h2 className="text-2xl font-semibold mb-3">Chapters</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
            {chapters.map((chapter) => (
              <li key={chapter.number}>
                <button
                  onClick={() => onReadChapter(chapter)}
                  className="w-full text-left px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition focus:outline-none"
                >
                  {chapter.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}