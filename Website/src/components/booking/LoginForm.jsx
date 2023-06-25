import React from "react";

const LoginForm = ({ loginData, handleInputChange, handlePreviousStep, handleSubmit, setLogin }) => {
  return (
    <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label>
            Email:
            <input
            type="email"
            name="login.email"
            value={loginData.email}
            onChange={handleInputChange}
            required
            />
        </label>
        <label>
            Password:
            <input
            type="password"
            name="login.password"
            value={loginData.password}
            onChange={handleInputChange}
            required
            />
        </label>
        <button type="button" onClick={handlePreviousStep}>
            Vorige
        </button>
        <button onClick={setLogin} type="submit">Volgende</button>
    </form>
  );
};

export default LoginForm;