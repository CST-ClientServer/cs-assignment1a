"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Message = {
    event: string;
    data: string;
};

const useWebSocket = (
    url: string,
    shouldConnect: boolean,
    setCurrentSlide: (slide: number) => void,
    setShowAnswersChart: (show: boolean) => void,
) => {
    const router = useRouter();
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
            switch (data.event) {
                case "answerClick":
                    setAnswers((prevAnswers) => [
                        ...prevAnswers,
                        { event: "answerClick", data: data.data },
                    ]);
                    break;
                case "slideChange":
                    setCurrentSlide(parseInt(data.data));
                    setShowAnswersChart(false);
                    setAnswers([]);
                    break;
                case "redirectToDashboard":
                    router.push("/dashboard");
                    break;
                case "showAnswersModal":
                    if (data.data === "show") {
                        setShowAnswersChart(true);
                    }
                    break;
                default:
                    setMessages((prevMessages) => [...prevMessages, data]);
                    break;
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
    }, [url, shouldConnect, setCurrentSlide, setShowAnswersChart, router]);

    const sendMessage = (message: Message) => {
        if (ws && isConnected) {
            ws.send(JSON.stringify(message));
        }
    };

    return { messages, answers, sendMessage, isConnected };
};

export default useWebSocket;
