//For my logo, the light and dark toggle, and the Clerk User button.

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-700 mt-16 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          

          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {currentYear} Syllabus AI. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 space-x-4">
            <a 
              href="https://github.com/LNjengaTech" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition"
            >
              Source Code (GitHub)
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}