import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit2, Trash2 } from "lucide-react";

export default function Budget() {
  const transactions = [
    { id: 1, date: "02/05/2026", amount: 5000 },
    { id: 2, date: "02/01/2026", amount: 5000 },
    { id: 3, date: "01/25/2026", amount: 5000 },
    { id: 4, date: "01/15/2026", amount: 5000 },
    { id: 5, date: "01/05/2026", amount: 2500 },
    { id: 6, date: "12/28/2025", amount: 5000 },
  ];

  const totalSavings = 86250;

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-medium mb-1">Budget Display</h1>
        <p className="text-muted-foreground">Track your contributions.</p>
      </header>

      {/* Total Savings Card */}
      <Card className="bg-primary text-primary-foreground p-8 rounded-[2rem] text-center mb-8 shadow-xl shadow-primary/20 border-none">
        <span className="text-primary-foreground/80 text-sm font-medium uppercase tracking-wider">Total Savings</span>
        <div className="text-4xl font-serif font-bold mt-2 mb-6">${totalSavings.toLocaleString()}</div>
        <Button variant="secondary" className="w-full rounded-xl h-12 text-secondary-foreground font-semibold">
          Add Savings
        </Button>
      </Card>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">History</h2>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">View All</Button>
        </div>

        <div className="space-y-3">
          {transactions.map((t) => (
            <div key={t.id} className="group bg-white p-4 rounded-2xl border border-border/50 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Date: {t.date}</div>
                <div className="text-lg font-medium font-serif">${t.amount.toLocaleString()}</div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
