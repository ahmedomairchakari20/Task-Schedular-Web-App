import React, {useContext,useState} from 'react'
import '../styles/settings.css'
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowLeft} from '@fortawesome/free-solid-svg-icons'
import AuthContext  from '../lib/authcontext'
import '../styles/settings.css'
import { FaSave } from 'react-icons/fa';
import axios from 'axios';

export default function Setting() {

    const { authenticated, setAuthenticated } = useContext(AuthContext);

    const navigate = useNavigate ();
    const [text, setText] = useState('');
    const [feedback, setFeedback] = useState('');

    async function logoutHandler(){
        localStorage.setItem('loggedEmail', '')
        setAuthenticated(false)
        navigate('/')
    }
    const handleChange = (event) => {
        const inputText = event.target.value;
        const wordCount = inputText.trim().split(/\s+/).length;
    
        if (wordCount <= 250) {
          setText(inputText);
        }
      };
    async function handleSave (e){
        e.preventDefault()


        try{
            const response = await axios.post('http://127.0.0.1:8000/settings',{
                'feedback': feedback,
                'support': text,
                'email': JSON.parse(localStorage.getItem("loggedEmail"))

            });
            console.log(response.data);
            alert(response.data.msg)

        }catch(error){
            console.error(error);
        }
        
        console.log('Text saved:', text);
    };
    const fetchdetails = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/settings", {
                params: {
                    "email": JSON.parse(localStorage.getItem("loggedEmail")),
                },
            });
            const profileData = response.data;
            // Update the state variables with the retrieved data
            setFeedback(profileData.feedback);
            console.log(profileData.feedback)
        } catch (error) {
            console.error(error);
        }
    };
    React.useEffect(() => {
        fetchdetails();
    }, []);


  return (
    <>
    
    <div className="wrapper_setting">
        <div className='setheader'>
            <h4 className='db-heading-back'><Link to={'/home'} ><FontAwesomeIcon className='left' size='2xl' icon={faCircleArrowLeft} style={{color: "#ffffff",}} />back to main</Link></h4>
        </div>
        <div className="home-heading_setting">
        <div className="home-heading">
                <img className="itemcenter" style={{ fontFamily: "Sofia", width: "10%", height: "10%" }} src={process.env.PUBLIC_URL + '/media/logo.png'}/>
            </div>
    
            
            <div className="container_setting">
            <div className='title'>
                    <h2 style={{textAlign:'center',}}>Settings</h2>
                
                <div>
                {/* <input
                    type="checkbox"
                    id="support"
                    name="support"
                />Notify me  */}
                <br />
               

                <label className='settings' htmlFor="feedback">Feedback:</label>
                <input
                    onChange={(e)=> setFeedback(e.target.value)} 
                    value={feedback}
                    type="text"
                    id="feedback"
                    name="feedback"
                />
                <br />
                <label className='settings' htmlFor="support">Support:</label>
                <textarea
                    rows={4} cols={26}
                    value={text}
                    onChange={handleChange}
                    type="text"
                    id="support"
                    name="support"
                    style={{ background: 'transparent', marginLeft: '15px',color:"white"}}
                />
                <p style={{marginLeft:"90px"}}>{`${text.trim().split(/\s+/).length}/250 words`}</p>
                <br />
                <button style={{background:"transparent",color:"white",marginLeft:"90px",fontSize:"1rem"}} onClick={handleSave}>
                    <FaSave /> Save
                </button>

                <div className='setlast'><button onClick={logoutHandler} className='setlogout' >Logout</button></div>
                </div>
            </div>
            </div>
        </div>
    </div>
    </>
  )
}
