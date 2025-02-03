const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-4 border-t border-gray-200 dark:border-navy-800 bg-background/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground px-4">
        <div className="text-center sm:text-left">
          © {currentYear} Ask the Bible. All rights reserved.
        </div>
        <div className="flex items-center gap-1 mt-2 sm:mt-0 text-center sm:text-right">
          Made with <span className="text-red-500 animate-pulse">❤</span> by{" "}
          <a 
            href="https://github.com/kaycee004" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-navy-600 dark:text-cream-200 hover:text-navy-800 dark:hover:text-cream-100 transition-colors"
          >
            Kayc
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 