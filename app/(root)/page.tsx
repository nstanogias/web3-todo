// import { authOptions } from "../api/auth/[...nextauth]/route";
import Home from "@/components/Home";
import { getAllTodos } from "@/lib/actions/todo.actions";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const HomePage = async ({ searchParams }: Props) => {
  // const session = await getServerSession(authOptions);
  const page = Number(searchParams?.page) || 1;
  const todos = await getAllTodos(page);

  return (
    <section className="items-center justify-items-center flex flex-col">
      <Home
        todos={todos.data}
        totalPages={Math.ceil(todos.total / todos.limit)}
        page={page}
      />
    </section>
  );
};

export default HomePage;
