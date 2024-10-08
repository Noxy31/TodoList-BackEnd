import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authMiddleware from '../middlewares/authenticate';
import { CustomRequest } from '../middlewares/authenticate';

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

export default router;