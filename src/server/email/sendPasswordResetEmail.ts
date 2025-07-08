import { transporter } from "../utils/emailTransporter";

const sendPasswordResetEmail = async (userEmail: string) => {
    const url = `http${process.env.NODE_ENV === "development" ? "" : "s"}://${process.env.DOMAIN}/forgot`;
    await transporter.sendMail({
        to: userEmail,
        from: `"NHS Pay Log <no-reply@${process.env.DOMAIN}`,
        subject: "You password has been changed",
        text: `Your password has been changed. If you did not do this, change it immediately.

${url}`,
        html: `<p>Your password has been reset. If you did not do this, change it immediately.</p><p><a href="${url}">Reset password</a></p>`,
    });
};

export default sendPasswordResetEmail;
