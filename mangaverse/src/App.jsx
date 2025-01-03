import Header from "./components/Header/Header";
import Categories from "./pages/Categories/Categories";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <div className="background">
        <div className="overlay">
          <div className="white-box">
            <Categories />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
