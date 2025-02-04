import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { signInWithEmailLink, updatePassword } from "firebase/auth";
import { auth } from "../../firebase.js";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrUpdateUser } from "../../functions/auth.js";

export function RegisterComplete({ history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => ({ ...state }));



  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForRegistration"));
    /* console.log(window.location.href);
    console.log(window.localStorage.getItem("emailForRegistration")); */
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //validation
    if (!email || !password) {
      toast.error("Email and password is required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be leatest 6 characters long");
      return;
    }

    try {
      const result = await signInWithEmailLink(
        auth,
        email,
        window.location.href
      );
      // Manejo del resultado exitoso
      if (result.user.emailVerified) {
        // remove user email for localstorage
        window.localStorage.removeItem("emailForRegistration");
        // get user id token
        console.log(result);
        let user = auth.currentUser;

        await updatePassword(user, password);
        const idTokenResult = await user.accessToken;
        // redux store
        console.log("user", user, "idTokenResult", idTokenResult);

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
              window.location.reload();
            navigate("/");
          })
          .catch((err) => console.log(err));

        // redirect
        // history.push("/");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      // Manejo del error
    }
  };

  const completeRegistrationForm = () => (
    <form onSubmit={handleSubmit}>
      <input type="email" className="form-control" value={email} disabled />
      <input
        type="password"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoFocus
      />
      <button type="submit" className="btn btn-raised">
        Complete Registration
      </button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register</h4>
          {completeRegistrationForm()}
        </div>
      </div>
    </div>
  );
}
