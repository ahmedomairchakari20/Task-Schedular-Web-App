import '../styles/register.css'
import React, { useState } from 'react'
import { Link, useNavigate  } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Login from './login'
import axios from 'axios';

export default function Register() {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate ();

    async function onSubmitHandler(e){
        e.preventDefault()
        // console.log(e.target.value)
        console.log(username)
        console.log(email)
        console.log(password)
        // API call to django server
        try {
            const response = await axios.post('http://127.0.0.1:8000/signup', 
            {
                'username': username,
                'email': email,
                'password': password,
            });
            console.log(response.data);
            navigate('/');
            // return <Login />
          } catch (error) {
            console.error(error);
          }
        // localStorage.setItem('access', payload.access);
    }

  return (
    <>
    <div className="wrapper">
        <div className="container">
            <div className="title">
                <p>Create Your Account</p>
            </div>
            <Form className="registerForm" onSubmit={onSubmitHandler}>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Control type="text" placeholder="Enter UserName"
                        onChange={(e)=> setUsername(e.target.value)} 
                        value={username}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Control type="email" placeholder="Enter email"
                        onChange={(e)=> setEmail(e.target.value)} 
                        value={email}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Control type="password" placeholder="Password"
                        onChange={(e)=> setPassword(e.target.value)} 
                        value={password}
                    />
                </Form.Group>
                <div className="field2">
                    <input type={"submit"} value="Create Account"/>
                </div>
            </Form>
        </div>
        <div className="last">
            <p className="for">Already Have an Account?<Link to="/">Log In</Link></p>
        </div>
    </div>
    </>
  )
}
