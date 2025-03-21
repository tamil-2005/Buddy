
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Budget, BudgetSummary, TransactionCategory } from '@/types/budget';
import { 
  getTransactions, 
  getBudgets, 
  addTransaction as addTransactionToStorage,
  updateTransaction as updateTransactionInStorage,
  deleteTransaction as deleteTransactionFromStorage,
  addBudget as addBudgetToStorage,
  updateBudget as updateBudgetInStorage,
  deleteBudget as deleteBudgetFromStorage
} from '@/utils/localStorage';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface BudgetContextProps {
  transactions: Transaction[];
  budgets: Budget[];
  summary: BudgetSummary;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  getTransactionsByMonth: (month: string) => Transaction[];
  getBudgetsByMonth: (month: string) => Budget[];
  getCategoryTotals: (month: string) => Record<TransactionCategory, number>;
}

const BudgetContext = createContext<BudgetContextProps | undefined>(undefined);

export const useBudget = () => {

  




  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

interface BudgetProviderProps {
  children: ReactNode;
}

export const BudgetProvider: React.FC<BudgetProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [summary, setSummary] = useState<BudgetSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    savingsRate: 0,
  });


  useEffect(() => {
    setTransactions(getTransactions());
    setBudgets(getBudgets());
  }, []);

  
  useEffect(() => {
    updateSummary();
    updateBudgetSpending();
  }, [transactions]);

  const updateSummary = () => {

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
    
    setSummary({
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
    });
  };

  const updateBudgetSpending = () => {
    const updatedBudgets = [...budgets];
    
    // Reset all spending
    updatedBudgets.forEach(budget => {
      budget.spent = 0;
    });
    
    // Calculate spending for each budget
    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        const month = transaction.date.substring(0, 7); // YYYY-MM
        const budget = updatedBudgets.find(
          b => b.category === transaction.category && b.month === month
        );
        
        if (budget) {
          budget.spent += transaction.amount;
        }
      }
    });
    
    setBudgets(updatedBudgets);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: uuidv4(),
    };
    
    const updatedTransactions = addTransactionToStorage(newTransaction);
    setTransactions(updatedTransactions);
    toast.success('Transaction added successfully');
  };

  const updateTransaction = (transaction: Transaction) => {
    const updatedTransactions = updateTransactionInStorage(transaction);
    setTransactions(updatedTransactions);
    toast.success('Transaction updated successfully');
  };

  const deleteTransaction = (id: string) => {
    const updatedTransactions = deleteTransactionFromStorage(id);
    setTransactions(updatedTransactions);
    toast.success('Transaction deleted successfully');
  };

  const addBudget = (budget: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget = {
      ...budget,
      id: uuidv4(),
      spent: 0,
    };
    
    const updatedBudgets = addBudgetToStorage(newBudget);
    setBudgets(updatedBudgets);
    toast.success('Budget added successfully');
  };

  const updateBudget = (budget: Budget) => {
    const updatedBudgets = updateBudgetInStorage(budget);
    setBudgets(updatedBudgets);
    toast.success('Budget updated successfully');
  };

  const deleteBudget = (id: string) => {
    const updatedBudgets = deleteBudgetFromStorage(id);
    setBudgets(updatedBudgets);
    toast.success('Budget deleted successfully');
  };

  const getTransactionsByMonth = (month: string): Transaction[] => {
    return transactions.filter(transaction => transaction.date.startsWith(month));
  };

  const getBudgetsByMonth = (month: string): Budget[] => {
    return budgets.filter(budget => budget.month === month);
  };

  const getCategoryTotals = (month: string): Record<TransactionCategory, number> => {
    const result: Record<string, number> = {};
    
    const monthTransactions = getTransactionsByMonth(month).filter(
      transaction => transaction.type === 'expense'
    );
    
    monthTransactions.forEach(transaction => {
      if (!result[transaction.category]) {
        result[transaction.category] = 0;
      }
      result[transaction.category] += transaction.amount;
    });
    
    return result as Record<TransactionCategory, number>;
  };

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        budgets,
        summary,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        getTransactionsByMonth,
        getBudgetsByMonth,
        getCategoryTotals,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
