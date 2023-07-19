import express from "express"
import cors from "cors"
import authRouter from "./routes/auth"
import categoryRouter from "./routes/category"
import noteRouter from "./routes/note"
import userRouter from "./routes/user"
import { authMiddleware } from "./middleware/auth"

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/category", authMiddleware, categoryRouter)
app.use("/api/user", authMiddleware, userRouter)
app.use("/api/note", authMiddleware, noteRouter)
app.use("/api/auth", authRouter)
app.get("/ready", (req, res) => {
  res.send("Ready")
})

const PORT = 3000

app.listen(PORT, () =>
  console.log("REST API ready at: http://localhost:", PORT)
)
