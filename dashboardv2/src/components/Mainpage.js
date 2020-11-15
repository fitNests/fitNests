import React, { Component } from "react";
import "../App.css";
import { Row, Col } from "antd";
import { Layout } from "antd";
import FetchObjectives from "./FetchObjectives";
import FetchData from "./FetchData"; 
import ChartDisplay from "../components/chartDisplays/ChartDisplay";
import Record from "../components/Record";
import { Typography } from "antd";

const { Title } = Typography;
const { Content } = Layout;

/**
 * Displays the data and components for the Main Dashboard
 */
export default class MainPage extends Component {
  render() {
    return (
      <Layout theme="dark">
        <Content style={{ padding: "0 10px" }}>
          <Row gutter={[24, 24]}>
            <Col span={6}>
              <div
                style={{
                  background: "#fff",
                  padding: 3,
                  minHeight: 580,
                }}
              >
                <Content style={{ padding: "0 2px", background: "white" }}>
                  <FetchData id={1} />
                  <ChartDisplay chartType={"doughnut"} userNumber={1} />
                </Content>
              </div>
            </Col>

            <Col span={6}>
              <div
                style={{
                  background: "#fff",
                  padding: 3,
                  minHeight: 580,
                }}
              >
                <Content style={{ padding: "0 2px", background: "white" }}>
                  <FetchData id={2} />
                  <ChartDisplay chartType={"doughnut"} userNumber={2} />
                </Content>
              </div>
            </Col>

            <Col span={6}>
              <div
                style={{
                  background: "#fff",
                  padding: 3,
                  minHeight: 580,
                }}
              >
                <Content style={{ padding: "0 2px", background: "white" }}>
                  <FetchData id={3} />
                  <ChartDisplay chartType={"doughnut"} userNumber={3} />
                </Content>
              </div>
            </Col>
            <Col span={6}>
              <div
                style={{
                  background: "#fff",
                  padding: 3,
                  minHeight: 580,
                }}
              >
                <Title level={3}>Data for Trainer </Title>
                <Content style={{ padding: "0 2px", background: "white" }}>
                  <FetchObjectives />
                  <Record />
                </Content>
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}
