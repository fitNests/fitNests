import React, { Component } from "react";
import { Carousel } from "antd";
import { Layout, Row, Col, Typography } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import UserProfile from "./UserProfile";
import ChartDisplay from "./chartDisplays/ChartDisplay";
import ExerciseSummary from "../exerciseList/ExerciseSummary";

const { Title } = Typography;
const { Content } = Layout;

/**
 * Toggles between the 3 different Users
 */
export default class CarouselComponent extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.carousel = React.createRef();
  }
  next() {
    this.carousel.next();
  }
  previous() {
    this.carousel.prev();
  }

  componentDidMount() {}

  componentWillUnmount() {}

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
        <Layout>
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
                      <ExerciseSummary />
                    </div>
                    <div>
                      <Title level={3}>First Person Chart Details</Title>

                      <Row gutter={[24, 24]}>
                        <Col span={16}>
                          <ChartDisplay chartType={"doughnut"} userNumber={1} />
                          <ChartDisplay chartType={"radar"} userNumber={1} />
                        </Col>
                        <Col span={8}>
                          <Title level={3}>User's Details</Title>
                          <h2>Name : Bob Marley</h2>
                          <h3>Age : 41 </h3>
                          <UserProfile />
                          <h3>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Phasellus convallis sapien quis enim molestie,
                            ac ultrices elit rhoncus. Nullam sit amet purus
                            pellentesque, ultricies elit eu, ultrices elit.
                            Curabitur et nisi sed sem maximus pulvinar ut ut
                            tellus. Quisque suscipit non ipsum rutrum dictum.
                            Nam sed nisl mauris. Sed efficitur at nisi eget
                            feugiat. Integer eu egestas purus. Quisque eu erat a
                            ante malesuada feugiat. Mauris eleifend venenatis
                            augue, eu rhoncus ex scelerisque vel. Quisque vitae
                            ex vitae purus pellentesque aliquet. Nulla malesuada
                            imperdiet ante vel interdum. Duis eu ultrices felis.
                            Nunc condimentum, arcu in scelerisque sodales, magna
                            magna sagittis dui, at condimentum velit dolor eu
                            erat. Sed pharetra vel urna vitae varius. Phasellus
                            ornare, magna vulputate rutrum commodo, lectus sem
                            varius metus, in condimentum velit lacus sed eros.
                            Aliquam vitae tristique nisi, volutpat lacinia nibh.
                            Maecenas dapibus orci non ex semper placerat.
                            Integer sed enim enim. Donec aliquet lorem vitae
                            ipsum posuere, non pulvinar metus viverra. Quisque
                            erat arcu, consectetur a odio id, sagittis cursus
                            mauris. Mauris faucibus nisi vitae diam aliquam, at
                            viverra tellus lobortis. Aliquam a hendrerit sapien,
                            semper dictum libero. Etiam cursus, magna et
                            facilisis sollicitudin, lacus tellus pellentesque
                            arcu
                          </h3>
                        </Col>
                      </Row>
                    </div>

                    <div>
                      <Title level={3}>Second Person Details</Title>

                      <Row gutter={[24, 24]}>
                        <Col span={16}>
                          <ChartDisplay chartType={"doughnut"} userNumber={2} />
                          <ChartDisplay chartType={"radar"} userNumber={2} />
                        </Col>
                        <Col span={8}>
                          <Title level={3}>User's Details</Title>
                          <h2>Name : Jake Arthur Marley</h2>
                          <h3>Age : 28 </h3>
                          <UserProfile />
                          <h3>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Phasellus convallis sapien quis enim molestie,
                            ac ultrices elit rhoncus. Nullam sit amet purus
                            pellentesque, ultricies elit eu, ultrices elit.
                            Curabitur et nisi sed sem maximus pulvinar ut ut
                            tellus. Quisque suscipit non ipsum rutrum dictum.
                            Nam sed nisl mauris. Sed efficitur at nisi eget
                            feugiat. Integer eu egestas purus. Quisque eu erat a
                            ante malesuada feugiat. Mauris eleifend venenatis
                            augue, eu rhoncus ex scelerisque vel. Quisque vitae
                            ex vitae purus pellentesque aliquet. Nulla malesuada
                            imperdiet ante vel interdum. Duis eu ultrices felis.
                            Nunc condimentum, arcu in scelerisque sodales, magna
                            magna sagittis dui, at condimentum velit dolor eu
                            erat. Sed pharetra vel urna vitae varius. Phasellus
                            ornare, magna vulputate rutrum commodo, lectus sem
                            varius metus, in condimentum velit lacus sed eros.
                            Aliquam vitae tristique nisi, volutpat lacinia nibh.
                            Maecenas dapibus orci non ex semper placerat.
                            Integer sed enim enim. Donec aliquet lorem vitae
                            ipsum posuere, non pulvinar metus viverra. Quisque
                            erat arcu, consectetur a odio id, sagittis cursus
                            mauris. Mauris faucibus nisi vitae diam aliquam, at
                            viverra tellus lobortis. Aliquam a hendrerit sapien,
                            semper dictum libero. Etiam cursus, magna et
                            facilisis sollicitudin, lacus tellus pellentesque
                            arcu
                          </h3>
                        </Col>
                      </Row>
                    </div>

                    <div>
                      <Title level={3}>Third Person Details</Title>
                      <Row gutter={[24, 24]}>
                        <Col span={16}>
                          <ChartDisplay chartType={"doughnut"} userNumber={3} />
                          <ChartDisplay chartType={"radar"} userNumber={3} />
                        </Col>
                        <Col span={8}>
                          <Title level={3}>User's Details</Title>
                          <h2>Name : Dnaka Biden Thomas</h2>
                          <h3>Age : 89 </h3>
                          <UserProfile />
                          <h3>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Phasellus convallis sapien quis enim molestie,
                            ac ultrices elit rhoncus. Nullam sit amet purus
                            pellentesque, ultricies elit eu, ultrices elit.
                            Curabitur et nisi sed sem maximus pulvinar ut ut
                            tellus. Quisque suscipit non ipsum rutrum dictum.
                            Nam sed nisl mauris. Sed efficitur at nisi eget
                            feugiat. Integer eu egestas purus. Quisque eu erat a
                            ante malesuada feugiat. Mauris eleifend venenatis
                            augue, eu rhoncus ex scelerisque vel. Quisque vitae
                            ex vitae purus pellentesque aliquet. Nulla malesuada
                            imperdiet ante vel interdum. Duis eu ultrices felis.
                            Nunc condimentum, arcu in scelerisque sodales, magna
                            magna sagittis dui, at condimentum velit dolor eu
                            erat. Sed pharetra vel urna vitae varius. Phasellus
                            ornare, magna vulputate rutrum commodo, lectus sem
                            varius metus, in condimentum velit lacus sed eros.
                            Aliquam vitae tristique nisi, volutpat lacinia nibh.
                            Maecenas dapibus orci non ex semper placerat.
                            Integer sed enim enim. Donec aliquet lorem vitae
                            ipsum posuere, non pulvinar metus viverra. Quisque
                            erat arcu, consectetur a odio id, sagittis cursus
                            mauris. Mauris faucibus nisi vitae diam aliquam, at
                            viverra tellus lobortis. Aliquam a hendrerit sapien,
                            semper dictum libero. Etiam cursus, magna et
                            facilisis sollicitudin, lacus tellus pellentesque
                            arcu
                          </h3>
                        </Col>
                      </Row>
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
