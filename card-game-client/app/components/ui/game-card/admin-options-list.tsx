import React from "react";
import { Button } from "../button";
import { cn } from "@/app/lib/utils";

interface AdminOptionsListProps {
    options: string[];
    editedAnswer: string;
    editingOption: number | null;
    editing: boolean;
    handleOptionChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) => void;
    handleOptionBlur: () => void;
    handleOptionClick: (optionIndex: number) => void;
}

const AdminOptionsList: React.FC<AdminOptionsListProps> = ({
    options,
    editedAnswer,
    editingOption,
    editing,
    handleOptionChange,
    handleOptionBlur,
    handleOptionClick,
}) => {
    return (
        <div className="grid grid-cols-2 gap-4 pt-3 mx-auto dark:text-black">
            {options.map((option, index) => (
                <div key={index}>
                    {editingOption === index && editing ? (
                        <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(e, index)}
                            onBlur={handleOptionBlur}
                            className="border rounded p-2 w-full md:w-48 md:h-16 text-center"
                            autoFocus
                        />
                    ) : (
                        <Button
                            variant={
                                editing
                                    ? "quiz"
                                    : editedAnswer === option
                                    ? "selected"
                                    : "quiz"
                            }
                            className={cn([
                                "md:w-48",
                                "md:h-16",
                                editing ? "cursor-text" : "cursor-auto",
                            ])}
                            onClick={() => handleOptionClick(index)}
                        >
                            {option}
                        </Button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AdminOptionsList;
