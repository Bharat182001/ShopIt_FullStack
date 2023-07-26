import React, {useEffect, Fragment, useRef} from 'react'
import CheckoutSteps from './CheckoutSteps'
import { useSelector, useDispatch } from 'react-redux'
import MetaData from '../layout/MetaData'
import { Typography } from '@mui/material'
import { useAlert } from 'react-alert'
import {
  CardNumberElement, // like input tag which verifies that cardNumber is of 16 digits
  CardCvcElement, 
  CardExpiryElement,
  useStripe,
  useElements, 
} from "@stripe/react-stripe-js"

import axios from 'axios';
import './Payment.css';

import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useNavigate } from 'react-router-dom';
import { createOrder, clearErrors } from '../../actions/orderAction';


const Payment = () => {

  const navigate = useNavigate();

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();

  const payBtn = useRef(null);

  const {shippingInfo, cartItems} = useSelector((state) => state.cart);
  const {user} = useSelector((state) => state.user);
  const {error} = useSelector((state) => state.newOrder);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100), // stripe will take amount in paise, not rupees
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    payBtn.current.disabled=true; // We can access button's html property using refernce.current

    try {
      
      const config = {
        headers: {
          "Content-Type" : "application/json",
        },
      };

      const {data} = await axios.post(
        "/api/v1/payment/process",
        paymentData,
        config,
      );

      const client_secret = data.client_secret;

      if(!stripe || !elements) return; // they need to be present

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });

      if(result.error) {
        payBtn.current.disabled = false; // button will again be working

        alert.error(result.error.message);
      }
      else {
        if(result.paymentIntent.status === "succeeded") {
          // Place Order Here
          order.paymentInfo = { // as in backend orderModel has paymentInfo which has id and status
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          dispatch(createOrder(order));

          // Then navigate to /success
          navigate('/success');
        }
        else {
          alert.error("There's some issue while processing payment");
        }
      }


    } catch (error) {
      payBtn.current.disabled=false;
      alert.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if(error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  return (
  <Fragment>
    <MetaData title="Payment" />
    <CheckoutSteps activeStep={2} />

      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>

          <input
            type="submit"
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>

  </Fragment>
  )
}

export default Payment
