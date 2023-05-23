import { useEffect, useState } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from '../Firebase-Config';

export default function DashboardLayout() {
    const userID = new URLSearchParams(location.search).get('userID');
    const [user, setUser] = useState();
    const navigate = useNavigate();
    console.log(userID);

    const getUserData = async() => {
        const docRef = doc(db, "users", userID);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setUser(docSnap.data());
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    useEffect(() => {
        getUserData();
    }, [])

    return (
        <div className="dashboard row">
            <div className="col-md-3 logo">
                <h1>Dashboard</h1>
            </div>
            <div className="col-md-9 top_nav_bar">
                <h2>Welkom {user?.name}</h2>
            </div>
            <div className="main_nav col-md-3">
                <div className="col-md-12 DashNavItem">
                    <NavLink to={`Klachten?userID=${userID}`}>Klachten</NavLink>
                </div>
                <div className="col-md-12 DashNavItem">
                    <NavLink to={`Boekingen?userID=${userID}`}>Boekingen</NavLink>
                </div>
                <div className="col-md-12 DashNavItem">
                    <NavLink to={`Standplaatsen?userID=${userID}`}>Standplaatsen</NavLink>
                </div>
                <div className="col-md-12 DashNavItem">
                    <NavLink to={`Inschrijven?userID=${userID}`}>Inschrijven</NavLink>
                </div>
                <div className="col-md-12 DashNavItem">
                    <NavLink to={`Beheer?userID=${userID}`}>Beheer</NavLink>
                </div>
            </div>
            <nav className="main_content col-md-9">
                <Outlet />
            </nav>
        </div>
    )
}