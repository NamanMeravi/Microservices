import amqp from 'amqplib'

let channel:amqp.Channel;

export const connectRabbitMQ = async()=>{
    try {
        const connection = await amqp.connect({
            protocol:"amqp",
            hostname:process.env.RABBIT_MQ_HOST,
            port:5672,
            username:process.env.RABBIT_MQ_USERNAME,
            password:process.env.RABBIT_MQ_PASSWORD
        });

        channel = await connection.createChannel()

        console.log("connected to rabbitmq");
        
    } catch (error) {
        console.log("Failed to connect to rabbitmq",error);
        
    }
}

export const publishToQueue = async(queueName:string, message:any)=>{
    if(!channel){
        console.log("RabbitMQ channel is not initilized");
        return;
        
    }

    await channel.assertQueue(queueName, {durable:true});

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        persistent:true
    })
}
