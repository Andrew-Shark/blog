import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Перевірка email
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Кнопка Submit
  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setMessage("Введіть коректний email");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Ви підписались на оновлення!");
        setEmail(""); 
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error("Помилка запиту:", error);
      setMessage("Сервер не відповідає.");
    }
  };

  return (
    <footer>
      <div className="footer-content">
        <h2 className="footer-title">Stay in Touch</h2>
        <div className="footer-input">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
        {message && <p>{message}</p>}
      </div>

      <div className="footer-bar">
        <div className="footer-logo">Andrew</div>
        <nav className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
