import React from "react";
// import ThemeToggle from "../theme-toggle";
import { Button } from "../ui/button";
import { ChevronRightIcon } from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <footer className="flex flex-row gap-6 items-center justify-center">
      {/* <ThemeToggle /> */}
      <Button
        variant="ghost"
        asChild
        size="sm"
        className="pointer-events-auto group"
      >
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 relative"
          href="/login"
          rel="noopener noreferrer"
        >
          Login
          <ChevronRightIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>
      </Button>
    </footer>
  );
}
