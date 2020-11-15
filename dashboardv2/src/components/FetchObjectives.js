import React, { Component } from "react";
import axios from "axios";
import { Row, Col, Statistic } from "antd";

/**
 * retrieves Objectives from server
 */
export default class FetchObjectives extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pos: [0, 0, 0],
      expectedPos: [0, 0, 0],
      type: 0,
      delay: 0,
      user1action: "",
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.getItems(), 500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null; // here...
  }

  getItems() {
    axios
      .get("http://localhost:5000/testuser/")
      .then((response) => {
        this.setState({
          pos: response.data[0].pos,
          type: response.data[0].type,
          expectedPos: response.data[0].expectedPos,
          delay: response.data[0].delay,
          user1action: response.data[0].user1action,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  countPos() {
    var correctPosCtr = 0;
    for (var i = 0; i < 3; i++) {
      if (this.state.pos[i] === this.state.expectedPos[i]) {
        correctPosCtr++;
      }
    }
    return correctPosCtr;
  }

  render() {
    return (
      <div>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="Desired Position"
              value={this.state.expectedPos}
            />
          </Col>
          <Col span={8}>
            <Statistic title=" Current Position" value={this.state.pos} />
          </Col>
          <Col span={8}>
            {this.countPos() === 3 ? (
              <div>
                <Statistic
                  title="Correct Position"
                  value={3}
                  valueStyle={{ color: "green" }}
                  suffix="/ 3"
                />
              </div>
            ) : (
              <div>
                <Statistic
                  title="Correct Position"
                  value={this.countPos()}
                  valueStyle={{ color: "#cf1322" }}
                  suffix="/ 3"
                />
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}
