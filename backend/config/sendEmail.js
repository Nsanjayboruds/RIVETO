import nodemailer from "nodemailer";
import dotenv from "dotenv";

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
    console.log("SMTP ERROR =>", err);
  } else {
    console.log("SMTP SERVER READY");
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

    console.log("Email sent:", info.response);
  } catch (_error) {
    console.error("Error sending email");
    throw new Error("Email could not be sent");
  }
};