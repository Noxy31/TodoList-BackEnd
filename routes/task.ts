import { Router, Request, Response } from "express";
import { Task } from "../models/Task";
import { query } from '../db';

const taskRouter = Router();

taskRouter.get("/", async (req: Request, res: Response) => {
  try {
    const tasks = await query('SELECT * FROM task');
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

taskRouter.get("/list/:idList", async (req: Request, res: Response) => {
  const idList = parseInt(req.params.idList, 10);

  try {
    const tasks = await query('SELECT * FROM task WHERE idList = ?', [idList]);
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});


taskRouter.put("/:idTask", async (req: Request, res: Response) => {
  const idTask = parseInt(req.params.idTask, 10);
  const { done } = req.body;
  const idUser = (req as any).user?.id;

  if (!idUser) {
    return res.status(401).send("User not authentified");
  }

  try {
    const completionTime = done ? 'NOW()' : null;
    const idTaskCompleter = done ? idUser : null;

    const updateTaskResult = await query(
      'UPDATE task SET completionStateTask = ?, completionTimeTask = ' + completionTime + ', idTaskCompleter = ? WHERE idTask = ?',
      [done, idTaskCompleter, idTask]
    );

    if (updateTaskResult.affectedRows === 0) {
      return res.status(404).send("task not found");
    }

    const insertUpdateTaskResult = await query(
      'INSERT INTO updateTask (idUser, idTask, updateTask) VALUES (?, ?, NOW())',
      [idUser, idTask]
    );

    if (insertUpdateTaskResult.affectedRows === 0) {
      console.error('error insertion');
    }

    res.send("updating successful");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

taskRouter.put("/edit/:idTask", async (req: Request, res: Response) => {
  const idTask = parseInt(req.params.idTask, 10);
  const { labelTask, dueTask } = req.body; // Récupérer uniquement les champs nécessaires
  const idUser = (req as any).user?.id;

  if (!idUser) {
    return res.status(401).send("User not authenticated");
  }

  // Construire la requête de mise à jour en fonction des champs définis
  const updates: string[] = [];
  const params: any[] = [];

  // Ajout des champs à mettre à jour
  if (labelTask !== undefined) {
    updates.push("labelTask = ?");
    params.push(labelTask);
  }

  if (dueTask !== undefined) {
    updates.push("dueTask = ?");
    params.push(dueTask);
  }

  // Si aucun champ n'est défini, retourner une erreur
  if (updates.length === 0) {
    return res.status(400).send("No fields to update");
  }

  // Ajout de l'ID de la tâche à la fin des paramètres
  params.push(idTask);

  try {
    // Construire la requête dynamique
    const updateQuery = `UPDATE task SET ${updates.join(", ")} WHERE idTask = ?`;
    const updateTaskResult = await query(updateQuery, params);

    if (updateTaskResult.affectedRows === 0) {
      return res.status(404).send("Task not found");
    }

    const insertUpdateTaskResult = await query(
      'INSERT INTO updateTask (idUser, idTask, updateTask) VALUES (?, ?, NOW())',
      [idUser, idTask]
    );

    if (insertUpdateTaskResult.affectedRows === 0) {
      console.error('Error inserting into updateTask');
    }

    res.send("Task updated successfully");
  } catch (error) {
    console.error('Error during task update:', error);
    res.status(500).send('Internal Server Error: ');
  }
});

taskRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  try {
    await query('DELETE FROM task WHERE idTask = ?', [id]);
    res.send({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    res.status(500).send(error);
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
    res.status(500).send(error);
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
    res.status(500).send(error);
  }
});

export default taskRouter;