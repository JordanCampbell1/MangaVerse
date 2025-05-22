import { useEffect, useState } from "react";
import "./manga_details.css";
import axios from "axios";
import PropTypes from "prop-types";
import mangaRequest from "../../API/manga";
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
    const manga_details = { mangaID: mangaID, chapterIndex: chapterIndex };

    navigate("/manga-read", { state: manga_details });
  };

  useEffect(() => {
    const fetchData = async () => {
      const baseURL = "https://api.mangadex.org";
      const uploadBaseURL = "https://uploads.mangadex.org";

      try {
        let mangaResp = null;

        if (id) {
          // Fetch by ID if provided
          // mangaResp = await axios.get(`${baseURL}/manga/${id}`);

          mangaResp = await mangaRequest(id);
          setManga(mangaResp);

          //fetch manga chapters
          let chapters = await axios.get(`${baseURL}/manga/${id}/feed`, {
            params: {
              translatedLanguage: ["en"],
            }
          });

          chapters = chapters.data.data;

          chapters.sort(
            (a, b) =>
              parseInt(a.attributes.chapter) - parseInt(b.attributes.chapter)
          );

          setChapters(chapters);
        } else {
          // Handle case where ID is not provided

          setError("Please provide ID for manga.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      }
    };

    fetchData(); // Call the async function
  }, []);

  if (error) {
    return <div>{`Error: ${error}`}</div>;
  }

  if (!manga || !chapters) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="small-details">
        <h2>{manga.attributes.title.en}</h2>
        <div>
          <img src={imageURL} alt="manga-pic-icon" />
        </div>
        <p>{`Year Created: ${manga.attributes.year}`}</p>
        <h4 className="description-heading">Description:</h4>
        <p>{manga.attributes.description.en}</p>
      </div>

      <div>
        <h4 className="genre-heading">{`Genre(s):`}</h4>
        <div className="genre">
          {manga.attributes.tags
            ?.filter((tag) => tag.attributes.group === "genre")
            .map((tag) => (
              <p className="genre-item" key={tag.id}>
                {tag.attributes.name.en}
              </p>
            ))}
        </div>
      </div>
      <h2>Chapters:</h2>
      <div className="chapters">
        {chapters.length === 0 && <p>No chapters available</p>}
        {chapters.map((chapter, index) => {
          // console.log(chapter.attributes.chapter);
          return (
            <div
              className="chapter-element"
              key={chapter.id}
              onClick={() => goToMangaRead(manga.id, index)}
            >{`Chapter - ${chapter.attributes.chapter}`}</div>
          );
        })}
      </div>
    </div>
  );
};

Manga_Details.propTypes = {
  imageURL: PropTypes.string,
  id: PropTypes.string,
};
export default Manga_Details;
