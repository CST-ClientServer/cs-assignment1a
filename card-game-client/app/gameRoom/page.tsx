"use client";

import React, { useState } from "react";
import useWebSocket from "../hook/useWebSocket";
import { useAtom } from "jotai";
import { initialGamer } from "../atom/atom";
import { useSearchParams } from "next/navigation";

export default function GameRoom() {
    const [input, setInput] = useState("");

    const [gamer] = useAtom(initialGamer);
    const admin = gamer.role === "ADMIN";

    // Extract the PIN from the URL
    const searchParams = useSearchParams();
    const pinFromQuery = searchParams.get("pin");

    const [pin, setPin] = useState(pinFromQuery || "");
    const [inputPin, setInputPin] = useState("");

    const shouldConnect = !!pin || admin;

    const { messages, sendMessage } = useWebSocket(
        "ws://localhost:8081/api/game-room",
        shouldConnect,
    );

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        sendMessage({ message: input });
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
        <div className="w-3/5 sm:w-2/5 h-3/5 border-[2px] border-black flex flex-col justify-between items-center bg-yellow-200">
            <h2>Your Game PIN: {pinFromQuery || inputPin}</h2>
            <h1>Real-time Chat</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg.message}</div>
                ))}
            </div>
        </div>
    );
}
