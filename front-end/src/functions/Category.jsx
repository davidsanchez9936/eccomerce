export const getCategories = async () => {
  return await fetch(`${import.meta.env.VITE_APP_API}/categories`, {
    method: "GET",
  });
};

export const getCategory = async (slug) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/category/${slug}`, {
    method: "GET",
  });
};

export const removeCategory = async (slug, authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/category/${slug}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      authtoken,
    },
  });
};

export const updateCategory = async (slug, category, authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/category/${slug}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      authtoken,
    },
    body: JSON.stringify(category), // Enviar los datos como JSON en el cuerpo de la solicitud
  });
};

export const createCategory = async (category, authtoken) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authtoken,
    },
    body: JSON.stringify(category), // Enviar los datos como JSON
  });
};

export const getCategorySubs = async (_id) => {
  return await fetch(`${import.meta.env.VITE_APP_API}/category/subs/${_id}`, {
    method: "GET",
  });
};
