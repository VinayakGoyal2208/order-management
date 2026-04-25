import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: "a93d5d001@smtp-brevo.com", 
        pass: "xsmtpsib-a0352bbccddef4ee911f219979c2e6cf8ff4f144d71dc0d70155bedd24b46315-8k4CYqLMrrz2Mild", 
      },
    });

    await transporter.sendMail({
      from: "machinelearning2124@gmail.com", 
      to,
      subject,
      text,
    });

    console.log("✅ Email sent successfully");
  } catch (err) {
    console.log("❌ Email error:", err.message);
    throw err;
  }
};