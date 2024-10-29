import React from "react";

const LoginForm = ({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  handleLogin,
  loginSectionRef,
}) => {
  return (
    <form onSubmit={handleLogin} ref={loginSectionRef}>
      <h2>Already Registered? Login Here!</h2>
      <input
        type="email"
        placeholder="Username"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
