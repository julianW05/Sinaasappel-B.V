import { useState, useEffect } from 'react'
import './App.css'
import {
  createBrowserRouter, 
  createRoutesFromElements,
  Route, 
  RouterProvider
} from 'react-router-dom'

// PAGES //
import Test from './pages/Dashboard/Test'
import Add from './pages/Dashboard/Add'

// LAYOUTS //
import RootLayout from './layouts/RootLayout'
import DashboardLayout from './layouts/DashboardLayout'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route path="test" element={<Test />}/>
        <Route path="add" element={<Add />}/>
      </Route>
    </Route>
  )
)


function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App