
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useBudget } from '@/context/BudgetContext';
import { cn } from '@/lib/utils';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

const BudgetSummary: React.FC = () => {
  const { summary } = useBudget();
  const { totalIncome, totalExpenses, balance, savingsRate } = summary;

  // Calculate what percentage of income is spent
  const spentPercentage = totalIncome > 0 
    ? Math.min(Math.round((totalExpenses / totalIncome) * 100), 100)
    : 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="w-full">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Income</h3>
                <div className="p-2 bg-green-100 rounded-full">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-semibold">{formatCurrency(totalIncome)}</p>
              <p className="text-xs text-muted-foreground mt-1">Total incoming cash flow</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Expenses</h3>
                <div className="p-2 bg-red-100 rounded-full">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
              </div>
              <p className="text-2xl font-semibold">{formatCurrency(totalExpenses)}</p>
              <p className="text-xs text-muted-foreground mt-1">Total outgoing cash flow</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Balance</h3>
                <div className="p-2 bg-blue-100 rounded-full">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <p className={cn(
                "text-2xl font-semibold",
                balance >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {formatCurrency(balance)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Current cash flow balance</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Savings Rate</h3>
                <div className="p-2 bg-purple-100 rounded-full">
                  <PiggyBank className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-semibold">{savingsRate.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground mt-1">Percentage of income saved</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium mb-4">Budget Usage</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Spent</span>
              <span>{spentPercentage}%</span>
            </div>
            <Progress 
              value={spentPercentage} 
              className={cn(
                "h-2",
                spentPercentage > 90 ? "bg-red-500" : 
                spentPercentage > 75 ? "bg-orange-500" : 
                "bg-green-500"
              )}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(totalExpenses)}</span>
              <span>{formatCurrency(totalIncome)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummary;
