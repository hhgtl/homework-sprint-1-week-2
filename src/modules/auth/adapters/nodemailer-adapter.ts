import nodemailer from "nodemailer";

export const nodemailerAdapter = {
    async sendEmail({ email, confirmationCode }: { email: string, confirmationCode: string }) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "emailfordevdevovic@gmail.com",
                pass: "oytj avzc owso ievz", //
            },
        });

        const info = await transporter.sendMail({
            from: '"Petro" <emailfordevdevovic@gmail.com>',
            to: email,
            subject: "register",
            html: `<h1>Thank for your registration</h1>
                 <p>To finish registration please follow the link below:
                     <a href="https://somesite.com/confirm-email?code=${confirmationCode}">complete registration</a>
                 </p>`,
        });

        console.log("Message sent:", info.messageId);
    }
}