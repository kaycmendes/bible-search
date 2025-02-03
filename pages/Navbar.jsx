//make a next js component?
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { BookOpen, Sun, Moon, Menu, User } from 'lucide-react';
import { useTheme } from "next-themes";
import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);

    // Wait until mounted to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container max-w-4xl flex h-14 items-center justify-between">
                    <Link href="/" className="font-semibold text-lg">
                        Ask the Bible
                    </Link>
                    <div className="flex items-center gap-2">
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
                                            <img
                                                src={session.user.image}
                                                alt={session.user.name || "User"}
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
                                <User className="h-4 w-4" />
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
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || "User"}
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
                            <User className="h-4 w-4" />
                            Sign in
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar