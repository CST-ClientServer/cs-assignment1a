import React, { useState, useEffect } from "react";
import Image from "next/image";
import Card from "./card";
import { cn } from "@/app/lib/utils";
import { Button } from "./button";
import { ChevronDownIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import Switch from "react-switch";

interface GameCardProps {
  title?: string;
  category?: string;
  question?: string;
  options?: string[];
  image?: React.ReactNode;
  className?: string;
  onClose?: () => void;
  categoryItems?: {
    id: number;
    title: string;
    question: string;
    options: string[];
  }[];
  admin?: boolean;
  createCard?: boolean;
}

const categoryOptions = [
  "Movies",
  "Politics",
  "Products",
  "Music",
  "History",
  "Science",
];

export default function GameCard({
  title,
  className,
  category,
  question,
  options,
  onClose,
  categoryItems,
  admin,
  createCard,
}: GameCardProps) {
  const timeLimit = 5;
  const [checked, setChecked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [editing, setEditing] = useState(createCard && admin);
  const [editingOption, setEditingOption] = useState<number | null>(null);
  const [editedOptions, setEditedOptions] = useState(
    options || ["", "", "", ""]
  );
  const [editedTitle, setEditedTitle] = useState(title || "");
  const [editedQuestion, setEditedQuestion] = useState(question || "");
  const [editedCategory, setEditedCategory] = useState(category || "");
  const [imageUrl, setImageUrl] = useState("");

  const handleChange = (checked: boolean) => {
    setChecked(checked);
    if (!checked) {
      setTimeLeft(timeLimit);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (checked && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (checked && timeLeft === 0) {
      handleNextClick();
    }
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, checked]);

  const handleOptionClick = (optionIndex: number) => {
    if (admin) {
      setEditingOption(optionIndex);
    } else {
      setSelectedOption(optionIndex);
    }
  };

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newOptions = [...editedOptions];
    newOptions[index] = e.target.value;
    setEditedOptions(newOptions);
  };

  const handleOptionBlur = () => {
    setEditingOption(null);
  };

  const handleNextClick = () => {
    if (currentItemIndex < (categoryItems?.length ?? 0) - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setSelectedOption(null);
      setTimeLeft(timeLimit);
    } else {
      onClose?.();
    }
  };

  const handleSave = () => {
    // add save logic here
    console.log("Saving new card:", {
      title: editedTitle,
      category: editedCategory,
      question: editedQuestion,
      options: editedOptions,
      imageUrl,
    });
    onClose?.();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentItem = categoryItems?.[currentItemIndex];

  return (
    <Card className="w-full lg:w-3/4 h-auto flex-wrap justify-center">
      <div className="flex justify-between items-center mb-4 w-full">
        <div className="text-gray-600">
          Category:{" "}
          {createCard || (admin && editing) ? (
            <Button
              variant="outline"
              dropdown
              dropdownValues={categoryOptions.map((category) => ({
                label: category,
                onClick: () => setEditedCategory(category),
              }))}
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

      {currentItem || admin ? (
        <div className={cn("flex", "flex-col", "items-center", className)}>
          <h2 className="text-lg font-bold mb-4 text-center">
            {editing ? (
              <div>
                <input
                  type="text"
                  placeholder="Subcategory"
                  value={editedTitle}
                  onBlur={handleOptionBlur}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="border rounded p-2 w-full md:w-36 text-center"
                  autoFocus
                />
                <input
                  type="text"
                  placeholder="Question"
                  value={editedQuestion}
                  onBlur={handleOptionBlur}
                  onChange={(e) => setEditedQuestion(e.target.value)}
                  className="border rounded p-2 w-full md:w-64 text-center"
                  autoFocus
                />
              </div>
            ) : admin ? (
              ` ${title}: ${question}`
            ) : (
              `${currentItem?.title}: ${currentItem?.question}`
            )}
          </h2>
          <Image
            src={
              imageUrl ||
              "https://nextjs.org/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fv1723581090%2Ffront%2Fnext-conf-2024%2Ftakeover.png&w=3840&q=75"
            }
            width={200}
            height={200}
            alt={""}
            className={cn(["rounded-lg", "md:w-2/5", "mb-6"])}
          />
          {admin && (
            <div>
              <input
                type="file"
                accept="image/*, video/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                id="imageUploadInput"
                size={1}
              />
              <Button
                onClick={() =>
                  document.getElementById("imageUploadInput")?.click()
                }
              >
                Upload Media
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-3 mx-auto dark:text-black">
            {admin
              ? editedOptions.map((option, index) => (
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
                        variant={editing ? "quiz" : "disabled"}
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
                ))
              : currentItem?.options.map((option, index) => (
                  <div key={index}>
                    <Button
                      variant={selectedOption === index ? "selected" : "quiz"}
                      className="md:w-48 md:h-16"
                      onClick={() => handleOptionClick(index)}
                    >
                      {option}
                    </Button>
                  </div>
                ))}
          </div>

          {checked && !admin && (
            <div className="w-full pt-6 flex flex-col items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className={cn(["pb-4", checked ? "pt-4" : "pt-8"])}>
            {admin && (
              <Button
                variant="outline"
                className="bg-gray-800 hover:bg-gray-700 text-gray-100 hover:text-gray-100 border hover:border-gray-700"
                onClick={() => setEditing(true)}
                disabled={editing}
              >
                Edit
              </Button>
            )}
            <Button
              variant="outline"
              className="bg-gray-800 hover:bg-gray-700 text-gray-100 hover:text-gray-100 border hover:border-gray-700"
              disabled={admin ? false : selectedOption === null}
              onClick={admin ? handleSave : handleNextClick}
            >
              {admin
                ? "Save"
                : currentItemIndex < (categoryItems?.length ?? 0) - 1
                ? "Next"
                : "Finish"}
            </Button>
          </div>
        </div>
      ) : (
        <p className="py-10"> Error loading data</p>
      )}
    </Card>
  );
}
