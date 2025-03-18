
import React, { useState } from 'react';
import { format } from 'date-fns';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TransactionList from '@/components/budget/TransactionList';
import TransactionForm from '@/components/budget/TransactionForm';
import { useBudget } from '@/context/BudgetContext';
import { Transaction } from '@/types/budget';
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

const Transactions = () => {
  const { updateTransaction } = useBudget();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  const monthString = format(selectedMonth, 'yyyy-MM');
  const formattedMonth = format(selectedMonth, 'MMMM yyyy');

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  return (
    <DashboardLayout
      title="Transactions"
      subtitle="Manage your income and expenses"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold mr-2">Transactions for {formattedMonth}</h2>
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
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
            <TransactionForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Transaction Dialog */}
      {editingTransaction && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
              <DialogDescription>
                Update the details of your transaction.
              </DialogDescription>
            </DialogHeader>
            {/* We would need to build an edit form component here */}
            <div className="py-4 text-center text-muted-foreground">
              <p>Edit functionality would be implemented here.</p>
              <Button 
                className="mt-4" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TransactionForm />
        </div>
        
        <div className="md:col-span-2">
          <TransactionList 
            filterMonth={monthString} 
            onEdit={handleEditTransaction}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
