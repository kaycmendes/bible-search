import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, RefreshCw, Twitter, Trash2 } from "lucide-react";
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingText from "@/components/LoadingText";
import { useEffect, useRef, useState } from 'react';
import Footer from '@/components/Footer';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

const Cards = ({ results, isLoading, onRefresh, version, onDelete }) => {
  const [showFooter, setShowFooter] = useState(false);
  const lastCardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const lastCard = entries[0];
        if (lastCard.isIntersecting) {
          setShowFooter(true);
        } else {
          setShowFooter(false);
        }
      },
      {
        threshold: 0.5, // Show footer when last card is 50% visible
        rootMargin: '0px'
      }
    );

    if (lastCardRef.current) {
      observer.observe(lastCardRef.current);
    }

    return () => observer.disconnect();
  }, [results]); // Recreate observer when results change

  if (isLoading) {
    return <LoadingCard />;
  }

  // Convert object to array and reverse it to show newest first
  const resultsArray = Object.entries(results || {}).reverse();

  return (
    <div className="relative h-[calc(100vh-12rem)] overflow-hidden">
      {/* Gradient overlays for top and bottom fade effect */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-10"></div>

      {/* Scrollable container with perspective effect */}
      <div 
        className="h-full overflow-y-auto scrollbar-hide perspective-container"
        style={{
          perspective: '1000px',
          WebkitMask: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent 100%)'
        }}
      >
        <div className="grid gap-6 w-full max-w-2xl mx-auto px-4">
          {/* Top padding for initial scroll space */}
          <div className="h-16" aria-hidden="true"></div>

          {/* Cards */}
          {resultsArray.map(([key, value], index) => (
            <motion.div
              key={key}
              ref={index === resultsArray.length - 1 ? lastCardRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-wrapper"
            >
              <ScriptureCard
                verse={value.verse}
                verseLocation={value.verseLocation}
                query={value.query}
                onRefresh={onRefresh}
                onDelete={() => onDelete(key)}
                version={version}
              />
            </motion.div>
          ))}

          {/* Bottom padding to ensure last card is fully visible */}
          <div className="h-[calc(80vh-22rem)]" aria-hidden="true"></div>
        </div>
      </div>

      {/* Footer with transition */}
      <div className={`fixed bottom-0 left-0 right-0 transition-transform duration-300 ${
        showFooter ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <Footer />
      </div>
    </div>
  );
};

const LoadingCard = () => {
  return (
    <Card className="w-full overflow-hidden gradient-card">
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-1/4 animate-pulse" />
          <Skeleton className="h-4 w-16 animate-pulse" />
        </div>
        <Skeleton className="h-4 w-1/3 animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-6">
        <LoadingText />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full animate-pulse" />
          <Skeleton className="h-4 w-5/6 animate-pulse" />
          <Skeleton className="h-4 w-4/6 animate-pulse" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 animate-pulse" />
          <Skeleton className="h-9 w-20 animate-pulse" />
          <Skeleton className="h-9 w-32 ml-auto animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
};

const ScriptureCard = ({ verse, verseLocation, query, onRefresh, onDelete, version }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${verse} - ${verseLocation}`);
    toast.success('Copied to clipboard!');
  };

  const handleTweet = () => {
    const shareText = encodeURIComponent(`"${verse}" - ${verseLocation}`);
    window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank');
  };

  const handleRefresh = async () => {
    try {
      toast.info(`Finding another verse about "${query}"...`, {
        autoClose: 2000
      });
      await onRefresh(query);
    } catch (error) {
      toast.error('Failed to generate a new verse. Please try again.');
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="w-full gradient-card">
        <CardHeader className="space-y-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium card-title">
              {verseLocation}
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {version}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                title="Remove card"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm card-query italic">Query: {query}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="scripture-text">{verse}</p>
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopy}
                className="btn-secondary flex-1 sm:flex-initial"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleTweet}
                className="btn-secondary flex-1 sm:flex-initial"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Tweet
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="btn-secondary w-full sm:w-auto sm:ml-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate Another
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default Cards;
