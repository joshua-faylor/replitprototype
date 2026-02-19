import { Link, useLocation } from "wouter";
import { Home, Hammer, PiggyBank, PlusCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/budget", icon: PiggyBank, label: "Budget" },
    { href: "/build", icon: Hammer, label: "Build" },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-0 md:p-4 font-sans text-foreground">
      {/* Mobile Device Container */}
      <div className="w-full max-w-md bg-background h-[100dvh] md:h-[90vh] md:max-h-[850px] relative shadow-2xl md:rounded-[2.5rem] overflow-hidden flex flex-col border border-border/50">
        
        {/* Top Navigation Bar */}
        <div className="h-16 w-full bg-background/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20 sticky top-0 border-b border-border/5">
          <span className="text-xl font-serif font-bold text-primary tracking-tight">HomeAdv</span>
          <button className="p-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24 scrollbar-hide">
          <div className="p-6 md:p-8 animate-in-fade">
            {children}
          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/40 pb-6 pt-2 px-6 z-20">
          <ul className="flex justify-between items-center">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <div className={cn(
                      "flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}>
                      <item.icon className={cn("w-6 h-6", isActive && "fill-current")} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
             <li>
                <Link href="/add">
                  <div className="flex flex-col items-center gap-1 group">
                    <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform active:scale-95 mb-0">
                      <PlusCircle className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-medium tracking-wide text-muted-foreground">Add</span>
                  </div>
                </Link>
             </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
