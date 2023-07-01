import express from "express"
import cors from "cors"
import userRouter from "./routes/user"
import categoryRouter from "./routes/category"
import noteRouter from "./routes/note"

const app = express()

const corsOptions = {
  origin: ["localhost:3001"],
}
app.use(cors())

app.use(express.json())

app.use("/api/category", categoryRouter)
app.use("/api/user", userRouter)
app.use("/api/note", noteRouter)

app.listen(3000, () =>
  console.log("REST API server ready at: http://localhost:3000")
)
