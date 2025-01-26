import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const analyzeNote = async (image_url: string) => {
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
              url: image_url,
            },
          },
        ],
      },
    ],
  });
  return response.choices[0].message?.content || "";
};

export const answerQuestion = async (question: string, context: string) => {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an AI study assistant designed to help users understand concepts, clarify doubts, and summarize topics using provided resources. Use the context provided below to respond concisely and accurately. You will always respond in markdown format with appropriate spacing, headings, bullet points, and inline code formatting to ensure the output is properly structured and easy to read. You will be penalized for not doing so.",
      },
      {
        role: "assistant",
        content: `Relevant Study Resources:\n\n${context}`,
      },
      {
        role: "user",
        content: question,
      },
    ],
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
