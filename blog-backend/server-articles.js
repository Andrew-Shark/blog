const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/blog")
  .then(() => console.log("Підключено до MongoDB (Articles Server)"))
  .catch((error) => console.error("Помилка підключення до MongoDB:", error));

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: "" }
});

const User = mongoose.model("User", UserSchema);

// Схема статей
const Article = mongoose.model("Article", new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, default: "" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  isFeatured: { type: Boolean, default: false }
}));

// middleware для доступу до статичних файлів (зображень)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Отримати 2 Featured статті
app.get("/api/articles/featured", async (req, res) => {
  try {
    const articles = await Article.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(2)
      .populate("author", "username profileImage");
    res.json(articles);
  } catch (error) {
    console.error("Помилка отримання Featured статей:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// Отримати останні 6 статей
app.get("/api/articles/recent", async (req, res) => {
  try {
    console.log("Отримання останніх статей...");
    
    const articles = await Article.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("author", "username profileImage");

    if (!articles || articles.length === 0) {
      console.log("Немає статей у базі!");
      return res.status(404).json({ error: "Немає статей у базі даних." });
    }

    console.log("Знайдено статей:", articles.length);
    res.json(articles);
  } catch (error) {
    console.error("Помилка при отриманні статей:", error);
    res.status(500).json({ error: "Помилка сервера. Деталі в консолі." });
  }
});



const PORT = 5002;
app.listen(PORT, () => console.log(`Articles Server запущено на порту ${PORT}`));
