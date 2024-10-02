export type Todo = {
  id?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string; //"low" | "medium" | "high";
  completed?: boolean;
};

export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

export type Optional<T> = T | undefined | null;
