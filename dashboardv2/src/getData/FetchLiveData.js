//todo Just fetch data and update the component

import React, { Component } from "react";
import axios from "axios";
import { LiveDataContext } from "../context/LiveDataContext";

/** Fetches LiveData from the backends and updates details
 *
 */
export default class FetchLiveData extends Component {
  _isMounted = false;

  static contextType = LiveDataContext;

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
    this._isMounted = true;
    if (this._isMounted) {
      this.timer = setInterval(() => this.getItems(), 500);
      //Update my context
    }
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
    const { updateLiveDataStream } = this.context;
    return <div>{() => updateLiveDataStream(this.state)}</div>;
  }
}
