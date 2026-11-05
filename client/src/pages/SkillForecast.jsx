import React, { useState } from 'react';
import { TrendingUp, Target, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { createSkillForecast } from '../services/api';

const SkillForecast = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    skill: '',
    currentLevel: 'beginner',
    targetLevel: 'intermediate',
    hoursPerDay: '2',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.skill.trim()) {
      setError('Please enter a skill to learn');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await createSkillForecast(formData);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-yellow-900/10 to-slate-900">
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
            <TrendingUp className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold">AI Skill Forecast</h1>
          </div>
          <p className="text-slate-400">
            Get personalized learning roadmaps with realistic timelines and actionable milestones.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Skill to Learn
                </label>
                <input
                  type="text"
                  value={formData.skill}
                  onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                  placeholder="e.g., React, Machine Learning, Guitar..."
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Current Level</label>
                <select
                  value={formData.currentLevel}
                  onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Level</label>
                <select
                  value={formData.targetLevel}
                  onChange={(e) => setFormData({ ...formData, targetLevel: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Daily Study Hours
                </label>
                <input
                  type="number"
                  value={formData.hoursPerDay}
                  onChange={(e) => setFormData({ ...formData, hoursPerDay: e.target.value })}
                  min="0.5"
                  max="12"
                  step="0.5"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Target Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 disabled:from-slate-700 disabled:to-slate-700 rounded-lg font-semibold transition-all"
              >
                {loading ? 'Generating...' : 'Generate Roadmap'}
              </button>
            </form>

            {error && <Alert type="error" message={error} />}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {loading && <LoadingSpinner message="Creating your personalized learning roadmap..." />}
            
            {result && (
              <div className="space-y-6">
                {result.message && (
                  <Alert type="info" message={result.message} />
                )}

                {/* Overview */}
                <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-lg p-6">
                  <h3 className="text-2xl font-semibold mb-4 text-yellow-400">{result.skill} Learning Roadmap</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Current Level</p>
                      <p className="text-lg font-semibold capitalize">{result.currentLevel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Target Level</p>
                      <p className="text-lg font-semibold capitalize">{result.targetLevel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Estimated Duration</p>
                      <p className="text-lg font-semibold">{result.estimatedWeeks} weeks</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Total Hours</p>
                      <p className="text-lg font-semibold">{result.totalHours}h</p>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                {result.milestones && result.milestones.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-blue-400">Learning Milestones</h3>
                    
                    {result.milestones.map((milestone, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-800/50 border border-slate-700 rounded-lg p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-purple-400">{milestone.phase}</h4>
                            <p className="text-sm text-slate-400">{milestone.weeks}</p>
                          </div>
                          <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                            {milestone.hoursPerWeek}h/week
                          </span>
                        </div>
                        
                        <p className="text-slate-300 mb-3">{milestone.focus}</p>
                        
                        {milestone.tasks && milestone.tasks.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-slate-400 mb-2">Tasks:</p>
                            <ul className="space-y-1">
                              {milestone.tasks.map((task, taskIdx) => (
                                <li key={taskIdx} className="flex items-start space-x-2 text-sm text-slate-300">
                                  <span className="text-primary mt-0.5">•</span>
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommendations */}
                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-green-400">Recommendations</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span className="text-slate-300">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Resources */}
                {result.resources && result.resources.length > 0 && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-blue-400">Recommended Resources</h3>
                    <ul className="space-y-2">
                      {result.resources.map((resource, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span className="text-slate-300">{resource}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Disclaimer */}
                {result.disclaimer && (
                  <Alert type="info" message={result.disclaimer} />
                )}
              </div>
            )}

            {!loading && !result && (
              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-12 text-center">
                <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Fill in the form to generate your personalized learning roadmap</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillForecast;
