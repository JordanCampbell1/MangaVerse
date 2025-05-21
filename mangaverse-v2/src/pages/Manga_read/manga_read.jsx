import PropTypes from "prop-types";
import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";

const Manga_Read = ({ mangaID, chapterIndex }) => {
  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState(null);
  const [chapterImages, setChapterImages] = useState(null);
  const [error, setError] = useState(null);

  const location = useLocation()



  mangaID = location.state?.mangaID;
  chapterIndex = location.state?.chapterIndex;

  useEffect(() => {
    const fetchData = async () => {
      const baseURL = "https://api.mangadex.org";
      const uploadBaseURL = "https://uploads.mangadex.org";

      try {
        let mangaResp = null;

        if (mangaID) {
          // Fetch by ID if provided
          //Fetch manga details
          mangaResp = await axios.get(`${baseURL}/manga/${mangaID}`);
          setManga(mangaResp.data.data);

          //fetch manga chapters
          let chapters = await axios.get(`${baseURL}/manga/${mangaID}/feed`);

          chapters = chapters.data.data;

          chapters.sort(
            (a, b) =>
              parseInt(a.attributes.chapter) - parseInt(b.attributes.chapter)
          );

          setChapters(chapters);

          const chapterID = chapters[chapterIndex].id;

          //fetch pages for a chapter
          const chapterPages = await axios.get(
            `${baseURL}/at-home/server/${chapterID}`
          );

          const chapterPagesImagesList = chapterPages.data.chapter.data;

          const chapterPagesImagesHash = chapterPages.data.chapter.hash;

          const chapterPagesActualImages = await Promise.all(
            chapterPagesImagesList.map(async (chapterPagesImage) => {
              const response = await axios.get(
                `${uploadBaseURL}/data/${chapterPagesImagesHash}/${chapterPagesImage}`,
                { responseType: "arraybuffer" } // Fetch as binary data
              );

              // console.log(response)

              // Convert the binary response to a Blob URL
              const blob = new Blob([response.data], { type: "image/jpeg" });
              return URL.createObjectURL(blob); // Return the Blob URL
            })
          );
      
          // console.log(chapterPagesActualImages)
          setChapterImages(chapterPagesActualImages);
        } else {
          // Handle case where ID is not provided
          setError("Please provide either ID for manga.");
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

  // console.log(chapterImages)

  if (!manga || !chapterImages?.length || !chapters?.length) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <h1>{`${manga.attributes.title.en} - Chapter ${chapters[chapterIndex].attributes.chapter}`}</h1>
      <div>
        {/* {chapters.map((chapter) => {
          // console.log(chapter.attributes.chapter);
          return (
            <div
              key={chapter.id}
            >{`Chapter - ${chapter.attributes.chapter}`}</div>
          );
        })} */}

        {chapterImages.map(
          (chapterImage, index) =>
            chapterImage && (
              <img key={index} src={chapterImage} alt={`Image - ${index}`} />
            )
        )}
      </div>
      <div className="pages-holder"></div>
    </>
  );
};

Manga_Read.propTypes = {
  mangaID: PropTypes.string,
  chapterIndex: PropTypes.number,
};

export default Manga_Read;
