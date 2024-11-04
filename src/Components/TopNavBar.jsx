import React, { useContext, useEffect, useRef, useState } from 'react'
import { json, Link, useLocation, useNavigate } from 'react-router-dom'
import TopNavStyle from './TopNavBar.module.css'
import { FaUserCircle } from "react-icons/fa";
import { AppContext } from './AppProvider';

const TopNavBar = () => {
    let[userLogged, setUserLogged] = useState(false)
    let[username, setUsername] = useState()
    let[navState, setNavState] = useState()
    let[isUserDrop, setIsUserDrop] = useState(false)
    let[readerOrEditor, setReaderOrEditor] = useState(true)

    let {user, logoutFromTopNavbar, navStateInApp, getCurrentCategory, isBlurred} = useContext(AppContext)

    let dropRef = useRef(null)
    let savedNewsLinkRef = useRef(null)

    let navigateTo = useNavigate()

    let {pathname} = useLocation()

    let linkClick = () => {
        if(userLogged) {
            localStorage.clear('user')
            console.log(JSON.parse(localStorage.getItem('user')));
            localStorage.clear('accessToken')
            localStorage.clear('currentCategory')
            setUserLogged(false)
            setUsername('')
            setNavState('login')
            logoutFromTopNavbar()
            navigateTo('/')
        }else{
            let path = window.location.pathname
            if(path ==='/login'){
                setNavState('signup')
            }else{
                setNavState('login')
            }
        }

    }

    let userDrop = () => {
        setIsUserDrop(!isUserDrop)
    }

    let handleClickOutsidedrop = (event) => {
        if(dropRef.current && !dropRef.current.contains(event.target)){
            setIsUserDrop(false)
        }
    }

    let toSavedNews = () => {
        setIsUserDrop(false)
        getCurrentCategory("savednews")
        localStorage.setItem('currentCategory', "savednews")
        navigateTo('/news/savednews')
    }

    
    let toUserEdit = () => {
        setIsUserDrop(false)
        navigateTo('/news/updateuser')
    }

    let toHome = () => {
        // console.log(user);
        if(!user){
            setNavState('login')
            navigateTo('/')
        }else{
            getCurrentCategory('Home')
            localStorage.setItem('currentCategory', "Home")
            navigateTo('/news')
        }
    }

    useEffect(() => {
        let userInLocalStorage = localStorage.getItem('user')
        // console.log(userInLocalStorage);
        if(userInLocalStorage && userInLocalStorage !== "undefined"){
            userInLocalStorage = JSON.parse(localStorage.getItem('user'))
            // console.log(userInLocalStorage);
            setUserLogged(true)
            setNavState('logout')
            // console.log(JSON.parse(localStorage.getItem('user')).Username);
            setUsername(JSON.parse(localStorage.getItem('user')).Username)
            if(JSON.parse(localStorage.getItem('user')).Role === "Editor"){
                setReaderOrEditor(false)
            }else if(JSON.parse(localStorage.getItem('user')).Role === "Reader"){
                setReaderOrEditor(true)
            }
        }else{
            setUserLogged(false)
            let path = window.location.pathname
            // console.log(path);
            if(path ==='/login'){
                setNavState('signup')
            }else{
                setNavState('login')
            }
        }

        // & Hiding the user drop

        document.addEventListener('mousedown', handleClickOutsidedrop)

        return () => {
            document.removeEventListener('mousedown', handleClickOutsidedrop)
        }
        
    }, [])

    useEffect(() => {
        // console.log(user);
        let userInLocalStorage = localStorage.getItem('user')
        // console.log(userInLocalStorage);
        
        if(user){
            // console.log(user.Username);
            setUsername(user.Username)
            setUserLogged(true)
            setNavState('logout')
            setIsUserDrop(false)
            if(user.Role === "Editor"){
                setReaderOrEditor(false)
            }else if(user.Role === "Reader"){
                setReaderOrEditor(true)
            }
        }else if(userInLocalStorage && userInLocalStorage !== "undefined"){
            userInLocalStorage = JSON.parse(localStorage.getItem('user'))
            console.log(userInLocalStorage.Username);
            setUsername(userInLocalStorage.Username)
            setUserLogged(true)
            setNavState('logout')
            // setIsUserDrop(false)
            if(JSON.parse(localStorage.getItem('user')).Role === "Editor"){
                setReaderOrEditor(false)
            }else if(JSON.parse(localStorage.getItem('user')).Role === "Reader"){
                setReaderOrEditor(true)
            }
        }else{
            setUsername('')
            setUserLogged(false)
            setNavState('login')
        }
        
    }, [user])

    useEffect(() => {
        if(navStateInApp){
            setNavState(navStateInApp)
        }else{
            setUserLogged(false)
            let path = window.location.pathname
            if(path ==='/login'){
                setNavState('signup')
            }else{
                setNavState('login')
            }
        }
    }, [navStateInApp])

    useEffect(() => {
        console.log(userLogged);
        console.log(navState);
        console.log(navStateInApp);
        console.log(isUserDrop);
        console.log(username);
        console.log(user);
        // console.log(pathname);
    })
        
  return (
    <nav className={`${TopNavStyle.container} ${isBlurred && TopNavStyle.containerBlurred}`}>
        <div className={TopNavStyle.topNavLeftdiv} onClick={toHome}>
            <div className={TopNavStyle.LogoImgDiv}>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTST8wfOO1ZnYtmKfC6mrSO4BvXHDdoIKfnCA&s" alt="" className={TopNavStyle.LogoImg} />
            </div>
            <div className={TopNavStyle.TitleDiv}>
                <h1 className={TopNavStyle.Title}>THE <span>N.</span></h1>
            </div>
            
        </div>
        <div className={TopNavStyle.topNavRightdiv}>
            {userLogged && <div className={TopNavStyle.topNavUsernameDiv} onClick={userDrop} ref={dropRef}>
                <div><FaUserCircle size={23} color='rgb(23, 23, 80)' /></div>
                <div><h2 className={TopNavStyle.topNavUsername}>{username}</h2></div>

                {isUserDrop && <div className={TopNavStyle.userdrop} onClick={(e) => e.stopPropagation()}>
                    <ul>
                        <li onClick={toUserEdit}>Edit Profile</li>
                        {readerOrEditor && <li onClick={toSavedNews} ref={savedNewsLinkRef}>Saved Newses</li>}
                        <li onClick={linkClick}>Logout</li>
                    </ul>
                </div>}
            </div>}
            <div onClick={linkClick} className={TopNavStyle.topNavLinksDiv}>
                {navState === 'signup' && <Link className={TopNavStyle.topNavLink} to='/signup'>Signup</Link>}
                {navState === 'login' && <Link className={TopNavStyle.topNavLink} to='/login'>Login</Link>}
            </div>
            
        </div>
    </nav>
  )
}

export default TopNavBar
