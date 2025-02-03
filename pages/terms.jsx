import Navbar from "./Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, BookOpen, UserCheck, ShieldAlert, Copyright, FileWarning, RefreshCw, Mail } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <main className="container max-w-4xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-navy-50 dark:bg-navy-800/50 mb-4">
              <FileText className="w-8 h-8 text-navy-600 dark:text-cream-100" />
            </div>
            <h1 className="text-3xl font-bold text-navy-800 dark:text-cream-50 mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <div className="prose dark:prose-invert max-w-none space-y-8">
            <section className="bg-white dark:bg-navy-800/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-navy-600 dark:text-cream-100" />
                <h2 className="text-2xl font-semibold text-navy-800 dark:text-cream-50 m-0">1. Acceptance of Terms</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                By accessing or using Ask the Bible ("the Service"), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section className="bg-white dark:bg-navy-800/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="w-6 h-6 text-navy-600 dark:text-cream-100" />
                <h2 className="text-2xl font-semibold text-navy-800 dark:text-cream-50 m-0">2. User Accounts</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">When you create an account, you agree to:</p>
              <ul className="list-none space-y-2 pl-0">
                {[
                  "Provide accurate information",
                  "Maintain the security of your account",
                  "Accept responsibility for all activities under your account",
                  "Notify us of any unauthorized use"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-navy-600 dark:bg-cream-100" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white dark:bg-navy-800/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <ShieldAlert className="w-6 h-6 text-navy-600 dark:text-cream-100" />
                <h2 className="text-2xl font-semibold text-navy-800 dark:text-cream-50 m-0">3. Acceptable Use</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">You agree not to:</p>
              <ul className="list-none space-y-2 pl-0">
                {[
                  "Use the Service for any illegal purpose",
                  "Attempt to gain unauthorized access",
                  "Interfere with the Service's functionality",
                  "Share inappropriate or harmful content"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-navy-600 dark:bg-cream-100" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white dark:bg-navy-800/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Copyright className="w-6 h-6 text-navy-600 dark:text-cream-100" />
                <h2 className="text-2xl font-semibold text-navy-800 dark:text-cream-50 m-0">4. Intellectual Property</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                The Service and its original content are protected by copyright and other intellectual 
                property laws. Bible texts are subject to their respective copyright holders.
              </p>
            </section>

            <section className="bg-white dark:bg-navy-800/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FileWarning className="w-6 h-6 text-navy-600 dark:text-cream-100" />
                <h2 className="text-2xl font-semibold text-navy-800 dark:text-cream-50 m-0">5. Disclaimer</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                The Service is provided "as is" without warranties of any kind. We do not guarantee 
                the accuracy or completeness of any information provided.
              </p>
            </section>

            <section className="bg-white dark:bg-navy-800/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw className="w-6 h-6 text-navy-600 dark:text-cream-100" />
                <h2 className="text-2xl font-semibold text-navy-800 dark:text-cream-50 m-0">6. Changes to Terms</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes via email or through the Service.
              </p>
            </section>

            <section className="bg-white dark:bg-navy-800/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-navy-600 dark:text-cream-100" />
                <h2 className="text-2xl font-semibold text-navy-800 dark:text-cream-50 m-0">7. Contact</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                For questions about these Terms, please contact{" "}
                <a 
                  href="mailto:terms@askthebible.app" 
                  className="text-navy-600 dark:text-cream-200 hover:underline"
                >
                  terms@askthebible.app
                </a>
              </p>
            </section>
          </div>
        </main>
      </ScrollArea>
    </div>
  );
};

export default Terms; 