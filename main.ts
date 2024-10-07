import express from 'express';
import cors from 'cors';
import userRoutes from './routes/auth';
import cookieParser from 'cookie-parser';

const server = express();
server.use(cookieParser());
server.use(express.json());
server.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));



server.use('/api/users', userRoutes);

server.listen(3000, () => console.log('Serveur prêt à démarrer'));