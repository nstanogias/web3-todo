/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { authOptions } from "../auth";
import { supabase } from "../supabase";
import { Todo } from "@/types";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";

const serverUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/todos`;

export const getAllTodos = async (page: number = 1, limit: number = 10) => {
  // const url = `${serverUrl}?page=${page}&limit=${limit}`;

  // try {
  //   const res = await fetch(url, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     cache: "no-store", // always fetch fresh data
  //   });

  //   if (!res.ok) {
  //     throw new Error("Failed to fetch todos");
  //   }

  //   const data = await res.json();
  //   return data;
  // } catch (error) {
  //   console.error("Error fetching todos:", error);
  //   throw new Error("Something went wrong while fetching todos");
  // }
  const session = await getServerSession(authOptions);

  if (!session || !session.address) {
    return {
      data: [],
      page,
      limit,
      total: 0,
    };
  }

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("wallet_address", session.address);

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: data,
    page,
    limit,
    total: data.length,
  };
};

export const getTodoById = async (id: string) => {
  // const url = `${serverUrl}/${id}`;

  // try {
  //   const res = await fetch(url, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });

  //   if (!res.ok) {
  //     throw new Error("Failed to fetch the todo");
  //   }

  //   const data = await res.json();
  //   return data;
  // } catch (error) {
  //   console.error("Error fetching todo:", error);
  //   throw new Error("Something went wrong while fetching the todo");
  // }
  const session = await getServerSession(authOptions);

  if (!session || !session.address) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .eq("wallet_address", session.address)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("ToDo not found");
  }

  return data;
};

export const createTodo = async ({ todo }: { todo: Todo }) => {
  // const body = JSON.stringify({
  //   ...todo,
  // });

  // try {
  //   const res = await fetch(serverUrl, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body,
  //   });

  //   if (!res.ok) {
  //     throw new Error("Failed to create the todo");
  //   }
  //   revalidatePath("/");
  //   const data = await res.json();
  //   return data;
  // } catch (error) {
  //   console.error("Error creating todo:", error);
  //   throw new Error("Something went wrong while creating the todo");
  // }
  const session = await getServerSession(authOptions);

  if (!session || !session.address) {
    throw new Error("Unauthorized");
  }

  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("wallet_address", session.address)
    .single(); // Expect a single result

  // If user doesn't exist, insert the new user
  if (!existingUser) {
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({ wallet_address: session.address })
      .single(); // Expect a single result for insert

    if (insertError) {
      throw new Error(insertError.message);
    }
  }
  const { title, description, dueDate, priority } = todo;
  const { data, error } = await supabase
    .from("todos")
    .insert([
      {
        wallet_address: session.address,
        title,
        description,
        dueDate: dueDate,
        priority,
      },
    ])
    .select() // Request the inserted row(s) to be returned
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to create the todo");
  }
  revalidatePath("/");
  return data[0];
};

export const incrementBurntNFTs = async (walletAddress: string) => {
  // Retrieve the current count
  const { data, error: selectError } = await supabase
    .from("users")
    .select("burntnfts")
    .eq("wallet_address", walletAddress)
    .single();

  if (selectError) {
    console.error("Error fetching current burntNFTs count:", selectError);
    return null; // Handle the error as needed
  }

  if (data) {
    const newCount = data.burntnfts + 1;

    // Update the count
    const { error: updateError } = await supabase
      .from("users")
      .update({ burntnfts: newCount })
      .eq("wallet_address", walletAddress);

    if (updateError) {
      console.error("Error incrementing burntNFTs count:", updateError);
      return null; // Handle the error as needed
    }

    return newCount; // Return the updated count
  } else {
    console.error("Wallet address not found.");
    return null;
  }
};

export const getBurntNFTsCount = async (
  walletAddress: string
): Promise<number | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("burntnfts")
    .eq("wallet_address", walletAddress)
    .single(); // Ensures only one record is returned

  if (error) {
    console.error("Error fetching burntNFTs count:", error);
    return null; // or handle the error based on your application's needs
  }

  return data ? data.burntnfts : null;
};
export const updateTodo = async ({ todo, id }: { todo: Todo; id: string }) => {
  // const url = `${serverUrl}/${id}`;
  // const body = JSON.stringify(todo);
  // try {
  //   const res = await fetch(url, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body,
  //   });
  //   if (!res.ok) {
  //     throw new Error("Failed to update the todo");
  //   }
  //   revalidatePath("/");
  //   const data = await res.json();
  //   return data;
  // } catch (error) {
  //   console.error("Error updating todo:", error);
  //   throw new Error("Something went wrong while updating the todo");
  // }
  const session = await getServerSession(authOptions);

  if (!session || !session.address) {
    throw new Error("Unauthorized");
  }

  const { title, description, dueDate, priority, completed } = todo;

  const { data, error } = await supabase
    .from("todos")
    .update({ title, description, dueDate: dueDate, priority, completed })
    .eq("id", id)
    .eq("wallet_address", session.address)
    .select() // Request the updated row(s) to be returned
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to update the todo");
  }

  revalidatePath("/");

  return data[0];
};

export const deleteTodo = async (id: string) => {
  // const url = `${serverUrl}/${id}`;

  // try {
  //   const res = await fetch(url, {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });

  //   if (!res.ok) {
  //     throw new Error("Failed to delete the todo");
  //   }
  //   revalidatePath("/");
  // } catch (error) {
  //   console.error("Error deleting todo:", error);
  //   throw new Error("Something went wrong while deleting the todo");
  // }
  const session = await getServerSession(authOptions);

  if (!session || !session.address) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .eq("wallet_address", session.address);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");

  return data ? "Deleted successfully" : "ToDo not found or unauthorized";
};
