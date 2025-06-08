import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import apiClient from "../../utils/axios"; // ✅ use your configured client
import "./Categories.css";

const categoryList = [
  "Action",
  "Adventure",
  "Comedy",
  "Cooking",
  "Drama",
  "Fantasy",
  "Isekai",
  "Historical",
  "Horror",
  "Sports",
  "Supernatural",
  "Psychological"
];

const Categories = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // ✅ Fetch from your backend
  const fetchManga = async () => {
    if (selectedCategories.length === 0) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();
      selectedCategories.forEach((cat) =>
        params.append("categories", cat.toLowerCase())
      );

      const response = await apiClient.get(`/api/manga/filter?${params.toString()}`);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching manga", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Select Categories</h2>

      <div className="d-flex flex-wrap justify-content-center mb-4">
        {categoryList.map((category) => (
          <button
            key={category}
            className={`btn m-2 ${
              selectedCategories.includes(category)
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => toggleCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="text-center mb-4">
        <button
          className="btn btn-success"
          onClick={fetchManga}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search Manga"}
        </button>
      </div>

      <div className="row">
        {results.map((manga) => (
          <div className="col-md-4 mb-4" key={manga.id}>
            <div
              className="card h-100 shadow-sm"
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/manga-details`, {
                  state: { id: manga.id, imageURL: manga.imageURL }
                })
              }
            >
              <img
                src={manga.imageURL || "https://via.placeholder.com/256x350?text=No+Image"}
                alt={manga.title}
                className="card-img-top"
                style={{ height: "350px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{manga.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
