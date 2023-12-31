import {ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO} from "../constants/cartConstants";

export const cartReducer = (state = {cartItems: [], shippingInfo: {}}, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const item = action.payload;
            
            const isItemExist = state.cartItems.find(
                (i) => i.product === item.product
            );

            if(isItemExist) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((i) =>  // replace kr do if item exist already in cart
                        i.product === isItemExist.product ? item : i
                    ),
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item], // we want to add item in cartItems array

                }
            }
            
        case REMOVE_CART_ITEM:
            return {
                ...state,
                // action.payload me jo id bheji h usko chhodke baaki saare rkh lega cartItems me
                cartItems: state.cartItems.filter((i) => i.product !== action.payload), 
            }
        
        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload,
            }

        default:
            return state;
    }
}