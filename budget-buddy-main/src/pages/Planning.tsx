
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BudgetPlanner from '@/components/budget/BudgetPlanner';
import { Button } from '@/components/ui/button';
import { 
  CalendarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import BudgetQuickEntry from '@/components/budget/BudgetQuickEntry';

const Planning = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isQuickEntryOpen, setIsQuickEntryOpen] = useState(false);
  
  const formattedMonth = format(selectedMonth, 'MMMM yyyy');
  
  const handlePrevMonth = () => {
    const prevMonth = new Date(selectedMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setSelectedMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(selectedMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setSelectedMonth(nextMonth);
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setIsQuickEntryOpen(true);
    }
  };
  
  return (
    <DashboardLayout
      title="Budget Planning"
      subtitle="Set and manage your monthly budget goals"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Calendar</h2>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handlePrevMonth}
                  aria-label="Previous month"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <span className="font-medium">{formattedMonth}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleNextMonth}
                  aria-label="Next month"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              month={selectedMonth}
              onMonthChange={setSelectedMonth}
              className="rounded-md border w-full"
              captionLayout="dropdown-buttons"
              fromMonth={new Date(2020, 0)}
              toMonth={new Date(2030, 11)}
            />
            
            <div className="mt-4">
              <Dialog open={isQuickEntryOpen} onOpenChange={setIsQuickEntryOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {selectedDate && `Budget for ${format(selectedDate, 'MMMM d, yyyy')}`}
                    </DialogTitle>
                    <DialogDescription>
                      Quickly add or modify budget for this date
                    </DialogDescription>
                  </DialogHeader>
                  
                  {selectedDate && (
                    <BudgetQuickEntry 
                      date={selectedDate} 
                      onClose={() => setIsQuickEntryOpen(false)}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedDate(new Date());
                    setIsQuickEntryOpen(true);
                  }}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Today's Budget
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Jump to Month
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
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <BudgetPlanner selectedMonth={selectedMonth} selectedDate={selectedDate} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Planning;
