import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import breakingNewsStyle from './BreakingNewsTicker.module.css'
import { useNavigate } from 'react-router-dom'

const BreakingNewsTicker = ({toSingleNews}) => {
    // let[breakingNewsArray, setBreakingNewsArray] = useState([])
    let[breakingNews, setBreakingNews] = useState()

    let navigateTo = useNavigate()

    let fetchBreakingNews = async() => {
        try {
            let response = await axios.get('http://localhost:8080/api/news/fetchBreakingNewses')
            console.log(response);
            setBreakingNews(response.data.breakingNewses)
        } catch (error) {
            console.log(error);
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
      <div className={breakingNewsStyle.breakingNewsDiv} onClick={() => {toSingleNews(breakingNews[0]?._id)}}>
        <h4 className={breakingNewsStyle.breakingNews}>{breakingNews && breakingNews[0]?.Heading}</h4>
      </div>
    </div>
  )
}

export default BreakingNewsTicker
