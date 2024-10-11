import { Router, Request, Response } from 'express';
import isAdminMiddleware from '../middlewares/isAdmin';
import authMiddleware, { CustomRequest } from '../middlewares/authenticate';
import enAccMiddleware from '../middlewares/isAccEnabled';
import { Users } from '../models/Users';
import { query } from '../db';

const catRouter = Router();

catRouter.get('/', authMiddleware, enAccMiddleware, async (req: Request, res: Response) => {
  try {
    const sql = 'SELECT idCategory, labelCategory FROM category';
    const categories = await query(sql);
    res.status(200).json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des catégories' });
  }
});

catRouter.get('/users-categories', authMiddleware, enAccMiddleware, async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json({ message: 'Utilisateur non trouvé' });
    }

    const sql = `
      SELECT c.idCategory, c.labelCategory, l.idList, l.labelList 
      FROM category c
      LEFT JOIN list l ON c.idCategory = l.idCategory
      INNER JOIN isaffected ia ON c.idCategory = ia.idCategory
      WHERE ia.idUser = ?
    `;

    const categoriesWithLists = await query(sql, [userId]);

    const categories = categoriesWithLists.reduce((acc: any, row: any) => {
      const { idCategory, labelCategory, idList, labelList } = row;

      let category = acc.find((cat: any) => cat.idCategory === idCategory);
      if (!category) {
        category = { idCategory, labelCategory, lists: [] };
        acc.push(category);
      }

      if (idList) {
        category.lists.push({ idList, labelList });
      }

      return acc;
    }, []);

    res.status(200).json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des catégories de l\'utilisateur' });
  }
});

catRouter.get('/all-categories-lists', async (req: Request, res: Response) => {
  try {
    const sql = `
      SELECT c.idCategory, c.labelCategory, l.idList, l.labelList 
      FROM category c
      LEFT JOIN list l ON c.idCategory = l.idCategory
    `;

    const categoriesWithLists = await query(sql);

    const categories = categoriesWithLists.reduce((acc: any, row: any) => {
      const { idCategory, labelCategory, idList, labelList } = row;

      let category = acc.find((cat: any) => cat.idCategory === idCategory);
      if (!category) {
        category = { idCategory, labelCategory, lists: [] };
        acc.push(category);
      }

      if (idList) {
        category.lists.push({ idList, labelList });
      }

      return acc;
    }, []);

    res.status(200).json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories et listes :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des catégories et listes' });
  }
});

catRouter.post('/', isAdminMiddleware, authMiddleware, enAccMiddleware, async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Le nom de la catégorie est requis' });
  }

  try {
    const sql = 'INSERT INTO category (labelCategory) VALUES (?)';
    await query(sql, [name]);
    res.status(201).json({ message: 'Category successfully created' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la création de la catégorie' });
  }
});



export default catRouter;