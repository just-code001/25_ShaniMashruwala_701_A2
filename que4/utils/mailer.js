import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 465,
  secure: String(process.env.MAIL_SECURE).toLowerCase() !== "false",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export async function sendEmployeeCredentials({ to, name, empid, rawPassword }) {
  const from = process.env.MAIL_FROM || process.env.MAIL_USER;

  const text = [
    `Hello ${name},`,
    ``,
    `Welcome to the company!`,
    `Your ERP login details:`,
    `Employee ID: ${empid}`,
    `Password   : ${rawPassword}`,
    ``,
    `Please log in and change your password immediately.`,
    ``,
    `Regards,`,
    `HR Team`
  ].join("\n");

  const html = `
    <p>Hello <b>${name}</b>,</p>
    <p>Welcome to the company! Your ERP login details are below:</p>
    <ul>
      <li><b>Employee ID:</b> ${empid}</li>
      <li><b>Password:</b> ${rawPassword}</li>
    </ul>
    <p>Please log in and change your password immediately.</p>
    <p>Regards,<br/>HR Team</p>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: "Your ERP Employee Credentials",
    text,
    html
  });
}
