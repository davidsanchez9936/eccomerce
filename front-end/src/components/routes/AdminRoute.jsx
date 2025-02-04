import { useSelector, shallowEqual } from "react-redux";
import { Navigate } from "react-router-dom";
import { LoadingToRedirect } from "./LoadingToRedirect.jsx";
import { currentAdmin } from "../../functions/auth.js";
import { useEffect, useState } from "react";

export function AdminRoute({ children, ...rest }) {
  const { user } = useSelector((state) => ({ user: state.user }), shallowEqual);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => res.json())
        .then((data) => {
          console.log("CURRENT ADMIN RES", data);
          setOk(true);
        })
        .catch((err) => {
          console.log("ADMIN ROUTE ERR", err);
          setOk(false);
        });
    }
  }, [user]);
  

  return ok ? (
    children
  ) : (
    <h1 className="text-danger">
      <LoadingToRedirect />
    </h1>
  );
}
