import express, { Express, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import { errorHandlerMiddleware } from "./middleware/error.checker"

const app: Express = express();

app.listen(8080, () => {
  console.log("The server has started on port 8080");
});   

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(errorHandlerMiddleware); 

app.use("/users", userRoutes);
app.use("/auth", authRoutes); 
