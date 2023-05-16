import './App.css'
import {
  createBrowserRouter, 
  createRoutesFromElements,
  Route, 
  RouterProvider
} from 'react-router-dom'


// PAGES //

// LAYOUTS //
import LoginLayout from './layouts/LoginLayout'
import DashboardLayout from './layouts/DashboardLayout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginLayout />,
  },
  {
    path: "dashboard/:userID",
    element: <DashboardLayout />,
  },
]);

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App
