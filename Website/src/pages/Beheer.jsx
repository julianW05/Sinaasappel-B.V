import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "../Firebase-Config";

export default function Beheer() {
  const [users, setUsers] = useState([]);
  const [newMedewerker, setNewMedewerker] = useState({
    name: "",
    rol: "",
    password: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);

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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewMedewerker((prevMedewerker) => ({
      ...prevMedewerker,
      [name]: value,
    }));
  };

  const handleAddMedewerker = async (event) => {
    event.preventDefault();
    const { name, rol, password } = newMedewerker;
    if (name && rol && password) {
      const medewerker = { name, rol, password };
      const medewerkerRef = await addDoc(collection(db, "users"), medewerker);
      setUsers((prevUsers) => [
        ...prevUsers,
        { id: medewerkerRef.id, ...medewerker },
      ]);
      setNewMedewerker({ name: "", rol: "", password: "" });
      setShowAddForm(false);
    }
  };

  const toggleAddForm = () => {
    setShowAddForm((prevState) => !prevState);
  };

  const klantUsers = users.filter((user) => user.rol === "klant");
  const medewerkerUsers = users.filter((user) => user.rol !== "klant");

  return (
    <div className="main_content">
      <h1 className="col-md-12">Medewerkers</h1>
      {showAddForm ? (
        <form onSubmit={handleAddMedewerker}>
          <input
            type="text"
            name="name"
            value={newMedewerker.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
          <select
            name="rol"
            value={newMedewerker.rol}
            onChange={handleInputChange}
          >
            <option value="">Select Role</option>
            <option value="beheerder">Beheerder</option>
            <option value="onderhoudsmedewerker">Onderhoudsmedewerker</option>
            <option value="schoonmaker">Schoonmaker</option>
          </select>
          <input
            type="password"
            name="password"
            value={newMedewerker.password}
            onChange={handleInputChange}
            placeholder="Password"
          />
          <button type="submit">Add Medewerker</button>
          <button type="button" onClick={toggleAddForm}>
            Cancel
          </button>
        </form>
      ) : (
        <button onClick={toggleAddForm}>Add Medewerker</button>
      )}
      <table>
        <tbody>
          {medewerkerUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <p>{user.name}</p>
                <select
                  id=""
                  value={user.rol}
                  onChange={(event) => handleSelectChange(event, user.id)}
                >
                  <option value="beheerder">Beheerder</option>
                  <option value="onderhoudsmedewerker">
                    Onderhoudsmedewerker
                  </option>
                  <option value="schoonmaker">Schoonmaker</option>
                  <option value="klant">Klant</option>
                </select>
                <button onClick={() => handleDeleteClick(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {klantUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <p>{user.name}</p>
                <p>Rol: {user.rol}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
