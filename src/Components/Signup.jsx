import React, { useContext, useEffect, useState } from 'react'
import signupStyle from './Signup.module.css'
import { useForm } from 'react-hook-form'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './AppProvider';

const Signup = () => {
    let[preferences, setPreferences] = useState([])
    let[isPassword, setIsPassword] = useState(true)
    let[isConfirmPassword, setIsConfirmPassword] = useState(true)
    let[isPasswordsMatched, setIsPasswordsMatched] = useState(true)
    let[duplicateUserName, setDuplicateUserNameError] = useState(false)
    let[duplicateEmail, setDuplicateEmail] = useState(false)
    let[duplicatePhoneNumber, setDuplicatePhoneNumber] = useState(false)

    let {sendNavState} = useContext(AppContext)

    let toLogin = useNavigate()

    let preferenceOptions = ['Politics', 'Economy', 'World', 'Security', 'Law', 'Science', 'Society', 'Culture', 'Sports', 'Entertainment']

    let {register, handleSubmit, formState:{errors}, reset} = useForm()

    let sendFormData = async(data) => {
        try {
            if(data.Password !== data.ConfirmPassword){
                setIsPasswordsMatched(false)
            }else{
                setIsPasswordsMatched(true)
                data.ConfirmPassword = undefined
                console.log(data);
                let dataToRegister = {...data, Preferences:preferences}
                console.log(dataToRegister);
    
                let response = await axios.post(`${process.env.REACT_APP_API_URL}/user/userSignup`, dataToRegister)
                setPreferences([])
                reset()
                console.log(response);
                if(!response.data.error){
                    toLogin('/login')
                    sendNavState('signup')
                }
            }
            
        } catch (error) {
            console.log(error);
            if(error.response.status === 409 && error.response.data.message === "This Username is already registered"){
                setDuplicateUserNameError(true)
            }else if(error.response.status === 409 && error.response.data.message === "This email is already registered"){
                setDuplicateEmail(true)
            }else if(error.response.status === 409 && error.response.data.message === "This Phone Number is already registered"){
                setDuplicatePhoneNumber(true)
            }
        }
    }

    let updateIsPassword = () => {
        setIsPassword(!isPassword)
    }

    let updateIsConfirmPassword = () => {
        setIsConfirmPassword(!isConfirmPassword)
    }

    let togglePreference = (preference) => {
        if (preferences.includes(preference)) {
            setPreferences(preferences.filter(item => item !== preference));
        } else {
            if (preferences.length < 5) {
                setPreferences([...preferences, preference]);
            }
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

  return (
    <div className={signupStyle.container}>
        <div className={signupStyle.formContainer}>
            <form action="" onSubmit={handleSubmit(sendFormData)} className={signupStyle.form}>
                <div className={signupStyle.headingContainer}>
                  <h3 className={signupStyle.heading}>Create An Account Now</h3>
                </div>
                <div className={signupStyle.inputsContainer}>
                    <div className={signupStyle.leftInputsContainer}>
                        <div className={signupStyle.inputContainer}>
                            <div>
                                <h4 className={signupStyle.inputTitle}>Username</h4>
                            </div>
                            <div className={signupStyle.leftInputDiv}>
                                <input type="text" name="Username" autoComplete='off' onClick={() => {setDuplicateUserNameError(false)}} {...register("Username", {
                                    required:{value:true, message:"*This field is required"},
                                    maxLength:{value:20, message:"*Username Should not contain morethan 20 characters"},
                                    minLength:{value:4, message:"*Useranme Should contain morethan 4 characters"},
                                    pattern:{value:/^[a-zA-Z0-9_]+$/, message:`*Username should contain only Alphabets, Numbers and underscore`}
                                })} />
                            </div>
                            <div className={signupStyle.errorDiv}>
                                <h4 style={{ color : 'red'}}>{errors.Username?.message}</h4>
                                {duplicateUserName && <h4 style={{ color : 'red'}}>This username is already using</h4>}
                            </div>
                        </div>
                        <div className={signupStyle.inputContainer}>
                            <div>
                                <h4 className={signupStyle.inputTitle}>Email</h4>
                            </div>
                            <div className={signupStyle.leftInputDiv}>
                                <input type="text" name="EmailAddress" autoComplete='off' onClick={() => {setDuplicateEmail(false)}} {...register("EmailAddress", {
                                    required:{value:true, message:"*This field is required"},
                                    pattern:{value:/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, message:"*Please enter a valid email address (e.g., user@example.com)"}
                                })} />
                            </div>
                            <div className={signupStyle.errorDiv}>
                                <h4 style={{ color : 'red'}}>{errors.EmailAddress?.message}</h4>
                                {duplicateEmail && <h4 style={{ color : 'red'}}>This email is already using</h4>}
                            </div>
                        </div>
                        <div className={signupStyle.inputContainer}>
                            <div>
                                <h4 className={signupStyle.inputTitle}>Phone Number</h4>
                            </div>
                            <div className={signupStyle.leftInputDiv}>
                                <input type="text" name="PhoneNumber" autoComplete='off' {...register("PhoneNumber", {
                                    required:{value:true, message:"*This field is required"},
                                    pattern:{value:/^[0-9]{10}$/, message:"*Phone number must be exactly 10 digits"},
                                })} />
                            </div>
                            <div className={signupStyle.errorDiv}>
                                <h4 style={{ color : 'red'}}>{errors.PhoneNumber?.message}</h4>
                                {duplicatePhoneNumber && <h4 style={{ color : 'red'}}>This email is already using</h4>}
                            </div>
                        </div>
                        <div>
                            <h5>{}</h5>
                        </div>
                    </div>
                    <div className={signupStyle.rightInputsContainer}>
                        <div className={signupStyle.inputContainer}>
                            <div>
                                <h4 className={signupStyle.inputTitle}>Password</h4>
                            </div>
                            <div className={signupStyle.rightInputDiv}>
                                <input type={isPassword ? "password":"text"} name='Password' autoComplete='off' onClick={() => {setDuplicatePhoneNumber(false)}} {...register('Password', {
                                    required:{value:true, message:"*This field is required"},
                                    minLength:{value:6, message : `*Password must contain Atleast 6 characters`},
                                    maxLength:{value:15, message:`*Password Should not contain More than 15 characters`},
                                    pattern:{value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{:;'?/>,.<;'\|]).*$/, message:`*Atleast one uppercase, lowecase, special character.`}
                                })} />
                                {isPassword ?  <FaEyeSlash onClick={updateIsPassword} /> : <FaEye onClick={updateIsPassword} /> }
                            </div>
                            <div className={signupStyle.errorDiv}>
                                <h4 style={{ color : 'red'}}>{errors.Password?.message}</h4>
                            </div>
                            
                        </div>
                        <div className={signupStyle.inputContainer}>
                            <div>
                                <h4 className={signupStyle.inputTitle}>Confirm Password</h4>
                            </div>
                            <div className={signupStyle.rightInputDiv}>
                                <input type={isConfirmPassword ? "password":"text"} name='ConfirmPassword' autoComplete='off' {...register("ConfirmPassword", {
                                    required:{value:true, message:"*This field is required"} 
                                })} />
                                {isConfirmPassword ? <FaEyeSlash onClick={updateIsConfirmPassword} /> : <FaEye onClick={updateIsConfirmPassword} />}
                            </div>
                            <div className={signupStyle.errorDiv}>
                                {isPasswordsMatched ? <h4 style={{ color : 'red'}}>{errors.ConfirmPassword?.message}</h4> : <h4 style={{ color : 'red'}}>*Passwords do not match</h4>}
                                
                            </div>
                            
                        </div>
                        <div className={signupStyle.rightbuttonDiv}>
                            <div className={signupStyle.preferenceHeader}>
                                <h4>Select Preferences</h4>
                            </div>
                            <div className={signupStyle.preferenceBtns}>
                                {preferenceOptions.map((preference, index) => (
                                    <button type='button' key={index} onClick={() => togglePreference(preference)} className={`${signupStyle.preferenceBtn} ${preferences.includes(preference) ? signupStyle.btnClicked : ''}`} >{preference}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={signupStyle.buttonsContainer}>
                    <button type='submit' className={signupStyle.signupBtn}>SIGN UP</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Signup
