import { BookOpen } from "lucide-react";
import FAQ from "@/components/FAQ";
import Navbar from "./Navbar";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 rounded-full bg-navy-50 dark:bg-navy-800/50 mb-4">
            <BookOpen className="w-8 h-8 text-navy-600 dark:text-cream-100" />
          </div>
          <h1 className="text-3xl font-bold text-navy-800 dark:text-cream-50 mb-4">
            About Ask the Bible
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Ask the Bible is an AI-powered tool designed to help you explore and understand 
            the Bible through intelligent verse recommendations based on your questions.
          </p>
        </div>

        {/* Divider */}
        <div className="my-12 border-t border-gray-200 dark:border-gray-800" />

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-navy-800 dark:text-cream-50 mb-6">
            Frequently Asked Questions
          </h2>
          <FAQ />
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-12">
          <p>
            Made with ❤️ for Bible study and spiritual growth.
            <br />
            All glory to God.
          </p>
        </div>
      </main>
    </div>
  );
};

export default About;
