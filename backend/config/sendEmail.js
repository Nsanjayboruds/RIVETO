import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailConfigured =
  Boolean(process.env.EMAIL_USER) && Boolean(process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

if (!emailConfigured) {
  console.error(
    "EMAIL_USER and EMAIL_PASS must be set for OTP email delivery.",
  );
} else {
  transporter.verify((err) => {
    if (err) {
      console.log("SMTP ERROR =>", err);
    } else {
      console.log("SMTP SERVER READY");
    }
  });
}

export const isEmailConfigured = () => emailConfigured;

export const sendMail = async (email, htmlContent) => {
  if (!emailConfigured) {
    throw new Error("Email service is not configured");
  }

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
