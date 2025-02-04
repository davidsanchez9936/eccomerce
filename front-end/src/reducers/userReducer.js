// userReducer.js
export const userReducer = (state = null, action) => {
    switch (action.type) {
      case "LOGGED_IN_USER":
        return action.payload;
      case "LOGOUT":
        return null;
      case "RESET_USER_STATE":
        return null; // Restablecer el estado a null
      default:
        return state;
    }
  };