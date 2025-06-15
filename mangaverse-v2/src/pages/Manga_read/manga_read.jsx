import PropTypes from "prop-types";
import apiClient from "../../utils/axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import "./manga_read.css";

const Manga_Read = () => {
  const [mangaData, setMangaData] = useState(null);
  const [chapterImages, setChapterImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readerMode, setReaderMode] = useState(false);
  const [chapterInputValue, setChapterInputValue] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const mangaID = location.state?.mangaID;
  const [chapterIndex, setChapterIndex] = useState(location.state?.chapterIndex || 0);

  useEffect(() => {
    const fetchChapterData = async () => {

      try {
        setLoading(true);
        if (!mangaID) {
          setError("Manga ID not provided.");
          return;
        }

        // Fetch chapter data from your local API
        const response = await apiClient.get(`/api/manga/read`, {
          params: {
            mangaID: mangaID,
            chapter_index: chapterIndex
          }
        });

        const data = response.data;
        setMangaData(data);
        setChapterImages(data.selectedChapter.imageURLs);

      } catch (err) {
        console.error("Error loading manga chapter:", err);
        setError("Failed to load manga chapter.");
      } finally {
        setLoading(false);
      }
    };

    fetchChapterData();
  }, [mangaID, chapterIndex]);

  // Update input value when chapterIndex changes
  useEffect(() => {
    setChapterInputValue((chapterIndex + 1).toString());
  }, [chapterIndex]);

  const handlePrevious = () => {
    if (chapterIndex > 0) {
      setChapterIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    // You might want to add logic here to check if there are more chapters
    // For now, we'll just increment the index
    setChapterIndex(prev => prev + 1);
  };

  const handleChapterInputChange = (e) => {
    const value = e.target.value;
    setChapterInputValue(value);
  };

  const handleChapterInputSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      const chapterNumber = parseInt(chapterInputValue);
      
      if (!isNaN(chapterNumber) && chapterNumber >= 1) {
        const newIndex = chapterNumber - 1;
        // Set bounds - minimum chapter 1 (index 0), maximum can be adjusted based on your needs
        const boundedIndex = Math.max(0, newIndex);
        setChapterIndex(boundedIndex);
      } else {
        // Reset to current chapter if invalid input (must be >= 1)
        setChapterInputValue((chapterIndex + 1).toString());
      }
    }
  };

  const handleChapterSelect = (newIndex) => {
    setChapterIndex(newIndex);
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

  if (!mangaData) {
    return <div className="alert alert-warning mt-3 text-center">No manga data available.</div>;
  }

  return (
    <div className={`container-fluid py-4 ${readerMode ? "reader-mode" : ""}`}>
      {!readerMode && (
        <div className="text-center mb-4">
          <h2>
            {mangaData.mangaTitle} - Chapter {mangaData.selectedChapter.chapterNumber}
          </h2>
          {mangaData.selectedChapter.title && mangaData.selectedChapter.title !== "No Title" && (
            <h4 className="text-muted">{mangaData.selectedChapter.title}</h4>
          )}
        </div>
      )}

      <div className="text-center mb-3">
        <button
          className="btn btn-outline-primary mx-2"
          onClick={handlePrevious}
          disabled={chapterIndex === 0}
        >
          ← Previous
        </button>
        
        <span className="mx-3">
          Chapter {mangaData.selectedChapter.chapterNumber} ({chapterImages.length} pages)
        </span>
        
        <button
          className="btn btn-outline-primary mx-2"
          onClick={handleNext}
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

      {/* Chapter Selection Input */}
      {!readerMode && (
        <div className="text-center mb-3">
          <div className="d-inline-flex align-items-center">
            <label htmlFor="chapterSelect" className="me-2">Go to chapter:</label>
            <input
              id="chapterSelect"
              type="text"
              className="form-control d-inline-block"
              style={{ width: "100px" }}
              value={chapterInputValue}
              onChange={handleChapterInputChange}
              onKeyDown={handleChapterInputSubmit}
              onBlur={handleChapterInputSubmit}
              placeholder="Enter chapter"
            />
          </div>
        </div>
      )}

      <div className="row justify-content-center">
        {chapterImages.map((src, index) => (
          <div 
            className={`mb-4 ${readerMode ? "col-12 px-0" : "col-lg-8 col-md-10 col-sm-12"}`} 
            key={index}
          >
            <img
              src={src}
              alt={`Page ${index + 1}`}
              className={`img-fluid ${readerMode ? "w-100" : "rounded shadow-sm"}`}
              loading="lazy"
              onError={(e) => {
                console.error(`Failed to load image: ${src}`);
                e.target.style.display = 'none';
              }}
              referrerPolicy="no-referrer"
            />
            {!readerMode && (
              <div className="text-center mt-2 text-muted small">
                Page {index + 1} of {chapterImages.length}
              </div>
            )}
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
          ← Previous Chapter
        </button>
        
        <button
          className="btn btn-outline-secondary mx-2"
          onClick={() => navigate(-1)}
        >
          Back to Manga
        </button>
        
        <button
          className="btn btn-outline-primary mx-2"
          onClick={handleNext}
        >
          Next Chapter →
        </button>
      </div>

      {/* Manga Cover Display in Reader Mode */}
      {readerMode && mangaData.coverImage && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1000 }}>
          <img
            src={mangaData.coverImage}
            alt="Manga Cover"
            className="rounded"
            style={{ width: "60px", height: "80px", objectFit: "cover", opacity: 0.7 }}
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
};

Manga_Read.propTypes = {
  mangaID: PropTypes.string,
  chapterIndex: PropTypes.number,
};

export default Manga_Read;