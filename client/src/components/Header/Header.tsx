import React from "react";
import "./Header.scss";
import logo from "../../resources/logo.png";
import add from "../../resources/icons/add.svg";
import Controls from "../Room/Controls";

import { Link, useNavigate } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

const Header = (props: any) => {
  const user = "użytkowniku";

  const logoClicked = () => {
    console.log("logo clicked");
  };

  const { setRoomId } = props;

  const navigate = useNavigate();

  const addRoomClicked = () => {
    const inviteCode = uuidv4();
    setRoomId(inviteCode);
    navigate(`/room/${inviteCode}`);
  };

  const settingsClicked = () => {
    console.log("settings clicked");
  };

  const signOutClicked = () => {
    console.log("signout clicked");
  };

  return (
    <nav className="container">
      <div className="first">
        <img src={logo} onClick={logoClicked}></img>
        <h2 className="h">
          Witaj, <b>{props.user ?? user}!</b>
        </h2>
      </div>
      <div className="second">
        <button className="addroom" onClick={addRoomClicked}>
          <span>Utwórz pokój</span>
          <img src={add}></img>
        </button>
        <button className="settings" onClick={settingsClicked}></button>
        <button className="out" onClick={signOutClicked}></button>
      </div>
    </nav>
  );
};

export default Header;
