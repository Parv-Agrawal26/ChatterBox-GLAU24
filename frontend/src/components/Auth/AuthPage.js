import React from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Features from "../Features/Features";
import Footer from "../Footer";

const AuthPage = ({
  loginSectionRef,
  showLoginForm,
  setShowLoginForm,
  loginProps,
  registerProps,
  error,
}) => {
  const showLogin = () => setShowLoginForm(true);
  const showRegister = () => setShowLoginForm(false);

  return (
    <div className="App">
      <h1>
        ChatterBox, Chatting made easy!
        <div>
          <button
            onClick={() =>
              loginSectionRef.current.scrollIntoView({ behavior: "smooth" })
            }
          >
            Login / Register
          </button>
        </div>
      </h1>
      <p>
        ChatterBox is your go-to platform for seamless messaging. Whether you're
        catching up with old friends, chatting with your team, or simply staying
        in touch with family, ChatterBox makes it all possible.
      </p>
      <Features />
      <div className="auth-wrapper">
        <div>
          <img
            src="/chat3.png"
            className="side-image"
            alt="Chat illustration"
          />
        </div>
        <div className="auth-container">
          <h2>Please login or register.</h2>
          <div className="button-container">
            <button onClick={showLogin}>Login</button>
            <button onClick={showRegister}>Register</button>
          </div>

          {showLoginForm ? (
            <LoginForm {...loginProps} loginSectionRef={loginSectionRef} />
          ) : (
            <RegisterForm {...registerProps} />
          )}

          {error && <p className="error">{error}</p>}
        </div>
        <div>
          <img
            src="/chat2.png"
            className="side-image right-img"
            alt="Chat illustration"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};
 export default AuthPage;