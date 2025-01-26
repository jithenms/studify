import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { FileText, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "./ui/badge";
import ReactMarkdown from "react-markdown";

export interface Message {
  role: "You" | "AI";
  content: string;
  resources?: {
    title: string;
    url: string;
    similarity: number;
  }[];
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`flex gap-3 p-4 ${
        message.role == "You" ? "ml-auto" : "mr-auto"
      }`}
    >
      <Avatar className="h-8 w-8">
        <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xs font-medium">
          {message.role === "You" ? "You" : "AI"}
        </div>
      </Avatar>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-4 gap-2">
          {message?.resources?.map((resource, index) => (
            <Card
              key={index}
              className="p-2 cursor-pointer"
              onClick={() => window.open(resource.url)}
            >
              <FileText className="w-4 h-4" />
              <p className="text-xs text-primary font-medium">
                {resource.title}
              </p>
              <div
                className={`text-xs rounded-3xl ${
                  resource.similarity > 0.8
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {(resource.similarity * 100).toFixed(2)}% match
              </div>
            </Card>
          ))}
        </div>
        <Card
          className={`flex-1 ${
            message.role == "You"
              ? "border-none shadow-none"
              : "border-none shadow-none"
          }`}
        >
          <div className="prose prose-sm max-w-none">
            <div className="space-y-4 text-sm text-muted-foreground break-normal">
              {message.role === "AI" ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              ) : (
                message.content
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
