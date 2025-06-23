import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-6 text-center text-sm border-t border-gray-300 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p>
          &copy; {new Date().getFullYear()} MangaVerse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}