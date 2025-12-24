//For my logo, the light and dark toggle, and the Clerk User button.

import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-background text-foreground">
      <div className="text-xl font-bold tracking-tight">
        Syllabus<span className="text-blue-600">AI</span>
      </div>
      
      <div className="flex items-center gap-4">
        <SignedIn>
          <a href="/dashboard" className="text-sm font-medium hover:underline">Dashboard</a>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
}