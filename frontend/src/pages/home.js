import '../styles/home.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowLeft, faAddressCard, faListCheck, faTableColumns, faMagnifyingGlassChart, faCalendar, faGear } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../lib/authcontext'
import { useNavigate } from 'react-router-dom'
function Home(){

    const { authenticated, setAuthenticated } = useContext(AuthContext);

    const navigate = useNavigate ();

    async function logoutHandler(){
        localStorage.setItem('loggedEmail', '')
        setAuthenticated(false)
        navigate('/')
    }
    return(
        <div className='home-container'>
            <div className='logoutIcon'>
                <h4><FontAwesomeIcon
                    className="itemright"
                    size="2xl"
                    icon={faCircleArrowLeft}
                    style={{ color: "#ffffff" }}
                    onClick={logoutHandler}
                />Log out</h4>
                <div className="home-heading">
                <img className="itemcenter" style={{ fontFamily: "Sofia", width: "10%", height: "10%" }} src={process.env.PUBLIC_URL + '/media/logo.png'}/>
            </div>
            </div>
            
            <div>
                <h2 className='itemcenter'>Home</h2>
            </div>
            <div className='home-items-container'>
                <Link to={'/profile'} className='home-items'>
                    {/* <div className='home-items'> */}
                    <FontAwesomeIcon size='2xl' icon={faAddressCard} />
                    <h4>Profile</h4>
                    {/* </div> */}
                </Link>
                <Link to={'/tasks'} className='home-items'>
                    <FontAwesomeIcon size='2xl' icon={faListCheck} />
                    <h4>Tasks</h4>
                </Link>
                <Link to={'/dashboard'} className='home-items'>
                    <FontAwesomeIcon size='2xl' icon={faTableColumns} />
                    <h4>Dashboard</h4>
                </Link>
                <Link to={'/analysis'} className='home-items'>
                    <FontAwesomeIcon size='2xl' icon={faMagnifyingGlassChart} style={{color: "#fcfcfc",}} />
                    <h4>Performance Analysis</h4>
                </Link>
                <Link to={'/calendar'} className='home-items'>
                    <FontAwesomeIcon size='2xl' icon={faCalendar} />
                    <h4>Calendar</h4>
                </Link>
                <Link to={'/setting'} className='home-items'>
                    <FontAwesomeIcon size='2xl' icon={faGear} />
                    <h4>Setting</h4>
                </Link>
            </div>
        </div>
    )
}

export default Home