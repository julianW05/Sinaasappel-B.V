import { useState } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase-Config";

export default function Booking() {
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    password: "",
    arrivalDate: "",
    leavingDate: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBookingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(
      query(usersRef, where("email", "==", bookingData.email))
    );
    if (!querySnapshot.empty) {
      setErrorMessage("Er bestaat al een account met dit email adres.");
      return;
    }

    const newUser = {
      name: bookingData.name,
      email: bookingData.email,
      rol: "klant",
      password: bookingData.password,
    };
    const newUserRef = await addDoc(usersRef, newUser);

    const newBooking = {
      "arrive-date": bookingData.arrivalDate,
      "leaving-date": bookingData.leavingDate,
      userID: newUserRef.id,
    };
    await addDoc(collection(db, "boekingen"), newBooking);

    setBookingData({
      name: "",
      email: "",
      password: "",
      arrivalDate: "",
      leavingDate: "",
    });

    console.log("Booking successfully made!");
  };

  return (
    <div className="main_content">
      <h1>Booking</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Naam:
          <input
            type="text"
            name="name"
            value={bookingData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={bookingData.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Wachtwoord:
          <input
            type="password"
            name="password"
            value={bookingData.password}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Aankomstdatum:
          <input
            type="date"
            name="arrivalDate"
            value={bookingData.arrivalDate}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Vertrekdatum:
          <input
            type="date"
            name="leavingDate"
            value={bookingData.leavingDate}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Book nu!</button>
      </form>
    </div>
  );
}
