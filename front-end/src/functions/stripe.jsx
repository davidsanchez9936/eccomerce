export const createPaymentIntent = async (authtoken, coupon) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/create-payment-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authtoken,
    },
    // Añadir el body con el cupón
    body: JSON.stringify({
      couponApplied: coupon
    }),
  });
};