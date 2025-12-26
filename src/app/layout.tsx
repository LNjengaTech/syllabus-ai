//includes the clerk provider, theme provider and sets  up global styles and fontss
import { ThemeProvider } from "@/src/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Syllabus AI",
  description: "Convert your syllabus into a study guide",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased transition-colors duration-300`}>
          <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
        >
          {children}
        </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}