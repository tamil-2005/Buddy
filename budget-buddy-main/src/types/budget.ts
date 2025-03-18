
export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'housing' 
  | 'transportation' 
  | 'food' 
  | 'utilities' 
  | 'insurance'
  | 'healthcare' 
  | 'savings' 
  | 'personal' 
  | 'entertainment' 
  | 'education'
  | 'debt' 
  | 'gifts' 
  | 'other'
  | 'salary'
  | 'investment'
  | 'freelance';

export const CATEGORY_ICONS: Record<TransactionCategory, string> = {
  housing: 'home',
  transportation: 'car',
  food: 'utensils',
  utilities: 'plug',
  insurance: 'shield',
  healthcare: 'heart-pulse',
  savings: 'piggy-bank',
  personal: 'user',
  entertainment: 'tv',
  education: 'graduation-cap',
  debt: 'credit-card',
  gifts: 'gift',
  other: 'more-horizontal',
  salary: 'banknote',
  investment: 'trending-up',
  freelance: 'briefcase',
};

export const INCOME_CATEGORIES: TransactionCategory[] = [
  'salary',
  'investment',
  'freelance',
  'other'
];

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  'housing',
  'transportation',
  'food',
  'utilities',
  'insurance',
  'healthcare',
  'savings',
  'personal',
  'entertainment',
  'education',
  'debt',
  'gifts',
  'other'
];

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: TransactionCategory;
  type: TransactionType;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  amount: number;
  spent: number;
  month: string; 
}

export interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
}
