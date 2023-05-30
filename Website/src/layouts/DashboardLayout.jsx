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

    var isBeheerder = false;
    var isAdmin = false;
    var isShoonamker = false;
    var isOnderhoudsmedewerker = false;
    var isKlant = false;

    if(user?.rol === "beheerder"){
        isBeheerder = true;
    }

    if(user?.rol === "admin"){
        isAdmin = true;
    }

    if(user?.rol === "schoonmaker"){
        isShoonamker = true;
    }

    if(user?.rol === "onderhoudsmedewerker"){
        isOnderhoudsmedewerker = true;
    }

    if(user?.rol === "klant"){
        isKlant = true;
    }



    return (
        <div className="dashboard row">
            <div className="col-md-3 logo">
                <h1>Dashboard</h1>
            </div>
            <div className="col-md-9 top_nav_bar">
                <h2>Welkom {user?.rol}</h2>
            </div>
            <div className="main_nav col-md-3">
                {isBeheerder ? (
                    <div className="col-md-12 DashNavItem">
                        <NavLink to={`Klachten?userID=${userID}`}>Klachten</NavLink>
                    </div>
                ): null}
                {isAdmin ? (
                    <div className="col-md-12 DashNavItem">
                        <NavLink to={`Klachten?userID=${userID}`}>Klachten</NavLink>
                    </div>
                ): null}
                {isShoonamker ? (
                    <div className="col-md-12 DashNavItem">
                        <NavLink to={`Klachten?userID=${userID}`}>Klachten</NavLink>
                    </div>
                ): null}
                {isOnderhoudsmedewerker ? (
                    <div className="col-md-12 DashNavItem">
                        <NavLink to={`Klachten?userID=${userID}`}>Klachten</NavLink>
                    </div>
                ): null}


                {isBeheerder ? (
                    <div className="col-md-12 DashNavItem">
                        <NavLink to={`Boekingen?userID=${userID}`}>Boekingen</NavLink>
                    </div>
                ): null}
                {isAdmin ? (
                    <div className="col-md-12 DashNavItem">
                        <NavLink to={`Boekingen?userID=${userID}`}>Boekingen</NavLink>
                    </div>
                ): null}


                {isBeheerder ? (
                    <div className="col-md-12 DashNavItem">
                        <NavLink to={`Standplaatsen?userID=${userID}`}>Standplaatsen</NavLink>
                    </div>
                ): null}
                {isAdmin ? (
                    <div className="col-md-12 DashNavItem">
                        <NavLink to={`Standplaatsen?userID=${userID}`}>Standplaatsen</NavLink>
                    </div>
                ): null}
                {isShoonamker ? (
                     <div className="col-md-12 DashNavItem">
                        <NavLink to={`Standplaatsen?userID=${userID}`}>Standplaatsen</NavLink>
                    </div>
                ): null}
                {isOnderhoudsmedewerker ? (
                     <div className="col-md-12 DashNavItem">
                        <NavLink to={`Standplaatsen?userID=${userID}`}>Standplaatsen</NavLink>
                    </div>
                ): null}


                {isBeheerder ? (
                    <div className="col-md-12 DashNavItem">
                        <NavLink to={`Inschrijven?userID=${userID}`}>Inschrijven</NavLink>
                    </div>
                ): null}
                {isAdmin ? (
                    <div className="col-md-12 DashNavItem">
                        <NavLink to={`Inschrijven?userID=${userID}`}>Inschrijven</NavLink>
                    </div>
                ): null}
                {isShoonamker ? (
                    <div className="col-md-12 DashNavItem">
                        <NavLink to={`Inschrijven?userID=${userID}`}>Inschrijven</NavLink>
                    </div>
                ): null}
                {isOnderhoudsmedewerker ? (
                    <div className="col-md-12 DashNavItem">
                        <NavLink to={`Inschrijven?userID=${userID}`}>Inschrijven</NavLink>
                    </div>
                ): null}
                {isKlant ? (
                    <div className="col-md-12 DashNavItem">
                        <NavLink to={`Inschrijven?userID=${userID}`}>Inschrijven</NavLink>
                    </div>
                ): null}

                {isBeheerder ? (
                    <div className="col-md-12 DashNavItem">
                        <NavLink to={`Beheer?userID=${userID}`}>Beheer</NavLink>
                    </div>
                ): null}

            </div>
            <nav className="main_content col-md-9">
                <Outlet />
            </nav>
        </div>
    )
}