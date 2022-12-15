import React from "react";
import { Chart } from "react-google-charts";

const BarChartView = (props) => {
  const { data, options } = props;


  return (
    <div>
      <Chart
        chartType="BarChart"
        data={data}
        options={options}
        width={"100%"}
      />
    </div>
  )
}

export default BarChartView