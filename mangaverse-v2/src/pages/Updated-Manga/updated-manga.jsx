import { useEffect, useState } from "react";
import "./updated-manga.css";
import axios from "axios";

const Updated_Manga = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      //   const title = "Kanojyo to Himitsu to Koimoyou";
      //   const baseUrl = "https://api.mangadex.org";

      //   try {
      // const resp = await axios.get(`${baseUrl}/manga`, {
      //   params: { title: title },
      //   headers: {
      //     Authorization: import.meta.env.VITE_MANGADEX_TOKEN
      //   },
      // });
      //     setResponse(resp.data.data.map(manga => manga.attributes.description)); // Save the response data to state
      //   } catch (err) {
      //     console.error("Error fetching data:", err);
      //     setError(err);
      //   }

      const baseURL = "https://api.mangadex.org";
      const uploadBaseURL = "https://uploads.mangadex.org";
      const chapterID = "588551da-a3b5-4230-98a4-584c3203beda";

      try {
        // Step 1: Fetch the list of manga IDs

        const mangaResp = await axios.get(`${baseURL}/manga`);

        const listOfMangaID = mangaResp.data.data.map((manga) => manga.id);

        // const listofChaptersForEachManga = listOfMangaID.map( async mangaID => {
        //   await axios.get(`${baseURL}/manga/${mangaID}/feed`)
        // })

        // Step 2: Fetch manga details with cover art for each manga ID
        const mangasWithFileName = await Promise.all(
          listOfMangaID.map(async (mangaID) => {
            const mangaDetails = await axios.get(
              `${baseURL}/manga/${mangaID}`,
              {
                params: { "includes[]": "cover_art" },
              }
            );

            console.log("this is manga details data:", mangaDetails.data);
            const coverArt = mangaDetails.data.data.relationships?.find(
              (rel) => rel.type === "cover_art"
            );

            console.log("this is coverart: ", coverArt);
            return {
              id: mangaID,
              fileName: coverArt?.attributes?.fileName, // Safely access fileName
            };
          })
        );

        console.log("this is  mangawith filename data: ", mangasWithFileName);

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

        // Step 4: Set the response with the fetched manga covers
        setResponse(mangaCovers.filter((cover) => cover !== null)); // Filter out null values
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

  if (!response) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Updated Manga</h1>
      <div className="updated-info-container">
        {response.map((src, index) => (
          <div className="manga">
            {src ? <img key={index} src={src} alt={`Manga ${index + 1}`} /> : null}
          </div>
        ))}
      </div>
    </div>
  );

  // return (
  //   <>
  //     <h1>Latest Releases</h1>
  //     <div className="manga-container">
  //       <img src="" alt="manga-image" />
  //       <h4>Title of Manga</h4>
  //       <h4>author of manga</h4>
  //     </div>
  //   </>
  // );
};

export default Updated_Manga;
