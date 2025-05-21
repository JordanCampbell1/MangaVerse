import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import "./Categories.css"; // Optional: add custom tweaks if needed

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
  const [tagMap, setTagMap] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔁 Fetch all available tags once on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("https://api.mangadex.org/manga/tag");
        const mapping = {};
        response.data.data.forEach((tag) => {
          const tagName = tag.attributes.name.en.toLowerCase();
          mapping[tagName] = tag.id;
        });
        setTagMap(mapping);
      } catch (error) {
        console.error("Failed to fetch tags", error);
      }
    };

    fetchTags();
  }, []);

  // ✅ Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // 🔍 Fetch manga that matches all selected tags
  const fetchManga = async () => {
    if (selectedCategories.length === 0) return;
    setLoading(true);

    try {
      const tagIds = selectedCategories
        .map((category) => tagMap[category.toLowerCase()])
        .filter(Boolean); // remove undefined if a tag wasn't found

      const response = await axios.get("https://api.mangadex.org/manga", {
        params: {
          includedTags: tagIds,
          // includedTagsMode: "AND",
          limit: 12,
          includes: ["cover_art"]
        }
      });

      setResults(response.data.data);
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
        {results.map((manga) => {
          const title = manga.attributes.title.en || "No Title";
          const description =
            manga.attributes.description?.en?.slice(0, 100) ||
            "No description available";
          const coverId = manga.relationships.find(
            (rel) => rel.type === "cover_art"
          )?.attributes?.fileName;

          const imageUrl = coverId
            ? `https://uploads.mangadex.org/covers/${manga.id}/${coverId}.256.jpg`
            : "https://via.placeholder.com/256x350?text=No+Image";

          return (
            <div className="col-md-4 mb-4" key={manga.id}>
              <div
                className="card h-100 shadow-sm cursor-pointer"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/manga-details`, { state: { id: manga.id, imageURL: imageUrl } })}
              >
                <img
                  src={imageUrl}
                  alt={title}
                  className="card-img-top"
                  style={{ height: "350px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{title}</h5>
                  <p className="card-text">{description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
