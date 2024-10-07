import express from "express";
import cors from "cors";
import userRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import authMiddleware from "./middlewares/authenticate";

const server = express();
server.use(cookieParser());
server.use(express.json());
server.use("/users", userRoutes);
server.use(authMiddleware);



server.listen(3000, () => console.log("Serveur prêt à démarrer"));
