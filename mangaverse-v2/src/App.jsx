import "./App.css";

import Header from "./Components/Header/Header";

import Updated_Manga from "./pages/Updated-Manga/updated-manga";
import Manga_Details from "./pages/Manga_Details/manga_details";
import Categories from "./pages/Categories/Categories";
import Manga_Read from "./pages/Manga_read/manga_read";
import Home_Page from "./pages/Home_Page/home_page.jsx";

import Error_page from "./pages/Error_Page/error_page.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router";

function App() {
  return (
    <Router>
      <div className="background">
        <Header />
        <div className="layout">
          <div className="whitebox">
            <Routes>
              <Route path="/" element={<Home_Page />} />
              <Route path="/manga-details" element={<Manga_Details />} />
              <Route path="/manga-read" element={<Manga_Read />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/updated-manga" element={<Updated_Manga />} />
              <Route path="*" element={<Error_page />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
