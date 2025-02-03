const LoadingText = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <span className="text-navy-600 dark:text-cream-200 font-medium">
        Loading
      </span>
      <div className="flex items-center justify-center space-x-2">
        <div className="w-2.5 h-2.5 rounded-full bg-navy-400/50 dark:bg-cream-200/50 animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-navy-400/50 dark:bg-cream-200/50 animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-navy-400/50 dark:bg-cream-200/50 animate-bounce"></div>
      </div>
    </div>
  );
};

export default LoadingText; 