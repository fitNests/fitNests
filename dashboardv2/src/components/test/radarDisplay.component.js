//redundant
import React, { Component } from "react";
import axios from "axios";
import { Radar } from "react-chartjs-2";

/**
 *  Prints out radar chart
 */
export default class RadarDisplay extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      //pos: [],
      //action: "",
      //delay: 0,
      user1features: [0, 0, 0, 0, 0, 0],
      user2features: [0, 0, 0, 0, 0, 0],
      user3features: [0, 0, 0, 0, 0, 0],
      user1chartData: {},
      user2chartData: {},
      user3chartData: {},
    };
  }

  //Used to poll the mongDB database every x seconds
  componentDidMount() {
    this._isMounted = true;
    this.timer = setInterval(() => this.getItems(), 500);
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.timer);
    this.timer = null; // here...
  }

  //fetch the data from mongoDb
  getItems() {
    axios
      .get("http://localhost:5000/testuser/")
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            user1chartData: {
              labels: ["yaw", "pitch", "roll"],
              datasets: [
                {
                  label: "Accelerometer Reading",
                  data: [
                    response.data[0].user1features[3],
                    response.data[0].user1features[4],
                    response.data[0].user1features[5],
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
            user2chartData: {
              labels: ["yaw", "pitch", "roll"],
              datasets: [
                {
                  label: "Accelerometer Reading",
                  data: [
                    response.data[0].user2features[3],
                    response.data[0].user2features[4],
                    response.data[0].user2features[5],
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
            user3chartData: {
              labels: ["yaw", "pitch", "roll"],
              datasets: [
                {
                  label: "Accelerometer Reading",
                  data: [
                    response.data[0].user3features[3],
                    response.data[0].user3features[4],
                    response.data[0].user3features[5],
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

            id: response.data[0].id,
            //pos: response.data[0].pos,
            //action : response.data[0].action,
            //delay : response.data[0].delay,
            user1features: response.data[0].user1features,
            user2features: response.data[0].user2features,
            user3features: response.data[0].user3features,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    if (this.props.id === 1) {
      return (
        <div>
          <Radar data={this.state.user1chartData} />
          <h3> yaw : {this.state.user1features[3]}</h3>
          <h3> pitch : {this.state.user1features[4]}</h3>
          <h3> roll : {this.state.user1features[5]}</h3>
        </div>
      );
    } else if (this.props.id === 2) {
      return (
        <div>
          <Radar data={this.state.user2chartData} />
          <h3> yaw : {this.state.user2features[3]}</h3>
          <h3> pitch : {this.state.user2features[4]}</h3>
          <h3> roll : {this.state.user2features[5]}</h3>
        </div>
      );
    } else {
      return (
        <div>
          <Radar data={this.state.user3chartData} />
          <h3> yaw : {this.state.user3features[3]}</h3>
          <h3> pitch : {this.state.user3features[4]}</h3>
          <h3> roll : {this.state.user3features[5]}</h3>
        </div>
      );
    }
  }
}
