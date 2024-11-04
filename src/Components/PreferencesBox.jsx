import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from './AppProvider'
import axios from 'axios'
import preferenceBoxStyle  from './PreferencesBox.module.css'
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { RiArrowRightDoubleLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

const PreferencesBox = () => {
    let[preferncesArray, setPreferencesArray] = useState([])
    let[preferncesObject1, setPreferencesObject1] = useState({})
    let[preferncesObject2, setPreferencesObject2] = useState({})
    let[preferncesObject3, setPreferencesObject3] = useState({})
    let[preferncesObject4, setPreferencesObject4] = useState({})
    let[preferncesObject5, setPreferencesObject5] = useState({})

    let { logoutFromTopNavbar, savedNewsIds, updateSavedNewsIds, user, getCurrentCategory } = useContext(AppContext)

    let navigate = useNavigate()

    let fetchPreferenceArrays = async(currentPrefernce, arrayNumber) => {
      // console.log(currentPrefernce);
      // console.log(arrayNumber);
      try {
        let {data} = await axios.get(`${process.env.REACT_APP_API_URL}/news/filterByCategory?category=${currentPrefernce}&numberOfNews=5`)
        console.log(data);
        switch (arrayNumber) {
          case 1:
            setPreferencesObject1({preferredCategory:currentPrefernce, preferenceArray:data.filteredNewsByCategory})
            break;
          
          case 2:
            setPreferencesObject2({preferredCategory:currentPrefernce, preferenceArray:data.filteredNewsByCategory})
            break;
        
          case 3:
            setPreferencesObject3({preferredCategory:currentPrefernce, preferenceArray:data.filteredNewsByCategory})
            break;

          case 4:
            setPreferencesObject4({preferredCategory:currentPrefernce, preferenceArray:data.filteredNewsByCategory})
            break;

          case 5:
            setPreferencesObject5({preferredCategory:currentPrefernce, preferenceArray:data.filteredNewsByCategory})
            break;

          default:
            break;
        }
      } catch (error) {
        console.log(error);
      }
    }

    let selectCategory = (category) => {
      console.log(category);
      // setCurrentCategory(category)
      getCurrentCategory(category)
      localStorage.setItem('currentCategory', category)
      category = category.toLowerCase();
      console.log(category);
      navigate(`/news/${category}`)
    }

    let toSingleNews = (id) => {
      navigate(`/news/${id}`)
    }

    useEffect(() => {
        console.log(user);
        // console.log(user?.Preferences);
        setPreferencesArray(user?.Preferences)
    }, [user])

    useEffect(() => {
      // & Way 1
      preferncesArray?.map((preference, index) => {
        fetchPreferenceArrays(preference, index+1)
      })

    }, [preferncesArray])

    useEffect(() => {
        console.log(preferncesArray);
        console.log(preferncesObject1);
        console.log(preferncesObject2);
        console.log(preferncesObject3);
        console.log(preferncesObject4);
        console.log(preferncesObject5);
    })
  return (
    <div className={preferenceBoxStyle.preferenceBoxContainer}>
      {/* Prefernce 1 */}

      {Boolean(preferncesObject1?.preferenceArray?.length) && <div className={preferenceBoxStyle.singlePreferenceContainer}>
        <div className={preferenceBoxStyle.categoryTitleDiv}>
          <h4 className={preferenceBoxStyle.categoryTitle}>{preferncesObject1.preferredCategory}</h4>
        </div>

        <div className={preferenceBoxStyle.newsContainer}>
            {preferncesObject1.preferenceArray?.map((news) => {
              return (
                <div className={preferenceBoxStyle.singleNewsDiv} onClick={() => toSingleNews(news._id)}>

                  <div className={preferenceBoxStyle.subCategorySaveDiv}>
                    <div className={preferenceBoxStyle.subCategoryDiv}>
                      <h4 className={preferenceBoxStyle.subCategory}>{news.SubCategory}</h4>
                    </div>
                    <div className={preferenceBoxStyle.saveDiv}>
                      {savedNewsIds?.includes(news._id) ? 
                      <FaBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("unsave", news._id)}} className={preferenceBoxStyle.bookmark} />
                      : 
                      <FaRegBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("save", news._id)}} className={preferenceBoxStyle.bookmark} />
                      }
                    </div>
                  </div>

                  <div className={preferenceBoxStyle.headingDiv}>
                    <h5 className={preferenceBoxStyle.heading}>{news.Heading}</h5>
                  </div>
                  {/* <div className={preferenceBoxStyle.imageDiv}>
                    <img src={news.Image} alt="" className={preferenceBoxStyle.image} />
                  </div> */}
                </div>
              )
            })}
        </div>

        <div className={preferenceBoxStyle.buttonDiv}>
          <button className={preferenceBoxStyle.button} onClick={() => {selectCategory(preferncesObject1.preferredCategory)}}>More {preferncesObject1.preferredCategory} News <RiArrowRightDoubleLine size={22} /></button>
        </div>
        
      </div>}
      
      {/* Prefernce 2 */}

      {Boolean(preferncesObject2?.preferenceArray?.length) && <div className={preferenceBoxStyle.singlePreferenceContainer}>
        <div className={preferenceBoxStyle.categoryTitleDiv}>
          <h4 className={preferenceBoxStyle.categoryTitle}>{preferncesObject2.preferredCategory}</h4>
        </div>

        <div className={preferenceBoxStyle.newsContainer}>
            {preferncesObject2.preferenceArray?.map((news) => {
              return (
                <div className={preferenceBoxStyle.singleNewsDiv} onClick={() => toSingleNews(news._id)}>

                  <div className={preferenceBoxStyle.subCategorySaveDiv}>
                    <div className={preferenceBoxStyle.subCategoryDiv}>
                      <h4 className={preferenceBoxStyle.subCategory}>{news.SubCategory}</h4>
                    </div>
                    <div className={preferenceBoxStyle.saveDiv}>
                      {savedNewsIds?.includes(news._id) ? 
                      <FaBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("unsave", news._id)}} className={preferenceBoxStyle.bookmark} />
                      : 
                      <FaRegBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("save", news._id)}} className={preferenceBoxStyle.bookmark} />
                      }
                    </div>
                  </div>

                  <div className={preferenceBoxStyle.headingDiv}>
                    <h5 className={preferenceBoxStyle.heading}>{news.Heading}</h5>
                  </div>
                  {/* <div className={preferenceBoxStyle.imageDiv}>
                    <img src={news.Image} alt="" className={preferenceBoxStyle.image} />
                  </div> */}
                </div>
              )
            })}
        </div>

        <div className={preferenceBoxStyle.buttonDiv}>
          <button className={preferenceBoxStyle.button} onClick={() => {selectCategory(preferncesObject2.preferredCategory)}}>More {preferncesObject2.preferredCategory} News <RiArrowRightDoubleLine size={22} /> </button>
        </div>
        
      </div>}

      {/* Prefernce 3 */}

      {Boolean(preferncesObject3?.preferenceArray?.length) && <div className={preferenceBoxStyle.singlePreferenceContainer}>
        <div className={preferenceBoxStyle.categoryTitleDiv}>
          <h4 className={preferenceBoxStyle.categoryTitle}>{preferncesObject3.preferredCategory}</h4>
        </div>

        <div className={preferenceBoxStyle.newsContainer}>
            {preferncesObject3.preferenceArray?.map((news) => {
              return (
                <div className={preferenceBoxStyle.singleNewsDiv} onClick={() => toSingleNews(news._id)}>

                  <div className={preferenceBoxStyle.subCategorySaveDiv}>
                    <div className={preferenceBoxStyle.subCategoryDiv}>
                      <h4 className={preferenceBoxStyle.subCategory}>{news.SubCategory}</h4>
                    </div>
                    <div className={preferenceBoxStyle.saveDiv}>
                      {savedNewsIds?.includes(news._id) ? 
                      <FaBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("unsave", news._id)}} className={preferenceBoxStyle.bookmark} />
                      : 
                      <FaRegBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("save", news._id)}} className={preferenceBoxStyle.bookmark} />
                      }
                    </div>
                  </div>

                  <div className={preferenceBoxStyle.headingDiv}>
                    <h5 className={preferenceBoxStyle.heading}>{news.Heading}</h5>
                  </div>
                  {/* <div className={preferenceBoxStyle.imageDiv}>
                    <img src={news.Image} alt="" className={preferenceBoxStyle.image} />
                  </div> */}
                </div>
              )
            })}
        </div>

        <div className={preferenceBoxStyle.buttonDiv}>
          <button className={preferenceBoxStyle.button} onClick={() => {selectCategory(preferncesObject3.preferredCategory)}}>More {preferncesObject3.preferredCategory} News <RiArrowRightDoubleLine size={22} /></button>
        </div>
        
      </div>}

      {/* Prefernce 4 */}

      {Boolean(preferncesObject4?.preferenceArray?.length) && <div className={preferenceBoxStyle.singlePreferenceContainer}>
        <div className={preferenceBoxStyle.categoryTitleDiv}>
          <h4 className={preferenceBoxStyle.categoryTitle}>{preferncesObject4.preferredCategory}</h4>
        </div>

        <div className={preferenceBoxStyle.newsContainer}>
            {preferncesObject4.preferenceArray?.map((news) => {
              return (
                <div className={preferenceBoxStyle.singleNewsDiv} onClick={() => toSingleNews(news._id)}>

                  <div className={preferenceBoxStyle.subCategorySaveDiv}>
                    <div className={preferenceBoxStyle.subCategoryDiv}>
                      <h4 className={preferenceBoxStyle.subCategory}>{news.SubCategory}</h4>
                    </div>
                    <div className={preferenceBoxStyle.saveDiv}>
                      {savedNewsIds?.includes(news._id) ? 
                      <FaBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("unsave", news._id)}} className={preferenceBoxStyle.bookmark} />
                      : 
                      <FaRegBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("save", news._id)}} className={preferenceBoxStyle.bookmark} />
                      }
                    </div>
                  </div>

                  <div className={preferenceBoxStyle.headingDiv}>
                    <h5 className={preferenceBoxStyle.heading}>{news.Heading}</h5>
                  </div>
                  {/* <div className={preferenceBoxStyle.imageDiv}>
                    <img src={news.Image} alt="" className={preferenceBoxStyle.image} />
                  </div> */}
                </div>
              )
            })}
        </div>

        <div className={preferenceBoxStyle.buttonDiv}>
          <button className={preferenceBoxStyle.button} onClick={() => {selectCategory(preferncesObject4.preferredCategory)}}>More {preferncesObject4.preferredCategory} News <RiArrowRightDoubleLine size={22} /></button>
        </div>
        
      </div>}

      {/* Prefernce 5 */}

      {Boolean(preferncesObject5?.preferenceArray?.length) && <div className={preferenceBoxStyle.singlePreferenceContainer}>
        <div className={preferenceBoxStyle.categoryTitleDiv}>
          <h4 className={preferenceBoxStyle.categoryTitle}>{preferncesObject5.preferredCategory}</h4>
        </div>

        <div className={preferenceBoxStyle.newsContainer}>
            {preferncesObject5.preferenceArray?.map((news) => {
              return (
                <div className={preferenceBoxStyle.singleNewsDiv} onClick={() => toSingleNews(news._id)}>
                  <div className={preferenceBoxStyle.subCategorySaveDiv}>
                    <div className={preferenceBoxStyle.subCategoryDiv}>
                      <h4 className={preferenceBoxStyle.subCategory}>{news.SubCategory}</h4>
                    </div>
                    <div className={preferenceBoxStyle.saveDiv}>
                      {savedNewsIds?.includes(news._id) ? 
                      <FaBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("unsave", news._id)}} className={preferenceBoxStyle.bookmark} />
                      : 
                      <FaRegBookmark onClick={(e) => {e.stopPropagation();updateSavedNewsIds("save", news._id)}} className={preferenceBoxStyle.bookmark} />
                      }
                    </div>
                  </div>


                  <div className={preferenceBoxStyle.headingDiv}>
                    <h5 className={preferenceBoxStyle.heading}>{news.Heading}</h5>
                  </div>
                  {/* <div className={preferenceBoxStyle.imageDiv}>
                    <img src={news.Image} alt="" className={preferenceBoxStyle.image} />
                  </div> */}
                </div>
              )
            })}
        </div>

        <div className={preferenceBoxStyle.buttonDiv}>
          <button className={preferenceBoxStyle.button} onClick={() => {selectCategory(preferncesObject5.preferredCategory)}}>More {preferncesObject5.preferredCategory} News <RiArrowRightDoubleLine size={22} /></button>
        </div>
        
      </div>}
    </div>
  )
}

export default PreferencesBox
