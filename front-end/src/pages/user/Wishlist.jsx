import { useEffect, useState } from "react";
import { UserNav } from "../../components/nav/UserNav.jsx";
import { getWishlist, removeWishlist } from "../../functions/user.jsx";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";

export function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useSelector((state) => ({ user: state.user }), shallowEqual);

  useEffect(() => {
    loadWishlist([]);
  }, []);

  const loadWishlist = () => {
    getWishlist(user.token)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.list.wishlist);
        setWishlist(data.list.wishlist);
      });
  };

  const handleRemove = (productId) => {
    removeWishlist(productId, user.token)
      .then((res) => res.json())
      .then((data) => {
        loadWishlist();
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          <h4>Wishlist</h4>
          {wishlist.map((p) => (
            <div key={p._id} className="alert alert-secondary">
              <Link to={`/product/${p.slug}`}>{p.title}</Link>
              <span
                onClick={() => handleRemove(p._id)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger"/>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
