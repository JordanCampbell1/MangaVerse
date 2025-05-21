import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router"; 

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
      const baseURL = "https://api.mangadex.org";
      const uploadBaseURL = "https://uploads.mangadex.org";

      try {
        const response = await axios.get(`${baseURL}/manga`, {
          params: {
            "includes[]": "cover_art",
            limit: 20,
          },
        });

        const mangaData = response.data.data.map((manga) => {
          const coverRel = manga.relationships.find(
            (rel) => rel.type === "cover_art"
          );

          const coverURL = coverRel
            ? `${uploadBaseURL}/covers/${manga.id}/${coverRel.attributes.fileName}.256.jpg`
            : "https://via.placeholder.com/256x350?text=No+Image";

          return {
            id: manga.id,
            title: manga.attributes.title.en || "Untitled",
            imageURL: coverURL,
          };
        });

        setMangaList(mangaData);
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
