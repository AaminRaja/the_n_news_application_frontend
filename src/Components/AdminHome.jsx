import React, { useContext, useEffect, useRef, useState } from 'react'
import adminHomeStyle from './AdminHome.module.css'
import { useNavigate } from 'react-router-dom'
import AdminNewsPreview from './AdminNewsPreview'
import { IoMdArrowDropdown } from "react-icons/io";
import { LuPlus } from "react-icons/lu";
import { id } from 'date-fns/locale';
import { AppContext } from './AppProvider';

const AdminHome = () => {
  let[newsData, setNewsData] = useState()
  let[formData, setFormData] = useState({ SubCategory:"", Heading:"", Summary:"", SubEditor:"", Image:"", Location:"" })
  let[category, setCategory] = useState()
  let[newsStatus, setNewsStatus] = useState()
  let[newsContent, setNewsContent] = useState([""])
  // let[numberOfParagraphs, setNumberOfParagraphs] = useState(1)
  let[categoryListShow, setCategoryListShow] = useState(false)
  let[statusListShow, setStatusListShow] = useState(false)
  let[contentContainerShow, setContentContainerShow] = useState(false)
  let[previewPageShow, setPreviewPageShow] = useState(false)
  let[categoryError, setCategoryError] = useState(false)
  let[subCategoryError, setSubCategoryError] = useState(false)
  let[headingError, setHeadingError] = useState(false)
  let[summaryError, setSummaryError] = useState(false)
  let[subEditorError, setSubEditorError] = useState(false)
  let[imageError, setImageError] = useState(false)
  let[contentError, setContentError] = useState(false)

  let {getCurrentCategory} = useContext(AppContext)

  let dropRefCategory = useRef(null)
  let dropRefStatus = useRef(null)

  let navigateTo = useNavigate()
  
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
    console.log(newsContent);
    console.log(filteredContentArray);
    // setNewsContent(filteredContentArray)
    console.log(formData);
    console.log(category);
    console.log(newsStatus);
    
    console.log(formData.SubCategory && formData.Heading && formData.Summary && formData.SubEditor && formData.Image && category && filteredContentArray.length >= 1);
    if(formData.SubCategory && formData.Heading && formData.Summary && formData.SubEditor && formData.Image && category && filteredContentArray.length >= 1){
      console.log('Entered');
      setNewsData({...formData, Category:category, newsStatus, Content : filteredContentArray})
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
    window.scrollTo(0, 0)
    getCurrentCategory("Home")
    // & Hiding the user drop

    document.addEventListener('mousedown', handleClickOutsidedrop)

    return () => {
        document.removeEventListener('mousedown', handleClickOutsidedrop)
    }
  }, [])

  // & conditional checking before going to the preview page
  useEffect(() => {
    // let filteredContentArray = newsContent.filter((ele) => {
    //   return ele !== ""
    // })
    console.log(newsData?.SubCategory && newsData?.Heading && newsData?.Summary && newsData?.SubEditor && newsData?.Image && newsData?.Category && newsData?.Content?.length >= 1);
    if(newsData?.SubCategory && newsData?.Heading && newsData?.Summary && newsData?.SubEditor && newsData?.Image && newsData?.Category && newsData?.Content?.length >= 1){
      setPreviewPageShow(true)
    }
  }, [newsData])

  
  useEffect(() => {
    console.log(newsContent);
    console.log(category);
    console.log(newsStatus);
    console.log(formData);
    console.log(previewPageShow);
    console.log(contentError);
    console.log(newsData);
  })
  return (
    <div  className={adminHomeStyle.adminHomeContainer}>
      {!previewPageShow ?
      <div className={adminHomeStyle.addNewsContainer}>
        <div className={adminHomeStyle.pageTitileDiv}>
          <h4 className={adminHomeStyle.pageTitile}><span className={adminHomeStyle.pageTitileAdd}>Add</span> <span className={adminHomeStyle.pageTitileNews}>News</span></h4>
        </div>

        <div className={adminHomeStyle.selectButtonsListDiv}>
          {/* two selection portion for category and news status */}
          <div ref={dropRefCategory} className={adminHomeStyle.selectButtonListDiv}>
            <div className={adminHomeStyle.headingDiv}>
              <h5 className={adminHomeStyle.heading}>Category</h5>
            </div>
            <div className={adminHomeStyle.selectBtnDiv}>
              {!categoryListShow && <button className={adminHomeStyle.selectBtn} onClick={() => {setCategoryListShow(true);setCategoryError(false)}}>{category ? category : 'Select Category'}<IoMdArrowDropdown className={adminHomeStyle.dropDownIcon} size={19} /></button>}
            </div>
            
            {categoryListShow && <div className={adminHomeStyle.selectListDiv}>
              {categoryList.map((category) => {
                return(
                  <div className={adminHomeStyle.selectListBtnDiv}>
                    <button className={adminHomeStyle.selectListBtn} onClick={() => selectCategory(category)}>{category}</button>
                  </div>
                )
              })}
            </div>}

            <div className={adminHomeStyle.errorDiv}>
              {categoryError && <h5 className={adminHomeStyle.error}>Select a Category</h5>}
            </div>
          </div>
          <div ref={dropRefStatus} className={adminHomeStyle.selectButtonListDiv}>
            <div className={adminHomeStyle.headingDiv}>
              <h5 className={adminHomeStyle.heading}>News Status</h5>
            </div>
            <div className={adminHomeStyle.selectBtnDiv}>
              {!statusListShow && <button className={adminHomeStyle.selectBtn} onClick={() => {setStatusListShow(true)}}>{newsStatus ? newsStatus : 'Select News Status'}<IoMdArrowDropdown className={adminHomeStyle.dropDownIcon} size={19} /></button>}
            </div>
            {statusListShow && <div className={adminHomeStyle.selectListDiv}>
              {newsStatusList.map((status) => {
                return(
                  <div className={adminHomeStyle.selectListBtnDiv}>
                    <button className={adminHomeStyle.selectListBtn} onClick={() => selectNewsStatus(status)}>{status}</button>
                  </div>
                )
              })}
            </div>}
          </div>
        </div>

        {/* <div> */}
          <form action="" onSubmit={updateNewsdata} className={adminHomeStyle.form}>
            <div className={adminHomeStyle.formFirstDiv}>
              {/* For subcategory, SubEditor and Location */}
              <div className={adminHomeStyle.firstDivInputErrorDiv}>
                <div className={adminHomeStyle.headingDiv}>
                  <h5 className={adminHomeStyle.heading}>Subcategory</h5>
                </div>
                <div className={adminHomeStyle.firstDivInputDiv}>
                  <input className={adminHomeStyle.firstDivInput} value={formData.SubCategory} type="text" placeholder='Enter Subcategory' name='SubCategory' onChange={updateFormdata} onClick={() => {setSubCategoryError(false)}} />
                </div>
                <div className={adminHomeStyle.errorDiv}>
                  {subCategoryError && <h5 className={adminHomeStyle.error}>Subcategory is required</h5>}
                </div>
              </div>
              <div className={adminHomeStyle.firstDivInputErrorDiv}>
                <div className={adminHomeStyle.headingDiv}>
                  <h5 className={adminHomeStyle.heading}>Subeditor</h5>
                </div>
                <div className={adminHomeStyle.firstDivInputDiv}>
                  <input className={adminHomeStyle.firstDivInput} value={formData.SubEditor} type="text" placeholder='Enter Subeditor Name' name='SubEditor' onChange={updateFormdata} onClick={() => {setSubEditorError(false)}} />
                </div>
                <div className={adminHomeStyle.errorDiv}>
                  {subEditorError && <h5 className={adminHomeStyle.error}>Subeditor is required</h5>}
                </div>
              </div>
              <div className={adminHomeStyle.firstDivInputErrorDiv}>
                <div className={adminHomeStyle.headingDiv}>
                  <h5 className={adminHomeStyle.heading}>Location</h5>
                </div>
                <div className={adminHomeStyle.firstDivInputDiv}>
                  <input className={adminHomeStyle.firstDivInput} value={formData.Location} type="text" placeholder='Enter Location' name='Location' onChange={updateFormdata} />
                </div>
                <div className={adminHomeStyle.errorDiv}>
                  
                </div>
                
              </div>
            </div>

            <div className={adminHomeStyle.formSecondDiv}>
              {/* Heading */}
              <div className={adminHomeStyle.headingDiv}>
                <h5 className={adminHomeStyle.heading}>Heading</h5>
              </div>
              <div className={adminHomeStyle.SecondDivtextAreaDiv}>
                <textarea className={adminHomeStyle.SecondDivtextArea} value={formData.Heading} name="Heading" id="" placeholder='Enter Heading of News' rows={3} onChange={updateFormdata} onClick={() => {setHeadingError(false)}} ></textarea>
              </div>
              <div className={adminHomeStyle.errorDiv}>
                {headingError && <h5 className={adminHomeStyle.error}>Heading is required</h5>}
              </div>
            </div>

            <div className={adminHomeStyle.formThirdDiv}>
              {/* Image */}
              
              <div className={adminHomeStyle.formThirdDivTextAreaDiv}>
                <div className={adminHomeStyle.headingDiv}>
                  <h5 className={adminHomeStyle.heading}>Image</h5>
                </div>
                <textarea className={adminHomeStyle.formThirdDivTextArea} value={formData.Image} placeholder='Paste a image link' name='Image' rows={3} onChange={updateFormdata} onClick={() => {setImageError(false)}} ></textarea>
              </div>
              <div className={adminHomeStyle.errorDiv}>
                {imageError && <h5 className={adminHomeStyle.error}>Image link is required</h5>}
              </div>
            </div>

            <div className={adminHomeStyle.formFourthDiv} >
              {/* Summary */}
              <div className={adminHomeStyle.headingDiv}>
                <h5 className={adminHomeStyle.heading}>Summary</h5>
              </div>
              <div className={adminHomeStyle.formFourthDivTextAreaDiv}>
                <textarea className={adminHomeStyle.formFourthDivTextArea} value={formData.Summary} name="Summary" id="" placeholder='Enter Summary' rows={6} onChange={updateFormdata} onClick={() => {setSummaryError(false)}}></textarea>
              </div>
              <div className={adminHomeStyle.errorDiv}>
                {summaryError && <h5 className={adminHomeStyle.error}>Summary is required</h5>}
              </div>
            </div>

            <div className={adminHomeStyle.formFifthDiv}>
              <div className={adminHomeStyle.formFifthDivStartedDiv}>
                <div className={adminHomeStyle.headingDiv}>
                  <h4 className={adminHomeStyle.heading}>News Content</h4>
                </div>
                <div className={adminHomeStyle.addContentBtnDiv}>
                  {!contentContainerShow && <button type='button' className={adminHomeStyle.addContentBtn} onClick={() => {setContentContainerShow(true);setContentError(false )}}>Add Contents <span className={adminHomeStyle.plusIconSpan}><LuPlus size={17} /></span></button>}
                </div>
                <div className={adminHomeStyle.errorDiv}>
                  {contentError && <h5 className={adminHomeStyle.error}>Content is required</h5>}
                </div>
              </div>
              {contentContainerShow && <div onClick={() => {setContentError(false)}} className={adminHomeStyle.paragraphsDiv}>
                {newsContent.map((para, index) => {
                  return(
                    <div className={adminHomeStyle.paragraphDiv}>
                      <div className={adminHomeStyle.removeBtnDiv}>
                        <button type='button' className={adminHomeStyle.removeBtn} onClick={() => removePara(index)}>Remove Paragraph {index+1}</button>
                      </div>
                      <div className={adminHomeStyle.paragraphTextAreaDiv}>
                        <textarea name={`Paragraph${index+1}`} className={adminHomeStyle.paragraphTextArea} id="" placeholder="Add Content to Paragraph" rows={8} value={newsContent[index]} onChange={updateNewsContent}></textarea>
                      </div>
                      <div className={adminHomeStyle.newParaBtnDiv}>
                        <button type='button' className={adminHomeStyle.newParaBtn} onClick={() => addNewPara(index)}>Add New Paragraph</button>
                      </div>
                    </div>
                  )
                })}
              </div>}
            </div>
              
            <div className={adminHomeStyle.previewBtnDiv}>
              {/* button */}
              <button type='submit' className={adminHomeStyle.previewBtn}>Show Preview</button>
            </div>
          </form>
        {/* </div> */}
      </div>
      :
      <div className={adminHomeStyle.previewContainer}>
        <AdminNewsPreview newsData={newsData} getPreviewPageShow={getPreviewPageShow} refreshNewsDatas={refreshNewsDatas} purpose="AddNews" />
      </div>
      
      }
    </div>
  )
}

export default AdminHome