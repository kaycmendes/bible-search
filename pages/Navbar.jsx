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

        // Check if the app is already installed
        const isInstalled = () => {
            // Check if in standalone mode (PWA)
            if (window.matchMedia('(display-mode: standalone)').matches) return true;
            // Check if on iOS and in standalone mode
            if (navigator.standalone) return true;
            // Check if installed on Chrome
            if (window.navigator.userAgent.includes('Chrome') && window.chrome?.app?.isInstalled) return true;
            return false;
        };

        // Check if the app can be installed
        const checkInstallable = async () => {
            // Check if the browser supports PWA
            if ('serviceWorker' in navigator && window.isSecureContext) {
                try {
                    // Register service worker if not already registered
                    const registration = await navigator.serviceWorker.ready;
                    if (registration.active) {
                        // Only show install button if not already installed
                        if (!isInstalled()) {
                            setShowInstallButton(true);
                        }
                    }
                } catch (error) {
                    console.error('Service Worker registration failed:', error);
                }
            }
        };

        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        });

        // Check if installable on component mount
        checkInstallable();

        // Hide button if app is launched in standalone mode
        if (isInstalled()) {
            setShowInstallButton(false);
        }

        // Cleanup
        return () => {
            window.removeEventListener('beforeinstallprompt', () => {});
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            // Fallback for browsers that don't support beforeinstallprompt
            alert('To install the app: \n\n' +
                  'On iOS: Tap the share button and select "Add to Home Screen"\n' +
                  'On Android: Tap the menu button and select "Install App"');
            return;
        }

        try {
            // Show the install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
                setShowInstallButton(false);
            }
            // Clear the saved prompt
            setDeferredPrompt(null);
        } catch (error) {
            console.error('Install prompt failed:', error);
            // Fallback
            alert('To install the app: \n\n' +
                  'On iOS: Tap the share button and select "Add to Home Screen"\n' +
                  'On Android: Tap the menu button and select "Install App"');
        }
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