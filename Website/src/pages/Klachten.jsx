import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from '../Firebase-Config';

export default function Klachten() {

    let klachtenTemp = [];
    const [klachten, setKlachten] = useState([]);

    const getKlachten = async() => {
        const q = query(collection(db, "klachten"));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        klachtenTemp.push(doc.data());
        });
        setKlachten(klachtenTemp);
    }

    useEffect(() => {
        getKlachten();
    }, [])

    console.log(klachten);
    return (
        <div className="klachten">
            <div className="blur">
                <div className="klachten_box row">
                    <h1 className="col-md-12">Klachten</h1>
                    <div className="klachten_list col-md-12">
                        <table>
                            {klachten.map((klacht) => 
                                <tr className="klacht" key={klacht.titel}>
                                    <td key={klacht.titel}>{klacht.titel}</td>
                                    <td key={klacht.titel}>Lezen</td>
                                    <td key={klacht.titel}>Verwijderen</td>
                                    <td key={klacht.titel}>Toewijzen</td>
                                </tr>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}