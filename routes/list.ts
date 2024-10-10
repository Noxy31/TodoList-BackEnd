import { Router, Request, Response } from 'express';
import { query } from '../db';
import authMiddleware from '../middlewares/authenticate';
import enAccMiddleware from '../middlewares/isAccEnabled';
import isAdminMiddleware from '../middlewares/isAdmin';

const listRouter = Router();

listRouter.post('/create', authMiddleware, enAccMiddleware, async (req: Request, res: Response) => {
  const { labelList, isPersonnal, idCategory } = req.body;


  const userId = (req as any).user.id;

  const listCreationTime = new Date();
  try {
    const sql = `
      INSERT INTO list (labelList, listCreationTime, isPersonnal, idUser, idCategory) 
      VALUES (?, ?, ?, ?, ?)`;
    const result = await query(sql, [labelList, listCreationTime, isPersonnal, userId, idCategory]);

    res.status(201).json({ message: 'Liste créée avec succès', listId: result.insertId });
  } catch (error) {
    console.error('Erreur lors de la création de la liste :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de la liste' });
  }
});

listRouter.get('/:userId', authMiddleware, enAccMiddleware, async (req: Request, res: Response) => {
    const userId = req.params.userId;
  
    try {
      const sql = `SELECT * FROM list WHERE idUser = ?`;
      const lists = await query(sql, [userId]);
  
      if (lists.length === 0) {
        return res.status(404).json({ message: 'Aucune liste trouvée pour cet utilisateur' });
      }
  
      res.status(200).json(lists);
    } catch (error) {
      console.error('Erreur lors de la récupération des listes :', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des listes' });
    }
  });
export default listRouter;