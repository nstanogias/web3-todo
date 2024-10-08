"use client";

import MintButton from "./MintButton";
import TodoTable from "./TodoTable";
import TokenInfo from "./TokenInfo";
import { Todo } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  todos: Todo[];
  totalPages: number;
  page: number;
};

const Home = ({ todos, totalPages, page }: Props) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      router.refresh();
    }
  }, [status]);

  if (status !== "authenticated") {
    return null;
  }
  // console.log(todos);
  const completedTodosCounter = todos.filter((todo) => todo.completed).length;
  return (
    <div className="w-full wrapper">
      <TokenInfo />
      <MintButton completedTodosCounter={completedTodosCounter} />
      <TodoTable todos={todos} totalPages={totalPages} page={page} />
    </div>
  );
};

export default Home;
