import React from "react";
import { Chart } from "react-google-charts";
import "./PieChart.css";

const PieChartView = (props) => {
    const { data, options } = props;

    return (
        <div className="PieChart">
            <Chart
                chartType="PieChart"
                data={data}
                options={options}
                width={"100%"}
                height={"400px"}
            />
        </div>
    );
};

export default PieChartView;
