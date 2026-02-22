import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit2, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

type SavingsSummary = {
  currentAmount: number;
  goalAmount: number;
  progressPercent: number;
};

type Contribution = {
  id: number;
  amount: number;
  createdAt: string;
};

export default function Budget() {
  const { data: summary } = useQuery<SavingsSummary>({
    queryKey: ["/api/savings/summary"],
    staleTime: 0,
    refetchOnMount: "always",
  });
  const { data: transactions = [] } = useQuery<Contribution[]>({
    queryKey: ["/api/savings/contributions?limit=20"],
    staleTime: 0,
    refetchOnMount: "always",
  });

  const totalSavings = summary?.currentAmount ?? 0;

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
        <Link href="/add">
          <Button variant="secondary" className="w-full rounded-xl h-12 text-secondary-foreground font-semibold">
            Add Savings
          </Button>
        </Link>
      </Card>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">History</h2>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">View All</Button>
        </div>

        <div className="space-y-3">
          {transactions.length === 0 && (
            <div className="bg-white p-4 rounded-2xl border border-border/50 text-sm text-muted-foreground">
              No contributions yet.
            </div>
          )}
          {transactions.map((t) => (
            <div key={t.id} className="group bg-white p-4 rounded-2xl border border-border/50 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Date: {new Date(t.createdAt).toLocaleDateString("en-US")}
                </div>
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
