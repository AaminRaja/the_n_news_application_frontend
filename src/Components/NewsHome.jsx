import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from './AppProvider'
import newsHomeStyle from './NewsHome.module.css'
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import PreferencesBox from './PreferencesBox'
import { RiArrowRightDoubleLine } from "react-icons/ri";

const NewsHome = () => {
  let[editorsPick, setEditorsPick] = useState([])
  let[firstOfTopTen, setFirstOfTopTen] = useState()
  let[restOfTopTen, setRestOfTopTen] = useState([])
  let[latestNews, setLatestNews] = useState([])

  let { logoutFromTopNavbar, savedNewsIds, updateSavedNewsIds, user, getCurrentCategory } = useContext(AppContext)

  let navigateToLogin = useNavigate()
  let navigateToSingleNews = useNavigate()
  let navigateToAllNews = useNavigate()

  let fetchBySpecification = async(specification) => {
    console.log(specification);
    try {
      let accessToken = JSON.parse(localStorage.getItem('accessToken'))
      // console.log(`accessToken in NewsHome : ${accessToken}`);

      let numberOfNews;
      if(specification === "fetchEditorPick"){
        numberOfNews = 3
      }else if(specification === "fetchTopTenNewses"){
        numberOfNews = 4
      }

      let response = await axios.get(`http://localhost:8080/api/news/${specification}?numberOfNews=${numberOfNews}`, {
          headers:{
            'authorization': `Bearer ${accessToken}`
          },
          withCredentials:true}
      )

      console.log(response);
      if(specification === "fetchEditorPick"){
        setEditorsPick(response.data.editorPickNewses)
      }else if(specification === "fetchTopTenNewses"){
        let topTenNewsArray = response.data.topTenNewses
        setFirstOfTopTen(response.data.firstInTopTen)
        setRestOfTopTen(response.data.restInTopTen)
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

            console.log(specification);

            let numberOfNews;
            if(specification === "fetchEditorPick"){
              numberOfNews = 3
            }else if(specification === "fetchTopTenNewses"){
              numberOfNews = 4
            }

            let {data} = await axios.get(`http://localhost:8080/api/news/${specification}?numberOfNews=${numberOfNews}`, {
              headers:{
                'authorization': `Bearer ${accessToken}`
              },
              withCredentials:true}
            )
            console.log(data);

            if(specification === "fetchEditorPick"){
              setEditorsPick(data.editorPickNewses)
            }else if(specification === "fetchTopTenNewses"){
              let topTenNewsArray = response.data.topTenNewses
              setFirstOfTopTen(response.data.firstInTopTen)
              setRestOfTopTen(response.data.restInTopTen)
            }
          }
        } catch (error) {
          console.log(error);
          if(error.response && error.response.status === 403 && error.response.data.message === "Refresh token expired"){
            localStorage.clear('user')
            localStorage.clear('accessToken')
            localStorage.clear('currentCategory')
            logoutFromTopNavbar()
            navigateToLogin('/login')
          }
        }
      }
    }
  }

  let fetchLatestNews = async() => {
    try {
      let response = await axios.get(`http://localhost:8080/api/news/allNews?numberOfNews=10`)
      // console.log(response);
      setLatestNews(response.data.allNews)
    } catch (error) {
      console.log(error);
    }
  }

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

  let toSingleNews = (id) => {
    navigateToSingleNews(`/news/${id}`)
  }

  let toAllNews = () => {
    navigateToAllNews('allNews')
  }

  useEffect(() => {
    fetchBySpecification("fetchEditorPick")
    fetchBySpecification("fetchTopTenNewses")
    fetchLatestNews()
    getCurrentCategory(null)
    localStorage.removeItem('currentCategory')
    window.scrollTo(0, 0);
  }, [])

  useEffect(() => {
    console.log(editorsPick);
    console.log(firstOfTopTen);
    console.log(restOfTopTen);
    console.log(latestNews);
    console.log(savedNewsIds);
    console.log(user);
  })

  return (
    <div className={newsHomeStyle.totalContainer}>
      <div className={newsHomeStyle.allNewsSection}>
        <div className={newsHomeStyle.latestNewsContainer}>
          <div className={newsHomeStyle.latestTitleDiv}>
            <h1 className={newsHomeStyle.latestTitle}>JUST IN</h1>
          </div>
          <div>
            <hr />
          </div>
          <div className={newsHomeStyle.latestNewsesContainer}>
            {latestNews.map((news) => {
              return (
                <div className={newsHomeStyle.latestNewsSingleDiv} onClick={() => toSingleNews(news._id)}>
                  <div className={newsHomeStyle.latestNewsSubCategorySaveDiv}>
                    <div className={newsHomeStyle.latestNewsSubCategoryDiv}>
                      <h4 className={newsHomeStyle.latestNewsSubCategory}>{news.SubCategory}</h4>
                    </div>
                    <div className={newsHomeStyle.latestNewsSaveDiv}>
                      {savedNewsIds?.includes(news._id) ? 
                      <FaBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("unsave", news._id)}} className={newsHomeStyle.latestNewsBookmark} />
                      : 
                      <FaRegBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("save", news._id)}} className={newsHomeStyle.latestNewsBookmark} />
                      }
                    </div>
                  </div>
                  <div>
                    <p className={newsHomeStyle.latestNewsHeading}>{news.Heading}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className={newsHomeStyle.buttonDiv}>
            <button className={newsHomeStyle.button} onClick={toAllNews}> All News <RiArrowRightDoubleLine size={22} /></button>
          </div>
        </div>

        {/* !!!!!!!!!!!!!!! */}

        <div className={newsHomeStyle.topTenContainer}>
            <div className={newsHomeStyle.topTenFirstDiv} onClick={() => toSingleNews(firstOfTopTen?._id)}>
              <div className={newsHomeStyle.topTenFirstSubCategorySaveDiv}>
                  <div className={newsHomeStyle.topTenFirstSubCategoryDiv}>
                    <h4 className={newsHomeStyle.topTenFirstSubCategory}>{firstOfTopTen?.SubCategory}</h4>
                  </div>
                  <div className={newsHomeStyle.topTenFirstSaveDiv}>
                    {savedNewsIds?.includes(firstOfTopTen?._id) ? 
                    <FaBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("unsave", firstOfTopTen._id)}} className={newsHomeStyle.topTenFirstBookmark} />
                    : 
                    <FaRegBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("save", firstOfTopTen._id)}} className={newsHomeStyle.topTenFirstBookmark} />
                    }
                  </div>
              </div>

              <div>
                <h3 className={newsHomeStyle.topTenFirstHeading}>{firstOfTopTen?.Heading}</h3>
              </div>

              <div className={newsHomeStyle.topTenFirstPublishDiv}>
                <div>
                  <h4 className={newsHomeStyle.topTenFirstSubEditor}>{firstOfTopTen?.SubEditor}</h4>
                </div>
                <div>
                  <h4 className={newsHomeStyle.topTenFirstTime}>{calculateTimeDifference(firstOfTopTen?.PublishedDateAndTime)} ago</h4>
                </div>
              </div>
                  
              <div className={newsHomeStyle.topTenFirstPhotoContainer}>
                <img src={firstOfTopTen?.Image} alt="" className={newsHomeStyle.topTenFirstPhoto} />
              </div>
            </div>

              {/* ??? */}
            <div className={newsHomeStyle.topTenRestDiv}>
                {restOfTopTen?.map((news) => {
                  return(
                    <div className={newsHomeStyle.topTenRestSingleDiv} onClick={() => toSingleNews(news._id)}>
                      <div className={newsHomeStyle.topTenRestSingleLeftDiv}>
                        <div className={newsHomeStyle.topTenRestSubCategorySaveDiv}>
                          <div className={newsHomeStyle.topTenRestSubCategoryDiv}>
                            <h4 className={newsHomeStyle.topTenRestSubCategory}>{news.SubCategory}</h4>
                          </div>
                          <div className={newsHomeStyle.topTenRestSaveDiv}>
                            {savedNewsIds?.includes(news._id) ? 
                            <FaBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("unsave", news._id)}} className={newsHomeStyle.topTenRestBookmark} />
                            : 
                            <FaRegBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("save", news._id)}} className={newsHomeStyle.topTenRestBookmark} />
                            }
                          </div>
                        </div>

                        <div>
                          <h3 className={newsHomeStyle.topTenRestHeading}>{news.Heading}</h3>
                        </div>

                        <div className={newsHomeStyle.topTenRestPublishDiv}>
                          <div>
                            <h4 className={newsHomeStyle.topTenRestSubEditor}>{news.SubEditor}</h4>
                          </div>
                          <div>
                            <h4 className={newsHomeStyle.topTenRestTime}>{calculateTimeDifference(news.PublishedDateAndTime)} ago</h4>
                          </div>
                        </div>

                        <div className={newsHomeStyle.topTenRestSummaryDiv}>
                          <h3 className={newsHomeStyle.topTenRestSummary}>{news.Summary}</h3>
                        </div>
                      </div>

                      <div className={newsHomeStyle.topTenRestSingleRightDiv}>
                            <img src={news.Image} alt="" className={newsHomeStyle.topTenRestPhoto}/>
                      </div>
                    </div>
                  )
                })}
            </div>
        </div>

        {/* !!!!!!!!!!!!!!! */}

        <div className={newsHomeStyle.editorsPicContainer}>
          <div className={newsHomeStyle.editorsTitleDiv}>
            <h1 className={newsHomeStyle.editorsTitle}>EDITOR'S PICK</h1>
          </div>
          <div>
            <hr />
          </div>
          <div className={newsHomeStyle.editorsPickNewsesContainer}>
            {editorsPick.map((news) => {
              return (
                <div className={newsHomeStyle.editorsPickSingleDiv} onClick={() => toSingleNews(news._id)}>
                  <div className={newsHomeStyle.editorsPickPhotoContainer}>
                    <img src={news.Image} alt="" className={newsHomeStyle.editorsPickPhoto} />
                  </div>
                  <div className={newsHomeStyle.editorsPickSubCategorySaveDiv}>
                    <div className={newsHomeStyle.editorsPickSubCategoryDiv}>
                      <h4 className={newsHomeStyle.editorsPickSubCategory}>{news.SubCategory}</h4>
                    </div>
                    <div className={newsHomeStyle.editorsPickSaveDiv}>
                      {savedNewsIds?.includes(news._id) ? 
                      <FaBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("unsave", news._id)}} className={newsHomeStyle.editorsPickBookmark} />
                      : 
                      <FaRegBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("save", news._id)}} className={newsHomeStyle.editorsPickBookmark} />
                      }
                    </div>
                  </div>
                  <div>
                    <p className={newsHomeStyle.editorsPickHeading}>{news.Heading}</p>
                  </div>
                  <div className={newsHomeStyle.editorsPickPublishDiv}>
                    <div>
                      <h4 className={newsHomeStyle.editorsPickSubEditor}>{news.SubEditor}</h4>
                    </div>
                    <div>
                      <h4 className={newsHomeStyle.editorsPickTime}>{calculateTimeDifference(news.PublishedDateAndTime)} ago</h4>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className={newsHomeStyle.preferencesSection}>
            <PreferencesBox/>
      </div>
    </div>
  )
}

export default NewsHome
