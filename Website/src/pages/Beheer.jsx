import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { collection, query, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../Firebase-Config';

export default function Beheer() {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        const usersData = [];
        querySnapshot.forEach((doc) => {
            usersData.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersData);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSelectChange = async (event, userId) => {
        const { value } = event.target;
        const updatedUsers = users.map((user) => {
            if (user.id === userId) {
                return { ...user, rol: value };
            }
            return user;
        });
        setUsers(updatedUsers);
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { rol: value });
    };

    const handleDeleteClick = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            const userRef = doc(db, "users", userId);
            await deleteDoc(userRef);
            const updatedUsers = users.filter((user) => user.id !== userId);
            setUsers(updatedUsers);
        }
    };

    return (
        <div className="main_content">
            <h1 className="col-md-12">Medewerkers</h1>
            <table>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <p>{user.name}</p>
                                <select
                                    id=""
                                    value={user.rol}
                                    onChange={(event) => handleSelectChange(event, user.id)}
                                >
                                    <option value="beheerder">Beheerder</option>
                                    <option value="onderhoudsmedewerker">Onderhoudsmedewerker</option>
                                    <option value="schoonmaker">Schoonmaker</option>
                                    <option value="klant">Klant</option>
                                </select>
                                <button onClick={() => handleDeleteClick(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}