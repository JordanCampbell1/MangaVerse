import { useEffect, useState } from "react";
import "./home_page.css";
import axios from "axios";
import { useNavigate } from "react-router";


const Home_Page = () => {
  const [imageURLs, setImageURLs] = useState(null);
  const [manga, setManga] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();


  const goToMangaDetails = (id, imageURL) => {

    const mangaData = { id: id, imageURL: imageURL, };

    navigate("/manga-details", { state: mangaData });
  };

  useEffect(() => {
    const fetchData = async () => {
      const baseURL = "https://api.mangadex.org";
      const uploadBaseURL = "https://uploads.mangadex.org";

      try {
        // Step 1: Fetch the list of manga IDs

        const mangaResp = await axios.get(`${baseURL}/manga`);

        setManga(mangaResp.data.data);

        const listOfMangaID = mangaResp.data.data.map((manga) => manga.id);

        // Step 2: Fetch manga details with cover art for each manga ID
        const mangasWithFileName = await Promise.all(
          listOfMangaID.map(async (mangaID) => {
            const mangaDetails = await axios.get(
              `${baseURL}/manga/${mangaID}`,
              {
                params: { "includes[]": "cover_art" },
              }
            );

            // console.log("this is manga details data:", mangaDetails.data);
            const coverArt = mangaDetails.data.data.relationships?.find(
              (rel) => rel.type === "cover_art"
            );

            // console.log("this is coverart: ", coverArt);
            return {
              id: mangaID,
              fileName: coverArt?.attributes?.fileName, // Safely access fileName
            };
          })
        );

        // console.log("this is  mangawith filename data: ", mangasWithFileName);

        // Step 3: Fetch the cover images using the file names
        const mangaCovers = await Promise.all(
          mangasWithFileName.map(async (manga) => {
            if (manga.fileName) {
              const coverImage = await axios.get(
                `${uploadBaseURL}/covers/${manga.id}/${manga.fileName}.256.jpg`,
                { responseType: "arraybuffer" }
              );
              const blob = new Blob([coverImage.data], { type: "image/jpeg" }); // Adjust MIME type if necessary
              const imageUrl = URL.createObjectURL(blob);
              return imageUrl; // This can be used as an `src` in an `<img>` tag
            }
            return null; // Handle cases where coverArt is not available
          })
        );

        // Step 4: Set the imageURLs with the fetched manga covers
        setImageURLs(mangaCovers.filter((cover) => cover !== null)); // Filter out null values
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      }
    };

    fetchData(); // Call the async function
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!imageURLs) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Home</h1>
      <div className="updated-info-container">
        {imageURLs.map((src, index) => (
          <div key={index} className="manga" onClick={() => goToMangaDetails(manga[index].id, src)}>
            {src ? (
              <img key={index} src={src} alt={`Manga ${index + 1}`} />
            ) : null}
            <h4>{manga[index].attributes.title.en}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home_Page;
