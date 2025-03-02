import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (endpoint) => {
    setMessage("");

    try {
      const response = await fetch(`http://localhost:5001/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const textResponse = await response.text();
      console.log("Отриманий текстовий респонс:", textResponse);

      // Спроба розпарсити JSON (на випадок HTML-помилки)
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (err) {
        throw new Error("Сервер повернув некоректний формат відповіді");
      }

      if (!response.ok) {
        throw new Error(data.error || "Помилка сервера");
      }

      localStorage.setItem("token", data.token);
      setMessage("Успішно!");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (error) {
      console.error("Помилка:", error.message);
      setMessage(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>User Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button onClick={() => handleAuth("login")}>Login</button>
        <button onClick={() => handleAuth("register")}>Register</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
