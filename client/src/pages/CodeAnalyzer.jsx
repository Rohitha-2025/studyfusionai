import React, { useState } from 'react';
import { Code, Copy, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { analyzeCode } from '../services/api';

const CodeAnalyzer = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const codeExamples = {
    python: `def find_duplicates(arr):
    duplicates = []
    for i in range(len(arr)):
        for j in range(i+1, len(arr)):
            if arr[i] == arr[j] and arr[i] not in duplicates:
                duplicates.append(arr[i])
    return duplicates`,
    javascript: `function calculateTotal(items) {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
        total = total + items[i].price;
    }
    return total;
}`,
    java: `public int findMax(int[] array) {
    int max = array[0];
    for (int i = 0; i < array.length; i++) {
        if (array[i] > max) {
            max = array[i];
        }
    }
    return max;
}`,
    cpp: `#include <iostream>
using namespace std;

int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}`
  };

  const loadExample = () => {
    setCode(codeExamples[language] || '');
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await analyzeCode(code, language);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900">
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
            <Code className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold">AI Coding Analyzer</h1>
          </div>
          <p className="text-slate-400">
            Get instant feedback on your code with error detection, optimization suggestions, and complexity analysis.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Programming Language</label>
              <button
                onClick={loadExample}
                className="text-sm text-primary hover:text-primary-light transition-colors"
              >
                Load Example
              </button>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
            </select>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Your Code</label>
                <span className="text-xs text-slate-500">{code.length} characters</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                rows={16}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-700 disabled:to-slate-700 rounded-lg font-semibold transition-all"
            >
              {loading ? 'Analyzing...' : 'Analyze Code'}
            </button>

            {error && <Alert type="error" message={error} />}
            
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2 text-slate-300">What we analyze:</h4>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Bugs and logical errors</li>
                <li>• Performance bottlenecks</li>
                <li>• Security vulnerabilities</li>
                <li>• Best practice violations</li>
                <li>• Code quality metrics</li>
                <li>• Time & space complexity</li>
              </ul>
            </div>
          </div>

          {/* Results Section */}
          <div>
            {loading && <LoadingSpinner message="Analyzing your code..." />}
            
            {result && (
              <div className="space-y-4">
                {result.demoMode && (
                  <Alert type="warning" message="Demo mode active. Configure Gemini API key for full AI analysis." />
                )}

                {/* Code Quality Score */}
                {result.analysis.codeQuality && (
                  <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-blue-400">Code Quality Score</h3>
                      <div className="text-3xl font-bold text-white">{result.analysis.codeQuality.score}/100</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-slate-400">Readability</p>
                        <p className="text-sm font-semibold text-slate-200">{result.analysis.codeQuality.readability}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Maintainability</p>
                        <p className="text-sm font-semibold text-slate-200">{result.analysis.codeQuality.maintainability}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Testability</p>
                        <p className="text-sm font-semibold text-slate-200">{result.analysis.codeQuality.testability}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                  <div className="flex border-b border-slate-700 overflow-x-auto">
                    {['overview', 'issues', 'performance', 'security', 'improved'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                          activeTab === tab
                            ? 'bg-slate-700 text-white border-b-2 border-primary'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="p-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-green-400 mb-2">Code Explanation</h4>
                          <p className="text-slate-300">{result.analysis.explanation}</p>
                        </div>
                        
                        {result.analysis.complexity && (
                          <div>
                            <h4 className="text-sm font-semibold text-purple-400 mb-2">Complexity Analysis</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-slate-900/50 p-3 rounded">
                                <p className="text-xs text-slate-400 mb-1">Time Complexity</p>
                                <p className="text-sm font-mono text-slate-200">{result.analysis.complexity.time}</p>
                              </div>
                              <div className="bg-slate-900/50 p-3 rounded">
                                <p className="text-xs text-slate-400 mb-1">Space Complexity</p>
                                <p className="text-sm font-mono text-slate-200">{result.analysis.complexity.space}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Issues Tab */}
                    {activeTab === 'issues' && (
                      <div className="space-y-4">
                        {result.analysis.errors && result.analysis.errors.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-red-400 mb-3">Errors</h4>
                            <ul className="space-y-2">
                              {result.analysis.errors.map((error, idx) => (
                                <li key={idx} className="flex items-start space-x-2 bg-red-900/20 p-3 rounded">
                                  <span className="text-red-400 mt-1">•</span>
                                  <span className="text-slate-300 text-sm">{error}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {result.analysis.warnings && result.analysis.warnings.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-yellow-400 mb-3">Warnings</h4>
                            <ul className="space-y-2">
                              {result.analysis.warnings.map((warning, idx) => (
                                <li key={idx} className="flex items-start space-x-2 bg-yellow-900/20 p-3 rounded">
                                  <span className="text-yellow-400 mt-1">⚠</span>
                                  <span className="text-slate-300 text-sm">{warning}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {result.analysis.suggestions && result.analysis.suggestions.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-blue-400 mb-3">Suggestions</h4>
                            <ul className="space-y-2">
                              {result.analysis.suggestions.map((suggestion, idx) => (
                                <li key={idx} className="flex items-start space-x-2 bg-blue-900/20 p-3 rounded">
                                  <span className="text-blue-400 mt-1">💡</span>
                                  <span className="text-slate-300 text-sm">{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {(!result.analysis.errors || result.analysis.errors.length === 0) &&
                         (!result.analysis.warnings || result.analysis.warnings.length === 0) && (
                          <div className="text-center py-8 text-green-400">
                            ✓ No issues found! Your code looks good.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Performance Tab */}
                    {activeTab === 'performance' && result.analysis.performance && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-purple-400">Performance Rating</h4>
                          <span className={`px-3 py-1 rounded text-sm font-semibold ${
                            result.analysis.performance.rating === 'Excellent' ? 'bg-green-900/30 text-green-400' :
                            result.analysis.performance.rating === 'Good' ? 'bg-blue-900/30 text-blue-400' :
                            result.analysis.performance.rating === 'Fair' ? 'bg-yellow-900/30 text-yellow-400' :
                            'bg-red-900/30 text-red-400'
                          }`}>
                            {result.analysis.performance.rating}
                          </span>
                        </div>

                        {result.analysis.performance.bottlenecks && result.analysis.performance.bottlenecks.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-red-400 mb-2">Bottlenecks</h4>
                            <ul className="space-y-2">
                              {result.analysis.performance.bottlenecks.map((bottleneck, idx) => (
                                <li key={idx} className="text-sm text-slate-300 bg-slate-900/50 p-3 rounded">
                                  {bottleneck}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {result.analysis.performance.optimizations && result.analysis.performance.optimizations.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-green-400 mb-2">Optimizations</h4>
                            <ul className="space-y-2">
                              {result.analysis.performance.optimizations.map((opt, idx) => (
                                <li key={idx} className="text-sm text-slate-300 bg-slate-900/50 p-3 rounded">
                                  {opt}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                      <div className="space-y-4">
                        {result.analysis.security && result.analysis.security.length > 0 ? (
                          <div>
                            <h4 className="text-sm font-semibold text-red-400 mb-3">Security Concerns</h4>
                            <ul className="space-y-2">
                              {result.analysis.security.map((issue, idx) => (
                                <li key={idx} className="flex items-start space-x-2 bg-red-900/20 p-3 rounded border border-red-500/30">
                                  <span className="text-red-400 mt-1">🔒</span>
                                  <span className="text-slate-300 text-sm">{issue}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-green-400">
                            ✓ No security issues detected
                          </div>
                        )}

                        {result.analysis.bestPractices && result.analysis.bestPractices.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-blue-400 mb-3">Best Practices</h4>
                            <ul className="space-y-2">
                              {result.analysis.bestPractices.map((practice, idx) => (
                                <li key={idx} className="text-sm text-slate-300 bg-slate-900/50 p-3 rounded">
                                  {practice}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Improved Code Tab */}
                    {activeTab === 'improved' && result.analysis.correctedCode && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-green-400">Improved Code</h4>
                          <button
                            onClick={() => copyToClipboard(result.analysis.correctedCode)}
                            className="flex items-center space-x-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded transition-colors text-sm"
                          >
                            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span>{copied ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <pre className="bg-slate-900 p-4 rounded overflow-x-auto border border-slate-700">
                          <code className="text-sm text-slate-300 font-mono">{result.analysis.correctedCode}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!loading && !result && (
              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-12 text-center">
                <Code className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Enter your code and click "Analyze Code" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeAnalyzer;
