export interface Task {
  idTask: number;
  labelTask: string;
  dueTask?: Date;
  completionStateTask: boolean;
  creationTask: Date;
  updateTask: Date;
  completionTimeTask?: Date;
  idTaskCompleter?: number;
  idList: number;
  idUser: number;
}
