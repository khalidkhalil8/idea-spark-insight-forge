
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="border-b border-gray-200 py-4 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-brand-600" />
          <span className="font-bold text-xl text-gray-900">Mogulate</span>
        </Link>
        <div className="flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className={`${navigationMenuTriggerStyle()} ${isActive('/') ? 'bg-accent text-accent-foreground' : 'text-gray-600 hover:text-brand-600'}`}>
                  Home
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/validate" className={`${navigationMenuTriggerStyle()} ${isActive('/validate') ? 'bg-accent text-accent-foreground' : 'text-gray-600 hover:text-brand-600'}`}>
                  Validate
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/results" className={`${navigationMenuTriggerStyle()} ${isActive('/results') ? 'bg-accent text-accent-foreground' : 'text-gray-600 hover:text-brand-600'}`}>
                  Results
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/summary" className={`${navigationMenuTriggerStyle()} ${isActive('/summary') ? 'bg-accent text-accent-foreground' : 'text-gray-600 hover:text-brand-600'}`}>
                  Summary
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/about" className={`${navigationMenuTriggerStyle()} ${isActive('/about') ? 'bg-accent text-accent-foreground' : 'text-gray-600 hover:text-brand-600'}`}>
                  About
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <Link to="/validate">
            <Button className="bg-brand-600 hover:bg-brand-700 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
