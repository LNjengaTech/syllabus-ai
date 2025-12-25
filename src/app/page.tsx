import Navbar from "@/src/components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    // 1. Set the wrapper to flex and full height
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      {/* 2. Set the content area to 'flex-grow' to push the footer down */}
      <main className="grow flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">
            Stop drowning in PDFs. <br />
            <span className="text-blue-600">Start studying smarter.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Upload your syllabus or lecture notes and let AI generate practice 
            quizzes, flashcards, and summaries tailored to your course.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
                Get Started for Free
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* 3. The footer will now sit naturally at the very bottom */}
      <Footer />
    </div>
  );
}