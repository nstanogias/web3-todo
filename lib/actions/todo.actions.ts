"use server";

import { Todo } from "@/types";
import { revalidatePath } from "next/cache";

const serverUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/todos`;

export const getAllTodos = async (page: number = 1, limit: number = 10) => {
  const url = `${serverUrl}?page=${page}&limit=${limit}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // always fetch fresh data
    });

    if (!res.ok) {
      throw new Error("Failed to fetch todos");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw new Error("Something went wrong while fetching todos");
  }
};

export const getTodoById = async (id: string) => {
  const url = `${serverUrl}/${id}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch the todo");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching todo:", error);
    throw new Error("Something went wrong while fetching the todo");
  }
};

export const createTodo = async ({ todo }: { todo: Todo }) => {
  const body = JSON.stringify({
    ...todo,
  });

  try {
    const res = await fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!res.ok) {
      throw new Error("Failed to create the todo");
    }
    revalidatePath("/");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error creating todo:", error);
    throw new Error("Something went wrong while creating the todo");
  }
};

export const updateTodo = async ({ todo, id }: { todo: Todo; id: string }) => {
  const url = `${serverUrl}/${id}`;

  const body = JSON.stringify(todo);

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!res.ok) {
      throw new Error("Failed to update the todo");
    }
    revalidatePath("/");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw new Error("Something went wrong while updating the todo");
  }
};

export const deleteTodo = async (id: string) => {
  const url = `${serverUrl}/${id}`;

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete the todo");
    }
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw new Error("Something went wrong while deleting the todo");
  }
};
