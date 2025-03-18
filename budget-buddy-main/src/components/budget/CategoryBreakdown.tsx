
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudget } from '@/context/BudgetContext';
import { EXPENSE_CATEGORIES, TransactionCategory } from '@/types/budget';

const COLORS = [
  '#60a5fa', // blue
  '#34d399', // green
  '#f87171', // red
  '#a78bfa', // purple
  '#fbbf24', // yellow
  '#f472b6', // pink
  '#3b82f6', // indigo
  '#10b981', // emerald
  '#ef4444', // rose
  '#6366f1', // violet
  '#ec4899', // fuchsia
  '#8b5cf6', // purple
  '#14b8a6', // teal
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

interface CategoryBreakdownProps {
  month?: string;
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ month }) => {
  const { transactions } = useBudget();
  
  const categoryData = useMemo(() => {

    const filteredTransactions = month
      ? transactions.filter(t => t.date.startsWith(month) && t.type === 'expense')
      : transactions.filter(t => t.type === 'expense');
    

    const categoryTotals: Record<string, number> = {};
    

    EXPENSE_CATEGORIES.forEach(category => {
      categoryTotals[category] = 0;
    });
    

    filteredTransactions.forEach(transaction => {
      categoryTotals[transaction.category] += transaction.amount;
    });
    

    return Object.entries(categoryTotals)
      .filter(([_, amount]) => amount > 0)
      .map(([category, amount]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: amount,
      }))
      .sort((a, b) => b.value - a.value); 
  }, [transactions, month]);

  const totalExpenses = useMemo(() => {
    return categoryData.reduce((sum, item) => sum + item.value, 0);
  }, [categoryData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalExpenses) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 shadow-md rounded-md border">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary">{formatCurrency(data.value)}</p>
          <p className="text-gray-500 text-sm">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {categoryData.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/2 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                  >
                    {categoryData.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2">
              <h3 className="font-medium mb-4">Top Categories</h3>
              <div className="space-y-4">
                {categoryData.slice(0, 5).map((category, index) => {
                  const percentage = ((category.value / totalExpenses) * 100).toFixed(1);
                  return (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="h-3 w-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">
                          {formatCurrency(category.value)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Total Expenses:</span>
                  <span className="font-medium">{formatCurrency(totalExpenses)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No expense data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdown;
