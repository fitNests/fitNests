//Used to pass down trainee User Data
import React, { Component, createContext } from "react";

export const TraineeDataContext = createContext();

class TraineeDataContextProvider extends Component {
  state = {
    name: "jake",
    email: "jake@gmail.com",
    age: 3,
    address: "address@address.com",
    gender: "male",
    plan: "planB",
  };
  toggleState = () => {
    this.setState({ age: this.state.age + 1 });
  };
  render() {
    return (
      <TraineeDataContext.Provider
        value={{ ...this.state, toggleState: this.toggleState }}
      >
        {this.props.children}
      </TraineeDataContext.Provider>
    );
  }
}

// creating Provider and Consumer and exporting them.

export default TraineeDataContextProvider;
