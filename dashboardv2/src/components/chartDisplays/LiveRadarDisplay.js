//For Live Radar Display
//Final Doughnut Display
import React, { Component } from "react";
import { Radar } from "react-chartjs-2";

/** Displays the results in doughnut form
 *
 */
export default class LiveRadarDisplay extends Component {
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
      });
    }
  }

  render() {
    return (
      <div>
        <h1>Radar Display Final </h1>
        <Radar data={this.state.userChartData} />
      </div>
    );
  }
}
