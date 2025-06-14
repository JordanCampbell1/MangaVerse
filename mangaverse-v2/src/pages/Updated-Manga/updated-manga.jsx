import { useEffect, useState } from "react";
import { Link } from "react-router"; // <-- Add this
import "./updated-manga.css";
import axios from "axios";
import apiClient from "../../utils/axios";

const Updated_Manga = () => {
  const [mangaList, setMangaList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpdatedManga = async () => {
      try {
        const response = await apiClient.get("/api/manga/latest");

        // The response data is already in the expected format
        setMangaList(response.data);
      } catch (err) {
        console.error("Error fetching updated manga:", err);
        setError(err);
      }
    };

    fetchUpdatedManga();
  }, []);

  if (error) {
    return (
      <div className="alert alert-danger mt-4 text-center">
        Error: {error.message}
      </div>
    );
  }

  if (mangaList.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Recently Updated Manga</h2>
      <div className="row">
        {mangaList.map((manga, index) => (
          <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
            <div className="card h-100 shadow-sm border-0">
              {manga.imageUrl ? (
                <Link
                  to="/manga-details"
                  state={{ id: manga.id, imageURL: manga.imageUrl }}
                >
                  <img
                    src={manga.imageUrl}
                    className="card-img-top"
                    alt={manga.title}
                  />
                </Link>
              ) : (
                <div
                  className="card-img-top bg-secondary text-white d-flex justify-content-center align-items-center"
                  style={{ height: "300px" }}
                >
                  No Cover
                </div>
              )}
              <div className="card-body">
                <h6 className="card-title text-truncate">{manga.title}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Updated_Manga;