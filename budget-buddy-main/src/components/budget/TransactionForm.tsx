
import React, { useState } from 'react';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBudget } from '@/context/BudgetContext';
import { TransactionType, TransactionCategory, INCOME_CATEGORIES, EXPENSE_CATEGORIES, CATEGORY_ICONS } from '@/types/budget';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { json } from 'stream/consumers';

const email = localStorage.getItem('userEmail');

const formSchema = z.object({
  amount: z.coerce.number().positive('Amount must be a positive number'),
  description: z.string().min(2, 'Description is required').max(100),
  date: z.date({
    required_error: 'Date is required',
  }),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['income', 'expense']),
});

type FormValues = z.infer<typeof formSchema>;

const TransactionForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { addTransaction } = useBudget();
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: '',
      date: new Date(),
      category: '',
      type: 'expense',
    },
  });



    const onSubmit = async (data: FormValues) => { // Marked async

      const transactionData = {
        email: email, // Fixed email format
        type: data.type,
        amount: data.amount,
        date: format(data.date, "yyyy-MM-dd"),
        description: data.description,
        category: data.category as TransactionCategory,
      };
    
      try {
        const response = await fetch("http://localhost:8070/budject", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transactionData),
        }
      );


      
          addTransaction({
          amount: data.amount,
          description: data.description,
          date: format(data.date, 'yyyy-MM-dd'),
          category: data.category as TransactionCategory,
          type: data.type,
        });
    
        form.reset({
          amount: 0,
          description: '',
          date: new Date(),
          category: '',
          type: data.type,
        });
    
        if (onSuccess) {
          onSuccess();
        }
    
      } catch (error) {
        console.error("Error submitting transaction:", error);
      }
    };
    ;


  const categories = transactionType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (type: TransactionType) => {
    setTransactionType(type);
    form.setValue('type', type);
    form.setValue('category', '');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex space-x-2 w-full">
              <Button
                type="button"
                className={cn(
                  "w-1/2 transition-all",
                  transactionType === 'expense' 
                    ? "bg-budget-expense text-white hover:bg-budget-expense/90" 
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
                onClick={() => handleTypeChange('expense')}
              >
                Expense
              </Button>
              <Button
                type="button"
                className={cn(
                  "w-1/2 transition-all",
                  transactionType === 'income' 
                    ? "bg-budget-income text-white hover:bg-budget-income/90" 
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
                onClick={() => handleTypeChange('income')}
              >
                Income
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal justify-start",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
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

            <Button 
              type="submit" 
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              Add Transaction
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;