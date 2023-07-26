import React, { Fragment } from 'react';
import "./Cart.css";
import CartItemCard from "./CartItemCard";
import { useSelector, useDispatch } from 'react-redux';
import { addItemsToCart, removeItemsFromCart } from '../../actions/cartAction';
import { MdRemoveShoppingCart } from 'react-icons/md';
import { Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';


const Cart = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const {cartItems} = useSelector((state) => state.cart); 


    const increaseQuantity = (id, quantity, stock) => {
        const newQty = quantity+1;
        if(stock<=quantity) return;
        dispatch(addItemsToCart(id, newQty));
    }

    const decreaseQuantity = (id, quantity) => {
        const newQty = quantity-1;
        if(quantity<=0) return;
        dispatch(addItemsToCart(id, newQty));
    }

    const deleteCardItems = (id) => {
        dispatch(removeItemsFromCart(id));
    }

    const checkoutHandler = () => {
      navigate("/login?redirect=shipping"); 
    }

  return (
    <Fragment>
      <MetaData title="Cart" />
        {cartItems.length === 0 ? (
            <div className="emptyCart">
                <MdRemoveShoppingCart />

                <Typography>No Product in Your Cart</Typography>
                <Link to="/products">View Products</Link>
            </div>
        ) : (
            <Fragment>
            <div className="cartPage">
                <div className="cartHeader">
                  <p>Product</p>
                  <p>Quantity</p>
                  <p>Subtotal</p>
                </div>
    
                {cartItems && cartItems.map((item) => (
                    <div className="cartContainer" key={item.product}>
                        <CartItemCard item={item} deleteCardItems={deleteCardItems} />
                        <div className="cartInput">
                            <button onClick={() => decreaseQuantity(item.product, item.quantity)}>-</button>
                            <input type="number" value={item.quantity} readOnly />
                            <button onClick={() => increaseQuantity(item.product, item.quantity, item.stock)} >+</button>
                        </div>
                        <p className="cartSubtotal">{`₹${item.price * item.quantity}`}</p>
                    </div>
                ))}
    
                <div className="cartGrossTotal">
                  <div></div>
                  <div className="cartGrossTotalBox">
                    <p>Gross Total</p>
                    <p>{`₹${cartItems.reduce( // reduce function calls the callbackfn function one time for each element in the array
                      (acc, item) => acc + item.quantity*item.price,
                      0
                    )}`}</p>
                  </div>
                  <div></div>
                  <div className="checkOutBtn">
                    <button onClick={checkoutHandler} >Check Out</button>
                  </div>
                </div>
    
            </div>
        </Fragment>
        )}
    </Fragment>
  )
}

export default Cart
