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
  
    stanplaatsData.sort((a, b) => a.nummer - b.nummer);
  
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
  
      // Update the standplaatsen state
      const updatedStandplaatsen = standplaatsen.filter(
        (standplaats) => standplaats.id !== standplaatsID
      );
      setStandplaatsen(updatedStandplaatsen);
    }
  };

  const handleSchoongemaaktChange = async (event, standplaatsID) => {
    const newSchoongemaaktValue = event.target.value;

    try {
      const standplaatsRef = doc(db, "standplaatsen", standplaatsID);
      await updateDoc(standplaatsRef, { schoongemaakt: newSchoongemaaktValue });

      // Update the standplaatsen state
      const updatedStandplaatsen = standplaatsen.map((standplaats) => {
        if (standplaats.id === standplaatsID) {
          return { ...standplaats, schoongemaakt: newSchoongemaaktValue };
        } else {
          return standplaats;
        }
      });
      setStandplaatsen(updatedStandplaatsen);
    } catch (error) {
      setErrorMessage("Error updating schoongemaakt: " + error.message);
    }
  };

  const handleAddStandplaats = async (event) => {
    event.preventDefault();
  
    const highestNumber = Math.max(...standplaatsen.map((standplaats) => standplaats.nummer));
    const newNumber = highestNumber + 1;
  
    try {
      // Maak nieuwe standplaats
      const standplaatsRef = await addDoc(collection(db, "standplaatsen"), {
        schoongemaakt: "Nee",
        nummer: newNumber,
      });
  
      // Update the standplaatsen state 
      setStandplaatsen((prevStandplaatsen) => [
        ...prevStandplaatsen,
        { id: standplaatsRef.id, schoongemaakt: "Nee", nummer: newNumber },
      ]);
    } catch (error) {
      setErrorMessage("Error adding standplaats: " + error.message);
    }
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
                            <td><strong>{standplaats.nummer}</strong></td>
                            <td>
                              <form>
                                <select
                                  value={standplaats.schoongemaakt}
                                  onChange={(event) => handleSchoongemaaktChange(event, standplaats.id)}
                                >
                                  <option value="Ja">Ja</option>
                                  <option value="Nee">Nee</option>
                                </select>
                              </form>
                            </td>
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
