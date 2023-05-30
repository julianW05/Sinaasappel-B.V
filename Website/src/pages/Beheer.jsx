import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from '../Firebase-Config';


export default function Beheer() {

    let users = [];
 
    const fetchUsers = async () => {
       
        const q = query(collection(db, "users"));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        users.push(doc.data());
        });
       
    }
   
    useEffect(()=>{
        fetchUsers();
    }, [])

    console.log(users); 

    return (
        <div className="main_content">
            <h1 className="col-md-12">Medewerkers</h1>
            
        </div>
    )
}