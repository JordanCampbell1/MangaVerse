import { useState } from "react";
import "./Header.css";
import DOMPurify from 'dompurify';
import axios from "axios";

const Header = () => {

  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const sanitizedQuery = DOMPurify.sanitize(e.target.value)
    setQuery(sanitizedQuery)
  }

  const baseURL = "https://api.mangadex.org";

// to naviagate to mnaga details page or mnaga search results page 
// requieres router so a refacotor for how the base page and 
// changing div works with router is required

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if(query.trim().length > 2){
  //     axios.get(`${baseURL}`)
  //   }
  // }


  return (
    <header>
      <div className="header-container">
        <img src="/images/icon2-wbg.png" alt="manga web icon" />
        <a href="/"><h3>Home</h3></a>
        <a href="/categories"><h3>Categories</h3></a>
        <a href="/updated-manga"><h3>Updated Manga</h3></a>
        <span>
          <input
            type="search"
            name="manga-search"
            id="manga-search"
            placeholder="Search..."
            maxLength={100}
          />
          <button type="submit">Search</button>
        </span>
      </div>
    </header>
  );
};

export default Header;
