import Contact from "@/components/landing/Contact";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function Home() {
  return (
    <main className="h-screen w-full flex flex-col overflow-hidden bg-background">
      <header className="w-full py-4 px-6 border-b border-[hsl(var(--border))] flex justify-between items-center">
        <div className="font-bold text-xl tracking-tight text-foreground">LeadFlow</div>
        <ThemeToggle />
      </header>
      <div className="flex-1 w-full flex flex-col justify-center items-center overflow-hidden">
        <Contact />
      </div>
      <footer className="w-full text-center py-4 text-sm text-[hsl(var(--muted-foreground))] border-t border-[hsl(var(--border))]">
        Built for <a href="https://digitalheroesco.com" target="_blank" rel="noopener noreferrer" className="hover:underline text-foreground">Digital Heroes Training Task</a>
      </footer>
    </main>
  );
}
