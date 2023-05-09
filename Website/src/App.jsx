import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { db, analytics } from './Firebase-Config'
import { doc, getDoc } from "firebase/firestore";
import DocumentGet from './GetDocument'
import DocumentSet from './SetDocument'

function App() {

  

    return (
      <div className="App">
        <DocumentGet />
      </div>
    )
  }

export default App
