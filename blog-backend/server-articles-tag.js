const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect("mongodb://127.0.0.1:27017/blog")
  .then(() => console.log("Підключено до MongoDB (Tag Server)"))
  .catch((error) => console.error("Помилка підключення до MongoDB:", error));
// Оголошуємо модель користувача
const User = mongoose.model("User", new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: "" },
  }));

// Схема статей
const Article = mongoose.model("Article", new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, default: "" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
}));

// Отримати статті за тегом з пагінацією
app.get("/api/articles/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const categoryList = ["Nature", "Photography", "Relaxation", "Vacation", "Travel", "Adventure"];
      
      let query = Article.find({ category }).sort({ createdAt: -1 }).populate("author", "username profileImage");
  
      // Видаляємо обмеження, якщо категорія зі списку
      if (!categoryList.includes(category)) {
        const { page = 1, limit = 10 } = req.query;
        query = query.skip((page - 1) * limit).limit(parseInt(limit));
      }
  
      const articles = await query;
      res.json(articles);
    } catch (error) {
      console.error("Помилка отримання статей за категорією:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  });
  


const PORT = 5003;
app.listen(PORT, () => console.log(`Tag Server запущено на порту ${PORT}`));
