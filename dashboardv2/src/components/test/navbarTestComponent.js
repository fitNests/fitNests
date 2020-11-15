//Functional implementation of Navbar

import React, { useContext } from "react";
import { Link } from "react-router-dom"; //Allows us to link different routes
import "../App.css";
import { Typography, Layout } from "antd";
import AuthOptions from "./auth/AuthOptions";
import UserContext from "../context/UserContext";

const { Header } = Layout;
const { Title } = Typography;

export default function NavBar() {
  const { userData } = useContext(UserContext);

  //checks whether im logged in
  return userData.user ? (
    <Layout>
      <Header style={{ padding: 5 }}>
        <Link to="/">
          <Title style={{ color: "white", float: "left" }} level={3}>
            {" "}
            Main Dashboard
          </Title>
        </Link>

        <Link to="/Exercises">
          <Title
            style={{ color: "white", float: "left", marginLeft: 40 }}
            level={3}
          >
            {" "}
            Exercises
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
          {/* <Link to="/traineeProfile"> */}
          <Title
            style={{ color: "white", float: "left", marginLeft: 50 }}
            level={3}
          >
            {" "}
            Trainee Profile{" "}
          </Title>
        </Link>

        <AuthOptions />
      </Header>
    </Layout>
  ) : (
    <Layout>
      <Header style={{ padding: 5 }}>
        <Link to="/">
          <Title style={{ color: "white", float: "left" }} level={3}>
            {" "}
            Main Dashboard
          </Title>
        </Link>
        <Link to="/Exercises">
          <Title
            style={{ color: "white", float: "left", marginLeft: 40 }}
            level={3}
          >
            {" "}
            Exercises
          </Title>
        </Link>

        <AuthOptions />
      </Header>
    </Layout>
  );
}

{
  /* <Link to="/testComponent">
<Title
  style={{ color: "white", float: "left", marginLeft: 50 }}
  level={3}
>
  {" "}
  Test Component{" "}
</Title>
</Link>
<Link to="/ClassTestComponent">
<Title
  style={{ color: "white", float: "left", marginLeft: 50 }}
  level={3}
>
  {" "}
  Class Test Component{" "}
</Title>
</Link> */
}
