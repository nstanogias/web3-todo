import TodoForm from "@/components/TodoForm";

const CreateTodo = () => {
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Create Todo
        </h3>
      </section>

      <div className="wrapper my-8">
        <TodoForm type="Create" />
      </div>
    </>
  );
};

export default CreateTodo;
