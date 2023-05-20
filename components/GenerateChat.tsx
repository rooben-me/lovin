import React, { useState, useEffect } from "react";

type ChatMessage = {
  sender: "user" | "assistant";
  content: string;
};

const GenerateChat: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleInputSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userInput.trim() === "") return;

    setIsLoading(true);
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", content: userInput },
    ]);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: userInput }),
    });

    const reader = response.body?.getReader();

    if (reader) {
      const decoder = new TextDecoder("utf-8");
      let result;
      let assistantMessage = "";

      while (true) {
        result = await reader.read();
        if (result.done) break;
        assistantMessage += decoder.decode(result.value);
      }

      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "assistant", content: assistantMessage },
      ]);
    }

    setIsLoading(false);
    setUserInput("");
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Chat:</h2>
      <div className="bg-gray-100 p-4 rounded mb-4 h-64 overflow-y-auto">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${
              message.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {message.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleInputSubmit} className="flex">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className="flex-grow border border-gray-300 p-2 rounded mr-2"
          placeholder="Type your message here..."
        />
        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default GenerateChat;
