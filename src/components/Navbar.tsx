"use client";

import { UserButton, SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import ThemeToggle from './ThemeToggle';
import { Crown } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user } = useUser();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    async function checkPremium() {
      if (!user) return;
      
      try {
        const response = await fetch('/api/subscription/status');
        const data = await response.json();
        setIsPremium(data.isPremium || false);
      } catch (error) {
        console.error('Failed to fetch premium status:', error);
      }
    }
    
    checkPremium();
  }, [user]);

  return (
    <nav className="flex items-center justify-between px-6 py-6 border-b dark:border-b-gray-400 bg-gray-100 dark:bg-gray-950 text-foreground">
      <div className="text-xl font-bold tracking-tight text-black dark:text-gray-100">
        Syllabus<span className="text-blue-600">AI</span>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <SignedIn>
          <a href="/dashboard" className="text-sm font-medium hover:underline  text-black dark:text-gray-100">
            Dashboard
          </a>
          {isPremium && (
            <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-semibold">
              <Crown className="w-3 h-3" />
              PRO
            </div>
          )}
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Sign In</button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
}
