import { useEffect, useState } from "react";
import { NavLink, Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { collection, query, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from '../Firebase-Config';

export default function Klachten() {
    const { userID } = useParams();
    const [users, setUsers] = useState([]);
    let klachtenTemp = [];
    const [klachten, setKlachten] = useState([]);

    const fetchUsers = async () => {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersData);
      };

      const getKlachten = async() => {
        const q = query(collection(db, "klachten"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            klachtenTemp.push({ id: doc.id, ...doc.data() });
        });
        setKlachten(klachtenTemp);
    }

    const handleSelectChange = async (event, klachtId) => {
        const { value } = event.target;
        const updatedKlachten = klachten.map((klacht) => {
          if (klacht.id === klachtId) {
            return { ...klacht, toewijzing: value };
          }
          return klacht;
        });
        setKlachten(updatedKlachten);
        const klachtRef = doc(db, "klachten", klachtId);
        await updateDoc(klachtRef, { toewijzing: value });
      };

    const handleDeleteClick = async (klachtID) => {
        const confirmDelete = window.confirm(
          "Weet je zeker dat je deze klacht wilt verwijderen?"
        );
        if (confirmDelete) {
          const userRef = doc(db, "klachten", klachtID);
          await deleteDoc(userRef);
          const updatedKlachten = klachten.filter((klacht) => klacht.id !== klachtID);
          setKlachten(updatedKlachten);
        }
      };

    useEffect(() => {
        fetchUsers();
        getKlachten();
    }, [])

    console.log(klachten);
    return (
        <div className="main_back">
            <div className="blur">
                <div className="main_box row">
                    <h1 className="col-md-12">Klachten</h1>
                    <div className="klachten_list col-md-12">
                        <table>
                            <tbody>
                                {klachten.map((klacht) => 
                                    <tr className="klacht" key={klacht.id}>
                                        <td><strong>{klacht.titel}</strong></td>
                                        <td><Link to={`details/${klacht.id}`}>Details</Link></td>
                                        <td><a onClick={() => handleDeleteClick(klacht.id)}>Verwijderen</a></td>
                                        <td>
                                            <select id="" value={klacht.toewijzing} onChange={(event) => handleSelectChange(event, klacht.id)}>
                                                <option value="">Niemand</option>
                                                <option value="beheerder">Beheerder</option>
                                                <option value="onderhoudsmedewerker">Onderhoudsmedewerker</option>
                                                <option value="schoonmaker">Schoonmaker</option>
                                            </select>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}