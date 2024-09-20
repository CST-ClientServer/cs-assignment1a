import React from "react";
// import ThemeToggle from "../theme-toggle";
import { Button } from "../ui/button";
import { ChevronRightIcon } from "@radix-ui/react-icons";

import {initialGamer} from "@/app/atom/atom";
import {useAtom} from "jotai";


export default function Header() {
  const [gamer] = useAtom(initialGamer)

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("gamer");
  }

  return (
    <header className="row-start-3 pt-8 flex flex-col items-center">
      <div className="w-full flex justify-between items-center">
        <p className="ml-4 text-sm">Hello, {gamer.lastName + " " + gamer.firstName}</p>
        <div className="flex md:gap-6 justify-end">
          {/* <ThemeToggle /> */}
          <Button
            variant="ghost"
            asChild
            size="sm"
            className="pointer-events-auto group"
          >
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4 group-hover:flex"
              href="/dashboard"
              rel="noopener noreferrer"
            >
              Home
            </a>
          </Button>
          {/*This should be changed with role information in token */}
          {(gamer.role == "ADMIN") && (<Button
            variant="ghost"
            asChild
            size="sm"
            className="pointer-events-auto group"
          >
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4 group-hover:flex"
              href="/manage"
              rel="noopener noreferrer"
            >
              Manage
            </a>
          </Button>)}
          <Button
            variant="ghost"
            asChild
            size="sm"
            className="pointer-events-auto group"
            onClick={logoutHandler}
          >
            <a
              className="flex items-center hover:underline hover:underline-offset-4 relative"
              href="/login" // Change this logout
              rel="noopener noreferrer"
            >
              Logout
              <ChevronRightIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
