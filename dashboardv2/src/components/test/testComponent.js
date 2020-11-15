// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useContext } from "react";

// import TraineeDataContext from "../../context/TraineeDataContext";
import React from "react";

export default function TestComponent() {
  //   const user = useContext(TraineeDataContext);
  return <h1>Hello</h1>;
}

//   return (
//     <div>
//       {/* <p>{user.name}</p>

//       <p>{user.address}</p>

//       <p>{user.mobile}</p> */}
//     </div>
//   );

//   // const [users, setUsers] = useState({});
//   // const [hasError, setErrors] = useState(false);
//   // const [isValid, setValid] = useState(false);

//   // async function fetchData() {
//   //   // const res = await fetch("https://swapi.co/api/planets/4/");
//   //   // res
//   //   //   .json()
//   //   //   .then(res => setUsers(res))
//   //   .catch(err => setErrors(err));
//   axios
//     .get("http://localhost:5000/trainee/")
//     .then((response) => {
//       const allRepos = response.data;
//       console.log("FetchData", allRepos);
//       setValid(true);
//       //setUsers(allRepos);

//       // const JSONString = response.data;
//       // var object = JSON.parse(JSONString);
//       // var array = Object.keys(object).map(function (k) {
//       //   return object[k];
//       // });
//       var arr = Object.entries(allRepos);
//       console.log("ARR:", arr);
//       setUsers(arr);
//     })
//     //})
//     .catch(function (error) {
//       console.log(error);
//     });
// }

// useEffect(() => {
//   //fetchData();
// });

// if (isValid) {
//   return (
//     <div>
//       {console.log("Displaying ")}
//       <h1> Test Component Page</h1>
//       <h1> Using api calls with react hooks</h1>
//       <h1>Trainee Details</h1>
//       {/* <h1>{users}</h1> */}
//     </div>
//   );
// } else {
//   return (
//     <div>
//       <h1> Test Component Page</h1>
//       <h1> Using api calls with react hooks</h1>
//       <h1>Trainee Details</h1>
//       <button onClick={fetchData}> Trigger</button>
//     </div>
//   );
// }
