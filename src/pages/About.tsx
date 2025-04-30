
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Lightbulb, Target, CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-12">
        <div className="flex items-center mb-4">
          <div className="bg-brand-100 text-brand-600 p-2 rounded-full">
            <Lightbulb className="w-5 h-5" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          We Help Validate Your Business Ideas
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Our mission is to help entrepreneurs and innovators test their ideas before investing significant time and resources.
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
          <Target className="mr-2 h-6 w-6 text-brand-600" />
          Our Mission
        </h2>
        
        <p>
          In today's fast-paced business environment, launching a startup without proper validation is risky. Many entrepreneurs spend months or years building products that nobody wants. We're changing that.
        </p>
        
        <p>
          IdeaValidator provides quick, data-driven insights about your business concept, helping you identify:
        </p>
        
        <ul>
          <li>Direct and indirect competitors</li>
          <li>Gaps in the current market offerings</li>
          <li>Potential unique value propositions</li>
          <li>Strategic positioning opportunities</li>
        </ul>
        
        <h2 className="flex items-center text-2xl font-bold text-gray-900 mt-10 mb-4">
          <CheckCircle className="mr-2 h-6 w-6 text-brand-600" />
          How We're Different
        </h2>
        
        <p>
          Unlike traditional market research that takes weeks and costs thousands of dollars, our AI-powered platform delivers insights in minutes. We combine competitive intelligence with strategic analysis to give you a clear picture of your market landscape.
        </p>
        
        <p>
          Our tool doesn't just tell you who your competitors are—it helps you understand how to position your product to stand out and succeed.
        </p>
        
        <div className="bg-brand-50 border border-brand-100 rounded-lg p-6 my-8">
          <h3 className="text-xl font-medium text-brand-800 mb-4">Start with validation, not speculation</h3>
          <p className="text-brand-700 mb-4">
            Don't waste time building something nobody wants. Test your idea first, refine your approach, then build with confidence.
          </p>
          <Link to="/validate">
            <Button className="bg-brand-600 hover:bg-brand-700">
              Validate Your Idea Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
