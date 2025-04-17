
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, Search, Users } from 'lucide-react';

const Landing = () => {
  return <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">Have an Idea? Let Us Help You.</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Enter your idea and uncover competitors, market gaps, and unique positioning angles in seconds.
          </p>
          <div className="flex justify-center">
            <Link to="/validate">
              <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-lg px-8">
                Start Validating
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-card text-center">
              <div className="bg-brand-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-brand-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Find Competitors</h3>
              <p className="text-gray-600">
                Discover similar businesses and competitors in your space to understand the market landscape.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-card text-center">
              <div className="bg-brand-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-brand-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Identify Market Gaps</h3>
              <p className="text-gray-600">
                Our AI analysis helps you spot opportunities and gaps in the existing market.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-card text-center">
              <div className="bg-brand-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-brand-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Position Your Idea</h3>
              <p className="text-gray-600">
                Get suggestions on how to differentiate your idea and reach your target audience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-brand-500 to-brand-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Validate Your Startup Idea?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Don't waste time and resources on ideas that might not work. Validate first, then build.
          </p>
          <Link to="/validate">
            <Button size="lg" variant="secondary" className="text-brand-700 text-lg px-8">
              Start Now — It's Free
            </Button>
          </Link>
        </div>
      </section>
    </div>;
};

export default Landing;
