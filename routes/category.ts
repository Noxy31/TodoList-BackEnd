import { Router, Request, Response } from 'express';
import { query } from '../db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const sql = 'SELECT idCategory, labelCategory FROM category';
    const categories = await query(sql);
    res.status(200).json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des catégories' });
  }
});

export default router;