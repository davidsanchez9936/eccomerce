export const createOrUpdateUser = async (authtoken) => {
    return await fetch(
        `${import.meta.env.VITE_APP_API}/create-or-update-user`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                authtoken,
            },
        }
    );
};

export const currentUser = async (authtoken) => {
    return await fetch(
        `${import.meta.env.VITE_APP_API}/current-user`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                authtoken,
            },
        }
    );
};

export const currentAdmin = async (authtoken) => {
    return await fetch(
        `${import.meta.env.VITE_APP_API}/current-admin`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                authtoken,
            },
        }
    );
};