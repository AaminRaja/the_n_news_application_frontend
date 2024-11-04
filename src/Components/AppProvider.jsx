import axios from 'axios';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  let[user, setUser] = useState();
  let[navStateInApp, setNavStateInApp] = useState();
  let[currentCategoryInApp, setCurrentCategoryInApp] = useState()
  let[savedNewsIds, setSavedNewsIds] = useState([])
  let[isBlurred, setIsBlurred] = useState(false)
  let[prevPath, setPrevPath]= useState()

  let navigateTo = useNavigate()

  let {pathname} = useLocation()

  let getUserFromLogin = (userByLogin) => {
    // console.log(userByLogin);
    setUser(userByLogin);
    if(userByLogin?.Role === "Reader"){
      fetchSavedNewsIds()
    }
    
  };

  let logoutFromTopNavbar = () => {
    setUser(null);
    setSavedNewsIds([])
  };

  let sendNavState = (data) => {
    // console.log(data);
    setNavStateInApp(data);
    localStorage.setItem("currentState", data)
  };

  let getCurrentCategory = (category) => {
    // console.log(`Category from bottom nav bar : ${category}`);
    setCurrentCategoryInApp(category)
  }

  let fetchSavedNewsIds = async() => {
    try {
      let accessToken = JSON.parse(localStorage.getItem('accessToken'))
      let user = JSON.parse(localStorage.getItem('user'))
      // console.log(user);

      let response = await axios.get(`${process.env.REACT_APP_API_URL}/user/fetchSavedNewsIds?user_id=${user?._id}`, {
        headers:{
          'authorization': `Bearer ${accessToken}`
        },
        withCredentials:true})
        console.log(response);
        if(!response.data.error && response.data.savedNewsIds?.length ){
          setSavedNewsIds(response.data.savedNewsIds)
        }
        
    } catch (error) {
      console.log(error);
      if(error && error.response?.status === 403 && error.response.data.message === "Access token expired"){
        try {
          let user = JSON.parse(localStorage.getItem('user'))
          let response = await axios.post(`${process.env.REACT_APP_API_URL}/user/refreshAccessToken`, {user}, {withCredentials:true})
          console.log(response);
          if(!response.data.error){
            let accessToken = response.data.newAccessToken
            localStorage.setItem('newAccessToken', JSON.stringify(accessToken))
            console.log(JSON.parse(localStorage.getItem('accessToken')));

            let {data} = await axios.get(`${process.env.REACT_APP_API_URL}/user/fetchSavedNewsIds?user_id=${user._id}`, {
              headers:{
                'authorization': `Bearer ${accessToken}`
              },
              withCredentials:true})
            console.log(data);
            if(!data.error && data.savedNewsIds?.length ){
              setSavedNewsIds(data.savedNewsIds)
            }
            
          }
        } catch (error) {
          console.log(error);
          if(error.response && error.response.status === 403 && error.response.data.message === "Refresh token expired"){
            localStorage.clear('user')
            localStorage.clear('accessToken')
            localStorage.clear('currentCategory')
            setUser(null);
            console.log("navigating from here");
            navigateTo('/login')
          }
        }
      }
    }
  }

  let saveInBackend = async(newsId) => {
    try {
      let user = JSON.parse(localStorage.getItem('user'))
      let accessToken = JSON.parse(localStorage.getItem('accessToken'))
      // console.log(user);
      // console.log(user._id);
      let userId = user._id
      let response = await axios.put(`${process.env.REACT_APP_API_URL}/user/saveNews/${newsId}`, {userId}, {
        headers:{
          'authorization': `Bearer ${accessToken}`
        },
        withCredentials:true}) //! Thsis is a basic request
      console.log(response);
    } catch (error) {
      console.log(error);
      if(error && error.response.status === 403 && error.response.data.message === "Access token expired"){
        try {
          let user = JSON.parse(localStorage.getItem('user'))
          let response = await axios.post(`${process.env.REACT_APP_API_URL}/user/refreshAccessToken`, {user}, {withCredentials:true})
          console.log(response);
          if(!response.data.error){
            let accessToken = response.data.newAccessToken
            localStorage.setItem('newAccessToken', JSON.stringify(accessToken))
            console.log(JSON.parse(localStorage.getItem('accessToken')));

            let user = JSON.parse(localStorage.getItem('user'))
            let userId = user._id
            let {data} = await axios.put(`${process.env.REACT_APP_API_URL}/user/saveNews/${newsId}`, {userId}, {
              headers:{
                'authorization': `Bearer ${accessToken}`
              },
              withCredentials:true})
              console.log(data);
          }
        } catch (error) {
          console.log(error);
          if(error.response && error.response.status === 403 && error.response.data.message === "Refresh token expired"){
            localStorage.clear('user')
            localStorage.clear('accessToken')
            localStorage.clear('currentCategory')
            setUser(null);
            console.log("navigating from here");
            navigateTo('/login')
          }
        }
      }
    }
  }

  let unsaveInBackend = async(newsId) => {
    try {
      let user = JSON.parse(localStorage.getItem('user'))
      let accessToken = JSON.parse(localStorage.getItem('accessToken'))
      // console.log(user);
      // console.log(user._id);
      let userId = user._id
      let response = await axios.put(`${process.env.REACT_APP_API_URL}/user/unSaveNews/${newsId}`, {userId}, {
        headers:{
          'authorization': `Bearer ${accessToken}`
        },
        withCredentials:true}) //! Thsis is a basic request
      console.log(response);
    } catch (error) {
      console.log(error);
      if(error && error.response.status === 403 && error.response.data.message === "Access token expired"){
        try {
          let user = JSON.parse(localStorage.getItem('user'))
          let response = await axios.post(`${process.env.REACT_APP_API_URL}/user/refreshAccessToken`, {user}, {withCredentials:true})
          console.log(response);
          if(!response.data.error){
            let accessToken = response.data.newAccessToken
            localStorage.setItem('newAccessToken', JSON.stringify(accessToken))
            console.log(JSON.parse(localStorage.getItem('accessToken')));

            let user = JSON.parse(localStorage.getItem('user'))
            let userId = user._id
            let {data} = await axios.put(`${process.env.REACT_APP_API_URL}/user/unSaveNews/${newsId}`, {userId}, {
              headers:{
                'authorization': `Bearer ${accessToken}`
              },
              withCredentials:true})
              console.log(data);
          }
        } catch (error) {
          console.log(error);
          if(error.response && error.response.status === 403 && error.response.data.message === "Refresh token expired"){
            localStorage.clear('user')
            localStorage.clear('accessToken')
            localStorage.clear('currentCategory')
            setUser(null);
            console.log("navigating from here");
            navigateTo('/login')
          }
        }
      }
    }
  }

  let updateSavedNewsIds = async(action, newsId) => {
    if(action === "save"){
      console.log(savedNewsIds);
      if(!savedNewsIds?.includes(newsId)){
        setSavedNewsIds([...savedNewsIds, newsId])
        saveInBackend(newsId)
      }
    }else if(action === "unsave"){
      if(savedNewsIds.includes(newsId)){
        let newSavedIds = savedNewsIds.filter((ele) => {
          return ele !== newsId
        })
        console.log(newSavedIds);
        setSavedNewsIds([...newSavedIds])
        unsaveInBackend(newsId)
      }
    }
  }

  let getIsBlurred = (data) => {
    setIsBlurred(data)
  }

  useEffect(() => {
    if(!prevPath){
      setPrevPath('/')
      // let userInLocalStorage = localStorage.getItem('user')
      let userInLocalStorage = JSON.parse(localStorage.getItem('user'))
      let categoryFromLocalStorage = localStorage.getItem('currentCategory')
      // console.log(categoryFromLocalStorage);
      console.log(userInLocalStorage);
      console.log(categoryFromLocalStorage);
      
      if(userInLocalStorage === "undefined" || !userInLocalStorage){
        navigateTo('/')
      }else if(userInLocalStorage && categoryFromLocalStorage){
        setCurrentCategoryInApp(categoryFromLocalStorage)
        setUser(userInLocalStorage)
        if(userInLocalStorage?.Role === "Reader"){
          fetchSavedNewsIds()
          navigateTo(`/news/${categoryFromLocalStorage.toLocaleLowerCase()}`)
        }else if(userInLocalStorage?.Role === "Editor") {
          navigateTo(`/admin/${categoryFromLocalStorage.toLocaleLowerCase()}`)
        }
      }else if(userInLocalStorage && !categoryFromLocalStorage){
        setUser(userInLocalStorage)
        setCurrentCategoryInApp("Home")
        if(userInLocalStorage?.Role === "Reader"){
          fetchSavedNewsIds()
          navigateTo(`/news`)
        }else if(userInLocalStorage?.Role === "Editor") {
          navigateTo(`/admin`)
        }
      
      }
    }else{
      if((prevPath === '/') || (prevPath === '/login') || (prevPath === '/signup')){
        if((pathname.slice(1, 6) === "admin") || (pathname.slice(1, 5) === "news")){
          if(!user){
            setNavStateInApp('signup')
            navigateTo('/login')
          }else{
            setPrevPath(pathname)
          }
        }else{
          setPrevPath(pathname)
        }
      }else if((prevPath.slice(1, 6) === "admin") || (prevPath.slice(1, 5) === "news")){
        if((pathname === '/') || (pathname === '/login') || (pathname === '/signup')){
          if(user){
            navigateTo(`${prevPath}`)
          }else{
            setPrevPath(pathname)
          }
        }else{
          setPrevPath(pathname)
        }
      }else{
        setPrevPath(pathname)
      }
    }
  }, [pathname])

  useEffect(() => {
    let stateInLocalStorage = localStorage.getItem('currentState')
    console.log(stateInLocalStorage); 
  }, [])

  useEffect(() => {
    console.log(user);
  })

  useEffect(() => {
    console.log('NavState:', navStateInApp);
  });

  useEffect(() => {
    console.log('CurrentCategory:', currentCategoryInApp);
  })

  useEffect(() => {
    console.log("savedNewsIds", savedNewsIds);
    console.log(user);
    console.log(isBlurred);
    console.log(prevPath);
  })

  return (
    <AppContext.Provider value={{ user, navStateInApp, getUserFromLogin, logoutFromTopNavbar, sendNavState, getCurrentCategory, currentCategoryInApp, savedNewsIds, updateSavedNewsIds, getIsBlurred, isBlurred }}>
      {children}
    </AppContext.Provider>
  );
};
