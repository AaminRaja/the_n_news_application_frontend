import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ClipLoader } from 'react-spinners';
import singleNewsCommonStyle from './SingleNewsCommon.module.css'
import { format } from 'date-fns';
import { AppContext, AppProvider } from './AppProvider';
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";

const SingleNewsCommon = () => {
    
    let[newsDetails, setNewsDetails] = useState()
    let[loading, setLoading] = useState(false)
    let[filteredByCategory, setFilteredByCategory] = useState([])
    let[topDecision, setTopDecision] = useState(false)

    let {id} = useParams()

    let {savedNewsIds, updateSavedNewsIds} = useContext(AppContext)

    let navigateToSingleNews = useNavigate()

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
        navigateToSingleNews(`/${newid}`)
      }else if(pathname === `/news/${id}`){
        navigateToSingleNews(`/news/${newid}`)
      }
    }

    let syncHeights = () => {
      if (singleRef.current && allRef.current) {
          let singleHeight = singleRef.current.offsetHeight;
          allRef.current.style.height = `${singleHeight}px`;
      }
    }

    useEffect(() => {
      console.log(pathname === `/${id}`);
      if(pathname === `/${id}`){
        setTopDecision(true)
      }
    }, [])

    useEffect(() => {
      syncHeights()
    }, [newsDetails, filteredByCategory])

   useEffect(() => {
        setLoading(true)
        fetchSingleNewsdetails()
        setLoading(false)
    }, [id])

    useEffect(() => {
      console.log(newsDetails);
      console.log(filteredByCategory);
      console.log(pathname);
      console.log(savedNewsIds);
    })

    if(loading){
        return(
            <div className={singleNewsCommonStyle.spinnerContainer}>
              <ClipLoader color="#3498db" loading={loading} size={50} />
            </div>
        )
    }

  return (
    <div className={`${singleNewsCommonStyle.TotalContainer} ${topDecision && singleNewsCommonStyle.TotalContainerTop}`}>
      <div className={singleNewsCommonStyle.singleNewscontainer} ref={singleRef}>

        {savedNewsIds?.length ?  <div className={singleNewsCommonStyle.singleNewsSubCategorySaveDiv}>
          <div className={singleNewsCommonStyle.singleNewsSubCategoryDiv}>
            <h4 className={singleNewsCommonStyle.singleNewsSubCategory}>{newsDetails?.SubCategory}</h4>
          </div>
          <div className={singleNewsCommonStyle.singleNewsSaveDiv}>
            {savedNewsIds.includes(newsDetails?._id) ? 
              <FaBookmark onClick={() => {updateSavedNewsIds("unsave", newsDetails?._id);}} className={singleNewsCommonStyle.singleNewsBookmark} />
              : 
              <FaRegBookmark onClick={() => {updateSavedNewsIds("save", newsDetails?._id)}} className={singleNewsCommonStyle.singleNewsBookmark} />
            }
          </div>
        </div>
        : 
        <div className={singleNewsCommonStyle.singleNewsSubCategoryDiv}>
          <h4 className={singleNewsCommonStyle.singleNewsSubCategory}>{newsDetails?.SubCategory}</h4>
        </div>}

        <div className={singleNewsCommonStyle.singleNewsHeadingDiv}>
          <h2 className={singleNewsCommonStyle.singleNewsHeading}>{newsDetails?.Heading}</h2>
        </div>
        <div className={singleNewsCommonStyle.singleNewsSubEditordiv}>
          <div>
            <h5 className={singleNewsCommonStyle.singleNewsSubEditor}>{newsDetails?.SubEditor}</h5>
          </div>
          <div className={singleNewsCommonStyle.timeContainer}>
            <h5 className={singleNewsCommonStyle.time}>{newsDetails?.PublishedDateAndTime}</h5>
          </div>
        </div>
        <div className={singleNewsCommonStyle.singleNewsSummaryDiv}>
          <h3 className={singleNewsCommonStyle.singleNewsSummary}>{newsDetails?.Summary}</h3>
        </div>
        <div className={singleNewsCommonStyle.singleNewsPhotoDiv}>
          <img src={newsDetails?.Image} alt="" className={singleNewsCommonStyle.singleNewsPhoto} />
        </div>
        {newsDetails?.Location && <div className={singleNewsCommonStyle.singleNewsLocationDiv}>
          <h5 className={singleNewsCommonStyle.singleNewsLocation}>{newsDetails?.Location}:</h5>
        </div>}
        
        <div className={singleNewsCommonStyle.singleNewsContentDiv}>
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
      {Boolean(filteredByCategory.length) && <div className={singleNewsCommonStyle.allNewsContainer} ref={allRef}>
          {filteredByCategory.map((news) => {
            return(
              <div className={singleNewsCommonStyle.newsContainer} onClick={() => toSingleNews(news._id)}>
                    <div className={singleNewsCommonStyle.contentDiv}>
                        <div className={singleNewsCommonStyle.photoContainer}>
                            <img src={news.Image} alt="" className={singleNewsCommonStyle.photo} />
                        </div>{savedNewsIds?.length ? <div className={singleNewsCommonStyle.subCategorySaveDiv}>
                          <div className={singleNewsCommonStyle.subCategoryDiv}>
                            <h4 className={singleNewsCommonStyle.subCategory}>{news.SubCategory}</h4>
                          </div>
                          <div>
                            {savedNewsIds.includes(news?._id) ? 
                              <FaBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("unsave", news?._id);}} className={singleNewsCommonStyle.bookmark} />
                              : 
                              <FaRegBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("save", news?._id)}} className={singleNewsCommonStyle.bookmark} />
                            }
                          </div>
                        </div>
                        :
                        <div>
                            <h4 className={singleNewsCommonStyle.subCategory}>{news.SubCategory}</h4>    
                        </div>
                        }
                        
                        <div>
                            <h2 className={singleNewsCommonStyle.Heading}>{news.Heading}</h2>
                        </div>
                    </div>
                    <div className={singleNewsCommonStyle.publishDiv}>
                        <div>
                            <h4 className={singleNewsCommonStyle.subEditor}>{news.SubEditor}</h4>
                        </div>
                        <div>
                            <h4 className={singleNewsCommonStyle.time}>{calculateTimeDifference(news.PublishedDateAndTime)}</h4>
                        </div>
                    </div>
              </div>
            )
          })}
      </div>}
    </div>
  )
}

export default SingleNewsCommon