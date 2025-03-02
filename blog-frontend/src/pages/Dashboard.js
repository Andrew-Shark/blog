import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");
  const [showArticleEditor, setShowArticleEditor] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Nature");
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5001/api/profile", { 
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const data = await response.json();
  
      if (data.error) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setUser(data); 
        setNewUsername(data.username);
      }
    } catch (error) {
      console.error("Помилка отримання профілю:", error);
      navigate("/login");
    }
  };
  
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      setMessage("Немає доступу");
      return;
    }
  
    const formData = new FormData();
    formData.append("username", newUsername);
    if (newPassword) formData.append("password", newPassword);
    if (profileImage) formData.append("profileImage", profileImage);
  
    try {
      const response = await fetch("http://localhost:5001/api/update-profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Помилка сервера");
      }
  
      setMessage("Профіль успішно оновлено!");
      setEditingProfile(false);
  
     
      fetchUserProfile();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Ви не авторизовані!");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5001/api/articles", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Помилка сервера");
      }
      setMessage("✅ Стаття успішно опублікована!");
      setTimeout(() => setShowArticleEditor(false), 1000);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div>
      <header className="dashboard-header">
        <div className="dashboard-profile" onClick={() => setMenuOpen(!menuOpen)}>
          <span>{user?.username}</span>
          {user?.profileImage ? (
            <img src={`http://localhost:5001/uploads/${user.profileImage}`} alt="Profile" />
          ) : (
            <img src="https://via.placeholder.com/40" alt="Default Profile" />
          )}
        </div>
        <div className={`profile-dropdown ${menuOpen ? "active" : ""}`}>
          <button onClick={() => setEditingProfile(true)}>Change profile</button>
          <button onClick={() => setShowArticleEditor(true)}>Article Editor</button>
          <button onClick={() => navigate("/")}>Home</button>
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}>Logout</button>
        </div>
      </header>

      {/* Форма редагування профілю */}
      {editingProfile && (
        <div className="profile-edit">
          <h3>Edit Profile</h3>
          <input
            type="text"
            placeholder="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password (optional)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} />
          <button onClick={handleUpdateProfile}>Save Changes</button>
          <button onClick={() => setEditingProfile(false)}>Cancel</button>
          {message && <p>{message}</p>}
        </div>
      )}

      {/* Форма для статей */}
      {showArticleEditor && (
        <div className="article-editor">
          <h2>Створити нову статтю</h2>
          <form onSubmit={handleArticleSubmit}>
            <input type="text" placeholder="Заголовок статті" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea placeholder="Текст статті" value={content} onChange={(e) => setContent(e.target.value)} required />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Nature">Nature</option>
              <option value="Photography">Photography</option>
              <option value="Relaxation">Relaxation</option>
              <option value="Vacation">Vacation</option>
              <option value="Travel">Travel</option>
              <option value="Adventure">Adventure</option>
            </select>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            <button type="submit">Опублікувати</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
