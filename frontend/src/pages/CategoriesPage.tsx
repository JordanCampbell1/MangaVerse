import React, { useState } from "react";

// Categories available
const allCategories = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Supernatural",
  "Romance",
  "Sci-Fi",
];

// Dummy Manga with categories (same as previous but with categories)
const dummyMangas = [
  {
    id: 1,
    title: "Naruto",
    genres: ["Action", "Adventure"],
    cover:
      "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
  },
  {
    id: 2,
    title: "One Piece",
    genres: ["Action", "Adventure"],
    cover:
      "https://upload.wikimedia.org/wikipedia/en/4/46/One_Piece_64_cover.jpg",
  },
  {
    id: 3,
    title: "Bleach",
    genres: ["Action", "Supernatural"],
    cover:
      "https://upload.wikimedia.org/wikipedia/en/1/14/Bleach_cover_1.jpg",
  },
  {
    id: 4,
    title: "Fruits Basket",
    genres: ["Romance", "Drama", "Comedy"],
    cover:
      "https://upload.wikimedia.org/wikipedia/en/2/20/Fruits_Basket_manga_volume_1.jpg",
  },
  {
    id: 5,
    title: "Tokyo Ghoul",
    genres: ["Horror", "Supernatural", "Thriller"],
    cover:
      "https://upload.wikimedia.org/wikipedia/en/6/6a/Tokyo_Ghoul_manga_volume_1_cover.jpg",
  },
  // Add more dummy manga with genres here
];

export default function CategoriesPage({ onSelectManga }) {
  const [selectedCategories, setSelectedCategories] = useState([]);

  function toggleCategory(cat) {
    setSelectedCategories((curr) =>
      curr.includes(cat) ? curr.filter((c) => c !== cat) : [...curr, cat]
    );
  }

  // Filter mangas by whether their genres include all selectedCategories
  const filteredManga =
    selectedCategories.length > 0
      ? dummyMangas.filter((manga) =>
          selectedCategories.every((cat) => manga.genres.includes(cat))
        )
      : [];

  return (
    <section>
      <h1 className="text-3xl font-semibold mb-6">Browse by Categories</h1>

      <fieldset className="mb-6">
        <legend className="font-medium mb-2">Select Categories:</legend>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <label
              key={category}
              className="inline-flex items-center cursor-pointer select-none rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-700 transition"
            >
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                aria-checked={selectedCategories.includes(category)}
              />
              <span className="ml-2 text-gray-900 dark:text-gray-100">
                {category}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {selectedCategories.length === 0 ? (
        <p className="italic text-gray-600 dark:text-gray-400">
          Select categories to see matching manga.
        </p>
      ) : filteredManga.length === 0 ? (
        <p className="text-red-500">No manga found for selected categories.</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredManga.map((manga) => (
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
      )}
    </section>
  );
}