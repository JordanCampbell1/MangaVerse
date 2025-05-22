import PropTypes from "prop-types";
import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import "./manga_read.css";

const Manga_Read = () => {
  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [chapterImages, setChapterImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readerMode, setReaderMode] = useState(false); // Reader mode toggle

  const location = useLocation();
  const navigate = useNavigate();

  const mangaID = location.state?.mangaID;
  const [chapterIndex, setChapterIndex] = useState(location.state?.chapterIndex || 0);

  useEffect(() => {
    const fetchData = async () => {
      const baseURL = "https://api.mangadex.org";
      const uploadBaseURL = "https://uploads.mangadex.org";

      try {
        setLoading(true);
        if (!mangaID) {
          setError("Manga ID not provided.");
          return;
        }

        const mangaResp = await axios.get(`${baseURL}/manga/${mangaID}`);
        setManga(mangaResp.data.data);

        const chaptersResp = await axios.get(`${baseURL}/manga/${mangaID}/feed`, {
          params: {
            translatedLanguage: ["en"],
          },
        });
        let sortedChapters = chaptersResp.data.data.filter(ch =>
          !isNaN(parseFloat(ch.attributes.chapter))
        );

        sortedChapters.sort(
          (a, b) => parseFloat(a.attributes.chapter) - parseFloat(b.attributes.chapter)
        );

        setChapters(sortedChapters);

        const chapterID = sortedChapters[chapterIndex].id;

        const chapterData = await axios.get(`${baseURL}/at-home/server/${chapterID}`);
        const { hash, data: imageFilenames } = chapterData.data.chapter;

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

  const handlePrevious = () => {
    if (chapterIndex > 0) {
      setChapterIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (chapterIndex < chapters.length - 1) {
      setChapterIndex(prev => prev + 1);
    }
  };

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
    <div className={`container-fluid py-4 ${readerMode ? "reader-mode" : ""}`}>
      {!readerMode && (
        <h2 className="text-center mb-4">
          {manga?.attributes?.title?.en || "Manga"} - Chapter{" "}
          {chapters[chapterIndex]?.attributes?.chapter}
        </h2>
      )}

      <div className="text-center mb-3">
        <button
          className="btn btn-outline-primary mx-2"
          onClick={handlePrevious}
          disabled={chapterIndex === 0}
        >
          ← Previous
        </button>
        <button
          className="btn btn-outline-primary mx-2"
          onClick={handleNext}
          disabled={chapterIndex === chapters.length - 1}
        >
          Next →
        </button>
        <button
          className={`btn mx-2 ${readerMode ? "btn-dark" : "btn-secondary"}`}
          onClick={() => setReaderMode(prev => !prev)}
        >
          {readerMode ? "Exit Reader Mode" : "Reader Mode"}
        </button>
      </div>

      <div className="row justify-content-center">
        {chapterImages.map((src, index) => (
          <div className={`mb-4 ${readerMode ? "col-12 px-0" : "col-lg-8 col-md-10 col-sm-12"}`} key={index}>
            <img
              src={src}
              alt={`Page ${index + 1}`}
              className={`img-fluid ${readerMode ? "w-100" : "rounded shadow-sm"}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="text-center mt-4">
        <button
          className="btn btn-outline-primary mx-2"
          onClick={handlePrevious}
          disabled={chapterIndex === 0}
        >
          ← Previous
        </button>
        <button
          className="btn btn-outline-primary mx-2"
          onClick={handleNext}
          disabled={chapterIndex === chapters.length - 1}
        >
          Next →
        </button>
        
      </div>
    </div>
  );
};

Manga_Read.propTypes = {
  mangaID: PropTypes.string,
  chapterIndex: PropTypes.number,
};

export default Manga_Read;
