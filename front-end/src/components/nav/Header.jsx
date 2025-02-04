import { useState } from "react";
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Menu, Badge } from "antd";

import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase.js";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Search } from "../forms/Search.jsx";

export function Header() {
  const [current, setCurrent] = useState("");
  const dispatch = useDispatch();
  const { user, cart } = useSelector((state) => ({ ...state }), shallowEqual);
  const navigate = useNavigate();

  const handleClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  const logout = async (e) => {
    try {
      await auth.signOut();
      dispatch({ type: "LOGOUT", payload: null });
      dispatch({ type: "RESET_USER_STATE" });
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const items = [
    {
      label: (
        <span className="nav-bar-container-home">
          <AppstoreOutlined />
          <span>
            <Link to="/">Home</Link>
          </span>
        </span>
      ),
      key: "home",
    },
    {
      label: (
        <span className="nav-bar-container-home">
          <ShoppingOutlined />
          <span>
            <Link to="/shop">Shop</Link>
          </span>
        </span>
      ),
      key: "shop",
    },
    {
      label: (
        <span className="nav-bar-container-home">
          <ShoppingCartOutlined />
          <span>
            <Link to="/cart">
              <Badge count={cart.length} offset={9.0}>Cart</Badge>
            </Link>
          </span>
        </span>
      ),
      key: "cart",
    },
    {
      label: (
        <span className="form-control">
          <Search />
        </span>
      ),
      key: "search",
    },
    user && {
      label: (
        <span >
          <SettingOutlined />
          <span>{user.name && user.name.split("@")[0]}</span>
        </span>
      ),
      key: "settings",
      children: [
        user &&
          user.role === "admin" && {
            label: <Link to="/admin/dashboard">Dashboard</Link>,
            key: "setting:2",
          },
        user &&
          user.role === "subscriber" && {
            label: <Link to="/user/history">Dashboard</Link>,
            key: "setting:3",
          },
        {
          label: (
            <span onClick={logout}>
              <LogoutOutlined />
              <span>Logout</span>
            </span>
          ),
          key: "setting:4",
        },
      ],
    },
    !user && {
      label: (
        <div className="nav-bar-container">
          <UserAddOutlined />
          <span>
            <Link to="/register">Register</Link>
          </span>
        </div>
      ),
      key: "register",
    },
    !user && {
      label: (
        <div className="nav-bar-container">
          <UserOutlined />
          <span>
            <Link to="login">Login</Link>
          </span>
        </div>
      ),
      key: "login",
    },
  ].filter(Boolean);

  return (
    <div className="nav-bar-container">
      <Menu
        onClick={handleClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />
    </div>
  );
}
