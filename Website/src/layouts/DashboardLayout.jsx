import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
        if (userID == null) {
            navigate('/');
        }
        getUserData();
    }, [])

    return (
        <div className="row">
            <h1 className="col-md-12">Dashboard</h1>
            <h2 className="col-md-12">Welcome {user?.name}</h2>

            <nav className="row">
                <div className="col-md-12 DashNavItem">
                    <NavLink to="Test">another test page</NavLink>
                </div>
                <div className="col-md-12 DashNavItem">
                    <NavLink to="Add">Add something</NavLink>
                </div>
            </nav>

            <Outlet />
        </div>
    )
}