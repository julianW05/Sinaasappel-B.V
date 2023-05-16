import { useState, useEffect } from 'react'
import { db, analytics } from './Firebase-Config'
import { doc, getDoc } from "firebase/firestore";

const DocumentGet = () => {
    const [name, setName] = useState()

    const FetchData = async() => {
        const docRef = doc(db, "test", "test-2");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        console.log("Document data:", docSnap.data().name);
        setName(docSnap.data().name)
        } else {
        console.log("No such document!");
        }
    }

    useEffect(() => {
        if (name == undefined) {
            FetchData()
        }
    }, [])

    return (
        <div>
            <h1>{name}</h1>
        </div>
    )
}

export default DocumentGet