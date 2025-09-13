import { createTokenSelector } from "../utils/crypto";
import { transporter } from "../utils/emailTransporter";

const sendForgotEmail = async (userId: string, userEmail: string) => {
    const { url } = await createTokenSelector(userId, 900, "forgot/reset");
    await transporter.sendMail({
        to: userEmail,
        from: `NHS Pay Log <no-reply@${process.env.DOMAIN}>`,
        subject: "Password reset link",
        text: `Copy and past the link into your browser to reset your password

${url}`,
        html: `<p>Here is your password reset link, it will expire in 15 minutes. If you did not request this, please ignore this email.</p><p><a href="${url}">Reset password</a></p>`,
    });
};

export default sendForgotEmail;
