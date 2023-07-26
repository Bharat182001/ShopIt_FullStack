import React, { Fragment, useRef, useState, useEffect } from 'react'
import './LoginSignUp.css';
import Loader from '../layout/Loader/Loader';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import FaceIcon from '@mui/icons-material/Face';

import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, login, register } from '../../actions/userAction';
import { useAlert } from 'react-alert';

const LoginSignUp = () => {

    const dispatch = useDispatch(); // jab form submit ho tb call krna h (no need of useEffect here)
    const alert = useAlert();

    const navigate = useNavigate();
    const location = useLocation();

    const {error, loading, isAuthenticated} = useSelector(state => state.user);

    const loginTab = useRef(null); // we can't use DOM elements directly in ReactJS, so use useRef Hook to do that
    const registerTab = useRef(null);
    const switcherTab = useRef(null);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user, setUser] = useState({
        name: "",
        email: '',
        password: ""
    });

    const {name, email, password} = user;
    const [avatar, setAvatar] = useState("/Profile.png");
    const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

    const loginSubmit = (e) => {
        e.preventDefault();
        dispatch(login(loginEmail, loginPassword))
    }
    
    const registerSubmit = (e) => {
        e.preventDefault();
        
        const myForm = new FormData();
        
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("password", password);
        myForm.set("avatar", avatar);

        dispatch(register(myForm));
    }

    const registerDataChange = (e) => {
        if(e.target.name === "avatar") {
            const reader = new FileReader();

            reader.onload = () => {
                if(reader.readyState === 2) { // 0:initial, 1:processing, 2:done (uploading image)
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            } 

            reader.readAsDataURL(e.target.files[0]);
        }
        else {
            setUser({ ...user, [e.target.name]: e.target.value }); // name, email, password me name, email, password ki value form set dhoondke set krega
        }
    }

    const redirect = location.search ? `/${location.search.split('=')[1]}` : "/account";


    useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if(isAuthenticated) {
            // go to user ka account(Profile) page if user gets logged in
            navigate(redirect); 
        }

    }, [dispatch, error, alert, navigate, isAuthenticated, redirect]);

    const switchTabs = (e, tab) => {
        if(tab === "login") {
            switcherTab.current.classList.add("shiftToNeutral");
            switcherTab.current.classList.remove("shiftToRight");

            registerTab.current.classList.remove("shiftToNeutralForm");
            loginTab.current.classList.remove("shiftToLeft");
        }
        if(tab === "register") {
            switcherTab.current.classList.add("shiftToRight");
            switcherTab.current.classList.remove("shiftToNeutral");

            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add("shiftToLeft");    
        }
    }


  return (
    <Fragment>
        {loading ? (<Loader />) : (
            <Fragment>
                <div className="LoginSignUpContainer">
                    <div className="LoginSignUpBox">
                        <div>
                            <div className="login_signUp_toggle">
                                <p onClick={(e)=> switchTabs(e, "login")}>LOGIN</p>
                                <p onClick={(e)=> switchTabs(e, "register")}>REGISTER</p>
                            </div>
                            <button ref={switcherTab}></button>
                        </div>
                        <form className='loginForm' ref={loginTab} onSubmit={loginSubmit}>
                            <div className="loginEmail">
                                <MailOutlinedIcon />
                                <input 
                                    type="email" 
                                    placeholder='Email' 
                                    required 
                                    value={loginEmail} 
                                    onChange={(e)=> setLoginEmail(e.target.value)}    
                                />
                            </div>
                            <div className="loginPassword">
                                <LockOpenOutlinedIcon />
                                <input
                                    type="password" 
                                    placeholder='Password'
                                    required
                                    value={loginPassword}
                                    onChange={(e)=> setLoginPassword(e.target.value)}
                                />
                            </div>
                            <Link to="/password/forgot" >Forgot Password ?</Link>
                            <input type="submit" value="Login" className='loginBtn' />
                        </form>
        
                        <form 
                            className="signUpForm"
                            ref={registerTab}
                            encType="multipart/form-data" // as we also would be uploading images of user through this form only
                            onSubmit={registerSubmit}
                        >
                            <div className="signUpName">
                                <FaceIcon />
                                <input 
                                    type="text" 
                                    placeholder='Name' 
                                    required 
                                    name='name'
                                    value={name} 
                                    onChange={registerDataChange}    
                                />                        
                            </div>
                            <div className="signUpEmail">
                                <MailOutlinedIcon />
                                <input
                                    type="email" 
                                    placeholder='Email'
                                    required
                                    name='email'
                                    value={email}
                                    onChange={registerDataChange}
                                />
                            </div>
                            <div className="signUpPassword">
                                <LockOpenOutlinedIcon />
                                <input
                                    type="password" 
                                    placeholder='Password'
                                    required
                                    name='password'
                                    value={password}
                                    onChange={registerDataChange}
                                />
                            </div>
        
                            <div id="registerImage">
                                <img src={avatarPreview} alt="Avatar Preview" />
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={registerDataChange}
                                />
                            </div>
                            <input 
                                type="submit" 
                                value="Register" 
                                className="signUpBtn"
                            />
                        </form>
                    </div>
                </div>
            </Fragment>
        )}
    </Fragment>
  )
}

export default LoginSignUp
