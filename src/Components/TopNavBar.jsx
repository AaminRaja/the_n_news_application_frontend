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
            // console.log(JSON.parse(localStorage.getItem('user')));
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
        console.log('User clicked');
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
        // let userInLocalStorage = JSON.parse(localStorage.getItem('user'))
        let userInLocalStorage = localStorage.getItem('user')
        console.log(userInLocalStorage);
        console.log(Boolean(userInLocalStorage));
        if(userInLocalStorage && userInLocalStorage !== "undefined"){
            setUserLogged(true)
            setNavState('logout')
            setUsername(JSON.parse(localStorage.getItem('user')).Username)
        }else{
            setUserLogged(false)
            let path = window.location.pathname
            console.log(path);
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
        console.log(user);
        if(user){
            setUsername(user.Username)
            setUserLogged(true)
            setNavState('logout')
            setIsUserDrop(false)
        }else{
            setUsername('')
            setUserLogged(false)
            setNavState('login')
        }
        
    }, [user])

    useEffect(() => {
        // let user = JSON.parse(localStorage.getItem('user'))
        console.log(user);
        if(user){
            if(navStateInApp){
                setNavState(navStateInApp)
            }
        }else{
            // setNavState('signup')
            setUserLogged(false)
            let path = window.location.pathname
            console.log(path);
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
        // console.log(username);
        console.log(user);
        console.log(pathname);
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
                        <li onClick={toSavedNews} ref={savedNewsLinkRef}>Saved Newses</li>
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
