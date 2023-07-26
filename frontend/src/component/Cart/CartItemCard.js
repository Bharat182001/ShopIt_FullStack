import React from 'react';
import './CartItemCard.css';
import { Link } from 'react-router-dom';

const CartItemCard = ({item, deleteCardItems}) => { // item.product works here as an id
  return (
    <div className='CartItemCard'>
        <img src={item.image} alt="ssa" />
        <div>
            <Link to={`/product/${item.product}`}>{item.name}</Link>
            <span>{`Price: ₹${item.price}`}</span>
            <p onClick={() => deleteCardItems(item.product)} >Remove</p> 
        </div>
    </div>
  )
}

export default CartItemCard
