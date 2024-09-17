"use client";

import React, { useState } from "react";
import Header from "../components/header/header";
import Card from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import AdminCard from "../components/ui/admin-card";
import Modal from "react-modal";
import GameCard from "../components/ui/game-card";

export default function Manage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <Header />
      <div className="w-full flex justify-between">
        <div className="flex flex-col gap-2 p-4">
          <small className="font-bold text-xs py-4">ADMIN DASHBOARD</small>
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
        <div className="p-4">
          <Button
            variant="outline"
            className="bg-gray-800 hover:bg-gray-700 text-gray-100 hover:text-gray-100 border hover:border-gray-700"
            onClick={() => setModalIsOpen(true)}
          >
            Add Card
          </Button>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleCloseModal}
          contentLabel="Game Card Modal"
          className="flex items-center justify-center fixed inset-0 z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          ariaHideApp={false}
        >
          {modalIsOpen && (
            <GameCard onClose={handleCloseModal} admin createCard />
          )}
        </Modal>
      </div>
      <div className="py-1" />
      <Card>
        <AdminCard categoryName={selectedCategory} />
      </Card>
    </>
  );
}