import React from "react"; 
import { Link } from "react-router-dom";
import "../styles.css";

const Header = () => {
  return (
    <header className="header">
      <h1 className="logo">Andrew Sharko</h1>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Login</Link> 
      </nav>
    </header>
  );
};

export default Header;
