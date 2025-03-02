import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CategoryPage from "./pages/CategoryPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles.css";

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isDashboardPage = location.pathname === "/dashboard";
  const isAboutPage = location.pathname === "/about"; 
  const isContactPage = location.pathname === "/contact";

  return (
    <>
      
      {!isContactPage && !isLoginPage && !isDashboardPage && !isAboutPage && <Header />}


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      {!isDashboardPage && <Footer />} 
    </>
  );
};

export default App;
