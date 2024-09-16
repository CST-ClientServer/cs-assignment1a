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

interface Category {
  id: number;
  category: string;
}

interface QuizCard {
  id: number;  
  question: string;
  options: string[];
  imageSrc?: string;
  category: Category;
}

const movieCategory: Category = { id: 1, category: "Movies" };
const politicsCategory: Category = { id: 2, category: "Politics" };
const productCategory: Category = { id: 3, category: "Products" };
const musicCategory: Category = { id: 4, category: "Music" };
const historyCategory: Category = { id: 5, category: "History" };
const scienceCategory: Category = { id: 6, category: "Science" };

const categoryCards = [
  movieCategory, politicsCategory, productCategory, musicCategory, historyCategory, scienceCategory
];

const QuizCard1: QuizCard = {
  id: 1,
  question: "Who played Harry Potter in the movies?",
  options: ["Daniel Radcliffe", "Rupert Grint", "Tom Felton", "Matthew Lewis"],
  category: movieCategory,
};

const QuizCard2: QuizCard = {
  id: 2,
  question: "Who directed Interstellar?",
  options: ["Christopher Nolan", "Steven Spielberg", "James Cameron", "Ridley Scott"],
  category: movieCategory,
};

const QuizCard3: QuizCard = {
  id: 3,
  question: "How many Home Alone movies are there?",
  options: ["1", "2", "3", "4"],
  category: movieCategory,
};

const QuizCard4: QuizCard = {
  id: 4,
  question: "Who is the current president of the United States?",
  options: ["Joe Biden", "Donald Trump", "Barack Obama", "George Bush"],
  category: politicsCategory,
};

const QuizCard5: QuizCard = { 
  id: 5,
  question: "What is the capital of France?",
  options: ["Paris", "London", "Berlin", "Madrid"],
  category: politicsCategory,
};

const quizCardList = [
  QuizCard1, QuizCard2, QuizCard3, QuizCard4, QuizCard5
];

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<number | "All">("All");
  const [selectedCard, setSelectedCard] = useState<QuizCard | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [currentCategoryItems, setCurrentCategoryItems] = useState<QuizCard[]>([]);

  useEffect(() => {
    if (selectedCard) {
      setModalIsOpen(true);
      setCurrentCategoryItems(quizCardList.filter((card) => card.category.id === selectedCard.category.id) || []);
    }
  }, [selectedCard]);

  const filteredCardData = selectedCategory === "All"
    ? quizCardList // Updated to use quizCardList
    : quizCardList.filter((card) => card.category.id === selectedCategory);

  const handleCategoryChange = (categoryId: number | "All") => {
    setSelectedCategory(categoryId);
  };

  const handleCardClick = (card: QuizCard) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setSelectedCard(null);
    setCurrentCategoryItems([]);
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
                ...categoryCards.map(cat => ({
                  label: cat.category,
                  onClick: () => handleCategoryChange(cat.id),
                })),
              ]}
              className="w-60 border-thin"
            >
              <div className="flex items-center justify-between w-full">
                <span>{typeof selectedCategory === 'number' ? categoryCards.find(cat => cat.id === selectedCategory)?.category : "Select Category"}</span>
                <ChevronDownIcon className="h-4 w-4" />
              </div>
            </Button>
          </div>
        </div>

        <BentoGrid className="pt-6 pb-10 gap-20">
          {filteredCardData.map((card) => (
            <Card key={card.id} onClick={() => handleCardClick(card)}> 
              <h1 className="text-xl sm:text-2xl">{card.id}</h1>
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
      >
        {selectedCard && (
          <GameCard
            title={selectedCard.question}
            category={selectedCard.category.category}
            onClose={handleCloseModal}
            categoryItems={currentCategoryItems.map(item => ({
              id: item.id,
              title: item.question,
              question: item.question,
              options: item.options,
            }))}
          />
        )}
      </Modal>
    </div>
  );
}
