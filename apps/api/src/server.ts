import "dotenv/config"
import express from "express"
import router from "./routes/index.js"
import cors from "cors"

const app = express()

const PORT = process.env.PORT as string || 3000

app.use(cors())
app.use(express.json())

// Listen routes
app.use(router)

app.listen(PORT, () => {
    console.log(`Sever listening on port ${PORT}`)
})
