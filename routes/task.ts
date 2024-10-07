import { Router, Request, Response } from "express";
import { Task } from "../models/Task";
import { query} from '../db';

const taskRouter = Router();

const monTableau: Task[] = [
  
];


taskRouter.get("/", (req: Request, res: Response) => res.send(monTableau));

taskRouter.get("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const task = monTableau.find((t) => t.idTask === id);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send("Task not found");
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

taskRouter.delete("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const taskIndex = monTableau.findIndex((t) => t.idTask === id);
  if (taskIndex !== -1) {
    const deletedTask = monTableau.splice(taskIndex, 1);
    res.send(deletedTask);
  } else {
    res.status(404).send("Task not found");
  }
});

taskRouter.post("/", (req: Request, res: Response) => {
  const { labelTask, creationTask, updateTask, idList, idUser, dueDate } = req.body;
  const newId = monTableau.length > 0 ? monTableau[monTableau.length - 1].idTask + 1 : 1;
  const newTask: Task = { idTask: newId,creationTask, updateTask, idList, idUser, labelTask, completionStateTask: false, completionTimeTask: dueDate ? new Date(dueDate) : undefined };
  monTableau.push(newTask);
  res.status(201).send(newTask);
});

export default taskRouter;