import React, { useState, useEffect } from "react";
import Image from "next/image";
import Card from "./card";
import {
    cn,
    defaultImageUrl,
    fileUploadUrl,
    videoFileExtensions,
    audioFileExtensions,
} from "@/app/lib/utils";
import { Button } from "./button";
import { ChevronDownIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import Switch from "react-switch";
import axios from "axios";
import { useAtom } from "jotai";
import { QuizCard } from "@/app/components/ui/admin-card";
import { initialQuizCardList } from "@/app/atom/atom";

interface GameCardProps {
    cardID?: number;
    title?: string;
    category?: string;
    question?: string;
    answer?: string;
    options?: string[];
    media?: React.ReactNode;
    className?: string;
    onClose?: () => void;
    subCategoryItems?: {
        id: number;
        subCategory: string;
        title: string;
        question: string;
        options: string[];
        answer?: string;
        media?: string;
    }[];
    admin?: boolean;
    createCard?: boolean;
    quizCardList?: QuizCard[];
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
    cardID,
    title,
    className,
    category,
    question,
    answer,
    options,
    onClose,
    subCategoryItems,
    admin,
    media,
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
        options || ["", "", "", ""],
    );
    const [editedTitle, setEditedTitle] = useState(title || "");
    const [editedQuestion, setEditedQuestion] = useState(question || "");
    const [editedCategory, setEditedCategory] = useState(category || "");
    const [editedAnswer, setEditedAnswer] = useState(answer || "");
    const [mediaUrl, setMediaUrl] = useState<string>(fileUploadUrl + media);
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    const [addedCardList, setAddedCardList] = useAtom(initialQuizCardList);

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
        index: number,
    ) => {
        const newOptions = [...editedOptions];
        newOptions[index] = e.target.value;
        setEditedOptions(newOptions);
    };

    const handleOptionBlur = () => {
        setEditingOption(null);
    };

    const handleNextClick = () => {
        if (currentItemIndex < (subCategoryItems?.length ?? 0) - 1) {
            setCurrentItemIndex(currentItemIndex + 1);
            setSelectedOption(null);
            setTimeLeft(timeLimit);
        } else {
            onClose?.();
        }
    };

    const handleSave = () => {
        const payload = {
            subCategory: editedTitle,
            category: editedCategory,
            question: editedQuestion,
            answer: editedAnswer,
            answerOption: editedOptions.toString(),
            file: uploadFile,
            media: mediaUrl,
        };

        axios({
            method: "post",
            url: "/card/insert",
            data: payload,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((response) => {
                setAddedCardList([...addedCardList, response.data]);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            })
            .finally(() => {
                onClose?.();
            });
    };

    const handleDelete = () =>{
        // console.log(`hit delete button: ${cardID}`)

        if (!cardID) {
            console.error("Card ID is missing.");
            return;
        }
        axios({
            method: "delete",
            url: `/card/delete`,
            data: { id: cardID },
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(() => {
                console.log(`Card with ID ${cardID} deleted successfully`);

            })
            .catch((error) => {
                console.error("There was an error!", error);
            })
            .finally(() => {
                onClose?.();
            });
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaUrl(reader.result as string);
                setUploadFile(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const currentItem = subCategoryItems?.[currentItemIndex];

    const getFileExtension = (url: string) => {
        return url.substring(url.lastIndexOf(".") + 1).toLowerCase();
    };

    return (
        <Card className="w-full lg:w-3/4 h-auto flex-wrap justify-center">
            <div className="flex justify-between items-center mb-4 w-full">
                <div className="text-gray-600">
                    <div>
                        Category:{" "}
                        {createCard || (admin && editing) ? (
                            <Button
                                variant="outline"
                                dropdown
                                dropdownValues={categoryOptions.map(
                                    (category) => ({
                                        label: category,
                                        onClick: () =>
                                            setEditedCategory(category),
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
                            `${currentItem?.subCategory}`
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

            {currentItem || admin ? (
                <div
                    className={cn(
                        "flex",
                        "flex-col",
                        "items-center",
                        className,
                    )}
                >
                    <h2 className="text-lg font-bold mb-4 text-center">
                        {editing ? (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Question"
                                    value={editedQuestion}
                                    onBlur={handleOptionBlur}
                                    onChange={(e) =>
                                        setEditedQuestion(e.target.value)
                                    }
                                    className="border rounded p-2 w-full md:w-64 text-center"
                                    autoFocus
                                />
                                <input
                                    type="text"
                                    placeholder="Answer"
                                    value={editedAnswer}
                                    onBlur={handleOptionBlur}
                                    onChange={(e) =>
                                        setEditedAnswer(e.target.value)
                                    }
                                    className="border rounded p-2 w-full md:w-36 text-center"
                                    autoFocus
                                />
                            </div>
                        ) : admin ? (
                            `${question} ${answer}`
                        ) : (
                            `${currentItem?.title}`
                        )}
                    </h2>
                    {videoFileExtensions.includes(
                        getFileExtension(currentItem?.media || ""),
                    ) ? (
                        <video
                            src={fileUploadUrl + currentItem?.media}
                            controls={true}
                            autoPlay={true}
                            width={200}
                            height={200}
                            className={cn(["rounded-lg", "md:w-2/5", "mb-6"])}
                            onError={() => setMediaUrl(defaultImageUrl)}
                        />
                    ) : audioFileExtensions.includes(
                          getFileExtension(currentItem?.media || ""),
                      ) ? (
                        <audio
                            src={fileUploadUrl + currentItem?.media}
                            autoPlay={true}
                            controls={true}
                            onError={() => setMediaUrl(defaultImageUrl)}
                        />
                    ) : (
                        <Image
                            src={fileUploadUrl + currentItem?.media}
                            width={200}
                            height={200}
                            alt={"Quiz card image"}
                            className={cn(["rounded-lg", "md:w-2/5", "mb-6"])}
                            onError={() => setMediaUrl(defaultImageUrl)}
                        />
                    )}
                    {admin && (
                        <div>
                            <input
                                type="file"
                                accept="image/*, video/*, audio/*"
                                onChange={handleImageUpload}
                                style={{ display: "none" }}
                                id="imageUploadInput"
                                size={1}
                            />
                            <Button
                                onClick={() =>
                                    document
                                        .getElementById("imageUploadInput")
                                        ?.click()
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
                                              placeholder={`Option ${
                                                  index + 1
                                              }`}
                                              value={option}
                                              onChange={(e) =>
                                                  handleOptionChange(e, index)
                                              }
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
                                                      : selectedOption === index
                                                      ? "outline"
                                                      : "quiz"
                                              }
                                              className={cn([
                                                  "md:w-48",
                                                  "md:h-16",
                                                  editing
                                                      ? "cursor-text"
                                                      : "cursor-auto",
                                              ])}
                                              onClick={() =>
                                                  handleOptionClick(index)
                                              }
                                          >
                                              {option}
                                          </Button>
                                      )}
                                  </div>
                              ))
                            : currentItem?.options.map((option, index) => (
                                  <div key={index}>
                                      <Button
                                          variant={
                                              selectedOption === index
                                                  ? answer === option
                                                      ? "selected"
                                                      : "quiz"
                                                  : "outline"
                                          }
                                          className="md:w-48 md:h-16"
                                          onClick={() =>
                                              handleOptionClick(index)
                                          }
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
                                    style={{
                                        width: `${
                                            (timeLeft / timeLimit) * 100
                                        }%`,
                                        transition: "width 0.5s ease-in-out",
                                    }}
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
                                : currentItemIndex <
                                  (subCategoryItems?.length ?? 0) - 1
                                ? "Next"
                                : "Finish"}
                        </Button>
                        {admin && editing && (
                            <Button
                                variant="outline"
                                className="bg-red-700 hover:bg-red-900 text-white hover:text-white border"
                                onClick={() => handleDelete()}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <p className="py-10"> Error loading data</p>
            )}
        </Card>
    );
}
