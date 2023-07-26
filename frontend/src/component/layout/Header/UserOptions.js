import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../actions/userAction';
import './Header.css';

// Backdrop component of material ui gives focus to SpeedDial
// Both SpeedDial and BackDrop have same 'open' state but zIndex varies
import Backdrop from '@mui/material/Backdrop'; 

import {SpeedDial} from '@mui/material';
import {SpeedDialAction} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


const UserOptions = ({user}) => {

    const {cartItems} = useSelector(state => state.cart); // store.js me cart name se reducer h

    const navigate = useNavigate();
    const alert = useAlert();
    const dispatch = useDispatch(); 

    const [open, setOpen] = useState(false);

    const options = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: account },
        { 
            icon: <ShoppingCartIcon style={{color: cartItems.length>0 ? "tomato" : "unset"}} />,
            name: `Cart(${cartItems.length})`, 
            func: cart },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
    ];

    if(user.role === "admin") { // admin ko dashboard option bhi de do
        options.unshift({icon: <DashboardIcon />, name: "Dashboard", func: dashboard})
    }

    function dashboard() {
        navigate('/admin/dashboard');
    }
    function orders() {
        navigate('/orders');
    }
    function account() {
        navigate('/account');
    }
    function cart() {
        navigate('/cart');
    }
    function logoutUser() {
        dispatch(logout()); 
        alert.success("Logout successfully");
        navigate('/');
    }

  return (
    <Fragment>
        <Backdrop open={open} style={{zIndex: "10"}} />
        <SpeedDial
            ariaLabel="SpeedDial tooltip example"
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            style={{ zIndex: "11" }}
            open={open}
            direction="down"
            className="speedDial"
            icon={
            <img
                className="speedDialIcon"
                src={user.avatar.url ? user.avatar.url : "/Profile.png"}
                alt="Profile"
            />
            }
        >
            {options.map((item) => ( // if we write like (item) => {}, then won't work
                <SpeedDialAction
                    key={item.name} 
                    icon={item.icon}
                    tooltipTitle={item.name}
                    onClick={item.func}
                    tooltipOpen={window.innerWidth<=600?true:false} // phone k case me true, else false (hover krne pe show ho toolTipTitle) 
                />
            ))}
        </SpeedDial>
    </Fragment>
  )
}

export default UserOptions;
