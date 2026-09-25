import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async () => {
    let uri = process.env.MONGO_URI;
    if (uri && !uri.includes("?") && !uri.endsWith(`/${DB_NAME}`)) {
        uri = `${uri}/${DB_NAME}`;
    }

    try {
        const connectionInstance = await mongoose.connect(uri)
        console.log(`\nMongoDB connected successfully!!\nDB HOST: ${connectionInstance.connection.host}`)
    } catch (err) {
        console.log(`⚠️ Primary MongoDB connection failed (${err.message}).`)
        console.log(`🔄 Attempting automatic fallback to local MongoDB (127.0.0.1:27017)...`)
        try {
            const localUri = `mongodb://127.0.0.1:27017/${DB_NAME}`
            const localConn = await mongoose.connect(localUri)
            console.log(`\n✅ Local MongoDB connected successfully!!\nDB HOST: ${localConn.connection.host}`)
        } catch (localErr) {
            console.log(`❌ All MongoDB connections failed: ${localErr.message}`)
            process.exit(1)
        }
    }
}

export default connectDB