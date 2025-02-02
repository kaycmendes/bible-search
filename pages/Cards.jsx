import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingText from "@/components/LoadingText";

const Cards = ({ results, isLoading }) => {
  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <div className="grid gap-4 p-4">
      {Object.entries(results || {}).map(([key, value], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ScriptureCard
            verse={value.verse}
            verseLocation={value.verseLocation}
            query={value.query}
          />
        </motion.div>
      ))}
    </div>
  );
};

const LoadingCard = () => {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        <LoadingText />
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </CardContent>
    </Card>
  );
};

const ScriptureCard = ({ verse, verseLocation, query }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(`${verse} - ${verseLocation}`);
    toast.success('Copied to clipboard!');
  };

  const handleShare = () => {
    const shareText = encodeURIComponent(`"${verse}" - ${verseLocation}`);
    window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank');
  };

  return (
    <Card className="w-full gradient-card hover:shadow-xl transition-all duration-300">
      <CardHeader className="space-y-1">
        <CardTitle className="text-sm font-medium text-primary">
          {verseLocation}
        </CardTitle>
        <p className="text-xs text-muted-foreground italic">Query: {query}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="scripture-text">{verse}</p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy}
            className="btn-secondary"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="btn-secondary"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Cards;
