import "./App.css";
import Header from "./Components/Header/Header";
import Updated_Manga from "./pages/Updated-Manga/updated-manga";

function App() {
  return (
    <>
      <div className="background">
        <Header />
        <div className="layout">
          <div className="whitebox">
            <Updated_Manga/>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
