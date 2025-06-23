import React, { useEffect, useState } from "react";

// Dummy updated manga simulating a new chapter date
const dummyUpdatedMangas = [
  {
    id: 7,
    title: "Chainsaw Man",
    cover:
      "https://upload.wikimedia.org/wikipedia/en/e/e7/Chainsaw_Man_volume_1.jpg",
    updatedAt: "2024-06-15T12:00:00Z",
    genres: ["Action", "Horror"],
  },
  {
    id: 1,
    title: "Naruto",
    cover:
      "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
    updatedAt: "2024-06-10T12:00:00Z",
    genres: ["Action", "Adventure"],
  },
  {
    id: 6,
    title: "Demon Slayer",
    cover:
      "https://upload.wikimedia.org/wikipedia/en/d/db/Kimetsu_no_Yaiba_volume_1_cover.jpg",
    updatedAt: "2024-06-17T12:00:00Z",
    genres: ["Action", "Supernatural"],
  },
];

export default function UpdatedMangaPage({ onSelectManga }) {
  const [updatedMangas, setUpdatedMangas] = useState([]);

  useEffect(() => {
    // Sort descending by updatedAt
    setUpdatedMangas(
      dummyUpdatedMangas.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      )
    );
  }, []);

  return (
    <section>
      <h1 className="text-3xl font-semibold mb-6">Recently Updated Manga</h1>
      {updatedMangas.length === 0 ? (
        <p>No updated manga at the moment.</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {updatedMangas.map((manga) => (
            <li
              key={manga.id}
              onClick={() => onSelectManga(manga)}
              className="cursor-pointer hover:shadow-lg transition rounded overflow-hidden bg-white dark:bg-gray-800 shadow"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSelectManga(manga);
              }}
            >
              <img
                src={manga.cover || `https://placehold.co/200x280?text=${encodeURIComponent(manga.title)}`}
                alt={`${manga.title} cover`}
                className="w-full h-40 object-cover"
                loading="lazy"
              />
              <div className="p-2 text-center">
                <h2 className="text-sm font-semibold">{manga.title}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Updated:{" "}
                  {new Date(manga.updatedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
