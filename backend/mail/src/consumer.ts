import amqp from 'amqplib'
import nodemailer from 'nodemailer'
import dotenv from "dotenv"

dotenv.config();


export const startSendOTP = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.RABBIT_MQ_HOST || "localhost",
            port: 5672,
            username: process.env.RABBIT_MQ_USERNAME || "guest",
            password: process.env.RABBIT_MQ_PASSWORD || "guest"
        });

        const channel = await connection.createChannel()

        const queueName = "send-otp"

        await channel.assertQueue(queueName, { durable: true })

        console.log("Mail service sonsumer started listening to otp emails");

        channel.consume(queueName, async (msg) => {
            if (!msg) return;

            try {
                const { to, subject, body } = JSON.parse(msg.content.toString())

                const traspoter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    auth: {
                        user: process.env.USER,
                        pass: process.env.PASSWORD
                    },



                })

                await traspoter.sendMail({
                    from: "CHATT-APP",
                    to,
                    subject,
                    text: body
                })

                console.log(`OTP mail send to ${to}`);

                channel.ack(msg)

            } catch (error) {
                console.log("Failder to  send otp");
            }
        })

    } catch (error) {
        console.log("Failder to start rabbitmq consumer");

    }
}
