import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const savingsGoal = 150000;
  const currentSavings = 138000;
  const progress = (currentSavings / savingsGoal) * 100;
  
  const milestones = [
    { label: "Foundation", completed: true, amount: 15000 },
    { label: "Framing & Roof", completed: true, amount: 45000 },
    { label: "Plumbing & Electrical", completed: true, amount: 75000 },
    { label: "Insulation & Drywall", completed: true, amount: 100000 },
    { label: "Siding & Exterior", completed: false, amount: 140000 },
    { label: "Interior Finishes", completed: false, amount: 150000 },
  ];

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-medium text-foreground mb-1">Welcome Home, Alex</h1>
        <p className="text-muted-foreground">You're getting closer to your dream.</p>
      </header>

      {/* House Visualization Card */}
      <section className="mb-8 relative group">
        <div className="absolute inset-0 bg-secondary/10 rounded-[2rem] transform rotate-1 scale-95 transition-transform group-hover:rotate-2"></div>
        <Card className="relative overflow-hidden border-none shadow-none bg-transparent">
          <div className="relative z-10 flex flex-col items-center">
            <motion.img 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              src="/house-construction.png" 
              alt="House in progress" 
              className="w-full h-auto drop-shadow-2xl mb-6 scale-100"
            />
            
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <span className="font-bold text-primary">{Math.round(progress)}%</span>
              <span className="text-muted-foreground text-sm ml-1">Complete</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Progress Section */}
      <section className="mb-10">
        <div className="flex justify-between items-end mb-3">
          <span className="text-sm font-medium text-muted-foreground">Total Saved</span>
          <span className="text-2xl font-serif font-bold text-primary">${currentSavings.toLocaleString()}</span>
        </div>
        <Progress value={progress} className="h-3 bg-secondary/20" indicatorClassName="bg-primary rounded-r-full" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>$0</span>
          <span>Goal: ${savingsGoal.toLocaleString()}</span>
        </div>
      </section>

      {/* Milestones */}
      <section>
        <h2 className="text-lg font-serif font-medium mb-4">Milestones</h2>
        <div className="space-y-4">
          {milestones.map((milestone, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className={`flex items-center p-4 rounded-2xl border transition-colors ${
                milestone.completed 
                  ? "bg-primary/5 border-primary/10" 
                  : "bg-background border-border"
              }`}
            >
              <div className={`mr-4 ${milestone.completed ? "text-primary" : "text-muted-foreground/30"}`}>
                {milestone.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${milestone.completed ? "text-foreground" : "text-muted-foreground"}`}>
                  {milestone.label}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {milestone.completed ? "Completed" : `$${(milestone.amount - currentSavings).toLocaleString()} until reached`}
                </p>
              </div>
              {milestone.completed && (
                 <div className="h-10 w-10 rounded-xl overflow-hidden shadow-sm">
                    <img src="/house-complete.png" className="w-full h-full object-cover opacity-80" />
                 </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
