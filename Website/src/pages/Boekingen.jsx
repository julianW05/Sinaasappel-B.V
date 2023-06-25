import { useEffect, useState } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { collection, query, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../Firebase-Config';

export default function Boekingen() {
  const userID = new URLSearchParams(location.search).get('userID');
  const [boekingen, setBoekingen] = useState([]);

  const getBoekingen = async () => {
    try {
      const boekingenSnapshot = await getDocs(collection(db, "boekingen"));
      const boekingenData = boekingenSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBoekingen(boekingenData);
    } catch (error) {
      console.error("Error getting boekingen:", error);
    }
  };

  const handleDeleteClick = async (boekingID) => {
    const confirmDelete = window.confirm(
      "Weet je zeker dat je deze klacht wilt verwijderen?"
    );
    if (confirmDelete) {
      try {
        const userRef = doc(db, "boekingen", boekingID);
        await deleteDoc(userRef);
        const updatedBoekingen = boekingen.filter(
          (boeking) => boeking.id !== boekingID
        );
        setBoekingen(updatedBoekingen);
      } catch (error) {
        console.error("Error deleting boeking:", error);
      }
    }
  };

  useEffect(() => {
    getBoekingen();
  }, []);

  return (
    <div className="main_back">
      <div className="blur">
        <div className="main_box row">
          <h1 className="col-md-12">boekingen</h1>
          <div className="klachten_list col-md-12">
            <table>
              <tbody>
                {boekingen.map((boeking, index) => (
                  <tr key={index}>
                    <td>{boeking["aantal-personen"]}</td>
                    <td>{boeking["arrive-date"]}</td>
                    <td>{boeking["leaving-date"]}</td>
                    <td>{boeking["standplaats-nummer"]}</td>
                    <td><Link to={`/dashboard/Boekingen/details/${userID}/${boeking.id}`}>Persoonsgegevens</Link></td>
                    <td><a onClick={() => handleDeleteClick(boeking.id)}>Verwijderen</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}