import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from './routes/index.js'

const app = express();

//cors middleware
// for devlopment
// app.use(cors());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

//for production
// app.use(cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true //needed if using cookies
// }));

// Json body parser
app.use(express.json());

app.use(cookieParser());

// Api routes
app.use('/api', routes);

export default app;