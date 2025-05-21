import { useState } from "react";
import DOMPurify from "dompurify";
import { Link, useNavigate } from "react-router"; // fixed import
import "./Header.css";

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
      setQuery("");
      navigate(`/search?title=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img
          src="/images/icon2-wbg.png"
          alt="manga web icon"
          width="40"
          height="40"
          className="me-2"
        />
        <span className="fw-bold">MangaVerse</span>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/categories">Categories</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/updated-manga">Updated Manga</Link>
          </li>
        </ul>

        <form className="d-flex" onSubmit={handleSubmit}>
          <input
            type="search"
            className="form-control me-2"
            placeholder="Search..."
            maxLength={100}
            value={query}
            onChange={handleChange}
          />
          <button className="btn btn-outline-light" type="submit">Search</button>
        </form>
      </div>
    </nav>
  );
};

export default Header;
