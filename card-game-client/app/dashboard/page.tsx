"use client";

import React, { useState, useLayoutEffect } from "react";
import { useCardsContext } from "../context/CardsContent";
import { initialGamer } from "@/app/atom/atom";
import { useAtom } from "jotai";
import Header from "../components/header/header";
import BentoGrid from "../components/ui/bento-grid";
import Card from "../components/ui/card";
import Image from "next/image";
import {
    cn,
    defaultImageUrl,
    fileUploadUrl,
    videoFileExtensions,
} from "@/app/lib/utils";
import { Button } from "../components/ui/button";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import GameCard from "../components/ui/game-card";
import Modal from "react-modal";
import { ThreeDots } from "react-loader-spinner";
import { SubCategory } from "../lib/types";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [gamer] = useAtom(initialGamer);
    const admin = gamer.role === "ADMIN";
    const router = useRouter();
    const { categoryCards, groupedQuizCards } = useCardsContext();
    const [selectedCategory, setSelectedCategory] = useState<number | "All">(
        "All",
    );
    const [selectedSubCategory, setSelectedSubCategory] =
        useState<SubCategory | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [imageError, setImageError] = useState<{ [key: string]: boolean }>(
        {},
    );

    const handleImageError = (subCategory: string) => {
        setImageError((prev) => ({ ...prev, [subCategory]: true }));
    };

    useLayoutEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
    }, []);

    const filteredGroupedCards =
        selectedCategory === "All"
            ? groupedQuizCards
            : groupedQuizCards.filter(
                  (group) => group.category.id === selectedCategory,
              );

    const handleCategoryChange = (categoryId: number | "All") => {
        setSelectedCategory(categoryId);
    };

    const handleSubCategoryClick = (subCategory: SubCategory) => {
        setSelectedSubCategory(subCategory);
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
        setSelectedSubCategory(null);
    };

    if (filteredGroupedCards.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <ThreeDots
                    visible={true}
                    height="30"
                    width="30"
                    color="#f27f7f"
                    radius="5"
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen px-4 sm:px-6 md:px-10 dark:bg-zinc-900">
            <Header />
            <div className="flex-1">
                <div className="flex justify-end p-4">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm">Category</p>
                        <Button
                            variant="outline"
                            dropdown
                            dropdownValues={[
                                {
                                    label: "All",
                                    onClick: () => handleCategoryChange("All"),
                                },
                                ...categoryCards.map((cat) => ({
                                    label: cat.category,
                                    onClick: () => handleCategoryChange(cat.id),
                                })),
                            ]}
                            className="w-60 border-thin"
                        >
                            <div className="flex items-center justify-between w-full">
                                <span>
                                    {typeof selectedCategory === "number"
                                        ? categoryCards.find(
                                              (cat) =>
                                                  cat.id === selectedCategory,
                                          )?.category
                                        : "Select Category"}
                                </span>
                                <ChevronDownIcon className="h-4 w-4" />
                            </div>
                        </Button>
                    </div>
                </div>

                <BentoGrid className="pt-6 pb-10 gap-20">
                    {filteredGroupedCards.map((card) => (
                        <Card
                            key={card.subCategory}
                            onClick={() => handleSubCategoryClick(card)}
                            className="flex flex-col h-full"
                        >
                            <div className="flex-grow">
                                <h1 className="text-md sm:text-2xl pb-6">
                                    {card.category.category}:{" "}
                                    <span className="text-md">
                                        {card.subCategory}
                                    </span>
                                </h1>
                                <div className="flex justify-center items-center w-full h-40 overflow-hidden rounded-md">
                                    {card.questions[0].file?.extension &&
                                    videoFileExtensions.includes(
                                        card.questions[0].file.extension,
                                    ) ? (
                                        <video
                                            src={
                                                fileUploadUrl +
                                                card.questions[0].file.savedName
                                            }
                                            controls={false}
                                            width={230}
                                            height={230}
                                            className="object-cover rounded-md"
                                        />
                                    ) : (
                                        <Image
                                            src={
                                                imageError[card.subCategory] ||
                                                !card.questions[0].file
                                                    ?.savedName
                                                    ? defaultImageUrl
                                                    : fileUploadUrl +
                                                      `${card.questions[0].file.savedName}`
                                            }
                                            alt={`${card.subCategory} image`}
                                            className={cn([
                                                "object-cover",
                                                "rounded-md",
                                            ])}
                                            width={
                                                imageError[card.subCategory]
                                                    ? 180
                                                    : 260
                                            }
                                            height={
                                                imageError[card.subCategory]
                                                    ? 180
                                                    : 260
                                            }
                                            onError={() =>
                                                handleImageError(
                                                    card.subCategory,
                                                )
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                            {admin && (
                                <Button
                                    variant="quiz"
                                    className="w-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/gameRoom`);
                                    }}
                                >
                                    Create Game Room
                                </Button>
                            )}
                        </Card>
                    ))}
                </BentoGrid>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={handleCloseModal}
                className="flex items-center justify-center fixed inset-0 z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                ariaHideApp={false}
            >
                {selectedSubCategory && (
                    <GameCard
                        title={selectedSubCategory.questions
                            .map((q) => q.question)
                            .join(", ")}
                        category={selectedSubCategory.category.category}
                        onClose={handleCloseModal}
                        subCategoryItems={selectedSubCategory.questions.map(
                            (q) => ({
                                id: q.id,
                                subCategory: q.subCategory,
                                title: q.question,
                                question: q.question,
                                options: q.answerOptions,
                                media: q.file?.savedName,
                            }),
                        )}
                        answer={selectedSubCategory.questions
                            .map((q) => q.answer)
                            .join(", ")}
                        media={selectedSubCategory.questions
                            .map((q) => q.file?.savedName || "")
                            .join(", ")}
                    />
                )}
            </Modal>
        </div>
    );
}
