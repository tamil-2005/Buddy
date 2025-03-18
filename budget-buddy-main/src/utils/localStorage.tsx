
import { Transaction, Budget } from '@/types/budget';

const TRANSACTIONS_KEY = 'budget-tracker-transactions';
const BUDGETS_KEY = 'budget-tracker-budgets';


export const getTransactions = (): Transaction[] => {
  try {
    const storedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
    return storedTransactions ? JSON.parse(storedTransactions) : [];
  } catch (error) {
    console.error('Error getting transactions from localStorage:', error);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error);
  }
};

export const addTransaction = (transaction: Transaction): Transaction[] => {
  const transactions = getTransactions();
  const updatedTransactions = [...transactions, transaction];
  saveTransactions(updatedTransactions);
  return updatedTransactions;
};

export const updateTransaction = (updatedTransaction: Transaction): Transaction[] => {
  const transactions = getTransactions();
  const updatedTransactions = transactions.map(transaction => 
    transaction.id === updatedTransaction.id ? updatedTransaction : transaction
  );
  saveTransactions(updatedTransactions);
  return updatedTransactions;
};

export const deleteTransaction = (id: string): Transaction[] => {
  const transactions = getTransactions();
  const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
  saveTransactions(updatedTransactions);
  return updatedTransactions;
};

export const getBudgets = (): Budget[] => {
  try {
    const storedBudgets = localStorage.getItem(BUDGETS_KEY);
    return storedBudgets ? JSON.parse(storedBudgets) : [];
  } catch (error) {
    console.error('Error getting budgets from localStorage:', error);
    return [];
  }
};

export const saveBudgets = (budgets: Budget[]): void => {
  try {
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  } catch (error) {
    console.error('Error saving budgets to localStorage:', error);
  }
};

export const addBudget = (budget: Budget): Budget[] => {
  const budgets = getBudgets();

  const existingBudgetIndex = budgets.findIndex(b => 
    b.category === budget.category && b.month === budget.month
  );
  
  if (existingBudgetIndex >= 0) {

    budgets[existingBudgetIndex] = budget;
  } else {

    budgets.push(budget);
  }
  
  saveBudgets(budgets);
  return budgets;
};

export const updateBudget = (updatedBudget: Budget): Budget[] => {
  const budgets = getBudgets();
  const updatedBudgets = budgets.map(budget => 
    budget.id === updatedBudget.id ? updatedBudget : budget
  );
  saveBudgets(updatedBudgets);
  return updatedBudgets;
};

export const deleteBudget = (id: string): Budget[] => {
  const budgets = getBudgets();
  const updatedBudgets = budgets.filter(budget => budget.id !== id);
  saveBudgets(updatedBudgets);
  return updatedBudgets;
};


export const getCurrentMonthBudgets = (): Budget[] => {
  const currentMonth = new Date().toISOString().slice(0, 7); 
  return getBudgets().filter(budget => budget.month === currentMonth);
};

export const getCurrentMonthTransactions = (): Transaction[] => {
  const currentMonth = new Date().toISOString().slice(0, 7); 
  return getTransactions().filter(
    transaction => transaction.date.startsWith(currentMonth)
  );
};
