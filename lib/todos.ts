// in memory todos
import { Todo } from "@/types";
import { v4 as uuidv4 } from "uuid";

const todos = new Map<string, Todo>();

export function getAllToDos(): Todo[] {
  return Array.from(todos.values());
}

export function getToDoById(id: string): Todo | undefined {
  return todos.get(id);
}

export function createToDo(
  title: string,
  description: string,
  dueDate: string,
  priority: string
): Todo {
  const newToDo: Todo = {
    id: uuidv4(),
    title,
    description,
    dueDate: dueDate,
    priority,
    completed: false,
  };

  todos.set(newToDo.id!, newToDo);
  return newToDo;
}

export function updateToDo(
  id: string,
  updates: Partial<
    Pick<Todo, "title" | "description" | "dueDate" | "priority" | "completed">
  >
): Todo | undefined {
  const todo = todos.get(id);
  if (!todo) return undefined;

  const updatedToDo: Todo = {
    ...todo,
    ...updates,
  };

  todos.set(id, updatedToDo);
  return updatedToDo;
}

export function deleteToDoById(id: string): boolean {
  return todos.delete(id);
}
