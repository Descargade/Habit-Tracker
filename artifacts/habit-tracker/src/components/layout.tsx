import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-[100dvh] w-full flex flex-col max-w-md mx-auto relative bg-background">
      <header className="flex items-center justify-between p-6 pb-2">
        <h1 className="text-xl font-serif font-medium tracking-tight text-foreground/90">Rituals</h1>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </header>
      
      <nav className="flex items-center gap-4 px-6 pb-6 pt-4 text-sm">
        <Link 
          href="/" 
          className={`pb-1 transition-colors ${location === '/' ? 'text-primary border-b-2 border-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Today
        </Link>
        <Link 
          href="/weekly" 
          className={`pb-1 transition-colors ${location === '/weekly' ? 'text-primary border-b-2 border-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Weekly
        </Link>
        <Link 
          href="/manage" 
          className={`pb-1 transition-colors ${location === '/manage' ? 'text-primary border-b-2 border-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Manage
        </Link>
      </nav>

      <main className="flex-1 px-6 pb-24">
        {children}
      </main>
    </div>
  );
}
