//List of all the Trainees
import React, { Component } from "react";
// import { BrowserRouter as Link, Router, Route } from "react-router-dom";
import Link from "react-router-dom/Link";
import { Button } from "antd";
import { Typography, Table, Space } from "antd";
import axios from "axios";

const { Title } = Typography;

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Plan",
    dataIndex: "plan",
    key: "plan",
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <Space size="middle">
        <Link
          to={{
            pathname: "/trainee/individualTraineeProfile",
            state: { id: record._id },
          }}
        >
          More Details
        </Link>
      </Space>
    ),
  },
];

export default class TraineeList extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.deleteTrainee = this.deleteTrainee.bind(this);

    this.state = { trainee: [] };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      axios
        .get("http://localhost:5000/trainee/")
        .then((response) => {
          if (this._isMounted) {
            this.setState({ trainee: response.data });
            console.log("Printing State Results");
            console.log({ trainee: response.data });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  //Need to configure this portion
  deleteTrainee(id) {
    axios.delete("http://localhost:5000/trainee/" + id).then((response) => {
      console.log(response.data);
    });

    this.setState({
      exercises: this.state.trainee.filter((el) => el._id !== id),
    });
  }

  render() {
    return (
      <div>
        <Typography>
          <Title> Trainee Profile</Title>
          <Title level={3} style={{ float: "center" }}>
            List of Trainees
          </Title>
        </Typography>
        <Link to="/trainee/createNewUser">
          <Button style={{ float: "left" }}> Create New Trainee</Button>
        </Link>

        <Table
          rowKey="id"
          dataSource={this.state.trainee}
          columns={columns}
          pagination={{ position: ["bottomCenter"] }}
        />
      </div>
    );
  }
}
