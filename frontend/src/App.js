import "./App.css";
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import React, { useState, useEffect } from "react";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import Payment from "./component/Cart/Payment";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/admin/Dashboard.js";
import ProductList from "./component/admin/ProductList";
import NewProduct from "./component/admin/NewProduct";
import UpdateProduct from "./component/admin/UpdateProduct.js";
import OrderList from "./component/admin/OrderList.js";
import UsersList from "./component/admin/UsersList";
import ProcessOrder from "./component/admin/ProcessOrder";
import UpdateUser from "./component/admin/UpdateUser";
import ProductReviews from "./component/admin/ProductReviews";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import About from "./component/layout/About/About";
import Contact from "./component/layout/Contact/Contact";
import NotFound from "./component/layout/NotFound/NotFound";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser()); // another way of using dispatch

    getStripeApiKey();
  }, []);

  // So that people can't right click on website
  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Header />

      {isAuthenticated===true && <UserOptions user={user} />}

      <Routes>
        {stripeApiKey && isAuthenticated && (
          <Route
            exact
            path="/process/payment"
            element={
              <Elements stripe={loadStripe(stripeApiKey)}>
                <Payment />
              </Elements>
            }
          />
        )}
        
        <Route exact path="/" element={<Home />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />

        <Route exact path="/search" element={<Search />} />

        <Route exact path="/about" element={<About />} />

        <Route exact path="/contact" element={<Contact />} />

        {isAuthenticated===true && (
          <Route exact path="/account" element={<Profile />} />
        )}

        {isAuthenticated && (
          <Route exact path="/me/update" element={<UpdateProfile />} />
        )}

        {isAuthenticated && (
          <Route exact path="/password/update" element={<UpdatePassword />} />
        )}

        <Route exact path="/password/forgot" element={<ForgotPassword />} />

        <Route
          exact
          path="/password/reset/:token"
          element={<ResetPassword />}
        />

        <Route exact path="/login" element={<LoginSignUp />} />

        <Route exact path="/cart" element={<Cart />} />

        {isAuthenticated && (
          <Route exact path="/shipping" element={<Shipping />} />
        )}

        {isAuthenticated && (
          <Route exact path="/success" element={<OrderSuccess />} />
        )}

        {isAuthenticated && (
          <Route exact path="/orders" element={<MyOrders />} />
        )}

        {isAuthenticated && (
          <Route exact path="/order/confirm" element={<ConfirmOrder />} />
        )}

        {isAuthenticated && (
          <Route exact path="/order/:id" element={<OrderDetails />} />
        )}

        {/* Dashboard Routes  */}
        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/dashboard" element={<Dashboard />} />
        )}

        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/products" element={<ProductList />} />
        )}

        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/product" element={<NewProduct />} />
        )}

        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/product/:id" element={<UpdateProduct />} />
        )}

        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/orders" element={<OrderList />} />
        )}

        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/order/:id" element={<ProcessOrder />} />
        )}

        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/users" element={<UsersList />} />
        )}

        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/user/:id" element={<UpdateUser />} />
        )}

        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/reviews" element={<ProductReviews />} />
        )}

        <Route exact path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
