import { useEffect, useState } from "react";
import { NavLink, Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { collection, query, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../Firebase-Config';

export default function Klachten() {
    const { userID } = useParams();
    let klachtenTemp = [];
    const [klachten, setKlachten] = useState([]);

    const getKlachten = async() => {
        const q = query(collection(db, "klachten"));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        klachtenTemp.push(doc);
        });
        setKlachten(klachtenTemp);
    }

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
                                        <td><strong>{klacht._document.data.value.mapValue.fields.titel.stringValue}</strong></td>
                                        <td><Link to={`details/${klacht.id}`}>Details</Link></td>
                                        <td><a onClick={() => handleDeleteClick(klacht.id)}>Verwijderen</a></td>
                                        <td><a>Toewijzen</a></td>
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