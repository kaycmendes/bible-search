import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { UserNav } from "@/components/user-nav";

const Navbar = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

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

      {/* User menu */}
      {session ? (
        <UserNav />
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => signIn('google')}
          className="rounded-full"
        >
          <User className="h-5 w-5" />
        </Button>
      )}
    </nav>
  );
};

export default Navbar; 