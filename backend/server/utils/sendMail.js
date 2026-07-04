const nodemailer = require("nodemailer");

const sendMail = async (contactData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password (NOT normal password)
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // ya tera personal email
    subject: "New Contact Enquiry",
    html: `
      <h3>New Contact Form Submission</h3>
      <p><b>Name:</b> ${contactData.fullName}</p>
      <p><b>Email:</b> ${contactData.email}</p>
      <p><b>Phone:</b> ${contactData.phone}</p>
      <p><b>Message:</b> ${contactData.message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;