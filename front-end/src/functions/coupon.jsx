export const getCoupons = async () => {
  return await fetch(`${import.meta.env.VITE_APP_API}/coupons`, {
    method: "GET",
  });
};

export const removeCoupon = async (couponId, authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/coupons/${couponId}`, {
    method: "DELETE",
    headers: {
      authtoken,
    },
  });
};

export const createCoupon = async (coupon, authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/coupon`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authtoken,
    },
    body: JSON.stringify({ coupon }),
  });
};
