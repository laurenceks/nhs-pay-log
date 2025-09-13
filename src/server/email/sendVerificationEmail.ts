import { createTokenSelector } from "../utils/crypto";
import { transporter } from "../utils/emailTransporter";

const sendVerificationEmail = async (userId: string, userEmail: string) => {
    const { url } = await createTokenSelector(userId);

    await transporter.sendMail({
        to: userEmail,
        from: `NHS Pay Log <no-reply@${process.env.DOMAIN}>`,
        subject: "Verify your email address",
        text: `Copy and past the link into your browser to get started

${url}`,
        html: `<p>Thank you for signing up to use NHS Pay Log. Please click the link below to verify your email address:</p><p><a href="${url}">Verify</a></p>`,
    });
};

export default sendVerificationEmail;
