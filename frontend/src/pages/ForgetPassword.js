import '../styles/forget.css'
import React from 'react'
import { useState } from 'react'
import { faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios"

export default function ForgetPassword() {
  
  const [email, setEmail] = useState("")
  async function emailhandler(e) {
    e.preventDefault()

    try {
      const response = await axios.post("http://127.0.0.1:8000/forgetPassword", {
        email: email,
      })
      console.log(response.data)
      console.log(response.data.email)


    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
    <div className="wrapper">
      <div className="containerforget">
        <div className="forgeticon">
        <FontAwesomeIcon icon={faUnlockAlt}  className='forgeticon' size='2xl' style={{color: "#ffffff",}} />
        </div>
          <div className="title">
            <p style={{color:"#ffffff",}}>Forget Password?</p>
            <p style={{color:"#ffffff",}}>Please enter your registeration email address, we will send you the instruction to reset your password</p>
          </div>
          <form onSubmit={emailhandler}>
            <div className="field">
               <input type={"text"}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter email"
                required/>
            </div>
            <div className="field2">
               <input type={"submit"} value="Send Reset Instruction"/>
            </div>
         </form>

      </div>
    </div>
    </>
  )
}
