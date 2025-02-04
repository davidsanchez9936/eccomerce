import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.js";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "antd";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleAuthProvider } from "firebase/auth";

export function Login() {
  const [email, setEmail] = useState(""); // Inicializado con cadena vacía
  const [password, setPassword] = useState(""); // Inicializado con cadena vacía
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) {
      navigate("/");
    }
  }, [user]);

  let dispatch = useDispatch();

  const createOrUpdateUser = async (authtoken) => {
    return await fetch(
      `${import.meta.env.VITE_APP_API}/create-or-update-user`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authtoken,
        },
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log(result);
      const { user } = result;
      const idTokenResult = user.accessToken;
      const name = user.displayName;
      createOrUpdateUser(idTokenResult)
        .then((res) => res.json()) // Convertir la respuesta a JSON
        .then((data) => {
          console.log("Respuesta de createOrUpdateUser:", data); // Agregar console.log
          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              name: data.name,
              email: data.email,
              token: idTokenResult,
              role: data.role,
              _id: data._id,
            },
          });
        /*   window.location.reload();
          navigate("/"); */
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const idTokenResult = await result.accessToken;

      dispatch({
        type: "LOGGED_IN_USER",
        payload: {
          email: result.email,
          token: idTokenResult,
        },
      });

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          autoFocus
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          autoFocus
        />
      </div>
      <br />
      <Button
        onClick={handleSubmit}
        type="primary"
        className="mb-3"
        block
        shape="round"
        icon={<MailOutlined />}
        size="large"
        disabled={!email || password.length < 6}
      >
        Login with Email/Password
      </Button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Login</h4>
          )}
          {loginForm()}
          <Button
            onClick={googleLogin}
            type="primary"
            className="mb-3"
            block
            shape="round"
            icon={<GoogleOutlined />}
            size="large"
          >
            Login with Google
          </Button>
          <Link to="/forgot/password" className="float-right terxt-danger">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
}
