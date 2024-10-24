import React, { useContext, useEffect } from 'react'
import AdminNewsPreviewStyle from './AdminNewsPreview.module.css'
import { IoBackspaceOutline } from "react-icons/io5";
import { FaRegThumbsUp } from "react-icons/fa";
import axios from 'axios';
import { AppContext } from './AppProvider';
import { useNavigate } from 'react-router-dom';

const AdminNewsPreview = ({newsData, getPreviewPageShow, refreshNewsDatas, purpose, id}) => {

  let {logoutFromTopNavbar} = useContext(AppContext)

  let navigateTo = useNavigate()

  let saveNews = async() => {
    try {
      let accessToken = JSON.parse(localStorage.getItem('accessToken'))
      // & AaddNews
      if(purpose === "AddNews"){
        let response = await axios.post(`http://localhost:8080/api/news/addNews`, newsData, {
          headers:{
            'authorization': `Bearer ${accessToken}`
          },
          withCredentials:true}
        )
  
        console.log(response);
        if(!response.data.error){
          refreshNewsDatas()
          getPreviewPageShow()
          navigateTo(-1)
        }
      // & EditNews
      }else if(purpose === "EditNews"){
        console.log(newsData);
        let response = await axios.put(`http://localhost:8080/api/news/editNews/${id}`, newsData, {
          headers:{
            'authorization': `Bearer ${accessToken}`
          },
          withCredentials:true}
        )

        console.log(response);
        if(!response.data.error){
          refreshNewsDatas()
          getPreviewPageShow()
          navigateTo(-2)
        }
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

            // & AaddNews
            if(purpose === "AddNews"){
              let {data} = await axios.post(`http://localhost:8080/api/news/addNews`, newsData, {
                headers:{
                  'authorization': `Bearer ${accessToken}`
                },
                withCredentials:true}
              )
              console.log(data);
  
              if(!response.data.error){
                refreshNewsDatas()
                getPreviewPageShow()
                navigateTo(-1)
              }
            // & EditNews
            }else if(purpose === "EditNews"){
              let {data} = await axios.put(`http://localhost:8080/api/news/editNews/${id}`, newsData, {
                headers:{
                  'authorization': `Bearer ${accessToken}`
                },
                withCredentials:true}
              )
              console.log(data);
  
              if(!response.data.error){
                refreshNewsDatas()
                getPreviewPageShow()
                navigateTo(-2)
              }
            }

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

  useEffect(() => {
  console.log(newsData);
  }, [newsData])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className={AdminNewsPreviewStyle.previewContainer}>
      <div className={AdminNewsPreviewStyle.singleNewscontainer}>
        <div className={AdminNewsPreviewStyle.singleNewsSubCategorySaveDiv}>
          <div className={AdminNewsPreviewStyle.singleNewsSubCategoryDiv}>
            <h4 className={AdminNewsPreviewStyle.singleNewsSubCategory}>{newsData?.SubCategory}</h4>
          </div>
          <div className={AdminNewsPreviewStyle.singleNewsBtnsDiv}>
            <div className={AdminNewsPreviewStyle.singleNewsBtnDiv}>
              <button className={AdminNewsPreviewStyle.singleNewsBtn} onClick={() => getPreviewPageShow()}>
                <span><IoBackspaceOutline size={17} /></span>
                Go Back
              </button>
            </div>
            <div className={AdminNewsPreviewStyle.singleNewsBtnDiv}>
              <button className={AdminNewsPreviewStyle.singleNewsBtn} onClick={saveNews}>
                <span><FaRegThumbsUp size={17} /></span>
                Save News
              </button>
            </div>
            {/* <div className={AdminNewsPreviewStyle.singleNewsBtnDiv}>
                {newsData?.isDeleted ?
                <button className={AdminNewsPreviewStyle.singleNewsBtn} onClick={selectDelete}>
                    <span><MdDeleteOutline size={18} /></span>
                    Undo Delete
                </button>
                :
                <button className={AdminNewsPreviewStyle.singleNewsBtn} onClick={selectDelete}>
                    <span><MdDeleteOutline size={18} /></span>
                    Delete News
              </button>}
            </div> */}
          </div>
        </div>
              
        <div className={AdminNewsPreviewStyle.singleNewsHeadingDiv}>
          <h2 className={AdminNewsPreviewStyle.singleNewsHeading}>{newsData?.Heading}</h2>
        </div>
        <div className={AdminNewsPreviewStyle.singleNewsSubEditordiv}>
          <div>
            <h5 className={AdminNewsPreviewStyle.singleNewsSubEditor}>{newsData?.SubEditor}</h5>
          </div>
          {/* <div className={AdminNewsPreviewStyle.timeContainer}>
            <h5 className={AdminNewsPreviewStyle.time}>{newsData?.PublishedDateAndTime}</h5>
          </div> */}
        </div>
        <div className={AdminNewsPreviewStyle.singleNewsSummaryDiv}>
          <h3 className={AdminNewsPreviewStyle.singleNewsSummary}>{newsData?.Summary}</h3>
        </div>
        <div className={AdminNewsPreviewStyle.singleNewsPhotoDiv}>
          <img src={newsData?.Image} alt="" className={AdminNewsPreviewStyle.singleNewsPhoto} />
        </div>
        {newsData?.Location && <div className={AdminNewsPreviewStyle.singleNewsLocationDiv}>
          <h5 className={AdminNewsPreviewStyle.singleNewsLocation}>{newsData?.Location}:</h5>
        </div>}
              
        <div className={AdminNewsPreviewStyle.singleNewsContentDiv}>
          {newsData?.Content.map((para) => {
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
    </div>
  )
}

export default AdminNewsPreview
