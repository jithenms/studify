import ChatClient from "@/components/chat-client";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

const prompts = [
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

export default async function Page() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <ChatClient user={session.user} prompts={prompts} initialMessages={[]} />
  );
}
