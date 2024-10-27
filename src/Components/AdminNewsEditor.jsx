import React, { useEffect, useRef, useState } from 'react'
import adminNewsEditorStyle from './AdminNewsEditor.module.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { IoMdArrowDropdown } from "react-icons/io";
import { LuPlus } from "react-icons/lu";
import AdminNewsPreview from './AdminNewsPreview';

const AdminNewsEditor = () => {
  let[newsData, setNewsData] = useState()
  let[editedNewsData, setEditedNewsData] = useState()
  let[formData, setFormData] = useState({ SubCategory:"", Heading:"", Summary:"", SubEditor:"", Image:"", Location:"" })
  let[category, setCategory] = useState()
  let[newsStatus, setNewsStatus] = useState()
  let[newsContent, setNewsContent] = useState([""])
  let[categoryListShow, setCategoryListShow] = useState(false)
  let[statusListShow, setStatusListShow] = useState(false)
  let[contentContainerShow, setContentContainerShow] = useState(true)
  let[previewPageShow, setPreviewPageShow] = useState(false)
  let[categoryError, setCategoryError] = useState(false)
  let[subCategoryError, setSubCategoryError] = useState(false)
  let[headingError, setHeadingError] = useState(false)
  let[summaryError, setSummaryError] = useState(false)
  let[subEditorError, setSubEditorError] = useState(false)
  let[imageError, setImageError] = useState(false)
  let[contentError, setContentError] = useState(false)

  let {id} = useParams()

  let dropRefCategory = useRef(null)
  let dropRefStatus = useRef(null)

  let categoryList = ['Politics', 'Economy', 'World', 'Security', 'Law', 'Science', 'Society', 'Culture', 'Sports', 'Entertainment']
  let newsStatusList = ['Breaking', "EditorPick", 'TopTen', 'Normal']

  let getPreviewPageShow = () => {
    setPreviewPageShow(false)
  }

  let refreshNewsDatas = () => {
    setFormData({ SubCategory:"", Heading:"", Summary:"", SubEditor:"", Image:"", Location:"" })
    setCategory('')
    setNewsStatus('')
    setNewsContent([""])
  }

  // & fetching news detaisl to edit
  let fetchNewsDetails = async() => {
    try {
      let response = await axios.get(`${process.env.REACT_APP_API_URL}/news/fetchSingleNews/${id}`)
      // console.log(response);
      // console.log(response.data.singleNews);
      setNewsData(response.data.singleNews)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchNewsDetails()
  }, [])

  // & add new paragraph
  let addNewPara = (index) => {
    let leftArray = newsContent.slice(0, index+1)
    let rightArray = newsContent.slice(index+1)
    setNewsContent([...leftArray, "", ...rightArray])
  }

  // & remove a paragraph
  let removePara = (index) => {
    let leftArray = newsContent.slice(0, index)
    let rightArray = newsContent.slice(index+1)
    if(!leftArray.length && !rightArray.length){
      setContentContainerShow(false)
      setNewsContent([""])
    }else{
      setNewsContent([...leftArray, ...rightArray])
    }
  }

    // & Update News content(array)
    let updateNewsContent = ({target:{name, value}}) => {
      let newsContentIndex = name.slice(9) - 1
      // let newsContentIndex = Number(name.replace("Paragraph", "")) - 1;
      let currentContentArray = [...newsContent]
      currentContentArray[newsContentIndex] = value
      setNewsContent(currentContentArray)
    }

    // & Select category from list
    let selectCategory = (category) => {
      setCategory(category)
      setCategoryListShow(false)
    }

    // & Select news status from list
    let selectNewsStatus = (status) => {
      setNewsStatus(status)
      setStatusListShow(false)
    }

    // & Update form data
    let updateFormdata = ({target:{name, value}}) => {
      setFormData({...formData, [name]:value})
    }

  // & update total news data
  let updateNewsdata = (e) => {
    e.preventDefault()
    console.log('Submiting form');
    // let filteredArray = newsContent
    let filteredContentArray = newsContent.filter((ele) => {
      return ele !== ""
    })
    // console.log(newsContent);
    // console.log(filteredContentArray);
    // // setNewsContent(filteredContentArray)
    // console.log(formData);
    // console.log(category);
    // console.log(newsStatus);
    
    console.log(formData.SubCategory && formData.Heading && formData.Summary && formData.SubEditor && formData.Image && category && filteredContentArray.length >= 1);
    if(formData.SubCategory && formData.Heading && formData.Summary && formData.SubEditor && formData.Image && category && filteredContentArray.length >= 1){
      // console.log('Entered');
      setEditedNewsData({...formData, Category:category, newsStatus, Content : filteredContentArray})
    }else{
      if(!formData.SubCategory){
        setSubCategoryError(true)
      }
      if(!formData.Heading){
        setHeadingError(true)
      }

      if(!formData.Summary){
        setSummaryError(true)
      }

      if(!formData.SubEditor){
        setSubEditorError(true)
      }

      if(!formData.Image){
        setImageError(true)
      }

      if(!category){
        setCategoryError(true)
      }

      // console.log(filteredContentArray.length === 0);
      if(filteredContentArray.length === 0){
        setContentError(true)
      }

    }
    
  }

    // & function when clicking outside(mousedown event)
    let handleClickOutsidedrop = (event) => {
      if(dropRefCategory.current && !dropRefCategory.current.contains(event.target)){
          setCategoryListShow(false)
      }
      if(dropRefStatus.current && !dropRefStatus.current.contains(event.target)){
          setStatusListShow(false)
      }
    }

    useEffect(() => {
      // & Hiding the user drop
  
      document.addEventListener('mousedown', handleClickOutsidedrop)
  
      return () => {
          document.removeEventListener('mousedown', handleClickOutsidedrop)
      }
    })

    // & conditional checking before going to the preview page
    useEffect(() => {
      // let filteredContentArray = newsContent.filter((ele) => {
      //   return ele !== ""
      // })
      console.log(newsData?.SubCategory && newsData?.Heading && newsData?.Summary && newsData?.SubEditor && newsData?.Image && newsData?.Category && editedNewsData?.Content?.length >= 1);
      if(editedNewsData?.SubCategory && editedNewsData?.Heading && editedNewsData?.Summary && editedNewsData?.SubEditor && editedNewsData?.Image && editedNewsData?.Category && editedNewsData?.Content?.length >= 1){
        setPreviewPageShow(true)
      }
    }, [editedNewsData])
  

  useEffect(() => {
    if(newsData){
      setCategory(newsData?.Category)
      setNewsStatus(newsData?.newsStatus)
      setFormData({ SubCategory : newsData.SubCategory, Heading : newsData.Heading, Summary : newsData.Summary, SubEditor : newsData.SubEditor, Image : newsData.Image, Location : newsData.Location})
      setNewsContent(newsData.Content)
    }
  }, [newsData])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    console.log(newsData);
    console.log(formData);
    console.log(category);
    console.log(newsStatus);
    console.log(newsContent);
    console.log(previewPageShow);
  })

  return (
    <div className={adminNewsEditorStyle.newsEditorContainer}>
      {!previewPageShow ?
        <div className={adminNewsEditorStyle.addNewsContainer}>
          <div className={adminNewsEditorStyle.pageTitileDiv}>
            <h4 className={adminNewsEditorStyle.pageTitile}><span className={adminNewsEditorStyle.pageTitileAdd}>Add</span> <span className={adminNewsEditorStyle.pageTitileNews}>News</span></h4>
          </div>

          <div className={adminNewsEditorStyle.selectButtonsListDiv}>
            {/* two selection portion for category and news status */}
            <div ref={dropRefCategory} className={adminNewsEditorStyle.selectButtonListDiv}>
              <div className={adminNewsEditorStyle.headingDiv}>
                <h5 className={adminNewsEditorStyle.heading}>Category</h5>
              </div>
              <div className={adminNewsEditorStyle.selectBtnDiv}>
                {!categoryListShow && <button className={adminNewsEditorStyle.selectBtn} onClick={() => {setCategoryListShow(true);setCategoryError(false)}}>{category ? category : 'Select Category'}<IoMdArrowDropdown className={adminNewsEditorStyle.dropDownIcon} size={19} /></button>}
              </div>

              {categoryListShow && <div className={adminNewsEditorStyle.selectListDiv}>
                {categoryList.map((category) => {
                  return(
                    <div className={adminNewsEditorStyle.selectListBtnDiv}>
                      <button className={adminNewsEditorStyle.selectListBtn} onClick={() => selectCategory(category)}>{category}</button>
                    </div>
                  )
                })}
              </div>}

              <div className={adminNewsEditorStyle.errorDiv}>
                {categoryError && <h5 className={adminNewsEditorStyle.error}>Select a Category</h5>}
              </div>
            </div>
            <div ref={dropRefStatus} className={adminNewsEditorStyle.selectButtonListDiv}>
              <div className={adminNewsEditorStyle.headingDiv}>
                <h5 className={adminNewsEditorStyle.heading}>News Status</h5>
              </div>
              <div className={adminNewsEditorStyle.selectBtnDiv}>
                {!statusListShow && <button className={adminNewsEditorStyle.selectBtn} onClick={() => {setStatusListShow(true)}}>{newsStatus ? newsStatus : 'Select News Status'}<IoMdArrowDropdown className={adminNewsEditorStyle.dropDownIcon} size={19} /></button>}
              </div>
              {statusListShow && <div className={adminNewsEditorStyle.selectListDiv}>
                {newsStatusList.map((status) => {
                  return(
                    <div className={adminNewsEditorStyle.selectListBtnDiv}>
                      <button className={adminNewsEditorStyle.selectListBtn} onClick={() => selectNewsStatus(status)}>{status}</button>
                    </div>
                  )
                })}
              </div>}
            </div>
          </div>

          {/* <div> */}
            <form action="" onSubmit={updateNewsdata} className={adminNewsEditorStyle.form}>
              <div className={adminNewsEditorStyle.formFirstDiv}>
                {/* For subcategory, SubEditor and Location */}
                <div className={adminNewsEditorStyle.firstDivInputErrorDiv}>
                  <div className={adminNewsEditorStyle.headingDiv}>
                    <h5 className={adminNewsEditorStyle.heading}>Subcategory</h5>
                  </div>
                  <div className={adminNewsEditorStyle.firstDivInputDiv}>
                    <input className={adminNewsEditorStyle.firstDivInput} value={formData.SubCategory} type="text" placeholder='Enter Subcategory' name='SubCategory' onChange={updateFormdata} onClick={() => {setSubCategoryError(false)}} />
                  </div>
                  <div className={adminNewsEditorStyle.errorDiv}>
                    {subCategoryError && <h5 className={adminNewsEditorStyle.error}>Subcategory is required</h5>}
                  </div>
                </div>
                <div className={adminNewsEditorStyle.firstDivInputErrorDiv}>
                  <div className={adminNewsEditorStyle.headingDiv}>
                    <h5 className={adminNewsEditorStyle.heading}>Subeditor</h5>
                  </div>
                  <div className={adminNewsEditorStyle.firstDivInputDiv}>
                    <input className={adminNewsEditorStyle.firstDivInput} value={formData.SubEditor} type="text" placeholder='Enter Subeditor Name' name='SubEditor' onChange={updateFormdata} onClick={() => {setSubEditorError(false)}} />
                  </div>
                  <div className={adminNewsEditorStyle.errorDiv}>
                    {subEditorError && <h5 className={adminNewsEditorStyle.error}>Subeditor is required</h5>}
                  </div>
                </div>
                <div className={adminNewsEditorStyle.firstDivInputErrorDiv}>
                  <div className={adminNewsEditorStyle.headingDiv}>
                    <h5 className={adminNewsEditorStyle.heading}>Location</h5>
                  </div>
                  <div className={adminNewsEditorStyle.firstDivInputDiv}>
                    <input className={adminNewsEditorStyle.firstDivInput} value={formData.Location} type="text" placeholder='Enter Location' name='Location' onChange={updateFormdata} />
                  </div>
                  <div className={adminNewsEditorStyle.errorDiv}>

                  </div>

                </div>
              </div>

              <div className={adminNewsEditorStyle.formSecondDiv}>
                {/* Heading */}
                <div className={adminNewsEditorStyle.headingDiv}>
                  <h5 className={adminNewsEditorStyle.heading}>Heading</h5>
                </div>
                <div className={adminNewsEditorStyle.SecondDivtextAreaDiv}>
                  <textarea className={adminNewsEditorStyle.SecondDivtextArea} value={formData.Heading} name="Heading" id="" placeholder='Enter Heading of News' rows={3} onChange={updateFormdata} onClick={() => {setHeadingError(false)}} ></textarea>
                </div>
                <div className={adminNewsEditorStyle.errorDiv}>
                  {headingError && <h5 className={adminNewsEditorStyle.error}>Heading is required</h5>}
                </div>
              </div>

              <div className={adminNewsEditorStyle.formThirdDiv}>
                {/* Image */}

                <div className={adminNewsEditorStyle.formThirdDivTextAreaDiv}>
                  <div className={adminNewsEditorStyle.headingDiv}>
                    <h5 className={adminNewsEditorStyle.heading}>Image</h5>
                  </div>
                  <textarea className={adminNewsEditorStyle.formThirdDivTextArea} value={formData.Image} placeholder='Paste a image link' name='Image' rows={3} onChange={updateFormdata} onClick={() => {setImageError(false)}} ></textarea>
                </div>
                <div className={adminNewsEditorStyle.errorDiv}>
                  {imageError && <h5 className={adminNewsEditorStyle.error}>Image link is required</h5>}
                </div>
              </div>

              <div className={adminNewsEditorStyle.formFourthDiv} >
                {/* Summary */}
                <div className={adminNewsEditorStyle.headingDiv}>
                  <h5 className={adminNewsEditorStyle.heading}>Summary</h5>
                </div>
                <div className={adminNewsEditorStyle.formFourthDivTextAreaDiv}>
                  <textarea className={adminNewsEditorStyle.formFourthDivTextArea} value={formData.Summary} name="Summary" id="" placeholder='Enter Summary' rows={6} onChange={updateFormdata} onClick={() => {setSummaryError(false)}}></textarea>
                </div>
                <div className={adminNewsEditorStyle.errorDiv}>
                  {summaryError && <h5 className={adminNewsEditorStyle.error}>Summary is required</h5>}
                </div>
              </div>

              <div className={adminNewsEditorStyle.formFifthDiv}>
                <div className={adminNewsEditorStyle.formFifthDivStartedDiv}>
                  <div className={adminNewsEditorStyle.headingDiv}>
                    <h4 className={adminNewsEditorStyle.heading}>News Content</h4>
                  </div>
                  <div className={adminNewsEditorStyle.addContentBtnDiv}>
                    {!contentContainerShow && <button type='button' className={adminNewsEditorStyle.addContentBtn} onClick={() => {setContentContainerShow(true);setContentError(false )}}>Add Contents <span className={adminNewsEditorStyle.plusIconSpan}><LuPlus size={17} /></span></button>}
                  </div>
                  <div className={adminNewsEditorStyle.errorDiv}>
                    {contentError && <h5 className={adminNewsEditorStyle.error}>Content is required</h5>}
                  </div>
                </div>
                {contentContainerShow && <div onClick={() => {setContentError(false)}} className={adminNewsEditorStyle.paragraphsDiv}>
                  {newsContent.map((para, index) => {
                    return(
                      <div className={adminNewsEditorStyle.paragraphDiv}>
                        <div className={adminNewsEditorStyle.removeBtnDiv}>
                          <button type='button' className={adminNewsEditorStyle.removeBtn} onClick={() => removePara(index)}>Remove Paragraph {index+1}</button>
                        </div>
                        <div className={adminNewsEditorStyle.paragraphTextAreaDiv}>
                          <textarea name={`Paragraph${index+1}`} className={adminNewsEditorStyle.paragraphTextArea} id="" placeholder="Add Content to Paragraph" rows={8} value={newsContent[index]} onChange={updateNewsContent}></textarea>
                        </div>
                        <div className={adminNewsEditorStyle.newParaBtnDiv}>
                          <button type='button' className={adminNewsEditorStyle.newParaBtn} onClick={() => addNewPara(index)}>Add New Paragraph</button>
                        </div>
                      </div>
                    )
                  })}
                </div>}
              </div>
                
              <div className={adminNewsEditorStyle.previewBtnDiv}>
                {/* button */}
                <button type='submit' className={adminNewsEditorStyle.previewBtn}>Show Preview</button>
              </div>
            </form>
          {/* </div> */}
        </div>
        :
        <div className={adminNewsEditorStyle.previewContainer}>
          <AdminNewsPreview newsData={editedNewsData} getPreviewPageShow={getPreviewPageShow} refreshNewsDatas={refreshNewsDatas} purpose="EditNews" id={id} />
        </div>

      }
    </div>
  )
}

export default AdminNewsEditor
