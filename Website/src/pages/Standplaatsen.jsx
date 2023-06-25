import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "../Firebase-Config";

export default function Standplaatsen() {
  const [standplaatsen, setStandplaatsen] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchStandplaatsen = async () => {
    const q = query(collection(db, "standplaatsen"));
    const querySnapshot = await getDocs(q);
    const stanplaatsData = [];
    querySnapshot.forEach((doc) => {
        stanplaatsData.push({ id: doc.id, ...doc.data() });
    });
    setStandplaatsen(stanplaatsData);
  };

  useEffect(() => {
    fetchStandplaatsen();
  }, []);

  const handleDeleteClick = async (standplaatsID) => {
    const confirmDelete = window.confirm(
      "Weet je zeker dat je deze standplaats wilt verwijderen?"
    );
    if (confirmDelete) {
      const standplaatsRef = doc(db, "standplaatsen", standplaatsID);
      await deleteDoc(standplaatsRef);
      const updatedStandplaatsen = users.filter((standplaats) => standplaats.id !== standplaatsID);
      setUsers(updatedStandplaatsen);
    }
  };

  const handleAddStandplaats = async (event) => {
    event.preventDefault();
    
    const medewerkerRef = await addDoc(collection(db, "users"), standplaats);
    setUsers((prevUsers) => [
      ...prevUsers,
      { id: medewerkerRef.id, ...medewerker },
    ]);
  };

  return (
    <div className="main_back">
      <div className="blur">
        <div className="main_box">
            <form onSubmit={handleAddStandplaats}>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                <button type="submit">Add standplaats</button>
            </form>
          <h1 className="col-md-12">Standplaatsen</h1>
          <div className="klachten_list col-md-12">
            <table>
                <tbody>
                    {standplaatsen.map((standplaats) => 
                        <tr className="klacht" key={standplaats.id}>
                            <td><strong>{standplaats.id}</strong></td>
                            <td></td>
                            <td><a onClick={() => handleDeleteClick(standplaats.id)}>Verwijderen</a></td>
                        </tr>
                    )}
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
