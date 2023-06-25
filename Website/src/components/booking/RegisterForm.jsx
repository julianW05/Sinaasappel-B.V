import React from "react";

const RegisterForm = ({ bookingData, handleInputChange, handleSubmit, handlePreviousStep }) => {
  return (
    <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <label>
            Naam:
            <input
            type="text"
            name="mainBooker.firstName"
            value={bookingData.mainBooker.firstName}
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
            Bevestig wachtwoord:
            <input
            type="password"
            name="confirmPassword"
            value={bookingData.confirmPassword}
            onChange={handleInputChange}
            required
            />
        </label>

        <button type="button" onClick={handlePreviousStep}>
            Vorige
        </button>
        <button type="submit">Volgende</button>
    </form>
  );
};

export default RegisterForm;