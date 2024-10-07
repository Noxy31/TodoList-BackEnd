import express from 'express';
import cors from 'cors';
import userRoutes from './routes/auth'; // Assure-toi que le chemin est correct

const server = express();
server.use(cors());
server.use(express.json());

// Utilise le routeur pour les routes d'utilisateur
server.use('/api/users', userRoutes);

server.listen(3000, () => console.log('Serveur prêt à démarrer'));