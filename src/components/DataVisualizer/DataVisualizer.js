import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";

import SectionHeading from "../SectionHeading";

const getChartData = (data) => {
  return {
    datasets: [
      {
        label: "Clicks",
        data: data.map(({ time, clicks }) => ({ x: time, y: clicks })),
        borderWidth: 2,
        radius: 2,
        hoverRadius: 4,
        borderColor: "#4f7cacff",
        backgroundColor: "#4f7cac99",
        pointBackgroundColor: "#4f7cac55",
      },
      {
        label: "Impressions",
        data: data.map(({ time, impressions }) => ({
          x: time,
          y: impressions,
        })),
        borderWidth: 2,
        radius: 2,
        hoverRadius: 4,
        borderColor: "#a8dadcff",
        backgroundColor: "#a8dadc99",
        pointBackgroundColor: "#9eefe566",
      },
    ],
  };
};

const options = {
  responsive: true,
  parsing: false,
  normalized: true,
  scales: {
    xAxes: [
      {
        type: "time",
        distribution: "linear",
        ticks: {
          minRotation: 50,
          maxRotation: 50,
        },
      },
    ],
  },
  elements: {
    line: {
      tension: 0,
    },
  },
};

export default function DataVisualizer({ data }) {
  const chartData = useMemo(() => getChartData(data));
  return (
    <>
      <SectionHeading component="h2">Data viz</SectionHeading>
      <Line data={chartData} options={options}></Line>
    </>
  );
}
