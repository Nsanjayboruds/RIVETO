import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    logger.warn("SMTP verification failed", { error: err.message });
  } else {
    logger.info("SMTP server ready");
  }
});

export const sendMail = async (email, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: `"RIVETO" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "RIVETO",
      html: htmlContent,
    });

    logger.info("Email sent", { response: info.response });
  } catch (_error) {
    logger.error("Error sending email", { error: _error.message });
    throw new Error("Email could not be sent");
  }
};