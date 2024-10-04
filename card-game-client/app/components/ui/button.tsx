"use client";

import React, { useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/app/lib/utils";

import { ChevronDownIcon } from "@radix-ui/react-icons";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                none: "text-primary",
                disabled: "bg-gray-200 text-gray-400",
                dropdown:
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                quiz: "bg-red-200 hover:bg-red-300",
                quizSelected:
                    "bg-red-200 outline outline-2 outline-offset-2 outline-blue-500 text-primary-foreground",
                selected:
                    "bg-green-200 hover:bg-green-300 text-primary-foreground",
                general:
                    "bg-primary text-primary-foreground hover:bg-primary/90 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    dropdown?: boolean;
    dropdownValues?: { label: string; onClick: () => void }[];
    placeholder?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            dropdown = false,
            dropdownValues = [],
            placeholder = "All",
            ...props
        },
        ref,
    ) => {
        const [open, setOpen] = useState(false);
        const [selectedValue, setSelectedValue] = useState<string | null>(null);

        const Comp = asChild ? Slot : "button";

        const handleDropdownClick = (
            e: React.MouseEvent<HTMLButtonElement>,
        ) => {
            if (dropdown) {
                e.stopPropagation();
                setOpen((prev) => !prev);
            }
        };

        const handleItemClick = (label: string, onClick: () => void) => {
            setSelectedValue(label);
            onClick();
            setOpen(false);
        };

        return (
            <>
                <Comp
                    id="cardHover"
                    className={cn(buttonVariants({ variant, size, className }))}
                    ref={ref}
                    onClick={handleDropdownClick}
                    {...props}
                >
                    <div
                        className={cn(
                            "flex items-center w-full",
                            dropdown ? "justify-between" : "justify-center",
                        )}
                    >
                        {dropdown ? (
                            <span>{selectedValue || placeholder}</span>
                        ) : (
                            props.children
                        )}
                        {dropdown && <ChevronDownIcon className="h-4 w-4" />}
                    </div>
                </Comp>
                {dropdown && open && (
                    <div className="absolute mt-2 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                        <ul className="p-2 w-60">
                            {dropdownValues.map((item, index) => (
                                <li
                                    key={index}
                                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm dark:text-gray-800 dark:bg-gray-700"
                                    onClick={() =>
                                        handleItemClick(
                                            item.label,
                                            item.onClick,
                                        )
                                    }
                                >
                                    {item.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </>
        );
    },
);
Button.displayName = "Button";

export { Button, buttonVariants };
