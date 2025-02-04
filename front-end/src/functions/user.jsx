export const userCart = async (cart, authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/user/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authtoken,
    },
    body: JSON.stringify({ cart }), // Enviar los datos como JSON
  });
};

export const getUserCart = async (authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/user/cart`, {
    method: "GET",
    headers: {
      authtoken,
    },
  });
};

export const emptyUserCart = async (authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/user/cart`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authtoken,
    },
    body: JSON.stringify({}),
  });
};

export const saveUserAddress = async (authtoken, address) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/user/address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authtoken,
    },
    body: JSON.stringify({ address }), // Enviar los datos como JSON
  });
};

export const applyCoupon = async (authtoken, coupon) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/user/cart/coupon`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authtoken,
    },
    body: JSON.stringify({ coupon }), // Enviar los datos como JSON
  });
};

export const createOrder = async (stripeResponse, authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/user/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authtoken,
    },
    body: JSON.stringify({ stripeResponse }), // Enviar los datos como JSON
  });
};

export const getUserOrders = async (authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/user/orders`, {
    method: "GET",
    headers: {
      authtoken,
    },
  });
};

export const getWishlist = async (authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/user/wishlist`, {
    method: "GET",
    headers: {
      authtoken,
    },
  });
};

export const removeWishlist = async (productId, authtoken) => {
  return await fetch(
    `${import.meta.env.VITE_APP_API}/user/wishlist/${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authtoken,
      },
    }
  );
};

/* export const addToWishlist = async (productId, authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/user/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authtoken,
    },
  });
}; */
export const addToWishlist = async (productId, authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/user/wishlist`, {
    // Cambia la URL
    method: "POST", // Asegúrate que sea POST
    headers: {
      "Content-Type": "application/json",
      authtoken,
    },
    body: JSON.stringify({ productId }), // Añade el body con productId
  });
};

export const createCashOrderForUser = async (
  authtoken,
  COD,
  couponTrueOrFalse
) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/user/cash-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authtoken,
    },
    body: JSON.stringify({
      couponApplied: couponTrueOrFalse,
      COD,
    }), // Enviar los datos como JSON
  });
};
