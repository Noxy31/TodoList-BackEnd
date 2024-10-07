import { Router, Request, Response } from "express";

const router = Router();

interface Task {
  idTask: number;
  labelTask: string;
  done: boolean;
  dueDate?: Date;
}

const monTableau: Task[] = [
  
];


router.get("/api/tasks", (req: Request, res: Response) => res.send(monTableau));

router.get("/api/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const task = monTableau.find((t) => t.idTask === id);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send("Task not found");
  }
});

router.put("/api/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { labelTask, done, dueDate } = req.body;
  const taskIndex = monTableau.findIndex((t) => t.idTask === id);
  if (taskIndex !== -1) {
    monTableau[taskIndex] = {
      ...monTableau[taskIndex],
      labelTask: labelTask || monTableau[taskIndex].labelTask,
      done: done !== undefined ? done : monTableau[taskIndex].done,
      dueDate: dueDate ? new Date(dueDate) : monTableau[taskIndex].dueDate,
    };
    res.send(monTableau[taskIndex]);
  } else {
    res.status(404).send("Task not found");
  }
});

router.delete("/api/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const taskIndex = monTableau.findIndex((t) => t.idTask === id);
  if (taskIndex !== -1) {
    const deletedTask = monTableau.splice(taskIndex, 1);
    res.send(deletedTask);
  } else {
    res.status(404).send("Task not found");
  }
});

router.post("/api/tasks", (req: Request, res: Response) => {
  const { labelTask, done, dueDate } = req.body;
  const newId = monTableau.length > 0 ? monTableau[monTableau.length - 1].idTask + 1 : 1;
  const newTask: Task = { idTask: newId, labelTask, done, dueDate: dueDate ? new Date(dueDate) : undefined };
  monTableau.push(newTask);
  res.status(201).send(newTask);
});

export default router;