import { Router, Request, Response } from "express";
import { Task } from "../models/Task";
import { query } from '../db';

const taskRouter = Router();

taskRouter.get("/", async (req: Request, res: Response) => {
  try {
    const tasks = await query('SELECT * FROM task');
    res.send(tasks);
  } catch (error) {
    res.status(500).send("Erreur lors de la récupération des tâches.");
  }
});

taskRouter.get("/list/:idList", async (req: Request, res: Response) => {
  const idList = parseInt(req.params.idList, 10);

  try {
    const tasks = await query('SELECT * FROM task WHERE idList = ?', [idList]);
    res.send(tasks);
  } catch (error) {
    res.status(500).send("Erreur lors de la récupération des tâches pour cette liste.");
  }
});


taskRouter.put("/:idTask", async (req: Request, res: Response) => {
  const idTask = parseInt(req.params.idTask, 10);
  const { done } = req.body;
  const idUser = (req as any).user?.id;

  if (!idUser) {
    return res.status(401).send("Utilisateur non authentifié");
  }

  try {
    const completionTime = done ? 'NOW()' : null;
    const updateTaskResult = await query(
      'UPDATE task SET completionStateTask = ?, completionTimeTask = ' + completionTime + ' WHERE idTask = ?',
      [done, idTask]
    );

    if (updateTaskResult.affectedRows === 0) {
      return res.status(404).send("Tâche non trouvée");
    }

    const insertUpdateTaskResult = await query(
      'INSERT INTO updateTask (idUser, idTask, updateTask) VALUES (?, ?, NOW())',
      [idUser, idTask]
    );

    if (insertUpdateTaskResult.affectedRows === 0) {
      console.error('Erreur lors de l\'insertion dans updateTask');
    }

    res.send("Tâche mise à jour avec succès");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la mise à jour de la tâche");
  }
});

taskRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  try {
    await query('DELETE FROM task WHERE idTask = ?', [id]);
    res.send({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    res.status(500).send("Erreur lors de la suppression de la tâche.");
  }
});

taskRouter.post("/", async (req: Request, res: Response) => {
  const { labelTask, idList, idUser, dueTask } = req.body;

  try {
    const result = await query(
      'INSERT INTO task (labelTask, creationTask, idList, idUser, dueTask, completionStateTask) VALUES (?, ?, ?, ?, ?, ?)',
      [labelTask, new Date(), idList, idUser, dueTask || null, false]
    );

    const newTaskId = result.insertId;
    const newTask = await query('SELECT * FROM task WHERE idTask = ?', [newTaskId]);

    res.status(201).send(newTask[0]);
  } catch (error) {
    res.status(500).send("Erreur lors de l'ajout de la tâche.");
  }
});

taskRouter.get("/details/:idList", async (req: Request, res: Response) => {
  const idList = parseInt(req.params.idList, 10);
  
  try {
    const tasks = await query(`
      SELECT t.*, 
             (SELECT CONCAT(u.userName, ' ', u.userSurname) FROM users u 
              JOIN updateTask ut ON u.idUser = ut.idUser 
              WHERE ut.idTask = t.idTask 
              ORDER BY ut.updateTask DESC 
              LIMIT 1) AS lastUpdatedBy,
             (SELECT ut.updateTask FROM updateTask ut 
              WHERE ut.idTask = t.idTask 
              ORDER BY ut.updateTask DESC 
              LIMIT 1) AS lastUpdateTime
      FROM task t 
      WHERE t.idList = ?
    `, [idList]);
    
    res.send(tasks);
  } catch (error) {
    res.status(500).send("Erreur lors de la récupération des tâches avec détails.");
  }
});

export default taskRouter;