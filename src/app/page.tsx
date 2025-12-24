import Navbar from "@/src/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-20 text-center px-4">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">
          Stop drowning in PDFs. <br />
          <span className="text-blue-600">Start studying smarter.</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Upload your syllabus or lecture notes and let AI generate practice 
          quizzes, flashcards, and summaries tailored to your course.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
            Get Started for Free
          </button>
        </div>
      </div>
    </main>
  );
}