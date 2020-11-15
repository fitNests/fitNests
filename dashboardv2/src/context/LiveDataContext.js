//Used to pass down trainee User Data
import React, { Component, createContext } from "react";
import axios from "axios";

export const LiveDataContext = createContext();

class LiveDataContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "stream",
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

  componentDidMount() {
    this.timer = setInterval(() => this.getItems(), 500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null; // here...
  }

  getItems() {
    axios
      .get("http://localhost:5000/testuser/")
      .then((response) => {
        this.setState({
          id: response.data[0].id,
          type: response.data[0].type,
          pos: response.data[0].pos,
          expectedPos: response.data[0].expectedPos,
          user1action: response.data[0].user1action,
          user2action: response.data[0].user2action,
          user3action: response.data[0].user3action,
          delay: response.data[0].delay,
          user1features: response.data[0].user1features,
          user2features: response.data[0].user2features,
          user3features: response.data[0].user3features,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  //Getstate used to prevent sameName for state in All the different contexts
  getState = () => {
    return this.state;
  };

  render() {
    return (
      <LiveDataContext.Provider
        value={{
          ...this.state,
          getState: this.getState,
        }}
      >
        {this.props.children}
      </LiveDataContext.Provider>
    );
  }
}

// creating Provider and Consumer and exporting them.

export default LiveDataContextProvider;
