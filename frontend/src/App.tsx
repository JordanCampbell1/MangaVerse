
import './App.css'
import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import UpdatedMangaPage from "./pages/UpdatedMangaPage";
import MangaAiSearchPage from "./pages/MangaAiSearchPage";
import MangaDetailsPage from "./pages/MangaDetailsPage";
import MangaReadPage from "./pages/MangaReadPage";

function App() {
  const [page, setPage] = useState("home");
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedManga, setSelectedManga] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Simple page routing logic:
  // page: 'home', 'categories', 'updated', 'ai-search', 'details', 'read'
  // Header's nav and search alters these states.

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header
        onNavigate={(newPage) => {
          setPage(newPage);
          setSelectedManga(null);
          setSelectedChapter(null);
          setSearchResults([]);
          setSearchQuery("");
        }}
        onSearch={(query, results) => {
          setSearchQuery(query);
          setSearchResults(results);
          setPage("home");
        }}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {page === "home" && (
          <HomePage
            randomMangaList={searchQuery ? searchResults : undefined}
            onSelectManga={(manga) => {
              setSelectedManga(manga);
              setPage("details");
            }}
          />
        )}
        {page === "categories" && (
          <CategoriesPage
            onSelectManga={(manga) => {
              setSelectedManga(manga);
              setPage("details");
            }}
          />
        )}
        {page === "updated" && (
          <UpdatedMangaPage
            onSelectManga={(manga) => {
              setSelectedManga(manga);
              setPage("details");
            }}
          />
        )}
        {page === "ai-search" && <MangaAiSearchPage />}
        {page === "details" && selectedManga && (
          <MangaDetailsPage
            manga={selectedManga}
            onReadChapter={(chapter) => {
              setSelectedChapter(chapter);
              setPage("read");
            }}
            onBack={() => setPage("home")}
          />
        )}
        {page === "read" && selectedManga && selectedChapter && (
          <MangaReadPage
            manga={selectedManga}
            chapter={selectedChapter}
            onExit={() => setPage("details")}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;