import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import allNewsStyle from './AllNews.module.css'
import { IoCaretBackOutline } from "react-icons/io5";
import { IoCaretForwardOutline } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import BreakingNewsTicker from './BreakingNewsTicker';

const AllNews = () => {
    let[allNews, setAllNews] = useState([])
    let[currentPageNumber, setCurrentPageNumber] = useState()
    let[totalnumberOfpages, setTotalNumberOfPages] = useState(1)
    let[loading, setLoading] = useState(false)
    let[breakingNews, setBreakingNews] = useState()
    let[topDecision, setTopDecision] = useState(false)
    // const [scrollY, setScrollY] = useState(0); // State for scroll position

    let {pathname} = useLocation()

    let navigateToSingleNews = useNavigate()

    // const breakingNewsRef = useRef(null);

    // & Fetching all news
    let newsPerPage = 9
    
    // let indexOfLastItem = currentPageNumber * itemsPerPage
    // let indexOfFirstitem = indexOfLastItem - itemsPerPage

    // let currentItems = allNews.slice(indexOfFirstitem, indexOfLastItem) //!

    // let totalPages = Math.ceil(allNews.length/itemsPerPage)

    let fetchAllNews = async() => {
        try {
            let currentPageNumberInLocal = localStorage.getItem('currentPageNumberOfAllNews')
            let {data} = await axios.get(`${process.env.REACT_APP_API_URL}/news/allNews?currentPageNumber=${currentPageNumberInLocal}&newsPerPage=${newsPerPage}`)
            console.log(data?.allNews);
            let allNewsArray = data?.allNews
            setAllNews(allNewsArray)
            setTotalNumberOfPages(data.totalNumberOfPages)
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
            localStorage.setItem('currentPageNumberOfAllNews', currentPageNumber-1)
        }
    }

    let handleNextPage = () => {
        if(currentPageNumber < totalnumberOfpages){
            setCurrentPageNumber(currentPageNumber+1)
            localStorage.setItem('currentPageNumberOfAllNews', currentPageNumber+1)
        }
    }

    let handlePageSelect = (page) => {
        setCurrentPageNumber(page);
        localStorage.setItem('currentPageNumberOfAllNews', page)
    };

    // & when clicking on a single news
    let toSingleNews = (id) => {
        navigateToSingleNews(`/${id}`)
    }

    // & checking for any breaking news to conditionally render the breaking news component
    let fetchBreakingNews = async() => {
        try {
            let {data} = await axios.get(`${process.env.REACT_APP_API_URL}/news/fetchBreakingNewses`)
            console.log(data.breakingNewses);
            setBreakingNews(data.breakingNewses)
        } catch (error) {
            console.log(error);
        }
    }

    // useEffect(() => {
    //     window.scrollTo(0, 0);
    // }, [])

    useEffect(() => {
        let currentPageNumberInLocal = Number(localStorage.getItem('currentPageNumberOfAllNews'))
        console.log(Number(currentPageNumberInLocal));
        if(currentPageNumberInLocal){
            setCurrentPageNumber(Number(currentPageNumberInLocal))
        }else{
            setCurrentPageNumber(1)
        }
        
    }, [])

    useEffect(() => {
        if(pathname ==='/'){
            setTopDecision(true)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        fetchAllNews()
        fetchBreakingNews()
        setLoading(false)
        console.log(typeof currentPageNumber);
        console.log(localStorage.getItem('currentPageNumberOfAllNews'));
        window.scrollTo(0, 0);
    }, [currentPageNumber])

    useEffect(() => {
        localStorage.setItem('currentPageNumberOfAllNews', 1)
    }, [pathname])

    if(loading){
        return(
            <div className={allNewsStyle.spinnerContainer}>
              <ClipLoader color="#3498db" loading={loading} size={100} />
            </div>
        )
    }

  return (
    <div className={`${allNewsStyle.TotalContainer} ${topDecision && allNewsStyle.TotalContainerTop}`}>
        <div className={allNewsStyle.BreakingNewsContainer}>
            {breakingNews && <BreakingNewsTicker toSingleNews={toSingleNews}/>}
        </div>
        {/* <BreakingNewsTicker toSingleNews={toSingleNews}/> */}
        {/* !!!!!!!!!!!!!! */}
        <div className={allNewsStyle.newsListContainer}>
            {allNews?.map((news) => {
                return(
                    <div className={allNewsStyle.newsContainer} onClick={() => toSingleNews(news._id)}>
                            <div className={allNewsStyle.contentDiv}>
                                <div className={allNewsStyle.photoContainer}>
                                    <img src={news.Image} alt="" className={allNewsStyle.photo} />
                                </div>
                                <div>
                                    <h4 className={allNewsStyle.subCategory}>{news.SubCategory}</h4>    
                                </div>
                                <div>
                                    <h2 className={allNewsStyle.heading}>{news.Heading}</h2>
                                </div>
                            </div>
                            <div className={allNewsStyle.publishDiv}>
                                <div>
                                    <h4 className={allNewsStyle.subEditor}>{news.SubEditor}</h4>
                                </div>
                                <div>
                                    <h4 className={allNewsStyle.time}>{calculateTimeDifference(news.PublishedDateAndTime)} ago</h4>
                                </div>
                            </div>
                    </div>
                )
            })}
        </div>
      

        <div className={allNewsStyle.buttonsContainer}>
              <div>
                  <button className={`${allNewsStyle.prevButton} ${currentPageNumber===1 ? allNewsStyle.prevDisabled : ''}`} onClick={handlePrevPage} disabled={currentPageNumber===1}><IoCaretBackOutline /></button>
              </div>
              <div className={allNewsStyle.numberBtnContainer}>
                  {totalnumberOfpages <= 10 ?
                      [...Array(totalnumberOfpages)].map((_, index) => {
                        // console.log(index);
                          return(
                              <button className={`${allNewsStyle.numberbtn} ${currentPageNumber === index+1 ? allNewsStyle.activeBtn : ''}`} onClick={() => handlePageSelect(index+1)}>{index+1}</button>
                          )
                      })
                      :
                      <button className={allNewsStyle.numberbtn}>{currentPageNumber}</button>
                  }
              </div>
              <div>
                  <button className={`${allNewsStyle.nextButton} ${currentPageNumber===totalnumberOfpages ? allNewsStyle.nextDisabled : ''}`} onClick={handleNextPage} disabled={currentPageNumber===totalnumberOfpages}><IoCaretForwardOutline /></button>
              </div>
        </div>
    </div>
  )
}

export default AllNews
