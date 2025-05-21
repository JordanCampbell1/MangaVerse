import React from "react";
import { useNavigate } from "react-router";
import "./SearchResults.css"; // Import your CSS file for styling

const SearchResults = ({ query, results, loading, error }) => {
  const navigate = useNavigate();

  const handleClick = (manga) => {
    navigate("/manga-details", {
      state: {
        id: manga.id,
        imageURL: manga.image,
        // title: manga.title,
        // description: manga.description,
      },
    });
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">
        Search Results for: <em>{query}</em>
      </h2>

      {loading && (
        <div className="text-center">
          <div className="spinner-border" role="status" />
        </div>
      )}

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!loading && !error && results.length === 0 && (
        <div className="text-center text-muted">No manga found.</div>
      )}

      <div className="row">
        {results.map((manga) => (
          <div
            className="col-sm-6 col-md-4 col-lg-3 mb-4"
            key={manga.id}
            onClick={() => handleClick(manga)}
            style={{ cursor: "pointer" }}
          >
            <div className="card h-100 border-0 shadow-sm hover-shadow transition">
              <img
                src={manga.image}
                alt={manga.title}
                className="card-img-top img-fluid"
                style={{ height: "300px", objectFit: "cover", borderRadius: "0.5rem" }}
              />
              <div className="card-body">
                <h5 className="card-title text-truncate">{manga.title}</h5>
                <p
                  className="card-text small text-muted text-truncate"
                  title={manga.description}
                >
                  {manga.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
