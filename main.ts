import express from "express";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import authMiddleware from "./middlewares/authenticate";
import taskRouter from "./routes/task";
import listRouter from "./routes/list";
import usersRouter from "./routes/users";

const server = express();
server.use(cookieParser());
server.use(express.json());
server.use("/users", authRoutes);
server.use(authMiddleware);
server.use('/tasks',taskRouter);
server.use('/list', listRouter);
server.use('/users', usersRouter);



server.listen(3000, () => console.log("Serveur prêt à démarrer"));
