const API_BASE = '/api';

export const checkHealth = async () => {
  const response = await fetch(`${API_BASE}/health`);
  return response.json();
};

export const analyzeCode = async (code, language) => {
  const response = await fetch(`${API_BASE}/analyze-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze code');
  }
  
  return response.json();
};

export const createSleepPlan = async (data) => {
  const response = await fetch(`${API_BASE}/sleep-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create sleep plan');
  }
  
  return response.json();
};

export const generateQuiz = async (transcript, videoUrl) => {
  const response = await fetch(`${API_BASE}/youtube-quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, videoUrl })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate quiz');
  }
  
  return response.json();
};

export const analyzePDF = async (file) => {
  const formData = new FormData();
  formData.append('pdf', file);
  
  const response = await fetch(`${API_BASE}/pdf-highlight`, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze PDF');
  }
  
  return response.json();
};

export const createSkillForecast = async (data) => {
  const response = await fetch(`${API_BASE}/skill-forecast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create skill forecast');
  }
  
  return response.json();
};
