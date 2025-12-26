"use client";
import { useState } from "react";

interface FlashcardProps {
  front: string;
  back: string;
}

export default function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group h-64 w-full perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative h-full w-full transition-all duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/*front side */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center  bg-gray-100 dark:bg-gray-900 text-slate-700 dark:text-gray-100 border-2 border-blue-100 rounded-xl shadow-sm backface-hidden">
          <span className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">Question</span>
          <p className="text-lg font-medium text-gray-100">{front}</p>
          <p className="absolute bottom-4 text-xs text-slate-400">Click to flip</p>
        </div>

        {/*back side */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gray-100 dark:bg-gray-800 text-slate-700 dark:text-gray-100 border-blue-100 border-2 rounded-xl shadow-sm backface-hidden rotate-y-180">
          <span className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Answer</span>
          <p className="text-lg text-gray-400">{back}</p>
        </div>

      </div>
    </div>
  );
}