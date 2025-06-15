import { useEffect, useState } from "react";
import "./manga_details.css";
import apiClient from "../../utils/axios";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router";

const Manga_Details = ({ id, imageURL }) => {
  const [manga, setManga] = useState(null);
  const [error, setError] = useState(null);
  const [chapters, setChapters] = useState(null);

  const location = useLocation();
  id = location.state?.id;
  imageURL = location.state?.imageURL;

  const navigate = useNavigate();

  const goToMangaRead = (mangaID, chapterIndex) => {
    navigate("/manga-read", { state: { mangaID, chapterIndex } });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Please provide ID for manga.");
        return;
      }

      try {
        const response = await apiClient.get("/api/manga/detail", {
          params: { id: id },
        });

        const mangaData = response.data;
        setManga({
          id: mangaData.id,
          title: mangaData.title,
          description: mangaData.description,
          imageURL: mangaData.imageURL,
          year: mangaData.year,               // Added year
          genres: mangaData.genres || [],    // Added genres (array)
        });
        setChapters(mangaData.chapters || []);
      } catch (err) {
        console.error("Error fetching manga detail:", err);
        setError("Failed to fetch manga details.");
      }
    };

    fetchData();
  }, [id]);

  if (error) return <div>{`Error: ${error}`}</div>;
  if (!manga || !chapters) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="small-details">
        <h2>{manga.title}</h2>
        <div>
          <img src={manga.imageURL} alt="manga-pic-icon" referrerPolicy="no-referrer" />
        </div>

        {/* New Year and Genres section */}
        <div className="manga-meta">
          <p><strong>Year:</strong> {manga.year || "Unknown"}</p>
          <p>
            <strong>Genres:</strong>{" "}
            {manga.genres.length > 0 ? manga.genres.join(", ") : "Not specified"}
          </p>
        </div>

        <h4 className="description-heading">Description:</h4>
        <p>{manga.description}</p>
      </div>

      <h2>Chapters:</h2>
      <div className="chapters">
        {chapters.length === 0 && <p>No chapters available</p>}
        {chapters.map((chapter, index) => (
          <div
            className="chapter-element"
            key={chapter.id}
            onClick={() => goToMangaRead(manga.id, index)}
          >
            {`Chapter - ${chapter.chapter}${chapter.title ? `: ${chapter.title}` : ""}`}
          </div>
        ))}
      </div>
    </div>
  );
};

Manga_Details.propTypes = {
  imageURL: PropTypes.string,
  id: PropTypes.string,
};

export default Manga_Details;
