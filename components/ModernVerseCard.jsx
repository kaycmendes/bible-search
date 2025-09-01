"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Share2, Copy, Download, MoreHorizontal, Trash2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';

const ModernVerseCard = ({ 
  verse, 
  verseLocation, 
  query, 
  version = 'KJV', 
  onRefresh, 
  onDelete, 
  onSave,
  onGenerateAnother,
  isSaved = false,
  className = "",
  layout = "vertical" // "vertical" or "horizontal"
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLayout, setCurrentLayout] = useState(layout);

  const toggleLayout = () => {
    setCurrentLayout(currentLayout === "vertical" ? "horizontal" : "vertical");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`"${verse}" - ${verseLocation} (${version})`);
      toast.success('Verse copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy verse');
    }
  };

  const handleShare = async () => {
    const shareText = `"${verse}" - ${verseLocation} (${version})`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bible Verse',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          handleCopy(); // Fallback to copy
        }
      }
    } else {
      // Fallback for browsers without native share
      handleCopy();
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsLoading(true);
      try {
        await onRefresh();
        toast.success('Found another verse!');
      } catch (error) {
        toast.error('Failed to find another verse');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
      toast.success(isSaved ? 'Verse removed from saved' : 'Verse saved!');
    }
  };

  const handleGenerateAnother = async () => {
    if (onGenerateAnother) {
      setIsLoading(true);
      try {
        await onGenerateAnother();
        toast.success('Generated new verse!');
      } catch (error) {
        toast.error('Failed to generate new verse');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`group relative ${className}`}
    >
      {/* Main Card */}
      <div className={`bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700 ${
        currentLayout === "horizontal" ? "flex flex-row" : ""
      }`}>
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {query && (
                <div className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mb-4">
                  <span>Question: {query}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                {version}
              </span>
              
              {/* Layout Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLayout}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-400"
                title={`Switch to ${currentLayout === "vertical" ? "horizontal" : "vertical"} layout`}
              >
                {currentLayout === "vertical" ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                )}
              </Button>
              
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Verse Content */}
        <div className="px-6 sm:px-8 pb-6">
          <blockquote className="text-xl sm:text-2xl lg:text-3xl font-serif leading-relaxed text-slate-800 dark:text-slate-200 mb-6">
            &ldquo;{verse}&rdquo;
          </blockquote>
          
          <cite className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {verseLocation}
          </cite>
        </div>

        {/* Actions */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex-1 sm:flex-none rounded-xl border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 dark:hover:bg-blue-950/50 dark:hover:border-blue-500 dark:hover:text-blue-300"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex-1 sm:flex-none rounded-xl border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-green-50 hover:border-green-400 hover:text-green-700 dark:hover:bg-green-950/50 dark:hover:border-green-500 dark:hover:text-green-300"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            {onSave && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className={`flex-1 sm:flex-none rounded-xl border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 transition-all ${
                  isSaved 
                    ? 'bg-red-50 border-red-400 text-red-700 hover:bg-red-100 dark:bg-red-950/50 dark:border-red-500 dark:text-red-300' 
                    : 'hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700 dark:hover:bg-purple-950/50 dark:hover:border-purple-500 dark:hover:text-purple-300'
                }`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            )}

            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="rounded-xl border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-700 dark:hover:bg-amber-950/50 dark:hover:border-amber-500 dark:hover:text-amber-300"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Adding...' : 'Add Another'}
              </Button>
            )}

            {onGenerateAnother && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateAnother}
                disabled={isLoading}
                className="rounded-xl border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 dark:hover:bg-indigo-950/50 dark:hover:border-indigo-500 dark:hover:text-indigo-300 ml-auto"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" stroke="currentColor" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Generate New
              </Button>
            )}
          </div>
        </div>

        {/* Gradient Border Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-blue-500/20 transition-all duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default ModernVerseCard;
