import React, { useState } from 'react';
import { Moon, Calendar, Clock, Brain, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { createSleepPlan } from '../services/api';

const SleepPlanner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    examDate: '',
    studyHours: '6',
    sleepHours: '7',
    stressLevel: 'medium',
    priorities: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.examDate) {
      setError('Please select an exam date');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await createSleepPlan(formData);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'study': return 'bg-blue-900/30 border-blue-500';
      case 'break': return 'bg-green-900/30 border-green-500';
      case 'sleep': return 'bg-purple-900/30 border-purple-500';
      default: return 'bg-slate-700 border-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Moon className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold">Smart Sleep Planner</h1>
          </div>
          <p className="text-slate-400">
            Create a balanced study schedule that optimizes learning and rest for better performance.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Exam Date
                </label>
                <input
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Daily Study Hours
                </label>
                <input
                  type="number"
                  value={formData.studyHours}
                  onChange={(e) => setFormData({ ...formData, studyHours: e.target.value })}
                  min="1"
                  max="12"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Sleep Duration (hours)
                </label>
                <input
                  type="number"
                  value={formData.sleepHours}
                  onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                  min="4"
                  max="10"
                  step="0.5"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Brain className="w-4 h-4 inline mr-1" />
                  Stress Level
                </label>
                <select
                  value={formData.stressLevel}
                  onChange={(e) => setFormData({ ...formData, stressLevel: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Study Priorities (Optional)</label>
                <textarea
                  value={formData.priorities}
                  onChange={(e) => setFormData({ ...formData, priorities: e.target.value })}
                  placeholder="e.g., Focus on algorithms, practice coding problems..."
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-700 disabled:to-slate-700 rounded-lg font-semibold transition-all"
              >
                {loading ? 'Generating...' : 'Generate Schedule'}
              </button>
            </form>

            {error && <Alert type="error" message={error} />}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {loading && <LoadingSpinner message="Creating your personalized schedule..." />}
            
            {result && (
              <div className="space-y-6">
                {result.message && (
                  <Alert type="info" message={result.message} />
                )}

                {/* Summary */}
                {result.summary && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-purple-400">Schedule Summary</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-400">Total Days</p>
                        <p className="text-2xl font-bold">{result.summary.totalDays}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Daily Study Hours</p>
                        <p className="text-2xl font-bold">{result.summary.dailyStudyHours}h</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Daily Sleep</p>
                        <p className="text-2xl font-bold">{result.summary.dailySleepHours}h</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Exam Date</p>
                        <p className="text-lg font-semibold">{result.summary.examDate}</p>
                      </div>
                    </div>

                    {result.summary.recommendations && (
                      <div>
                        <h4 className="font-semibold mb-2 text-blue-400">Recommendations</h4>
                        <ul className="space-y-1">
                          {result.summary.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm text-slate-300 flex items-start">
                              <span className="text-blue-400 mr-2">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Daily Schedule */}
                {result.schedule && result.schedule.map((day, dayIdx) => (
                  <div key={dayIdx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3">
                      {day.day} - {day.date}
                    </h3>
                    <div className="space-y-2">
                      {day.activities.map((activity, actIdx) => (
                        <div
                          key={actIdx}
                          className={`p-3 rounded-lg border-l-4 ${getActivityColor(activity.type)}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{activity.activity}</p>
                              <p className="text-xs text-slate-400 mt-1">{activity.focus}</p>
                            </div>
                            <span className="text-xs text-slate-400 whitespace-nowrap ml-4">{activity.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !result && (
              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-12 text-center">
                <Moon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Fill in the form and click "Generate Schedule" to create your personalized study plan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepPlanner;
