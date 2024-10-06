import { getToDoById, updateToDo, deleteToDoById } from "@/lib/todos";
import { NextResponse } from "next/server";

interface UpdateToDoBody {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  completed?: boolean;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const todo = getToDoById(id);

    if (!todo) {
      return NextResponse.json({ message: "ToDo not found" }, { status: 404 });
    }

    return NextResponse.json(todo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching the ToDo" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const todo = getToDoById(id);

    if (!todo) {
      return NextResponse.json({ message: "ToDo not found" }, { status: 404 });
    }

    const body: UpdateToDoBody = await request.json();
    const updatedToDo = updateToDo(id, body);

    return NextResponse.json(updatedToDo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request data" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const todo = getToDoById(id);
    if (!todo) {
      return NextResponse.json({ message: "ToDo not found" }, { status: 404 });
    }

    const deleted = deleteToDoById(id);
    if (!deleted) {
      return NextResponse.json(
        { message: "Failed to delete ToDo" },
        { status: 500 }
      );
    }

    // Return a success response
    return NextResponse.json(
      { message: "ToDo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting ToDo" },
      { status: 500 }
    );
  }
}
