import { ListTodo } from "lucide-react";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <ListTodo size={36} />
        </Link>
      </div>
    </header>
  );
};

export default Header;
