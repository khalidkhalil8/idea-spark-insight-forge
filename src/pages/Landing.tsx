
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export function Landing() {
  const router = useRouter();
  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    
    setIsLoading(true);
    router.push({
      pathname: '/results',
      query: { idea: idea },
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-background/10 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Validate Your Business Ideas</h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Enter your idea and uncover competitors and market gaps in seconds.
            </p>
            
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="text"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your business idea..."
                  className="flex-grow"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? 'Processing...' : 'Analyze'}
                </Button>
              </div>
            </form>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-card hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">Enter Your Idea</h3>
                  <p className="text-muted-foreground text-center">Describe the concept of your idea</p>
                </CardContent>
              </Card>

              <Card className="bg-card hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">Find Competitors</h3>
                  <p className="text-muted-foreground text-center">Discover existing competitors in your market space</p>
                </CardContent>
              </Card>

              <Card className="bg-card hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">Identify Market Gap</h3>
                  <p className="text-muted-foreground text-center">Uncover opportunities others have missed</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Don't Waste Time and Resources</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Before you build, understand the market behind your idea
            </p>
            <Button asChild className="px-8">
              <a href="/about">Learn More</a>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
