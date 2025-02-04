export const getSubs = async () => {
    return await fetch(`${import.meta.env.VITE_APP_API}/subs`, {
      method: "GET",
    });
  };
  
  export const getSub = async (slug) => {
    return await fetch(`${import.meta.env.VITE_APP_API}/sub/${slug}`, {
      method: "GET",
    });
  };
  
  export const removeSub = async (slug, authtoken) => {
    return await fetch(`${import.meta.env.VITE_APP_API}/sub/${slug}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        authtoken,
      },
    });
  };
  
  export const updateSub = async (slug, sub, authtoken) => {
    return await fetch(`${import.meta.env.VITE_APP_API}/sub/${slug}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        authtoken,
      },
      body: JSON.stringify(sub), // Enviar los datos como JSON en el cuerpo de la solicitud
    });
  };
  
  export const createSub = async (sub, authtoken) => {
    return await fetch(`${import.meta.env.VITE_APP_API}/sub`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authtoken,
      },
      body: JSON.stringify(sub), // Enviar los datos como JSON
    });
  };
  