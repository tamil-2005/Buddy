import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type Transaction = {
  id: number;
  email: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  description: string;
  category: string;
};

const email = localStorage.getItem('userEmail');

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

const BudgetSummary: React.FC = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    savingsRate: 0,
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://localhost:8070/budject/email/${email}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const transactions: Transaction[] = await response.json();

        const totalIncome = transactions
          .filter(transaction => transaction.type === "income")
          .reduce((total, transaction) => total + transaction.amount, 0);

        const totalExpenses = transactions
          .filter(transaction => transaction.type === "expense")
          .reduce((total, transaction) => total + transaction.amount, 0);

        const balance = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

        setSummary({
          totalIncome,
          totalExpenses,
          balance,
          savingsRate: parseFloat(savingsRate.toFixed(2)), // Ensure it’s always a number with two decimals
        });
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const spentPercentage = summary.totalExpenses > 0
    ? Math.min(Math.round((summary.totalExpenses / summary.totalIncome) * 100), 100)
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  const stats = [
    { title: "Income", value: summary.totalIncome, color: "green", icon: TrendingUp },
    { title: "Expenses", value: summary.totalExpenses, color: "red", icon: TrendingDown },
    { title: "Balance", value: summary.balance, color: summary.balance >= 0 ? "green" : "red", icon: DollarSign },
    { title: "Savings Rate", value: `${summary.savingsRate.toFixed(2)}%`, color: "purple", icon: PiggyBank }
  ];

  return (
    <div className="w-full">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map(({ title, value, color, icon: Icon }, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                  <div className={`p-2 bg-${color}-100 rounded-full`}>
                    <Icon className={`h-4 w-4 text-${color}-600`} />
                  </div>
                </div>
                <p className={`text-2xl font-semibold ${color === "red" ? "text-red-600" : "text-green-600"}`}>
                  {typeof value === "number" ? formatCurrency(value) : value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {title === "Income" ? "Total incoming cash flow" :
                  title === "Expenses" ? "Total outgoing cash flow" :
                  title === "Balance" ? "Current cash flow balance" :
                  "Percentage of income saved"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium mb-4">Budget Usage</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Spent</span>
              <span>{spentPercentage}%</span>
            </div>
            <Progress value={spentPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(summary.totalExpenses)}</span>
              <span>{formatCurrency(summary.totalIncome)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummary;
