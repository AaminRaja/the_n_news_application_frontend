import React, { useContext, useEffect, useState } from 'react'
import adminSingleCatStyle from './AdminSingleCategory.module.css'
import { AppContext } from './AppProvider'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { IoCaretBackOutline } from "react-icons/io5";
import { IoCaretForwardOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { FaExpand } from "react-icons/fa";

const AdminSingleCategory = () => {
    let[newsByCategory, setNewsByCategory] = useState([])
    let[currentPageNumber, setCurrentPageNumber] = useState()
    let[totalnumberOfpages, setTotalNumberOfPages] = useState(1)
    let[categoryHeading, setCategoryHeading] = useState()
    let[isLoading, setIsLoading] = useState(false)

    let {currentCategoryInApp, logoutFromTopNavbar, getCurrentCategory} = useContext(AppContext)

    let {pathname} = useLocation()

    let navigateTo = useNavigate()

    let category = currentCategoryInApp

    let newsPerPage = 12

    let fetchByCategory = async() => {
      console.log(category);
        // & All News
        if(category === "Allnews"){
            try {
                setIsLoading(true)
                let {data} = await axios.get(`${process.env.REACT_APP_API_URL}/news/allNews?currentPageNumber=${currentPageNumber}&newsPerPage=${newsPerPage}`)
                console.log(data?.allNews);
                setNewsByCategory(data?.allNews)
                setTotalNumberOfPages(data?.totalNumberOfPages)
                setIsLoading(false)
            } catch (error) {
                console.log(error);
            }    
        }else if(category === "Editorspick"){
          // & Editors Pick

          console.log(newsPerPage);
          console.log(currentPageNumber);
          try {
            setIsLoading(true)
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
            setIsLoading(false)
          } catch (error) {
            console.log(error);
            if(error.response && error.response.status === 403 && error.response.data.message === "Access token expired"){
              try {
                setIsLoading(true)
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
                setIsLoading(false)
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
        } else if(category === "Breakingnews"){
          // & Breaking News

          try {
            setIsLoading(true)
            let accessToken = JSON.parse(localStorage.getItem('accessToken'))

            let response = await axios.get(`${process.env.REACT_APP_API_URL}/news/fetchBreakingNewses?currentPageNumber=${currentPageNumber}&newsPerPage=${newsPerPage}`, {
              headers:{
                'authorization': `Bearer ${accessToken}`
              },
              withCredentials:true}
            )
            console.log(response);
            setNewsByCategory(response.data.breakingNewses)
            setTotalNumberOfPages(response.data.totalNumberOfPages)
            setIsLoading(false)
          } catch (error) {
            console.log(error);
          }
        }else if(category === "Topten"){
          console.log("Enters topTen");
          // & Top Ten
          try {
            setIsLoading(true)
            let accessToken = JSON.parse(localStorage.getItem('accessToken'))
            console.log(accessToken);

            let response = await axios.get(`${process.env.REACT_APP_API_URL}/news/fetchTopTenNewses?currentPageNumber=${currentPageNumber}&newsPerPage=${newsPerPage}`, {
              headers:{
                'authorization': `Bearer ${accessToken}`
              },
              withCredentials:true}
            )   
            console.log(response);
            setNewsByCategory(response.data.topTenNewses)
            setTotalNumberOfPages(response.data.totalNumberOfPages)         
            setIsLoading(false)
          } catch (error) {
            console.log(error);
            if(error.response && error.response.status === 403 && error.response.data.message === "Access token expired"){
              try {
                setIsLoading(true)
                let user = JSON.parse(localStorage.getItem('user'))
                let response = await axios.post(`${process.env.REACT_APP_API_URL}/user/refreshAccessToken`, {user}, {withCredentials:true})
                console.log(response);
                console.log(response.data.error);
                if(!response.data.error){
                  console.log(`accessToken:${response.data.newAccessToken}`);
                  let accessToken = response.data.newAccessToken
                  localStorage.setItem('accessToken', JSON.stringify(accessToken))
                  console.log(JSON.parse(localStorage.getItem('accessToken')));
      
                  let {data} = await axios.get(`${process.env.REACT_APP_API_URL}/news/fetchTopTenNewses?currentPageNumber=${currentPageNumber}&newsPerPage=${newsPerPage}`, {
                    headers:{
                      'authorization': `Bearer ${accessToken}`
                    },
                    withCredentials:true}
                  )
                  console.log(data);
      
                  setNewsByCategory(data.topTenNewses)
                  setTotalNumberOfPages(data.totalNumberOfPages)
                }
                setIsLoading(false)
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
        }else if(category === "Deletednews"){
          // & Deleted
          try {
            setIsLoading(true)
            let accessToken = JSON.parse(localStorage.getItem('accessToken'))

            let response = await axios.get(`${process.env.REACT_APP_API_URL}/news/fetchDeletedNews?currentPageNumber=${currentPageNumber}&newsPerPage=${newsPerPage}`, {
              headers:{
                'authorization': `Bearer ${accessToken}`
              },
              withCredentials:true}
            )   
            console.log(response);
            setNewsByCategory(response.data.deletedNews)
            setTotalNumberOfPages(response.data.totalNumberOfPages)         
            setIsLoading(false)
          } catch (error) {
            console.log(error);
            if(error.response && error.response.status === 403 && error.response.data.message === "Access token expired"){
              try {
                setIsLoading(true)
                let user = JSON.parse(localStorage.getItem('user'))
                let response = await axios.post(`${process.env.REACT_APP_API_URL}/user/refreshAccessToken`, {user}, {withCredentials:true})
                console.log(response);
                console.log(response.data.error);
                if(!response.data.error){
                  console.log(`accessToken:${response.data.newAccessToken}`);
                  let accessToken = response.data.newAccessToken
                  localStorage.setItem('accessToken', JSON.stringify(accessToken))
                  console.log(JSON.parse(localStorage.getItem('accessToken')));
      
                  let {data} = await axios.get(`${process.env.REACT_APP_API_URL}/news/fetchDeletedNews?currentPageNumber=${currentPageNumber}&newsPerPage=${newsPerPage}`, {
                    headers:{
                      'authorization': `Bearer ${accessToken}`
                    },
                    withCredentials:true}
                  )
                  console.log(data);
      
                  setNewsByCategory(data.deletedNews)
                  setTotalNumberOfPages(data.totalNumberOfPages)
                }
                setIsLoading(false)
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
        }else{
          // & categories
          try {
            setIsLoading(true)
            let response = await axios.get(`${process.env.REACT_APP_API_URL}/news/filterByCategory?category=${category}&currentPageNumber=${currentPageNumber}&newsPerPage=${newsPerPage}`)
            console.log(response);
            setNewsByCategory(response.data.filteredNewsByCategory)
            setTotalNumberOfPages(response.data.totalNumberOfPages)
            setIsLoading(false)
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
          // localStorage.setItem('currentPageNumberOfAllNews', currentPageNumber-1)
      }
    }

    let handleNextPage = () => {
        if(currentPageNumber < totalnumberOfpages){
            setCurrentPageNumber(currentPageNumber+1)
            // localStorage.setItem('currentPageNumberOfAllNews', currentPageNumber+1)
        }
    }

    let handlePageSelect = (page) => {
        setCurrentPageNumber(page);
        // localStorage.setItem('currentPageNumberOfAllNews', page)
    };

    // & when clicking on a single news
    let toSingleNews = (id) => {
      navigateTo(`/admin/${id}`)
    }

    useEffect(() => {
      let category = pathname.substring(7);
      category = category.charAt(0).toUpperCase() + category.slice(1);
      getCurrentCategory(category)
    }, [pathname])

    useEffect(() => {
      setCurrentPageNumber(1)
      // localStorage.setItem('currentAdminPageNumberLocal', 1)
    }, [currentCategoryInApp])
    
    useEffect(() => {
      fetchByCategory()
      switch(category){
        case "Allnews":
          setCategoryHeading("All News")
          break
        case "Editorspick":
          setCategoryHeading("Editor's Pick")
          break
        case "Breakingnews":
          setCategoryHeading("Breaking News")
          break
        case "Topten":
          setCategoryHeading("Top Ten News")
          break
        case "Deletednews":
          setCategoryHeading("Deleted News")
          break
        default:
          setCategoryHeading(category)
      }
      window.scrollTo(0, 0);
    }, [currentCategoryInApp, currentPageNumber])

    useEffect(() => {
      window.scrollTo(0, 0)
    }, [])
    
    useEffect(() => {
      console.log(newsByCategory);
    })

    if(isLoading){
      return(
        <div className={adminSingleCatStyle.gifContainer}>
          <div className={adminSingleCatStyle.gifDiv} >
            <img src="https://i.pinimg.com/originals/b2/d4/b2/b2d4b2c0f0ff6c95b0d6021a430beda4.gif" alt="Saving..." className={adminSingleCatStyle.gif} />
          </div>
        </div>
      )
    }

  return (
    <div className={adminSingleCatStyle.TotalContainer}>
        <div className={adminSingleCatStyle.pageHeadingContainer}>
          <h1 className={adminSingleCatStyle.pageHeading}>{categoryHeading}</h1> 
        </div>
        <div className={adminSingleCatStyle.newsListContainer}>
            {newsByCategory?.map((news) => {
                return(
                    <div className={adminSingleCatStyle.newsContainer} >
                            <div className={adminSingleCatStyle.contentDiv}>
                                <div className={adminSingleCatStyle.photoContainer}>
                                    <img src={news.Image} alt="" className={adminSingleCatStyle.photo} />
                                </div>
                                <div>
                                    <h4 className={adminSingleCatStyle.subCategory}>{news.SubCategory}</h4>    
                                </div>
                                <div>
                                    <h2 className={adminSingleCatStyle.heading}>{news.Heading}</h2>
                                </div>
                            </div>
                            <div className={adminSingleCatStyle.publishDiv}>
                                <div>
                                    <h4 className={adminSingleCatStyle.subEditor}>{news.SubEditor}</h4>
                                </div>
                                <div>
                                    <h4 className={adminSingleCatStyle.time}>{calculateTimeDifference(news.PublishedDateAndTime)} ago</h4>
                                </div>
                            </div>

                            <div className={adminSingleCatStyle.overlayDiv}>
                              <div className={adminSingleCatStyle.overlayBtnDiv}>
                                <button className={adminSingleCatStyle.overlayBtn} onClick={() => {toSingleNews(news._id)}}>
                                  <span><FaExpand size={15} /></span>
                                  View News
                                </button>
                              </div>
                              <div className={adminSingleCatStyle.overlayBtnDiv}>
                                <button className={adminSingleCatStyle.overlayBtn} onClick={() => navigateTo(`/admin/newseditor/${news._id}`)}>
                                  <span><FaEdit size={17} /></span>
                                  Edit News
                                </button>
                              </div>
                              {/* <div className={adminSingleCatStyle.overlayBtnDiv}>
                                <button className={adminSingleCatStyle.overlayBtn}>
                                  <span><MdDeleteOutline size={18} /></span>
                                  Delete News
                                </button>
                              </div> */}
                            </div>
                    </div>
                )
            })}
        </div>
      

        <div className={adminSingleCatStyle.buttonsContainer}>
              <div>
                  <button className={`${adminSingleCatStyle.prevButton} ${currentPageNumber===1 ? adminSingleCatStyle.prevDisabled : ''}`} onClick={handlePrevPage} disabled={currentPageNumber===1}><IoCaretBackOutline /></button>
              </div>
              <div className={adminSingleCatStyle.numberBtnContainer}>
                  {totalnumberOfpages <= 10 ?
                      [...Array(totalnumberOfpages)].map((_, index) => {
                        // console.log(index);
                          return(
                              <button className={`${adminSingleCatStyle.numberbtn} ${currentPageNumber === index+1 ? adminSingleCatStyle.activeBtn : ''}`} onClick={() => handlePageSelect(index+1)}>{index+1}</button>
                          )
                      })
                      :
                      <button className={adminSingleCatStyle.numberbtn}>{currentPageNumber}</button>
                  }
              </div>
              <div>
                  <button className={`${adminSingleCatStyle.nextButton} ${currentPageNumber===totalnumberOfpages ? adminSingleCatStyle.nextDisabled : ''}`} onClick={handleNextPage} disabled={currentPageNumber===totalnumberOfpages}><IoCaretForwardOutline /></button>
              </div>
        </div>
    </div>
  )
}

export default AdminSingleCategory
