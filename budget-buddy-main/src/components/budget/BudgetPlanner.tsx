
import React, { useState, useEffect } from 'react';
import { format, parse, startOfMonth, endOfMonth } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBudget } from '@/context/BudgetContext';
import { 
  TransactionCategory, 
  EXPENSE_CATEGORIES,
  Budget,
} from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

const formSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.coerce.number().positive('Amount must be a positive number'),
});

type FormValues = z.infer<typeof formSchema>;

interface BudgetPlannerProps {
  selectedMonth: Date;
  selectedDate?: Date;
}

const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ selectedMonth, selectedDate }) => {
  const { budgets, addBudget, updateBudget, deleteBudget } = useBudget();
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      amount: 0,
    },
  });

  // Set form values when editing a budget
  useEffect(() => {
    if (editingBudget) {
      form.setValue('category', editingBudget.category);
      form.setValue('amount', editingBudget.amount);
    }
  }, [editingBudget, form]);

  // If selectedDate changes, check if there's a budget for that date
  useEffect(() => {
    if (selectedDate) {
      const monthString = format(selectedDate, 'yyyy-MM');
      const filteredBudgets = budgets.filter(budget => budget.month === monthString);
      if (filteredBudgets.length > 0) {
        // We have budgets for this month, could highlight them
        // But we don't auto-select for editing as that might be confusing
      }
    }
  }, [selectedDate, budgets]);

  const onSubmit = (data: FormValues) => {
    const monthString = format(selectedMonth, 'yyyy-MM');
    
    if (editingBudget) {
      // Update existing budget
      updateBudget({
        ...editingBudget,
        category: data.category as TransactionCategory,
        amount: data.amount,
        month: monthString,
      });
      setEditingBudget(null);
    } else {
      // Add new budget
      addBudget({
        category: data.category as TransactionCategory,
        amount: data.amount,
        month: monthString,
      });
    }
    
    form.reset({
      category: '',
      amount: 0,
    });
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
  };

  // Filter budgets by selected month
  const currentMonthStr = format(selectedMonth, 'yyyy-MM');
  const filteredBudgets = budgets.filter(budget => budget.month === currentMonthStr);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {editingBudget ? 'Edit Budget' : 'Create Budget'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">₹ </span>
                        <Input
                          type="number"
                          step="0.01"
                          className="pl-8"
                          placeholder="0.00"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={form.formState.isSubmitting}
                >
                  {editingBudget ? 'Update Budget' : 'Add Budget'}
                </Button>
                {editingBudget && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setEditingBudget(null);
                      form.reset({
                        category: '',
                        amount: 0,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Budget for {format(selectedMonth, 'MMMM yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBudgets.length > 0 ? (
            <div className="space-y-4">
              {filteredBudgets.map((budget) => {
                const percentage = budget.amount > 0 
                  ? Math.min(Math.round((budget.spent / budget.amount) * 100), 100) 
                  : 0;
                
                return (
                  <div key={budget.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium capitalize">{budget.category}</h3>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(budget)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => deleteBudget(budget.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm mb-1">
                      <span>
                        Spent: <span className="font-medium">{formatCurrency(budget.spent)}</span>
                      </span>
                      <span>
                        Budget: <span className="font-medium">{formatCurrency(budget.amount)}</span>
                      </span>
                    </div>
                    
                    <Progress 
                      value={percentage}
                      className={cn(
                        "h-2",
                        percentage > 90 ? "bg-red-500" : 
                        percentage > 75 ? "bg-orange-500" : 
                        "bg-green-500"
                      )}
                    />
                    
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-muted-foreground">
                        {percentage}% used
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <p className="mb-4">No budgets set for {format(selectedMonth, 'MMMM yyyy')}.</p>
              <p className="text-sm">Create a budget to start tracking your spending.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetPlanner;
