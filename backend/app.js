import express from "express";
import cors from "cors";
import passport from "passport";
import mainRouter from "./routes/index.js";
import "./config/passport.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173, *", // The origin of the frontend app
    credentials: true, // Allow cookies to be sent
  })
);

app.use(passport.initialize());

// Routes
app.use("/api/v1", mainRouter);

// Error handling middleware
app.use(errorMiddleware);

export default app;
