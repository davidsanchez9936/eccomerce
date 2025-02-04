import { toast } from "react-toastify";
import { UserNav } from "../../components/nav/UserNav.jsx";
import { auth } from "../../firebase.js";
import { useState } from "react";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

export function Password() {
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Obtener las credenciales actuales del usuario
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );

      // Reautenticar al usuario con sus credenciales actuales
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Actualizar la contraseña
      await updatePassword(auth.currentUser, password);
      setLoading(false);
      toast.success("Password updated");
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  const passwordUpdateForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Current Password</label>
          <hr />
          <input
            type="password"
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="form-control"
            placeholder="Enter current password"
            disabled={loading}
          />
        </div>
        <hr />
        <div className="form-group">
          <label>New Password</label>
          <hr />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Enter new password"
            disabled={loading}
          />
          <hr />
          <button
            className="btn btn-primary"
            disabled={
              !password || !currentPassword || password.length < 6 || loading
            }
          >
            Submit
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Password Update</h4>
          )}
          {passwordUpdateForm()}
        </div>
      </div>
    </div>
  );
}
