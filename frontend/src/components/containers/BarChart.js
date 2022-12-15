import React, { useEffect, useState } from "react";
import BarChartView from "../views/BarChartView";

const BarChart = () => {
  const [voters, setVoters] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/voters").then((response) =>
      response.json().then((data) => {
        setVoters(data);
      })
    );
  }, []);

  const voted = voters.filter(voter => voter.voted === true)
  const notVoted = voters.filter(voter => voter.voted === false)

  const data = [
    ["Voter", "Number of Voters", {role: 'style'}],
    ["Voted", voted.length, 'blue'],
    ["Not Voted", notVoted.length, 'orange']
  ]

  const options = {
    title: "Voter's Voting Status",
    backgroundColor: "transparent",
    titleTextStyle: { fontSize: 20, position: 'top' },
    chartArea: { top: 55, height: '65%' },
    legend: { position: 'none'}
  }

  return (
    <BarChartView data={data} options={options} />
    // <div>bar chart here</div>
  )
}

export default BarChart

