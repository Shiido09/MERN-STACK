// import { VERIFICATION_EMAIL_TEMPLATE,
//          WELCOME_EMAIL_TEMPLATE,
//          PASSWORD_RESET_REQUEST_TEMPLATE,
// 	     PASSWORD_RESET_SUCCESS_TEMPLATE
//          } from "./emailTemplate.js";
// import { mailtrapClient, sender } from "./mailtrap.js";

// export const sendVerificationEmail = async (email, verificationToken) => {
//     const recipient = [{ email }];

//     try {
//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             subject: "Verify your email",
//             html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
//             category: "Email Verification"
//         })

//         console.log("Verification email sent successfully", response);
//     } catch (error) {
//         console.error("Error sending verification email", error);
//         throw new Error(`Error sending verification email: ${error.message}`);
//     }
// }

// export const sendWelcomeEmail = async (email, name) => {
//     const recipient = [{ email }];
//     try {
//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             subject: "Welcome to our website!",
//             html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name).replace("{href}", "facebook.com"),
//             //Text: `Welcome to our website, ${name}!`,
//             category: "Welcome Email"
//         })

//         console.log("Welcome email sent successfully", response);
//     } catch (error) {
//         console.error("Error sending welcome email", error);
//         throw new Error(`Error sending welcome email: ${error.message}`);
//     }
// }

// export const sendPasswordResetEmail = async (email, resetURL) => {
// 	const recipient = [{ email }];

// 	try {
// 		const response = await mailtrapClient.send({
// 			from: sender,
// 			to: recipient,
// 			subject: "Reset your password",
// 			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
// 			category: "Password Reset",
// 		});
// 	} catch (error) {
// 		console.error(`Error sending password reset email`, error);

// 		throw new Error(`Error sending password reset email: ${error}`);
// 	}
// };

// export const sendResetSuccessEmail = async (email) => {
// 	const recipient = [{ email }];

// 	try {
// 		const response = await mailtrapClient.send({
// 			from: sender,
// 			to: recipient,
// 			subject: "Password Reset Successful",
// 			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
// 			category: "Password Reset",
// 		});

// 		console.log("Password reset email sent successfully", response);
// 	} catch (error) {
// 		console.error(`Error sending password reset success email`, error);

// 		throw new Error(`Error sending password reset success email: ${error}`);
// 	}
// };


import {
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplate.js";
import { sendEmail, sender } from "./mailtrap.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const subject = "Verify your email";
        const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);
        
        await sendEmail(email, subject, htmlContent);
        console.log("Verification email sent successfully");
    } catch (error) {
        console.error("Error sending verification email", error);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
}

export const sendWelcomeEmail = async (email, name) => {
    try {
        const subject = "Welcome to our website!";
        const htmlContent = WELCOME_EMAIL_TEMPLATE.replace("{name}", name).replace("{href}", "facebook.com");
        
        await sendEmail(email, subject, htmlContent);
        console.log("Welcome email sent successfully");
    } catch (error) {
        console.error("Error sending welcome email", error);
        throw new Error(`Error sending welcome email: ${error.message}`);
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const subject = "Reset your password";
        const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);
        
        await sendEmail(email, subject, htmlContent);
        console.log("Password reset email sent successfully");
    } catch (error) {
        console.error(`Error sending password reset email`, error);
        throw new Error(`Error sending password reset email: ${error.message}`);
    }
};

export const sendResetSuccessEmail = async (email) => {
    try {
        const subject = "Password Reset Successful";
        const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE;

        await sendEmail(email, subject, htmlContent);
        console.log("Password reset success email sent successfully");
    } catch (error) {
        console.error(`Error sending password reset success email`, error);
        throw new Error(`Error sending password reset success email: ${error.message}`);
    }
}



