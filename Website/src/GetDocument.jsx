import { useState } from 'react'
import { db, analytics } from './Firebase-Config'
import { doc, getDoc } from "firebase/firestore";

const DocumentGet = async() => {
    const docRef = doc(db, "test", "test-2");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    }
}

export default DocumentGet