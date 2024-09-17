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

interface QuizCard {
  id: number;
  category: string;
  subCategory: string;
  question: string;
  file?: string;
  options: string[];
  answer?: string;
}

const categories: QuizCard[] = [
  {
    id: 1,
    category: "Movies",
    subCategory: "Harry Potter",
    question: "Who played Harry Potter in the movies?",
    file: "https://nextjs.org/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpreview-audible.6063405a.png&w=640&q=75",
    options: [
      "Daniel Radcliffe",
      "Rupert Grint",
      "Tom Felton",
      "Matthew Lewis",
    ],
    answer: "Daniel Radcliffe",
  },
  {
    id: 2,
    category: "Movies",
    subCategory: "Interstellar",
    question: "Who directed Interstellar?",
    file: "https://nextjs.org/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpreview-audible.6063405a.png&w=640&q=75",
    options: [
      "Christopher Nolan",
      "Steven Spielberg",
      "James Cameron",
      "Ridley Scott",
    ],
    answer: "Christopher Nolan",
  },
  {
    id: 3,
    category: "Movies",
    subCategory: "Home Alone",
    question: "How many Home Alone movies are there?",
    file: "https://nextjs.org/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpreview-audible.6063405a.png&w=640&q=75",
    options: ["1", "2", "3", "4"],
    answer: "2",
  },
  {
    id: 4,
    category: "Politics",
    subCategory: "US Presidents",
    question: "Who was the first president of the United States?",
    file: "https://nextjs.org/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpreview-audible.6063405a.png&w=640&q=75",
    options: [
      "George Washington",
      "Thomas Jefferson",
      "John Adams",
      "James Madison",
    ],
    answer: "George Washington",
  },
];

interface AdminCardProps {
  categoryName: string;
}

export default function AdminCard(categoryName: AdminCardProps) {
  const [filteredCardData, setFilteredCardData] =
    useState<QuizCard[]>(categories);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<QuizCard | undefined>(
    undefined
  );

  useEffect(() => {
    if (categoryName.categoryName === "All") {
      setFilteredCardData(categories);
    } else {
      setFilteredCardData(
        categories.filter(
          (category) => category.category === categoryName.categoryName
        )
      );
    }
  }, [categoryName]);

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
          {filteredCardData.map((filteredCardData) => (
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
                  src={filteredCardData.file || ""}
                  alt={filteredCardData.subCategory}
                  width={50}
                  height={50}
                />
              </TableCell>
              <TableCell>{filteredCardData.category}</TableCell>
              <TableCell>{filteredCardData.subCategory}</TableCell>
              <TableCell>{filteredCardData.question}</TableCell>
            </TableRow>
          ))}
          {filteredCardData.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center pt-6 text-xs font-thin"
              >
                No data found
              </TableCell>
            </TableRow>
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
            category={selectedCard.category}
            options={selectedCard.options}
            onClose={handleCloseModal}
            admin
          />
        )}
      </Modal>
    </>
  );
}
