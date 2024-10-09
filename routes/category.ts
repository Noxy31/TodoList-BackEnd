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

router.post('/', async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Le nom de la catégorie est requis' });
  }

  try {
    const sql = 'INSERT INTO category (labelCategory) VALUES (?)';
    await query(sql, [name]);
    res.status(201).json({ message: 'Category successfully created' });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de la catégorie' });
  }
});

export default router;