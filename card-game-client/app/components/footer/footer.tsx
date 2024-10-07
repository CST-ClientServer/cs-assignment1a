"use client";

import React, { useLayoutEffect, useState } from "react";
// import ThemeToggle from "../theme-toggle";
import { Button } from "../ui/button";
import { ChevronRightIcon } from "@radix-ui/react-icons";

export default function Footer() {
    const [token, setToken] = useState<string | null>(null);

    useLayoutEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("token"));
        }
    }, []);

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
                    href={!token ? "/login" : "/dashboard"}
                    rel="noopener noreferrer"
                >
                    Login
                    <ChevronRightIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
            </Button>
        </footer>
    );
}
