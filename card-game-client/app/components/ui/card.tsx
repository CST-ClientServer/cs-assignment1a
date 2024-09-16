import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className, onClick }: CardProps) {
  const cursorStyle = onClick ? "cursor-pointer" : "";

  return (
    <div
      onClick={onClick}
      className={`bg-white text-black dark:bg-gray-800 dark:text-white p-4 rounded-lg shadow-md border
                  ${cursorStyle} transition-transform duration-300 ease-in-out
                  ${className} flex flex-wrap`}
    >
      {children}
    </div>
  );
}
