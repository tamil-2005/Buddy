
import React, { useState } from 'react';
import { format } from 'date-fns';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BudgetSummary from '@/components/budget/BudgetSummary';
import TransactionList from '@/components/budget/TransactionList';
import TransactionForm from '@/components/budget/TransactionForm';
import CategoryBreakdown from '@/components/budget/CategoryBreakdown';
import { CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  const monthString = format(selectedMonth, 'yyyy-MM');
  const formattedMonth = format(selectedMonth, 'MMMM yyyy');

  return (
    <DashboardLayout
      title="Financial Dashboard"
      subtitle="Track your income, expenses, and budget in one place"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold mr-2">Overview for {formattedMonth}</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedMonth}
                onSelect={(date) => date && setSelectedMonth(date)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                captionLayout="dropdown-buttons"
                fromMonth={new Date(2020, 0)}
                toMonth={new Date(2030, 11)}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
              <DialogDescription>
                Enter the details of your transaction below.
              </DialogDescription>
            </DialogHeader>
            <TransactionForm onSuccess={() => setIsTransactionDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-8">
        <BudgetSummary />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryBreakdown month={monthString} />

          <TransactionList limit={5} filterMonth={monthString} showActions={false} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
