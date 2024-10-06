import { createToDo, getAllToDos } from "@/lib/todos";
import { Todo } from "@/types";
import { NextResponse } from "next/server";

interface GetToDosResponse {
  data: Todo[];
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const start = (page - 1) * limit;
  const end = start + limit;

  const todos = getAllToDos();
  const paginatedToDos = todos.slice(start, end);

  const response: GetToDosResponse = {
    data: paginatedToDos,
    page,
    limit,
    total: todos.length,
  };

  return NextResponse.json(response, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body: CreateToDoBody = await request.json();
    const { title, description, dueDate, priority } = body;

    const newToDo = createToDo(title, description, dueDate, priority);

    return NextResponse.json(newToDo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request data" },
      { status: 400 }
    );
  }
}
