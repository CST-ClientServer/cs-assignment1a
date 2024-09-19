import React from "react";
import SignupForm from "../components/ui/signup-form";

export default function Signup() {
  return (

        <div className="flex flex-col justify-center items-center dark:bg-zinc-900 min-h-screen p-48">
          <SignupForm/>
          <a href="/login"><p className="underline w-20">Log in</p></a>
        </div>

  );
}
