import "./Header.css";

const Header = () => {
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
          />
          <button type="submit">Search</button>
        </span>
      </div>
    </header>
  );
};

export default Header;
