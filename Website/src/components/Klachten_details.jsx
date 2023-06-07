import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { collection, query, doc, getDoc } from "firebase/firestore";
import { db } from '../Firebase-Config';

export default function Klachten_details() {
    const { userID, klachtID } = useParams();
    const [klacht, setKlacht] = useState(null);

    const getKlachten = async() => {
        const docRef = doc(db, "klachten", klachtID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setKlacht(docSnap.data());
        } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        }
    }

    useEffect(() => {
        getKlachten();
    }, [klachtID])

    if (!klacht) {
        return <div>Loading...</div>; // Show a loading state while the data is being fetched
    }

    return (
        <div className="details_popup row">
            <h1 className="col-md-11">Klacht details</h1>
            <h2 className="col-md-1"><Link to={`..`}>X</Link></h2>
            <p className="col-md-12">{klacht.details}</p>
        </div>
    )
}