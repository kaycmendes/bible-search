import Navbar from "./Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Lock, UserCheck, Database, Cookie, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <main className="container max-w-4xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-navy-50 dark:bg-navy-800/50 mb-4">
              <Shield className="w-8 h-8 text-navy-600 dark:text-cream-100" />
            </div>
            <h1 className="text-3xl font-bold text-navy-800 dark:text-cream-50 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-12 bg-white dark:bg-navy-800/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-navy-600 dark:text-cream-100" />
                <h2 className="text-2xl font-semibold text-navy-800 dark:text-cream-50 m-0">Introduction</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Ask the Bible (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and protect your information when you use our application.
              </p>
            </section>

            <section className="mb-12 bg-white dark:bg-navy-800/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="w-6 h-6 text-navy-600 dark:text-cream-100" />
                <h2 className="text-2xl font-semibold text-navy-800 dark:text-cream-50 m-0">Information We Collect</h2>
              </div>
              <h3 className="text-xl font-medium mb-3 text-navy-700 dark:text-cream-100">Personal Information</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">When you use Ask the Bible, we may collect:</p>
              <ul className="list-none space-y-2 pl-0">
                {[
                  'Email address (when you sign in with Google)',
                  'Profile information from Google (name, profile picture)',
                  'Your search queries and saved verses',
                  'Device information and preferences'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-navy-600 dark:bg-cream-100" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mb-12 bg-white dark:bg-navy-800/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-navy-600 dark:text-cream-100" />
                <h2 className="text-2xl font-semibold text-navy-800 dark:text-cream-50 m-0">Data Storage and Security</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Your data is stored securely using industry-standard encryption. We never share your 
                personal information with third parties except as required by law.
              </p>
            </section>

            <section className="mb-12 bg-white dark:bg-navy-800/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="w-6 h-6 text-navy-600 dark:text-cream-100" />
                <h2 className="text-2xl font-semibold text-navy-800 dark:text-cream-50 m-0">Cookies and Local Storage</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                We use local storage to save your preferences and cards. You can clear this data 
                through your browser settings at any time.
              </p>
            </section>

            <section className="mb-12 bg-white dark:bg-navy-800/50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-navy-600 dark:text-cream-100" />
                <h2 className="text-2xl font-semibold text-navy-800 dark:text-cream-50 m-0">Contact Us</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a 
                  href="mailto:privacy@askthebible.app" 
                  className="text-navy-600 dark:text-cream-200 hover:underline"
                >
                  privacy@askthebible.app
                </a>
              </p>
            </section>
          </div>
        </main>
      </ScrollArea>
    </div>
  );
};

export default PrivacyPolicy; 