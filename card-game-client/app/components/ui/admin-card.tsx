import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./table";
import Modal from "react-modal";
import GameCard from "./game-card";
import Image from "next/image";
import axios from "axios";
import { useAtom } from "jotai";
import { initialQuizCardList } from "@/app/atom/atom";
import { defaultImageUrl } from "@/app/lib/utils";
import { ThreeDots } from "react-loader-spinner";

export interface Category {
    id: number;
    category: string;
}

export interface FileObject {
    originalName: string;
    savedPath: string;
    savedName: string;
    size: string;
    extension: string;
}

export interface QuizCardFromDB {
    id: number;
    question: string;
    answerOption: string | string[];
    answer: string;
    file?: string;
    category: string;
    subCategory: string;
}

export interface QuizCard {
    id: number;
    question: string;
    answerOption: string[];
    answer: string;
    file?: FileObject;
    category: Category;
    subCategory: string;
}

interface AdminCardProps {
    categoryName: string;
}

export default function AdminCard(categoryName: AdminCardProps) {
    const [quizCardList, setQuizCardList] = useState<QuizCard[]>([]);
    const [filteredCardData, setFilteredCardData] =
        useState<QuizCard[]>(quizCardList);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [selectedCard, setSelectedCard] = useState<QuizCard | undefined>(
        undefined,
    );
    const [addedCardList] = useAtom(initialQuizCardList);
    const [isLoading, setIsLoading] = useState(true);

    const [imageError, setImageError] = useState<{ [key: number]: boolean }>(
        {},
    );
    const handleImageError = (id: number) => {
        setImageError((prev) => ({ ...prev, [id]: true }));
    };

    useEffect(() => {
        console.log("Triggered");
        setIsLoading(true);
        axios
            .get("/card/getAll")
            .then((response) => {
                response.data.forEach((element: QuizCardFromDB) => {
                    element.category = JSON.parse(element.category);
                    if (element.file != null) {
                        element.file = JSON.parse(element.file);
                    }
                    if (typeof element.answerOption === "string") {
                        element.answerOption = element.answerOption.split(",");
                    }
                });
                setQuizCardList(response.data);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [addedCardList]);

    useEffect(() => {
        if (categoryName.categoryName === "All") {
            setFilteredCardData(quizCardList);
        } else {
            setFilteredCardData(
                quizCardList.filter(
                    (quizCard) =>
                        quizCard.category.category ===
                        categoryName.categoryName,
                ),
            );
        }
    }, [quizCardList, categoryName]);

    const handleCloseModal = () => {
        setModalIsOpen(false);
        setSelectedCard(undefined);
    };

    return (
        <>
            <Table className="dark:bg-gray-800">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Subcategory</TableHead>
                        <TableHead>Question</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5}>
                                <div className="flex items-center justify-center h-full">
                                    <ThreeDots
                                        visible={true}
                                        height="30"
                                        width="30"
                                        color="#f27f7f"
                                        radius="5"
                                        ariaLabel="three-dots-loading"
                                        wrapperStyle={{ margin: "auto" }}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : filteredCardData.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="text-center pt-6 text-xs font-thin"
                            >
                                No data found
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredCardData.map((filteredCardData) => (
                            <TableRow
                                key={filteredCardData.id}
                                onClick={() => {
                                    setModalIsOpen(true);
                                    setSelectedCard(filteredCardData);
                                }}
                                className="cursor-pointer"
                            >
                                <TableCell className="font-medium">
                                    {filteredCardData.id}
                                </TableCell>
                                <TableCell>
                                    <Image
                                        src={
                                            imageError[filteredCardData.id]
                                                ? defaultImageUrl
                                                : "http://ec2-54-176-67-195.us-west-1.compute.amazonaws.com:8080/uploadFiles/" +
                                                  (filteredCardData.file
                                                      ?.savedName || "")
                                        }
                                        alt={filteredCardData.subCategory || ""}
                                        width={50}
                                        height={50}
                                        onError={() =>
                                            handleImageError(
                                                filteredCardData.id,
                                            )
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    {filteredCardData.category.category}
                                </TableCell>
                                <TableCell>
                                    {filteredCardData.subCategory}
                                </TableCell>
                                <TableCell>
                                    {filteredCardData.question}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Game Card Modal"
                className="flex items-center justify-center fixed inset-0 z-50 dark:bg-gray-800"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                ariaHideApp={false}
            >
                {selectedCard && (
                    <GameCard
                        title={selectedCard.subCategory}
                        question={selectedCard.question}
                        answer={selectedCard.answer}
                        category={selectedCard.category.category}
                        options={selectedCard.answerOption}
                        onClose={handleCloseModal}
                        media={selectedCard.file?.savedName}
                        quizCardList={quizCardList}
                        admin
                    />
                )}
            </Modal>
        </>
    );
}
