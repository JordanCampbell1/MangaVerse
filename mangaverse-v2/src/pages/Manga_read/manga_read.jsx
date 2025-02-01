import PropTypes from "prop-types";
import axios from "axios";
import { useState, useEffect } from "react";

const manga_read = ({ mangaID }) => {
  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState(null);
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

          let chapters = await axios.get(`${baseURL}/manga/${id}/feed`);

          chapters = chapters.data.data;

          chapters.sort(
            (a, b) =>
              parseInt(a.attributes.chapter) - parseInt(b.attributes.chapter)
          );

          setChapters(chapters);
        } else {
          // Handle case where ID is not provided
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
    <>
      <h1>{`${manga.attributes.title.en} - Chapter ###`}</h1>
      <div>{chapters}</div>
      <div className="pages-holder"></div>
    </>
  );
};

manga_read.PropTypes = {
  mangaID: PropTypes.string,
};

export default manga_read;
