import { useEffect, useState } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { collection, query, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../Firebase-Config";

export default function Boekingen() {
  let boekingenTemp = [];
  const [boekingen, setBoekingen] = useState([]);

  const getBoekingen = async () => {
    const q = query(collection(db, "boekingen"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      boekingenTemp.push(doc);
    });
    setBoekingen(boekingenTemp);
  };

  const handleDeleteClick = async (boekingenID) => {
    const confirmDelete = window.confirm(
      "Weet je zeker dat je deze boeking wilt verwijderen?"
    );
    if (confirmDelete) {
      const userRef = doc(db, "boekingen", boekingenID);
      await deleteDoc(userRef);
      const updatedBoekingen = boekingen.filter(
        (boeking) => boeking.id !== boekingenID
      );
      setBoekingen(updatedBoekingen);
    }
  };

  useEffect(() => {
    getBoekingen();
  }, []);

  return (
    <div className="main_back">
      <div className="blur">
        <div className="main_box row">
          <h1 className="col-md-12">Boekingen</h1>
          <div className="klachten_list col-md-12"></div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
