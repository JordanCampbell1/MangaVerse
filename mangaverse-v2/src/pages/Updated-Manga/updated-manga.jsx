import { useEffect, useState } from "react";
import { Link } from "react-router"; // <-- Add this
import "./updated-manga.css";
import axios from "axios";

const Updated_Manga = () => {
  const [mangaList, setMangaList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpdatedManga = async () => {
      const baseURL = "https://api.mangadex.org";
      const uploadBaseURL = "https://uploads.mangadex.org";

      try {
        const response = await axios.get(`${baseURL}/manga`, {
          params: {
            limit: 20,
            order: { updatedAt: "desc" },
            "includes[]": "cover_art",
          },
        });

        const mangaData = await Promise.all(
          response.data.data.map(async (manga) => {
            const coverArt = manga.relationships.find(
              (rel) => rel.type === "cover_art"
            );

            let imageUrl = null;
            if (coverArt?.attributes?.fileName) {
              imageUrl = `${uploadBaseURL}/covers/${manga.id}/${coverArt.attributes.fileName}.256.jpg`;
            }

            return {
              id: manga.id,
              title: manga.attributes.title.en || "No Title",
              imageUrl,
            };
          })
        );

        setMangaList(mangaData);
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
