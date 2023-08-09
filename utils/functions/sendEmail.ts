import sendgrid from "@sendgrid/mail";
import { env } from "~/env.mjs";

sendgrid.setApiKey(env.SENDGRID_API_KEY);

async function sendEmail({
    email,
    subject,
    body,
}: {
    email: string;
    subject: string;
    body: string;
}) {
    console.log("Trying to send email...");

    try {
        await sendgrid.send({
            to: email,
            from: env.SENDGRID_EMAIL,
            subject,
            html: body,
        });

        console.log("Email sent successfully");
    } catch (error) {
        return { error };
    }

    return { message: "Email sent successfully!" };
}

export default sendEmail;
