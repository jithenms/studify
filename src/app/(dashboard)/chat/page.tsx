"use client";

import { ChatMessage, Message } from "@/components/chat-message";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LucideArrowUp, Square, ZapIcon } from "lucide-react";
import { generateResponse } from "../../actions";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";
import { useFormStatus } from "react-dom";

const cards = [
  {
    title: "Can you summarize the key idea",
    description: "from this section on [concept/topic] in your own words?",
  },
  {
    title: "What’s the most important takeaway",
    description: "from this lecture on [concept/topic]?",
  },
  {
    title: "How does [concept/topic] connect with",
    description:
      "what you've learned previously (e.g., Calculus, Linear Algebra, etc.)?",
  },
];

export default function Page() {
  const { pending } = useFormStatus();

  const [query, setQuery] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([]);

  const { user, isLoading, error } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex flex-1 flex-col gap-4 pt-0">
      <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        <div className="flex flex-col gap-2 p-4 bg-white rounded-xl">
          <h1 className="text-xl font-semibold text-gray-800">
            Welcome, {user?.name}!
          </h1>
          <div className="flex gap-2 items-center">
            <ZapIcon className="text-gray-500 w-4 h-4" />
            <p className="text-sm text-gray-500">Suggested Prompts</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((card, index) => (
            <Card
              className="cursor-pointer"
              onClick={() => setQuery(card.title + " " + card.description)}
              key={index}
            >
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="flex overflow-y-auto h-[50vh] scroll flex-col">
          {messages?.map((message, index) => (
            <ChatMessage
              key={index}
              message={{
                role: message.role,
                content: message.content,
                resources: message.resources,
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex h-fit relative items-center">
        <form
          className="flex w-full"
          action={async (e) => {
            const response = await generateResponse(
              e.get("message") as string,
              user?.user_id as number
            );
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                role: "You",
                content: e.get("message") as string,
                resources: [],
              },
              {
                role: "AI",
                content: response.message!,
                resources: response.documents.map((resource) => ({
                  title: resource.name,
                  url: resource.url,
                  similarity: resource.similarity,
                })),
              },
            ]);
          }}
        >
          <Input
            className="mt-auto pr-10 rounded-3xl"
            name="message"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Send a Message"
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-2xl bg-gray-300"
            type="submit"
            disabled={pending}
          >
            {!pending ? (
              <LucideArrowUp className="cursor-pointer text-white w-3 h-3 m-1" />
            ) : (
              <Square className="cursor-pointer bg-white text-white w-3 h-3 m-1.5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
