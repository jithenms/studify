import { getPresignedUrl } from "@/app/actions";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Message } from "@/types";
import { FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  userId: number;
  message: Message;
}

export function ChatMessage({ userId, message }: ChatMessageProps) {
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
              onClick={async (e) => {
                e.preventDefault();
                const fileName: string = resource.title;
                const url = await getPresignedUrl(userId, fileName);
                window.open(url, "_blank");
              }}
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
