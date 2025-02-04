export const getOrders = async (authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/admin/orders`, {
    method: "GET",
    headers: {
      authtoken,
    },
  });
};

export const changeStatus = async (orderId, orderStatus, authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/admin/orders-status`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      authtoken,
    },
    body: JSON.stringify({ orderId, orderStatus }),
  });
};
