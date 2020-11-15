//Exercise Frequency Context

import React, { Component, createContext } from "react";
import axios from "axios";

export const ExerciseFrequencyContext = createContext();

class ExerciseFrequencyContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exerciseTally: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      createdAt: [],
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.getItems(), 500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  getItems() {
    axios
      .get("http://localhost:5000/exercise/")
      .then((response) => {
        if (response.data.length > 0) {
          this.setState({
            createdAt: response.data.map(
              (exerciseData) => exerciseData.createdAt
            ),
            exerciseTally: response.data.map(
              (exerciseData) => exerciseData.exerciseTally
            ),
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getState = () => {
    return this.state;
  };

  render() {
    return (
      <ExerciseFrequencyContext.Provider
        value={{
          ...this.state,
          getState: this.getState,
        }}
      >
        {this.props.children}
      </ExerciseFrequencyContext.Provider>
    );
  }
}

// creating Provider and Consumer and exporting them.

export default ExerciseFrequencyContextProvider;
