import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, X, MessageSquare, RefreshCcwDot } from "lucide-react";
import { ChatMessage } from "../types";
import { askAi, chatHistory, refreshSession } from "../api/api";

const AIChat: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = localStorage.getItem("sessionId");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      article_id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      console.log(message,sessionId)
      const { data } = await askAi(sessionId!, message);

      const aiMessage: ChatMessage = {
        article_id: Date.now().toString() + "_bot",
        content: data?.data || "Sorry, I could not understand that.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response", error);
      const errorMessage: ChatMessage = {
        article_id: Date.now().toString() + "_error",
        content: "An error occurred. Please try again later.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const refreshChat = async () => {
    if(!sessionId) return alert("Refresh the page and retry")
    try {
      await refreshSession(sessionId!);
      alert("Chat refreshed and deleted");
      localStorage.removeItem("sessionId");
      setChatMessages([])
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await chatHistory(sessionId!);
        if (data.data) {
          // Flatten the nested array and map it to ChatMessage[]
          const transformedMessages: ChatMessage[] = data.data
            .flat()
            .map((msg: any, idx: number) => ({
              article_id: `${Date.now()}_${idx}`,
              content: msg.message,
              sender: msg.role === "user" ? "user" : "bot",
              timestamp: new Date().toISOString(),
            }));
          setChatMessages(transformedMessages);
        }
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-800 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md h-[400px] w-[90%] md:w-[400px] flex flex-col fixed bottom-6 right-6 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Discuss with AI
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Ask questions or get insights about the latest news articles.
              </p>
            </div>
            <div className="flex items-center flex-col gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 dark:text-gray-300 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={() => refreshChat()}
                className="text-gray-600 dark:text-gray-300 hover:text-red-500"
              >
                <RefreshCcwDot className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="mx-auto h-12 w-12 text-blue-800 dark:text-blue-400 mb-3" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  Start a conversation
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-xs mx-auto">
                  Ask me about the news, request context, or explore related
                  topics.
                </p>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 
                      ${
                        msg.sender === "user"
                          ? "bg-blue-700 text-white rounded-tr-none"
                          : "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-tl-none"
                      }`}
                  >
                    <div className="flex items-center mb-1">
                      {msg.sender === "bot" ? (
                        <Bot className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <User className="h-4 w-4 mr-1 text-white" />
                      )}
                      <span className="text-xs opacity-75">
                        {msg.sender === "bot" ? "AI Assistant" : "You"}
                      </span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-tl-none">
                  <div className="flex items-center mb-1">
                    <Bot className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs opacity-75">AI Assistant</span>
                  </div>
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce"
                      style={{ animationDelay: "600ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-gray-200 dark:border-slate-700 p-4"
          >
            <div className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about the news..."
                className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!message.trim() || isTyping}
                className="px-4 py-2 bg-blue-800 text-white rounded-r-lg hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-950 transition-colors duration-200"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChat;
