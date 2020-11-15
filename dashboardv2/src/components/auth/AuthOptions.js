import React, { useContext } from "react";
import { useHistory } from "react-router-dom"; //react hook
import UserContext from "../../context/UserContext";
import { Button } from "antd";

//Handle User Authentication
export default function AuthOptions() {
  const { userData, setUserData } = useContext(UserContext);

  const history = useHistory(); //set up a class that uses history

  //traverse to different paths
  const register = () => history.push("/register");
  const login = () => history.push("/login");
  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
    history.push("/"); // pushes you back to the main screen once you log out
  };

  return userData.user ? (
    <Button type="primary" style={{ float: "right" }} onClick={logout}>
      Log out
    </Button>
  ) : (
    <>
      <Button
        type="primary"
        shape="flat"
        style={{ float: "right", marginLeft: 5 }}
        onClick={register}
      >
        Register
      </Button>
      <Button
        type="primary"
        shape="flat"
        style={{ float: "right", marginLeft: 20 }}
        onClick={login}
      >
        Log in
      </Button>
    </>
  );
}
