import { useState, useEffect, createContext } from "react"
import { Route, Routes, Navigate  } from "react-router-dom"
import Home from "./pages/home"
import Profile from "./pages/profile"
import Tasks from "./pages/tasks"
import Login from "./pages/login"
import Register from "./pages/Register"
import MyCalendar from "./pages/calendar"
import Dashboard from "./pages/dashboard"
import Analysis from "./pages/analysis"
import ForgetPassword from "./pages/ForgetPassword"
import Resetpassword from "./pages/resetpassword"
import Setting from "./pages/setting"
import NotFound from "./pages/notfound"
import AuthContext  from './lib/authcontext'
import Detail from "./pages/detail"
function App() {
  const [authenticated, setAuthenticated] = useState(localStorage.getItem("loggedEmail")?? false)

  useEffect(() => {
    console.log(`Auth value is: ${authenticated}`)
  }, [authenticated]);

  return (
    <>
      <AuthContext.Provider value={{authenticated, setAuthenticated}}>
      <Routes>
        <Route path="/" element={ !authenticated? <Login />: <Navigate to="/home" />} />
        <Route path="/home" element={authenticated? <Home />: <Navigate to="/" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/resetPassword/:token" element={<Resetpassword />} />
        <Route path="/profile" element={authenticated? <Profile />: <Navigate to="/" />} />
        <Route path="/tasks" element={authenticated? <Tasks />: <Navigate to="/" />} />
        <Route path="/tasks/:id" element={authenticated? <Detail />: <Navigate to="/" />} />
        <Route path="/dashboard" element={authenticated? <Dashboard />: <Navigate to="/" />} />
        <Route path="/setting" element={authenticated? <Setting />: <Navigate to="/" />} />
        <Route path="/analysis" element={authenticated? <Analysis />: <Navigate to="/" />} />
        <Route path="/calendar" element={authenticated? <MyCalendar />: <Navigate to="/" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </AuthContext.Provider>
    </>
  )
}

export default App
