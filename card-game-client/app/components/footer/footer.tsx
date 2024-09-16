import React from "react";
import ThemeToggle from "../theme-toggle";
import { Button } from "../ui/button";
import { ChevronRightIcon } from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      <ThemeToggle />
      <Button
        variant="ghost"
        asChild
        size="sm"
        className="pointer-events-auto group"
      >
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 group-hover:flex"
          href="/"
          rel="noopener noreferrer"
        >
          Home
        </a>
      </Button>
      <Button
        variant="ghost"
        asChild
        size="sm"
        className="pointer-events-auto group"
      >
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 relative"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Login
          <ChevronRightIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>
      </Button>
    </footer>
  );
}
