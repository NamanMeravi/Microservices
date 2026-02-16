import mongoose from "mongoose";

export const DbConnect = async()=>{
    const url = process.env.MONGO_URL;

    if(!url){
        throw new Error("MONGO_URI is not defined in enviroment variable")

    }

    try {
        await mongoose.connect(url,{
            dbName:"Microservice"
        }).then(()=>{
            console.log("connected to Mongodb");
            
        })
    } catch (error) {
        console.error("failed to connect to database");
        process.exit(1);
        
    }
}

