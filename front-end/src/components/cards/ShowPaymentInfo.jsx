export function ShowPaymentInfo({ order, showStatus = true }) {
  return (
    <div>
      <p>
        <span>Order Id: {order.paymentIntent.id}</span>
        {" / "}
        <span>
          {" "}
          Amount:
          {(order.paymentIntent.amount / 100).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </span>
        {" / "}
        <span> Currency: {order.paymentIntent.currency.toUpperCase()}</span>
        {" / "}
        <span> METHOD: {order.paymentIntent.payment_method_types[0]}</span>
        {" / "}
        <span>
          {" "}
          ORDERED ON:{" "}
          {new Date(order.paymentIntent.created * 1000).toLocaleString()}
        </span>{" "}
        {"  "}
        <br />
        {showStatus && (
          <span className="badge bg-primary text-white">
            {" "}
            STATUS: {order.orderStatus}
          </span>
        )}
      </p>
    </div>
  );
}
