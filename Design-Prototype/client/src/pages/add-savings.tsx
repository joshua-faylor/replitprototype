import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { X, PiggyBank, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type ContributionResponse = {
  currentAmount: number;
  goalAmount: number;
  progressPercent: number;
};

type Contribution = {
  id: number;
  amount: number;
  createdAt: string;
};

export default function AddSavings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatedProgress, setUpdatedProgress] = useState<ContributionResponse | null>(null);
  const { data: summary } = useQuery<ContributionResponse>({
    queryKey: ["/api/savings/summary"],
    staleTime: 0,
    refetchOnMount: "always",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isSubmitting) return;

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter an amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/savings/contribute", {
        amount: parsedAmount,
      });
      const payload: ContributionResponse = await response.json();
      setUpdatedProgress(payload);

      queryClient.setQueryData(["/api/savings/summary"], payload);
      queryClient.setQueryData<Contribution[] | undefined>(
        ["/api/savings/contributions?limit=20"],
        (existing) => [
          {
            id: Date.now(),
            amount: parsedAmount,
            createdAt: new Date().toISOString(),
          },
          ...(existing ?? []),
        ],
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["/api/savings/summary"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["/api/savings/contributions?limit=20"],
          refetchType: "all",
        }),
      ]);
      setIsSuccess(true);
      setAmount("");
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Could not add contribution.";
      toast({
        title: "Contribution failed",
        description,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Add Savings</h1>
          <p className="text-muted-foreground text-sm">Every dollar builds your future.</p>
        </div>
        <Link href="/">
          <Button size="icon" variant="ghost" className="rounded-full h-12 w-12 hover:bg-primary/5">
            <X className="w-6 h-6" />
          </Button>
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <div className="bg-primary p-6 rounded-[2.5rem] text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                    <PiggyBank className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">Goal Progress</h3>
                </div>
                <p className="text-primary-foreground/90 text-sm leading-relaxed mb-4">
                  You're currently{" "}
                  <span className="font-bold text-white">
                    {Math.round((updatedProgress ?? summary)?.progressPercent ?? 57)}%
                  </span>{" "}
                  towards your dream home. This deposit will get you even closer.
                </p>
                <div className="bg-white/10 h-2 w-full rounded-full overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    style={{
                      width: `${Math.min((updatedProgress ?? summary)?.progressPercent ?? 57, 100)}%`,
                    }}
                  />
                </div>
              </div>
              <Sparkles className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-12" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="amount" className="text-lg font-serif font-medium block text-center">
                  How much are you adding today?
                </Label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-serif font-medium text-primary/40 group-focus-within:text-primary transition-colors">$</span>
                  <Input 
                    id="amount" 
                    type="number" 
                    autoFocus
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00" 
                    className="pl-14 h-24 text-4xl font-serif font-bold bg-white rounded-[2rem] border-2 border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-center placeholder:text-muted-foreground/20" 
                  />
                </div>
              </div>

              <div className="bg-secondary/5 p-5 rounded-3xl border border-secondary/10 flex items-center gap-4">
                <div className="h-10 w-10 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-sm font-medium text-secondary-foreground/80">
                  Tip: Saving an extra $50 a week gets you to your goal 3 months faster!
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit"
                  disabled={!amount || isSubmitting}
                  className="flex-1 h-16 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" 
                  size="lg"
                >
                  {isSubmitting ? "Saving..." : "Confirm Contribution"}
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-primary/40">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
            </div>
            <h2 className="text-3xl font-serif font-bold mb-2 text-primary">Success!</h2>
            <p className="text-muted-foreground text-lg mb-3">Your contribution has been added.</p>
            {updatedProgress && (
              <div className="mb-8 text-center">
                <p className="text-foreground text-base font-medium">
                  Total Saved: ${updatedProgress.currentAmount.toLocaleString()}
                </p>
                <p className="text-muted-foreground text-sm">
                  Goal: ${updatedProgress.goalAmount.toLocaleString()} ({updatedProgress.progressPercent}%)
                </p>
              </div>
            )}
            <div className="w-full max-w-[200px] h-1 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${updatedProgress ? Math.min(updatedProgress.progressPercent, 100) : 100}%` }}
                transition={{ duration: 2 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
