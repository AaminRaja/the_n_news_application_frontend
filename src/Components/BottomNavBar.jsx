import React, { useContext, useEffect, useRef, useState } from 'react'
import bottomNavStyle from './BottomNavBar.module.css'
import { AppContext } from './AppProvider'
import { NavLink, useNavigate } from 'react-router-dom'

const BottomNavBar = () => {
  let[currentCategory, setCurrentCategory] = useState()

  let {getCurrentCategory, currentCategoryInApp} = useContext(AppContext)

  // let linkRef = useRef(null)

  // let navigateToCategory = useNavigate()

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
  }, [])

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

  // useEffect(() => {
  //   console.log(currentCategory);
  // })
  return (
    <div className={bottomNavStyle.totalContainer}>
      <div className={bottomNavStyle.leftContainer}>
        <ul className={bottomNavStyle.categoriesContainer}>
          <NavLink to="home" onClick={() => selectCategory("Home")} className={`${bottomNavStyle.category} ${currentCategory === "Home" ? bottomNavStyle.categoryActive : ''}`}>Home</NavLink>
          <NavLink to="politics" onClick={() => selectCategory("Politics")} className={`${bottomNavStyle.category} ${currentCategory === "Politics" ? bottomNavStyle.categoryActive : ''}`}>Politics</NavLink>
          <NavLink to="economy" onClick={() => selectCategory("Economy")} className={`${bottomNavStyle.category} ${currentCategory === "Economy" ? bottomNavStyle.categoryActive : ''}`}>Economy</NavLink>
          <NavLink to="world" onClick={() => selectCategory("World")} className={`${bottomNavStyle.category} ${currentCategory === "World" ? bottomNavStyle.categoryActive : ''}`}>World</NavLink>
          <NavLink to="security" onClick={() => selectCategory("Security")} className={`${bottomNavStyle.category} ${currentCategory === "Security" ? bottomNavStyle.categoryActive : ''}`}>Security</NavLink>
          <NavLink to="law" onClick={() => selectCategory("Law")} className={`${bottomNavStyle.category} ${currentCategory === "Law" ? bottomNavStyle.categoryActive : ''}`}>Law</NavLink>
          <NavLink to="science" onClick={() => selectCategory("Science")} className={`${bottomNavStyle.category} ${currentCategory === "Science" ? bottomNavStyle.categoryActive : ''}`}>Science</NavLink>
          <NavLink to="society" onClick={() => selectCategory("Society")} className={`${bottomNavStyle.category} ${currentCategory === "Society" ? bottomNavStyle.categoryActive : ''}`}>Society</NavLink>
          <NavLink to="culture" onClick={() => selectCategory("Culture")} className={`${bottomNavStyle.category} ${currentCategory === "Culture" ? bottomNavStyle.categoryActive : ''}`}>Culture</NavLink>
          <NavLink to="sports" onClick={() => selectCategory("Sports")} className={`${bottomNavStyle.category} ${currentCategory === "Sports" ? bottomNavStyle.categoryActive : ''}`}>Sports</NavLink>
          <NavLink to="entertainment" onClick={() => selectCategory("Entertainment")} className={`${bottomNavStyle.category} ${currentCategory === "Entertainment" ? bottomNavStyle.categoryActive : ''}`}>Entertainment</NavLink>
        </ul>
      </div>
      <div className={bottomNavStyle.midContainer}></div>
      <div className={bottomNavStyle.rightContainer}>
        <ul className={bottomNavStyle.editorContainer}>
          <NavLink to="editorspick" onClick={() => selectCategory("editorspick")} className={`${bottomNavStyle.category} ${currentCategory === "editorspick" ? bottomNavStyle.categoryActive : ''}`}>Editor's Pick</NavLink>
          <NavLink to="savednews" onClick={() => selectCategory("savednews")} className={`${bottomNavStyle.category} ${currentCategory === "savednews" ? bottomNavStyle.categoryActive : ''}`}>Saved News</NavLink>
        </ul>
      </div>
    </div>
  )
}

export default BottomNavBar
