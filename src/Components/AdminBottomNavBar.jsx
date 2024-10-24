import React, { useContext, useEffect, useState } from 'react'
import adminBottomNavStyle from './AdminBottomNavBar.module.css'
import { NavLink } from 'react-router-dom'
import { AppContext } from './AppProvider'

const AdminBottomNavBar = () => {
    let[currentCategory, setCurrentCategory] = useState()

    let {getCurrentCategory, currentCategoryInApp, isBlurred} = useContext(AppContext)

    let selectCategory = (category) => {
        console.log(category);
        setCurrentCategory(category)
        getCurrentCategory(category)
        localStorage.setItem('currentCategory', category)
    }

    useEffect(() => {
        let categoryInLocalStorage = localStorage.getItem('currentCategory')
        console.log(categoryInLocalStorage);
        if(categoryInLocalStorage){
          setCurrentCategory(categoryInLocalStorage)
          getCurrentCategory(categoryInLocalStorage)
        }else{
          setCurrentCategory('Home')
          getCurrentCategory('Home')
        }
    }, []);

    useEffect(() => {
        if(currentCategoryInApp){
          selectCategory(currentCategoryInApp)
        }else{
          selectCategory('Home')
        }
    }, [currentCategoryInApp])

    useEffect(() => {
        console.log(currentCategory);
        console.log(currentCategoryInApp);
    })

  return (
    <div className={`${adminBottomNavStyle.totalContainer} ${isBlurred && adminBottomNavStyle.totalContainerBlurred}`}>
      <div className={adminBottomNavStyle.topContainer}>
        <ul className={adminBottomNavStyle.editorContainer}>
            <NavLink to='home' onClick={() => {selectCategory('Home')}} className={`${adminBottomNavStyle.category} ${currentCategory === "Home" ? adminBottomNavStyle.categoryActive : ''}`} >Home</NavLink>
            <NavLink to='allnews' onClick={() => {selectCategory('Allnews')}} className={`${adminBottomNavStyle.category} ${currentCategory === "Allnews" ? adminBottomNavStyle.categoryActive : ''}`}>All News</NavLink>
            <NavLink to='editorspick' onClick={() => {selectCategory('Editorspick')}} className={`${adminBottomNavStyle.category} ${currentCategory === "Editorspick" ? adminBottomNavStyle.categoryActive : ''}`}>Editor's Pick</NavLink>
            <NavLink to='breakingnews' onClick={() => {selectCategory('Breakingnews')}} className={`${adminBottomNavStyle.category} ${currentCategory === "Breakingnews" ? adminBottomNavStyle.categoryActive : ''}`}>Breaking News</NavLink>
            <NavLink to='topten' onClick={() => {selectCategory('Topten')}} className={`${adminBottomNavStyle.category} ${currentCategory === "Topten" ? adminBottomNavStyle.categoryActive : ''}`}>Top Ten News</NavLink>
            <NavLink to='deletednews' onClick={() => {selectCategory('Deletednews')}} className={`${adminBottomNavStyle.category} ${currentCategory === "Deletednews" ? adminBottomNavStyle.categoryActive : ''}`}>Deleted News</NavLink>
        </ul>
      </div>
      {/* <div className={adminBottomNavStyle.midContainer}></div> */}
      <div className={adminBottomNavStyle.bottomContainer}>
        <ul className={adminBottomNavStyle.categoriesContainer}>
          <NavLink to="politics" onClick={() => selectCategory("Politics")} className={`${adminBottomNavStyle.category} ${currentCategory === "Politics" ? adminBottomNavStyle.categoryActive : ''}`}>Politics</NavLink>
          <NavLink to="economy" onClick={() => selectCategory("Economy")} className={`${adminBottomNavStyle.category} ${currentCategory === "Economy" ? adminBottomNavStyle.categoryActive : ''}`}>Economy</NavLink>
          <NavLink to="world" onClick={() => selectCategory("World")} className={`${adminBottomNavStyle.category} ${currentCategory === "World" ? adminBottomNavStyle.categoryActive : ''}`}>World</NavLink>
          <NavLink to="security" onClick={() => selectCategory("Security")} className={`${adminBottomNavStyle.category} ${currentCategory === "Security" ? adminBottomNavStyle.categoryActive : ''}`}>Security</NavLink>
          <NavLink to="law" onClick={() => selectCategory("Law")} className={`${adminBottomNavStyle.category} ${currentCategory === "Law" ? adminBottomNavStyle.categoryActive : ''}`}>Law</NavLink>
          <NavLink to="science" onClick={() => selectCategory("Science")} className={`${adminBottomNavStyle.category} ${currentCategory === "Science" ? adminBottomNavStyle.categoryActive : ''}`}>Science</NavLink>
          <NavLink to="society" onClick={() => selectCategory("Society")} className={`${adminBottomNavStyle.category} ${currentCategory === "Society" ? adminBottomNavStyle.categoryActive : ''}`}>Society</NavLink>
          <NavLink to="culture" onClick={() => selectCategory("Culture")} className={`${adminBottomNavStyle.category} ${currentCategory === "Culture" ? adminBottomNavStyle.categoryActive : ''}`}>Culture</NavLink>
          <NavLink to="sports" onClick={() => selectCategory("Sports")} className={`${adminBottomNavStyle.category} ${currentCategory === "Sports" ? adminBottomNavStyle.categoryActive : ''}`}>Sports</NavLink>
          <NavLink to="entertainment" onClick={() => selectCategory("Entertainment")} className={`${adminBottomNavStyle.category} ${currentCategory === "Entertainment" ? adminBottomNavStyle.categoryActive : ''}`}>Entertainment</NavLink>
        </ul>
      </div>
    </div>
  )
}

export default AdminBottomNavBar
