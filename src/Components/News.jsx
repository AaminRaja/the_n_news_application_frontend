import React, { useContext, useEffect, useState } from 'react'
import newsStyle from './News.module.css'
import BottomNavBar from './BottomNavBar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import BreakingNewsTicker from './BreakingNewsTicker'
import { AppContext } from './AppProvider'
import e from 'cors'

const News = () => {
  let[isEditing, setIsEditing] = useState(false)

  let navigateToSingleNews = useNavigate()
  let navigateToLogin = useNavigate()

  let {user, sendNavState} = useContext(AppContext)

  let {pathname} = useLocation()

  let toSingleNews = (id) => {
    navigateToSingleNews(`/news/${id}`)
  }

  useEffect(() => {
    console.log(user);
    if(!user){
      navigateToLogin('/login')
      sendNavState('signup')
    }else{
      sendNavState('logout')
    }
  })

  // useEffect(() => {
  //   if(pathname === '/news/updateuser'){
  //     setIsEditing(true)
  //   }else{
  //     setIsEditing(false)
  //   }
  // }, [pathname])
  return (
    <div className={newsStyle.container}>

      {!isEditing && <div className={newsStyle.bottomNavBarDiv}>
        <BottomNavBar/>
      </div>}

      {!isEditing && <div className={newsStyle.breakingNewsTickerDiv}>
        <BreakingNewsTicker toSingleNews={toSingleNews} />
      </div>}
      <section className={`${newsStyle.newsDiv} ${isEditing && newsStyle.newsDivEditing}`}>
        <Outlet/>
      </section>
    </div>
  )
}

export default News