"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronDown, Sun, Moon } from "lucide-react";
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from "next-themes";
import Image from 'next/image';
import Link from 'next/link';

const AppNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Ask the Bible
            </span>
          </div>

          {/* Right side - Theme toggle and user menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Profile */}
            {session && (
              <div className="relative group">
                <button className="flex items-center space-x-3 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors">
                  <Image 
                    src={session.user.image} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full" 
                    width={32} 
                    height={32} 
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {session.user.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      Signed in as {session.user.email}
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
