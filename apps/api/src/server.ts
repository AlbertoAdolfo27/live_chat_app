import express from "express"
import router from "./routes/index.js"
import cors from "cors"

const app = express()
const port = 3000


app.use(cors())
app.use(express.json())

// Listen routes
app.use(router)

app.listen(port, () => {
    console.log(`Sever listening on port ${port}`)
})
