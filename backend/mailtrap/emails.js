// import {
//     VERIFICATION_EMAIL_TEMPLATE,
//     WELCOME_EMAIL_TEMPLATE,
//     PASSWORD_RESET_REQUEST_TEMPLATE,
//     PASSWORD_RESET_SUCCESS_TEMPLATE,
// } from "./emailTemplate.js";
// import { sendEmail, sender } from "./mailtrap.js";

// export const sendVerificationEmail = async (email, verificationToken) => {
//     try {
//         const subject = "Verify your email";
//         const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);
        
//         await sendEmail(email, subject, htmlContent);
//         console.log("Verification email sent successfully");
//     } catch (error) {
//         console.error("Error sending verification email", error);
//         throw new Error(`Error sending verification email: ${error.message}`);
//     }
// }

// export const sendWelcomeEmail = async (email, name) => {
//     try {
//         const subject = "Welcome to our website!";
//         const htmlContent = WELCOME_EMAIL_TEMPLATE.replace("{name}", name).replace("{href}", "facebook.com");
        
//         await sendEmail(email, subject, htmlContent);
//         console.log("Welcome email sent successfully");
//     } catch (error) {
//         console.error("Error sending welcome email", error);
//         throw new Error(`Error sending welcome email: ${error.message}`);
//     }
// }

// export const sendPasswordResetEmail = async (email, resetURL) => {
//     try {
//         const subject = "Reset your password";
//         const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);
        
//         await sendEmail(email, subject, htmlContent);
//         console.log("Password reset email sent successfully");
//     } catch (error) {
//         console.error(`Error sending password reset email`, error);
//         throw new Error(`Error sending password reset email: ${error.message}`);
//     }
// };

// export const sendResetSuccessEmail = async (email) => {
//     try {
//         const subject = "Password Reset Successful";
//         const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE;

//         await sendEmail(email, subject, htmlContent);
//         console.log("Password reset success email sent successfully");
//     } catch (error) {
//         console.error(`Error sending password reset success email`, error);
//         throw new Error(`Error sending password reset success email: ${error.message}`);
//     }
// }


import {
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    ORDER_CONFIRMATION_TEMPLATE
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
};

export const sendOrderConfirmationEmail = async (email, name, orderId, orderItems, grandTotal, shippingAddress, shippingFee) => {
    try {
        const subject = "Your Order Confirmation";

        const formattedOrderItems = orderItems.map(
            item => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.productName}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.quantity}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₱${(item.quantity * item.price).toFixed(2)}</td>
            </tr>`
        ).join("");

        const htmlContent = ORDER_CONFIRMATION_TEMPLATE
            .replace("{name}", name)
            .replace("{orderId}", orderId)
            .replace("{orderItems}", formattedOrderItems)
            .replace("{grandTotal}", grandTotal.toFixed(2))
            .replace("{shippingFee}", shippingFee.toFixed(2))
            .replace("{shippingAddress}", shippingAddress);

        await sendEmail(email, subject, htmlContent);
        console.log("Order confirmation email sent successfully");
    } catch (error) {
        console.error("Error sending order confirmation email", error);
        throw new Error(`Error sending order confirmation email: ${error.message}`);
    }
};
