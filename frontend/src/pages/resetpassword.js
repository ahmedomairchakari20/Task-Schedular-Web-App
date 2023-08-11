import React from 'react'
import { faKey } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useParams } from "react-router-dom";
import axios from "axios"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';


export default function Resetpassword() {
  const { token } = useParams();
  const[userid,setUserid]=useState("");
  const [password,setPassword]=useState("");
  const[password2,setPassword2]=useState("");
  const navigate = useNavigate ();

  async function get_user(e) {

    try {
      const response = await axios.post("http://127.0.0.1:8000/change_password", {
        token: token,
      })
      console.log(response.data)
      setUserid(response.data.user_id);
      console.log(userid)

    } catch (error) {
      console.error(error)
    }
  }

  get_user();

  
  async function change_password(e) {
    e.preventDefault()
    if(password!=password2){
      alert("Password does not match")
    }
    else{
      try {
        const response = await axios.post("http://127.0.0.1:8000/resetpassword", {
          user_id: userid,
          password: password,
        })
        alert(response.data.msg);
        navigate('/');
  
      } catch (error) {
        console.error(error)
      }

    }

    
  }
  


  return (
    <>
    <div className="wrapper">
      <div className="containerforget">
        <div className="forgeticon">
        <FontAwesomeIcon icon={faKey}  className='forgeticon' size='2xl' style={{color: "#ffffff",}} />
        </div>
            <div className="title">
                <p style={{color:"#ffffff",}}>Reset Your Password</p>
            </div>
          <form onSubmit={change_password}>
            <div className="field">
               <input type={"hidden"} value={userid} required />
               <input type={"password"} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" required />
               <input type={"password"} onChange={(e) => setPassword2(e.target.value)} placeholder="Confirm Password" required />
               
            </div>
            <div className="field2">
                <p style={{fontSize:'10px',}}>Minimum 10 characters long. Must Contain upper and lowercase, numbers and symbols.</p>
               <input type={"submit"} value="Reset My Password"/>
            </div>
         </form>

      </div>
    </div>
    </>
  )
}
