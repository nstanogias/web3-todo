"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const { status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.push("/todos");
    return null;
  }

  return (
    <h1 className="text-xl font-semibold items-center justify-items-center flex flex-col mt-[100px]">
      Connect
    </h1>
  );
};

export default HomePage;
