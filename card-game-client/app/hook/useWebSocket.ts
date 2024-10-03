"use client";

import { useEffect, useState } from "react";

type Message = {
    event: string;
    data: string;
};


const useWebSocket = (url: string, shouldConnect: boolean) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [answers, setAnswers] = useState<Message[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        if (!shouldConnect) return;

        const socket = new WebSocket(url);
        setWs(socket);

        socket.onopen = () => {
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            const data: Message = JSON.parse(event.data);          
            if (data.event === "answerClick") {              
              setAnswers((prevAnswers) => [...prevAnswers, { event: "answerClick", data: data.data }]);
            } else {
              setMessages((prevMessages) => [...prevMessages, data]);
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
            setIsConnected(false);
            console.log("WebSocket closed");
        };

        return () => {
            socket.close();
        };
    }, [url, shouldConnect]);

    const sendMessage = (message: Message) => {
        if (ws && isConnected) {          
            ws.send(JSON.stringify(message));
        }
    };

    return { messages, answers ,sendMessage, isConnected };
};

export default useWebSocket;
