import React, { useEffect, useState } from "react";

const dummyRandomManga = [
  {
    id: 1,
    title: "Naruto",
    cover:
      "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
    genres: ["Action", "Adventure"],
    year: 1999,
  },
  {
    id: 2,
    title: "One Piece",
    cover:
      "https://upload.wikimedia.org/wikipedia/en/4/46/One_Piece_64_cover.jpg",
    genres: ["Action", "Adventure"],
    year: 1997,
  },
  {
    id: 3,
    title: "Bleach",
    cover:
      "https://upload.wikimedia.org/wikipedia/en/1/14/Bleach_cover_1.jpg",
    genres: ["Action", "Supernatural"],
    year: 2001,
  },
  // ... add more dummy manga here
];

export default function HomePage({ randomMangaList, onSelectManga }) {
  // Show passed manga list (search results) or random manga

  const [mangaList, setMangaList] = useState([]);

  useEffect(() => {
    if (randomMangaList) {
      setMangaList(randomMangaList);
    } else {
      // Simulates API call to get some random manga
      setMangaList(dummyRandomManga);
    }
  }, [randomMangaList]);

  return (
    <section>
      <h1 className="text-3xl font-semibold mb-6">Welcome to MangaVerse</h1>
      {randomMangaList && <p className="mb-4">Search results for your query:</p>}
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {mangaList.length === 0 && <p>No manga found.</p>}
        {mangaList.map((manga) => (
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
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}