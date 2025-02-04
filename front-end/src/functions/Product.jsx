export const createProduct = async (product, authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authtoken,
    },
    body: JSON.stringify(product), // Enviar los datos como JSON
  });
};

export const getProductsByCount = async (count) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/products/${count}`, {
    method: "GET",
  });
};

export const removeProduct = async (slug, authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/product/${slug}`, {
    method: "DELETE",
    headers: {
      authtoken,
    },
  });
};

export const getProduct = async (slug) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/product/${slug}`, {
    method: "GET",
  });
};

export const updateProduct = async (slug, product, authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/product/${slug}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      authtoken,
    },
    body: JSON.stringify(product), // Enviar los datos como JSON en el cuerpo de la solicitud
  });
};

export const getProducts = async (sort, order, page) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sort, order, page }),
  });
};

export const getProductsCount = async () => {
  return await fetch(`${import.meta.env.VITE_APP_API}/products/total`, {
    method: "GET",
  });
};

export const productStar = async (productId, star, authtoken) => {
  return await fetch(
    `${import.meta.env.VITE_APP_API}/product/star/${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        authtoken,
      },
      body: JSON.stringify({ star }), // Enviar los datos como JSON en el cuerpo de la solicitud
    }
  );
};

export const getRelated = async (productId) => {
  return await fetch(
    `${import.meta.env.VITE_APP_API}/product/related/${productId}`,
    {
      method: "GET",
    }
  );
};

export const fetchProductsByFilter = async (arg) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/search/filters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
    
  });
};