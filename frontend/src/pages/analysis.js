import { Link } from "react-router-dom"
import axios from "axios"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { faDownload } from "@fortawesome/free-solid-svg-icons"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import "../styles/analysis.css"

export default function Analysis() {
  const [graphData, setGraphData] = useState(null)

  const [timeType, setTimeType] = useState("1")

  const [lastWeek, setLastWeek] = useState(null)
  const [lastMonth, setLastMonth] = useState(null)
  const [lastYear, setLastYear] = useState(null)

  async function getTasks() {
    let email = JSON.parse(localStorage.getItem("loggedEmail"))
    console.log(email)
    try {
      const response = await axios.get("http://127.0.0.1:8000/analysis", {
        params: {
          email: email,
        },
      })
      console.log(response.data)
      setLastWeek(response.data["last_week_tasks"])
      setLastMonth(response.data["last_month_tasks"])
      setLastYear(response.data["last_year_tasks"])
      setGraphData(response.data["graph_data"])
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getTasks()
  }, []) //load once

  const downloadReport = () => {
    let email = JSON.parse(localStorage.getItem("loggedEmail"))
    const url = `http://127.0.0.1:8000/generate_report?email=${email}`;

    axios.get(url ,{ responseType: 'blob' })
        .then((response) => {
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'work_history_report.pdf';
            link.click();
        })
        .catch((error) => {
            // Handle error
        });
      };

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <h4 className="db-heading-back">
          <Link to={"/home"}><FontAwesomeIcon
                    className="itemright"
                    size="2xl"
                    icon={faCircleArrowLeft}
                    style={{ color: "#ffffff" }}
                    
                />back to main</Link>
        </h4>
        <h1 className="itemcenter">Performance Analysis</h1>
      </div>
      <div className="analysis-main">
        <div className="side-bar">
          <div className="side-bar-tags">
            <h3>Check My Performance</h3>
            <h4
              onClick={() => setTimeType("1")}
              className={`task-type1 ${
                timeType === "1" ? "my-active" : "my-inactive"
              }`}
            >
              Last Week
            </h4>
            <h4
              onClick={() => setTimeType("2")}
              className={`task-type1 ${
                timeType === "2" ? "my-active" : "my-inactive"
              }`}
            >
              Last Month
            </h4>
            <h4
              onClick={() => setTimeType("3")}
              className={`task-type1 ${
                timeType === "3" ? "my-active" : "my-inactive"
              }`}
            >
              Last Year
            </h4>
          </div>
        </div>
        <div className="main">
          <div className="Download_Header">
          
              <h4><FontAwesomeIcon
                className="download-icon"
                icon={faDownload}
                size="2x"
                onClick={downloadReport}
                style={{ color: "#ffffff" }}
              /></h4>
          </div>
          <div className="main-tags">
            <h4>No.</h4>
            <h4>Task Title</h4>
            <h4>Done</h4>
            <h4>In-progress Time</h4>
            <h4>Completion Ratio</h4>
          </div>

          {timeType === "1"
            ? lastWeek?.map((task, idx) => (
                <div className="main-items">
                  <h4>{idx + 1}</h4>
                  <h4>{task.title}</h4>
                  <h4>{task.is_complete === false ? "No" : "Yes"}</h4>
                  <h4>{task.in_progress_time}</h4>
                  <h4>{task.complete_percentage}%</h4>
                </div>
              ))
            : null}
          {timeType === "2"
            ? lastMonth?.map((task, idx) => (
                <div className="main-items">
                  <h4>{idx + 1}</h4>
                  <h4>{task.title}</h4>
                  <h4>{task.is_complete === false ? "No" : "Yes"}</h4>
                  <h4>{task.in_progress_time}</h4>
                  <h4>{task.complete_percentage}%</h4>
                </div>
              ))
            : null}

          {timeType === "3"
            ? lastYear?.map((task, idx) => (
                <div className="main-items">
                  <h4>{idx + 1}</h4>
                  <h4>{task.title}</h4>
                  <h4>{task.is_complete === false ? "No" : "Yes"}</h4>
                  <h4>{task.in_progress_time}</h4>
                  <h4>{task.complete_percentage}%</h4>
                </div>
              ))
            : null}
          {timeType === "3" && graphData !== null ? (
            <LineChart width={800} height={300} data={graphData}>
              <XAxis dataKey="month" stroke="white" />
              <YAxis stroke="white" />
              {/* <CartesianGrid stroke="#ffffff" strokeDasharray="5 5" /> */}
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="lightblue" />
              <Line type="monotone" dataKey="incomplete" stroke="lightpink" />
            </LineChart>
          ) : null}
        </div>
      </div>
    </div>
  )
}
