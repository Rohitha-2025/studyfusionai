import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Moon, Youtube, FileText, TrendingUp, ArrowRight, Brain, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import { checkHealth } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    checkHealth()
      .then(setHealthStatus)
      .catch(err => console.error('Health check failed:', err));
  }, []);

  const tools = [
    {
      id: 'code-analyzer',
      icon: Code,
      title: 'AI Coding Analyzer',
      description: 'Analyze your code for errors, get optimization suggestions, and understand complexity.',
      color: 'from-blue-500 to-cyan-500',
      path: '/code-analyzer'
    },
    {
      id: 'sleep-planner',
      icon: Moon,
      title: 'Smart Sleep Planner',
      description: 'Create balanced study schedules that optimize learning and rest periods.',
      color: 'from-purple-500 to-pink-500',
      path: '/sleep-planner'
    },
    {
      id: 'youtube-summarizer',
      icon: Youtube,
      title: 'YouTube Quiz Generator',
      description: 'Generate summaries and interactive quizzes from educational video transcripts.',
      color: 'from-red-500 to-orange-500',
      path: '/youtube-summarizer'
    },
    {
      id: 'pdf-highlighter',
      icon: FileText,
      title: 'Smart PDF Highlighter',
      description: 'Extract and highlight important concepts from your study materials automatically.',
      color: 'from-green-500 to-teal-500',
      path: '/pdf-highlighter'
    },
    {
      id: 'skill-forecast',
      icon: TrendingUp,
      title: 'AI Skill Forecast',
      description: 'Get personalized learning roadmaps with milestones and realistic timelines.',
      color: 'from-yellow-500 to-amber-500',
      path: '/skill-forecast'
    },
    {
      id: 'notebook',
      icon: BookOpen,
      title: 'Study Notebook',
      description: 'Create, organize, and manage your study notes with tags and search functionality.',
      color: 'from-indigo-500 to-purple-500',
      path: '/notebook'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
              <p className="text-slate-400">Choose a tool to enhance your learning experience</p>
            </div>
            
            {healthStatus && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                {healthStatus.geminiConfigured ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">AI Active</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400">Demo Mode</span>
                  </>
                )}
              </div>
            )}
          </div>

          {healthStatus && !healthStatus.geminiConfigured && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                <strong>Note:</strong> Gemini API key not configured. Some features will work in demo mode.
                Add your API key to <code className="bg-slate-800 px-2 py-1 rounded">.env</code> file for full AI functionality.
              </p>
            </div>
          )}
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 card-hover cursor-pointer"
                onClick={() => navigate(tool.path)}
              >
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                <p className="text-slate-400 mb-4">{tool.description}</p>
                
                <button className="flex items-center space-x-2 text-primary hover:text-primary-light transition-colors">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-8">
          <div className="flex items-start space-x-4">
            <Brain className="w-12 h-12 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-semibold mb-2">Powered by Google Gemini AI</h3>
              <p className="text-slate-300">
                All tools leverage advanced AI to provide personalized insights, intelligent analysis,
                and actionable recommendations to help you learn more effectively and achieve better results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
