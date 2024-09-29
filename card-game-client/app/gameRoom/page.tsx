"use client";

import React, { useState } from "react";
import useWebSocket from "../hook/useWebSocket";

export default function GameRoom() {
  // [TODO] This should be changed after deployment -> Might be set as an environment variable in next.config.js?
  const {messages, sendMessage} = useWebSocket("ws://localhost:8081/api/game-room");
  const [input, setInput] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage({ message: input });
    setInput("");
  }



  return (
    <div className="w-3/5 sm:w-2/5 h-3/5 border-[2px] border-black flex flex-col justify-between items-center bg-yellow-200">
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