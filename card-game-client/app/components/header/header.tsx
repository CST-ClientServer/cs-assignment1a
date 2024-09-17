import React from "react";
// import ThemeToggle from "../theme-toggle";
import { Button } from "../ui/button";
import { ChevronRightIcon } from "@radix-ui/react-icons";

export default function Header() {
  return (
    <header className="row-start-3 pt-8 flex flex-col items-center">
      <div className="w-full flex justify-between items-center">
        <p className="ml-4 text-sm">Hello, firstname</p>
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
          {/* Render manage for admins only */}
          <Button
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
          </Button>
          <Button
            variant="ghost"
            asChild
            size="sm"
            className="pointer-events-auto group"
          >
            <a
              className="flex items-center hover:underline hover:underline-offset-4 relative"
              href="" // Change this logout
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
