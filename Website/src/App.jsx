import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// PAGES //
import Beheer from './pages/Beheer'
import Klachten from './pages/Klachten'
import Klacht_toewijzingen from './pages/Klacht_toewijzingen'
import Klacht_aanmaken from './pages/Klacht_aanmaken'
import Boekingen from './pages/Boekingen'
import Standplaatsen from './pages/Standplaatsen'
import Inschrijven from './pages/Inschrijven'

// COMPONENTS //
import Klachten_details from './components/Klachten_details'
import Boekingen_details from './components/Boekingen_details'

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
    path: "dashboard/:userID",
    element: <DashboardLayout />,
    children: [
      {
        path: "beheer",
        element: <Beheer />,
      },
      {
        path: "klachten",
        element: <Klachten />,
        children: [
          {
            path: "details/:klachtID",
            element: <Klachten_details />,
          },
        ],
      },
      {
        path: "klacht_aanmaken",
        element: <Klacht_aanmaken />,
      },
      {
        path: "klacht_toewijzingen",
        element: <Klacht_toewijzingen />,
        children: [
          {
            path: "details/:klachtID",
            element: <Klachten_details />,
          },
        ],
      },
      {
        path: "boekingen",
        element: <Boekingen />,
        children: [
          {
            path: "details/:boekingID",
            element: <Boekingen_details />,
          },
        ],
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
