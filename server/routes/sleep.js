import express from 'express';
import { generateContent, isGeminiConfigured } from '../services/gemini.js';

const router = express.Router();

const generateLocalSchedule = (examDate, studyHours, sleepHours, stressLevel, priorities) => {
  const now = new Date();
  const exam = new Date(examDate);
  const daysUntilExam = Math.ceil((exam - now) / (1000 * 60 * 60 * 24));
  
  const schedule = [];
  const totalStudyHours = Math.max(studyHours, 1);
  const sessionsPerDay = Math.ceil(totalStudyHours / 2); // 2-hour study blocks
  
  for (let day = 1; day <= Math.min(daysUntilExam, 7); day++) {
    const daySchedule = {
      day: `Day ${day}`,
      date: new Date(now.getTime() + day * 24 * 60 * 60 * 1000).toLocaleDateString(),
      activities: []
    };

    // Morning session
    daySchedule.activities.push({
      time: '08:00 - 10:00',
      activity: 'Study Session 1',
      focus: priorities || 'Core concepts review',
      type: 'study'
    });

    // Break
    daySchedule.activities.push({
      time: '10:00 - 10:30',
      activity: 'Break',
      focus: 'Rest and refresh',
      type: 'break'
    });

    // Mid-morning session
    if (totalStudyHours >= 4) {
      daySchedule.activities.push({
        time: '10:30 - 12:30',
        activity: 'Study Session 2',
        focus: 'Practice problems',
        type: 'study'
      });
    }

    // Lunch
    daySchedule.activities.push({
      time: '12:30 - 13:30',
      activity: 'Lunch Break',
      focus: 'Meal and relaxation',
      type: 'break'
    });

    // Afternoon session
    daySchedule.activities.push({
      time: '14:00 - 16:00',
      activity: 'Study Session 3',
      focus: 'Review and revision',
      type: 'study'
    });

    // Evening break
    daySchedule.activities.push({
      time: '16:00 - 17:00',
      activity: 'Exercise/Recreation',
      focus: stressLevel === 'high' ? 'Stress relief activities' : 'Physical activity',
      type: 'break'
    });

    // Evening session (if needed)
    if (totalStudyHours >= 6) {
      daySchedule.activities.push({
        time: '17:00 - 19:00',
        activity: 'Study Session 4',
        focus: 'Weak areas and doubts',
        type: 'study'
      });
    }

    // Dinner
    daySchedule.activities.push({
      time: '19:00 - 20:00',
      activity: 'Dinner',
      focus: 'Meal time',
      type: 'break'
    });

    // Light revision
    daySchedule.activities.push({
      time: '20:00 - 21:00',
      activity: 'Light Revision',
      focus: 'Quick review of the day',
      type: 'study'
    });

    // Wind down
    daySchedule.activities.push({
      time: '21:00 - 22:00',
      activity: 'Wind Down',
      focus: 'Relaxation before sleep',
      type: 'break'
    });

    // Sleep
    const sleepStart = '22:00';
    const sleepEnd = sleepHours >= 8 ? '06:00' : '07:00';
    daySchedule.activities.push({
      time: `${sleepStart} - ${sleepEnd}`,
      activity: 'Sleep',
      focus: `${sleepHours} hours of rest`,
      type: 'sleep'
    });

    schedule.push(daySchedule);
  }

  return {
    schedule,
    summary: {
      totalDays: Math.min(daysUntilExam, 7),
      dailyStudyHours: totalStudyHours,
      dailySleepHours: sleepHours,
      examDate: exam.toLocaleDateString(),
      recommendations: [
        `Study ${totalStudyHours} hours daily with regular breaks`,
        `Maintain ${sleepHours} hours of sleep each night`,
        stressLevel === 'high' ? 'Include stress management activities daily' : 'Keep stress levels manageable',
        'Take 15-30 minute breaks between study sessions',
        'Review the day\'s material before sleeping for better retention'
      ]
    }
  };
};

router.post('/sleep-plan', async (req, res, next) => {
  try {
    const { examDate, studyHours, sleepHours, stressLevel, priorities } = req.body;

    if (!examDate) {
      return res.status(400).json({ error: 'Exam date is required' });
    }

    const exam = new Date(examDate);
    const now = new Date();
    
    if (exam <= now) {
      return res.status(400).json({ error: 'Exam date must be in the future' });
    }

    const hours = parseFloat(studyHours) || 6;
    const sleep = parseFloat(sleepHours) || 7;
    const stress = stressLevel || 'medium';

    // ALWAYS use local algorithm for instant response
    const plan = generateLocalSchedule(examDate, hours, sleep, stress, priorities);
    
    // Return immediately with local schedule
    return res.json({
      ...plan,
      demoMode: false,
      generatedBy: 'local_algorithm',
      message: 'Schedule generated instantly using optimized algorithm.'
    });

  } catch (error) {
    next(error);
  }
});

export default router;
