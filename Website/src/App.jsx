import './App.css'
import {
  createBrowserRouter, 
  createRoutesFromElements,
  Route, 
  RouterProvider
} from 'react-router-dom'


// PAGES //
import Beheer from './pages/Beheer'
import Klachten from './pages/Klachten'
import Klacht_aanmaken from './pages/Klacht_aanmaken'
import Boekingen from './pages/Boekingen'
import Standplaatsen from './pages/Standplaatsen'
import Inschrijven from './pages/Inschrijven'

// COMPONENTS //
import Klachten_details from './components/Klachten_details'

// LAYOUTS //
import LoginLayout from './layouts/LoginLayout'
import DashboardLayout from './layouts/DashboardLayout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginLayout />,
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
        children: [
          {
            path: "details/:userID/:klachtID",
            element: <Klachten_details />,
          },
        ],
      },
      {
        path: "klacht_aanmaken/:userID",
        element: <Klacht_aanmaken />,
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
  return (
      <RouterProvider router={router} />
  );
}

export default App
