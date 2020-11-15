//Final Doughnut Display
import React, { Component } from "react";
import { Bar } from "react-chartjs-2";

import { Typography } from "antd";

const { Title } = Typography;

export default class LineDisplay extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    // this.mostFrequentExercise = this.mostFrequentExercise.bind(this);
    this.state = {
      exerciseTally: props.data,
      chartData: {
        labels: [
          "WindowWipe",
          "pushback",
          "rocket",
          "elbowlock",
          "hair",
          "Scarecrow",
          "zigzag",
          "shouldershrug",
          "unrecognized",
        ],
        datasets: [
          {
            label: " ",

            data: [1, 4, 4, 2, 3, 1, 4, 1],
            backgroundColor: [
              //   "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
              "rgba(255, 99, 132, 0.6)",
            ],
          },
        ],
      },
    };
  }
  componentWillReceiveProps() {
    this.setState({
      exerciseTally: this.props.data,
      chartData: {
        labels: [
          "WindowWipe",
          "pushback",
          "rocket",
          "elbowlock",
          "hair",
          "Scarecrow",
          "zigzag",
          "shouldershrug",
          "unrecognized",
        ],
        datasets: [
          {
            label: " ",

            data: [
              this.props.data[0],
              this.props.data[1],
              this.props.data[2],
              this.props.data[3],
              this.props.data[4],
              this.props.data[5],
              this.props.data[6],
              this.props.data[7],
              this.props.data[8],
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
              "rgba(128, 99, 132, 0.6)",
              "rgba(200, 10, 70, 0.6)",
              "rgba(200, 200, 70, 0.6)",
            ],
          },
        ],
      },
    });
  }

  //Update the states of the display
  getItems() {
    this.setState({
      chartData: {
        labels: [
          "WindowWipe",
          "pushback",
          "rocket",
          "elbowlock",
          "hair",
          "Scarecrow",
          "zigzag",
          "shouldershrug",
          "unrecognized",
        ],
        datasets: [
          {
            label: " ",
            data: [
              parseInt(this.props.data[0]),
              parseInt(this.props.data[1]),
              parseInt(this.props.data[2]),
              parseInt(this.props.data[3]),
              parseInt(this.props.data[4]),
              parseInt(this.props.data[5]),
              parseInt(this.props.data[6]),
              parseInt(this.props.data[7]),
              parseInt(this.props.data[8]),
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
              "rgba(255, 99, 132, 0.6)",
            ],
          },
        ],
        options: {
          responsive: true,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      },
    });
  }
  isInt(n) {
    return typeof n == "number" && n % 1 === 0;
  }

  render() {
    return (
      <div>
        <Title level={4}> Session Logs </Title>
        <Bar data={this.state.chartData} min={0} />
      </div>
    );
  }
}
