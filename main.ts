import express from "express";
import cors from "cors";
import userRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import authMiddleware from "./middlewares/authenticate";
import taskRouter from "./routes/task";

const server = express();
server.use(cookieParser());
server.use(express.json());
server.use("/users", userRoutes);
server.use(authMiddleware);
server.use('/tasks',taskRouter);



server.listen(3000, () => console.log("Serveur prêt à démarrer"));
