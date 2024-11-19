import { useState, useEffect, useRef } from "react";
import { MessageCircleMore, X } from "lucide-react";
import { cropQAPIs } from "../Utils/cropQAPIs";
import { Send } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isResponseComplete, setIsResponseComplete] = useState(true);
  const [botTypingMessage, setBotTypingMessage] = useState("");
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setQuestion("");
    setMessages([]);
    setLoading(false);
    setIsResponseComplete(true);
  };

  const displayTypingAnimation = (text) => {
    const words = text.split(" ");
    let currentMessage = "";

    words.forEach((word, index) => {
      setTimeout(() => {
        currentMessage += `${word} `;
        setBotTypingMessage(currentMessage.trim());
        if (index === words.length - 1) {
          setIsResponseComplete(true);
          setMessages((prev) => [
            ...prev,
            { type: "bot", text: currentMessage.trim() },
          ]);
          setBotTypingMessage("");
        }
      }, index * 200); 
    });
  };

  const sendQuestion = async () => {
    if (!question.trim() || !isResponseComplete) return;

    const userMessage = { type: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    setIsResponseComplete(false);

    const payload = {
      question,
      model: "llama-3.1-70b-versatile",
    };

    try {
      const response = await cropQAPIs.chatBot(payload);
      if (response.status === 200) {
        const answer = response.data.answer || "Something went wrong! Please try again.";
        displayTypingAnimation(answer.trim() || "Sorry, I didn't understand that.");
      } else {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: "Sorry, no response received." },
        ]);
        setIsResponseComplete(true);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "An error occurred. Please try again later." },
      ]);
      setIsResponseComplete(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendQuestion();
    }
  };

  useEffect(() => {
    if (isResponseComplete && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isResponseComplete]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, botTypingMessage]);

  return (
    <div>
      <div
        className={`fixed bottom-5 right-5 p-2 lg:p-3 bg-gradient-to-r from-[#6bc83f] to-[#2d511c] rounded-full cursor-pointer hover:from-[#2d511c] hover:to-[#6bc83f] transition-colors duration-300 z-50 ${
          isOpen ? "hidden" : "block"
        }`}
        onClick={toggleChatbot}
      >
        <MessageCircleMore color="white" size={32} />
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={toggleChatbot}
        >
          <div
            className="bg-neutral-200 dark:bg-neutral-900 opacity-90 rounded-lg shadow-lg w-full sm:w-[80vw] md:w-[60vw] lg:w-[60vh] lg:h-[60vh] max-h-[80vh] m-4 lg:fixed lg:bottom-0 lg:right-0 lg:transform-none flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-neutral-700 p-4">
              <h1 className="text-md font-semibold hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r from-[#6bc83f] to-[#2d511c]">
                CropQ's Chatbot
              </h1>
              <X size={24} className="cursor-pointer" onClick={toggleChatbot} />
            </div>
            <div className="flex-1 p-4 overflow-y-auto" ref={chatContainerRef}>
              <div className="mb-2 text-sm text-left">
                Hello User! I'm here to assist you with your queries. Feel free to ask me anything related to <span className="text-custom-green">Agriculture.</span>
              </div>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-2 text-sm ${
                    message.type === "user"
                      ? "text-right text-custom-green"
                      : "text-left"
                  }`}
                >
                  {message.text}
                </div>
              ))}
              {botTypingMessage && (
                <div className="text-left text-sm mb-4 animate-pulse">
                  {botTypingMessage}
                </div>
              )}
              {loading && !botTypingMessage && (
                <div className="text-left text-sm text-custom-green mb-4 animate-pulse">
                  Typing...
                </div>
              )}
            </div>
            <div className="p-4 border-t border-neutral-700 flex">
              <div className="relative w-full">
                <input
                  type="text"
                  className="w-full p-2 pr-10 rounded bg-neutral-300 dark:bg-neutral-800 placeholder:text-neutral-500 focus:outline-none focus:border-none"
                  placeholder="Ask me anything about Agriculture..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!isResponseComplete}
                  ref={inputRef}
                />
                <Send
                  size={20}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-neutral-500 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
