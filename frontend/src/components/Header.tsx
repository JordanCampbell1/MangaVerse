import React, { useState } from "react";

const navItems = [
  { label: "Home", key: "home" },
  { label: "Categories", key: "categories" },
  { label: "Updated", key: "updated" },
  { label: "AI Manga Assistant", key: "ai-search" },
];

export default function Header({ onNavigate, onSearch }) {
  const [searchText, setSearchText] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Dummy search function: simulate an API search for mangas by title
  // Returns filtered dummy data containing 'manga' objects with id, title
  // Here we use a tiny static list for demo. In real app, fetch from backend.
  const dummyMangaList = [
    { id: 1, title: "Naruto" },
    { id: 2, title: "One Piece" },
    { id: 3, title: "Bleach" },
    { id: 4, title: "My Hero Academia" },
    { id: 5, title: "Attack on Titan" },
    { id: 6, title: "Demon Slayer" },
  ];

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (!searchText.trim()) return;
    const results = dummyMangaList.filter((m) =>
      m.title.toLowerCase().includes(searchText.toLowerCase())
    );
    onSearch(searchText.trim(), results);
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Site Name */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center space-x-2 font-bold text-2xl text-indigo-600 dark:text-indigo-400"
            aria-label="Go to MangaVerse Home"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>MangaVerse</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map(({ label, key }) => (
              <button
                key={key}
                onClick={() => {
                  onNavigate(key);
                  setMobileNavOpen(false);
                }}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition"
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center ml-6 flex-1 max-w-xs"
            role="search"
          >
            <label htmlFor="search-input" className="sr-only">
              Search manga
            </label>
            <input
              id="search-input"
              type="text"
              placeholder="Search manga..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              aria-label="Search"
              className="rounded-r-md bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-3 py-1.5 text-white text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              🔍
            </button>
          </form>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            {mobileNavOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav menu */}
      {mobileNavOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <ul className="flex flex-col py-2 space-y-1">
            {navItems.map(({ label, key }) => (
              <li key={key}>
                <button
                  onClick={() => {
                    onNavigate(key);
                    setMobileNavOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-700 transition rounded"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}