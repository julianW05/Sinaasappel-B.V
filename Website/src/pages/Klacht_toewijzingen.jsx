import { useEffect, useState } from "react";
import { NavLink, Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { collection, query, getDocs, doc, getDoc, deleteDoc, updateDoc, where } from "firebase/firestore";
import { db } from '../Firebase-Config';

export default function Klacht_toewijzingen() {
    const { userID } = useParams();
    const [user, setUser] = useState();
    const [klachten, setKlachten] = useState([]);

    const fetchUser = async () => {
        const docRef = doc(db, "users", userID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setUser(docSnap.data());
          } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
          }
      };

    const getKlachten = async() => {
        if (user) {
        const q = query(collection(db, "klachten"), where("toewijzing", "==", user.rol));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setKlachten((klachten) => [...klachten, {id: doc.id, ...doc.data()}]);
        })} else {
            console.log("No user found");
        };
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
        fetchUser();
    }, [])

    useEffect(() => {
        if (user) {
            getKlachten();
        }
    }, [user])

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