import axios from "axios";
import PropTypes from "prop-types";

const baseURL = "https://api.mangadex.org";

export const mangaRequest = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/manga/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching manga:", error.response?.status, error.response?.data);
    throw error; // Rethrow error for handling in the calling component
  }
};



export default mangaRequest;