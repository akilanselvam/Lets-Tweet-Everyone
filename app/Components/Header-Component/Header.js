import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import LoginComponent from "../Login-Component/Login-Component";
import LoggedInComponent from "../LoggedIn-Component/LoggedIn-Component";
import StateContext from "../../Context/StateContext-Provider";
function Header(props) {
  const appState = useContext(StateContext);
  return (
    <>
      <header className="header-bar bg-primary mb-3">
        <div className="container d-flex flex-column flex-md-row align-items-center p-3">
          <h4 className="my-0 mr-md-auto font-weight-normal">
            <Link to="/" className="text-white">
              {" "}
              Let's Tweet Everyone{" "}
            </Link>
          </h4>
          {appState.loginIsReal ? <LoggedInComponent /> : <LoginComponent />}
        </div>
      </header>
    </>
  );
}

export default Header;
