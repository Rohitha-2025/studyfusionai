import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Home } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Brain className="w-8 h-8 text-primary group-hover:text-primary-light transition-colors" />
            <span className="text-xl font-bold gradient-text">StudyFusionAI</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
