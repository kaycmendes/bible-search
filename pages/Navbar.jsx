//make a next js component?
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { BookOpen, Sun, Moon } from 'lucide-react';
import { useTheme } from "next-themes";
import { useEffect, useState } from 'react';

const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Wait until mounted to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <span className="font-bold text-primary">Scripture Search</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="w-9 px-0">
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                        <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary">
                            <Link href="/about">About</Link>
                        </Button>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="font-bold text-primary">Scripture Search</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="text-muted-foreground hover:text-primary"
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                    <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary">
                        <Link href="/about">About</Link>
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar