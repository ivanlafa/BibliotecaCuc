import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from "../modules/Home/Home";
import Login from "../modules/Login/Login";
import Favoritos from "../modules/Favoritos/Favoritos";
import Admin from "../modules/Admin/Admin";
import Registrar from "../modules/Registrarse/Registrar";
import Reservas from "../modules/Reservas/Reservas";

const userData = JSON.parse(localStorage.getItem('user'));

function Router() {

  const router = createBrowserRouter([
    {
      path: "*",
      element: <Login/>,
    },
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/Registrar",
      element: <Registrar />,
    },
  ]);

  const routerAuth = createBrowserRouter([
    {
      path: "*",
      element: <Home />,
    },
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/Home",
      element: <Home />,
    },
    {
      path: "/Favoritos",
      element: <Favoritos />,
    },
    {
      path: "/Admin",
      element: <Admin />,
    },
    {
      path: "/Reservas",
      element: <Reservas />,
    },
  ]);

  return (
    <RouterProvider router={userData != null ? routerAuth : router} />
  );
}

export default Router;
