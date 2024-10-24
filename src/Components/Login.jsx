import React, { useContext, useEffect, useRef, useState } from 'react'
import loginStyle from './Login.module.css'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import axios from 'axios';
import { json, useNavigate } from 'react-router-dom';
import { AppContext } from './AppProvider';
// import jwt_decode from 'jwt-decode';

const Login = () => {
    let {getUserFromLogin, sendNavState, user} = useContext(AppContext)

    let[mode, setMode] = useState("Username")
    let[formData, setFormData] = useState({loginMode:'Username', identifier:'', Password:''})
    let[error, setError] = useState()
    let[identifierClicked, setIdentifierClicked] = useState(false)
    let[passwordClicked, setPasswordClicked] = useState(false)
    let[isPassword, setIsPassword] = useState(true)
    let[identifierAbsent, setIdentifierAbsent] = useState(false)
    let[passwordAbsent, setPasswordAbsent] = useState(false)
    // set[easyLogoutVisible, setEasyLogoutVisible] = useState(false)
    //& when going back to login or signup pages by clicking the direction buttons in the browser, causing problem. to avoid that use a easy logout component for that

    let navigateToNewses = useNavigate()
    let navigateToSignup = useNavigate()

    let updateFormData = ({target:{name, value}}) => {
        setFormData({...formData, [name]:value.trim()})
    }

    let displayInput = (input) => {
        setError()
        if(input === 'identifier'){
            setIdentifierClicked(true)
            setIdentifierAbsent(false)
        }else if(input === 'password'){
            setPasswordClicked(true)
            setPasswordAbsent(false)
        }
    }

    let changeMode = (mode) => {
        if(mode === 'Email'){
            setMode('Email')
            sessionStorage.setItem('loginMode', "Email")
        }else if(mode === 'Username'){
            setMode('Username')
            sessionStorage.setItem('loginMode', "Username")
        }else if(mode === 'Phone Number'){
            setMode('Phone Number')
            sessionStorage.setItem('loginMode', "Phone Number")
        }
        
    }
    
    let updateIsPassword = () => {
        setIsPassword(!isPassword)
    }

    let loginSubmit = async(e) => {
        console.log('Frontend login attempt:', formData);
        e.preventDefault()
        try {
            if(!formData.identifier && !formData.Password){
                setIdentifierAbsent(true)
                setPasswordAbsent(true)
            }else if(!formData.identifier){
                setIdentifierAbsent(true)
            }else if(!formData.Password){
                setPasswordAbsent(true)
            }else{
                let response = await axios.post('http://localhost:8080/api/user/userLogin', formData , {withCredentials: true})
                // console.log(response);
                console.log(response?.data);
                let userFromBackend = response.data.user
                console.log(userFromBackend);
                let accessToken = response.data.accessToken
                console.log(`accessToken:${response.data.accessToken}`);
                localStorage.setItem('user', JSON.stringify(userFromBackend))
                localStorage.setItem('accessToken', JSON.stringify(accessToken))
                getUserFromLogin(userFromBackend)
                setFormData({loginMode:mode, identifier:'', Password:''})
                if(userFromBackend.Role === "Reader"){
                    navigateToNewses('/news/home')
                }else{
                    navigateToNewses('/admin')
                }
                console.log(JSON.parse(localStorage.getItem('user')));
                console.log(JSON.parse(localStorage.getItem('accessToken')));
            }
        } catch (error) {
            console.log(error.response);
            console.error(error.response?.status);
            let errorStatus = error.response?.status
            if(errorStatus === 404){
                setError(`This ${mode} is not registered`)
            }else if(errorStatus === 400){
                setError('Fill all the fields')
            }else if(errorStatus === 401){
                setError(`Invalid password`)
            }
        }
    }

    let navigateToSignupPage = () => {
        sendNavState('login')
        navigateToSignup('/signup')
    }

    // useEffect(() => {
    //     if(user){
    //         setEasyLogoutVisible(true)
    //     }
    // })

    useEffect(() => {
        console.log(mode);
        setFormData({...formData, loginMode:mode})
    }, [mode])

    useEffect(() => {
        console.log(formData);
    }, [formData])

    useEffect(() => {
        window.scrollTo(0, 0);

        if(sessionStorage.getItem('loginMode')){
            console.log(sessionStorage.getItem('loginMode'));
            setMode(sessionStorage.getItem('loginMode'))
        }else{
            setMode('Username')
            console.log('Enter Second');
        }
    }, [])

  return (
    <div className={loginStyle.Container}>
        <div className={loginStyle.LoginContainer}>
            <div className={loginStyle.leftContainer}>
                <div className={loginStyle.logoDiv}>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTST8wfOO1ZnYtmKfC6mrSO4BvXHDdoIKfnCA&s" alt="" className={loginStyle.logoImage} />
                    <h1 className={loginStyle.Title}>THE <span>N.</span></h1>
                </div>
                <div className={loginStyle.welcomeDiv}>
                    <h3 className={loginStyle.welcome}>Welcome Back, Please login to your account.</h3>
                </div>
                <div className={loginStyle.formContainer}>
                    <form action="" className={loginStyle.form} onSubmit={loginSubmit}>
                        <div className={loginStyle.inpErrorDiv}>
                            {/* {identifierAbsent && <h4>*fill {mode}</h4>} */}
                            {identifierAbsent && <h4>*This field is required</h4>}
                        </div>

                        <div className={loginStyle.formDivs} onClick={() => displayInput('identifier')}>
                            <div className={loginStyle.inputTitle}>
                                <h4 className={identifierClicked ? loginStyle.clicked : loginStyle.notClicked}>{mode}</h4>
                            </div>
                            {identifierClicked && <div className={loginStyle.inputDiv}>
                                <input type="text" onChange={updateFormData} name='identifier' autoComplete='off' autoFocus value={formData.identifier} />
                            </div>}
                        
                        </div>

                        <div className={loginStyle.inpErrorDiv}>
                            {/* {passwordAbsent && <h4>*fill password</h4>} */}
                            {passwordAbsent && <h4>*This field is required</h4>}
                        </div>
                        
                        <div className={loginStyle.formDivs} onClick={() => displayInput('password')}>
                            <div className={loginStyle.inputTitle}>
                                <h4 className={passwordClicked ? loginStyle.clicked : loginStyle.notClicked}>Password</h4>
                            </div>
                            {passwordClicked && <div className={loginStyle.inputDiv}>
                                <input type={isPassword ? "password" : "text"} onChange={updateFormData} name='Password' autoComplete="off" autoFocus value={formData.Password}  />
                                {isPassword ? <FaEyeSlash onClick={updateIsPassword} className={loginStyle.eyes} /> : <FaEye onClick={updateIsPassword} className={loginStyle.eyes} />}
                                
                            </div>}
                        </div>
                        
                        <div className={loginStyle.loginButtonDiv}>
                            <button type="submit" className={loginStyle.loginButton}>Login</button>
                        </div>
                    </form>
                    <div className={loginStyle.errorDiv}>
                        <h4 className={loginStyle.error}>{error}</h4>
                    </div>
                </div>
            </div>
            <div className={loginStyle.rightContainer}>
                <div className={loginStyle.selectMsgDiv}>
                    <h3>Select Login Mode</h3>
                </div>
                <div className={loginStyle.lineDiv}></div>
                <div className={loginStyle.modeSwitchDiv}>
                    <div className={loginStyle.switch}>
                        {mode === 'Username' && <div onClick={() => changeMode('Email')}><MdOutlineEmail /><h4>Login with Email</h4></div>}
                        {mode === 'Email' && <div onClick={() => changeMode('Username')}><FaUserCircle /><h4>Login with Username</h4></div>}
                        {mode === 'Phone Number' && <div onClick={() => changeMode('Username')}><FaUserCircle /><h4>Login with Username</h4></div>}
                    </div>
                    <div className={loginStyle.switch}>
                        {mode === 'Username' && <div onClick={() => changeMode('Phone Number')}><MdOutlinePhoneIphone /><h4>Login with Phone Number</h4></div>}
                        {mode === 'Email' && <div onClick={() => changeMode('Phone Number')}><MdOutlinePhoneIphone /><h4>Login with Phone Number</h4></div>}
                        {mode === 'Phone Number' && <div onClick={() => changeMode('Email')}><MdOutlineEmail /><h4>Login with Email</h4></div>}
                    </div>
                </div>
                <div className={loginStyle.signupButtonDiv}>
                    <h4>Don't have an account?</h4>
                    <button className={loginStyle.signupButton} onClick={navigateToSignupPage}>Signup</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login
