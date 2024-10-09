import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authMiddleware from '../middlewares/authenticate';
import { CustomRequest } from '../middlewares/authenticate';
import { query } from '../db';

dotenv.config();

const router = Router();
router.use(cookieParser());


router.get('/getUserId', authMiddleware, (req: CustomRequest, res: Response) => {
  console.log("Utilisateur connecté : ", req.user);
  if (req.user) {
    res.json({ id: req.user.id });
  } else {
    res.status(401).json({ message: 'Utilisateur non authentifié' });
  }
});

router.get('/users', async (req: Request, res: Response) => {
  try {
    const sql = 'SELECT idUser, CONCAT(userName, " ", userSurname) AS fullName FROM users';
    const users = await query(sql);
    res.status(200).json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des utilisateurs' });
  }
});

router.post('/assign-user', async (req: Request, res: Response) => {
  const { idUser, idCategory } = req.body;
  
  try {
    const sql = 'INSERT INTO isaffected (idUser, idCategory) VALUES (?, ?)';
    await query(sql, [idUser, idCategory]);
    res.status(200).json({ message: 'Utilisateur assigné avec succès à la catégorie.' });
  } catch (error) {
    console.error('Erreur lors de l\'assignation de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur' });
  }
});

export default router;