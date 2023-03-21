import { useState, useEffect } from 'react'
import './App.css'
import FetchApi from './FetchApi'

function App() {

  // componentDidMount() 
  // {
  //   fetch('http://localhost:8000/api/test')
  //   .then(function(response) {
  //     response.json().then(function(resp) {
  //       console.log(resp);
  //     })
  //   })
  // }


  return (
    <div className="App">
      <FetchApi/>
    </div>
  )
}

export default App
