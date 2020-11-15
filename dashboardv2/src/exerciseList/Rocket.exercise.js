//Returns data on how the exercise is beneficial
import React, { Component } from "react";

import { Layout, Row, Col } from "antd";
import DanceGif from "../components/misc/DanceGif";
import { List, Typography } from "antd";
import { Radar } from "react-chartjs-2";

const { Title } = Typography;
const { Content } = Layout;

const data = ["1. Place your hands together", "2. Move your hands outwards"];

export default class Rocket extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      chartData: [10, 10, 10],
    };
  }
  componentDidMount() {
    this._isMounted = true;
    this.setState({
      chartData: {
        labels: ["Stamina", "Endurance", "Strength", "Agility", "Balance"],
        datasets: [
          {
            label: " ",
            data: [100, 50, 22, 88, 49],
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
    });
  }

  render() {
    return (
      <div>
        <Title>Rocket </Title>

        <Layout style={{ backgroundColor: "white" }}>
          <Content>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <div
                  style={{ background: "#fff", padding: 24, minHeight: 580 }}
                >
                  <div>
                    <Row gutter={[24, 24]}>
                      <Col span={16}>
                        <Title level={3}>
                          {" "}
                          Benefits : This exercise will train your hand strength
                        </Title>
                        <Radar data={this.state.chartData} />
                      </Col>
                      <Col span={8}>
                        <Row>
                          <Col span={15}>
                            <Title level={3}> Action </Title>
                            <center>
                              <DanceGif danceMove="rocket" width="100%" />
                            </center>
                          </Col>
                          <Col span={9}>
                            <br />
                            <br />
                            <Title level={4}>Recommended</Title>
                            <br />
                            <center>
                              <Title level={4}>Sets : 10 {"\n"}</Title>
                              <Title level={4}>Reps : 15</Title>
                            </center>
                          </Col>
                        </Row>
                        <Title level={3}> Steps </Title>
                        <List
                          size="small"
                          bordered
                          key={data}
                          dataSource={data}
                          renderItem={(item) => (
                            <List.Item key={item}>{item}</List.Item>
                          )}
                        />
                        <Title level={5}>Purpose of this exercise:</Title>
                        <h3>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Phasellus convallis sapien quis enim molestie,
                          ac ultrices elit rhoncus. Nullam sit amet purus
                          pellentesque, ultricies elit eu, ultrices elit.
                          Curabitur et nisi sed sem maximus pulvinar ut ut
                          tellus. Quisque suscipit non ipsum rutrum dictum. Nam
                          sed nisl mauris. Sed efficitur at nisi eget feugiat.
                          Integer eu egestas purus. Quisque eu erat a ante
                          malesuada feugiat. Mauris eleifend venenatis augue, eu
                          rhoncus ex scelerisque vel. Quisque vitae ex vitae
                          purus pellentesque aliquet. Nulla malesuada imperdiet
                          ante vel interdum. Duis eu ultrices felis. Nunc
                          condimentum, arcu in scelerisque sodales, magna magna
                          sagittis dui, at condimentum velit dolor eu erat. Sed
                          pharetra vel urna vitae varius. Phasellus ornare,
                          magna vulputate rutrum commodo, lectus sem varius
                          metus, in condimentum velit lacus sed eros. Aliquam
                          vitae tristique nisi, volutpat lacinia nibh. Maecenas
                          dapibus orci non ex semper placerat. Integer sed enim
                          enim. Donec aliquet lorem vitae ipsum posuere, non
                          pulvinar metus viverra. Quisque erat arcu, consectetur
                          a odio id, sagittis cursus mauris. Mauris faucibus
                          nisi vitae diam aliquam, at viverra tellus lobortis.
                          Aliquam a hendrerit sapien, semper dictum libero.
                          Etiam cursus, magna et facilisis sollicitudin, lacus
                          tellus pellentesque arcu
                        </h3>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </div>
    );
  }
}
