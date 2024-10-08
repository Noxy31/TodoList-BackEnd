import { Router, Request, Response } from "express";
import { Task } from "../models/Task";
import { query} from '../db';

const taskRouter = Router();

const monTableau: Task[] = [
  
];


taskRouter.get("/", (req: Request, res: Response) => res.send(monTableau));

taskRouter.get("/", async (req: Request, res: Response) => {
  try {
    const tasks = await query('SELECT * FROM task');
    res.send(tasks);
  } catch (error) {
    res.status(500).send("Erreur lors de la récupération des tâches.");
  }
});

taskRouter.put("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { labelTask, done, dueDate } = req.body;
  const taskIndex = monTableau.findIndex((t) => t.idTask === id);
  if (taskIndex !== -1) {
    monTableau[taskIndex] = {
      ...monTableau[taskIndex],
      labelTask: labelTask || monTableau[taskIndex].labelTask,
      completionStateTask: done !== undefined ? done : monTableau[taskIndex].completionStateTask,
      completionTimeTask: dueDate ? new Date(dueDate) : monTableau[taskIndex].completionTimeTask,
    };
    res.send(monTableau[taskIndex]);
  } else {
    res.status(404).send("Task not found");
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
  const { labelTask, creationTask, idList, idUser, dueTask } = req.body;
  
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

export default taskRouter;