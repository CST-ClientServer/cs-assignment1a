import React from "react";
import { Button } from "../button";

interface UserOptionsListProps {
    options: string[];
    selectedOption: number | null;
    answer: string | undefined;
    handleOptionClick: (optionIndex: number) => void;
}

const UserOptionsList: React.FC<UserOptionsListProps> = ({
    options,
    selectedOption,
    answer,
    handleOptionClick,
}) => {
    return (
        <div className="grid grid-cols-2 gap-4 pt-3 mx-auto dark:text-black">
            {options.map((option, index) => (
                <div key={index} className="w-full">
                    <Button
                        variant={
                            selectedOption === index
                                ? answer
                                      ?.split(",")
                                      .map((a) => a.trim())
                                      .includes(option)
                                    ? "selected"
                                    : "quiz"
                                : "outline"
                        }
                        className="w-full md:w-48 md:h-16 h-12 text-center whitespace-normal"
                        onClick={() => handleOptionClick(index)}
                    >
                        {option}
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default UserOptionsList;
