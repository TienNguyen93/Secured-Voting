import React from "react";
import { Chart } from "react-google-charts";
import "./PieChart.css";

const PieChartView = (props) => {
    const { data, options } = props;

    return (
        <div>
            <Chart
                chartType="PieChart"
                data={data}
                options={options}
                width={"100%"}
            />
        </div>
    );
};

export default PieChartView;
