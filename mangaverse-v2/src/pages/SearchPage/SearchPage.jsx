import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import SearchResults from "../../Components/SearchResults/SearchResults";

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("title") || "";

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 3) return;

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("https://api.mangadex.org/manga", {
          params: { title: query, "includes[]": "cover_art" },
        });

        const formattedResults = await Promise.all(
          response.data.data.map(async (manga) => {
            const cover = manga.relationships.find((r) => r.type === "cover_art");
            const fileName = cover?.attributes?.fileName;
            return {
              id: manga.id,
              title: manga.attributes.title.en || "Untitled",
              description: manga.attributes.description.en || "",
              image: fileName
                ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
                : "https://via.placeholder.com/256x350?text=No+Image",
            };
          })
        );

        setResults(formattedResults);
      } catch (err) {
        setError("Failed to load search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <SearchResults query={query} results={results} loading={loading} error={error} />
  );
};

export default SearchPage;
