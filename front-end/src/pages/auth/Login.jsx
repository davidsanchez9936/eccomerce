import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.js";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "antd";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { GoogleAuthProvider } from "firebase/auth";
import { createOrUpdateUser } from "../../functions/auth.js";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Obtener el objeto location
  const provider = new GoogleAuthProvider();

  const { user } = useSelector((state) => ({ user: state.user }), shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    let intended = location.state?.from;
    if (intended) {
      return
    } else {
      if (user && user.token) {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const roleBasedRedirect = (data) => {
    // check if intended
    let intended = location.state?.from; // Acceder a la propiedad 'from' de location.state
    if (intended) {
      navigate(intended);
    } else {
      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/history");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
      createOrUpdateUser(idTokenResult.token)
        .then((res) => res.json())
        .then((data) => {
          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              name: data.name,
              email: data.email,
              token: idTokenResult.token,
              role: data.role,
              _id: data._id,
            },
          });
          roleBasedRedirect(data);
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
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
      createOrUpdateUser(idTokenResult.token)
        .then((res) => res.json())
        .then((data) => {
          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              name: data.name,
              email: data.email,
              token: idTokenResult.token,
              role: data.role,
              _id: data._id,
            },
          });
          roleBasedRedirect(data);
          navigate("/");
        })
        .catch((err) => console.log(err));
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
          <Link to="/forgot/password" className="float-right text-danger">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
}
