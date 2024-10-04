"use client";

import React, { useState, useEffect } from "react";
import useWebSocket from "../hook/useWebSocket";
import { useAtom } from "jotai";
import { initialGamer } from "../atom/atom";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../components/ui/button";
import {
    defaultImageUrl,
    fileUploadUrl,
    videoFileExtensions,
} from "../lib/utils";
import axios from "axios";
import { QuizCard, Card } from "../lib/types";
import Image from "next/image";
import { ThreeDots } from "react-loader-spinner";
import { ChevronRightIcon } from "lucide-react";

export default function GameRoom() {
    const router = useRouter();
    const [input, setInput] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const [gamer] = useAtom(initialGamer);
    const admin = gamer.role === "ADMIN";

    // Extract the PIN from the URL
    const searchParams = useSearchParams();
    const pinFromQuery = searchParams.get("pin");
    const subCategoryFromQuery = searchParams.get("subCategory");

    const [pin, setPin] = useState(pinFromQuery || "");
    const [inputPin, setInputPin] = useState("");

    const shouldConnect = !!pin || admin;

    const [quizCards, setQuizCards] = useState<QuizCard[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imageError, setImageError] = useState<{ [key: number]: boolean }>(
        {},
    );

    const handleImageError = (id: number) => {
        setImageError((prev) => ({ ...prev, [id]: true }));
    };

    const getQuizCards = async () => {
        setLoading(true);
        const res = await axios
            .get(`/card/getBySubCategory?subCategory=${subCategoryFromQuery}`)
            .then((response) => {
                return response;
            });
        const quizCards: QuizCard[] = res.data.map((card: Card) => ({
            ...card,
            file: card.file ? JSON.parse(card.file) : undefined,
            answerOptions:
                typeof card.answerOption === "string"
                    ? card.answerOption.split(",")
                    : card.answerOption,
        }));

        setQuizCards(quizCards);
        setLoading(false);
    };

    useEffect(() => {
        getQuizCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // answers should contain the answers of all players
    const { messages, answers, sendMessage } = useWebSocket(
        "ws://localhost:8081/api/game-room",
        shouldConnect,
    );

    const handleAnswerSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        sendMessage({ event: "answerClick", data: answer });
        setAnswer("");
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        sendMessage({ event: "sendMessage", data: input });
        setInput("");
    };

    const handleShowAnswers = () => {
        console.log("Submitted Answers: ", answers);
    };

    const handleNextSlide = () => {
        if (currentSlide < quizCards.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
        if (currentSlide === quizCards.length - 1) {
            router.push("/dashboard");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
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
            </div>
        );
    }

    if (!pin && !admin) {
        // Show PIN input form
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <h2 className="text-lg mb-4 font-bold">
                    Enter PIN to join game room
                </h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setPin(inputPin);
                    }}
                    className="w-full max-w-sm"
                >
                    <input
                        type="text"
                        value={inputPin}
                        onChange={(e) => setInputPin(e.target.value)}
                        placeholder="Enter PIN"
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    <Button type="submit" className="w-full">
                        Join
                    </Button>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="flex flex-col items-center justify-center p-4 lg:flex-row lg:space-x-8 lg:items-start">
                {/* Quiz Section */}
                <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
                    <div className="text-center mb-4">
                        <h2 className="text-md font-bold">
                            Your Game PIN: {pinFromQuery || inputPin}
                        </h2>
                    </div>
                    <div className="text-center mb-4">
                        <h1 className="text-xl font-semibold">
                            Quiz Title:{" "}
                            {quizCards.length === 0
                                ? ""
                                : quizCards[currentSlide].question}
                        </h1>
                    </div>
                    <div className="w-full max-w-lg mx-auto">
                        {quizCards.length === 0 ? (
                            <div className="flex flex-col items-center justify-center w-full p-4">
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
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full p-4">
                                <div className="mb-4 w-full">
                                    {quizCards[currentSlide].file?.extension &&
                                    videoFileExtensions.includes(
                                        quizCards[currentSlide].file.extension,
                                    ) ? (
                                        <video
                                            src={
                                                fileUploadUrl +
                                                quizCards[currentSlide].file
                                                    .savedName
                                            }
                                            controls={false}
                                            className="mx-auto rounded-md"
                                        />
                                    ) : (
                                        <Image
                                            src={
                                                imageError[
                                                    quizCards[currentSlide].id
                                                ]
                                                    ? defaultImageUrl
                                                    : fileUploadUrl +
                                                      (quizCards[currentSlide]
                                                          .file?.savedName ||
                                                          "")
                                            }
                                            alt={
                                                quizCards[currentSlide]
                                                    .subCategory || ""
                                            }
                                            width={300}
                                            height={300}
                                            onError={() =>
                                                handleImageError(
                                                    quizCards[currentSlide].id,
                                                )
                                            }
                                            className="mx-auto rounded-md"
                                        />
                                    )}
                                </div>
                                <form
                                    onSubmit={handleAnswerSubmit}
                                    className="w-full max-w-lg"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        {(
                                            quizCards[currentSlide]
                                                .answerOptions as string[]
                                        ).map((option, index) => (
                                            <Button
                                                variant={
                                                    answer === option
                                                        ? "quizSelected"
                                                        : "quiz"
                                                }
                                                type="button"
                                                value={option}
                                                key={index}
                                                onClick={() =>
                                                    setAnswer(option)
                                                }
                                                className="inline-flex flex-grow items-center justify-center min-h-12 w-full p-4 break-words whitespace-normal"
                                            >
                                                {option}
                                            </Button>
                                        ))}
                                    </div>
                                    <div className="flex justify-center pt-2">
                                        <Button
                                            variant="selected"
                                            type="submit"
                                            className="inline-flex flex-grow items-center justify-center min-h-12 w-full p-4 break-words whitespace-normal"
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Section */}
                <div className="flex flex-col w-full lg:w-1/2 p-6 border-t lg:border-t-0 lg:border-l border-gray-300 my-auto">
                    <div className="mb-4">
                        <h2 className="text-md font-bold">
                            Questions: {currentSlide + 1}/{quizCards.length}
                        </h2>
                    </div>
                    <h2 className="text-lg font-medium mb-2">Chat</h2>
                    <div className="mb-4 bg-gray-200 p-4 rounded overflow-y-auto h-96">
                        {messages.map((msg, index) => (
                            <div className="mb-2" key={index}>
                                {msg.data}
                            </div>
                        ))}
                    </div>
                    <form className="flex w-full" onSubmit={handleSubmit}>
                        <input
                            className="flex-1 border border-gray-300 p-2 rounded"
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />

                        <Button
                            variant="selected"
                            type="submit"
                            className="ml-2 py-2 px-4 rounded"
                        >
                            Send
                        </Button>
                    </form>
                </div>
            </div>
            {admin && (
                <div className="flex gap-4 mt-6">
                    <Button
                        variant="general"
                        onClick={handleShowAnswers}
                        className="w-full"
                    >
                        Show Submitted Answers
                    </Button>
                    <Button
                        variant="ghost"
                        asChild
                        size="sm"
                        className="cursor-pointer group"
                    >
                        <a
                            className="flex items-center gap-2 hover:underline hover:underline-offset-4 relative"
                            onClick={handleNextSlide}
                            rel="noopener noreferrer"
                        >
                            {currentSlide === quizCards.length - 1
                                ? "Back to Dashboard"
                                : "Next Question"}
                            <ChevronRightIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </a>
                    </Button>
                </div>
            )}
        </div>
    );
}
