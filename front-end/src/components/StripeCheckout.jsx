import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { createPaymentIntent } from "../functions/stripe.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "antd";
import { DollarOutlined, CheckOutlined } from "@ant-design/icons";
import laptop from "./laptop.jpg";
import { createOrder, emptyUserCart } from "../functions/user.jsx";

export function StripeCheckout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, coupon } = useSelector((state) => ({ ...state }), shallowEqual);

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const [cartTotal, setCartTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [payable, setPayable] = useState(0);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    createPaymentIntent(user.token, coupon)
      .then((res) => res.json())
      .then((data) => {
        console.log("create payment intent", data.clientSecret);
        setClientSecret(data.clientSecret);
        //aditional response received on successful payment
        setCartTotal(data.cartTotal);
        setTotalAfterDiscount(data.totalAfterDiscount);
        setPayable(data.payable);
      })
      .catch((err) => {
        console.log("payment intent error:", err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value,
        },
      },
    });
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      // here you get result after succesful payment
      // create order and save in database for admin to process
      createOrder(payload, user.token)
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            // empty cart from  local storage
            if (typeof window !== "undefined") localStorage.removeItem("cart");
            // empty cart from redux
            dispatch({
              type: "ADD_TO_CART",
              payload: [],
            });
            // reset coupon to  false
            dispatch({
              type: "COUPON_APPLIED",
              payload: false,
            });
            // empty cart from database
            emptyUserCart(user.token);
          }
        });
      // empty user cart from redux store and local store
      console.log(JSON.stringify(payload, null, 4));
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  const handleChange = async (e) => {
    // listen for changes in the card element
    // and display any errors as the customer types their card details
    setDisabled(e.empty); // disable pay button if errors
    setError(e.error ? e.error.message : ""); // show errormessage
  };

  const cartStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <>
      {!succeeded && (
        <div>
          {coupon && totalAfterDiscount !== undefined ? (
            <p className="alert alert-success">{`Total after discount: ${totalAfterDiscount}`}</p>
          ) : (
            <p className="alert alert-danger">No coupon aplied</p>
          )}
        </div>
      )}
      <div className="text-center pb-5">
        <Card
          cover={
            <img
              src={laptop}
              style={{
                height: "200px",
                objectFit: "cover",
                marginBottom: "-50px",
              }}
            />
          }
          actions={[
            <>
              <DollarOutlined className="text-info" /> <br />
              Total : ${cartTotal}
            </>,
            <>
              <CheckOutlined className="text-info" /> <br />
              Total payable : ${(payable / 100).toFixed(2)}
            </>,
          ]}
        />
      </div>

      <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
        <CardElement
          id="card-element"
          options={cartStyle}
          onChange={handleChange}
        />
        <button
          className="stripe-button"
          disabled={processing || disabled || succeeded}
        >
          <span id="button-text">
            {processing ? <div className="spinner" id="spinner"></div> : "Pay"}
          </span>
        </button>
      </form>
      <br />
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
      <p className={succeeded ? "result-message" : "result-message hidden"}>
        Payment Successful.
        <Link to="/user/history"> See it in purchase history.</Link>
      </p>
    </>
  );
}

/* back-end                                                                                                                                              MONGODB=hFJcqql16oTnervh CLOUDINARY_CLOUD_NAME=dz5uvvwme CLOUDINARY_API_KEY=717636832233186 CLOUDINARY_API_SECRET=OOl32YKV9SFQyAdj4OJ9sYgL2YU  STRIPE_SECRET=sk_test_51Qf9dFIYWjZ6TMbMSNqfFgt0mOAN24tHHqW7y7zmebz0FJHkQkv4Nu8fZOZz0UtFamyCBSl9d0w1FfAljcNYN1rz00JK8cwYTC  const User = require("../models/user.js") const Cart = require("../models/cart.js") const Product = require("../models/product.js") const Coupon = require("../models/coupon.js") const stripe = require("stripe")(process.env.STRIPE_SECRET);  exports.createPaymentIntent = async (req, res) => {     // later apply coupon     // later calculate price      const paymentIntent = await stripe.paymentIntents.create({         amount: 100,         currency: "usd",      })     res.send({         clientSecret: paymentIntent.client_secret,     }) }  const express = require("express") const router = express.Router()  const {     createPaymentIntent } = require("../controllers/stripe.js")  const {     authCheck } = require("../middlewares/auth.js")  router.post("/crerate-payment-intent", authCheck, createPaymentIntent)  module.exports = router;                                     front-end                                                                                                                                     export const createPaymentIntent = async (authtoken) => {     return await fetch(`${import.meta.env.VITE_APP_API}/crerate-payment-intent`, {       method: "POST",       headers: {         "Content-Type": "application/json",         authtoken,       },     });   };   import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"; import { useSelector, useDispatch, shallowEqual } from "react-redux"; import { createPaymentIntent } from "../functions/stripe.jsx"; import { useNavigate } from "react-router-dom"; import { useEffect, useState } from "react";  export function StripeCheckout() {   const navigate = useNavigate();   const { user } = useSelector((state) => ({ ...state }), shallowEqual);    const [succeeded, setSucceeded] = useState(false);   const [error, setError] = useState(null);   const [processing, setProcessing] = useState("");   const [disabled, setDisabled] = useState(true);   const [clientSecret, setClientSecret] = useState("");    const stripe = useStripe();   const elements = useElements();    useEffect(() => {     createPaymentIntent(user.token)       .then((res) => res.json())       .then((data) => {         console.log("create payment intent", data);         setClientSecret(data);       })       .catch((err) => {         console.log("payment intent error:", err);       });   }, []);    const handleSubmit = async (e) => {     //   };    const handleChange = async (e) => {     //   };    const cartStyle = {     style: {       base: {         color: "#32325d",         fontFamily: "Arial, sans-serif",         fontSmoothing: "antialiased",         fontSize: "16px",         "::placeholder": {           color: "#32325d",         },       },       invalid: {         color: "#fa755a",         iconColor: "#fa755a",       },     },   };    return (     <>       <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>         <CardElement           id="card-element"           options={cartStyle}           onChange={handleChange}         />         <button           className="stripe-button"           disabled={processing || disabled || succeeded}         >           <span id="button-text">             {processing ? <div classNane="spinner" id="spinner"></div> : "Pay"}           </span>         </button>       </form>     </>   ); }  import { loadStripe } from "@stripe/stripe-js"; import { Elements } from "@stripe/react-stripe-js"; import { StripeCheckout } from "../components/StripeCheckout.jsx";  // load stripe outside of components render to avoid recreating stripe object on every render  export function Payment() {   const promise = loadStripe(import.meta.env.VITE_APP_STRIPE_KEY);    return (     <div className="container p-5 text-center">       <h4>Complete your purchase</h4>       <Elements stripe={promise}>         <div className="col-md-8 offset-md-2">           <StripeCheckout />         </div>       </Elements>     </div>   ); }                                                                                                                                        el console.log("create payment intent", data); muestra el dato                  create payment intent {clientSecret: 'pi_3QgSfGIYWjZ6TMbM1GEZXClt_secret_X0Mre3liikQs2u23kanflaeXb'} y obtengo los siguientes errores... arregla mi codigo.  */
