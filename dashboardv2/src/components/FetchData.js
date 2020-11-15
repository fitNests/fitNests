//Used to fetch Data on the different users

import React, { Component } from "react";
import DanceGif from "./misc/DanceGif";
import { Typography } from "antd";
import { ucFirst } from "./misc/helper";
import { Select } from "antd";
import { LiveDataContext } from "../context/LiveDataContext";
const { Title } = Typography;

const { Option, OptGroup } = Select;

//Fetches Data and Display User Info
export default class FetchData extends Component {
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
      user1name: "",
      user2name: "",
      user3name: "",
    };
    this.changeUser1name = this.changeUser1name.bind(this);
    this.changeUser2name = this.changeUser2name.bind(this);
    this.changeUser3name = this.changeUser3name.bind(this);
  }

  changeUser1name(value) {
    console.log(`user1 ${value}`);
    this.setState({
      user1name: value,
    });
  }
  changeUser2name(value) {
    console.log(`selected ${value}`);
    this.setState({
      user2name: value,
    });
  }
  changeUser3name(value) {
    console.log(`selected ${value}`);
    this.setState({
      user3name: value,
    });
  }

  render() {
    return (
      <LiveDataContext.Consumer>
        {(liveDataContext) => {
          const { getState } = liveDataContext;
          if (this.props.id === 1) {
            return (
              <div>
                {this.state.user1name === "" ? (
                  <Title level={3}>USER 1 Details</Title>
                ) : (
                  <Title level={3}>
                    {" "}
                    User 1: {ucFirst(this.state.user1name)}{" "}
                  </Title>
                )}
                <DanceGif danceMove={getState().user1action} />

                <Select
                  defaultValue="Change User"
                  style={{ width: 200 }}
                  onChange={this.changeUser1name}
                >
                  <OptGroup label="Dancer 1">
                    <Option value="Claire">Claire</Option>
                    <Option value="Jiannan">Jiannan</Option>
                    <Option value="Lincoln">Lincoln</Option>
                    <Option value="Nic">Nic</Option>
                    <Option value="Umar">Umar</Option>
                    <Option value="Rusdi">Rusdi</Option>
                  </OptGroup>
                </Select>
                <Title level={4}> Dance Move Detected : </Title>
                {getState().user1action === "" ? (
                  <Title level={4}> --- </Title>
                ) : (
                  <Title level={4}> {ucFirst(getState().user1action)} </Title>
                )}
                <Title level={4}>User Position : {getState().pos[0]}</Title>
              </div>
            );
          } else if (this.props.id === 2) {
            return (
              <div>
                {this.state.user2name === "" ? (
                  <Title level={3}>USER 2 Details</Title>
                ) : (
                  <Title level={3}>
                    {" "}
                    User 2: {ucFirst(this.state.user2name)}{" "}
                  </Title>
                )}
                <DanceGif danceMove={getState().user2action} />
                <Select
                  defaultValue="Change User"
                  style={{ width: 200 }}
                  onChange={this.changeUser2name}
                >
                  <OptGroup label="Dancer 2">
                    <Option value="Claire">Claire</Option>
                    <Option value="Jiannan">Jiannan</Option>
                    <Option value="Lincoln">Lincoln</Option>
                    <Option value="Nic">Nic</Option>
                    <Option value="Umar">Umar</Option>
                    <Option value="Rusdi">Rusdi</Option>
                  </OptGroup>
                </Select>
                <Title level={4}> Dance Move Detected :</Title>
                {getState().user3action === "" ? (
                  <Title level={4}> --- </Title>
                ) : (
                  <Title level={4}> {ucFirst(getState().user2action)} </Title>
                )}
                <Title level={4}>User Position : {getState().pos[1]}</Title>
              </div>
            );
          } else {
            return (
              <div>
                {this.state.user3name === "" ? (
                  <Title level={3}>USER 3 Details</Title>
                ) : (
                  <Title level={3}>
                    User 3: {ucFirst(this.state.user3name)}{" "}
                  </Title>
                )}
                <DanceGif danceMove={getState().user3action} />
                <Select
                  defaultValue="Change User"
                  style={{ width: 200 }}
                  onChange={this.changeUser3name}
                >
                  <OptGroup label="Dancer 3">
                    <Option value="Claire">Claire</Option>
                    <Option value="Jiannan">Jiannan</Option>
                    <Option value="Lincoln">Lincoln</Option>
                    <Option value="Nic">Nic</Option>
                    <Option value="Umar">Umar</Option>
                    <Option value="Rusdi">Rusdi</Option>
                  </OptGroup>
                </Select>
                <Title level={4}> Dance Move Detected : </Title>
                {getState.user3action === "" ? (
                  <Title level={4}> --- </Title>
                ) : (
                  <Title level={4}> {ucFirst(getState().user3action)} </Title>
                )}
                <Title level={4}>User Position : {getState().pos[2]}</Title>
              </div>
            );
          }
        }}
      </LiveDataContext.Consumer>
    );
  }
}
