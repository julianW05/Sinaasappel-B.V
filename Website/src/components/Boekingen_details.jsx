import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { collection, query, doc, getDoc } from "firebase/firestore";
import { db } from '../Firebase-Config';

export default function Klachten_details() {
    const { userID, boekingID } = useParams();
    const [boeking, setBoeking] = useState(null);

    const getBoeking = async() => {
        const docRef = doc(db, "boekingen", boekingID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setBoeking(docSnap.data());
        } else {
        console.log("No such document!");
        }
    }

    useEffect(() => {
        getBoeking();
    }, [boekingID])

    if (!boeking) {
        return <div>Loading...</div>; 
    }

    return (
        <div className="details_popup row">
            <h1 className="col-md-11">Persoongegevens</h1>
            <h2 className="col-md-1"><Link to={`..?userID=${userID}`}>X</Link></h2>
            <div>
                <h2>Hoodboeker</h2>
                <p>{boeking.hoofdboeker.voornaam}</p>
                <p>{boeking.hoofdboeker.achternaam}</p>
                <p>{boeking.hoofdboeker.leeftijd}</p>
                <p>{boeking.hoofdboeker.email}</p>
                <p>{boeking.hoofdboeker.telefoonnummer}</p>
            </div>
            {boeking["andere-personen"].map((medereiziger, index) => {
                return (
                    <div key={index}>
                    <h2>Medereiziger {index + 1}</h2>
                    <p>{medereiziger.voornaam}</p>
                    <p>{medereiziger.achternaam}</p>
                    <p>{medereiziger.leeftijd}</p>
                    </div>
                );
            })}
        </div>
    )
}