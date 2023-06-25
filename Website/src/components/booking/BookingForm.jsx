import React from "react";
import { useEffect, useState } from "react";
import { collection, query, getDocs, where } from "firebase/firestore";
import { db } from "../../Firebase-Config";

const BookingForm = ({ bookingData, handleInputChange, handleSubmit }) => {
  const [standplaatsen, setStandplaatsen] = useState([]);
  const [standplaatsAvailability, setStandplaatsAvailability] = useState([]);

  useEffect(() => {
    const fetchStandplaatsen = async () => {
      try {
        const standplaatsQuery = query(collection(db, "standplaatsen"));
        const standplaatsSnapshot = await getDocs(standplaatsQuery);
        const standplaatsData = [];
        setStandplaatsen(standplaatsData);

        standplaatsSnapshot.forEach((doc) => {
          standplaatsData.push({ id: doc.id, ...doc.data() });
        });

        standplaatsData.sort((a, b) => a.nummer - b.nummer);

        const boekingenQuery = query(collection(db, "boekingen"));
        const boekingenSnapshot = await getDocs(boekingenQuery);
        const boekingenData = [];

        boekingenSnapshot.forEach((doc) => {
          boekingenData.push(doc.data());
        });

        boekingenData.forEach((boeking) => {
            standplaatsData.forEach((standplaats) => {
              const standplaatsAvailabilityIndex = standplaatsAvailability.findIndex(
                (item) => item.nummer === standplaats.nummer
              );
              if (standplaatsAvailabilityIndex === -1) {
                standplaatsAvailability.push({ nummer: standplaats.nummer, available: true });
              }
          
              if (boeking["standplaats-nummer"] === standplaats.nummer.toString()) {
                if (
                  bookingData.arrivalDate >= boeking["arrive-date"] &&
                  bookingData.arrivalDate < boeking["leaving-date"]
                ) {
                  standplaatsAvailability[standplaatsAvailabilityIndex] = {
                    nummer: standplaats.nummer,
                    available: false,
                  };
                } else {
                  standplaatsAvailability[standplaatsAvailabilityIndex] = {
                    nummer: standplaats.nummer,
                    available: true,
                  };
                }
              }
            });
        });
        
      } catch (error) {
        console.log(error);
      }
    };

    fetchStandplaatsen();
  }, [bookingData]);

  return (
    <form className="col-md-12" onSubmit={handleSubmit}>
      <label>
        Aantal mensen:
        <input
          type="number"
          name="numberOfPeople"
          value={bookingData.numberOfPeople}
          min="1"
          max="6"
          onChange={handleInputChange}
          required
        />
      </label>
      <div className="col-md-12 boeken_hoofd_persoon">
        <h2 className="col-md-12">Hoofdboeker</h2>
        <label>
          Voornaam:
          <input
            type="text"
            name="mainBooker.firstName"
            value={bookingData.mainBooker.firstName}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Achternaam:
          <input
            type="text"
            name="mainBooker.lastName"
            value={bookingData.mainBooker.lastName}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Leeftijd:
          <input
            type="number"
            name="mainBooker.age"
            value={bookingData.mainBooker.age}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="mainBooker.email"
            value={bookingData.mainBooker.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Telefoonnummer:
          <input
            type="tel"
            name="mainBooker.phoneNumber"
            value={bookingData.mainBooker.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      {[...Array(bookingData.numberOfPeople - 1)].map((_, index) => (
        <div className="boeken_extra_persoon" key={index}>
          <h2>Persoon {index + 2}</h2>
          <label>
            Voornaam:
            <input
              type="text"
              name={`person-${index + 1}.firstName`}
              value={bookingData.otherPeople[index]?.firstName || ""}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Achternaam:
            <input
              type="text"
              name={`person-${index + 1}.lastName`}
              value={bookingData.otherPeople[index]?.lastName || ""}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Leeftijd:
            <input
              type="number"
              name={`person-${index + 1}.age`}
              value={bookingData.otherPeople[index]?.age || ""}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
      ))}

      <div className="boeken_datum">
        <h2 className="col-md-12">Datum</h2>
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
        {(!bookingData.arrivalDate ||
          !bookingData.leavingDate ) ? (
          <label>
            Kies een standplaats:
            <select
              name="standplaats"
              value={bookingData.standplaats}
              onChange={handleInputChange}
              required
              disabled
            >
              <option value="" disabled>
                Selecteer een standplaats
              </option>
            </select>
          </label>
        ) : (
          <label>
            Kies een standplaats:
            <select
              name="standplaats"
              value={bookingData.standplaats}
              onChange={handleInputChange}
              required
            >
              {standplaatsen.map((standplaats, index) => (
              <option
                  key={index}
                  value={standplaats.nummer}
                  disabled={!standplaatsAvailability.find(item => item.nummer === standplaats.nummer)?.available}
              >
                  {standplaatsAvailability.find(item => item.nummer === standplaats.nummer)?.available
                  ? `Standplaats ${standplaats.nummer}`
                  : `Standplaats ${standplaats.nummer} - Standplaats al bezet`}
              </option>
              ))}
            </select>
          </label>
        )}
        </div>

      <button type="submit">Volgende</button>
    </form>
  );
};

export default BookingForm;