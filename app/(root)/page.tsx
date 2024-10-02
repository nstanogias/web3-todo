// import { authOptions } from "../api/auth/[...nextauth]/route";
import TodoTable from "@/components/TodoTable";
import { getAllTodos } from "@/lib/actions/todo.actions";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const Home = async ({ searchParams }: Props) => {
  // const session = await getServerSession(authOptions);
  const page = Number(searchParams?.page) || 1;
  const todos = await getAllTodos(page);

  return (
    <section className="items-center justify-items-center flex flex-col">
      <TodoTable
        todos={todos.data}
        totalPages={Math.ceil(todos.total / todos.limit)}
        page={page}
      />
    </section>
  );
};

export default Home;
