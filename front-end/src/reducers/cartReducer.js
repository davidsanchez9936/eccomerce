let initialState = []

//load card items from local storage
if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
        initialState = JSON.parse(localStorage.getItem("cart"))
    } else {
        initialState = [];
    }
}

// userReducer.js
export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_TO_CART":
            return action.payload;
        default:
            return state;
    }
};