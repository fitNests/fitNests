//Not Used

//This never gets called
import React, { Component } from "react";
import axios from "axios";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";

/**
 * Chart is used for testing the different types of Charts
 */
export default class Chart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      pos: [],
      action: "",
      delay: 0,
      user1: [],
      user2: [],
      user3: [],
      user1chartData: {},
      user2chartData: {},
      user3chartData: {},
    };
  }

  //Used to poll the mongDB database every x seconds
  componentDidMount() {
    this.timer = setInterval(() => this.getItems(), 500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  //fetch the data from mongoDb
  getItems() {
    axios
      .get("http://localhost:5000/testuser/")
      .then((response) => {
        this.setState({
          user1chartData: {
            labels: ["xPos", "yPos", "zPos"],
            datasets: [
              {
                label: "Relative Positioning",
                data: [
                  response.data[0].user1[0],
                  response.data[0].user1[1],
                  response.data[0].user1[2],
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
                  response.data[0].user2[0],
                  response.data[0].user2[1],
                  response.data[0].user2[2],
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
                  response.data[0].user3[0],
                  response.data[0].user3[1],
                  response.data[0].user3[2],
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
          action: response.data[0].action,
          delay: response.data[0].delay,
          user1: response.data[0].user1,
          user2: response.data[0].user2,
          user3: response.data[0].user3,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="chart">
        <h3> id : {this.state.id}</h3>
        <h3> dance move : {this.state.action}</h3>
        <h3> delay : {this.state.delay}</h3>

        <h3>User One </h3>
        <Doughnut data={this.state.user1chartData} />
        <h3> xPos : {this.state.user1[0]}</h3>
        <h3> yPos : {this.state.user1[1]}</h3>
        <h3> zPos : {this.state.user1[2]}</h3>
        <h3> user Pos : {this.state.pos[0]}</h3>
        <h3>User Two </h3>
        <Doughnut data={this.state.user2chartData} />
        <h3> xPos : {this.state.user2[0]}</h3>
        <h3> yPos : {this.state.user2[1]}</h3>
        <h3> zPos : {this.state.user2[2]}</h3>
        <h3> user Pos : {this.state.pos[1]}</h3>
        <h3>User Three </h3>
        <Doughnut data={this.state.user3chartData} />
        <h3> xPos : {this.state.user3[0]}</h3>
        <h3> yPos : {this.state.user3[1]}</h3>
        <h3> zPos : {this.state.user3[2]}</h3>
        <h3> user Pos : {this.state.pos[2]}</h3>

        <h3> {this.state.user1}</h3>
        <h3> {this.state.user2}</h3>
        <h3> {this.state.user3[0]}</h3>
        <h3>Something</h3>
      </div>
    );
  }
}
