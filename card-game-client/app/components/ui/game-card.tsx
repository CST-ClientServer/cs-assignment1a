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
import { initialQuizCardList } from "@/app/atom/atom";
import { QuizCard } from "@/app/lib/types";
import { useCardsContext } from "@/app/context/CardsContent";

interface GameCardProps {
    id?: number;
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
    id,
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
    const { refetch } = useCardsContext();
    const timeLimit = 5;
    const [checked, setChecked] = useState(false);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [editing, setEditing] = useState(createCard && admin);
    const [isEditing, setIsEditing] = useState(false);
    const [editingOption, setEditingOption] = useState<number | null>(null);
    const [editedOptions, setEditedOptions] = useState(
        options || ["", "", "", ""],
    );
    const [editedTitle, setEditedTitle] = useState(title || "");
    const [editedQuestion, setEditedQuestion] = useState(question || "");
    const [editedCategory, setEditedCategory] = useState(category || "");
    const [editedAnswer, setEditedAnswer] = useState(answer || "");
    const [mediaUrl, setMediaUrl] = useState<string>(fileUploadUrl + media);
    const [uploadFile, setUploadFile] = useState<File | null>(
        typeof media === "string" && media ? new File([], media) : null,
    );

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

    const handleEdit = () => {
        const payload = {
            id: id,
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
            url: "/card/update?id=" + id,
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
                refetch();
                setEditing(false);
                setIsEditing(false);
                onClose?.();
            });
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
                refetch();
                onClose?.();
            });
    };

    const handleSaveOrEditing = () => {
        if (isEditing) {
            console.log("@@@ Edit triggered");
            handleEdit();
        } else {
            console.log("@@@ Save triggered");
            handleSave();
        }
    };

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
                        getFileExtension(
                            fileUploadUrl +
                                (currentItem?.media || String(media)),
                        ),
                    ) ? (
                        <video
                            src={
                                fileUploadUrl +
                                (currentItem?.media || String(media))
                            }
                            controls={true}
                            autoPlay={true}
                            width={200}
                            height={200}
                            className={cn(["rounded-lg", "md:w-2/5", "mb-6"])}
                            onError={() => setMediaUrl(defaultImageUrl)}
                        />
                    ) : audioFileExtensions.includes(
                          getFileExtension(
                              fileUploadUrl +
                                  (currentItem?.media || String(media)),
                          ),
                      ) ? (
                        <audio
                            src={
                                fileUploadUrl +
                                (currentItem?.media || String(media))
                            }
                            autoPlay={true}
                            controls={true}
                            onError={() => setMediaUrl(defaultImageUrl)}
                        />
                    ) : (
                        <Image
                            src={
                                editing
                                    ? mediaUrl
                                    : fileUploadUrl +
                                      (currentItem?.media || String(media))
                            }
                            width={200}
                            height={200}
                            alt={"Quiz card image"}
                            className={cn([
                                "rounded-md",
                                mediaUrl === defaultImageUrl,
                                "mb-6",
                            ])}
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

                    <div
                        className={cn([
                            "pb-4",
                            "gap-x-2",
                            checked ? "pt-4" : "pt-8",
                            admin
                                ? "flex justify-between items-center w-full"
                                : "",
                        ])}
                    >
                        {admin && (
                            <div className="flex items-center gap-x-2">
                                <Button
                                    className=" bg-red-700 text-white hover:bg-red-800 hover:text-white"
                                    variant="outline"
                                    onClick={() => {
                                        const confirmed = window.confirm(
                                            "Do you want to delete this card?",
                                        );
                                        if (!confirmed) {
                                            return;
                                        }
                                        axios({
                                            method: "get",
                                            url: "/card/delete?id=" + id,
                                        })
                                            .then(() => {
                                                setAddedCardList(
                                                    addedCardList.filter(
                                                        (card) =>
                                                            card.id !== id,
                                                    ),
                                                );
                                            })
                                            .catch((error) => {
                                                console.error(
                                                    "There was an error!",
                                                    error,
                                                );
                                            })
                                            .finally(() => {
                                                refetch();
                                                onClose?.();
                                            });
                                    }}
                                >
                                    Delete Card
                                </Button>
                            </div>
                        )}

                        <div>
                            {admin && (
                                <Button
                                    variant="outline"
                                    className="bg-gray-800 hover:bg-gray-700 text-gray-100 hover:text-gray-100 border hover:border-gray-700"
                                    onClick={() => {
                                        if (editing) {
                                            // Handle save logic here
                                            handleSaveOrEditing();
                                        } else {
                                            setEditing(true);
                                            setIsEditing(true);
                                            console.log("@@@ Clicked");
                                        }
                                    }}
                                    disabled={
                                        editing
                                            ? editedOptions.toString() ===
                                                  options?.toString() &&
                                              editedTitle === title &&
                                              editedQuestion === question &&
                                              editedCategory === category &&
                                              editedAnswer === answer &&
                                              mediaUrl === fileUploadUrl + media
                                            : false
                                    }
                                >
                                    {editing ? "Save" : "Edit"}
                                </Button>
                            )}
                            {!admin && (
                                <Button
                                    variant="outline"
                                    className="bg-gray-800 hover:bg-gray-700 text-gray-100 hover:text-gray-100 border hover:border-gray-700"
                                    onClick={handleNextClick}
                                >
                                    {currentItemIndex <
                                    (subCategoryItems?.length ?? 0) - 1
                                        ? "Next"
                                        : "Finish"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="py-10"> Error loading data</p>
            )}
        </Card>
    );
}
