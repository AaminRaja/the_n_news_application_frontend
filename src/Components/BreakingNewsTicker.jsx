import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import breakingNewsStyle from './BreakingNewsTicker.module.css'
import { useNavigate } from 'react-router-dom'
import { AppContext } from './AppProvider'

const BreakingNewsTicker = () => {
    // let[breakingNewsArray, setBreakingNewsArray] = useState([])
    let[breakingNews, setBreakingNews] = useState()

    let {user} = useContext(AppContext)

    let navigateTo = useNavigate()

    let fetchBreakingNews = async() => {
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_URL}/news/fetchBreakingNewses`)
            console.log(response);
            setBreakingNews(response.data.breakingNewses)
        } catch (error) {
            console.log(error);
        }
    }

    let toSingleNews = () => {
      // console.log(breakingNews);
      // console.log(user);
      
      if(breakingNews?.length && user){
        console.log("navigating from here");
        navigateTo(`/news/${breakingNews[0]?._id}`)
      }else if(breakingNews?.length && !user){
        console.log("navigating from here");
        navigateTo(`/${breakingNews[0]?._id}`)
      }
      
    }

    useEffect(() => {
        fetchBreakingNews()
    }, [])

    useEffect(() => {
        // console.log(breakingNewsArray);
        console.log(breakingNews);
    })
  return (
    <div className={breakingNewsStyle.TotalContainer}>
      <div className={breakingNewsStyle.breakingNewsHeaderDiv}>
        <h4 className={breakingNewsStyle.breakingNewsHeader}>Breaking News!</h4>
      </div>
      <div className={breakingNewsStyle.breakingNewsDiv} onClick={toSingleNews}>
        <h4 className={breakingNewsStyle.breakingNews}>{breakingNews && breakingNews[0]?.Heading}</h4>
      </div>
    </div>
  )
}

export default BreakingNewsTicker
