import { getPresignedUrl } from "@/app/actions";
import OpenAI from "openai";
import { Message } from "@/types";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const analyzeNote = async (userId: number, fileName: string) => {
  const url = await getPresignedUrl(userId, fileName);
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: "You are an AI assistant designed to analyze and extract meaningful information from handwritten and typed lecture notes, homework, and more in an educational setting. Your task is to interpret the content of the image or pdf and provide a clear understanding of the notes. You will always respond in markdown format with appropriate spacing, headings, bullet points, and inline code formatting to ensure the output is properly structured and easy to read. You will be penalized for not doing so. Your responses should reflect the same structure as the original content while improving clarity and readability.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please interpret the content of this note.",
          },
          {
            type: "image_url",
            image_url: {
              url: url,
            },
          },
        ],
      },
    ],
  });
  return response.choices[0].message?.content || "";
};

export const answerQuestion = async (question: string, context: Message[]) => {
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are an AI study assistant designed to help users understand concepts, clarify doubts, and summarize topics using provided resources. Use the context provided below to respond concisely and accurately. Respond in markdown format with headings, bullet points, and inline `code` formatting. Include references when available.",
    },
    ...(context.map((msg) => ({
      role: msg.role === "You" ? "user" : "assistant",
      content: msg.content,
    })) as OpenAI.ChatCompletionMessageParam[]),
    {
      role: "user",
      content: question,
    },
  ];

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  return response.choices[0].message?.content || "";
};

export const generateEmbedding = async (input: string) => {
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input,
    encoding_format: "float",
  });
  return response.data[0].embedding;
};
