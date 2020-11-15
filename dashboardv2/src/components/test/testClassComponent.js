import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import TraineeProfile from "../test/testComponent";
// import { TraineeDataContext } from "../../context/TraineeDataContext";
// import { LiveDataContext } from "../../context/LiveDataContext";
// import LineDisplay from "../chartDisplays/LineDisplay";
// // import DoughnutDisplay from "../test/DoughnutDisplay";
// import ChartDisplay from "../chartDisplays/ChartDisplay";
export default class TestClass extends Component {
  render() {
    return <h1>Something</h1>;
  }
}

// export default class TestClass extends Component {
//   // static contextType = TraineeDataContext;
//   constructor(props) {
//     super(props);
//     this.state = {
//       type: 0,
//       pos: [],
//       expectedPos: [],
//       user1action: "",
//       user2action: "",
//       user3action: "",
//       delay: 0,
//       user1features: [],
//       user2features: [],
//       user3features: [],
//       user1chartData: {},
//       user2chartData: {},
//       user3chartData: {},
//       exerciseTally: [0, 0, 0, 0, 0, 0, 0, 0, 0],
//       createdAt: ["mon", "tues"],
//     };
//   }

//   //Used to poll the mongDB database every x seconds
//   // componentDidMount() {
//   //   this.timer = setInterval(() => this.getItems(), 500);
//   // }

//   // componentWillUnmount() {
//   //   clearInterval(this.timer);
//   //   this.timer = null; // here...
//   // }
//   // updateState = (someState) => {
//   //   this.setState(someState);
//   // };

//   componentDidMount() {
//     this.timer = setInterval(() => this.getItems(), 500);
//   }

//   getItems() {
//     axios
//       .get("http://localhost:5000/exercise/")
//       .then((response) => {
//         if (response.data.length > 0) {
//           this.setState({
//             createdAt: response.data.map(
//               (exerciseData) => exerciseData.createdAt
//             ),
//             exerciseTally: response.data.map(
//               (exerciseData) => exerciseData.exerciseTally
//               // });
//             ),
//             // exerciseTally: response.data[0].exerciseTally,
//           });
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   // componentWillUnmount() {
//   //   clearInterval(this.timer);
//   //   this.timer = null; // here...
//   // }

//   //Displays a carousell with all the different components

//   //Create a function that will return a list depending on the numb
//   displayData() {
//     for (var x = 0; x < this.state.exerciseTally; x++) {
//       return <LineDisplay data={this.state.exerciseTally[x]} />;
//     }
//   }

//   //Todo - convert d into an array of ints

//   render() {
//     // const { name, age, toggleState } = this.context;
//     return (
//       <LiveDataContext.Consumer>
//         {(liveDataContext) => (
//           <TraineeDataContext.Consumer>
//             {(traineeDataContext) => {
//               const { toggleState } = traineeDataContext;
//               const { state, getState } = liveDataContext;

//               return (
//                 <div>
//                   {this.state.exerciseTally.map((d) => (
//                     <div>
//                       <LineDisplay
//                         data={[
//                           parseInt(d[0]),
//                           parseInt(d[1]),
//                           parseInt(d[2]),
//                           parseInt(d[3]),
//                           parseInt(d[4]),
//                           parseInt(d[5]),
//                           parseInt(d[6]),
//                           parseInt(d[7]),
//                           parseInt(d[8]),
//                         ]}
//                       />
//                       {/* <LineDisplay data={[1, 3, 4, 1, 2, 3, 4, 2, 1]} /> */}
//                     </div>
//                   ))}
//                   <h1>{this.state.createdAt}</h1>
//                   {/* {() => this.displayData()} */}
//                   <h3>Logged Trainees</h3>
//                   <table className="table">
//                     <thead className="thead-light">
//                       <tr>
//                         <th>Name </th>
//                         <th>Email</th>
//                         <th>Age </th>
//                         <button onClick={() => toggleState()}>
//                           Increase Age
//                         </button>
//                         <th>Address</th>
//                         <th>Gender</th>
//                         <th>Plan</th>
//                       </tr>
//                     </thead>
//                     {/* <tbody>{this.traineeList()}</tbody> */}
//                   </table>
//                   <br />
//                   {/* {this.setState(getState())} */}
//                   {/* <h1> State Details{console.log("This state", this.state)}</h1> */}
//                   {/* <h1> State Details{console.log(getState())}</h1> */}
//                   <h1> Check Whether Data is Passed to child Component</h1>
//                   {/* <DoughnutDisplay data={getState().user1action} /> */}
//                   {/* <DoughnutDisplay
//                     data={getState().expectedPos}
//                     user1features={getState().user3features}
//                   />{" "} */}
//                   <h1>Chart Display Component</h1>
//                   <ChartDisplay chartType={"doughnut"} userNumber={1} />
//                   {/* {this.updateState(getState())} */}
//                 </div>
//               );
//             }}
//           </TraineeDataContext.Consumer>
//         )}
//       </LiveDataContext.Consumer>
//     );
//   }
// }

// //To Delete from backend and update list
// // //Need to configure this portion
// // deleteTrainee(id) {
// //   axios.delete("http://localhost:5000/trainee/" + id).then((response) => {
// //     console.log(response.data);
// //   });

// //   this.setState({
// //     exercises: this.state.trainee.filter((el) => el._id !== id),
