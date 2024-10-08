import Home from "@/components/Home";
import { getAllTodos } from "@/lib/actions/todo.actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const TodosPage = async ({ searchParams }: Props) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const page = Number(searchParams?.page) || 1;
  const todos = await getAllTodos(page);

  return (
    <section className="items-center justify-items-center flex flex-col">
      <Home
        todos={todos.data}
        totalPages={
          Math.ceil(todos.total / todos.limit) === 0
            ? 1
            : Math.ceil(todos.total / todos.limit)
        }
        page={page}
      />
    </section>
  );
};

export default TodosPage;
