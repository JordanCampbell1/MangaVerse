import React, { useState, useEffect, useRef } from "react";

// Basic AI Assistant Chat UI, dummy responses for demo
export default function MangaAiSearchPage() {
  const [messages, setMessages] = useState([
    {
      id: 0,
      text: "Hi! Ask me anything about manga or ask for recommendations.",
      sender: "ai",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!inputText.trim()) return;
    const userMsg = {
      id: messages.length,
      text: inputText.trim(),
      sender: "user",
    };
    setMessages([...messages, userMsg]);
    setInputText("");

    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponse = generateDummyAIResponse(inputText.trim());
      const aiMsg = {
        id: messages.length + 1,
        text: aiResponse,
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1500);
  }

  function generateDummyAIResponse(input) {
    // Simple keyword-based dummy responses, replace with real AI integration
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("recommend")) {
      return "If you like action and adventure, I recommend 'One Piece' or 'Naruto'.";
    }
    if (lowerInput.includes("plot")) {
      return "Manga plots usually revolve around character growth, fighting, and friendship.";
    }
    if (lowerInput.includes("help")) {
      return "Sure! You can ask me for manga recommendations, genres, or latest updates.";
    }
    return "That's interesting! Could you please elaborate more about what you want to know?";
  }

  function onKeyDownHandler(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <section className="max-w-3xl mx-auto flex flex-col h-[70vh] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold p-4 border-b border-gray-300 dark:border-gray-700">
        Manga AI Assistant
      </h1>
      <div
        className="flex-grow overflow-y-auto p-4 space-y-4"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map(({ id, text, sender }) => (
          <div
            key={id}
            className={`max-w-[80%] p-3 rounded-lg break-words whitespace-pre-wrap ${
              sender === "user"
                ? "bg-indigo-600 text-white self-end"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 self-start"
            }`}
            role="article"
            aria-label={sender === "user" ? "User message" : "AI response"}
          >
            {text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="border-t border-gray-300 dark:border-gray-700 p-4 flex gap-2"
      >
        <textarea
          aria-label="Chat input"
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={onKeyDownHandler}
          className="resize-none flex-grow rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Ask me about manga..."
        />
        <button
          type="submit"
          aria-label="Send message"
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 rounded-md transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Send
        </button>
      </form>
    </section>
  );
}