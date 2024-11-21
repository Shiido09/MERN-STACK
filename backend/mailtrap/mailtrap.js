// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// // Load environment variables
// dotenv.config();

// // Retrieve your Mailtrap credentials from environment variables
// const mailtrapUser = process.env.MAILTRAP_USERNAME; // Ensure this is set
// const mailtrapPass = process.env.MAILTRAP_PASSWORD; // Ensure this is set

// // Ensure your sender email is a Mailtrap-provided email
// export const sender = '"HAB APPLIANCES" <hello@demomailtrap.com>'; // Use your Mailtrap sender email

// // Create a Nodemailer transport
// const transport = nodemailer.createTransport({
//     host: "live.smtp.mailtrap.io",
//     port: 587,
//     auth: {
//         user: mailtrapUser,
//         pass: mailtrapPass,
//     },
// });

// // Function to send an email
// export const sendEmail = async (to, subject, html) => {
//     const mailOptions = {
//         from: sender,
//         to,
//         subject,
//         html,
//     };

//     try {
//         const info = await transport.sendMail(mailOptions);
//         console.log('Email sent:', info);
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw new Error(`Error sending email: ${error.message}`);
//     }
// };

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Retrieve your Mailtrap credentials from environment variables
const mailtrapUser = process.env.MAILTRAP_USERNAME;
const mailtrapPass = process.env.MAILTRAP_PASSWORD;
const mailtrapHost = process.env.MAILTRAP_HOST;
const mailtrapPort = process.env.MAILTRAP_PORT;

// Ensure your sender email is a Mailtrap-provided email
export const sender = '"HAB APPLIANCES" <hello@demomailtrap.com>';

// Create a Nodemailer transport
const transport = nodemailer.createTransport({
    host: mailtrapHost,
    port: mailtrapPort,
    auth: {
        user: mailtrapUser,
        pass: mailtrapPass,
    },
});

// Function to send an email
export const sendEmail = async (to, subject, html) => {
    const mailOptions = {
        from: sender,
        to,
        subject,
        html,
    };

    try {
        const info = await transport.sendMail(mailOptions);
        console.log('Email sent:', info);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Error sending email: ${error.message}`);
    }
};