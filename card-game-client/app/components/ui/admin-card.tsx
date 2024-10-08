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
import {
    defaultImageUrl,
    videoFileExtensions,
    fileUploadUrl,
    cn,
} from "@/app/lib/utils";
import { ThreeDots } from "react-loader-spinner";
import { useCardsContext } from "@/app/context/CardsContent";
import { QuizCard } from "@/app/lib/types";

interface AdminCardProps {
    categoryName: string;
}

export default function AdminCard(categoryName: AdminCardProps) {
    const { quizCardList, isLoading } = useCardsContext();

    const [filteredCardData, setFilteredCardData] =
        useState<QuizCard[]>(quizCardList);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [selectedCard, setSelectedCard] = useState<QuizCard | undefined>(
        undefined,
    );
    const [imageError, setImageError] = useState<{ [key: number]: boolean }>(
        {},
    );
    const handleImageError = (id: number) => {
        setImageError((prev) => ({ ...prev, [id]: true }));
    };

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
                                    {filteredCardData.file?.extension &&
                                    videoFileExtensions.includes(
                                        filteredCardData.file.extension,
                                    ) ? (
                                        <video
                                            src={
                                                fileUploadUrl +
                                                filteredCardData.file.savedName
                                            }
                                            controls={false}
                                            width={50}
                                            height={50}
                                        />
                                    ) : (
                                        <Image
                                            src={
                                                imageError[filteredCardData.id]
                                                    ? defaultImageUrl
                                                    : fileUploadUrl +
                                                      (filteredCardData.file
                                                          ?.savedName || "")
                                            }
                                            alt={
                                                filteredCardData.subCategory ||
                                                ""
                                            }
                                            width={50}
                                            height={50}
                                            onError={() =>
                                                handleImageError(
                                                    filteredCardData.id,
                                                )
                                            }
                                            className={cn(["rounded-md"])}
                                        />
                                    )}
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
                        id={selectedCard.id}
                        title={selectedCard.subCategory}
                        question={selectedCard.question}
                        answer={selectedCard.answer}
                        category={selectedCard.category.category}
                        options={selectedCard.answerOptions}
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
