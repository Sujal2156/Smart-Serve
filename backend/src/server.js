import dotenv from "dotenv"
import path from "path"

dotenv.config({
    path: path.resolve(process.cwd(), ".env")
})

import { app } from "./app.js";
import connectDB from "./db/config.js";

const port = process.env.PORT || 8080

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`\nServer is running in ${process.env.NODE_ENV} mode on port http://localhost:${port}`)
        })
    })
    .catch((err) => {
        console.log("\nDatabase connection error ", err)
    })
