import express from 'express';
import { generateContent, isGeminiConfigured } from '../services/gemini.js';

const router = express.Router();

const generateLocalRoadmap = (skill, currentLevel, targetLevel, hoursPerDay, deadline) => {
  const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
  const currentIndex = levels.indexOf(currentLevel.toLowerCase());
  const targetIndex = levels.indexOf(targetLevel.toLowerCase());
  
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const totalDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
  const weeks = Math.ceil(totalDays / 7);

  const roadmap = {
    skill,
    currentLevel,
    targetLevel,
    estimatedWeeks: weeks,
    totalHours: weeks * 7 * hoursPerDay,
    milestones: []
  };

  const phases = [];
  if (currentIndex < 1 && targetIndex >= 1) phases.push('Foundation');
  if (currentIndex < 2 && targetIndex >= 2) phases.push('Intermediate Practice');
  if (currentIndex < 3 && targetIndex >= 3) phases.push('Advanced Concepts');
  if (targetIndex === 3) phases.push('Expert Mastery');

  const weeksPerPhase = Math.floor(weeks / Math.max(phases.length, 1));

  phases.forEach((phase, index) => {
    const weekStart = index * weeksPerPhase + 1;
    const weekEnd = Math.min((index + 1) * weeksPerPhase, weeks);
    
    roadmap.milestones.push({
      phase,
      weeks: `Week ${weekStart}${weekEnd > weekStart ? ` - ${weekEnd}` : ''}`,
      focus: `${phase} skills in ${skill}`,
      tasks: [
        `Study core concepts of ${phase.toLowerCase()}`,
        `Complete practice exercises (${hoursPerDay} hours/day)`,
        `Build small projects applying ${phase.toLowerCase()} skills`,
        `Review and reinforce learning`
      ],
      hoursPerWeek: hoursPerDay * 7
    });
  });

  roadmap.recommendations = [
    `Dedicate ${hoursPerDay} hours daily to consistent practice`,
    `Focus on hands-on projects and real-world applications`,
    `Track your progress weekly and adjust as needed`,
    `Join communities and forums related to ${skill}`,
    `Build a portfolio to demonstrate your skills`,
    'Take breaks to avoid burnout and maintain quality learning'
  ];

  roadmap.disclaimer = 'This is an estimated timeline. Actual progress depends on prior knowledge, learning pace, and consistent effort.';

  return roadmap;
};

router.post('/skill-forecast', async (req, res, next) => {
  try {
    const { skill, currentLevel, targetLevel, hoursPerDay, deadline } = req.body;

    if (!skill || !currentLevel || !targetLevel || !hoursPerDay) {
      return res.status(400).json({ 
        error: 'Skill, current level, target level, and daily hours are required' 
      });
    }

    const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
    if (!validLevels.includes(currentLevel.toLowerCase()) || !validLevels.includes(targetLevel.toLowerCase())) {
      return res.status(400).json({ 
        error: 'Valid levels are: beginner, intermediate, advanced, expert' 
      });
    }

    const hours = parseFloat(hoursPerDay);
    if (hours <= 0 || hours > 12) {
      return res.status(400).json({ error: 'Daily hours must be between 0 and 12' });
    }

    if (!isGeminiConfigured()) {
      const roadmap = generateLocalRoadmap(skill, currentLevel, targetLevel, hours, deadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
      return res.json({
        ...roadmap,
        demoMode: false,
        message: 'Roadmap generated using local algorithm. Configure Gemini API key for AI-personalized learning paths.'
      });
    }

    const prompt = `Create a personalized learning roadmap for someone who wants to learn ${skill}.

Current Details:
- Skill: ${skill}
- Current Level: ${currentLevel}
- Target Level: ${targetLevel}
- Daily Study Hours: ${hours}
- Target Deadline: ${deadline || 'Flexible'}

Generate a comprehensive learning roadmap in this JSON format:

{
  "skill": "${skill}",
  "currentLevel": "${currentLevel}",
  "targetLevel": "${targetLevel}",
  "estimatedWeeks": number,
  "totalHours": number,
  "milestones": [
    {
      "phase": "Phase name",
      "weeks": "Week range",
      "focus": "What to focus on",
      "tasks": ["Specific task 1", "Specific task 2", "Specific task 3"],
      "hoursPerWeek": number
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "resources": ["Recommended resource 1", "Recommended resource 2"],
  "disclaimer": "Note that this is an estimate"
}

Be specific and realistic. Break down the journey into clear phases with actionable tasks.`;

    const response = await generateContent(prompt);
    
    let roadmap;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        roadmap = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      roadmap = generateLocalRoadmap(skill, currentLevel, targetLevel, hours, deadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
    }

    res.json({ ...roadmap, demoMode: false });
  } catch (error) {
    next(error);
  }
});

export default router;
