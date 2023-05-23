import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../Firebase-Config';
import { useEffect, useState } from 'react'

export default function RootLayout() {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  let userID;

  const fetchFirebaseUser = async() => {
    if (username != null && password != null) {
    const q = query(collection(db, "users"), where("name", "==", username), where("password", "==", password));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    userID = doc.id;
    console.log(userID);
    navigate('/dashboard?userID=' + userID);
    });
    } else {
      alert("Please fill in all fields")
    }
  }

  useEffect(() => {
  }, [])

  return (
    <div className="App">
      <div className="login-wrapper">
        <h1>Log In</h1>
        <form onSubmit={(event) => event.preventDefault()}>
          <label>
            <p>Gebruikersnaam</p>
            <input type="text" onChange={e => setUserName(e.target.value)}/>
          </label>
          <label>
            <p>Wachtwoord</p>
            <input type="password" onChange={e => setPassword(e.target.value)}/>
          </label>
          <div>
            <button onClick={fetchFirebaseUser} type="submit">Submit</button>
          </div>
        </form>
      </div>
          <Outlet />
    </div>
  )
}