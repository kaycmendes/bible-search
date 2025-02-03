import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white/80 dark:bg-navy-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-navy-700">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Ask the Bible. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link 
              href="/privacy-policy"
              className="text-gray-600 hover:text-navy-600 dark:text-gray-400 dark:hover:text-cream-200 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms"
              className="text-gray-600 hover:text-navy-600 dark:text-gray-400 dark:hover:text-cream-200 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 