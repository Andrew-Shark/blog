import React, { useState } from "react";

const AddPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tag, setTag] = useState("Nature");
  const [isFeatured, setIsFeatured] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = { title, content, imageUrl, tag, isFeatured };

    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(newPost),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Стаття успішно додана!");
        setTitle("");
        setContent("");
        setImageUrl("");
        setTag("Nature");
        setIsFeatured(false);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error("Помилка запиту:", error);
      setMessage("Сервер не відповідає.");
    }
  };

  return (
    <div>
      <h2>Додати нову статтю</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Заголовок" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Текст статті" value={content} onChange={(e) => setContent(e.target.value)} required />
        <input type="text" placeholder="Посилання на зображення" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />

        <label>Виберіть категорію:</label>
        <select value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="Nature">Nature</option>
          <option value="Photography">Photography</option>
          <option value="Relaxation">Relaxation</option>
          <option value="Vacation">Vacation</option>
          <option value="Travel">Travel</option>
          <option value="Adventure">Adventure</option>
        </select>

        <label>
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
          Зробити Featured Post
        </label>

        <button type="submit">Додати статтю</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default AddPost;
