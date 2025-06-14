import React, { useState } from "react";
import { BASE_BACKEND_URL } from "../../utils/constants";

function MangaSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState("");

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setResponseText("");


    const response = await fetch(`${BASE_BACKEND_URL}/api/ai/search?query=${encodeURIComponent(query)}`);
    if (!response.body) {
      setLoading(false);
      setResponseText("No response body");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let result = "";

    const readStream = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value);
        setResponseText(prev => prev + decoder.decode(value));
      }
      setLoading(false);
    };

    await readStream();
  };

  return (
    <div className="container py-5">
      <div className="card shadow rounded-4">
        <div className="card-body">
          <h2 className="card-title mb-4 text-center">Manga AI Search</h2>
          <div className="mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Ask a question about manga..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="text-center">
            <button
              className="btn btn-primary btn-lg rounded-pill px-4"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Thinking..." : "Ask"}
            </button>
          </div>

          <div className="mt-4">
            <h5>Response:</h5>
            <pre className="bg-light p-3 rounded-3" style={{ minHeight: "150px", whiteSpace: "pre-wrap" }}>
              {responseText || (loading ? "Waiting for response..." : "No response yet.")}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MangaSearch;
