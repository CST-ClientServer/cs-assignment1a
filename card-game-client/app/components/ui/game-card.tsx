import React, { useState, useEffect } from "react";
import Card from "./card";
import { cn, fileUploadUrl } from "@/app/lib/utils";
import { Button } from "./button";
import axios from "axios";
import { useAtom } from "jotai";
import { initialQuizCardList } from "@/app/atom/atom";
import { QuizCard } from "@/app/lib/types";
import { useCardsContext } from "@/app/context/CardsContent";
import MediaDisplay from "./game-card/media-display";
import UserOptionsList from "./game-card/user-options-list";
import AdminOptionsList from "./game-card/admin-options-list";
import Header from "./game-card/header";
import TimerBar from "./game-card/timer-bar";

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
            method: "put",
            url: "/cards/id/" + id,
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
            url: "/cards/",
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
            handleEdit();
        } else {
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

    return (
        <Card className="w-full lg:w-3/4 h-auto flex-wrap justify-center">
            <Header
                category={category || ""}
                createCard={createCard}
                admin={admin}
                editing={editing ?? false}
                setEditedCategory={setEditedCategory}
                categoryOptions={categoryOptions}
                handleOptionBlur={handleOptionBlur}
                editedTitle={editedTitle}
                setEditedTitle={setEditedTitle}
                title={title}
                currentItemSubCategory={currentItem?.subCategory}
                handleChange={handleChange}
                checked={checked}
                onClose={onClose}
            />

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
                                />
                            </div>
                        ) : admin ? (
                            `${question} ${answer}`
                        ) : (
                            `${currentItem?.title}`
                        )}
                    </h2>

                    <MediaDisplay
                        src={
                            fileUploadUrl +
                            (currentItem?.media || String(media))
                        }
                        editing={editing ?? false}
                        mediaUrl={mediaUrl}
                        setMediaUrl={setMediaUrl}
                    />

                    {editing && (
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

                    {admin ? (
                        <AdminOptionsList
                            options={editedOptions}
                            editedAnswer={editedAnswer}
                            editingOption={editingOption}
                            editing={editing ?? false}
                            handleOptionChange={handleOptionChange}
                            handleOptionBlur={handleOptionBlur}
                            handleOptionClick={handleOptionClick}
                        />
                    ) : (
                        <UserOptionsList
                            options={currentItem?.options || []}
                            selectedOption={selectedOption}
                            answer={answer}
                            handleOptionClick={handleOptionClick}
                        />
                    )}

                    {checked && !admin && (
                        <TimerBar timeLeft={timeLeft} timeLimit={timeLimit} />
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
                                            method: "delete",
                                            url: "/cards/id/" + id,
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
                                            handleSaveOrEditing();
                                        } else {
                                            setEditing(true);
                                            setIsEditing(true);
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
