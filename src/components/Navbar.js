import React from "react";
import { Link } from "react-router-dom";

const NavBar = props => {
  return (
<nav className="navbar secondary-banner" style={{ paddingTop: "5px" }}>
<div
  className="container"
  style={{ paddingLeft: "32px", paddingRight: "32px" }}
>
  <div className="navbar-brand">
    <a className="navbar-item mr-5" href="/">
      <p className="title dextract-navbar-text is-4">Dextract </p>
    </a>
    <Link to="/home" className="navbar-item">
          <p className = "dextract-navbar-text is-4"> Home</p>
      </Link>
    <Link to="/dashboard" className="navbar-item">
          <p className = "dextract-navbar-text is-4"> Dashboard</p>
      </Link>
  </div>
  <div id="navbarMenu" className="navbar-menu">
    <div className="navbar-end">
      <div className="navbar-item">
      {!props.isSignedIn
        ? (
          <button className = 'button dextract-btn' 
            onClick={() => props.setIsSignedInButtonPressed(true)}> Sign In </button>
        ) 
        : (
          // <a className="button dextract-btn" href="/logout">
          //   Logout
          // </a>
          <Link to="/logout" className="button dextract-btn">
            Logout
          </Link>
        )} 
      </div>
    </div>
  </div>
</div>
</nav>
  );
};

export default NavBar;

