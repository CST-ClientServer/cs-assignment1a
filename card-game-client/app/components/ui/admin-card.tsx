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

const categories = [
  {
    id: 1,
    category: "Movies",
    subcategory: "Harry Potter",
    question: "Who played Harry Potter in the movies?",
    image:
      "https://nextjs.org/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpreview-audible.6063405a.png&w=640&q=75",
    options: [
      "Daniel Radcliffe",
      "Rupert Grint",
      "Tom Felton",
      "Matthew Lewis",
    ],
  },
  {
    id: 2,
    category: "Movies",
    subcategory: "Interstellar",
    question: "Who directed Interstellar?",
    image:
      "https://nextjs.org/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpreview-audible.6063405a.png&w=640&q=75",
    options: [
      "Christopher Nolan",
      "Steven Spielberg",
      "James Cameron",
      "Ridley Scott",
    ],
  },
  {
    id: 3,
    category: "Movies",
    subcategory: "Home Alone",
    question: "How many Home Alone movies are there?",
    image:
      "https://nextjs.org/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpreview-audible.6063405a.png&w=640&q=75",
    options: ["1", "2", "3", "4"],
  },
  {
    id: 4,
    category: "Politics",
    subcategory: "US Presidents",
    question: "Who was the first president of the United States?",
    image:
      "https://nextjs.org/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpreview-audible.6063405a.png&w=640&q=75",
    options: [
      "George Washington",
      "Thomas Jefferson",
      "John Adams",
      "James Madison",
    ],
  },
];

interface AdminCardProps {
  categoryName: string;
}

export default function AdminCard(categoryName: AdminCardProps) {
  const [filteredCardData, setFilteredCardData] = useState<any[]>(categories); // change state
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<any>(null); // change type

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
    setSelectedCard(null);
  };

  return (
    <>
      <Table>
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
                  src={filteredCardData.image}
                  alt={filteredCardData.subcategory}
                  width={50}
                  height={50}
                />
              </TableCell>
              <TableCell>{filteredCardData.category}</TableCell>
              <TableCell>{filteredCardData.subcategory}</TableCell>
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
        className="flex items-center justify-center fixed inset-0 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        {selectedCard && (
          <GameCard
            title={selectedCard.subcategory}
            question={selectedCard.question}
            category={selectedCard.category}
            options={selectedCard.options}
            onClose={handleCloseModal}
            categoryItems={selectedCard}
            admin
          />
        )}
      </Modal>
    </>
  );
}
