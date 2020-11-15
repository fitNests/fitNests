//ONClick button that toggles the react state
import { Button } from "antd";
import React, { Component } from "react";
import axios from "axios";
import { SaveOutlined, SyncOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { Typography, Progress, Row, Col, InputNumber, Statistic } from "antd";

import { mostFreqStr } from "../components/misc/helper";

const { Title } = Typography;

//Triggers an onclick when a button is pressed to record data
export default class Record extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      recording: false,
      hair: 0,
      shouldershrug: 0,
      zigzag: 0,
      elbowlock: 0,
      rocket: 0,
      windowwipe: 0,
      scarecrow: 0,
      pushback: 0,
      unrecognized: 0,
      loadings: [],
      exerciseTally: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      percent: 0,
      repetitionsCompleted: 0,
      repetitionsRequired: 1,
      defaultStream: true,
      user1actionctr: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      user2actionctr: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      user3actionctr: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    };
    this.recordSessionToggle = this.recordSessionToggle.bind(this);
    this.recordSession = this.recordSession.bind(this);
    this.countDown = this.countDown.bind(this);
    this.saveSession = this.saveSession.bind(this);
    this.updateState = this.updateState.bind(this);
    this.setRepetitions = this.setRepetitions.bind(this);
    this.clearData = this.clearData.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.timer = setInterval(() => this.recordSession(), 500);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  //Updates the actions executed by each individual user.
  updateIndividualCtr(userNo, exercise) {
    if (userNo === 1) {
      let arr = this.state.user1actionctr;
      switch (exercise) {
        case "elbowlock":
          console.log("user1 elbowlock ++");
          arr[0] += 1;
          this.setState({ user1actionctr: arr });
          break;
        case "hair":
          console.log("user1 hair ++");
          arr[1] += 1;
          this.setState({ user1actionctr: arr });
          break;
        case "pushback":
          console.log("user1 pushback ++");
          arr[2] += 1;
          this.setState({ user1actionctr: arr });
          break;
        case "rocket":
          console.log("user1 rocket ++");
          arr[3] += 1;
          this.setState({ user1actionctr: arr });
          break;
        case "scarecrow":
          console.log("user1 scarecrow ++");
          arr[4] += 1;
          this.setState({ user1actionctr: arr });
          break;
        case "shouldershrug":
          console.log("user1 shouldershrug ++");
          arr[5] += 1;
          this.setState({ user1actionctr: arr });
          break;
        case "windowwipe":
          console.log("user1 windowwipe ++");
          arr[6] += 1;
          this.setState({ user1actionctr: arr });
          break;
        case "zigzag":
          console.log("user1 zigzag ++");
          arr[7] += 1;
          this.setState({ user1actionctr: arr });
          break;
        case "unrecognized":
          console.log("unrecognized state ++");
          arr[8] += 1;
          this.setState({ user1actionctr: arr });
          break;
        default:
          console.log("No dance move detected");
      }
    } else if (userNo === 2) {
      let arr = this.state.user2actionctr;
      switch (exercise) {
        case "elbowlock":
          console.log("user2 elbowlock ++");
          arr[0] += 1;
          this.setState({ user2actionctr: arr });
          break;
        case "hair":
          console.log("user2 hair ++");
          arr[1] += 1;
          this.setState({ user2actionctr: arr });
          break;
        case "pushback":
          console.log("user2 pushback ++");
          arr[2] += 1;
          this.setState({ user2actionctr: arr });
          break;
        case "rocket":
          console.log("user2 rocket ++");
          arr[3] += 1;
          this.setState({ user2actionctr: arr });
          break;
        case "scarecrow":
          console.log("user2 scarecrow ++");
          arr[4] += 1;
          this.setState({ user2actionctr: arr });
          break;
        case "shouldershrug":
          console.log("user2 shouldershrug ++");
          arr[5] += 1;
          this.setState({ user2actionctr: arr });
          break;
        case "windowwipe":
          console.log("user2 windowwipe ++");
          arr[6] += 1;
          this.setState({ user2actionctr: arr });
          break;
        case "zigzag":
          console.log("user2 zigzag ++");
          arr[7] += 1;
          this.setState({ user2actionctr: arr });
          break;
        case "unrecognized":
          console.log("unrecognized state ++");
          arr[8] += 1;
          this.setState({ user2actionctr: arr });
          break;
        default:
          console.log("No dance move detected");
      }
    } else if (userNo === 3) {
      let arr = this.state.user3actionctr;
      switch (exercise) {
        case "elbowlock":
          console.log("user3 elbowlock ++");
          arr[0] += 1;
          this.setState({ user3actionctr: arr });
          break;
        case "hair":
          console.log("user3 hair ++");
          arr[1] += 1;
          this.setState({ user3actionctr: arr });
          break;
        case "pushback":
          console.log("user3 pushback ++");
          arr[2] += 1;
          this.setState({ user3actionctr: arr });
          break;
        case "rocket":
          console.log("user3 rocket ++");
          arr[3] += 1;
          this.setState({ user3actionctr: arr });
          break;
        case "scarecrow":
          console.log("user3 scarecrow ++");
          arr[4] += 1;
          this.setState({ user3actionctr: arr });
          break;
        case "shouldershrug":
          console.log("user3 shouldershrug ++");
          arr[5] += 1;
          this.setState({ user3actionctr: arr });
          break;
        case "windowwipe":
          console.log("user3 windowwipe ++");
          arr[6] += 1;
          this.setState({ user3actionctr: arr });
          break;
        case "zigzag":
          console.log("user3 zigzag ++");
          arr[7] += 1;
          this.setState({ user3actionctr: arr });
          break;
        case "unrecognized":
          console.log("unrecognized state ++");
          arr[8] += 1;
          this.setState({ user3actionctr: arr });
          break;
        default:
          console.log("No dance move detected");
      }
    }
  }

  //Updates the frequency of action actions executed by the majority vote
  updateExerciseCtr(exercise) {
    switch (exercise) {
      case "windowwipe":
        console.log("windowwipe ++");
        this.setState({ windowwipe: this.state.windowwipe + 1 });
        break;
      case "pushback":
        console.log("pushback ++");
        this.setState({ pushback: this.state.pushback + 1 });
        break;
      case "rocket":
        console.log("rocket ++");
        this.setState({ rocket: this.state.rocket + 1 });
        break;
      case "elbowlock":
        console.log("elbowlock ++");
        this.setState({ elbowlock: this.state.elbowlock + 1 });
        break;
      case "hair":
        console.log("hair ++");
        this.setState({ hair: this.state.hair + 1 });
        break;
      case "scarecrow":
        console.log("scarecrow ++");
        this.setState({ scarecrow: this.state.scarecrow + 1 });
        break;
      case "zigzag":
        console.log("zigzag ++");
        this.setState({ zigzag: this.state.zigzag + 1 });
        break;
      case "shouldershrug":
        console.log("shouldershrug ++");
        this.setState({ shouldershrug: this.state.shouldershrug + 1 });
        break;
      case "unrecognized":
        console.log("unrecognized state ++");
        this.setState({ unrecognized: this.state.unrecognized + 1 });
        break;
      default:
        console.log("No dance move detected");
    }
  }

  //Toggles between start/stop recording session
  recordSessionToggle = () => {
    this.setState({ recording: !this.state.recording });
  };

  //Evaluates whether a session should be recorded and records if necessary
  recordSession(id) {
    if (this.state.recording) {
      axios
        .get("http://localhost:5000/testuser/")
        .then((response) => {
          console.log(response.data[0]._id);
          if (this.state.id !== response.data[0]._id) {
            if (this.state.id !== "") {
              // if the id is different
              this.setState({
                id: response.data[0]._id,
                repetitionsCompleted: this.state.repetitionsCompleted + 1,
                percent: Math.floor(
                  ((this.state.repetitionsCompleted + 1) /
                    this.state.repetitionsRequired) *
                    100
                ),
              });

              // Set it to default else, set the majority vote as the ctr
              console.log("MAJORITY VOTES ");

              //Check Data Before Increment

              this.updateIndividualCtr(1, response.data[0].user1action);
              this.updateIndividualCtr(2, response.data[0].user2action);
              this.updateIndividualCtr(3, response.data[0].user3action);

              let majVote = mostFreqStr([
                response.data[0].user1action,
                response.data[0].user2action,
                response.data[0].user3action,
              ]);
              if (majVote.length > 1) {
                // if the length of the actions recorded is more than 1, then that means that they are all unique hence the system categorise them as unknown
                console.log("increment default");
                this.updateExerciseCtr("unrecognized");
              } else {
                this.updateExerciseCtr(majVote[0]);
              }
              console.log(majVote);
            } else {
              this.setState({
                id: response.data[0]._id,
              });
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  //Returns updated the exercise tally value
  updateState = (exerciseTally) => {
    let updatedExerciseTally = exerciseTally;
    let savedTally = [
      this.state.hair,
      this.state.zigzag,
      this.state.rocket,
      this.state.shouldershrug,
      this.state.windowwipe,
      this.state.elbowlock,
      this.state.pushback,
      this.state.scarecrow,
      this.state.unrecognized,
    ];

    for (var i = 0; i < updatedExerciseTally.length; i++) {
      updatedExerciseTally[i] += savedTally[i];
    }
    return updatedExerciseTally;
  };

  //Clears the state data
  clearData() {
    console.log("Clearing data");
    this.setState({
      hair: 0,
      shouldershrug: 0,
      zigzag: 0,
      elbowlock: 0,
      rocket: 0,
      windowwipe: 0,
      scarecrow: 0,
      pushback: 0,
      unrecognized: 0,
      repetitionsCompleted: 0,
      user1actionctr: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      user2actionctr: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      user3actionctr: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    });
  }

  //This will save the session into our backend where the rest of the data is stored
  saveSession = () => {
    const exerciseData = {
      exerciseTally: this.updateState(this.state.exerciseTally),
    };

    axios
      .post("http://localhost:5000/exercise/add", exerciseData)
      .then((res) => console.log(res.data));

    this.clearData(); //clear the data after saving
  };

  //Model message countdown upon saving the recording state
  countDown = () => {
    let secondsToGo = 10;
    const modal = Modal.success({
      title: "Your session has been saved! ",
      content: `Return back to mainscreen in ${secondsToGo} seconds.`,
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: `Returning back to Main screen in ${secondsToGo} seconds.`,
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
    }, secondsToGo * 1000);
  };

  //Triggered upon save button press
  enterLoading = (index) => {
    this.countDown();
    this.saveSession(); // Save previous session's data

    this.setState(({ loadings }) => {
      const newLoadings = [...loadings];
      newLoadings[index] = true;

      return {
        loadings: newLoadings,
      };
    });
    setTimeout(() => {
      this.setState(({ loadings }) => {
        const newLoadings = [...loadings];
        newLoadings[index] = false;

        return {
          loadings: newLoadings,
        };
      });
    }, 6000);
  };

  //Set Repetitions needed to be completed
  setRepetitions(value) {
    this.setState({
      repetitionsRequired: value,
    });
    console.log("Repetitions Set: ", value);
  }

  //Returns the percentage of repetitions Completed
  getRepetitionsPercentageCompleted() {
    let x = Math.floor(
      (this.state.repetitionsCompleted / this.state.repetitionsRequired) * 100
    );
    return x;
  }

  render() {
    const { loadings } = this.state;

    return this.state.recording ? (
      <div>
        <Row gutter={16}>
          <Col span={14}>
            <br />
            <br />
            <Statistic
              title="Repetitions "
              value={this.state.repetitionsCompleted}
              suffix={"/" + this.state.repetitionsRequired}
            />
            <br />
          </Col>
          <Col span={6}>
            <br />
            <Progress
              type="dashboard"
              gapDegree={50}
              percent={this.getRepetitionsPercentageCompleted()}
            />
          </Col>
        </Row>
        <Title level={4}> Frequency</Title>

        <h3> Hair : {this.state.hair}</h3>
        <h3> ZigZag : {this.state.zigzag}</h3>
        <h3> Rocket : {this.state.rocket}</h3>
        <h3> Shouldershrug: {this.state.shouldershrug}</h3>
        <h3> WindowWipe : {this.state.windowwipe} </h3>
        <h3> Elbowlock : {this.state.elbowlock} </h3>
        <h3> Pushback : {this.state.pushback} </h3>
        <h3> Scarecrow : {this.state.scarecrow} </h3>
        <h3> Unrecognized : {this.state.unrecognized}</h3>
        <Button onClick={this.recordSessionToggle} type="primary" danger>
          {" "}
          Recording Session
        </Button>
        <SyncOutlined spin style={{ color: "red" }} />
        {"  "}
      </div>
    ) : (
      <div>
        <Row gutter={16}>
          <Col span={14}>
            <br />
            <h3 disabled level={5}>
              Set Repetitions :
            </h3>
            <InputNumber
              min={1}
              defaultValue={this.state.repetitionsRequired}
              onChange={this.setRepetitions}
              size={"small"}
            />
          </Col>
          <Col span={6}>
            <br />
            <Progress
              type="dashboard"
              gapDegree={50}
              percent={this.getRepetitionsPercentageCompleted()}
            />
          </Col>
        </Row>
        <Title level={4}> Frequency</Title>
        <h3>Hair : {this.state.hair}</h3>
        <h3> ZigZag : {this.state.zigzag}</h3>
        <h3> Rocket : {this.state.rocket}</h3>
        <h3> Shouldershrug: {this.state.shouldershrug}</h3>
        <h3> Windowipe : {this.state.windowwipe} </h3>
        <h3> Elbowlock : {this.state.elbowlock} </h3>
        <h3> Pushback : {this.state.pushback} </h3>
        <h3> Scarecrow : {this.state.scarecrow} </h3>
        <h3> Unrecognized : {this.state.unrecognized}</h3>
        <Button onClick={this.recordSessionToggle} danger>
          {" "}
          Start Recording
        </Button>

        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={loadings[1]}
          onClick={() => this.enterLoading(1)}
          danger
        >
          Save Session
        </Button>
      </div>
    );
  }
}
