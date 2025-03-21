import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ArrowDownCircle, ArrowUpCircle, Search, Trash2, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudget } from '@/context/BudgetContext';
import { Transaction } from '@/types/budget';
import { cn } from '@/lib/utils';

const email = localStorage.getItem('userEmail');



const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

interface TransactionListProps {
  limit?: number;
  filterMonth?: string;
  showActions?: boolean;
  onEdit?: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ limit, filterMonth, showActions = true, onEdit }) => {
  const { deleteTransaction } = useBudget();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://localhost:8070/budject/email/${email}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
  
    const intervalId = setInterval(fetchTransactions); // Call API every 100ms
  
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);
  


  


  // Filter transactions
  let filteredTransactions = [...transactions];

  if (filterMonth) {
    filteredTransactions = filteredTransactions.filter(transaction => transaction.date.startsWith(filterMonth));
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredTransactions = filteredTransactions.filter(transaction =>
      transaction.description.toLowerCase().includes(query) || transaction.category.toLowerCase().includes(query)
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Transactions</CardTitle>
        <div className="relative w-48">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                {showActions && <TableHead className="w-[80px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="capitalize">{transaction.category}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {transaction.type == 'income' ? (
                          <ArrowUpCircle className="mr-2 h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownCircle className="mr-2 h-4 w-4 text-red-500" />
                        )}
                        <span className={cn(transaction.type === 'income' ? 'text-green-600' : 'text-red-600')}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    </TableCell>
                    {showActions && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="19" cy="12" r="1" />
                                <circle cx="5" cy="12" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onEdit && (
                              <DropdownMenuItem onClick={() => onEdit(transaction)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600" onClick={() => deleteTransaction(transaction.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={showActions ? 5 : 4} className="text-center py-6 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
