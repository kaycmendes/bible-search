import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Ask the Bible?",
      answer: "Ask the Bible is an AI-powered Bible verse search tool that helps you find relevant verses based on your questions or topics. It uses advanced AI to understand your query and find meaningful, contextually appropriate verses from different translations of the Bible."
    },
    {
      question: "Which Bible versions are available?",
      answer: "Currently, we support three versions: King James Version (KJV), New King James Version (NKJV), and Almeida Corrigida Fiel (ACF) in Portuguese. We're working on adding more translations in the future."
    },
    {
      question: "How does the verse selection work?",
      answer: "Our AI analyzes your question or topic and searches through the entire Bible to find relevant verses. It's designed to avoid repetition and provide variety by selecting verses from different books when possible. The AI considers context and relevance to ensure meaningful results."
    },
    {
      question: "Can I use this app offline?",
      answer: "Yes! Ask the Bible is a Progressive Web App (PWA), which means you can install it on your device and access some features offline. However, searching for new verses requires an internet connection as it uses AI processing."
    },
    {
      question: "How do I install the app on my device?",
      answer: "On Android: Click the 'Install' button when prompted or use the browser's 'Add to Home Screen' option. On iOS: Tap the share button (rectangle with arrow) and select 'Add to Home Screen'. Once installed, you can access Ask the Bible directly from your device's home screen."
    },
    {
      question: "Is this app free to use?",
      answer: "Yes, Ask the Bible is completely free to use. We believe in making Bible study tools accessible to everyone. The app is supported by our commitment to spreading God's word."
    },
    {
      question: "Can I share verses I find?",
      answer: "Absolutely! Each verse card has sharing options. You can copy the verse to your clipboard or share it directly on Twitter. We're working on adding more sharing options in future updates."
    },
    {
      question: "What makes this different from a regular Bible search?",
      answer: "Unlike traditional keyword searches, Ask the Bible understands natural language questions and context. You can ask questions like 'What does the Bible say about hope?' or 'How to deal with anxiety?' and get relevant verses that address your specific concern."
    }
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left text-navy-800 dark:text-cream-50 hover:text-navy-600 dark:hover:text-cream-200">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-300">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQ; 