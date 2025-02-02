import "./App.css";
import Header from "./Components/Header/Header";
import Updated_Manga from "./pages/Updated-Manga/updated-manga";
import Manga_Details from "./pages/Manga_Details/manga_details";
import Categories from "./pages/Categories/Categories";
import Manga_Read from "./pages/Manga_read/manga_read";
import Home_Page from "./pages/Home_Page/home_page.jsx";


import Error_page from "./pages/Error_Page/error_page.jsx";

import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home_Page/>,
    errorElement: <Error_page/>
  },
]);

function App() {
  return (
    <>
      <div className="background">
        <Header />
        <div className="layout">
          <div className="whitebox">
            {/* <Manga_Read /> */}
            
            <RouterProvider router={router} />

          </div>
        </div>
      </div>
    </>
  );
}

export default App;
