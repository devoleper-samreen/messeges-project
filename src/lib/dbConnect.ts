import mongoose from "mongoose";

type ConnectObject = {
    isConnect?: number
}

const connection: ConnectObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnect) {
        console.log("Already connected to databse")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI as string)

        console.log(db);
        console.log("DB connected successfully")
        
    } catch (error) {
        console.log("Databse connection failed", error)
        process.exit(1)
        
    }
    
}

export default dbConnect