
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useBudget } from '@/context/BudgetContext';
import { TransactionCategory, EXPENSE_CATEGORIES } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { toast } from 'sonner';

const formSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.coerce.number().positive('Amount must be a positive number'),
});

type FormValues = z.infer<typeof formSchema>;

interface BudgetQuickEntryProps {
  date: Date;
  onClose: () => void;
}

const BudgetQuickEntry: React.FC<BudgetQuickEntryProps> = ({ date, onClose }) => {
  const { addBudget, getBudgetsByMonth, updateBudget } = useBudget();
  const monthString = format(date, 'yyyy-MM');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      amount: 0,
    },
  });

  const onSubmit = (data: FormValues) => {
    // Find if budget already exists for this category and month
    const existingBudgets = getBudgetsByMonth(monthString);
    const existingBudget = existingBudgets.find(b => b.category === data.category);
    
    if (existingBudget) {
      // Update existing budget
      updateBudget({
        ...existingBudget,
        amount: data.amount,
      });
      toast.success(`Updated ${data.category} budget for ${format(date, 'MMMM yyyy')}`);
    } else {
      // Add new budget
      addBudget({
        category: data.category as TransactionCategory,
        amount: data.amount,
        month: monthString,
      });
      toast.success(`Added ${data.category} budget for ${format(date, 'MMMM yyyy')}`);
    }
    
    form.reset({
      category: '',
      amount: 0,
    });
    
    onClose();
  };

  return (
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

        <div className="flex gap-2 justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
          >
            Save Budget
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BudgetQuickEntry;
