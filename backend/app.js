import express from "express";
import cors from "cors";
import passport from "passport";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import mainRouter from "./routes/index.js";
import "./config/passport.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Headers
app.use(helmet());

// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Add cookie-parser middleware
app.use(cookieParser());

// Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);

// HTTP Request Logging (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(passport.initialize());

// Routes
app.use("/api/v1", mainRouter);

// Error handling middleware
app.use(errorMiddleware);

export default app;
