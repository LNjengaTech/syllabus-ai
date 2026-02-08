//client component

'use client';

import { useState } from 'react';
import Navbar from '@/src/components/Navbar';
import UploadZone from '@/src/components/UploadZone';
import ChatInterface from '@/src/components/ChatInterface';
import Flashcard from '@/src/components/Flashcard';
import { exportToPdf } from '@/src/lib/export';
import { Download, Sparkles, FileText, LayoutDashboard } from 'lucide-react';
import Footer from '@/src/components/Footer';

export default function Dashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [studyResult, setStudyResult] = useState('');
  const [activeType, setActiveType] = useState<'flashcards' | 'summary' | null>(null);

  const handleGenerate = async (type: 'flashcards' | 'summary') => {
  setIsGenerating(true);
  setActiveType(type);
  
  try {
    const res = await fetch('/api/generateFlashcard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    
    const data = await res.json();

    //ff the data was actually generated, ignore the 404/Processing status
    if (data.result) {
      setStudyResult(data.result);
      return; 
    }

    //only alert if it's a 404 AND no result yet
    if (res.status === 404) {
      alert("AI is still indexing the newest chunks. Try again in 5 seconds!");
    } else if (data.error) {
      throw new Error(data.error);
    }

  } catch (err) {
    console.error("Generation Error:", err);
    //NO alert if it's just a minor timeout but we have data
  } finally {
    setIsGenerating(false);
  }
};

  const renderStudyContent = () => {
    if (!studyResult) return null;

    if (activeType === 'flashcards') {

      //split by '---' and filter out any blocks that don't contain "Back" or "Answer"
      //remove the typical "Here are the flashcards..." intro text.
      const cardData = studyResult.split(/---|\n\n/).filter((c) => c.toLowerCase().includes('back:') || c.toLowerCase().includes('answer:'));

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="study-content">
          {cardData.map((card, index) => {
            //extract content after "Front:" and "Back:" labels
            const frontMatch = card.match(/(?:Front:|Question:)\s*(.*?)(?=Back:|Answer:|$)/is);
            const backMatch = card.match(/(?:Back:|Answer:)\s*(.*)/is);

            const front = frontMatch?.[1]?.trim() || 'No question found';
            const back = backMatch?.[1]?.trim() || 'No answer found';

            return <Flashcard key={index} front={front} back={back} />;
          })}
        </div>
      );
    }
    return (
      <div id="study-content" className="bg-card p-8 rounded-xl border shadow-sm prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-foreground">
        {studyResult}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-black dark:text-gray-100">
      <Navbar />

      <main className="max-w-6xl mx-auto py-12 px-6  bg-gray-100 dark:bg-gray-950 text-black dark:text-gray-100" >
        {/* header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <LayoutDashboard className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Study Command Center</h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-bold mx-auto">Upload your PDF and let a specialised AI build you a custom study plan.</p>
        </header>

        {/*upload area */}
        <div className="mb-12">
          <UploadZone />
        </div>

        {/*action controls */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <button
            onClick={() => handleGenerate('flashcards')}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50"
          >
            <Sparkles size={20} />
            {isGenerating && activeType === 'flashcards' ? 'AI is thinking...' : 'Generate Flashcards'}
          </button>

          <button
            onClick={() => handleGenerate('summary')}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50"
          >
            <FileText size={20} />
            {isGenerating && activeType === 'summary' ? 'Writing summary...' : 'Get Quick Summary'}
          </button>
        </div>

        {/*dynamic result-area*/}
        {studyResult && (
          <section className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex justify-between items-end mb-6 border-b border-muted pb-4">
              <div>
                <h2 className="text-2xl font-bold capitalize text-foreground">{activeType}</h2>
                <p className="text-sm text-muted-foreground">Generated based on your latest upload</p>
              </div>
              <button
                onClick={() => exportToPdf('study-content', `My-${activeType}`)}
                className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium transition"
              >
                <Download size={16} /> Export PDF
              </button>
            </div>

            {renderStudyContent()}
          </section>
        )}

        {/*chat section */}
        <section className="mt-16 pt-16 border-t border-muted">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Stuck on a specific detail?</h2>
            <p className="text-muted-foreground">Ask the syllabus directly below.</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <ChatInterface />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
