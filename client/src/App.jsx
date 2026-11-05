import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CodeAnalyzer from './pages/CodeAnalyzer';
import SleepPlanner from './pages/SleepPlanner';
import YouTubeSummarizer from './pages/YouTubeSummarizer';
import PDFHighlighter from './pages/PDFHighlighter';
import SkillForecast from './pages/SkillForecast';
import Notebook from './pages/Notebook';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/code-analyzer" element={<CodeAnalyzer />} />
        <Route path="/sleep-planner" element={<SleepPlanner />} />
        <Route path="/youtube-summarizer" element={<YouTubeSummarizer />} />
        <Route path="/pdf-highlighter" element={<PDFHighlighter />} />
        <Route path="/skill-forecast" element={<SkillForecast />} />
        <Route path="/notebook" element={<Notebook />} />
      </Routes>
    </Router>
  );
}

export default App;
