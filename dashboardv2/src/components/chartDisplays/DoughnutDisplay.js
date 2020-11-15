//Final Doughnut Display
import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";

import { Typography } from "antd";

const { Title } = Typography;
/** Displays the results in doughnut form
 *
 */
export default class DoughnutDisplay extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      userChartData: {},
    };
  }

  //Updates the state every x sec
  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.timer = setInterval(() => this.getItems(), 500);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.timer);
    this.timer = null;
  }

  //Update the states of the display
  getItems() {
    if (this._isMounted) {
      this.setState({
        userChartData: {
          labels: ["xAcc", "yAcc", "zAcc"],
          datasets: [
            {
              label: "Relative Positioning",
              data: [
                this.props.data[0],
                this.props.data[1],
                this.props.data[2],
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
        },
        user1ChartData: {
          labels: [
            "elbowlock",
            "hair",
            "pushback",
            "rocket",
            "scarecrow",
            "shoulder",
            "windowwipe",
            "zigzag",
          ],
          datasets: [
            {
              label: "Dance Moves",
              data: [2, 2, 2, 3, 4, 5, 1, 1],
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
        },
      });
    }
  }

  render() {
    return (
      <div>
        {/*  */}
        <Title level={4}> User Analytics </Title>
        <Doughnut data={this.state.userChartData} />
        <h3> xAcceleration : {this.props.data[0]}</h3>
        <h3> yAcceleration : {this.props.data[1]}</h3>
        <h3> zAcceleration : {this.props.data[2]}</h3>
      </div>
    );
  }
}
