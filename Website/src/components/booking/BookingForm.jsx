import React from "react";

const BookingForm = ({ bookingData, handleInputChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
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

        <h2>Hoofdboeker</h2>
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

        {[...Array(bookingData.numberOfPeople - 1)].map((_, index) => (
        <div key={index}>
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

        <h2>Datum</h2>
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
        <label>
        Kies een standplaats:
        <select
            name="standplaats"
            value={bookingData.standplaats}
            onChange={handleInputChange}
            required
        >
            <option value="">Selecteer een standplaats</option>
            <option value="standplaats1">Standplaats 1</option>
            <option value="standplaats2">Standplaats 2</option>
            <option value="standplaats3">Standplaats 3</option>
        </select>
        </label>

        <button type="submit">Volgende</button>
    </form>
  );
};

export default BookingForm;