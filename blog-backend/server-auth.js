const express = require("express"); 
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); 
app.use("/article", express.static("article")); 

mongoose.connect("mongodb://127.0.0.1:27017/blog")
  .then(() => console.log("Підключено до MongoDB"))
  .catch((error) => console.error("Помилка підключення до MongoDB:", error));

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: "" },
});

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, default: "" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
const Article = mongoose.model("Article", ArticleSchema);

const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.baseUrl.includes("articles")) {
      cb(null, "article/");
    } else {
      cb(null, "uploads/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Реєстрація користувача
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Усі поля обов'язкові" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Користувач вже існує" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ message: "Реєстрація успішна!", token });
  } catch (error) {
    console.error("Помилка реєстрації:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});


// Вхід користувача
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Невірний логін або пароль" });
    }

    const token = generateToken(user);
    res.json({ message: "Вхід успішний!", token });
  } catch (error) {
    console.error("Помилка входу:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// Оновлення профілю
app.put("/api/update-profile", upload.single("profileImage"), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Немає доступу" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "Користувача не знайдено" });

    console.log("Оновлення профілю", req.body);

    if (req.body.username) user.username = req.body.username;
    if (req.body.password && !(await bcrypt.compare(req.body.password, user.password))) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    if (req.file) user.profileImage = req.file.filename;

    await user.save();
    res.json({ message: "Профіль оновлено", user });
  } catch (error) {
    console.error("Помилка оновлення профілю:", error);
    res.status(500).json({ error: "Помилка сервера при оновленні профілю" });
  }
});

// Публікація статті
app.post("/api/articles", upload.single("image"), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Немає доступу" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { title, content, category } = req.body;
    const image = req.file ? req.file.filename : "";

    const newArticle = new Article({ title, content, category, image, author: decoded.id });
    await newArticle.save();
    res.json({ message: "Стаття опублікована!", article: newArticle });
  } catch (error) {
    console.error("Помилка створення статті:", error);
    res.status(500).json({ error: "Помилка сервера при створенні статті" });
  }
});
// Отримання профілю користувача
app.get("/api/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Немає доступу" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ error: "Користувач не знайдений" });

    res.json(user);
  } catch (error) {
    console.error("Помилка отримання профілю:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Сервер запущено на порту ${PORT}`));
