import React from "react";
import Tilt from "react-parallax-tilt";
import brain from "./brain.png";
import "./Logo.css"

const Logo = () => {
  return (
    <div className="ma4 mt0">
      <Tilt className="Tilt br2 shadow-2">
        <div
          style={{
            height: "160px",
            paddingTop: "20px",
          }}
        >
          <div>
            <img alt="logo" src={brain} style={{ paddingTop: "10px" }} />
          </div>
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
