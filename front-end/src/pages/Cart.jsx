import React from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ProductCartInCheckout } from "../components/cards/ProductCartInCheckout";
import { userCart } from "../functions/user.jsx";

export function Cart() {
  const { user, cart } = useSelector((state) => ({ ...state }), shallowEqual);
  const dispatch = useDispatch();
  const location = useLocation(); // Obtener el objeto location
  const navigate = useNavigate();

  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const saveOrderToDb = () => {
    console.log(user);
    /* console.log("cart", JSON.stringify(cart, null, 4)); */
    userCart(cart, user.token)
      .then((res) => res.json())
      .then((data) => {
        console.log("CART POST DATA", data);
        if (data.ok) {
          navigate("/checkout");
        }
      })
      .catch((err) => console.log("cart save err", err));
  };

  // saveCashOrderToDb
  const saveCashOrderToDb = () => {
    dispatch({
      type: "COD",
      payload: true,
    });
    userCart(cart, user.token)
      .then((res) => res.json())
      .then((data) => {
        console.log("CART POST DATA", data);
        if (data.ok) {
          navigate("/checkout");
        }
      })
      .catch((err) => console.log("cart save err", err));
  };

  const showCartItems = () => {
    return (
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">Image</th>
            <th scope="col">Title</th>
            <th scope="col">Price</th>
            <th scope="col">Brand</th>
            <th scope="col">Color</th>
            <th scope="col">Count</th>
            <th scope="col">Shipping</th>
            <th scope="col">Remove</th>
          </tr>
        </thead>
        {cart.map((p) => (
          <ProductCartInCheckout key={p._id} p={p} />
        ))}
      </table>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          <h4>Cart / {cart.length}</h4>
          {!cart.length ? (
            <h4>
              No Products in cart. <Link to="/shop">Continue Shopping.</Link>
            </h4>
          ) : (
            showCartItems()
          )}
        </div>
        <div className="col-md-4">
          <h4>OrderSummary</h4>
          <hr />
          <p>Products</p>
          {cart.map((c, i) => (
            <div key={i}>
              <p>
                {c.title} x {c.count} = ${c.price * c.count}
              </p>
            </div>
          ))}
          <hr />
          Total: <b>${getTotal()}</b>
          <hr />
          {user ? (
            <>
              <button
                onClick={saveOrderToDb}
                className="btn btn-sm btn-primary mt-2"
                disabled={!cart.length}
              >
                Proced to Checkout
              </button>

              <br />

              <button
                onClick={saveCashOrderToDb}
                className="btn btn-sm btn-warning mt-2"
                disabled={!cart.length}
              >
                Pay Cash on Delivery
              </button>
            </>
          ) : (
            <button
              className="btn btn-sm btn-primary mt-2"
              style={{ backgroundColor: "#63F9F9 " }}
            >
              <Link
                to="/login"
                state={{ from: `/cart${location.search}` }} // Agregar la ruta actual
              >
                Login to Checkout
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
