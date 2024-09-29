import TodoTable from "@/components/TodoTable";
import { Button } from "@/components/ui/button";
import { getAllTodos } from "@/lib/actions/todo.actions";
import Link from "next/link";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const Home = async ({ searchParams }: Props) => {
  const page = Number(searchParams?.page) || 1;
  const todos = await getAllTodos(page);
  // console.log(todos);

  return (
    <section className="items-center justify-items-center flex flex-col">
      <Button asChild size="lg" className="button my-16">
        <Link href="/todos/create">Create New Todo</Link>
      </Button>
      <TodoTable
        todos={todos.data}
        totalPages={Math.ceil(todos.total / todos.limit)}
        page={page}
      />
    </section>
  );
};

export default Home;
