import PropTypes from "prop-types";
import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import "./manga_read.css"; // Optional: add custom tweaks if needed

const Manga_Read = () => {
  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [chapterImages, setChapterImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const mangaID = location.state?.mangaID;
  const chapterIndex = location.state?.chapterIndex;

  useEffect(() => {
    const fetchData = async () => {
      const baseURL = "https://api.mangadex.org";
      const uploadBaseURL = "https://uploads.mangadex.org";

      try {
        if (!mangaID) {
          setError("Manga ID not provided.");
          return;
        }

        // Fetch manga details
        const mangaResp = await axios.get(`${baseURL}/manga/${mangaID}`);
        setManga(mangaResp.data.data);

        // Fetch chapters
        const chaptersResp = await axios.get(`${baseURL}/manga/${mangaID}/feed`);
        let sortedChapters = chaptersResp.data.data.filter(ch =>
          !isNaN(parseFloat(ch.attributes.chapter))
        );

        sortedChapters.sort(
          (a, b) => parseFloat(a.attributes.chapter) - parseFloat(b.attributes.chapter)
        );

        setChapters(sortedChapters);

        const chapterID = sortedChapters[chapterIndex].id;

        // Fetch chapter images metadata
        const chapterData = await axios.get(`${baseURL}/at-home/server/${chapterID}`);
        const { hash, data: imageFilenames } = chapterData.data.chapter;

        // Build image URLs
        const imageUrls = imageFilenames.map(filename =>
          `${uploadBaseURL}/data/${hash}/${filename}`
        );

        setChapterImages(imageUrls);
      } catch (err) {
        console.error("Error loading manga:", err);
        setError("Failed to load manga chapter.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mangaID, chapterIndex]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-3 text-center">{error}</div>;
  }

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">
        {manga?.attributes?.title?.en || "Manga"} - Chapter{" "}
        {chapters[chapterIndex]?.attributes?.chapter}
      </h2>

      <div className="row justify-content-center">
        {chapterImages.map((src, index) => (
          <div className="col-lg-8 col-md-10 col-sm-12 mb-4" key={index}>
            <img
              src={src}
              alt={`Page ${index + 1}`}
              className="img-fluid rounded shadow-sm"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

Manga_Read.propTypes = {
  mangaID: PropTypes.string,
  chapterIndex: PropTypes.number,
};

export default Manga_Read;
