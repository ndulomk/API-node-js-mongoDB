import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import taskRoutes from "./routes/task.route.js"
import userRoutes from "./routes/user.route.js"
dotenv.config()
const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))
connectDB()



app.use("/api/task", taskRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`)
})