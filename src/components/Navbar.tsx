//For my logo, the light and dark toggle, and the Clerk User button.

import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
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
