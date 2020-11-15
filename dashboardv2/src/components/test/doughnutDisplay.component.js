//Redundant
import React, { Component } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";

/** Displays the results in doughnut form
 *
 */
export default class DoughnutDisplay extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      pos: [],
      user1features: [],
      user2features: [],
      user3features: [],
      user1chartData: {},
      user2chartData: {},
      user3chartData: {},
    };
  }

  //Used to poll the mongDB database every x seconds
  componentDidMount() {
    //console.log("Doughnut Display debug");
    this._isMounted = true;
    if (this._isMounted) {
      this.timer = setInterval(() => this.getItems(), 500);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.timer);
    this.timer = null; // here...
  }

  //fetch the data from mongoDb
  getItems() {
    //console.log("fuck me");
    axios
      .get("http://localhost:5000/testuser/")
      //.then((response) => console.log(response))
      .then((response) => {
        //console.log(response);
        if (this._isMounted) {
          this.setState({
            user1chartData: {
              labels: ["xAcc", "yAcc", "zAcc"],
              datasets: [
                {
                  label: "Relative Positioning",
                  data: [
                    response.data[0].user1features[0],
                    response.data[0].user1features[1],
                    response.data[0].user1features[2],
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
              labels: ["xPos", "yPos", "zPos"],
              datasets: [
                {
                  label: "Relative Positioning",
                  data: [
                    response.data[0].user2features[0],
                    response.data[0].user2features[1],
                    response.data[0].user2features[2],
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
              labels: ["xPos", "yPos", "zPos"],
              datasets: [
                {
                  label: "Relative Positioning",
                  data: [
                    response.data[0].user3features[0],
                    response.data[0].user3features[1],
                    response.data[0].user3features[2],
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
            pos: response.data[0].pos,
            //action: response.data[0].action,
            //delay: response.data[0].delay,
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
          <Doughnut data={this.state.user1chartData} />
          <h3> xAcceleration : {this.state.user1features[0]}</h3>
          <h3> yAcceleration : {this.state.user1features[1]}</h3>
          <h3> zAcceleration : {this.state.user1features[2]}</h3>
          <h3> user Pos : {this.state.pos[0]}</h3>
        </div>
      );
    } else if (this.props.id === 2) {
      return (
        <div>
          <Doughnut data={this.state.user2chartData} />
          <h3> xAcceleration : {this.state.user2features[0]}</h3>
          <h3> yAcceleration : {this.state.user2features[1]}</h3>
          <h3> zAcceleration : {this.state.user2features[2]}</h3>
          <h3> user Pos : {this.state.pos[1]}</h3>
        </div>
      );
    } else {
      return (
        <div>
          <Doughnut data={this.state.user3chartData} />
          <h3> xAcceleration : {this.state.user3features[0]}</h3>
          <h3> yAcceleration : {this.state.user3features[1]}</h3>
          <h3> zAcceleration : {this.state.user3features[2]}</h3>
          <h3> user Pos : {this.state.pos[2]}</h3>
        </div>
      );
    }
  }
}
