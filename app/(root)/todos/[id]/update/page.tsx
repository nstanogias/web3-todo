import TodoForm from "@/components/TodoForm";
import { getTodoById } from "@/lib/actions/todo.actions";

type Props = {
  params: {
    id: string;
  };
};

const UpdateTodo = async ({ params: { id } }: Props) => {
  const todo = await getTodoById(id);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Todo
        </h3>
      </section>

      <div className="wrapper my-8">
        <TodoForm type="Update" todo={todo} todoId={todo.id} />
      </div>
    </>
  );
};

export default UpdateTodo;
