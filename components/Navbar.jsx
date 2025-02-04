'use client'

import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, User, Download, Chrome } from "lucide-react";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { UserNav } from "@/components/user-nav";
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { useState } from 'react'
import LoginDialog from './LoginDialog'

const Navbar = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const { canInstall, handleInstall } = usePWAInstall()
  const [showLogin, setShowLogin] = useState(false)

  return (
    <nav className={cn("flex flex-col items-center gap-4", className)}>
      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="rounded-full"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Install button */}
      {canInstall && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleInstall()}
          className="rounded-full"
          aria-label="Install app"
        >
          <Download className="h-5 w-5" />
        </Button>
      )}

      {/* User menu */}
      {session ? (
        <UserNav />
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowLogin(true)}
          className="rounded-full"
        >
          <Chrome className="h-5 w-5" />
        </Button>
      )}

      {showLogin && (
        <LoginDialog 
          isOpen={showLogin} 
          onClose={() => setShowLogin(false)} 
        />
      )}
    </nav>
  );
};

export default Navbar; 