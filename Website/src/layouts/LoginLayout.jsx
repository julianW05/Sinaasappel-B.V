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
          navigate("/dashboard/" + userID);
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
    <div className="login row">
      <div className="left col-md-6">
        <div className="titel">
          <h1>Camping De Maasvallei</h1>
          <div className="line"></div>
          <p>Welkom op de website van Camping De Maasvallei. Hier kunt u inloggen of boeken.</p>
        </div>
        <div className="login_box row">
          <button className="boeken-btn"><NavLink to={'boeken'}>Boeken</NavLink></button>
          <h1 className="col-md-12">Log In</h1>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <form
            className="col-md-12"
            onSubmit={(event) => event.preventDefault()}
          >
            <label>
              <p>Email</p>
              <input type="text" onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="col-md-12">
              <p>Wachtwoord</p>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <div>
              <button onClick={fetchFirebaseUser} type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="right col-md-6">
        <p className="tekst">
          In december 2016 zijn wij de trotse eigenaars geworden van deze
          prachtige locatie, met als doel er een mooie, natuurrijke camping van
          te maken. En wij denken daarin geslaagd te zijn!<br></br>
          <br></br>
          Als u wilt genieten van rust en natuur, 30 meter van de rivier de Maas
          in het Maasheggengebied, dan bent u bij camping de Maasvallei aan het
          juiste adres! U zult de schepen voorbij zien varen en de vogels horen
          fluiten. Het Maasheggengebied is prachtig om te fietsen, wandelen of
          te vissen.<br></br>
          <br></br>
          Voor een impressie verwijzen wij u graag naar het kopje fotogalerij.
          <br></br>
          <br></br>
          Het seizoen 2023 zijn we geopend vanaf 31 maart tot 29 oktober
          <br></br>
          <br></br>
          Het seizoen 2024 zijn we geopend vanaf 29 maart tot 27 oktober
          <br></br>
          <br></br>
          Wij verwelkomen u graag!!
        </p>
        <p className="copyright">© 2023 Camping De Maasvallei</p>
      </div>
      <Outlet />
    </div>
  );
}
