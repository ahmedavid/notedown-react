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
app.get("/ready", (req, res) => {
  res.send("Ready")
})

const PORT = 3000

app.listen(PORT, () =>
  console.log("REST API ready at: http://localhost:", PORT)
)
