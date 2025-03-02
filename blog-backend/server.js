const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/blog")
  .then(() => console.log("Підключено до MongoDB"))
  .catch((error) => console.error("Помилка підключення до MongoDB:", error));

const Subscriber = mongoose.model("Subscriber", new mongoose.Schema({ email: String }));

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

app.post("/api/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email є обов'язковим" });
  if (!isValidEmail(email)) return res.status(400).json({ error: "Невірний формат email" });

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) return res.status(400).json({ error: "Цей email вже підписаний" });
    const subscriber = new Subscriber({ email });
    await subscriber.save();
    res.json({ message: "Підписка успішна!" });
  } catch (error) {
    console.error("Помилка сервера:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Сервер підписок запущено на порту ${PORT}`));
