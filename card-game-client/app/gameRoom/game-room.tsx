"use client";

import React, { useState } from "react";
import useWebSocket from "../hook/useWebSocket";
import { useAtom } from "jotai";
import { initialGamer } from "../atom/atom";
import { useSearchParams } from "next/navigation";
import { Button } from "../components/ui/button";
import { cn, defaultImageUrl, fileUploadUrl, videoFileExtensions } from "../lib/utils";
import axios from "axios";
import { QuizCard, Card } from "../lib/types";
import Image from "next/image";
import { ThreeDots } from "react-loader-spinner";

export default function GameRoom() {
    const [input, setInput] = useState("");
    const [answer, setAnswer] = useState("");

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


    const [imageError, setImageError] = useState<{ [key: number]: boolean }>(
        {},
    );
    const handleImageError = (id: number) => {
        setImageError((prev) => ({ ...prev, [id]: true }));
    };

    const getQuizCards = async() => {
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
    }

    React.useEffect(() => {        
        getQuizCards();  
    }, []);

    // answers should contain the answers of all players
    const { 
        messages, 
        // answers, 
        sendMessage } = useWebSocket(
        "ws://localhost:8081/api/game-room",
        shouldConnect,
    );

    const handleAnswerSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Answer: ", answer);
        sendMessage({ event: "answerClick", data: answer });
        setAnswer("");
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        sendMessage({ event: "sendMessage", data: input });
        setInput("");
    };

    if (!pin && !admin) {
        // Show PIN input form
        return (
            <div>
                <h2>Enter PIN to join game room</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setPin(inputPin);
                    }}
                >
                    <input
                        type="text"
                        value={inputPin}
                        onChange={(e) => setInputPin(e.target.value)}
                        placeholder="Enter PIN"
                    />
                    <button type="submit">Join</button>
                </form>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">Your Game PIN: {pinFromQuery || inputPin}</h2>
            </div>            
            <div className="text-center mb-4">
                <h1 className="text-xl font-semibold">Quiz Title: { quizCards.length === 0 ? "" : quizCards[0].question}</h1>
            </div>
            <div className="flex w-full max-w-4xl">
                {/* Quiz Option Area Start */}
                { quizCards.length === 0 ? 
                    <div className="flex flex-col items-center justify-center w-full p-4">
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
                : (
                    // quizCards.map((card, index) => (
                        <div className="flex flex-col items-center justify-center w-full p-4">
                        <div className="mb-4">
                        {quizCards[0].file?.extension &&
                                    videoFileExtensions.includes(
                                        quizCards[0].file.extension,
                                    ) ? (
                                        <video
                                            src={
                                                fileUploadUrl +
                                                quizCards[0].file.savedName
                                            }
                                            controls={false}
                                            width={200}
                                            height={200}
                                        />
                                    ) : (
                                        <Image
                                            src={
                                                imageError[quizCards[0].id]
                                                    ? defaultImageUrl
                                                    : fileUploadUrl +
                                                      (quizCards[0].file
                                                          ?.savedName || "")
                                            }
                                            alt={
                                                quizCards[0].subCategory ||
                                                ""
                                            }
                                            width={200}
                                            height={200}
                                            onError={() =>
                                                handleImageError(
                                                    quizCards[0].id,
                                                )
                                            }
                                            className={cn(["rounded-md"])}
                                        />
                                    )}
                        </div>
                        <form onSubmit={handleAnswerSubmit}>
                            {/* This input should be generated by iteration */}
                            <div className="grid grid-cols-2 gap-4 mb-4">                            
                                {((quizCards[0].answerOptions as string[]).map((option, index) => (
                                    <Button 
                                        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                                        type="button"
                                        value={option[index]}
                                        key={index}
                                        onClick={() => {
                                        console.log(option)
                                        setAnswer(option)}}
                                    >
                                    {option}
                                    </Button>
                                )))}
                            </div>
                            <div className="flex justify-center">
                                <Button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" type="submit">Answer</Button>
                            </div>
                        </form>
                    </div>      
                    // ))
                )}
                {/* Quiz Option Area End */}
                {/* Quiz Chat Area Start */}
                <div className="flex flex-col w-1/2 p-4 border-l border-gray-300">
                    <h2 className="text-lg font-medium mb-2">Chat</h2>               
                    <div className="mb-4 bg-yellow-200 p-4 rounded overflow-y-auto h-96">
                        {messages.map((msg, index) => (
                            <div className="mb-2" key={index}>{msg.data}</div>
                        ))}
                    </div>
                    <form className="flex" onSubmit={handleSubmit}>
                        <input
                            className="flex-1 border border-gray-300 p-2 rounded"
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button className="ml-2 bg-blue-500 text-white py-2 px-4 rounded" type="submit">Send</Button>
                    </form>
                </div>
                {/* Quiz Chat Area End */}
            </div>
        </div>
    );
}
