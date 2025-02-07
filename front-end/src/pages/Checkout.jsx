import { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyCoupon,
  createCashOrderForUser,
} from "../functions/user";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

export function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState("");
  //discount price
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const { user, COD } = useSelector((state) => ({ ...state }), shallowEqual);
  const couponTrueOrFalse = useSelector((state) => state.coupon, shallowEqual);

  useEffect(() => {
    getUserCart(user.token)
      .then((res) => res.json())
      .then((data) => {
        console.log("user cart res ", JSON.stringify(data, null, 4));
        setProducts(data.products);
        setTotal(data.cartTotal);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user.token]);

  const emptyCart = () => {
    // remove from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    // remove from redux
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    //remove from backend
    emptyUserCart(user.token)
      .then((res) => res.json())
      .then((data) => {
        setProducts([]);
        setTotal(0);
        setTotalAfterDiscount(0);
        setCoupon("");
        toast.success("Cart is empty. Continue shopping.");
      });
  };

  const saveAddressToDb = () => {
    /* console.log(address); */
    saveUserAddress(user.token, address)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setAddressSaved(true);
          toast.success("Address saved");
        }
      });
  };

  const applyDiscountCoupon = () => {
    console.log("send coupon to backend", coupon);
    applyCoupon(user.token, coupon)
      .then((res) => res.json())
      .then((data) => {
        console.log("RES ON COUPON APPLIED", data);
        if (data) {
          setTotalAfterDiscount(data);
          // push the totalAfterDiscount to redux true/false
          dispatch({
            type: "COUPON_APPLIED",
            payload: true,
          });
        }
        //error
        if (data.err) {
          setDiscountError(data.err);
          // update redux coupon applied
          dispatch({
            type: "COUPON_APPLIED",
            payload: false,
          });
        }
      });
  };

  const showAddress = () => {
    return (
      <>
        <ReactQuill theme="snow" value={address} onChange={setAddress} />
        <br />
        <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
          Save
        </button>
      </>
    );
  };

  const showProductSummary = () =>
    products.map((p, i) => (
      <div key={i}>
        <p>
          {p.product.title} ({p.product.color}) x {p.count} ={" "}
          {p.product.price * p.count}
        </p>
      </div>
    ));

  const showApplyCoupon = () => {
    return (
      <>
        <input
          onChange={(e) => {
            setCoupon(e.target.value);
            setDiscountError("");
          }}
          value={coupon}
          type="text"
          className="form-control"
        />
        <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">
          Apply
        </button>
      </>
    );
  };

  const createCashOrder = () => {
    createCashOrderForUser(user.token, COD, couponTrueOrFalse)
      .then((res) => res.json())
      .then((data) => {
        console.log("USER CASH ORDER CREATED RES ", data);
        // empty cart from redux, localStorage, reset coupon, reset COD, redirect
        if (data.ok) {
          // empty local storage
          if (typeof window !== "undefined") {
            localStorage.removeItem("cart");
          }
          // empty redux cart
          dispatch({
            type: "ADD_TO_CART",
            payload: [],
          });
          // empty redux coupon
          dispatch({
            type: "COUPON_APPLIED",
            payload: false,
          });
          // empty redux COD
          dispatch({
            type: "COD",
            payload: [],
          });
          //empty cart from backend
          emptyUserCart(user.token);
          // redirect
          setTimeout(() => {
            navigate("/user/history");
          }, 1000);
        }
      });
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        {showAddress()}
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        <br />
        {showApplyCoupon()}
        <br />
        {discountError && <p className="bg-danger p-2">{discountError}</p>}
      </div>

      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>Products {products.length}</p>
        <hr />

        {showProductSummary()}

        <hr />
        <p>Cart Total: ${total}</p>

        {totalAfterDiscount > 0 && (
          <p className="bg-success p-2">
            Discount Applied: Total Payable: ${totalAfterDiscount}
          </p>
        )}

        <div className="row">
          <div className="col-md-6">
            {COD ? (
              <button
                className="btn btn-primary"
                disabled={!addressSaved || !products.length}
                onClick={createCashOrder}
              >
                Place Order
              </button>
            ) : (
              <button
                className="btn btn-primary"
                disabled={!addressSaved || !products.length}
                onClick={() => navigate("/payment")}
              >
                Place Order
              </button>
            )}
          </div>

          <div className="col-md-6">
            <button
              disabled={!products.length}
              onClick={emptyCart}
              className="btn btn-primary"
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
