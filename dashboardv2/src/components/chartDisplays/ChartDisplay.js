import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import TraineeProfile from "../test/testComponent";
import { TraineeDataContext } from "../../context/TraineeDataContext";
import { LiveDataContext } from "../../context/LiveDataContext";
//import DoughnutDisplay from "../test/DoughnutDisplay";
import DoughnutDisplay from "../chartDisplays/DoughnutDisplay";

import LiveRadarDisplay from "./LiveRadarDisplay";
import LineDisplay from "./LineDisplay";

//For Live Data
//Todo for chart display take in 2 props from parent component type and number-person
//Depending on the user input it should parse in different values
/**
 * 1. Do if else statement to render different things according to the props
 * 2. <Doughnut> Test</Doughnut>
 * 3. <Radar> Test</Radar>
 */

export default class ChartDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartType: "doughnut",
      userNumber: 1,
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
      user1chartData: {},
      user2chartData: {},
      user3chartData: {},
    };
  }

  //Todo - remove traineedatacontext if not using for now just leave it
  render() {
    return (
      <LiveDataContext.Consumer>
        {(liveDataContext) => (
          <TraineeDataContext.Consumer>
            {(traineeDataContext) => {
              const { getState } = liveDataContext;
              if (this.props.chartType === "doughnut") {
                if (this.props.userNumber === 1) {
                  return <DoughnutDisplay data={getState().user1features} />;
                } else if (this.props.userNumber === 2) {
                  return <DoughnutDisplay data={getState().user2features} />;
                } else {
                  return <DoughnutDisplay data={getState().user3features} />;
                }
              } else if (this.props.chartType === "radar") {
                if (this.props.userNumber === 1) {
                  return <LiveRadarDisplay data={getState().user1features} />;
                } else if (this.props.userNumber === 2) {
                  return <LiveRadarDisplay data={getState().user2features} />;
                } else {
                  return <LiveRadarDisplay data={getState().user2features} />;
                }
              } else if (this.props.chartType === "line") {
                if (this.props.userNumber === 1) {
                  return <LineDisplay data={getState().user1features} />;
                } else if (this.props.userNumber === 2) {
                  return <LineDisplay data={getState().user2features} />;
                } else {
                  return <LineDisplay data={getState().user2features} />;
                }
              } else {
                return <h1> Nothing Returned</h1>;
              }
              /* By right return should be here */
            }}
          </TraineeDataContext.Consumer>
        )}
      </LiveDataContext.Consumer>
    );
  }
}
