import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase-Config";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  let userID;

  const fetchFirebaseUser = async () => {
    if (email !== "" && password !== "") {
      const q = query(
        collection(db, "users"),
        where("email", "==", email),
        where("password", "==", password)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          userID = doc.id;
          console.log(userID);
          navigate("/dashboard?userID=" + userID);
        });
      } else {
        setErrorMessage("Email of wachtwoord incorrect.");
      }
    } else {
      setErrorMessage("Vul alle velden in.");
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="App">
      <div className="login-wrapper">
        <h1>Log In</h1>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <form onSubmit={(event) => event.preventDefault()}>
          <label>
            <p>Email</p>
            <input type="text" onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            <p>Wachtwoord</p>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <div>
            <button onClick={fetchFirebaseUser} type="submit">
              Log in
            </button>
          </div>
        </form>
      </div>
      <Outlet />
    </div>
  );
}
