const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect("mongodb://127.0.0.1:27017/blog")
  .then(() => console.log("Підключено до MongoDB (Email Server)"))
  .catch((error) => console.error("Помилка підключення до MongoDB:", error));

//Модель підписників
const Subscriber = mongoose.model("Subscriber", new mongoose.Schema({
  email: { type: String, required: true, unique: true }
}));

//Модель статей
const Article = mongoose.model("Article", new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}));

//Підрахунок нових постів
const getNewPostsCount = async () => {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1); 

  const categories = ["Nature", "Photography", "Relaxation", "Vacation", "Travel", "Adventure"];
  const stats = {};

  for (const category of categories) {
    const count = await Article.countDocuments({ category, createdAt: { $gte: oneDayAgo } });
    stats[category] = count;
  }

  return stats;
};

// SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, //(Gmail)
    pass: process.env.EMAIL_PASS  //Пароль або "App Password"
  }
});

//Надсилання email
const sendDailyEmail = async () => {
  try {
    const subscribers = await Subscriber.find();
    if (subscribers.length === 0) {
      console.log("Немає підписників.");
      return;
    }

    const stats = await getNewPostsCount();
    let emailContent = "<h2>Нові статті у вашому блозі:</h2><ul>";

    for (const [category, count] of Object.entries(stats)) {
      emailContent += `<li><b>${category}:</b> ${count} нових постів</li>`;
    }
    emailContent += "</ul>";

    const emailList = subscribers.map(sub => sub.email);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailList,
      subject: "📢 Щоденне оновлення блогу",
      html: emailContent
    };

    await transporter.sendMail(mailOptions);
    console.log("Email-розсилка успішно відправлена!");
  } catch (error) {
    console.error("Помилка під час надсилання email:", error);
  }
};

//Автоматичний запуск розсилки (раз на день о 08:00)
cron.schedule("0 8 * * *", () => {
  console.log("Виконується щоденна email-розсилка...");
  sendDailyEmail();
});


const PORT = 5004;
app.listen(PORT, () => console.log(`Email Server запущено на порту ${PORT}`));

//sendDailyEmail(); // Запускає розсилку вручну
