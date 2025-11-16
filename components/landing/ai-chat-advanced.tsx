"use client";

import { useState, useRef, useEffect } from "react";
import { SimpleInlineInput } from "./simple-inline-input";
import { ChatTag } from "./chat-tag";

interface Tag {
  id: string;
  type: "subject" | "grade" | "curriculum" | "location" | "schedule";
  value: string;
  position: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  tags: Tag[];
}

export function AiChatAdvanced() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (text: string, tags: Tag[]) => {
    if (isLoading) return;

    let apiText = text.trim();
    if (tags.length > 0) {
      const tagContext = tags
        .map((tag) => `${tag.type}:${tag.value}`)
        .join(", ");
      apiText = `${apiText}\n[搜尋條件: ${tagContext}]`;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
      tags: [...tags],
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsExpanded(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => {
              let content = m.text;
              if (m.tags.length > 0) {
                const tagContext = m.tags.map(t => `${t.type}:${t.value}`).join(", ");
                content = `${content}\n[搜尋條件: ${tagContext}]`;
              }
              return { role: m.role, content };
            }),
            {
              role: "user",
              content: apiText,
            },
          ],
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("0:")) {
              const text = line.slice(3, -1);
              assistantContent += text;
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage?.role === "assistant") {
                  lastMessage.text = assistantContent;
                } else {
                  newMessages.push({
                    id: Date.now().toString(),
                    role: "assistant",
                    text: assistantContent,
                    tags: [],
                  });
                }
                return [...newMessages];
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          text: "抱歉，發生了錯誤。請稍後再試。",
          tags: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Simple Inline Input */}
      <SimpleInlineInput onSubmit={handleSubmit} disabled={isLoading} />

      {/* Chat Messages */}
      {isExpanded && messages.length > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div>
              <h3 className="font-semibold text-gray-900">AI 助理</h3>
              <p className="text-xs text-gray-500">為您尋找最適合的教師</p>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <div className="h-96 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {/* Render tags */}
                  {message.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {message.tags.map((tag) => (
                        <ChatTag key={tag.id} type={tag.type} value={tag.value} />
                      ))}
                    </div>
                  )}
                  {/* Render text */}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}

