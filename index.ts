import express from "express"
import env from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import v1Routes from "./routes/v1/index"


env.config()


const PORT = process.env.PORT

const app = express()
app.use(cors({
    origin: "*"
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

mongoose
.connect(process.env.MONGODB_URI as string)
.then(() => app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Database running...`)
}))

app.use("/v1", v1Routes)
app.get('/', (_, res) => {
    res.send("Welcome aboard private...!!! 🫡")
})
