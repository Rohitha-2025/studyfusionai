import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Code, Moon, Youtube, FileText, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Code,
      title: 'AI Coding Analyzer',
      description: 'Get instant feedback on your code with error detection and optimization suggestions.',
      color: 'text-blue-400'
    },
    {
      icon: Moon,
      title: 'Smart Sleep Planner',
      description: 'Balance study and rest with personalized schedules optimized for learning.',
      color: 'text-purple-400'
    },
    {
      icon: Youtube,
      title: 'YouTube Quiz Generator',
      description: 'Transform educational videos into interactive quizzes and summaries.',
      color: 'text-red-400'
    },
    {
      icon: FileText,
      title: 'Smart PDF Highlighter',
      description: 'Automatically identify and highlight key concepts in your study materials.',
      color: 'text-green-400'
    },
    {
      icon: TrendingUp,
      title: 'AI Skill Forecast',
      description: 'Get personalized learning roadmaps with realistic timelines and milestones.',
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Navbar */}
      <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold gradient-text">StudyFusionAI</span>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-primary hover:bg-primary-dark rounded-lg transition-all transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span className="text-primary-light font-semibold">Powered by Google Gemini AI</span>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Your AI-Powered Companion
            <br />
            for Smarter Learning
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            StudyFusionAI combines five powerful AI tools to optimize your study sessions,
            improve code quality, and accelerate your learning journey.
          </p>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 card-hover"
              >
                <Icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-slate-300 mb-8 text-lg">
            Join students worldwide who are achieving better results with AI-powered study tools.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-primary hover:bg-primary-dark rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
          >
            Start Learning Smarter Today
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <p>© 2024 StudyFusionAI. Built with React, Express, and Google Gemini AI.</p>
          <p className="mt-2 text-sm">Educational tool for performance optimization and productivity.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
