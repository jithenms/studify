"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/components/chat-message";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LucideArrowUp, Loader2, Square, ZapIcon } from "lucide-react";
import { User } from "@auth0/nextjs-auth0/types";
import { generateResponse } from "@/app/actions";
import { Message } from "@/lib/types";

export default function ChatClient({
  user,
  prompts,
  initialMessages,
}: {
  user: User;
  prompts: { title: string; description: string }[];
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);

    const userMsg: Message = {
      role: "You",
      content: query,
      resources: [],
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await generateResponse(query, user.user_id, [
        ...messages,
        userMsg,
      ]);

      setMessages((prev) => [
        ...prev,
        {
          role: "AI",
          content: response.message!,
          resources: response.documents.map((doc) => ({
            title: doc.name,
            similarity: doc.similarity,
          })),
        },
      ]);

      setQuery("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 pt-0">
      <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        <div className="flex flex-col gap-2 p-4  rounded-xl">
          <h1 className="text-xl font-semibold text-gray-800">
            Welcome, {user?.name}!
          </h1>
          <div className="flex gap-2 items-center">
            <ZapIcon className="text-blue-500 w-5 h-5" />
            <p className="text-sm text-gray-500">Suggested Prompts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {prompts.map((prompt, index) => (
            <Card
              key={index}
              className="cursor-pointer transition-colors"
              onClick={() => setQuery(prompt.title + " " + prompt.description)}
            >
              <CardHeader>
                <CardTitle className="text-blue-600">{prompt.title}</CardTitle>
                <CardDescription>{prompt.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto h-[50vh] p-2">
          {messages.map((message, index) => (
            <ChatMessage key={index} userId={user.user_id} message={message} />
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-2 text-gray-500 animate-pulse">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              <span>AI is generating your answer...</span>
            </div>
          )}

          <div ref={messagesRef} />
        </div>
      </div>

      <div className="flex h-fit relative items-center">
        <form className="flex w-full" onSubmit={handleSubmit}>
          <Input
            className={`mt-auto pr-10 rounded-3xl ${
              loading ? "bg-gray-100 text-gray-400" : "bg-white"
            }`}
            name="message"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Send a Message..."
            disabled={loading}
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
            type="submit"
            disabled={loading}
          >
            {!loading ? (
              <LucideArrowUp className="text-white w-4 h-4 m-1" />
            ) : (
              // todo handle cancelling
              <Square className="text-white w-4 h-4 m-1 animate-pulse" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
