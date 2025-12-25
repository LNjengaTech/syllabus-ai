"use client";

import Navbar from '@/src/components/Navbar';
import UploadZone from '@/src/components/UploadZone';
import ChatInterface from '@/src/components/ChatInterface';
import {use, useState} from 'react';

export default function Dashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [studyResult, setStudyResult] = useState('');

  const handleGenerate = async (type: 'flashcards' | 'summary') => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      setStudyResult(data.result);
    } catch (err) {
      alert('Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto py-12 px-4">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold">Your Study Center</h1>
          <p className="text-muted-foreground">Upload your course materials to generate guides</p>
        </header>

        <section>

          <UploadZone />

          <div className="flex gap-4 mt-8 mb-8 justify-center">
            <button onClick={() => handleGenerate('flashcards')} disabled={isGenerating} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50">
              {isGenerating ? 'Generating...' : 'Generate Flashcards'}
            </button>
            <button onClick={() => handleGenerate('summary')} disabled={isGenerating} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">
              {isGenerating ? 'Generating...' : 'Get Quick Summary'}
            </button>
          </div>

          {studyResult && (
            <div className="max-w-2xl mx-auto mb-10 p-6 bg-card border rounded-xl whitespace-pre-wrap">
              <h2 className="text-xl font-bold mb-4 underline">Your Study Material</h2>
              {studyResult}
            </div>
          )}


          <ChatInterface />

        </section>
      </div>
    </div>
  );
}
