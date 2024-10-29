import React from "react";

const RegisterForm = ({
  registerUsername,
  setRegisterUsername,
  registerEmail,
  setRegisterEmail,
  registerPassword,
  setRegisterPassword,
  handleRegister,
}) => {
  return (
    <form onSubmit={handleRegister}>
      <h2>New Here? Register!</h2>
      <input
        type="text"
        placeholder="Username"
        value={registerUsername}
        onChange={(e) => setRegisterUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={registerEmail}
        onChange={(e) => setRegisterEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={registerPassword}
        onChange={(e) => setRegisterPassword(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
