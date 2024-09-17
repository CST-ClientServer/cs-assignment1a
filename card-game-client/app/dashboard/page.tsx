"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/header/header";
import BentoGrid from "../components/ui/bento-grid";
import Card from "../components/ui/card";
import Image from "next/image";
import { Button } from "../components/ui/button";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import GameCard from "../components/ui/game-card";
import Modal from "react-modal";
import axios from "axios";

interface Category {
  id: number;
  category: string;
}

interface QuizCard {
  id: number;
  question: string;
  answerOptions: string[];
  answer: string;
  file?: string;
  category: Category;
  subCategory: string;
}

interface SubCategoryGroup {
  category: Category;
  subCategory: string;
  questions: QuizCard[];
  answerOptions: string[];
}

/*
  The following code is a mock data for the quiz cards and categories.
  You can replace this with your own data or fetch it from an API.
*/
const movieCategory: Category = { id: 1, category: "Movies" };
const politicsCategory: Category = { id: 2, category: "Politics" };
const productCategory: Category = { id: 3, category: "Products" };
const musicCategory: Category = { id: 4, category: "Music" };
const historyCategory: Category = { id: 5, category: "History" };
const scienceCategory: Category = { id: 6, category: "Science" };

const categoryCards = [
  movieCategory,
  politicsCategory,
  productCategory,
  musicCategory,
  historyCategory,
  scienceCategory,
];

const QuizCard1: QuizCard = {
  id: 1,
  question: "Who played Harry Potter in the movies?",
  answerOptions: [
    "Daniel Radcliffe",
    "Rupert Grint",
    "Tom Felton",
    "Matthew Lewis",
  ],
  answer: "Daniel Radcliffe",
  category: movieCategory,
  subCategory: "Harry Potter",
};

const QuizCard2: QuizCard = {
  id: 2,
  question: "Who is Harry's father in Harry Potter?",
  answerOptions: [
    "James Potter",
    "Sirius Black",
    "Remus Lupin",
    "Severus Snape",
  ],
  answer: "James Potter",
  category: movieCategory,
  subCategory: "Harry Potter",
};

const QuizCard3: QuizCard = {
  id: 3,
  question: "How many Home Alone movies are there?",
  answerOptions: ["1", "2", "3", "4"],
  answer: "4",
  category: movieCategory,
  subCategory: "Home Alone",
};

const QuizCard4: QuizCard = {
  id: 4,
  question: "Who is the current president of the United States?",
  answerOptions: ["Joe Biden", "Donald Trump", "Barack Obama", "George Bush"],
  answer: "Joe Biden",
  category: politicsCategory,
  subCategory: "United States",
};

const QuizCard5: QuizCard = {
  id: 5,
  question: "What is the capital of France?",
  answerOptions: ["Paris", "London", "Berlin", "Madrid"],
  answer: "Paris",
  category: politicsCategory,
  subCategory: "France",
};

const quizCardList = [QuizCard1, QuizCard2, QuizCard3, QuizCard4, QuizCard5];

/**
 * Mock data end for quiz and categories.
 */

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<number | "All">(
    "All"
  );
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategoryGroup | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [groupedQuizCards, setGroupedQuizCards] = useState<SubCategoryGroup[]>(
    []
  );

  useEffect(() => {
    const groupedCards = quizCardList.reduce<SubCategoryGroup[]>(
      (acc, card) => {
        const existingGroup = acc.find(
          (group) =>
            group.category.id === card.category.id &&
            group.subCategory === card.subCategory
        );
        if (existingGroup) {
          existingGroup.questions.push(card);
        } else {
          acc.push({
            category: card.category,
            subCategory: card.subCategory,
            questions: [card],
            answerOptions: card.answerOptions,
          });
        }
        return acc;
      },
      []
    );
    setGroupedQuizCards(groupedCards);
  }, []);

  useEffect(() => {
    if (selectedSubCategory) {
      setModalIsOpen(true);
    }
  }, [selectedSubCategory]);

  const filteredGroupedCards =
    selectedCategory === "All"
      ? groupedQuizCards
      : groupedQuizCards.filter(
          (group) => group.category.id === selectedCategory
        );

  useEffect(() => {
    axios
      .get("/card/getAll")
      .then((response) => {
        setGroupedQuizCards(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const handleCategoryChange = (categoryId: number | "All") => {
    setSelectedCategory(categoryId);
  };

  const handleSubCategoryClick = (subCategory: SubCategoryGroup) => {
    setSelectedSubCategory(subCategory);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setSelectedSubCategory(null);
  };

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
                { label: "All", onClick: () => handleCategoryChange("All") },
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
                    ? categoryCards.find((cat) => cat.id === selectedCategory)
                        ?.category
                    : "Select Category"}
                </span>
                <ChevronDownIcon className="h-4 w-4" />
              </div>
            </Button>
          </div>
        </div>

        <BentoGrid className="pt-6 pb-10 gap-20">
          {/* logic involves showing only one category containing multiple subcategories */}
          {filteredGroupedCards.map((card) => (
            <Card
              key={card.subCategory}
              onClick={() => handleSubCategoryClick(card)}
            >
              <h1 className="text-md sm:text-2xl">
                {card.category.category}:{" "}
                <span className="text-md">{card.subCategory}</span>
              </h1>
              <Image
                src="https://nextjs.org/icons/next.svg"
                alt="image"
                width={100}
                height={100}
              />
            </Card>
          ))}
        </BentoGrid>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Game Card Modal"
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
            subCategoryItems={selectedSubCategory.questions.map((q) => ({
              id: q.id,
              subCategory: q.subCategory,
              title: q.question,
              question: q.answer,
              options: q.answerOptions,
              answer: q.answer,
            }))}
          />
        )}
      </Modal>
    </div>
  );
}
