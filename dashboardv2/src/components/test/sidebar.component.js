//Not really used

import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { Layout, Menu } from "antd";

const { Sider } = Layout;

export default class Sidebar extends Component {
  render() {
    return (
      <Sider>
        <Menu defaultSelectedKeys={["Dashboard"]} mode="inline">
          <Menu.Item key="Dashboard">Dashboard</Menu.Item>
          <Menu.Item key="test">
            <Link to="./carousel">Exercises</Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}
