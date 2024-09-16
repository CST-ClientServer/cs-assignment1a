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

const categoryCards = [
  { id: 1, title: "Movie", category: "Movies" },
  { id: 2, title: "Politics", category: "Politics" },
  { id: 3, title: "Product", category: "Products" },
  { id: 4, title: "Music", category: "Music" },
  { id: 5, title: "History", category: "History" },
  { id: 6, title: "Science", category: "Science" },
];

const categoryItems = {
  Movies: [
    {
      id: 1,
      title: "Harry Potter",
      question: "Who played Harry Potter in the movies?",
      options: [
        "Daniel Radcliffe",
        "Rupert Grint",
        "Tom Felton",
        "Matthew Lewis",
      ],
    },
    {
      id: 2,
      title: "Interstellar",
      question: "Who directed Interstellar?",
      options: [
        "Christopher Nolan",
        "Steven Spielberg",
        "James Cameron",
        "Ridley Scott",
      ],
    },
    {
      id: 3,
      title: "Home Alone",
      question: "How many Home Alone movies are there?",
      options: ["1", "2", "3", "4"],
    },
  ],
};

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCard, setSelectedCard] = useState<any>(null); // change type
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [currentCategoryItems, setCurrentCategoryItems] = useState<any[]>([]); // change type

  useEffect(() => {
    if (selectedCard) {
      setModalIsOpen(true);
      setCurrentCategoryItems(categoryItems[selectedCard.category] || []); // fix type
    }
  }, [selectedCard]);

  const filteredCardData =
    selectedCategory === "All"
      ? categoryCards
      : categoryCards.filter((card) => card.category === selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCardClick = (card: any) => {
    // change type
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
                {
                  label: "Movies",
                  onClick: () => handleCategoryChange("Movies"),
                },
                {
                  label: "Politics",
                  onClick: () => handleCategoryChange("Politics"),
                },
                {
                  label: "Products",
                  onClick: () => handleCategoryChange("Products"),
                },
              ]}
              className="w-60 border-thin"
            >
              <div className="flex items-center justify-between w-full">
                <span>{selectedCategory || "Select Category"}</span>
                <ChevronDownIcon className="h-4 w-4" />
              </div>
            </Button>
          </div>
        </div>

        <BentoGrid className="pt-6 pb-10 gap-20">
          {filteredCardData.map((card) => (
            <Card key={card.id} onClick={() => handleCardClick(card)}>
              <h1 className="text-xl sm:text-2xl">{card.title}</h1>
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
        {selectedCard && (
          <GameCard
            title={selectedCard.title}
            category={selectedCard.category}
            onClose={handleCloseModal}
            categoryItems={currentCategoryItems}
          />
        )}
      </Modal>
    </div>
  );
}
