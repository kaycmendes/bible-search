//make a next js component?
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Sun, Moon, User, Download } from 'lucide-react';
import { useTheme } from "next-themes";
import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { FcGoogle } from 'react-icons/fc';


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallButton, setShowInstallButton] = useState(false);

    // Wait until mounted to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);

        // Handle PWA install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
            // Show the install button
            setShowInstallButton(true);
        });

        // Hide button if PWA is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowInstallButton(false);
        }
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            setShowInstallButton(false);
        }

        // Clear the saved prompt since it can't be used again
        setDeferredPrompt(null);
    };

    if (!mounted) {
        return (
            <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container max-w-4xl flex h-14 items-center justify-between">
                    <Link href="/" className="font-semibold text-lg">
                        Ask the Bible
                    </Link>
                    <div className="flex items-center gap-2">
                        {/* Install Button - show only if available */}
                        {showInstallButton && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleInstallClick}
                                className="gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Install App
                            </Button>
                        )}

                        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="h-9 w-9">
                            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>
                        {status === "loading" ? (
                            <Button variant="ghost" size="icon" className="h-9 w-9" disabled>
                                <User className="h-4 w-4 animate-pulse" />
                            </Button>
                        ) : session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                        {session.user?.image ? (
                                            <Image
                                                src={session.user.image}
                                                alt={session.user.name || "User"}
                                                width={32}
                                                height={32}
                                                className="h-6 w-6 rounded-full"
                                            />
                                        ) : (
                                            <User className="h-4 w-4" />
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-1 leading-none">
                                            {session.user?.name && (
                                                <p className="font-medium">{session.user.name}</p>
                                            )}
                                            {session.user?.email && (
                                                <p className="w-[200px] truncate text-sm text-muted-foreground">
                                                    {session.user.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <DropdownMenuItem
                                        className="text-red-600 dark:text-red-400 cursor-pointer"
                                        onClick={() => signOut()}
                                    >
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => signIn("google")}
                                className="gap-2"
                            >
                                <FcGoogle className="h-4 w-4" />
                                Sign in
                            </Button>
                        )}
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container max-w-4xl flex h-14 items-center justify-between">
                <Link href="/" className="font-semibold text-lg">
                    Ask the Bible
                </Link>
                <div className="flex items-center gap-2">
                    {/* Install Button - show only if available */}
                    {showInstallButton && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleInstallClick}
                            className="gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Install App
                        </Button>
                    )}

                    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="h-9 w-9">
                        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                    {status === "loading" ? (
                        <Button variant="ghost" size="icon" className="h-9 w-9" disabled>
                            <User className="h-4 w-4 animate-pulse" />
                        </Button>
                    ) : session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    {session.user?.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name || "User"}
                                            width={32}
                                            height={32}
                                            className="h-6 w-6 rounded-full"
                                        />
                                    ) : (
                                        <User className="h-4 w-4" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="flex items-center justify-start gap-2 p-2">
                                    <div className="flex flex-col space-y-1 leading-none">
                                        {session.user?.name && (
                                            <p className="font-medium">{session.user.name}</p>
                                        )}
                                        {session.user?.email && (
                                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                                                {session.user.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <DropdownMenuItem
                                    className="text-red-600 dark:text-red-400 cursor-pointer"
                                    onClick={() => signOut()}
                                >
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => signIn("google")}
                            className="gap-2"
                        >
                            <FcGoogle className="h-4 w-4" />
                            Sign in
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar