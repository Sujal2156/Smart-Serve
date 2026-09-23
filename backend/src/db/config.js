import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI;
        if (uri && !uri.includes("?") && !uri.endsWith(`/${DB_NAME}`)) {
            uri = `${uri}/${DB_NAME}`;
        }
        const connectionInstance = await mongoose.connect(uri)
        console.log(`\nMongoDB connected successfully!!\nDB HOST: ${connectionInstance.connection.host}`)
    } catch (err) {
        console.log(`Error: ${err}`)
        process.exit(1)
    }
}

export default connectDB