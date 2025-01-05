import Header from "./components/Header/Header";
import Categories from "./pages/Categories/Categories";
import Updated_Manga from "./pages/Updated-Manga/updated-manga"
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <div className="background">
        <div className="overlay">
          <div className="white-box">
            <Categories />
            <Updated_Manga/>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
