//Returns a Summary Page of all the different Exercises

import React, { Component } from "react";

import { Row, Col } from "antd";
import { List, Typography } from "antd";
import axios from "axios";
import LineDisplay from "../components/chartDisplays/LineDisplay";

const { Title } = Typography;

const data = ["Rocket - 5", " Zigzag - 7"];

export default class Rocket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 0,
      pos: [],
      expectedPos: [],
      user1action: "",
      user2action: "",
      user3action: "",
      delay: 0,
      user1features: [],
      user2features: [],
      user3features: [],
      user1chartData: {},
      user2chartData: {},
      user3chartData: {},
      exerciseTally: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      createdAt: ["mon", "tues"],
    };
  }
  componentDidMount() {
    this.timer = setInterval(() => this.getItems(), 500);
  }

  getItems() {
    axios
      .get("http://localhost:5000/exercise/")
      .then((response) => {
        if (response.data.length > 0) {
          this.setState({
            createdAt: response.data.map(
              (exerciseData) => exerciseData.createdAt
            ),
            exerciseTally: response.data.map(
              (exerciseData) => exerciseData.exerciseTally
              // });
            ),
            // exerciseTally: response.data[0].exerciseTally,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  displayData() {
    for (var x = 0; x < this.state.exerciseTally; x++) {
      return <LineDisplay data={this.state.exerciseTally[x]} />;
    }
  }

  mostFrequentExercise() {
    return <h1>Most freq : Shoulder Shrug</h1>;
  }

  render() {
    return (
      <div>
        <Title>Exercise Summary </Title>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div style={{ background: "#fff", padding: 24, minHeight: 580 }}>
              <div>
                <Row gutter={[24, 24]}>
                  <Col span={16}>
                    <Title level={3}> View Training Frequency </Title>
                    {this.state.exerciseTally.map((d) => (
                      <div>
                        <LineDisplay
                          data={[
                            parseInt(d[0]),
                            parseInt(d[1]),
                            parseInt(d[2]),
                            parseInt(d[3]),
                            parseInt(d[4]),
                            parseInt(d[5]),
                            parseInt(d[6]),
                            parseInt(d[7]),
                            parseInt(d[8]),
                          ]}
                        />
                      </div>
                    ))}
                  </Col>
                  <Col span={8}>
                    <center>
                      <Title level={3}>
                        {" "}
                        Exercise data from previous session{" "}
                      </Title>
                      <h1>Most freq : Shoulder Shrug</h1>
                    </center>
                    <Title level={3}> Steps </Title>
                    <List
                      size="small"
                      bordered
                      key={data}
                      dataSource={data}
                      renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                    <h2> Recommended Sets : 4 Reps : 5</h2>
                    <h3>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Phasellus convallis sapien quis enim molestie, ac ultrices
                      elit rhoncus. Nullam sit amet purus pellentesque,
                      ultricies elit eu, ultrices elit. Curabitur et nisi sed
                      sem maximus pulvinar ut ut tellus. Quisque suscipit non
                      ipsum rutrum dictum. Nam sed nisl mauris. Sed efficitur at
                      nisi eget feugiat. Integer eu egestas purus. Quisque eu
                      erat a ante malesuada feugiat. Mauris eleifend venenatis
                      augue, eu rhoncus ex scelerisque vel. Quisque vitae ex
                      vitae purus pellentesque aliquet. Nulla malesuada
                      imperdiet ante vel interdum. Duis eu ultrices felis. Nunc
                      condimentum, arcu in scelerisque sodales, magna magna
                      sagittis dui, at condimentum velit dolor eu erat. Sed
                      pharetra vel urna vitae varius. Phasellus ornare, magna
                      vulputate rutrum commodo, lectus sem varius metus, in
                      condimentum velit lacus sed eros. Aliquam vitae tristique
                      nisi, volutpat lacinia nibh. Maecenas dapibus orci non ex
                      semper placerat. Integer sed enim enim. Donec aliquet
                      lorem vitae ipsum posuere, non pulvinar metus viverra.
                      Quisque erat arcu, consectetur a odio id, sagittis cursus
                      mauris. Mauris faucibus nisi vitae diam aliquam, at
                      viverra tellus lobortis. Aliquam a hendrerit sapien,
                      semper dictum libero. Etiam cursus, magna et facilisis
                      sollicitudin, lacus tellus pellentesque arcu
                    </h3>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
