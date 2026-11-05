import React, { useState } from 'react';
import { Youtube, BookOpen, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { generateQuiz } from '../services/api';

const YouTubeSummarizer = () => {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async () => {
    if (!transcript.trim()) {
      setError('Please paste the video transcript');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setUserAnswers({});
    setShowResults(false);

    try {
      const data = await generateQuiz(transcript, videoUrl);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIdx, answerIdx) => {
    setUserAnswers({ ...userAnswers, [questionIdx]: answerIdx });
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!result?.quiz) return 0;
    let correct = 0;
    result.quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) correct++;
    });
    return correct;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/10 to-slate-900">
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
            <Youtube className="w-8 h-8 text-red-400" />
            <h1 className="text-4xl font-bold">YouTube Quiz Generator</h1>
          </div>
          <p className="text-slate-400">
            Generate summaries and interactive quizzes from educational video transcripts.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">YouTube URL (Optional)</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Video Transcript *</label>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste the video transcript here..."
                  rows={12}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  required
                />
                <p className="text-xs text-slate-500 mt-2">
                  Tip: You can get transcripts from YouTube by clicking "Show transcript" below the video.
                </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-slate-700 disabled:to-slate-700 rounded-lg font-semibold transition-all"
              >
                {loading ? 'Generating...' : 'Generate Summary & Quiz'}
              </button>

              {error && <Alert type="error" message={error} />}
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {loading && <LoadingSpinner message="Analyzing transcript and generating quiz..." />}
            
            {result && (
              <div className="space-y-6">
                {result.demoMode && (
                  <Alert type="warning" message="Demo mode active. Configure Gemini API key for AI-powered analysis." />
                )}

                {/* Summary */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Summary
                  </h3>
                  <p className="text-slate-300 leading-relaxed">{result.summary}</p>
                </div>

                {/* Key Points */}
                {result.keyPoints && result.keyPoints.length > 0 && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-green-400">Key Learning Points</h3>
                    <ul className="space-y-2">
                      {result.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span className="text-slate-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quiz */}
                {result.quiz && result.quiz.length > 0 && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-6 text-purple-400">Practice Quiz</h3>
                    
                    <div className="space-y-6">
                      {result.quiz.map((question, qIdx) => (
                        <div key={qIdx} className="border-b border-slate-700 pb-6 last:border-b-0">
                          <p className="font-semibold mb-3">
                            {qIdx + 1}. {question.question}
                          </p>
                          
                          <div className="space-y-2">
                            {question.options.map((option, oIdx) => {
                              const isSelected = userAnswers[qIdx] === oIdx;
                              const isCorrect = oIdx === question.correctAnswer;
                              const showCorrect = showResults && isCorrect;
                              const showIncorrect = showResults && isSelected && !isCorrect;

                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => !showResults && handleAnswerSelect(qIdx, oIdx)}
                                  disabled={showResults}
                                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                                    showCorrect
                                      ? 'bg-green-900/30 border-green-500'
                                      : showIncorrect
                                      ? 'bg-red-900/30 border-red-500'
                                      : isSelected
                                      ? 'bg-primary/20 border-primary'
                                      : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span>{option}</span>
                                    {showCorrect && <CheckCircle className="w-5 h-5 text-green-400" />}
                                    {showIncorrect && <XCircle className="w-5 h-5 text-red-400" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {showResults && question.explanation && (
                            <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded text-sm">
                              <p className="text-blue-300">
                                <strong>Explanation:</strong> {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {!showResults && Object.keys(userAnswers).length > 0 && (
                      <button
                        onClick={handleSubmitQuiz}
                        className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold transition-all"
                      >
                        Submit Quiz
                      </button>
                    )}

                    {showResults && (
                      <div className="mt-6 p-6 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-lg text-center">
                        <p className="text-3xl font-bold mb-2">
                          {calculateScore()} / {result.quiz.length}
                        </p>
                        <p className="text-slate-300">
                          Score: {Math.round((calculateScore() / result.quiz.length) * 100)}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {!loading && !result && (
              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-12 text-center">
                <Youtube className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">Paste a video transcript and click generate to create a summary and quiz</p>
                <p className="text-sm text-slate-500">Get YouTube transcripts by clicking "Show transcript" below any video</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeSummarizer;
