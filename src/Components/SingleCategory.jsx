import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from './AppProvider'
import { useLocation, useNavigate } from 'react-router-dom'
import singleCategoryStyle from './SingleCategory.module.css'
import { IoCaretBackOutline } from "react-icons/io5";
import { IoCaretForwardOutline } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";

const SingleCategory = () => {
  let[newsByCategory, setNewsByCategory] = useState([])
  let[currentPageNumber, setCurrentPageNumber] = useState()
  let[totalnumberOfpages, setTotalNumberOfPages] = useState(1)

  let {currentCategoryInApp, logoutFromTopNavbar, savedNewsIds, getCurrentCategory, updateSavedNewsIds} = useContext(AppContext)

  let navigateTo = useNavigate()

  let {pathname} = useLocation()

  let category = currentCategoryInApp

  let newsPerPage = 9
  
  let fetchByCategory = async() => {
    // & editor's pick
    if(category === "editorspick"){
      try {
        let accessToken = JSON.parse(localStorage.getItem('accessToken'))
        // console.log(`accessToken in NewsHome : ${accessToken}`);
  
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/news/fetchEditorPick?currentPageNumber=${currentPageNumber}&newsPerPage=${newsPerPage}`, {
            headers:{
              'authorization': `Bearer ${accessToken}`
            },
            withCredentials:true}
        )
  
        console.log(response);
        setNewsByCategory(response.data.editorPickNewses)
        setTotalNumberOfPages(response.data.totalNumberOfPages)
        
      } catch (error) {
        console.log(error);
        if(error.response && error.response.status === 403 && error.response.data.message === "Access token expired"){
          try {
            let user = JSON.parse(localStorage.getItem('user'))
            let response = await axios.post(`${process.env.REACT_APP_API_URL}/user/refreshAccessToken`, {user}, {withCredentials:true})
            console.log(response);
            console.log(response.data.error);
            if(!response.data.error){
              console.log(`accessToken:${response.data.newAccessToken}`);
              let accessToken = response.data.newAccessToken
              localStorage.setItem('accessToken', JSON.stringify(accessToken))
              console.log(JSON.parse(localStorage.getItem('accessToken')));
  
              let {data} = await axios.get(`${process.env.REACT_APP_API_URL}/news/fetchEditorPick?currentPageNumber=${currentPageNumber}&newsPerPage=${newsPerPage}`, {
                headers:{
                  'authorization': `Bearer ${accessToken}`
                },
                withCredentials:true}
              )
              console.log(data);
  
              setNewsByCategory(data.editorPickNewses)
              setTotalNumberOfPages(data.totalNumberOfPages)
            }
          } catch (error) {
            console.log(error);
            if(error.response && error.response.status === 403 && error.response.data.message === "Refresh token expired"){
              localStorage.clear('user')
              localStorage.clear('accessToken')
              localStorage.clear('currentCategory')
              logoutFromTopNavbar()
              navigateTo('/login')
            }
          }
        }
      }
    }else if(category === "savednews"){
      // & saved news
      // let user = JSON.parse(localStorage.getItem('user'))
      // console.log(user._id);
      try {
        let accessToken = JSON.parse(localStorage.getItem('accessToken'))
        let user = JSON.parse(localStorage.getItem('user'))
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/user/fetchSavedNews?user_id=${user._id}&currentPageNumber=${currentPageNumber}&newsPerPage=${newsPerPage}`, {
          headers:{
            'authorization': `Bearer ${accessToken}`
          },
          withCredentials:true})
          console.log(response);
        console.log(response.data.savedNewsArray);
        setNewsByCategory(response.data.savedNewsArray)
        setTotalNumberOfPages(response.data.totalNumberOfPages)
        // setSavedNewsIds(response.data.savedNewsArray)
      } catch (error) {
        console.log(error);
        if(error.response && error.response.status === 403 && error.response.data.message === "Access token expired"){
          try {
            let user = JSON.parse(localStorage.getItem('user'))
            let response = await axios.post(`${process.env.REACT_APP_API_URL}/user/refreshAccessToken`, {user}, {withCredentials:true})
            console.log(response);
            if(!response.data.error){
              console.log(`accessToken:${response.data.newAccessToken}`)
              let accessToken = response.data.newAccessToken
              localStorage.setItem('accessToken', JSON.stringify(accessToken))
              console.log(JSON.parse(localStorage.getItem('accessToken')));

              let {data} = await axios.get(`${process.env.REACT_APP_API_URL}/user/fetchSavedNews?user_id=${user._id}&currentPageNumber=${currentPageNumber}&newsPerPage=${newsPerPage}`, {
                headers:{
                    'authorization': `Bearer ${accessToken}`
                  },
                  withCredentials:true})
              console.log(data);
              setNewsByCategory(data.savedNewsArray)
              setTotalNumberOfPages(data.totalNumberOfPages)
            }
            
          } catch (error) {
            console.log(error);
          }
        }
      }
    }else{
      // & categories
      try {
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/news/filterByCategory?category=${category}&currentPageNumber=${currentPageNumber}&newsPerPage=${newsPerPage}`)
        console.log(response);
        setNewsByCategory(response.data.filteredNewsByCategory)
        setTotalNumberOfPages(response.data.totalNumberOfPages)
      } catch (error) {
        console.log(error);
      }
    }
  }

  // & function to calculate the time
  let calculateTimeDifference = (Publishedtime) => {
    let now = new Date()
    let past = new Date(Publishedtime)
    let diffInMs = now - past

    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if(days >= 730.5){
        let years = days / 365.25
        console.log(years);
        return `${years} years`;
      } else if(days < 730.5 && days >= 365.25){
        return `1 year`;
      }else if(days < 365.25 && days >= 62){
        let months = days / 30.5;
        return `${months} months`;
      }else if(days < 61 && days >= 31){
        return `1 month`
      }else if (days > 1) {
        return `${days} days`;
      }else if(days == 1){
        return `${days} day`;
      }else if(hours > 1){
        return `${hours} hours`;
      }else if (hours == 1) {
        return `${hours} hour`;
      }else if(minutes > 1){
        return `${minutes} minutes`;
      }else if (minutes == 1) {
        return `${minutes} minute`;
      } else if(seconds > 1){
        return `${seconds} seconds`;
      }else{
        return `${seconds} second`;
      }
  }

  // & handling button clicking
  let handlePrevPage = () => {
    if(currentPageNumber > 1){
        setCurrentPageNumber(currentPageNumber-1)
    }
  }

  let handleNextPage = () => {
      if(currentPageNumber < totalnumberOfpages){
          setCurrentPageNumber(currentPageNumber+1)
      }
  }

  let handlePageSelect = (page) => {
      setCurrentPageNumber(page);
  };

  let toSingleNews = (id) => {
    navigateTo(`/news/${id}`)
  }

  useEffect(() => {
    let category = pathname.substring(6);
    if(category === "savednews" || category === "editorspick"){
      getCurrentCategory(category)
    }else {
      category = category.charAt(0).toUpperCase() + category.slice(1);
      getCurrentCategory(category)
    }
  }, [pathname])

  useEffect(() => {
    fetchByCategory()
    window.scrollTo(0, 0);
  }, [currentCategoryInApp, currentPageNumber])

  useEffect(() => {
    setCurrentPageNumber(1)
  }, [currentCategoryInApp])

  useEffect(() => {
    console.log(newsByCategory)
    console.log(savedNewsIds);
  })

  return (
    <div className={singleCategoryStyle.singleCategoryContainer}>
      <div className={singleCategoryStyle.newsListContainer}>
            {newsByCategory?.map((news) => {
                return(
                    <div className={singleCategoryStyle.newsContainer} onClick={() => toSingleNews(news._id)}>
                      {/* onClick={() => toSingleNews(news._id)} */}
                            <div className={singleCategoryStyle.contentDiv}>
                                <div className={singleCategoryStyle.photoContainer}>
                                    <img src={news.Image} alt="" className={singleCategoryStyle.photo} />
                                </div>
                                <div className={singleCategoryStyle.latestNewsSubCategorySaveDiv}>
                                    <div className={singleCategoryStyle.latestNewsSubCategoryDiv}>
                                      <h4 className={singleCategoryStyle.latestNewsSubCategory}>{news.SubCategory}</h4>  
                                    </div>    
                                    <div className={singleCategoryStyle.latestNewsSaveDiv}>
                                      {savedNewsIds?.includes(news._id) ? 
                                      <FaBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("unsave", news._id);}} className={singleCategoryStyle.latestNewsBookmark} />
                                      : 
                                      <FaRegBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("save", news._id)}} className={singleCategoryStyle.latestNewsBookmark} />
                                      }
                                    </div>
                                </div>
                                <div>
                                    <h2 className={singleCategoryStyle.heading}>{news.Heading}</h2>
                                </div>
                            </div>
                            <div className={singleCategoryStyle.publishDiv}>
                                <div>
                                    <h4 className={singleCategoryStyle.subEditor}>{news.SubEditor}</h4>
                                </div>
                                <div>
                                    <h4 className={singleCategoryStyle.time}>{calculateTimeDifference(news.PublishedDateAndTime)} ago</h4>
                                </div>
                            </div>
                    </div>
                )
            })}
        </div>
      

        <div className={singleCategoryStyle.buttonsContainer}>
              <div>
                  <button className={`${singleCategoryStyle.prevButton} ${currentPageNumber===1 ? singleCategoryStyle.prevDisabled : ''}`} onClick={handlePrevPage} disabled={currentPageNumber===1}><IoCaretBackOutline /></button>
              </div>
              <div className={singleCategoryStyle.numberBtnContainer}>
                  {totalnumberOfpages <= 10 ?
                      [...Array(totalnumberOfpages)].map((_, index) => {
                        // console.log(index);
                          return(
                              <button className={`${singleCategoryStyle.numberbtn} ${currentPageNumber === index+1 ? singleCategoryStyle.activeBtn : ''}`} onClick={() => handlePageSelect(index+1)}>{index+1}</button>
                          )
                      })
                      :
                      <button className={singleCategoryStyle.numberbtn}>{currentPageNumber}</button>
                  }
              </div>
              <div>
                  <button className={`${singleCategoryStyle.nextButton} ${currentPageNumber===totalnumberOfpages ? singleCategoryStyle.nextDisabled : ''}`} onClick={handleNextPage} disabled={currentPageNumber===totalnumberOfpages}><IoCaretForwardOutline /></button>
              </div>
        </div>
    </div>
  )
}

export default SingleCategory
