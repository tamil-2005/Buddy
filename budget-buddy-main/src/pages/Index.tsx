
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Budget Buddy</h1>
          <div className="space-x-2">
            {isLoggedIn ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    localStorage.removeItem('isLoggedIn');
                    window.location.reload();
                    sessionStorage.removeItem('isLoggedIn'); 
                    localStorage.removeItem('userEmail');
                    localStorage.clear();
                    // Clear session
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Take Control of Your Finances</h1>
          <p className="text-xl text-gray-600 mb-8">
            Track expenses, set budgets, and reach your financial goals with our simple budget tracker.
          </p>
          <div className="flex justify-center gap-4">
            {isLoggedIn ? (
              <Button size="lg" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <Button size="lg" onClick={() => navigate('/signup')}>
                Get Started for Free
              </Button>
            )}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Track Expenses</h2>
              <p className="text-gray-600">
                Easily record and categorize your spending to see where your money goes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Set Budgets</h2>
              <p className="text-gray-600">
                Create monthly budgets for different categories and stay on track.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Visualize Progress</h2>
              <p className="text-gray-600">
                See your financial progress with clear charts and summaries.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Budget Buddy. All rights reserved By Budget Buddy.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
