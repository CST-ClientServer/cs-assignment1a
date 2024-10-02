import React from "react";
import { Button } from "../button";
import { ChevronDownIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import Switch from "react-switch";

interface HeaderProps {
    category: string;
    createCard?: boolean;
    admin?: boolean;
    editing: boolean;
    setEditedCategory: React.Dispatch<React.SetStateAction<string>>;
    categoryOptions: string[];
    handleOptionBlur: () => void;
    editedTitle: string;
    setEditedTitle: React.Dispatch<React.SetStateAction<string>>;
    title?: string;
    currentItemSubCategory?: string;
    handleChange: (checked: boolean) => void;
    checked: boolean;
    onClose?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    category,
    createCard,
    admin,
    editing,
    setEditedCategory,
    categoryOptions,
    handleOptionBlur,
    editedTitle,
    setEditedTitle,
    title,
    currentItemSubCategory,
    handleChange,
    checked,
    onClose,
}) => {
    return (
        <div className="flex justify-between items-center mb-4 w-full">
            <div className="text-gray-600">
                <div>
                    Category:{" "}
                    {createCard || (admin && editing) ? (
                        <Button
                            variant="outline"
                            dropdown
                            dropdownValues={categoryOptions.map(
                                (categoryOption) => ({
                                    label: categoryOption,
                                    onClick: () =>
                                        setEditedCategory(categoryOption),
                                }),
                            )}
                            placeholder={category}
                            className="w-36 border-thin"
                        >
                            <div className="flex items-center justify-between w-full">
                                <span>{category}</span>
                                <ChevronDownIcon className="h-4 w-4" />
                            </div>
                        </Button>
                    ) : (
                        category
                    )}
                </div>
                <div>
                    Subcategory:{" "}
                    {createCard || (admin && editing) ? (
                        <input
                            type="text"
                            placeholder="Subcategory"
                            value={editedTitle}
                            onBlur={handleOptionBlur}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="border rounded p-2 w-36 text-center"
                            autoFocus
                        />
                    ) : admin ? (
                        `${title}`
                    ) : (
                        `${currentItemSubCategory}`
                    )}
                </div>
            </div>
            <div className="flex flex-row gap-3">
                {!admin && (
                    <div className="flex flex-row gap-3 pt-3">
                        <p>Auto-play</p>
                        <Switch
                            onChange={handleChange}
                            checked={checked}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            width={40}
                            height={20}
                        />
                    </div>
                )}
                <Button variant="link" onClick={onClose}>
                    <CrossCircledIcon className="h-5 w-5 text-black dark:text-white" />
                </Button>
            </div>
        </div>
    );
};

export default Header;
