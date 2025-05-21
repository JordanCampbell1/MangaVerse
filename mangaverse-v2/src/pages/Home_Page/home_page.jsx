import { useEffect, useState } from "react";
import "./home_page.css";
import axios from "axios";
import { useNavigate } from "react-router";

const Home_Page = () => {
  const [mangaList, setMangaList] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const goToMangaDetails = (id, imageURL) => {
    const mangaData = { id, imageURL };
    navigate("/manga-details", { state: mangaData });
  };

  useEffect(() => {
    const fetchData = async () => {
      const baseURL = "https://api.mangadex.org";
      const uploadBaseURL = "https://uploads.mangadex.org";

      try {
        const response = await axios.get(`${baseURL}/manga`, {
          params: {
            "includes[]": "cover_art",
            limit: 20, // Limit results for faster load
          },
        });

        const mangaData = response.data.data.map((manga) => {
          const coverRel = manga.relationships.find(
            (rel) => rel.type === "cover_art"
          );

          const coverURL = coverRel
            ? `${uploadBaseURL}/covers/${manga.id}/${coverRel.attributes.fileName}.256.jpg`
            : null;

          return {
            id: manga.id,
            title: manga.attributes.title.en || "Untitled",
            imageURL: coverURL,
          };
        });

        setMangaList(mangaData);
      } catch (err) {
        console.error("Error fetching manga:", err);
        setError(err);
      }
    };

    fetchData();
  }, []);

  if (error) return <div>Error: {error.message}</div>;
  if (mangaList.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <h1>Home</h1>
      <div className="updated-info-container">
        {mangaList.map((manga, index) => (
          <div
            key={index}
            className="manga"
            onClick={() => goToMangaDetails(manga.id, manga.imageURL)}
          >
            {manga.imageURL && (
              <img src={manga.imageURL} alt={`Manga ${index + 1}`} />
            )}
            <h4>{manga.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home_Page;
