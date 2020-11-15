//Sample code for using state Hooks
import React, { Component, useState } from "react";
import { useHistory } from "react-router-dom"; //react hook
import { Button } from "antd";
import CreateTraineeProfile from "../traineeProfile/CreateTraineeProfile";
import { Typography, Divider, Table } from "antd";

const { Title, Paragraph, Text, Link } = Typography;

const dataSource = [
  {
    key: "1",
    name: "Mike",
    age: 32,
    address: "10 Downing Street",
  },
  {
    key: "2",
    name: "John",
    age: 42,
    address: "10 Downing Street",
  },
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

//todo - Modify Data Source and Ensure that the data is displayed on the table

export default function TraineeProfile() {
  const history = useHistory();

  const createNewUser = () => history.push("/createNewUser");

  const [profileState, setProfileState] = useState("");

  return profileState === "createuser" ? (
    <div>
      <Button onClick={(e) => setProfileState("createuser")}>
        {" "}
        Create User{" "}
      </Button>
      <Button onClick={(e) => setProfileState("modifyuser")}>
        {" "}
        Modify User{" "}
      </Button>
      <CreateTraineeProfile />
    </div>
  ) : (
    <div> Nothing</div>
  );
}
