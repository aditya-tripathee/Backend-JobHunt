import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js"



dotenv.config();

const app = express();
const PORT = process.env.PORT;





const corsOptions = {
    origin:"http://localhost:5173",
    credentials:true
}

// middlewares 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use("/api/user",userRoute);
app.use("/api/company",companyRoute);
app.use("/api/job",jobRoute);
app.use("/api/application",applicationRoute);




// server 
app.listen(PORT,()=>{
      console.log(`Server is listening on PORT ${PORT}`)
      connectDB();
})