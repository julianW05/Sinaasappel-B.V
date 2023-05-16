import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from "firebase/firestore";
import App from '../App';
import { db } from '../Firebase-Config';
import { useNavigate } from "react-router-dom";

const login = (username, password) => {
    let user;
    const navigate = useNavigate();
    navigate('/dashboard');

    const fetchFirebaseUser = async() => {
        const q = query(collection(db, "users"), where("name", "==", username), where("password", "==", password));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        user = doc.data();
        });
    }

    useEffect(() => {
        fetchFirebaseUser();
    }, [])

    return (
        <div>
        </div>
    )
}

export default login