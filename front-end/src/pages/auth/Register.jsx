import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from "../../firebase.js";
import { useSelector, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";

export function Register() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state }), shallowEqual);

  useEffect(() => {
    if (user && user.token) {
      navigate("/");
    }
  }, [user]);

  /* */ const VITE_API = `${import.meta.env.VITE_APP_REGISTER_URL}`;
  console.log(VITE_API);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      url: VITE_API, // Acceder a la variable de entorno aquí
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, config);
      toast.success(
        `Email is sent to ${email}. Click the link to complete your registration`
      );
      window.localStorage.setItem("emailForRegistration", email);
      setEmail("");
    } catch (error) {
      console.error("Error sending sign-in link:", error);
      toast.error("Error sending sign-in link. Please try again.");
    }
  };

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        className="form-control"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        autoFocus
      />
      <br />
      <button type="submit" className="btn btn-raised">
        Register
      </button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register</h4>

          {registerForm()}
        </div>
      </div>
    </div>
  );
}
