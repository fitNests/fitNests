//Takes in a prop and returns the corresponding dance gif

import React, { Component } from "react";

import RocketGif from "../../icons/rocket.gif";
import PushbackGif from "../../icons/pushback.gif";
import ShoulderShrugGif from "../../icons/shouldershrug.gif";
import ZigzagGif from "../../icons/zigzag.gif";
import HairGif from "../../icons/hair.gif";
import ScarecrowGif from "../../icons/scarecrow.gif";
import WindowwipeGif from "../../icons/windowwipe.gif";
import ElbowlockGif from "../../icons/elbowlock.gif";
// import DefaultPic from "../../icons/default.png";
import ConfusedGif from "../../icons/confused.gif";

export default class DanceGif extends Component {
  constructor(props) {
    super(props);
    this.renderGif = this.renderGif.bind(this);
  }

  renderGif() {
    switch (this.props.danceMove) {
      case "rocket":
        return <img src={RocketGif} alt="RocketGif" width={200} />;
      case "pushback":
        return <img src={PushbackGif} alt="PushbackGif" width={200} />;
      case "shouldershrug":
        return (
          <img src={ShoulderShrugGif} alt="ShouldershrugGif" width={200} />
        );
      case "hair":
        return <img src={HairGif} alt="HairGif" width={200} />;
      case "scarecrow":
        return <img src={ScarecrowGif} alt="ScarecrowGif" width={200} />;
      case "windowwipe":
        return <img src={WindowwipeGif} alt="windowwipeGif" width={200} />;
      case "elbowlock":
        return <img src={ElbowlockGif} alt="ElbowlockGif" width={200} />;
      case "zigzag":
        return <img src={ZigzagGif} alt="ZigzagGif" width={200} />;
      default:
        return <img src={ConfusedGif} alt="ConfusedGif" width={200} />;
    }
  }

  render() {
    return <div>{this.renderGif()}</div>;
  }
}
