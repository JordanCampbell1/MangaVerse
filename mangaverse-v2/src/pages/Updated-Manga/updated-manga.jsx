import { useEffect, useState } from "react";
import "./updated-manga.css";
import axios from "axios";


const Updated_Manga =  () => {

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const title = "Kanojyo to Himitsu to Koimoyou";
      const baseUrl = "https://api.mangadex.org";

      try {
        const resp = await axios.get(`${baseUrl}/manga`, {
          params: { title: title },
          headers: {
            Authorization: import.meta.env.VITE_MANGADEX_TOKEN
          },
        });
        setResponse(resp.data.data.map(manga => manga.attributes.description)); // Save the response data to state
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
        <pre>{JSON.stringify(response)}</pre>


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
