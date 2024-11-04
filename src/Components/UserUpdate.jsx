import React, { useContext, useEffect, useState } from 'react'
import userUpdateStyle from './UserUpdate.module.css'
import { useForm } from 'react-hook-form'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './AppProvider';

const UserUpdate = () => {
  let[userVerified, setUserVerified] = useState(false)
  let[preferences, setPreferences] = useState([])
//   let[isPassword, setIsPassword] = useState(true)
//   let[isConfirmPassword, setIsConfirmPassword] = useState(true)
//   let[isPasswordsMatched, setIsPasswordsMatched] = useState(true)
  let[passwordToVerify, setPasswordToVerify] = useState()
  let[currentPasswordError, setCurrentPasswordError] = useState(false)
  let[verifyPassVisible, setVerifyPassVisible] = useState(true)
  let[duplicateUserName, setDuplicateUserNameError] = useState(false)
  let[readerOrEditor, setReaderOrEditor] = useState(false)
  let[isLoading, setIsLoading] = useState(false)

  let { user, logoutFromTopNavbar, getUserFromLogin} = useContext(AppContext)

  let navigateTo = useNavigate()

  let preferenceOptions = ['Politics', 'Economy', 'World', 'Security', 'Law', 'Science', 'Society', 'Culture', 'Sports', 'Entertainment']

  let {register, handleSubmit, setValue, formState:{errors}, reset} = useForm()

  let sendFormData = async(formData) => {
    console.log(formData);
      try {
        //   if(formData.Password !== formData.ConfirmPassword){
        //       setIsPasswordsMatched(false)
        //   }else{
            //   setIsPasswordsMatched(true)
            //   formData.ConfirmPassword = undefined

              setIsLoading(true)
              console.log(formData);
              let dataToRegister = {...formData, Preferences:preferences, _id:user._id}
              console.log(dataToRegister);
  
              let accessToken = JSON.parse(localStorage.getItem('accessToken'))
              let {data} = await axios.put(`${process.env.REACT_APP_API_URL}/user/updateUserDetails`, dataToRegister, {
                headers:{
                  'authorization': `Bearer ${accessToken}`
                },
              withCredentials:true})
              console.log(data);
              if(!data.error){
                let userFromBackend = data.updatedUser
                // console.log(userFromBackend);
                localStorage.setItem('user', JSON.stringify(userFromBackend))
                getUserFromLogin(userFromBackend)
                setPreferences([])
                if(userFromBackend.Role === "Reader"){
                    navigateTo('/news/home')
                }else{
                    navigateTo('/admin')
                }
              }
              setIsLoading(false)
          
      } catch (error) {
          console.log(error);
          if(error.response && error.response.status === 403 && error.response.data.message === "Access token expired"){
            try {
                setIsLoading(true)
                let user = JSON.parse(localStorage.getItem('user'))
                let response = await axios.post(`${process.env.REACT_APP_API_URL}/user/refreshAccessToken`, {user}, {withCredentials:true})
                console.log(response.data.error);
                if(!response.data.error){
                //   console.log(`accessToken:${response.data.newAccessToken}`);
                  let accessToken = response.data.newAccessToken
                  localStorage.setItem('accessToken', JSON.stringify(accessToken))
                  
                  let dataToRegister = {...formData, Preferences:preferences, _id:user._id}

                  let {data} = await axios.put(`${process.env.REACT_APP_API_URL}/user/updateUserDetails`, dataToRegister, {
                    headers:{
                      'authorization': `Bearer ${accessToken}`
                    },
                  withCredentials:true})
                  console.log(data);
                  if(!data.error){
                    let userFromBackend = data.updatedUser
                    // console.log(userFromBackend);
                    localStorage.setItem('user', JSON.stringify(userFromBackend))
                    getUserFromLogin(userFromBackend)
                    setPreferences([])
                    if(userFromBackend.Role === "Reader"){
                        navigateTo('/news/home')
                    }else{
                        navigateTo('/admin')
                    }
                  }
                }
                setIsLoading(false)
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
          } else if(error.status === 409 && error.response.data.message === "This Username is already registered"){
            setDuplicateUserNameError(true)
          }
      }
  }

//   let updateIsPassword = () => {
//       setIsPassword(!isPassword)
//   }

//   let updateIsConfirmPassword = () => {
//       setIsConfirmPassword(!isConfirmPassword)
//   }

  let togglePreference = (preference) => {
      if (preferences.includes(preference)) {
          setPreferences(preferences.filter(item => item !== preference));
      } else {
          if (preferences.length < 5) {
              setPreferences([...preferences, preference]);
          }
      }
  };

  let updateVerifyPass = ({target:{value}}) => {
    setPasswordToVerify(value)
  }

  let updateVerifyPasswordVisible = () => {
    setVerifyPassVisible(!verifyPassVisible)
  }

  let submitCurrentPassword = async() => {
    try {
        setIsLoading(true)
        let accessToken = JSON.parse(localStorage.getItem('accessToken'))
        let {data} = await axios.get(`${process.env.REACT_APP_API_URL}/user/verifyCurrentPassword/${user._id}?currentPassword=${passwordToVerify}`, {
            headers:{
              'authorization': `Bearer ${accessToken}`
            },
            withCredentials:true}
        )
        console.log(data);
        if(!data.error){
            setPasswordToVerify('')
            setUserVerified(true)
        }
        setIsLoading(false)
    } catch (error) {
        console.log(error);
        if(error.response && error.response.status === 403 && error.response.data.message === "Access token expired"){
            try {
                setIsLoading(true)
                let user = JSON.parse(localStorage.getItem('user'))
                let response = await axios.post(`${process.env.REACT_APP_API_URL}/user/refreshAccessToken`, {user}, {withCredentials:true})
                // console.log(response);
                console.log(response.data.error);
                if(!response.data.error){
                  let accessToken = response.data.newAccessToken
                  localStorage.setItem('accessToken', JSON.stringify(accessToken))
                
                  let {data} = await axios.get(`${process.env.REACT_APP_API_URL}/user/verifyCurrentPassword/${user._id}?currentPassword=${passwordToVerify}`, {
                    headers:{
                      'authorization': `Bearer ${accessToken}`
                    },
                    withCredentials:true}
                    )
                    console.log(data);
                    if(data.error){
                        setCurrentPasswordError(true)
                    }else{
                        setPasswordToVerify('')
                        setUserVerified(true)
                    }
                }
                setIsLoading(false)
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
        }else if(error.response && error.response.status === 401 && error.response.data.message === "Current Password is not matching with user password"){
            setCurrentPasswordError(true)
        }
    }
    
  }

  useEffect(() => {
    setValue("Username", user?.Username)
    setPreferences(user?.Preferences)
    window.scrollTo(0, 0);
    if(user?.Username === "Editor"){
        setReaderOrEditor(true)
    }else if(user?.Username === "Reader"){
        setReaderOrEditor(false)
    }
  }, [user, setValue])

  useEffect(() => {
    console.log(user);
    console.log(preferences);
    console.log(verifyPassVisible);
    console.log(passwordToVerify);
    console.log(currentPasswordError);
  })

  if(isLoading){
    return(
      <div className={userUpdateStyle.gifContainer}>
        <div className={userUpdateStyle.gifDiv} >
          <img src="https://i.pinimg.com/originals/b2/d4/b2/b2d4b2c0f0ff6c95b0d6021a430beda4.gif" alt="Saving..." className={userUpdateStyle.gif} />
        </div>
      </div>
    )
  }

  return (
    <div className={userUpdateStyle.container}>
        {!userVerified ? 
        <div className={userUpdateStyle.verifyPassContainer}>
            <div className={userUpdateStyle.verifyinputHeadingDiv}>
                <div className={userUpdateStyle.verifyHeadingDiv}>
                    <h5 className={userUpdateStyle.verifyHeading}>Current Password</h5>
                </div>
                <div className={userUpdateStyle.verifyinputDiv}>
                    <input type={verifyPassVisible ? "password" : "text"} onClick={() => {setCurrentPasswordError(false)}} onChange={updateVerifyPass} className={userUpdateStyle.verifyinput} />
                    {verifyPassVisible ? <FaEyeSlash onClick={updateVerifyPasswordVisible} className={userUpdateStyle.verifyEye} size={20} /> : <FaEye onClick={updateVerifyPasswordVisible} className={userUpdateStyle.verifyEye} size={20} />}
                </div>
            </div>
            <div className={userUpdateStyle.verifyErrorDiv}>
                {currentPasswordError && <h5 className={userUpdateStyle.verifyError}>Invalid Password</h5>}
            </div>
            <div className={userUpdateStyle.verifyButtonDiv}>
                <button onClick={submitCurrentPassword} className={userUpdateStyle.verifyButton}>Verify Password</button>
            </div>
        </div>
        :
        <div className={userUpdateStyle.formContainer}>
            <form action="" onSubmit={handleSubmit(sendFormData)} className={userUpdateStyle.form}>
                <div className={userUpdateStyle.headingContainer}>
                  <h3 className={userUpdateStyle.heading}>Edit Profile</h3>
                </div>
                <div className={userUpdateStyle.inputsContainer}>
                    <div className={userUpdateStyle.leftInputsContainer}>
                        <div className={userUpdateStyle.inputContainer}>
                            <div>
                                <h4 className={userUpdateStyle.inputTitle}>Username</h4>
                            </div>
                            <div className={userUpdateStyle.leftInputDiv}>
                                <input type="text" name="Username" autoComplete='off' onClick={() => {setDuplicateUserNameError(false)}} {...register("Username", {
                                    required:{value:true, message:"*This field is required"},
                                    maxLength:{value:20, message:"*Username Should not contain morethan 20 characters"},
                                    minLength:{value:4, message:"*Useranme Should contain morethan 4 characters"},
                                    pattern:{value:/^[a-zA-Z0-9_]+$/, message:`*Username should contain only Alphabets, Numbers and underscore`}
                                })} />
                            </div>
                            <div className={userUpdateStyle.errorDiv}>
                                <h4 style={{ color : 'red'}}>{errors.Username?.message}</h4>
                                {duplicateUserName && <h4 style={{ color : 'red'}}>This username is already using</h4>}
                            </div>
                        </div>
                        {/* <div className={userUpdateStyle.inputContainer}>
                            <div>
                                <h4 className={userUpdateStyle.inputTitle}>Email</h4>
                            </div>
                            <div className={userUpdateStyle.leftInputDiv}>
                                <input type="text" name="EmailAddress" autoComplete='off' {...register("EmailAddress", {
                                    required:{value:true, message:"*This field is required"},
                                    pattern:{value:/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, message:"*Please enter a valid email address (e.g., user@example.com)"}
                                })} />
                            </div>
                            <div className={userUpdateStyle.errorDiv}>
                                <h4 style={{ color : 'red'}}>{errors.EmailAddress?.message}</h4>
                            </div>
                        </div> */}
                        {/* <div className={userUpdateStyle.inputContainer}>
                            <div>
                                <h4 className={userUpdateStyle.inputTitle}>Phone Number</h4>
                            </div>
                            <div className={userUpdateStyle.leftInputDiv}>
                                <input type="text" name="PhoneNumber" autoComplete='off' {...register("PhoneNumber", {
                                    required:{value:true, message:"*This field is required"},
                                    pattern:{value:/^[0-9]{10}$/, message:"*Phone number must be exactly 10 digits"},
                                })} />
                            </div>
                            <div className={userUpdateStyle.errorDiv}>
                                <h4 style={{ color : 'red'}}>{errors.PhoneNumber?.message}</h4>
                            </div>
                            
                        </div> */}

                        {!readerOrEditor && <div className={userUpdateStyle.leftbuttonDiv}>
                            <div className={userUpdateStyle.preferenceHeader}>
                                <h4>Select Preferences</h4>
                            </div>
                            <div className={userUpdateStyle.preferenceBtns}>
                                {preferenceOptions.map((preference, index) => (
                                    <button type='button' key={index} onClick={() => togglePreference(preference)} className={`${userUpdateStyle.preferenceBtn} ${preferences.includes(preference) ? userUpdateStyle.btnClicked : ''}`} >{preference}</button>
                                ))}
                            </div>
                        </div>}
                    </div>
                    {/* <div className={userUpdateStyle.rightInputsContainer}>
                        <div className={userUpdateStyle.inputContainer}>
                            <div>
                                <h4 className={userUpdateStyle.inputTitle}>Password</h4>
                            </div>
                            <div className={userUpdateStyle.rightInputDiv}>
                                <input type={isPassword ? "password":"text"} name='Password' autoComplete='off' {...register('Password', {
                                    required:{value:true, message:"*This field is required"},
                                    minLength:{value:6, message : `*Password must contain Atleast 6 characters`},
                                    maxLength:{value:15, message:`*Password Should not contain More than 15 characters`},
                                    pattern:{value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{:;'?/>,.<;'\|]).*$/, message:`*Atleast one uppercase, lowecase, special character.`}
                                })} />
                                {isPassword ? <FaEyeSlash onClick={updateIsPassword} /> : <FaEye onClick={updateIsPassword} />}
                            </div>
                            <div className={userUpdateStyle.errorDiv}>
                                <h4 style={{ color : 'red'}}>{errors.Password?.message}</h4>
                            </div>
                            
                        </div>
                        <div className={userUpdateStyle.inputContainer}>
                            <div>
                                <h4 className={userUpdateStyle.inputTitle}>Confirm Password</h4>
                            </div>
                            <div className={userUpdateStyle.rightInputDiv}>
                                <input type={isConfirmPassword ? "password":"text"} name='ConfirmPassword' autoComplete='off' {...register("ConfirmPassword", {
                                    required:{value:true, message:"*This field is required"} 
                                })} />
                                {isConfirmPassword ? <FaEyeSlash onClick={updateIsConfirmPassword} /> : <FaEye onClick={updateIsConfirmPassword} />}
                            </div>
                            <div className={userUpdateStyle.errorDiv}>
                                {isPasswordsMatched ? <h4 style={{ color : 'red'}}>{errors.ConfirmPassword?.message}</h4> : <h4 style={{ color : 'red'}}>*Passwords do not match</h4>}
                                
                            </div>
                            
                        </div>
                        
                    </div> */}
                </div>
                <div className={userUpdateStyle.buttonContainer}>
                    <button type='submit' className={userUpdateStyle.signupBtn}>EDIT</button>
                </div>
            </form>
        </div>}
    </div>
  )
}

export default UserUpdate
