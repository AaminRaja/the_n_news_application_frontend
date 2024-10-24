import React, { useContext, useEffect, useRef, useState } from 'react'
import adminSingleNewsStyle from './AdminSingleNewsCommon.module.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { AppContext } from './AppProvider'
import axios from 'axios'
import { format } from 'date-fns'
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const AdminSingleNewsCommon = () => {
    
    let[newsDetails, setNewsDetails] = useState()
    let[loading, setLoading] = useState(false)
    let[filteredByCategory, setFilteredByCategory] = useState([])
    let[deleteConfirmation, setDeleteConfirmation]= useState(false)

    let {id} = useParams()

    let {savedNewsIds, getIsBlurred, isBlurred, logoutFromTopNavbar} = useContext(AppContext)

    let navigateTo = useNavigate()

    let singleRef = useRef(null)
    let allRef  = useRef(null)

    let {pathname} = useLocation()

    let fetchSingleNewsdetails = async() => {
        try {
            let singleResponse = await axios.get(`http://localhost:8080/api/news/fetchSingleNews/${id}`)
            let singleNews = singleResponse.data.singleNews
            let formattedDate = format(singleNews.PublishedDateAndTime, 'MMMM dd, yyyy')
            singleNews.PublishedDateAndTime = formattedDate
            console.log(singleNews);
            setNewsDetails(singleNews)

            // !
            let Category = singleNews.Category
            let categoryResponse = await axios.get(`http://localhost:8080/api/news/filterByCategory?category=${Category}&numberOfNews=10`)
            let filteredArrayBycategory = categoryResponse.data.filteredNewsByCategory;
            filteredArrayBycategory = filteredArrayBycategory.filter((ele) => {
              return ele._id !== id
            })
            // filteredArrayBycategory = filteredArrayBycategory.reverse().slice(0, 6)
            filteredArrayBycategory = filteredArrayBycategory
            console.log(filteredArrayBycategory);
            setFilteredByCategory(filteredArrayBycategory)
        } catch (error) {
            console.log(error);
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

      if (days > 1) {
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


    // & when clicking on a single news
    let toSingleNews = (newid) => {
      if(pathname === `/${id}`){
        navigateTo(`/${newid}`)
      }else if(pathname === `/admin/${id}`){
        navigateTo(`/admin/${newid}`)
      }
    }

    // & Delete News
    let selectDelete = () => {
        setDeleteConfirmation(true)
    }

    let deleteNews = async(id) => {
        try {
            let accessToken = JSON.parse(localStorage.getItem('accessToken'))
            console.log(accessToken);

            let response = await axios.put(`http://localhost:8080/api/news/softDeleteOneNews/${id}`, {deleteOrNot : !newsDetails?.isDeleted}, {
              headers:{
                'authorization': `Bearer ${accessToken}`
              },
              withCredentials:true}
            )

            console.log(response);
            if(!response.data.error){
                setDeleteConfirmation(false)
                navigateTo(-1)
            }
        } catch (error) {
            console.log(error);
            if(error.response && error.response.status === 403 && error.response.data.message === "Access token expired"){
                try {
                  let user = JSON.parse(localStorage.getItem('user'))
                  let response = await axios.post('http://localhost:8080/api/user/refreshAccessToken', {user}, {withCredentials:true})
                  console.log(response);
                  console.log(response.data.error);
                  if(!response.data.error){
                    console.log(`accessToken:${response.data.newAccessToken}`);
                    let accessToken = response.data.newAccessToken
                    localStorage.setItem('accessToken', JSON.stringify(accessToken))
                    console.log(JSON.parse(localStorage.getItem('accessToken')));
        
                    let {data} = await axios.put(`http://localhost:8080/api/news/softDeleteOneNews/${id}`, {
                      headers:{
                        'authorization': `Bearer ${accessToken}`
                      },
                      withCredentials:true}
                    )
                    console.log(data);
        
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
    }

    let syncHeights = () => {
      if (singleRef.current && allRef.current) {
          let singleHeight = singleRef.current.offsetHeight;
          allRef.current.style.height = `${singleHeight}px`;
      }
    }

    useEffect(() => {
      syncHeights()
    }, [newsDetails, filteredByCategory])

   useEffect(() => {
        setLoading(true)
        fetchSingleNewsdetails()
        setLoading(false)
    }, [id])

    useEffect(() => {
      window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
      console.log(newsDetails);
      console.log(filteredByCategory);
      console.log(pathname);
      console.log(savedNewsIds);
    })

    useEffect(() => {
      window.scrollTo(0, 0)
    })

    useEffect(() => {
        getIsBlurred(deleteConfirmation)
    }, [deleteConfirmation])
  return (
    <div className={adminSingleNewsStyle.TotalContainer}>
      {deleteConfirmation && <div className={adminSingleNewsStyle.confirmationDiv}>
           <div className={adminSingleNewsStyle.msgDiv}>
            <h4 className={adminSingleNewsStyle.msg}>Are you sure ?</h4>
           </div>
           <div className={adminSingleNewsStyle.buttonsDiv}>
                <button className={`${adminSingleNewsStyle.button} ${adminSingleNewsStyle.cancelBtn}`} onClick={() => setDeleteConfirmation(false)}>Cancel</button>
                <button className={`${adminSingleNewsStyle.button} ${adminSingleNewsStyle.deleteBtn}`} onClick={() => deleteNews(newsDetails._id)}>{newsDetails?.isDeleted ? `Undo Delete` : `Delete` }</button>
           </div> 
      </div>}

      <div className={`${adminSingleNewsStyle.singleNewscontainer} ${isBlurred && adminSingleNewsStyle.singleNewscontainerBlurred}`} ref={singleRef}>

        <div className={adminSingleNewsStyle.singleNewsSubCategorySaveDiv}>
          <div className={adminSingleNewsStyle.singleNewsSubCategoryDiv}>
            <h4 className={adminSingleNewsStyle.singleNewsSubCategory}>{newsDetails?.SubCategory}</h4>
          </div>
          <div className={adminSingleNewsStyle.singleNewsBtnsDiv}>
            <div className={adminSingleNewsStyle.singleNewsBtnDiv}>
              <button className={adminSingleNewsStyle.singleNewsBtn} onClick={() => navigateTo(`/admin/newseditor/${newsDetails._id}`)}>
                <span><FaEdit size={17} /></span>
                Edit News
              </button>
            </div>
            <div className={adminSingleNewsStyle.singleNewsBtnDiv}>
                {newsDetails?.isDeleted ?
                <button className={adminSingleNewsStyle.singleNewsBtn} onClick={selectDelete}>
                    <span><MdDeleteOutline size={18} /></span>
                    Undo Delete
                </button>
                :
                <button className={adminSingleNewsStyle.singleNewsBtn} onClick={selectDelete}>
                    <span><MdDeleteOutline size={18} /></span>
                    Delete News
              </button>}
            </div>
          </div>
        </div>

        <div className={adminSingleNewsStyle.singleNewsHeadingDiv}>
          <h2 className={adminSingleNewsStyle.singleNewsHeading}>{newsDetails?.Heading}</h2>
        </div>
        <div className={adminSingleNewsStyle.singleNewsSubEditordiv}>
          <div>
            <h5 className={adminSingleNewsStyle.singleNewsSubEditor}>{newsDetails?.SubEditor}</h5>
          </div>
          <div className={adminSingleNewsStyle.timeContainer}>
            <h5 className={adminSingleNewsStyle.time}>{newsDetails?.PublishedDateAndTime}</h5>
          </div>
        </div>
        <div className={adminSingleNewsStyle.singleNewsSummaryDiv}>
          <h3 className={adminSingleNewsStyle.singleNewsSummary}>{newsDetails?.Summary}</h3>
        </div>
        <div className={adminSingleNewsStyle.singleNewsPhotoDiv}>
          <img src={newsDetails?.Image} alt="" className={adminSingleNewsStyle.singleNewsPhoto} />
        </div>
        {newsDetails?.Location && <div className={adminSingleNewsStyle.singleNewsLocationDiv}>
          <h5 className={adminSingleNewsStyle.singleNewsLocation}>{newsDetails?.Location}:</h5>
        </div>}
        
        <div className={adminSingleNewsStyle.singleNewsContentDiv}>
          {newsDetails?.Content.map((para) => {
            return (
              <div>
                <p>{para}</p>
                <br />
              </div>
            )
          })

          }
        </div>
      </div>
      {Boolean(filteredByCategory.length) && <div className={`${adminSingleNewsStyle.allNewsContainer} ${isBlurred && adminSingleNewsStyle.allNewsContainerBlurred}`} >
          {filteredByCategory.map((news) => {
            return(
              <div className={adminSingleNewsStyle.newsContainer} onClick={() => toSingleNews(news._id)}>
                    <div className={adminSingleNewsStyle.contentDiv}>
                        <div className={adminSingleNewsStyle.photoContainer}>
                            <img src={news.Image} alt="" className={adminSingleNewsStyle.photo} />
                        </div>
                        <div>
                            <h4 className={adminSingleNewsStyle.subCategory}>{news.SubCategory}</h4>    
                        </div>
                        
                        <div>
                            <h2 className={adminSingleNewsStyle.Heading}>{news.Heading}</h2>
                        </div>
                    </div>
                    <div className={adminSingleNewsStyle.publishDiv}>
                        <div>
                            <h4 className={adminSingleNewsStyle.subEditor}>{news.SubEditor}</h4>
                        </div>
                        <div>
                            <h4 className={adminSingleNewsStyle.time}>{calculateTimeDifference(news.PublishedDateAndTime)}</h4>
                        </div>
                    </div>
              </div>
            )
          })}
      </div>}
    </div>
  )
}

export default AdminSingleNewsCommon
