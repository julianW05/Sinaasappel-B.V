import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from '../Firebase-Config';

export default function Klachten() {
    return (
        <div className="main_content">
            <h1 className="col-md-12">Klachten</h1>
        </div>
    )
}