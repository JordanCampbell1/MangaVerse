import { useEffect, useState } from "react";
import "./manga_details.css";
import axios from "axios";
import PropTypes from "prop-types";
import mangaRequest from "../../API/manga";

const Manga_Details = ({ id, imageURL }) => {
  const [manga, setManga] = useState(null);
  const [error, setError] = useState(null);

  id = "a460ab18-22c1-47eb-a08a-9ee85fe37ec8";

  useEffect(() => {
    const fetchData = async () => {
      const baseURL = "https://api.mangadex.org";
      const uploadBaseURL = "https://uploads.mangadex.org";

      try {
        let mangaResp = null;

        if (id) {
          // Fetch by ID if provided
          // mangaResp = await axios.get(`${baseURL}/manga/${id}`);

          mangaResp = await  mangaRequest(id);
          setManga(mangaResp);
          
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

  if (!manga) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="small-details">
        <h2>{manga.attributes.title.en}</h2>
        {/* <img src={imageURL} alt="manga-pic-icon" /> */}
        <p>{`Year Created: ${manga.attributes.year}`}</p>
      </div>
      <p>{manga.attributes.description.en}</p>
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
