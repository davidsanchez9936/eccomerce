import { Link } from "react-router-dom";

export function UserNav() {
  return (
    <nav>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/user/history" className="nav-link">History</Link>
        </li>
      </ul>

      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/user/password" className="nav-link">Password</Link>
        </li>
      </ul>

      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/user/wishlist" className="nav-link">Wishlist</Link>
        </li>
      </ul>
    </nav>
  );
}
