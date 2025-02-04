import { useSelector, shallowEqual } from "react-redux";
import { LoadingToRedirect } from "./LoadingToRedirect.jsx";

export function UserRoute({ children, ...rest }) {
  const { user } = useSelector((state) => ({ user: state.user }), shallowEqual);

  return user && user.token ? (
    children
  ) : (
    <h1 className="text-danger">
      <LoadingToRedirect />
    </h1>
  );
}
