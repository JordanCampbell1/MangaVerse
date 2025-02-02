import axios from "axios";

const baseURL = "https://api.mangadex.org";
const uploadBaseURL = "https://uploads.mangadex.org";

/**
 * Fetches cover images for a single manga or multiple mangas.
 * @param {string | string[]} mangaIds - A single manga ID or an array of IDs.
 * @returns {Promise<Object[]>} - An array of objects containing manga ID and cover image URL.
 */
export const fetchMangaCovers = async () => {
  try {
    const mangaResp = await axios.get(`${baseURL}/manga`, {
      params: { "includes[]": "cover_art" },
    }); //put this below and replace accordinglt

    listOfMangas = mangaResp.data.data;

    // Step 1: Fetch manga details with cover art
    const mangasWithCoverArt = listOfMangas.map((manga) => {
      const coverArt = manga.relationships?.find(
        (rel) => rel.type === "cover_art"
      );

      return {
        id: manga.id,
        fileName: coverArt?.attributes?.fileName || null,
      };
    });

    // Step 2: Fetch the cover images using the file names
    const mangaCovers = await Promise.all(
      mangasWithCoverArt.map(async (manga) => {
        if (manga.fileName) {
          const coverImage = await axios.get(
            `${uploadBaseURL}/covers/${manga.id}/${manga.fileName}.256.jpg`,
            { responseType: "arraybuffer" }
          );

          const blob = new Blob([coverImage.data], { type: "image/jpeg" });
          const imageUrl = URL.createObjectURL(blob);

          return { id: manga.id, imageUrl };
        }
        return { id: manga.id, imageUrl: null }; // Handle cases where cover art is not available
      })
    );

    return mangaCovers;
  } catch (error) {
    console.error("Error fetching manga covers:", error);
    throw error; // Rethrow error for handling in the component
  }
};

export default fetchMangaCovers;
