import { useState } from "react";
import "./Header.css";
import DOMPurify from "dompurify";
import { Link, useNavigate } from "react-router";

const Header = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const sanitizedQuery = DOMPurify.sanitize(e.target.value);
    setQuery(sanitizedQuery);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length > 2) {
      // Navigate to search page with query in URL
      navigate(`/search?title=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header>
      <div className="header-container">
        <Link to="/">
          <img src="/images/icon2-wbg.png" alt="manga web icon" />
        </Link>
        <Link className="header-link" to="/">
          <h4>Home</h4>
        </Link>
        <Link className="header-link" to="/categories">
          <h4>Categories</h4>
        </Link>
        <Link className="header-link" to="/updated-manga">
          <h4>Updated Manga</h4>
        </Link>

        <span>
          <form onSubmit={handleSubmit}>
            <input
              type="search"
              name="manga-search"
              id="manga-search"
              placeholder="Search..."
              maxLength={100}
              value={query}
              onChange={handleChange}
            />
            <button type="submit">Search</button>
          </form>
        </span>
      </div>
    </header>
  );
};

export default Header;
