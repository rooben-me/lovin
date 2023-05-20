import React, { useState, useEffect } from "react";
import Gauge from "./Gauge";

const GenerateChat: React.FC = () => {
  const [loveMessages, setLoveMessages] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [stats, setStats] = useState(null);

  const handleInputChange = (event) => {
    setLoveMessages(event.target.value);
  };

  const handleInputSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: loveMessages }),
    });

    const json = await response.json();

    setStats(json);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {!stats ? (
        <div className="bg-white p-6 rounded shadow w-full max-w-2xl">
          <form onSubmit={handleInputSubmit} className="flex flex-col">
            <textarea
              value={loveMessages}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded mb-4 resize-none"
              placeholder="Type your message here..."
              rows={10}
            />
            <button
              type="submit"
              className={`bg-indigo-500 text-white px-4 py-2 rounded ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-600"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Send"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow w-full max-w-2xl">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Gauge
              label="Communication Style"
              value={stats.communication_style_guage_value}
            />
            <Gauge
              label="Emotional Tone"
              value={stats.emotional_tone_guage_value}
            />
            <Gauge
              label="Shared Interests"
              value={stats.shared_interests_guage_value}
            />
            <Gauge
              label="Compatibility of Values"
              value={stats.compatibility_of_values_guage_value}
            />
          </div>
          <div className="bg-indigo-100 p-4 rounded">
            <h3 className="text-indigo-500 font-bold mb-2">Tips:</h3>
            <p>{stats.tips}</p>
          </div>
          <button
            onClick={() => setStats(null)}
            className="bg-indigo-500 text-white px-4 py-2 rounded mt-4 hover:bg-indigo-600"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerateChat;
