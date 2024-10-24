import React, { useEffect } from 'react'
import adminStyle from './Admin.module.css'
import AdminBottomNavBar from './AdminBottomNavBar'
import { Outlet } from 'react-router-dom'

const Admin = () => {
  useEffect(() => {
    console.log("Admin Page");
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className={adminStyle.adminContainer}>
      <div className={adminStyle.bottomNavBarContainer}>
        <AdminBottomNavBar/>
      </div>

      <section className={adminStyle.newsContainer} >
        <Outlet/>
      </section>
    </div>
  )
}

export default Admin
