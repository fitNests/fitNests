//Expands on User Profile Details

import React, { Component } from "react";
import { Popconfirm, Space } from "antd";
import "../App.css";
import axios from "axios";
import { PageHeader, Button, Descriptions, Typography, message } from "antd";

import { userHeaderFormat } from "../components/misc/helper";

const { Title } = Typography;

export default class IndividualTraineeProfile extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    this.getUserData = this.getUserData.bind(this);
    this.onClickDeleteTrainee = this.onClickDeleteTrainee.bind(this);
    this.confirm = this.confirm.bind(this);

    this.state = {
      id: "",
      name: "",
      email: "",
      age: 0,
      address: "",
      gender: "",
      plan: "",
    };
  }
  getUserData(id) {
    axios
      .get("http://localhost:5000/trainee/" + id)
      .then((response) => {
        console.log("Fetch data to be modified");
        console.log(response.data);
        this.setState(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    console.log(this.props.location.state.id);
    this.getUserData(this.props.location.state.id);
    this.setState({ id: this.props.location.state.id });
  }

  onClickDeleteTrainee() {
    axios
      .delete("http://localhost:5000/trainee/" + this.state.id)
      .then((response) => {
        console.log(response.data);
      });

    window.history.back();
  }

  confirm() {
    message.info("User Deleted!");
    this.onClickDeleteTrainee();
  }

  //Load trainee data context and save it

  render() {
    return (
      <div>
        <PageHeader
          className="site-page-header"
          onBack={() => window.history.back()}
          title="Return "
          subTitle=""
          extra={[
            <div>
              <Popconfirm
                placement="top"
                title={"Are you sure you want to delete this user?"}
                onConfirm={this.confirm}
                okText="Yes"
                cancelText="No"
              >
                <Button key="1" type="primary">
                  Delete User
                </Button>
              </Popconfirm>
              ,
            </div>,
          ]}
        >
          <Space direction="vertical">
            <Title>{userHeaderFormat(this.state.name)} Profile(Trainee)</Title>
          </Space>
          <br />

          <Descriptions size="small" column={3}>
            <Descriptions.Item label="Name">
              {this.state.name}
            </Descriptions.Item>

            <Descriptions.Item label=" Email address">
              <a>{this.state.email}</a>
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {this.state.address}
            </Descriptions.Item>
            <Descriptions.Item label="Age">{this.state.age}</Descriptions.Item>
            <Descriptions.Item label="Plan">
              <a> {this.state.plan} </a>
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </div>
    );
  }
}
