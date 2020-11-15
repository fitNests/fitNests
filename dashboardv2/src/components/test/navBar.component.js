//outdated
import React, { Component, useContext } from "react";
import { Link } from "react-router-dom"; //Allows us to link different routes
import "../App.css";
import { Typography, Layout } from "antd";
import AuthOptions from "../auth/AuthOptions";
//import User from "../../backend/models/user.model";

const { Header } = Layout;
const { Title } = Typography;

export default class NavBar extends Component {
  render() {
    return (
      <Layout>
        <Header style={{ padding: 5 }}>
          <Link to="/">
            <Title style={{ color: "white", float: "left" }} level={3}>
              {" "}
              Main Dashboard
            </Title>
          </Link>

          <Link to="/traineeDashboard">
            <Title
              style={{ color: "white", float: "left", marginLeft: 40 }}
              level={3}
            >
              {" "}
              Training Logs{" "}
            </Title>
          </Link>

          <Link to="/user">
            <Title
              style={{ color: "white", float: "left", marginLeft: 50 }}
              level={3}
            >
              {" "}
              User Info{" "}
            </Title>
          </Link>
          <AuthOptions />
        </Header>
      </Layout>
    );
  }
}
