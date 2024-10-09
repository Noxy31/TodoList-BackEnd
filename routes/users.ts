import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authMiddleware from '../middlewares/authenticate';
import isAdminMiddleware from '../middlewares/isAdmin';
import bcrypt from 'bcrypt';
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

router.get('/', async (req: Request, res: Response) => {
  try {
    const sql = 'SELECT idUser, CONCAT(userName, " ", userSurname) AS fullName FROM users';
    const users = await query(sql);
    res.status(200).json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des utilisateurs' });
  }
});

router.get('/info', authMiddleware, async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Utilisateur non authentifié' });
  }

  const userId = req.user.id;
  const sql = 'SELECT idUser, userName, userSurname, userMail, isAdmin FROM users WHERE idUser = ?';
  const [user] = await query(sql, [userId]);

  if (user) {
    user.isAdmin = !!user.isAdmin;
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
});

router.post('/assign-user', isAdminMiddleware, async (req: Request, res: Response) => {
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

router.post('/create-user', isAdminMiddleware, async (req: Request, res: Response) => {
  const { userName, userSurname, userMail, hashedPass, isAdmin, isAccEnabled } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(hashedPass, 10);

    const sql = 'INSERT INTO users (userName, userSurname, userMail, hashedPass, isAdmin, isAccEnabled) VALUES (?, ?, ?, ?, ?, ?)';
    await query(sql, [userName, userSurname, userMail, hashedPassword, isAdmin, isAccEnabled]);

    res.status(201).json({ message: 'Utilisateur créé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'utilisateur' });
  }
});

export default router;