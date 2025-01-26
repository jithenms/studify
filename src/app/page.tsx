import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <div className="flex items-center flex-row gap-2">
          <Link className="flex items-center justify-center" href="#">
            <span className="sr-only">Studify</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </Link>
          <p className="text-xl ">Studify</p>
        </div>
      </header>
      <main className="flex-1 flex-col items-center justify-center">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container max-w-4xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Turn your study materials into actionable learning tools in
                  seconds.
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Upload your notes, lectures, and problem sets. Get tailored
                  human-like explanations all designed to help you succeed.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="flex space-x-2">
                  <div className="flex w-full justify-center gap-4">
                    <Link
                      className={buttonVariants({ variant: "outline" })}
                      href="/api/auth/login"
                    >
                      Login
                    </Link>
                    <Link className={buttonVariants()} href="/api/auth/login">
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="w-full mx-auto container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 mb-2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <h2 className="text-xl font-bold">Instant Answers</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Get precise explanations for any concept, question, or topic
                    from your notes and uploaded materials.
                  </p>
                </div>
              </Card>
              <Card>
                <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 mb-2"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                  <h2 className="text-xl font-bold">Smart Summaries</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Quickly condense your handwritten or lecture notes into
                    clear, concise key points.
                  </p>
                </div>
              </Card>
              <Card>
                <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 mb-2"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  <h2 className="text-xl font-bold">
                    Personalized Study Support
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Tailored responses and insights that adapt to your unique
                    study needs and materials.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Created by Jithen Shriyan.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="https://www.linkedin.com/in/jithenms/"
          >
            GitHub
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="https://github.com/jithenms"
          >
            LinkedIn
          </Link>
        </nav>
      </footer>
    </div>
  );
}
