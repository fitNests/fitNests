//Displays the list of exercises and some data on different types of exercises
import React, { Component } from "react";
import { Carousel } from "antd";
import { Layout, Row, Col } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Rocket from "../exerciseList/Rocket.exercise";
import WindowWipe from "../exerciseList/Window.exercise";
import Hair from "../exerciseList/Hair.exercise";

import UserContext from "../context/UserContext";

const { Content } = Layout;

/**
 * Toggles between the different Exercises
 */
export default class Exercise extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.exercise = React.createRef();
  }
  next() {
    this.carousel.next();
  }
  previous() {
    this.carousel.prev();
  }

  render() {
    const props = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    return (
      <div>
        <Layout style={{ backgroundColor: "white" }}>
          <Content style={{ padding: "0 50px" }}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <div
                  style={{ background: "#fff", padding: 24, minHeight: 580 }}
                >
                  <LeftOutlined onClick={this.previous} />
                  <RightOutlined onClick={this.next} />
                  <Carousel ref={(node) => (this.carousel = node)} {...props}>
                    <div>
                      <Rocket />
                    </div>
                    <div>
                      <WindowWipe />
                    </div>
                    <div>
                      <Hair />
                    </div>
                  </Carousel>
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </div>
    );
  }
}
