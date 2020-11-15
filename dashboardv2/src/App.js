import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "./components/NavBar";

import MainPage from "./components/Mainpage";
import TraineeDashboard from "./components/TraineeDashboard";
import TraineeProfile from "./components/TraineeProfile";
import Carousel from "./components/Carousell";
import Exercises from "./components/Exercise";

import CreateNewUser from "./traineeProfile/CreateTraineeProfile";
import IndividualTraineeProfile from "./traineeProfile/IndividualTraineeProfile";

import TestComponent from "./components/test/testComponent";
import ClassTestComponent from "./components/test/testClassComponent";

//import "./style.css";
import axios from "axios";
import UserContext from "./context/UserContext";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

//Trainee Data Context
import TraineeDataContextProvider from "./context/TraineeDataContext";
import LiveDataContextProvider from "./context/LiveDataContext";
import ExerciseFrequencyContextProvider from "./context/ExerciseFrequencyContext";

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  //runs when the apps start - issue with sync functions
  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        //if authtoken doesnt exist - for the very first time you use the website
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenRes = await axios.post(
        "http://localhost:5000/users/tokenIsValid",
        null,
        { headers: { "x-auth-token": token } }
      );
      if (tokenRes.data) {
        const userRes = await axios.get("http://localhost:5000/users/", {
          headers: { "x-auth-token": token },
        });
        setUserData({
          token,
          user: userRes.data,
        });
      }
    };
    checkLoggedIn();
  }, []);
  //

  return (
    <Router>
      <LiveDataContextProvider>
        <ExerciseFrequencyContextProvider>
          <TraineeDataContextProvider>
            <UserContext.Provider value={{ userData, setUserData }}>
              <div className="App">
                <NavBar />
                <Route path="/" exact component={MainPage} />
                <Route path="/user" exact component={TraineeProfile} />

                <Route
                  path="/traineeDashboard"
                  exact
                  component={TraineeDashboard}
                />
                <Route path="/carousel" exact component={Carousel} />
                <Route path="/login" exact component={Login} />
                <Route path="/register" exact component={Register} />
                <Route
                  path="/trainee/createNewUser"
                  exact
                  component={CreateNewUser}
                />

                <Route
                  path="/trainee/individualTraineeProfile"
                  exact
                  component={IndividualTraineeProfile}
                />
                <Route path="/testComponent" exact component={TestComponent} />
                <Route
                  path="/classTestComponent"
                  exact
                  component={ClassTestComponent}
                />
                <Route path="/Exercises" exact component={Exercises} />
              </div>
            </UserContext.Provider>
          </TraineeDataContextProvider>
        </ExerciseFrequencyContextProvider>
      </LiveDataContextProvider>
    </Router>
  );
}

export default App;
