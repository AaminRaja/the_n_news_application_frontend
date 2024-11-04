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

  return (
    <div className={newsStyle.container}>

      {!isEditing && <div className={newsStyle.bottomNavBarDiv}>
        <BottomNavBar/>
      </div>}

      {!isEditing && <div className={newsStyle.breakingNewsTickerDiv}>
        <BreakingNewsTicker />
      </div>}
      <section className={`${newsStyle.newsDiv} ${isEditing && newsStyle.newsDivEditing}`}>
        <Outlet/>
      </section>
    </div>
  )
}

export default News