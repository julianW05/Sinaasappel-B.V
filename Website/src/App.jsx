import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// PAGES //
import Beheer from "./pages/Beheer";
import Klachten from "./pages/Klachten";
import Boekingen from "./pages/Boekingen";
import Standplaatsen from "./pages/Standplaatsen";
import Inschrijven from "./pages/Inschrijven";

// LAYOUTS //
import LoginLayout from "./layouts/LoginLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import BookingLayout from "./layouts/BookingLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginLayout />,
  },
  {
    path: "boeken",
    element: <BookingLayout />,
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "beheer",
        element: <Beheer />,
      },
      {
        path: "klachten",
        element: <Klachten />,
      },
      {
        path: "boekingen",
        element: <Boekingen />,
      },
      {
        path: "standplaatsen",
        element: <Standplaatsen />,
      },
      {
        path: "inschrijven",
        element: <Inschrijven />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
