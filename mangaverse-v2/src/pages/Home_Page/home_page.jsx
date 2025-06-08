import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import apiClient from "../../utils/axios";

const Home_Page = () => {
  const [mangaList, setMangaList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const goToMangaDetails = (id, imageURL) => {
    navigate("/manga-details", { state: { id, imageURL } });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/api/manga");

        setMangaList(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-5 text-center">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Home</h2>
      <div className="row">
        {mangaList.map((manga) => (
          <div key={manga.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div
              className="card h-100 shadow-sm"
              style={{ cursor: "pointer" }}
              onClick={() => goToMangaDetails(manga.id, manga.imageURL)}
            >
              <img
                src={manga.imageURL}
                className="card-img-top"
                alt={manga.title}
                style={{ height: "350px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title text-center">{manga.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home_Page;
