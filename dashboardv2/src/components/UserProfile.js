//Simulates some sort of user Profile Load
import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import UserProfilePic from "../icons/default.png";
import { Layout, Row, Col } from "antd";
const { Content } = Layout;

/**
 * Prints out the history for each user
 */
export default class UserProfile extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.incrementCtr = this.incrementCtr.bind(this);
    this.decrementCtr = this.decrementCtr.bind(this);

    this.state = {
      chartData: {
        labels: [1],
      },
      ctr: 0,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.timer = setInterval(() => this.getChartData(this.state.ctr), 500);
      this.timer = setInterval(() => this.incrementCtr(), 500);
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.timer);
    this.timer = null; // here...
  }

  //Used to simulate live data being logged
  incrementCtr() {
    if (this.state.ctr === 2) {
      this.setState({
        ctr: 0,
      });
    } else {
      this.setState({
        ctr: this.state.ctr + 1,
      });
    }
  }

  decrementCtr() {
    this.setState({
      ctr: this.state.ctr - 1,
    });
  }

  getChartData(chartType) {
    if (chartType === 0) {
      this.setState({
        chartData: {
          labels: [1, 2, 3, 4, 5],
          datasets: [
            {
              label: "xPos",
              data: [10, 50, 10, 50, 10],
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
            {
              label: "yPos",
              data: [10, 0, 10, 0, 10],
              backgroundColor: [
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
    } else if (chartType === 1) {
      this.setState({
        chartData: {
          labels: [1, 2, 3, 4, 5, 6],
          datasets: [
            {
              label: "xPos",
              data: [10, 50, 10, 50, 10, 50],
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
            {
              label: "yPos",
              data: [10, 0, 10, 0, 10, 0],
              backgroundColor: [
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
    } else {
      this.setState({
        chartData: {
          labels: [1, 2, 3, 4, 5, 6, 7],
          datasets: [
            {
              label: "xPos",
              data: [10, 50, 10, 50, 10, 50, 10],
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
            {
              label: "yPos",
              data: [10, 0, 10, 0, 10, 0, 10],
              backgroundColor: [
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
        <Layout style={{ backgroundColor: "white" }}>
          <Content>
            <Row justify="center">
              <Col span={6}>
                <img
                  src={UserProfilePic}
                  alt="ConfusedGif"
                  className="center"
                  width={200}
                />
              </Col>
            </Row>
          </Content>
        </Layout>

        <Line data={this.state.chartData} />
        <h1> Chart type : {this.state.ctr}</h1>
      </div>
    );
  }
}
