import { useEffect, useState } from "react";
import "./manga_details.css";
import axios from "axios";
import PropTypes from "prop-types";

const Manga_Details = ({ id, imageURL }) => {
  const [manga, setManga] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const baseURL = "https://api.mangadex.org";
      const uploadBaseURL = "https://uploads.mangadex.org";

      try {
        let mangaResp = null;

        if (id) {
          // Fetch by ID if provided
          mangaResp = await axios.get(`${baseURL}/manga/${id}`);
        } else {
          // Handle case where neither ID nor title is provided
          setError("Please provide either ID for manga.");
        }
        setManga(mangaResp.data.data);
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

  if (!manga) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="small-details">
        <h2>{manga.attributes.title.en}</h2>
        <img src={imageURL} alt="manga-pic-icon" />
        <p>{manga.attributes.year}</p>
      </div>
      <p>{manga.attributes.description}</p>
      <span>
        <h4>{`Genre(s):`}</h4>
        {manga.attributes.tags
          ?.filter((tag) => tag.attributes.group === "genre")
          .map((tag) => (
            <p key={tag.id}>{tag.attributes.name.en}</p>
          ))}
      </span>
    </div>
  );
};

Manga_Details.propTypes = {
  imageURL: PropTypes.string,
  id: PropTypes.string,
};
export default Manga_Details;
