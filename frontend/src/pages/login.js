import "../styles/login.css"
import React from "react"
import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import AuthContext  from '../lib/authcontext'


export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate ();
  const { authenticated, setAuthenticated } = useContext(AuthContext);

  async function loginHandler(e) {
    e.preventDefault()

    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        email: email,
        password: password,
      })
      console.log(response.data);
      if(response.data.email!=null){
        localStorage.setItem('loggedEmail', JSON.stringify(response.data.email))
        // return <Dashboard />
        setAuthenticated(true)
        navigate('/')
      }
      else{
        alert("Invalid Credentials");
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <div className="wrapper">
        <div className="container">
          <div className="title">
            <h1>Log In</h1>
            <p>Log In to manage your Account</p>
          </div>
          <form onSubmit={loginHandler}>
            <div className="field">
              <input
                type={"text"}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter email"
                required
              />
              <input
                type={"Password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter Password"
                required
              />
            </div>
            <div className="field2">
              <input type={"submit"} value="Login" />
            </div>
          </form>
        </div>
        <div className="last">
          <p className="for">
            Don't Have an Account?<Link to="/Register">Register</Link>
          </p>
          <Link to="/ForgetPassword">Forgot Password?</Link>
        </div>
      </div>
    </>
  )
}
