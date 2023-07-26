import axios from "axios";

import {ADD_TO_CART,REMOVE_CART_ITEM, SAVE_SHIPPING_INFO} from "../constants/cartConstants";

// ADD ITEMS TO CART
export const addItemsToCart = (id, quantity) => async (dispatch, getState) =>  { // we can access state using getState
    const {data} = await axios.get(`/api/v1/product/${id}`);


    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.product._id, // aise bhej rhe as cartReducer me product ko id ki trh use krre
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.Stock,
            quantity,
        }
    })

    // Reload krne par state empty hoti h, so store it in localStorage so that save ho jae 
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems))
};

// REMOVE FROM CART
export const removeItemsFromCart = (id) => async(dispatch, getState) => { // cartReducer me action.payload ki value ye 'id' hogi
    dispatch({
        type: REMOVE_CART_ITEM,
        payload: id,
    })

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
    
};

// SAVE_SHIPPING_INFO
export const saveShippingInfo = (data) => async(dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data,
    });

    localStorage.setItem("shippingInfo", JSON.stringify(data));
}