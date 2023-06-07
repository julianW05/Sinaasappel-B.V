import { useEffect, useState, useRef } from "react";
import { NavLink, Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { collection, query, getDoc, doc, addDoc } from "firebase/firestore";
import { db } from '../Firebase-Config';
import Succes_popup from ".././components/Success";

export default function Klacht_aanmaken() {
    const { userID } = useParams();
    const [title, setTitle] = useState();
    const [details, setDetails] = useState();
    const ref = useRef(null);

    const createKlacht = async() => {
        if (title != null && details != null) {
        const docRef = doc(db, "users", userID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const docRef2 = await addDoc(collection(db, "klachten"), {
                titel: title,
                details: details,
                publisher: docSnap.data().name,
            });
            ref.current.value = "";
            Succes_popup("Klacht");
        } else {
            console.log("No such document!");
        }
        } else {
          alert("Please fill in all fields")
        }
      }

    useEffect(() => {
    }, [])

    return (
        <div className="main_back">
            <div className="blur">
                <div className="main_box row">
                    <h1 className="col-md-12">Klacht Indienen</h1>
                        <form className="klachten_aanmaken col-md-12" onSubmit={(event) => event.preventDefault()}>
                            <label className="col-md-12">Titel</label>
                            <input ref={ref} onChange={e => setTitle(e.target.value)} className="col-md-12" type="text" name="titel" />
                            <label className="col-md-12">Omschrijving</label>
                            <textarea ref={ref} onChange={e => setDetails(e.target.value)} className="col-md-12" name="omschrijving" />
                            <button onClick={createKlacht} type="submit">Submit</button>
                        </form>
                    </div>
            </div>
        </div>
    )
}