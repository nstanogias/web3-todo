"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { deleteTodo } from "@/lib/actions/todo.actions";
import { formUrlQuery } from "@/lib/utils";
import { Todo } from "@/types";
import { format } from "date-fns";
import { Edit, Trash } from "lucide-react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  todos: Todo[];
  totalPages: number;
  page: number;
};

const TodoTable = ({ todos, totalPages, page }: Props) => {
  const router = useRouter();
  // const { signMessageAsync } = useSignMessage();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setToDeleteId(id);
    try {
      await deleteTodo(id);
      toast({
        description: "To-Do deleted successfully!",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete To-Do",
      });
    } finally {
      setToDeleteId(null);
    }
  };

  const onClick = (btnType: string) => {
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: pageValue.toString(),
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div>
      {/* <button
        onClick={() => {
          signMessageAsync({ message: "hello world" })
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
        }}
      >
        Sign message
      </button> */}
      <h1 className="text-2xl font-bold mb-6">To-Do List</h1>

      <Table className="w-full text-left">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos?.length > 0 ? (
            todos.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell>{todo.title}</TableCell>
                <TableCell>{todo.description}</TableCell>
                <TableCell>
                  {todo.dueDate ? format(new Date(todo.dueDate), "PPP") : "-"}
                </TableCell>
                <TableCell>{todo.priority}</TableCell>
                <TableCell>
                  {todo.completed ? (
                    <CheckCircle className="text-[#00FF00]" />
                  ) : (
                    <XCircle className="text-[#FF0000]" />
                  )}
                </TableCell>
                <TableCell className="flex items-center gap-x-4">
                  <Link
                    href={`/todos/${todo.id}/update`}
                    aria-disabled={todo.completed}
                    className={`${
                      todo.completed ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={todo.completed || toDeleteId === todo.id}
                    onClick={() => handleDelete(todo.id!)}
                  >
                    <Trash className="w-5 h-5 text-red-600" />
                    {toDeleteId === todo.id && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>No To-Dos available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={() => onClick("prev")}
          disabled={page <= 1}
          className="bg-gray-300 text-black hover:bg-gray-500 disabled:bg-gray-200"
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => onClick("next")}
          disabled={page >= totalPages}
          className="bg-gray-300 text-black hover:bg-gray-500 disabled:bg-gray-200"
        >
          Next
        </Button>
      </div>

      <Button asChild size="lg" className="button mt-16">
        <Link href="/todos/create">Create New Todo</Link>
      </Button>
    </div>
  );
};

export default TodoTable;
