import React, { useState } from 'react';
import { FileText, Upload, Lightbulb, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { analyzePDF } from '../services/api';

const PDFHighlighter = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await analyzePDF(file);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'definition': return 'bg-blue-900/30 border-blue-500';
      case 'concept': return 'bg-purple-900/30 border-purple-500';
      case 'key_point': return 'bg-green-900/30 border-green-500';
      case 'example': return 'bg-yellow-900/30 border-yellow-500';
      default: return 'bg-slate-700 border-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/10 to-slate-900">
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
            <FileText className="w-8 h-8 text-green-400" />
            <h1 className="text-4xl font-bold">Smart PDF Highlighter</h1>
          </div>
          <p className="text-slate-400">
            Extract text and automatically identify important concepts for exam preparation.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Upload PDF Document</label>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">
                      {file ? file.name : 'Click to upload PDF'}
                    </p>
                    <p className="text-slate-600 text-xs mt-2">Max size: 5MB</p>
                  </label>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading || !file}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-slate-700 disabled:to-slate-700 rounded-lg font-semibold transition-all"
              >
                {loading ? 'Analyzing...' : 'Analyze PDF'}
              </button>

              {error && <Alert type="error" message={error} />}

              <div className="pt-4 border-t border-slate-700">
                <h4 className="text-sm font-semibold mb-2 text-slate-400">What this tool does:</h4>
                <ul className="text-xs text-slate-500 space-y-1">
                  <li>• Extracts text from PDF documents</li>
                  <li>• Identifies key concepts and definitions</li>
                  <li>• Highlights exam-relevant content</li>
                  <li>• Generates summarized takeaways</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {loading && <LoadingSpinner message="Extracting and analyzing PDF content..." />}
            
            {result && (
              <div className="space-y-6">
                {result.demoMode && (
                  <Alert type="warning" message="Demo mode: Text extracted. Configure Gemini API key for AI-powered highlighting." />
                )}

                {result.message && (
                  <Alert type="info" message={result.message} />
                )}

                {/* File Info */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">File Name</p>
                      <p className="font-semibold">{result.fileName}</p>
                    </div>
                    {result.totalPages && (
                      <div>
                        <p className="text-sm text-slate-400">Pages</p>
                        <p className="font-semibold">{result.totalPages}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Takeaways */}
                {result.keyTakeaways && result.keyTakeaways.length > 0 && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-yellow-400 flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Key Takeaways
                    </h3>
                    <ul className="space-y-2">
                      {result.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          <span className="text-slate-300">{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Summary */}
                {result.summary && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-3 text-blue-400">Document Summary</h3>
                    <p className="text-slate-300 leading-relaxed">{result.summary}</p>
                  </div>
                )}

                {/* Highlights */}
                {result.highlights && result.highlights.length > 0 && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-green-400">Important Highlights</h3>
                    <div className="space-y-3">
                      {result.highlights.map((highlight, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border-l-4 ${getCategoryColor(highlight.category)}`}
                        >
                          <p className="text-slate-200 mb-2 italic">"{highlight.text}"</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">{highlight.reason}</span>
                            <span className="text-xs px-2 py-1 bg-slate-700 rounded capitalize">
                              {highlight.category?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Text */}
                {result.extractedText && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-slate-400">Extracted Text</h3>
                    <div className="bg-slate-900 p-4 rounded max-h-96 overflow-y-auto">
                      <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">
                        {result.extractedText}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!loading && !result && (
              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-12 text-center">
                <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Upload a PDF document to extract and analyze important content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFHighlighter;
