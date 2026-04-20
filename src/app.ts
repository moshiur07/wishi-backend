import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import routes from "./app/routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import { envVars } from "./config/env";

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(
    cors({
        origin: [envVars.CORS_ORIGIN],
        credentials: true,
    })
);

// Standard Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Auth Middleware (Better Auth)
app.all("/api/auth/{*any}", toNodeHandler(auth));

// Application Routes
app.use("/api", routes);

// Health Check
app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Wishi Backend is running smoothly!",
        timestamp: new Date().toISOString(),
    });
});

// Root route
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Wishi Backend API");
});

// Global Error Handler
app.use(globalErrorHandler);

// Not Found Handler
app.use(notFound);

export default app;
