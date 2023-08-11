import "../styles/profile.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircle,faArrowCircleLeft, faCircleArrowLeft, } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import { useState,useEffect } from "react"
import Toggle from "react-styled-toggle"
import axios from "axios"
// import { GoogleLogin } from 'react-google-login';

function Profile() {
  const [name, setName] = useState("")
  const [occupation, setOccupation] = useState("")
  const [age, setAge] = useState("")
  const [email, setEmail] = useState(JSON.parse(localStorage.getItem("loggedEmail")))
  const [selectedImage, setSelectedImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [notify, setNotify]= useState(true);


  async function submitHandler(e) {
    e.preventDefault();
    console.log("submitHandler");
    console.log(selectedImage)
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("occupation", occupation);
      formData.append("age", age);
      formData.append("name", name);
      formData.append("notify", notify);
      formData.append("media", selectedImage);
  
      const response = await axios.post("http://127.0.0.1:8000/updateuser", formData);
      console.log(response.data.msg);
      alert(response.data.msg)
    } catch (error) {
      console.error(error);
    }
    fetchProfileData();
  }

  const fetchProfileData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/updateuser", {
        params: {
          email: email,
        },
      });
      const profileData = response.data;
      // Update the state variables with the retrieved data
      setName(profileData.name);
      setOccupation(profileData.occupation);
      setAge(profileData.age);
      setNotify(profileData.notify);
      setEmail(profileData.email);
      // Set the image URL if available
      if (profileData.media) {
        setImageUrl("http://127.0.0.1:8000"+profileData.media);
      }
      console.log(profileData.media)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);


  const responseGoogle = (response) => {
    console.log(response);
  }

  const onFailure = (error) => {
    console.log(error);
  }

console.log(notify);
  return (
    <>
      <div className="wrapper_profile">
        <div className="upper-section">
          <Link to={"/home"}>
            <h4><FontAwesomeIcon
                className="itemright"
                size="2xl"
                icon={faArrowCircleLeft}
                style={{ color: "#ffffff" }}
              />back to main</h4>
          </Link>
          <Link to={"/home"}>
            <FontAwesomeIcon
              className="itemright"
              size="2xl"
              icon={faCircleArrowLeft}
              style={{ color: "#ffffff" }}
            />
          </Link>
        </div>
        
        <div className="main-section">
          <div className="img-container">
            <img
              className="user-image"
              src={imageUrl || process.env.PUBLIC_URL + 'media/profile.png'}
              alt=""
            />
          </div>
          <div className="plus-icon-container">
            <FontAwesomeIcon
              size="2xl"
              icon={faCircleArrowLeft}
              style={{ color: "#ffffff" }}
              onClick={() => {
                document.getElementById("image-upload").click();
              }}
            />
          </div>

          <form  className="user-form" onSubmit={submitHandler} encType="multipart/form-data">
          {/* <div style={{display:"flex",flexDirection:"row"}}>
           <p style={{fontSize:"1.5rem",marginTop:"13%"}}> Notify me </p>
            <Toggle
              className="recurring"
              onChange={() => {
                setNotify(!notify)
              }}
              checked={notify}
            />
           </div> */}
            <input
              type="file"
              id="image-upload"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                setSelectedImage(file);
                setImageUrl(URL.createObjectURL(file));
            }}
            />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              name="name"
              placeholder="Name"
              required
            />
            <input
              onChange={(e) => setOccupation(e.target.value)}
              value={occupation}
              type="text"
              name="occupation"
              placeholder="Occupation"
              required
            />
            <input
              onChange={(e) => setAge(e.target.value)}
              value={age}
              type="number"
              name="age"
              placeholder="Age"
              required
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              name="email"
              placeholder="Email"
              required
            />
           
            <input type={"submit"} value={"Update"} />
          </form>
        </div>
      </div>
    </>
  )
}

export default Profile
