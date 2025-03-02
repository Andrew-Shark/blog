import React from "react";
import "../styles.css";
import { FaInstagram, FaTelegramPlane } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Мої Контакти</h1>
      <p>Не соромтеся зв’язатися з нами, використовуючи контактні дані нижче.</p>
      
      
      <div className="contact-info">
        <p><strong>Email:</strong> sc***rko*1@gmail.com</p>
        <p><strong>Phone:</strong> +380977**11**</p>
        <p><strong>Address:</strong> м.Кропивницький, в. Полтавська</p>
      </div>

      
      <div className="social-media">
  <h2>Follow us</h2>
  <a href="https://www.instagram.com/azedrgne/" target="_blank" rel="noopener noreferrer">
    <FaInstagram size={24} /> Instagram
  </a>
  <a href="https://t.me/Andrey1234567890123456" target="_blank" rel="noopener noreferrer">
    <FaTelegramPlane size={24} /> Telegram
  </a>
</div>


      
      <div className="map-container">
      <iframe
          title="Google Map Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d32.25697344796219!3d48.50444545858271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDMwJzE2LjAiTiAzMsKwMTUnMjAuMCJF!5e0!3m2!1sen!2sua!4v1632901912820!5m2!1sen!2sua"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
