import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import SearchResults from "../../Components/SearchResults/SearchResults";
import apiClient from "../../utils/axios";

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
        const response = await apiClient.get("/api/manga/search", {
          params: { 
            title: query
          },
        });

        // The response data is already in the expected format
        setResults(response.data);
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