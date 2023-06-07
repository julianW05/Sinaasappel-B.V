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
    email: "",
    password: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      "Weet je zeker dat je dit account wilt verwijderen?"
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
    const { name, rol, email, password } = newMedewerker;

    // Kijk of email veld leeg is!
    if (email === "") {
      setErrorMessage("Vul een geldig email in!.");
      return;
    }

    // Kijk of er al account met dat email is.
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      setErrorMessage("Er bestaat al een account met dit email adres.");
      return;
    }

    // Kijk of alle velden zijn ingevuld!
    if (name === "" || rol === "" || password === "") {
      setErrorMessage("Vul alle velden in.");
      return;
    }

    const medewerker = { name, rol, email, password };
    const medewerkerRef = await addDoc(collection(db, "users"), medewerker);
    setUsers((prevUsers) => [
      ...prevUsers,
      { id: medewerkerRef.id, ...medewerker },
    ]);
    setNewMedewerker({ name: "", rol: "", email: "", password: "" });
    setShowAddForm(false);
  };

  const toggleAddForm = () => {
    setShowAddForm((prevState) => !prevState);
  };

  const klantUsers = users.filter((user) => user.rol === "klant");
  const medewerkerUsers = users.filter((user) => user.rol !== "klant");

  return (
    <div className="main_content">
      {showAddForm ? (
        <form onSubmit={handleAddMedewerker}>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <input
            type="text"
            name="name"
            value={newMedewerker.name}
            onChange={handleInputChange}
            placeholder="Naam"
          />
          <input
            type="email"
            name="email"
            value={newMedewerker.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <select
            name="rol"
            value={newMedewerker.rol}
            onChange={handleInputChange}
          >
            <option value="">Selecteer rol</option>
            <option value="beheerder">Beheerder</option>
            <option value="onderhoudsmedewerker">Onderhoudsmedewerker</option>
            <option value="schoonmaker">Schoonmaker</option>
          </select>
          <input
            type="password"
            name="password"
            value={newMedewerker.password}
            onChange={handleInputChange}
            placeholder="Wachtwoord"
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
          <div className="medewerkers">
            <h1>Medewerkers</h1>
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
                    Verwijder
                  </button>
                </td>
              </tr>
            ))}
          </div>
          <div className="klanten">
            <h1>Klanten</h1>
            {klantUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                  <button onClick={() => handleDeleteClick(user.id)}>
                    Verwijder
                  </button>
                </td>
              </tr>
            ))}
          </div>
        </tbody>
      </table>
    </div>
  );
}
