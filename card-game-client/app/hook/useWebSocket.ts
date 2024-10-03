"use client";

import { useEffect, useState } from "react";

type ChatMessage = {
    message: string;
};

const useWebSocket = (url: string, shouldConnect: boolean) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
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
            const data: ChatMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data]);
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

    const sendMessage = (message: ChatMessage) => {
        if (ws && isConnected) {
            ws.send(JSON.stringify(message.message));
        }
    };

    return { messages, sendMessage, isConnected };
};

export default useWebSocket;
