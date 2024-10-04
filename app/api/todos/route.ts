import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

interface ToDo {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

interface GetToDosResponse {
  data: ToDo[];
  page: number;
  limit: number;
  total: number;
}

interface CreateToDoBody {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
}

let todos: Map<string, ToDo> = new Map();

// let todos = new Map<number, ToDo>([
//   [
//     1,
//     {
//       id: "1",
//       title: "Todo 1",
//       completed: false,
//       description: "Description 1",
//       dueDate: new Date(),
//       priority: "low",
//     },
//   ],
// ]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const start = (page - 1) * limit;
  const end = start + limit;

  const todosArray = Array.from(todos.values());
  const paginatedToDos = todosArray.slice(start, end);

  const response: GetToDosResponse = {
    data: paginatedToDos,
    page,
    limit,
    total: todos.size,
  };

  return NextResponse.json(response, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body: CreateToDoBody = await request.json();
    const { title, description, dueDate, priority } = body;

    const newToDo: ToDo = {
      id: uuidv4(),
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : new Date(),
      priority: priority ? (priority as "low" | "medium" | "high") : "medium",
      completed: false,
    };

    todos.set(newToDo.id, newToDo);

    return NextResponse.json(newToDo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request data" },
      { status: 400 }
    );
  }
}
