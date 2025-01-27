import "./App.css";
import Header from "./Components/Header/Header";
import Updated_Manga from "./pages/Updated-Manga/updated-manga";
import Manga_Details from "./pages/Manga_Details/manga_details";
import Categories from "./pages/Categories/Categories";

function App() {
  return (
    <>
      <div className="background">
        <Header />
        <div className="layout">
          <div className="whitebox">
          <Manga_Details/>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
