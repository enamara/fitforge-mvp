import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Activity, Users, Target, TrendingUp, Calendar, Heart, Dumbbell, Clock, Award, ChevronRight, ChevronLeft, Plus, Check, AlertTriangle, User, FileText, Home, BarChart2, Clipboard, Utensils, Shield, Zap, Sun, Moon, Droplets, ArrowRight, Star, Trophy, Flag, Play, Save, X, Download, Briefcase, Monitor, LogIn, LogOut, Eye, Video, Flame, Lock, Mail, Phone, AlertCircle } from 'lucide-react';

// Exercise Library
const EXERCISE_LIBRARY = {
  'goblet-squat': {
    name: 'Goblet Squat', category: 'Lower Body', equipment: 'Kettlebell/Dumbbell',
    muscles: ['Quadriceps', 'Glutes', 'Core'], difficulty: 'beginner', demo: '🏋️',
    formCues: ['Hold weight at chest height', 'Feet shoulder-width apart, toes slightly out', 'Push hips back and bend knees', 'Keep chest up and core engaged', 'Descend until thighs parallel', 'Drive through heels to stand'],
    commonMistakes: ['Knees caving inward', 'Rounding lower back', 'Rising on toes'],
    scaling: { beginner: { sets: 3, reps: '8-10', rest: 90 }, intermediate: { sets: 4, reps: '10-12', rest: 75 }, advanced: { sets: 4, reps: '12-15', rest: 60 } }
  },
  'back-squat': {
    name: 'Back Squat', category: 'Lower Body', equipment: 'Barbell',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'], difficulty: 'intermediate', demo: '🏋️‍♂️',
    formCues: ['Bar on upper traps', 'Feet shoulder-width or wider', 'Brace core, unrack bar', 'Descend by pushing hips back', 'Knees track over toes', 'Drive up through midfoot'],
    commonMistakes: ['Excessive forward lean', 'Heel rise', 'Knee valgus'],
    scaling: { beginner: { sets: 3, reps: '6-8', rest: 120 }, intermediate: { sets: 4, reps: '5-6', rest: 120 }, advanced: { sets: 5, reps: '3-5', rest: 150 } }
  },
  'romanian-deadlift': {
    name: 'Romanian Deadlift', category: 'Lower Body', equipment: 'Barbell/Dumbbells',
    muscles: ['Hamstrings', 'Glutes', 'Lower Back'], difficulty: 'intermediate', demo: '🔥',
    formCues: ['Arms straight, shoulder-width grip', 'Slight knee bend maintained', 'Hinge at hips, push them back', 'Lower until hamstring stretch', 'Keep back flat', 'Squeeze glutes to stand'],
    commonMistakes: ['Rounding back', 'Too much knee bend', 'Weight far from body'],
    scaling: { beginner: { sets: 3, reps: '8-10', rest: 90 }, intermediate: { sets: 3, reps: '10-12', rest: 75 }, advanced: { sets: 4, reps: '8-10', rest: 90 } }
  },
  'hip-thrust': {
    name: 'Hip Thrust', category: 'Lower Body', equipment: 'Barbell/Bench',
    muscles: ['Glutes', 'Hamstrings'], difficulty: 'beginner', demo: '🍑',
    formCues: ['Upper back on bench', 'Bar across hip crease', 'Feet flat, shins vertical at top', 'Drive through heels, squeeze glutes', 'Chin tucked, ribs down', 'Lower with control'],
    commonMistakes: ['Hyperextending back', 'Feet wrong position', 'Not squeezing at top'],
    scaling: { beginner: { sets: 3, reps: '10-12', rest: 75 }, intermediate: { sets: 4, reps: '10-12', rest: 75 }, advanced: { sets: 4, reps: '8-10', rest: 90 } }
  },
  'bulgarian-split-squat': {
    name: 'Bulgarian Split Squat', category: 'Lower Body', equipment: 'Dumbbells/Bench',
    muscles: ['Quadriceps', 'Glutes', 'Balance'], difficulty: 'intermediate', demo: '🦵',
    formCues: ['Rear foot on bench', 'Front foot 2 feet from bench', 'Torso upright', 'Lower until front thigh parallel', 'Knee tracks over toes', 'Drive through front heel'],
    commonMistakes: ['Too close to bench', 'Leaning forward', 'Knee caving'],
    scaling: { beginner: { sets: 3, reps: '8 each', rest: 90 }, intermediate: { sets: 3, reps: '10 each', rest: 75 }, advanced: { sets: 4, reps: '10-12 each', rest: 75 } }
  },
  'push-up': {
    name: 'Push-Up', category: 'Upper Body', equipment: 'Bodyweight',
    muscles: ['Chest', 'Shoulders', 'Triceps', 'Core'], difficulty: 'beginner', demo: '💪',
    formCues: ['Hands wider than shoulders', 'Body straight line', 'Core tight, glutes engaged', 'Lower chest to ground', 'Elbows at 45 degrees', 'Push to full extension'],
    commonMistakes: ['Hips sagging', 'Elbows flaring 90°', 'Not full range'],
    scaling: { beginner: { sets: 3, reps: '8-12', rest: 60 }, intermediate: { sets: 4, reps: '12-15', rest: 60 }, advanced: { sets: 4, reps: '15-20', rest: 45 } }
  },
  'bench-press': {
    name: 'Bench Press', category: 'Upper Body', equipment: 'Barbell/Bench',
    muscles: ['Chest', 'Shoulders', 'Triceps'], difficulty: 'intermediate', demo: '🏋️',
    formCues: ['Lie flat, eyes under bar', 'Grip wider than shoulders', 'Retract shoulder blades', 'Feet flat on floor', 'Lower to mid-chest', 'Press up and back'],
    commonMistakes: ['Bouncing off chest', 'Elbows flaring', 'Hips lifting'],
    scaling: { beginner: { sets: 3, reps: '8-10', rest: 120 }, intermediate: { sets: 4, reps: '6-8', rest: 120 }, advanced: { sets: 5, reps: '5', rest: 150 } }
  },
  'bent-over-row': {
    name: 'Bent Over Row', category: 'Upper Body', equipment: 'Barbell/Dumbbells',
    muscles: ['Back', 'Biceps', 'Rear Delts'], difficulty: 'intermediate', demo: '💪',
    formCues: ['Hinge forward 45 degrees', 'Knees bent, back flat', 'Arms hanging straight', 'Pull to lower chest', 'Squeeze shoulder blades', 'Lower with control'],
    commonMistakes: ['Using momentum', 'Standing too upright', 'Rounding back'],
    scaling: { beginner: { sets: 3, reps: '10-12', rest: 90 }, intermediate: { sets: 4, reps: '8-10', rest: 90 }, advanced: { sets: 4, reps: '6-8', rest: 90 } }
  },
  'overhead-press': {
    name: 'Overhead Press', category: 'Upper Body', equipment: 'Barbell/Dumbbells',
    muscles: ['Shoulders', 'Triceps', 'Core'], difficulty: 'intermediate', demo: '🙌',
    formCues: ['Bar at collarbone', 'Grip just outside shoulders', 'Brace core, squeeze glutes', 'Press straight up', 'Lock out over mid-foot', 'Lower with control'],
    commonMistakes: ['Excessive back arch', 'Pressing forward', 'Using leg drive'],
    scaling: { beginner: { sets: 3, reps: '10-12', rest: 90 }, intermediate: { sets: 4, reps: '8-10', rest: 90 }, advanced: { sets: 4, reps: '6-8', rest: 120 } }
  },
  'pull-up': {
    name: 'Pull-Up', category: 'Upper Body', equipment: 'Pull-up Bar',
    muscles: ['Lats', 'Biceps', 'Core'], difficulty: 'intermediate', demo: '💪',
    formCues: ['Hang with arms extended', 'Hands outside shoulder-width', 'Engage lats first', 'Drive elbows down', 'Chin over bar', 'Lower with control'],
    commonMistakes: ['Kipping', 'Partial range', 'Shoulders shrugging'],
    scaling: { beginner: { sets: 3, reps: '5-8 assisted', rest: 120 }, intermediate: { sets: 4, reps: '6-10', rest: 90 }, advanced: { sets: 4, reps: '10-12', rest: 90 } }
  },
  'plank': {
    name: 'Plank', category: 'Core', equipment: 'Bodyweight',
    muscles: ['Core', 'Shoulders', 'Glutes'], difficulty: 'beginner', demo: '🧘',
    formCues: ['Forearms on ground', 'Body in straight line', 'Core braced, glutes squeezed', 'Don\'t let hips sag', 'Breathe steadily', 'Neutral neck'],
    commonMistakes: ['Hips high or low', 'Holding breath', 'Looking up'],
    scaling: { beginner: { sets: 3, reps: '20-30s', rest: 60 }, intermediate: { sets: 3, reps: '45-60s', rest: 60 }, advanced: { sets: 3, reps: '60-90s', rest: 45 } }
  },
  'dead-bug': {
    name: 'Dead Bug', category: 'Core', equipment: 'Bodyweight',
    muscles: ['Core', 'Hip Flexors'], difficulty: 'beginner', demo: '🪲',
    formCues: ['Lie on back, arms up', 'Knees 90° over hips', 'Press lower back down', 'Extend opposite arm/leg', 'Keep back pressed down', 'Alternate sides'],
    commonMistakes: ['Back arching', 'Moving too fast', 'Holding breath'],
    scaling: { beginner: { sets: 3, reps: '8 each', rest: 60 }, intermediate: { sets: 3, reps: '12 each', rest: 45 }, advanced: { sets: 3, reps: '15 each', rest: 45 } }
  },
  'pallof-press': {
    name: 'Pallof Press', category: 'Core', equipment: 'Cable/Band',
    muscles: ['Core (Anti-rotation)'], difficulty: 'beginner', demo: '🎯',
    formCues: ['Stand perpendicular to cable', 'Hold at chest', 'Feet shoulder-width', 'Press hands out', 'Resist rotation 2-3s', 'Return and repeat'],
    commonMistakes: ['Rotating toward anchor', 'Too close to anchor', 'Too much weight'],
    scaling: { beginner: { sets: 3, reps: '10 each', rest: 60 }, intermediate: { sets: 3, reps: '12-15 each', rest: 45 }, advanced: { sets: 4, reps: '12-15 each', rest: 45 } }
  },
  'kettlebell-swing': {
    name: 'Kettlebell Swing', category: 'Power', equipment: 'Kettlebell',
    muscles: ['Glutes', 'Hamstrings', 'Core'], difficulty: 'intermediate', demo: '🔔',
    formCues: ['Feet wider than shoulders', 'Hinge at hips, flat back', 'Hike KB between legs', 'Snap hips forward', 'Arms float to chest height', 'Control the descent'],
    commonMistakes: ['Squatting not hinging', 'Using arms to lift', 'Hyperextending'],
    scaling: { beginner: { sets: 3, reps: '12-15', rest: 60 }, intermediate: { sets: 4, reps: '15-20', rest: 60 }, advanced: { sets: 5, reps: '20-25', rest: 45 } }
  },
  'box-jump': {
    name: 'Box Jump', category: 'Power', equipment: 'Plyo Box',
    muscles: ['Quadriceps', 'Glutes', 'Calves'], difficulty: 'intermediate', demo: '📦',
    formCues: ['Face box, feet hip-width', 'Swing arms back to load', 'Explode up, drive knees', 'Land softly, knees bent', 'Stand tall on box', 'Step down'],
    commonMistakes: ['Landing straight legs', 'Jumping off box', 'Box too high'],
    scaling: { beginner: { sets: 3, reps: '5-6', rest: 90 }, intermediate: { sets: 4, reps: '6-8', rest: 75 }, advanced: { sets: 4, reps: '8-10', rest: 60 } }
  },
  'farmers-carry': {
    name: 'Farmers Carry', category: 'Functional', equipment: 'Dumbbells/KB',
    muscles: ['Grip', 'Core', 'Traps'], difficulty: 'beginner', demo: '🧳',
    formCues: ['Pick up with flat back', 'Stand tall, shoulders back', 'Core braced, chest up', 'Controlled steps', 'Keep weights steady', 'Breathe steadily'],
    commonMistakes: ['Leaning', 'Hunching', 'Large steps'],
    scaling: { beginner: { sets: 3, reps: '30m', rest: 90 }, intermediate: { sets: 3, reps: '40m', rest: 75 }, advanced: { sets: 4, reps: '50m', rest: 75 } }
  }
};

const INITIAL_ASSESSMENTS = [
  { id: 'par-q', name: 'PAR-Q+ Questionnaire', description: 'Physical Activity Readiness Questionnaire', priority: 'essential' },
  { id: 'fms', name: 'Functional Movement Screen', description: 'Assess movement patterns', priority: 'essential' },
  { id: 'postural', name: 'Postural Assessment', description: 'Evaluate posture', priority: 'essential' },
  { id: 'cardio', name: 'Cardiovascular Test', description: 'Baseline cardio fitness', priority: 'recommended' },
  { id: 'strength', name: 'Strength Baseline', description: 'Push-ups, squats, plank', priority: 'recommended' },
  { id: 'flexibility', name: 'Flexibility Assessment', description: 'Sit-and-reach, mobility', priority: 'recommended' },
  { id: 'body-comp', name: 'Body Composition', description: 'Measurements, photos', priority: 'optional' },
  { id: 'balance', name: 'Balance Tests', description: 'Single-leg stance', priority: 'optional' }
];

const SIMS_PRINCIPLES = {
  strength: "Women respond exceptionally well to heavy lifting (70-85% 1RM).",
  recovery: "Women recover faster - shorter rest periods (60-90s) work well.",
  hiit: "Women excel at HIIT - short intense bursts drive adaptations.",
  plyo: "Plyometrics essential for bone density - include 2-3x/week."
};

const FitnessApp = () => {
  const [currentView, setCurrentView] = useState('login');
  const [userType, setUserType] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isDark] = useState(true);
  const [clientActiveTab, setClientActiveTab] = useState('overview'); // Lifted state for client dashboard tabs
  const [workoutViewMode, setWorkoutViewMode] = useState('suggested'); // 'suggested' or 'custom' - lifted to prevent re-render reset
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Handle resize for mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [clients, setClients] = useState([
    {
      id: 1, name: 'Sarah Mitchell', email: 'sarah.m@techcorp.com', password: 'demo123',
      gender: 'female', age: 34, height: 165, weight: 68, targetWeight: 62,
      status: 'active', // 'onboarding' or 'active'
      onboardingComplete: { health: true, lifestyle: true, injuries: true, goals: true, assessments: true },
      bloodPressure: '118/76', restingHR: 72,
      injuries: [
        { type: 'Lower back pain', date: '2023-06', status: 'recovered', notes: 'Herniated disc L4-L5' },
        { type: 'Knee tendinitis', date: '2024-01', status: 'managing', notes: 'Right knee, avoid high impact' }
      ],
      lifestyle: { occupation: 'Software Developer', workType: 'sedentary', hoursSeated: 8, sleepHours: 6.5, stressLevel: 7, waterIntake: 1.5 },
      goals: ['Lose weight', 'Build strength', 'Improve posture'],
      assessmentScores: { movement: 14, cardio: 55, strength: 65, flexibility: 45, balance: 60 },
      fitnessLevel: 'beginner', startDate: '2024-01-15', group: 'TechCorp Wellness', currentWeek: 6,
      useCustomWorkout: false,
      customWorkouts: [],
      weeklyLogs: [
        { week: 1, energy: 6, mood: 7, workoutsCompleted: 2, notes: 'Getting started!' },
        { week: 2, energy: 5, mood: 6, workoutsCompleted: 3, notes: 'Sore but good' },
        { week: 3, energy: 7, mood: 8, workoutsCompleted: 4, notes: 'Feeling stronger!' },
        { week: 4, energy: 7, mood: 8, workoutsCompleted: 4, notes: 'PR on deadlift!' },
        { week: 5, energy: 6, mood: 7, workoutsCompleted: 3, notes: 'Busy work week' },
        { week: 6, energy: 8, mood: 9, workoutsCompleted: 4, notes: 'Best week yet!' }
      ],
      strengthProgress: {
        squat: [{ week: 1, weight: 20 }, { week: 3, weight: 25 }, { week: 6, weight: 35 }],
        deadlift: [{ week: 1, weight: 30 }, { week: 3, weight: 40 }, { week: 6, weight: 50 }],
        bench: [{ week: 1, weight: 15 }, { week: 3, weight: 17.5 }, { week: 6, weight: 22.5 }]
      }
    },
    {
      id: 2, name: 'James Chen', email: 'j.chen@techcorp.com', password: 'demo123',
      gender: 'male', age: 42, height: 178, weight: 89, targetWeight: 82,
      status: 'active',
      onboardingComplete: { health: true, lifestyle: true, injuries: true, goals: true, assessments: true },
      bloodPressure: '128/84', restingHR: 78,
      injuries: [{ type: 'Shoulder impingement', date: '2023-09', status: 'recovered', notes: 'Avoid overhead press' }],
      lifestyle: { occupation: 'Project Manager', workType: 'mixed', hoursSeated: 6, sleepHours: 7, stressLevel: 8, waterIntake: 2 },
      goals: ['Build muscle', 'Improve cardio', 'Manage stress'],
      assessmentScores: { movement: 16, cardio: 62, strength: 75, flexibility: 50, balance: 65 },
      fitnessLevel: 'intermediate', startDate: '2024-01-08', group: 'TechCorp Wellness', currentWeek: 7,
      useCustomWorkout: false,
      customWorkouts: [],
      weeklyLogs: [
        { week: 1, energy: 7, mood: 6, workoutsCompleted: 3, notes: 'Solid start' },
        { week: 2, energy: 7, mood: 7, workoutsCompleted: 4, notes: 'Enjoying it' },
        { week: 3, energy: 8, mood: 7, workoutsCompleted: 4, notes: 'Cardio improving' },
        { week: 4, energy: 6, mood: 5, workoutsCompleted: 2, notes: 'Work stress' },
        { week: 5, energy: 7, mood: 7, workoutsCompleted: 4, notes: 'Back on track' },
        { week: 6, energy: 8, mood: 8, workoutsCompleted: 5, notes: 'Feeling great!' },
        { week: 7, energy: 8, mood: 8, workoutsCompleted: 4, notes: 'Consistent' }
      ],
      strengthProgress: {
        squat: [{ week: 1, weight: 80 }, { week: 4, weight: 90 }, { week: 7, weight: 100 }],
        deadlift: [{ week: 1, weight: 100 }, { week: 4, weight: 115 }, { week: 7, weight: 125 }],
        bench: [{ week: 1, weight: 70 }, { week: 4, weight: 77.5 }, { week: 7, weight: 85 }]
      }
    },
    {
      id: 3, name: 'Priya Sharma', email: 'priya.s@runclub.com', password: 'demo123',
      gender: 'female', age: 29, height: 160, weight: 55, targetWeight: 55,
      status: 'active',
      onboardingComplete: { health: true, lifestyle: true, injuries: true, goals: true, assessments: true },
      bloodPressure: '110/70', restingHR: 58,
      injuries: [],
      lifestyle: { occupation: 'Marketing Manager', workType: 'mixed', hoursSeated: 5, sleepHours: 7.5, stressLevel: 5, waterIntake: 2.5 },
      goals: ['Running performance', 'Upper body strength', 'Injury prevention'],
      assessmentScores: { movement: 18, cardio: 85, strength: 60, flexibility: 70, balance: 75 },
      fitnessLevel: 'advanced', startDate: '2024-02-01', group: 'City Runners Club', currentWeek: 4,
      // Runner-specific fields
      isRunner: true,
      runningClub: 'City Runners Club',
      runnerGoals: ['Sub-4hr marathon', 'Improve 5K time', 'Build running endurance'],
      currentPace: '5:30/km',
      weeklyMileage: 35,
      upcomingRaces: [{ name: 'Kampala Marathon', date: '2025-06-15', distance: '42.2km' }],
      useCustomWorkout: true,
      customWorkouts: [
        { id: 1, day: 'Monday', name: 'Easy Run + Strength', type: 'hybrid', duration: 60, exercises: [
          { name: '5K Easy Run', sets: 1, reps: '30 min', notes: 'Zone 2, conversational pace' },
          { name: 'Bulgarian Split Squats', sets: 3, reps: '10 each', notes: 'Light weight for runners' },
          { name: 'Single Leg RDL', sets: 3, reps: '8 each', notes: 'Balance focus' }
        ]},
        { id: 2, day: 'Wednesday', name: 'Interval Training', type: 'cardio', duration: 45, exercises: [
          { name: 'Warm-up Jog', sets: 1, reps: '10 min', notes: 'Easy pace' },
          { name: '400m Repeats', sets: 6, reps: '400m', notes: '90 sec rest between' },
          { name: 'Cool-down', sets: 1, reps: '10 min', notes: 'Walk/jog' }
        ]},
        { id: 3, day: 'Friday', name: 'Long Run', type: 'cardio', duration: 75, exercises: [
          { name: 'Long Slow Distance', sets: 1, reps: '12K', notes: 'Easy pace, stay in Zone 2' }
        ]},
        { id: 4, day: 'Saturday', name: 'Cross Training', type: 'strength', duration: 45, exercises: [
          { name: 'Swimming or Cycling', sets: 1, reps: '30 min', notes: 'Active recovery' },
          { name: 'Core Circuit', sets: 3, reps: '10 each', notes: 'Plank, dead bugs, bird dogs' }
        ]}
      ],
      weeklyLogs: [
        { week: 1, energy: 8, mood: 8, workoutsCompleted: 5, notes: 'Strong start' },
        { week: 2, energy: 9, mood: 9, workoutsCompleted: 6, notes: 'Loving variety' },
        { week: 3, energy: 8, mood: 8, workoutsCompleted: 5, notes: 'Good balance' },
        { week: 4, energy: 9, mood: 9, workoutsCompleted: 6, notes: 'New 10K PR!' }
      ],
      strengthProgress: {
        squat: [{ week: 1, weight: 50 }, { week: 4, weight: 57.5 }],
        deadlift: [{ week: 1, weight: 60 }, { week: 4, weight: 70 }],
        bench: [{ week: 1, weight: 30 }, { week: 4, weight: 35 }]
      }
    },
    {
      id: 4, name: 'David Okello', email: 'david.okello@gmail.com', password: 'demo123',
      gender: 'male', age: 28, height: 175, weight: 78, targetWeight: 75,
      status: 'active',
      onboardingComplete: { health: true, lifestyle: true, injuries: true, goals: true, assessments: true },
      bloodPressure: '120/78', restingHR: 68,
      injuries: [{ type: 'Ankle sprain', date: '2024-12', status: 'managing', notes: 'Light activity only, avoid jumping' }],
      lifestyle: { occupation: 'Accountant', workType: 'sedentary', hoursSeated: 9, sleepHours: 6, stressLevel: 6, waterIntake: 1.8 },
      goals: ['Lose weight', 'Build strength', 'Better sleep'],
      assessmentScores: { movement: 15, cardio: 50, strength: 55, flexibility: 40, balance: 50 },
      fitnessLevel: 'beginner', startDate: '2024-12-01', group: null, currentWeek: 8, // No group - general client
      isRunner: false,
      useCustomWorkout: false,
      customWorkouts: [],
      weeklyLogs: [
        { week: 1, energy: 5, mood: 5, workoutsCompleted: 2, notes: 'Starting out' },
        { week: 2, energy: 6, mood: 6, workoutsCompleted: 2, notes: 'Ankle bothering me' },
        { week: 3, energy: 6, mood: 6, workoutsCompleted: 3, notes: 'Going easy' },
        { week: 4, energy: 7, mood: 7, workoutsCompleted: 3, notes: 'Feeling better' },
        { week: 5, energy: 7, mood: 7, workoutsCompleted: 3, notes: 'Consistent' },
        { week: 6, energy: 7, mood: 8, workoutsCompleted: 4, notes: 'Great week!' },
        { week: 7, energy: 8, mood: 8, workoutsCompleted: 4, notes: 'Strong finish' },
        { week: 8, energy: 8, mood: 8, workoutsCompleted: 4, notes: 'Ready for more' }
      ],
      strengthProgress: {
        squat: [{ week: 1, weight: 30 }, { week: 4, weight: 35 }, { week: 8, weight: 45 }],
        deadlift: [{ week: 1, weight: 40 }, { week: 4, weight: 50 }, { week: 8, weight: 60 }],
        bench: [{ week: 1, weight: 25 }, { week: 4, weight: 30 }, { week: 8, weight: 37.5 }]
      }
    }
  ]);

  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [showPTProfileEdit, setShowPTProfileEdit] = useState(false);
  const [ptProfileForm, setPtProfileForm] = useState({ name: 'Marcus Thompson', email: 'marcus@fitforge.com', phone: '+256 700 123456' });
  const [selectedGroupForReport, setSelectedGroupForReport] = useState(null);
  const [selectedClientForReport, setSelectedClientForReport] = useState(null);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [assessmentClient, setAssessmentClient] = useState(null);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [viewingGroupMembers, setViewingGroupMembers] = useState(null);
  const [addingMemberToGroup, setAddingMemberToGroup] = useState(null);
  const [membershipRequests, setMembershipRequests] = useState([
    // Example requests
    // { id: 1, clientId: 4, groupId: 1, groupName: 'TechCorp Wellness', type: 'group', status: 'pending', date: '2024-02-15' },
    // { id: 2, clientId: 4, groupId: 1, challengeId: 1, groupName: 'TechCorp Wellness', challengeName: 'Q1 Fitness Challenge', type: 'challenge', status: 'pending', date: '2024-02-15' }
  ]);

  const [groups, setGroups] = useState([
    { id: 1, name: 'TechCorp Wellness', type: 'corporate', startDate: '2024-01-01', ptContact: 'Marcus Thompson',
      // Corporate admin credentials
      adminEmail: 'admin@techcorp.com', adminPassword: 'demo123', adminName: 'HR Manager',
      companyInfo: { industry: 'Technology', employeeCount: 150, fitnessGoal: 'Improve employee wellness and reduce sick days' },
      challenges: [
        { id: 1, name: 'Q1 Fitness Challenge', description: 'Complete 40 workouts in 12 weeks', challengeType: 'general', status: 'open', startDate: '2024-01-01', endDate: '2024-03-31', participants: [1, 2],
          milestones: [{ week: 4, goal: '15 workouts', reward: 'Water bottle' }, { week: 8, goal: '30 workouts', reward: 'Gym bag' }, { week: 12, goal: '40 workouts', reward: 'Free month' }] },
        { id: 2, name: 'Step Challenge', description: 'Walk 10,000 steps daily for 30 days', challengeType: 'walking', status: 'open', startDate: '2025-01-01', endDate: '2025-01-31', participants: [],
          milestones: [{ week: 2, goal: '150K steps', reward: 'Fitness tracker band' }, { week: 4, goal: '300K steps', reward: 'Running shoes voucher' }] }
      ]
    },
    { id: 2, name: 'City Runners Club', type: 'club', startDate: '2024-02-01', ptContact: 'Lisa Chen',
      challenges: [
        { id: 1, name: 'Multi-Sport February', description: 'Try 4 different activities this month', challengeType: 'wellness', status: 'closed', startDate: '2024-02-01', endDate: '2024-02-29', participants: [3],
          milestones: [{ week: 2, goal: '2 activities', reward: 'Club t-shirt' }, { week: 4, goal: '4 activities', reward: 'Race entry' }] },
        { id: 2, name: 'Spring 5K Training', description: '8-week beginner 5K program', challengeType: 'running', status: 'open', startDate: '2024-03-01', endDate: '2024-04-30', participants: [3],
          milestones: [{ week: 4, goal: 'Run 2K', reward: 'Running socks' }, { week: 8, goal: 'Complete 5K', reward: 'Medal' }] },
        { id: 3, name: 'Runner Strength Build', description: '12-week S&C for runners', challengeType: 'strength', status: 'open', startDate: '2025-01-01', endDate: '2025-03-31', participants: [3],
          milestones: [{ week: 6, goal: '50 squats test', reward: 'Resistance band set' }, { week: 12, goal: 'Complete program', reward: 'Massage voucher' }] }
      ]
    }
  ]);

  const colors = {
    primary: '#FF6B35', secondary: '#4ECDC4', accent: '#FFE66D', success: '#2ECC71',
    warning: '#F39C12', danger: '#E74C3C', dark: '#1A1A2E', darker: '#0F0F1A',
    text: '#FFFFFF', textMuted: '#A0A0B0', cardBg: '#252540', borderColor: '#3A3A5C'
  };

  // ============ LOCAL STORAGE PERSISTENCE ============
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Load data from localStorage on mount
  useEffect(() => {
    const savedClients = localStorage.getItem('fitforge-clients');
    const savedGroups = localStorage.getItem('fitforge-groups');
    const savedRequests = localStorage.getItem('fitforge-requests');
    
    if (savedClients) {
      try { setClients(JSON.parse(savedClients)); } catch (e) { console.log('Error loading clients'); }
    }
    if (savedGroups) {
      try { setGroups(JSON.parse(savedGroups)); } catch (e) { console.log('Error loading groups'); }
    }
    if (savedRequests) {
      try { setMembershipRequests(JSON.parse(savedRequests)); } catch (e) { console.log('Error loading requests'); }
    }
    // Mark data as loaded after a small delay to ensure state updates complete
    setTimeout(() => setDataLoaded(true), 100);
  }, []);

  // Save data to localStorage when it changes (only after initial load)
  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem('fitforge-clients', JSON.stringify(clients));
    }
  }, [clients, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem('fitforge-groups', JSON.stringify(groups));
    }
  }, [groups, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem('fitforge-requests', JSON.stringify(membershipRequests));
    }
  }, [membershipRequests, dataLoaded]);

  // Dynamic workout generator - handles runners and injury adaptations
  const generateDynamicWorkout = (client) => {
    // Defensive defaults for new/incomplete clients
    const gender = client.gender || 'male';
    const fitnessLevel = client.fitnessLevel || 'beginner';
    const injuries = client.injuries || [];
    const lifestyle = client.lifestyle || { workType: 'mixed', occupation: '', hoursSeated: 6, sleepHours: 7, stressLevel: 5, waterIntake: 2 };
    const goals = client.goals || ['General fitness'];
    const weeklyLogs = client.weeklyLogs || [];
    const currentWeek = client.currentWeek || 1;
    const isRunner = client.isRunner || false;
    
    const isFemale = gender === 'female';
    
    // Check for ACTIVE injuries (managing status only)
    const activeInjuries = injuries.filter(i => i.status === 'managing');
    const hasActiveBackPain = activeInjuries.some(i => i.type?.toLowerCase().includes('back'));
    const hasActiveKneeIssue = activeInjuries.some(i => i.type?.toLowerCase().includes('knee'));
    const hasActiveShoulderIssue = activeInjuries.some(i => i.type?.toLowerCase().includes('shoulder'));
    const hasActiveAnkleIssue = activeInjuries.some(i => i.type?.toLowerCase().includes('ankle'));
    const hasAnyActiveInjury = activeInjuries.length > 0;
    
    const isSedentary = lifestyle.workType === 'sedentary';
    
    const avgEnergy = weeklyLogs.length > 0 ? weeklyLogs.slice(-3).reduce((a, l) => a + l.energy, 0) / Math.min(3, weeklyLogs.length) : 7;
    const avgWorkouts = weeklyLogs.length > 0 ? weeklyLogs.slice(-3).reduce((a, l) => a + l.workoutsCompleted, 0) / Math.min(3, weeklyLogs.length) : 3;
    
    // Intensity adjustment - scale back if injured
    let intensity = 'standard';
    if (hasAnyActiveInjury) {
      intensity = 'recovery'; // Always prioritize recovery with active injuries
    } else if (avgEnergy >= 8 && avgWorkouts >= 4) {
      intensity = 'increase';
    } else if (avgEnergy <= 5 || avgWorkouts <= 2) {
      intensity = 'decrease';
    }

    const getExercise = (key) => {
      const ex = EXERCISE_LIBRARY[key];
      if (!ex) return null;
      const scale = ex.scaling[fitnessLevel] || ex.scaling.intermediate;
      let adjusted = { ...scale };
      if (intensity === 'increase') {
        adjusted.sets = Math.min(scale.sets + 1, 5);
        adjusted.progressNote = '⬆️ Increased!';
      } else if (intensity === 'decrease' || intensity === 'recovery') {
        adjusted.rest = scale.rest + 15;
        adjusted.sets = Math.max(scale.sets - 1, 2);
        adjusted.progressNote = intensity === 'recovery' ? '🩹 Injury recovery mode' : '💚 Recovery focus';
      }
      return { ...ex, id: key, prescription: adjusted };
    };

    // RUNNER-SPECIFIC WORKOUT GENERATION
    if (isRunner) {
      const philosophy = `Runner-focused strength & conditioning: Building resilience while supporting your running performance.`;
      
      const buildRunnerStrength = () => {
        const exercises = [];
        // Single-leg work is crucial for runners
        if (!hasActiveKneeIssue && !hasActiveAnkleIssue) {
          exercises.push({ name: 'Single Leg Romanian Deadlift', demo: '🦵', prescription: { sets: 3, reps: '8 each leg', rest: 60 }, formCues: ['Hip hinge, light weight', 'Focus on balance'] });
          exercises.push({ name: 'Bulgarian Split Squats', demo: '🏋️', prescription: { sets: 3, reps: '10 each leg', rest: 60 }, formCues: ['Control the descent', 'Drive through front heel'] });
        } else {
          exercises.push({ name: 'Clamshells', demo: '🐚', prescription: { sets: 3, reps: '15 each', rest: 45 }, formCues: ['Band optional', 'Squeeze glutes'] });
          exercises.push({ name: 'Glute Bridges', demo: '🌉', prescription: { sets: 3, reps: '15', rest: 45 }, formCues: ['Pause at top', 'No back strain'] });
        }
        exercises.push({ name: 'Step Ups', demo: '🪜', prescription: { sets: 3, reps: '10 each', rest: 60 }, formCues: ['Knee over ankle', 'Control descent'] });
        exercises.push({ name: 'Calf Raises', demo: '🦶', prescription: { sets: 3, reps: '15', rest: 45 }, formCues: ['Slow eccentric', 'Full range'] });
        if (!hasActiveBackPain) {
          exercises.push({ name: 'Plank', demo: '📐', prescription: { sets: 3, reps: '45 sec', rest: 45 }, formCues: ['Core tight', 'Flat back'] });
        }
        return { name: 'Runner Strength', type: 'strength', duration: 40, exercises };
      };

      const buildRunnerMobility = () => ({
        name: 'Runner Mobility & Prehab', type: 'recovery', duration: 30,
        exercises: [
          { name: 'Hip Flexor Stretch', demo: '🧘', prescription: { sets: 2, reps: '60 sec each', rest: 0 }, formCues: ['Lunge position', 'Squeeze back glute'] },
          { name: 'Pigeon Pose', demo: '🕊️', prescription: { sets: 2, reps: '60 sec each', rest: 0 }, formCues: ['Hip opener', 'Breathe deep'] },
          { name: 'Foam Roll IT Band', demo: '🧈', prescription: { sets: 1, reps: '2 min each', rest: 0 }, formCues: ['Slow rolling', 'Pause on tight spots'] },
          { name: 'Ankle Circles', demo: '🔄', prescription: { sets: 2, reps: '20 each', rest: 0 }, formCues: ['Full range', 'Both directions'] },
          { name: 'Leg Swings', demo: '🦿', prescription: { sets: 2, reps: '15 each', rest: 0 }, formCues: ['Front-back and side-side'] }
        ]
      });

      const buildRunnerCore = () => ({
        name: 'Runner Core & Stability', type: 'strength', duration: 25,
        exercises: [
          { name: 'Dead Bug', demo: '🐛', prescription: { sets: 3, reps: '10 each', rest: 45 }, formCues: ['Lower back flat', 'Opposite arm-leg'] },
          { name: 'Bird Dog', demo: '🐕', prescription: { sets: 3, reps: '10 each', rest: 45 }, formCues: ['Stable spine', 'Reach long'] },
          { name: 'Pallof Press', demo: '💪', prescription: { sets: 3, reps: '10 each', rest: 45 }, formCues: ['Anti-rotation', 'Stay square'] },
          { name: 'Copenhagen Plank', demo: '📐', prescription: { sets: 2, reps: '20 sec each', rest: 45 }, formCues: ['Adductor strength', 'Start with bent knee'] },
          { name: 'Single Leg Balance', demo: '🦩', prescription: { sets: 2, reps: '30 sec each', rest: 30 }, formCues: ['Eyes closed for challenge'] }
        ]
      });

      const buildCrossTraining = () => ({
        name: 'Cross Training', type: 'cardio', duration: 30,
        exercises: [
          { name: 'Swimming or Cycling', demo: '🏊', prescription: { sets: 1, reps: '20-30 min', rest: 0 }, formCues: ['Low impact', 'Active recovery'] },
          { name: 'Light Core Work', demo: '🧘', prescription: { sets: 2, reps: '10 each', rest: 30 }, formCues: ['Optional add-on'] }
        ]
      });

      const schedule = [
        { day: 'Mon', ...buildRunnerStrength() },
        { day: 'Tue', name: 'Easy Run Day', type: 'cardio', duration: 40, exercises: [
          { name: 'Easy Run', demo: '🏃', prescription: { sets: 1, reps: '30-40 min', rest: 0 }, formCues: ['Zone 2', 'Conversational pace', 'Keep HR 130-150'] }
        ]},
        { day: 'Wed', ...buildRunnerCore() },
        { day: 'Thu', name: 'Quality Run Day', type: 'cardio', duration: 50, exercises: [
          { name: 'Intervals or Tempo', demo: '⚡', prescription: { sets: 1, reps: '40-50 min', rest: 0 }, formCues: ['Warm up 10 min', 'Work hard, recover easy', 'Cool down 10 min'] }
        ]},
        { day: 'Fri', ...buildRunnerMobility() },
        { day: 'Sat', name: 'Long Run', type: 'cardio', duration: 75, exercises: [
          { name: 'Long Slow Distance', demo: '🛤️', prescription: { sets: 1, reps: '60-90 min', rest: 0 }, formCues: ['Easy pace', 'Build aerobic base', 'Fuel during if >60 min'] }
        ]},
        { day: 'Sun', ...buildCrossTraining() }
      ];

      const recommendation = hasAnyActiveInjury 
        ? `🩹 Injury detected: Scale back running, focus on recovery & strength work.`
        : intensity === 'increase' 
          ? `🎉 Running strong! Consider adding 10% to weekly mileage.` 
          : `📈 Maintain current mileage. Focus on consistency.`;

      return {
        philosophy,
        schedule,
        sessionsPerWeek: schedule.filter(s => s.type !== 'recovery').length,
        weekFocus: `Week ${currentWeek}: ${currentWeek <= 4 ? 'Base Building' : currentWeek <= 8 ? 'Speed Development' : 'Peak Performance'}`,
        recommendation,
        progressiveOverload: { currentWeek, intensity, recommendation },
        nutrition: ['Carbs 5-7g/kg for endurance', 'Protein 1.6g/kg for recovery', 'Hydrate: 500ml 2hrs before runs'],
        injuryPrevention: [
          ...activeInjuries.map(i => `🩹 ACTIVE: ${i.type} - ${i.notes}`),
          '10-min warm-up before every run',
          'Strengthen glutes & hips weekly',
          'Replace shoes every 500-800km'
        ],
        weeklyTips: [
          'Never increase weekly mileage by more than 10%',
          'Include 1 rest day minimum per week',
          'Strength training prevents 50% of running injuries',
          'Sleep 7-9 hours for optimal recovery'
        ]
      };
    }

    // STANDARD WORKOUT GENERATION (non-runners)
    const hasBackPain = hasActiveBackPain;
    const hasKneeIssue = hasActiveKneeIssue;
    const hasShoulderIssue = hasActiveShoulderIssue;

    const philosophy = isFemale 
      ? `Based on Dr. Stacy Sims' research: ${SIMS_PRINCIPLES.strength}`
      : `Progressive strength program for ${fitnessLevel} level.`;

    // Reduce sessions if injured
    let sessionsPerWeek = fitnessLevel === 'beginner' ? 3 : fitnessLevel === 'intermediate' ? 4 : 5;
    if (hasAnyActiveInjury) sessionsPerWeek = Math.min(sessionsPerWeek, 3);

    const buildLower = () => {
      const exercises = [];
      if (hasKneeIssue || hasActiveAnkleIssue) {
        // Low-impact alternatives for knee/ankle issues
        exercises.push(getExercise('hip-thrust'));
        exercises.push({ name: 'Seated Leg Curl', demo: '🦵', prescription: { sets: 3, reps: '12', rest: 60 }, formCues: ['Machine-based, safe for joints'] });
        exercises.push({ name: 'Leg Extensions (light)', demo: '🦿', prescription: { sets: 2, reps: '15', rest: 45 }, formCues: ['Light weight, no pain'] });
      } else {
        exercises.push(fitnessLevel === 'beginner' ? getExercise('goblet-squat') : getExercise('back-squat'));
        exercises.push(getExercise('romanian-deadlift'), getExercise('hip-thrust'));
      }
      if (fitnessLevel !== 'beginner' && !hasKneeIssue && !hasActiveAnkleIssue) exercises.push(getExercise('bulgarian-split-squat'));
      exercises.push(hasBackPain ? getExercise('dead-bug') : getExercise('plank'));
      if (isSedentary) exercises.push(getExercise('pallof-press'));
      return { name: 'Lower Body', type: 'strength', duration: 45, exercises: exercises.filter(Boolean) };
    };

    const buildUpper = () => {
      const exercises = [];
      if (hasShoulderIssue) {
        exercises.push(getExercise('push-up'));
        exercises.push({ name: 'Face Pulls', demo: '🔙', prescription: { sets: 3, reps: '15', rest: 45 }, formCues: ['Light band', 'Shoulder rehab'] });
        exercises.push(getExercise('bent-over-row'));
      } else {
        exercises.push(fitnessLevel === 'beginner' ? getExercise('push-up') : getExercise('bench-press'));
        exercises.push(getExercise('bent-over-row'));
        if (fitnessLevel !== 'beginner') exercises.push(getExercise('overhead-press'), getExercise('pull-up'));
      }
      exercises.push(getExercise('plank'));
      return { name: 'Upper Body', type: 'strength', duration: 45, exercises: exercises.filter(Boolean) };
    };

    const buildConditioning = () => {
      const exercises = [];
      if (hasActiveAnkleIssue || hasKneeIssue) {
        // Low-impact conditioning
        exercises.push({ name: 'Cycling/Rowing', demo: '🚴', prescription: { sets: 1, reps: '15 min', rest: 0 }, formCues: ['Low impact cardio'] });
        exercises.push({ name: 'Battle Ropes', demo: '🪢', prescription: { sets: 4, reps: '30 sec', rest: 45 }, formCues: ['Upper body cardio'] });
      } else {
        if (isFemale) exercises.push({ name: 'HIIT Intervals', prescription: { sets: 1, reps: '8x 30s on/30s off', rest: 0 }, demo: '🔥', formCues: ['85-90% effort'] });
        exercises.push(getExercise('kettlebell-swing'));
        if (fitnessLevel !== 'beginner') exercises.push(getExercise('box-jump'));
      }
      exercises.push(getExercise('farmers-carry'));
      return { name: isFemale ? 'HIIT & Power' : 'Conditioning', type: 'conditioning', duration: 35, exercises: exercises.filter(Boolean) };
    };

    const buildRecovery = () => ({
      name: 'Active Recovery', type: 'recovery', duration: 30,
      exercises: [
        { name: '30-min Walk', demo: '🚶', formCues: ['HR 100-120 bpm'] },
        { name: 'Foam Rolling', demo: '🧘', formCues: ['30-60s per area'] },
        { name: 'Stretching', demo: '🤸', formCues: ['Hip circles, leg swings'] }
      ]
    });

    let schedule = [];
    if (sessionsPerWeek === 3) {
      schedule = [{ day: 'Mon', ...buildLower() }, { day: 'Wed', ...buildUpper() }, { day: 'Fri', ...buildConditioning() }, { day: 'Sat', ...buildRecovery() }];
    } else if (sessionsPerWeek === 4) {
      schedule = [{ day: 'Mon', ...buildLower() }, { day: 'Tue', ...buildUpper() }, { day: 'Thu', ...buildConditioning() }, { day: 'Fri', ...buildLower() }, { day: 'Sat', ...buildRecovery() }];
    } else {
      schedule = [{ day: 'Mon', ...buildLower() }, { day: 'Tue', ...buildUpper() }, { day: 'Wed', ...buildConditioning() }, { day: 'Thu', ...buildLower() }, { day: 'Fri', ...buildUpper() }, { day: 'Sat', ...buildRecovery() }];
    }

    const proteinTarget = Math.round(client.weight * 1.8);
    const recommendation = hasAnyActiveInjury 
      ? `🩹 Active injury detected: Focus on recovery. Workouts scaled back.`
      : intensity === 'increase' 
        ? `🎉 Great progress! Add 2.5kg this week.` 
        : intensity === 'decrease' 
          ? `💚 Recovery week - focus on form.` 
          : `📈 Maintain intensity. Add weight if easy.`;

    return {
      philosophy, schedule,
      sessionsPerWeek,
      weekFocus: `Week ${currentWeek}: ${currentWeek <= 4 ? 'Foundation' : currentWeek <= 8 ? 'Building Strength' : 'Peak Phase'}`,
      recommendation,
      progressiveOverload: { currentWeek, intensity, recommendation },
      nutrition: [`Protein: ${proteinTarget}g/day`, isFemale ? 'Post-workout protein within 30 min' : 'Post-workout: 30-40g protein', `Water: ${Math.round((client.weight || 70) * 0.035)}L+`],
      injuryPrevention: [
        ...activeInjuries.map(i => `🩹 ACTIVE: ${i.type} - ${i.notes}`),
        ...injuries.filter(i => i.status === 'recovered').slice(-2).map(i => `✅ Healed: ${i.type}`),
        '10-min warm-up every session'
      ],
      weeklyTips: [
        isSedentary ? '5-min walk every hour at work' : 'Stay active on rest days',
        lifestyle.stressLevel >= 7 ? 'Add breathing exercises for stress' : 'Maintain consistent sleep schedule',
        'Track your progress weekly',
        'Focus on form over weight'
      ]
    };
  };

  // Static workout plan for PT view
  const generateWorkoutPlan = (client) => {
    const isFemale = client.gender === 'female';
    return {
      philosophy: isFemale ? `Based on Dr. Stacy Sims: "${SIMS_PRINCIPLES.strength}"` : 'Progressive overload program for strength and muscle.',
      overview: `${client.fitnessLevel} program with ${isFemale ? 'HIIT, plyometrics, and heavy compound lifts' : 'hypertrophy and strength focus'}.`,
      quarter1: {
        focus: 'Foundation & Movement Quality',
        weeks: [
          { weeks: '1-4', theme: 'Movement Mastery', sessions: [
            { day: 'Monday', type: 'Strength A', exercises: ['Goblet Squats 4x8', 'RDL 3x10', 'Push-ups 3x10', 'Rows 3x10', 'Pallof Press 3x10'], duration: 45 },
            { day: 'Wednesday', type: 'HIIT + Core', exercises: ['30/30 intervals x8', 'Dead bugs 3x10', 'Glute bridges 3x15'], duration: 35 },
            { day: 'Friday', type: 'Strength B', exercises: ['Hip Thrusts 4x10', 'Step-ups 3x10', 'OHP 3x10', 'Pulldowns 3x10'], duration: 45 },
            { day: 'Saturday', type: 'Recovery', exercises: ['30-min walk', 'Mobility 15 min'], duration: 45 }
          ]},
          { weeks: '5-8', theme: 'Building Intensity', sessions: [
            { day: 'Mon/Thu', type: 'Lower', exercises: ['Back Squats 4x6 @75%', 'Bulgarian Split Squats 3x8', 'Nordic Curls 3x6'], duration: 50 },
            { day: 'Tue/Fri', type: 'Upper', exercises: ['Bench 4x6', 'Rows 4x8', 'Arnold Press 3x10', 'Pull-ups 4x6'], duration: 45 }
          ]},
          { weeks: '9-12', theme: 'Strength Peak', sessions: [
            { day: 'Mon/Thu', type: 'Heavy', exercises: ['Back Squats 5x5 @80%', 'Hip Thrusts 4x8', 'Deadlifts 4x5'], duration: 55 },
            { day: 'Week 12', type: 'Retest', exercises: ['Test all baselines', 'Photo comparison'], duration: 40 }
          ]}
        ]
      },
      nutritionTips: isFemale ? ['Protein across 4-5 meals (25-35g each)', 'Post-workout within 30 min', 'Creatine 3-5g daily safe for women'] : ['Protein 1.6-2.2g/kg', 'Post-workout 30-40g + carbs', 'Creatine 5g daily'],
      injuryPrevention: client.injuries.length ? client.injuries.map(i => `${i.type}: ${i.status === 'managing' ? 'Modify exercises' : 'Include prehab'}`) : ['Prioritize form', 'Warm up properly'],
      longevityFocus: client.lifestyle.workType === 'sedentary' ? ['Move every 60 min', 'Hip flexor stretches 3x daily', '8-10k steps'] : ['Balance training with recovery', 'Weekly low-intensity cardio']
    };
  };

  // ============ AI NUTRITION PLAN GENERATOR ============
  const generateNutritionPlan = (client) => {
    const isFemale = client.gender === 'female';
    const weight = client.weight || 70;
    const targetWeight = client.targetWeight || weight;
    const level = client.fitnessLevel || 'beginner';
    const goals = client.goals || [];
    const lifestyle = client.lifestyle || { workType: 'mixed', stressLevel: 5, sleepHours: 7 };
    const assessments = client.assessmentScores || {};
    
    // Calculate base metrics
    const isWeightLoss = targetWeight < weight;
    const isWeightGain = targetWeight > weight;
    const bmr = isFemale ? (10 * weight) + (6.25 * (client.height || 165)) - (5 * (client.age || 30)) - 161 
                         : (10 * weight) + (6.25 * (client.height || 175)) - (5 * (client.age || 30)) + 5;
    
    const activityMultiplier = level === 'beginner' ? 1.4 : level === 'intermediate' ? 1.6 : 1.8;
    const tdee = Math.round(bmr * activityMultiplier);
    
    // Calorie targets based on goals
    const calorieTarget = isWeightLoss ? Math.round(tdee - 400) : isWeightGain ? Math.round(tdee + 300) : tdee;
    const proteinTarget = Math.round(weight * (isWeightGain ? 2.0 : 1.8));
    const fatTarget = Math.round((calorieTarget * 0.28) / 9);
    const carbTarget = Math.round((calorieTarget - (proteinTarget * 4) - (fatTarget * 9)) / 4);
    
    // Build personalized recommendations
    const mealTiming = [];
    const supplements = [];
    const hydration = [];
    const specialFocus = [];
    const sampleMeals = { breakfast: [], lunch: [], dinner: [], snacks: [] };
    
    // Meal timing based on training
    if (level === 'advanced') {
      mealTiming.push('Pre-workout meal 2-3 hours before training (complex carbs + protein)');
      mealTiming.push('Post-workout within 30 minutes (fast protein + simple carbs)');
      mealTiming.push('Spread protein across 4-5 meals for optimal synthesis');
    } else if (level === 'intermediate') {
      mealTiming.push('Eat a balanced meal 2 hours before training');
      mealTiming.push('Post-workout protein shake or meal within 1 hour');
      mealTiming.push('3-4 meals per day with protein at each');
    } else {
      mealTiming.push('Focus on consistent meal times first');
      mealTiming.push('Aim for 3 main meals + 1-2 snacks');
      mealTiming.push('Don\'t train on an empty stomach');
    }
    
    // Gender-specific recommendations
    if (isFemale) {
      specialFocus.push({ title: 'Menstrual Cycle Nutrition', tips: ['Follicular phase (days 1-14): Higher carb tolerance, great for higher intensity', 'Luteal phase (days 15-28): Increase protein by 10-15%, add anti-inflammatory foods', 'During menstruation: Focus on iron-rich foods, magnesium for cramps'] });
      supplements.push('Iron (if heavy periods) - take with vitamin C');
      supplements.push('Vitamin D3 (2000-4000 IU daily)');
      supplements.push('Magnesium glycinate (200-400mg before bed)');
      if (assessments.strength < 50) supplements.push('Creatine monohydrate 3-5g daily (safe and effective for women)');
    } else {
      supplements.push('Vitamin D3 (2000-4000 IU daily)');
      supplements.push('Omega-3 fatty acids (2-3g EPA+DHA)');
      if (level !== 'beginner') supplements.push('Creatine monohydrate 5g daily');
    }

    // RUNNER-SPECIFIC NUTRITION
    if (client.isRunner) {
      specialFocus.push({ 
        title: 'Runner Nutrition Strategy', 
        tips: [
          'Carbs are your fuel: 5-7g/kg body weight for endurance',
          'Pre-run meal 2-3 hours before: Complex carbs + small protein',
          'Post-run within 30 min: 3:1 carb to protein ratio',
          'Long runs (>60 min): Fuel during with energy gels or dates',
          'Race week: Carb-load 2-3 days before (increase carbs to 70% of calories)'
        ] 
      });
      specialFocus.push({ 
        title: 'Runner Injury Prevention', 
        tips: [
          'Vitamin D & Calcium for bone health',
          'Collagen + Vitamin C for tendon strength',
          'Anti-inflammatory foods: turmeric, ginger, fatty fish',
          'Beetroot juice can improve running economy',
          'Stay hydrated: Dehydration increases injury risk'
        ] 
      });
      // Runner-specific supplements
      supplements.push('Beetroot powder/juice (pre-workout for performance)');
      supplements.push('Collagen peptides (5-15g daily for joint health)');
      supplements.push('Electrolytes for runs over 60 minutes');
      if (isFemale) supplements.push('Calcium (1000mg daily) - runners have higher needs');
    }
    
    // MEAL DATABASE - Large pool that rotates weekly
    const mealDatabase = {
      weightLoss: {
        breakfast: [
          'Greek yogurt with fresh mango & granola (380 cal, 22g protein)',
          'Boiled eggs (3) with avocado toast (420 cal, 25g protein)',
          'Omelette with vegetables & sweet potato wedges (400 cal, 28g protein)',
          'Millet porridge with milk & banana (350 cal, 15g protein)',
          'Smoothie: spinach, banana, protein powder & peanut butter (390 cal, 30g protein)',
          'Scrambled eggs with smoked salmon & whole grain toast (410 cal, 32g protein)',
          'Overnight oats with chia seeds & berries (360 cal, 18g protein)',
          'Vegetable frittata with side salad (380 cal, 26g protein)',
          'Cottage cheese pancakes with fresh fruit (370 cal, 28g protein)',
          'Breakfast burrito: eggs, beans, salsa, avocado (440 cal, 24g protein)'
        ],
        lunch: [
          'Grilled tilapia with brown rice & steamed vegetables (480 cal, 40g protein)',
          'Chicken breast salad with avocado & quinoa (450 cal, 38g protein)',
          'Beef stir-fry with vegetables & small portion rice (470 cal, 35g protein)',
          'Tuna wrap with mixed greens & hummus (420 cal, 32g protein)',
          'Grilled chicken with roasted vegetables & sweet potato (460 cal, 42g protein)',
          'Turkey meatballs with zucchini noodles (440 cal, 38g protein)',
          'Shrimp & vegetable curry with cauliflower rice (430 cal, 35g protein)',
          'Bean & chicken soup with whole grain bread (420 cal, 32g protein)',
          'Salmon poke bowl with edamame & cucumber (470 cal, 36g protein)',
          'Grilled fish tacos with cabbage slaw (450 cal, 34g protein)'
        ],
        dinner: [
          'Grilled chicken with roasted vegetables (420 cal, 42g protein)',
          'Fish fillet with sukuma wiki & sweet potato (450 cal, 38g protein)',
          'Lean beef steak with garden salad (480 cal, 45g protein)',
          'Grilled goat meat with kachumbari salad (450 cal, 40g protein)',
          'Baked salmon with asparagus & quinoa (460 cal, 40g protein)',
          'Turkey stir-fry with mixed vegetables (410 cal, 38g protein)',
          'Grilled prawns with couscous & roasted peppers (440 cal, 35g protein)',
          'Chicken breast with mushroom sauce & green beans (430 cal, 44g protein)',
          'White fish with lemon, capers & steamed broccoli (390 cal, 42g protein)',
          'Lean pork tenderloin with apple slaw (450 cal, 40g protein)'
        ],
        snacks: [
          'Handful of almonds or groundnuts (150 cal, 6g protein)',
          'Fresh fruit: watermelon, pineapple, or papaya (80 cal, 1g protein)',
          'Boiled egg with cherry tomatoes (100 cal, 7g protein)',
          'Cottage cheese with berries (140 cal, 14g protein)',
          'Celery sticks with peanut butter (120 cal, 4g protein)',
          'Greek yogurt (small) with honey (130 cal, 12g protein)',
          'Carrot sticks with hummus (110 cal, 4g protein)',
          'Protein bar (low sugar) (160 cal, 15g protein)'
        ]
      },
      muscleGain: {
        breakfast: [
          '4-egg omelette with cheese & whole grain toast (620 cal, 38g protein)',
          'Protein pancakes with banana & peanut butter (580 cal, 32g protein)',
          'Katogo with beans, eggs & avocado (650 cal, 35g protein)',
          'Overnight oats with protein powder, nuts & honey (550 cal, 30g protein)',
          'Breakfast bowl: eggs, bacon, beans, avocado, toast (680 cal, 40g protein)',
          'French toast with Greek yogurt & berries (590 cal, 32g protein)',
          'Egg & cheese sandwich with fruit smoothie (620 cal, 35g protein)',
          'Full English: eggs, sausage, beans, mushrooms, toast (700 cal, 42g protein)',
          'Shakshuka with feta & crusty bread (580 cal, 30g protein)',
          'Bagel with cream cheese, smoked salmon & eggs (640 cal, 38g protein)'
        ],
        lunch: [
          'Double chicken breast with rice & broccoli (700 cal, 55g protein)',
          'Beef burger (no bun) with sweet potato fries & salad (680 cal, 45g protein)',
          'Grilled tilapia with ugali & vegetable stew (720 cal, 50g protein)',
          'Chicken pasta with tomato sauce & parmesan (680 cal, 42g protein)',
          'Steak sandwich with cheese & caramelized onions (750 cal, 48g protein)',
          'Chicken & rice burrito bowl with guacamole (720 cal, 45g protein)',
          'Tuna pasta salad with olive oil dressing (690 cal, 42g protein)',
          'Lamb kofta with rice & tzatziki (710 cal, 44g protein)',
          'BBQ chicken with mac & cheese (740 cal, 46g protein)',
          'Fish & chips (baked) with mushy peas (680 cal, 40g protein)'
        ],
        dinner: [
          'Steak with mashed potatoes & asparagus (750 cal, 52g protein)',
          'Salmon fillet with quinoa & roasted vegetables (700 cal, 48g protein)',
          'Nyama choma with chapati & bean salad (740 cal, 50g protein)',
          'Lamb chops with couscous & grilled vegetables (720 cal, 46g protein)',
          'Beef stew with rice & steamed greens (730 cal, 48g protein)',
          'Whole roasted chicken portion with potatoes (760 cal, 55g protein)',
          'Pork chops with apple sauce & sweet potato mash (700 cal, 45g protein)',
          'Seafood paella with prawns & mussels (720 cal, 44g protein)',
          'Beef lasagna with side salad (740 cal, 42g protein)',
          'Chicken tikka masala with naan & rice (780 cal, 48g protein)'
        ],
        snacks: [
          'Protein shake with banana (320 cal, 28g protein)',
          'Greek yogurt with granola & honey (280 cal, 18g protein)',
          'Peanut butter sandwich on whole grain (350 cal, 14g protein)',
          'Boiled eggs (2) with avocado (250 cal, 14g protein)',
          'Trail mix with nuts & dried fruit (300 cal, 10g protein)',
          'Cheese & crackers (280 cal, 12g protein)',
          'Protein bar with milk (380 cal, 30g protein)',
          'Cottage cheese with pineapple (220 cal, 20g protein)'
        ]
      },
      maintenance: {
        breakfast: [
          'Scrambled eggs with toast & fresh fruit (420 cal, 22g protein)',
          'Smoothie bowl with nuts, seeds & banana (400 cal, 18g protein)',
          'Avocado toast with poached eggs (450 cal, 20g protein)',
          'Millet porridge with milk & groundnuts (380 cal, 14g protein)',
          'Yogurt parfait with granola & mixed berries (390 cal, 16g protein)',
          'Eggs Benedict with spinach (440 cal, 24g protein)',
          'Breakfast wrap: eggs, cheese, peppers (410 cal, 22g protein)',
          'Banana pancakes with maple syrup (420 cal, 12g protein)',
          'Chia pudding with coconut & mango (360 cal, 10g protein)',
          'Toast with almond butter & sliced banana (380 cal, 12g protein)'
        ],
        lunch: [
          'Grilled chicken wrap with vegetables (520 cal, 35g protein)',
          'Fish tacos with cabbage slaw (480 cal, 32g protein)',
          'Beef pilau with kachumbari (550 cal, 38g protein)',
          'Mediterranean salad with grilled halloumi (460 cal, 25g protein)',
          'Chicken Caesar salad with croutons (500 cal, 35g protein)',
          'Vegetable & lentil soup with crusty bread (420 cal, 18g protein)',
          'Grilled cheese sandwich with tomato soup (480 cal, 20g protein)',
          'Poke bowl with salmon & avocado (520 cal, 32g protein)',
          'Club sandwich with sweet potato fries (540 cal, 30g protein)',
          'Buddha bowl: quinoa, chickpeas, roasted veg (490 cal, 22g protein)'
        ],
        dinner: [
          'Baked salmon with roasted vegetables (520 cal, 42g protein)',
          'Chicken stir-fry with brown rice (500 cal, 38g protein)',
          'Grilled fish with sweet potato & steamed greens (480 cal, 40g protein)',
          'Turkey meatballs with pasta & marinara (540 cal, 35g protein)',
          'Beef tacos with all the fixings (530 cal, 32g protein)',
          'Lemon herb chicken with roasted potatoes (510 cal, 42g protein)',
          'Shrimp scampi with linguine (550 cal, 35g protein)',
          'Vegetable curry with rice & naan (490 cal, 15g protein)',
          'Pork stir-fry with noodles (520 cal, 35g protein)',
          'Grilled chicken with pasta primavera (530 cal, 40g protein)'
        ],
        snacks: [
          'Fresh fruit salad (120 cal, 1g protein)',
          'Hummus with carrot sticks (150 cal, 5g protein)',
          'Mixed nuts - small handful (180 cal, 6g protein)',
          'Rice cakes with peanut butter (160 cal, 5g protein)',
          'Apple slices with almond butter (170 cal, 4g protein)',
          'Popcorn (air-popped) (100 cal, 3g protein)',
          'Dark chocolate square with almonds (150 cal, 3g protein)',
          'Edamame beans (140 cal, 12g protein)'
        ]
      }
    };

    // Select meals based on current week (rotates through the pool)
    const currentWeek = client.currentWeek || 1;
    const selectMeals = (mealArray, count = 4) => {
      const startIndex = (currentWeek - 1) % Math.max(1, mealArray.length - count + 1);
      const selected = [];
      for (let i = 0; i < count; i++) {
        selected.push(mealArray[(startIndex + i) % mealArray.length]);
      }
      return selected;
    };

    // Goal-specific recommendations - Meals rotate weekly from the database
    if (goals.includes('Lose weight') || isWeightLoss) {
      specialFocus.push({ title: 'Fat Loss Strategy', tips: ['Focus on protein first at each meal to stay full', 'Increase vegetable volume for satiety', 'Limit sodas, alcohol, and sugary drinks', 'Track food for 2 weeks to build awareness'] });
      sampleMeals.breakfast = selectMeals(mealDatabase.weightLoss.breakfast);
      sampleMeals.lunch = selectMeals(mealDatabase.weightLoss.lunch);
      sampleMeals.dinner = selectMeals(mealDatabase.weightLoss.dinner);
      sampleMeals.snacks = selectMeals(mealDatabase.weightLoss.snacks);
    } else if (goals.includes('Build muscle') || isWeightGain) {
      specialFocus.push({ title: 'Muscle Building', tips: ['Eat in a moderate surplus (300-500 cal above maintenance)', 'Protein timing: spread evenly, emphasize post-workout', 'Don\'t neglect carbs - they fuel training and recovery', 'Sleep 7-9 hours for optimal muscle protein synthesis'] });
      sampleMeals.breakfast = selectMeals(mealDatabase.muscleGain.breakfast);
      sampleMeals.lunch = selectMeals(mealDatabase.muscleGain.lunch);
      sampleMeals.dinner = selectMeals(mealDatabase.muscleGain.dinner);
      sampleMeals.snacks = selectMeals(mealDatabase.muscleGain.snacks);
    } else {
      specialFocus.push({ title: 'Performance & Health', tips: ['Focus on food quality over quantity', 'Balance macronutrients at each meal', 'Eat the rainbow - variety of vegetables', 'Listen to hunger and fullness cues'] });
      sampleMeals.breakfast = selectMeals(mealDatabase.maintenance.breakfast);
      sampleMeals.lunch = selectMeals(mealDatabase.maintenance.lunch);
      sampleMeals.dinner = selectMeals(mealDatabase.maintenance.dinner);
      sampleMeals.snacks = selectMeals(mealDatabase.maintenance.snacks);
    }
    
    // Hydration based on activity and weight
    const waterTarget = Math.round(weight * 0.035 * 10) / 10;
    hydration.push(`Base intake: ${waterTarget}L daily`);
    hydration.push(`Add 500ml for every hour of exercise`);
    if (lifestyle.workType === 'active') hydration.push('Working actively? Add another 500ml');
    if (assessments.cardio > 70) hydration.push('For endurance training: add electrolytes');
    
    // Stress & sleep adjustments
    if (lifestyle.stressLevel >= 7) {
      specialFocus.push({ title: 'Stress Management Nutrition', tips: ['Prioritize magnesium-rich foods (dark chocolate, nuts, leafy greens)', 'Limit caffeine after 2pm', 'Consider adaptogenic herbs (ashwagandha, rhodiola)', 'Avoid excessive sugar which can spike cortisol'] });
    }
    if (lifestyle.sleepHours < 7) {
      specialFocus.push({ title: 'Sleep Optimization', tips: ['Avoid large meals 2-3 hours before bed', 'Limit caffeine to morning only', 'Consider magnesium glycinate before bed', 'Tart cherry juice can support natural melatonin'] });
    }
    
    // Assessment-based modifications
    if (assessments.cardio < 40) {
      specialFocus.push({ title: 'Cardio Improvement', tips: ['Focus on iron-rich foods for oxygen transport', 'Beetroot juice pre-workout can boost performance', 'Ensure adequate B-vitamins for energy metabolism'] });
    }
    if (assessments.strength < 40) {
      specialFocus.push({ title: 'Strength Support', tips: ['Prioritize protein timing around workouts', 'Ensure adequate calories to support muscle growth', 'Consider creatine supplementation'] });
    }
    
    return {
      summary: `Based on your ${level} fitness level, ${isWeightLoss ? 'weight loss' : isWeightGain ? 'muscle building' : 'maintenance'} goal, and assessment results`,
      calories: { target: calorieTarget, tdee, deficit: isWeightLoss ? tdee - calorieTarget : 0, surplus: isWeightGain ? calorieTarget - tdee : 0 },
      macros: { protein: proteinTarget, carbs: carbTarget, fat: fatTarget },
      mealTiming,
      supplements,
      hydration,
      specialFocus,
      sampleMeals,
      mealWeek: currentWeek, // Track which week's meals are showing
      weeklyTips: [
        'Meal prep on Sundays - cook proteins, grains, and chop vegetables',
        'Keep healthy snacks ready: boiled eggs, nuts, fresh fruit',
        'Drink water throughout the day - aim for 2-3 liters',
        'One flexible meal per week is fine - enjoy your favorites!',
        'Choose grilled over fried when eating out'
      ]
    };
  };

  // ============ LOGIN SCREEN ============
  const LoginScreen = () => {
    const [loginType, setLoginType] = useState('client');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
      if (loginType === 'pt') {
        if (email === 'pt@fitforge.com' && password === 'demo123') {
          setUserType('pt'); setLoggedInUser({ name: 'Marcus Thompson', email: 'marcus@fitforge.com', phone: '+256 700 123456' }); setCurrentView('dashboard');
        } else setError('Try: pt@fitforge.com / demo123');
      } else if (loginType === 'corporate') {
        // Find corporate group by admin email
        const corpGroup = groups.find(g => g.type === 'corporate' && g.adminEmail === email && g.adminPassword === password);
        if (corpGroup) {
          setUserType('corporate'); setLoggedInUser(corpGroup); setCurrentView('corporate-dashboard');
        } else setError('Try: admin@techcorp.com / demo123');
      } else {
        const client = clients.find(c => c.email === email && c.password === password);
        if (client) { setUserType('client'); setLoggedInUser(client); setCurrentView('client-dashboard'); }
        else setError('Try: sarah.m@techcorp.com / demo123');
      }
    };

    const getPlaceholder = () => {
      if (loginType === 'pt') return 'pt@fitforge.com';
      if (loginType === 'corporate') return 'admin@techcorp.com';
      return 'sarah.m@techcorp.com';
    };

    return (
      <div style={{ minHeight: '100vh', background: colors.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: isMobile ? 16 : 0, overflowX: 'hidden' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@700;800&display=swap'); * { box-sizing: border-box; } html, body { margin: 0; padding: 0; overflow-x: hidden; background: ${colors.dark}; min-height: 100%; }`}</style>
        <div style={{ width: '100%', maxWidth: 420, padding: isMobile ? 20 : 40 }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 40 }}>
            <div style={{ width: isMobile ? 56 : 72, height: isMobile ? 56 : 72, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, borderRadius: isMobile ? 14 : 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Dumbbell size={isMobile ? 28 : 36} color="white" /></div>
            <h1 style={{ color: colors.text, fontSize: isMobile ? 26 : 32, fontWeight: 800, margin: 0, fontFamily: 'Outfit' }}>FitForge</h1>
            <p style={{ color: colors.textMuted, marginTop: 8, fontSize: isMobile ? 13 : 14 }}>Your Wellness Journey</p>
          </div>
          <div style={{ display: 'flex', background: colors.darker, borderRadius: 12, padding: 4, marginBottom: isMobile ? 16 : 24 }}>
            {['client', 'corporate', 'pt'].map(t => (
              <button key={t} onClick={() => { setLoginType(t); setError(''); }} style={{ flex: 1, padding: isMobile ? 10 : 12, background: loginType === t ? colors.primary : 'transparent', border: 'none', borderRadius: 10, color: loginType === t ? 'white' : colors.textMuted, fontSize: isMobile ? 11 : 13, fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span>{t === 'client' ? '👤' : t === 'corporate' ? '🏢' : '📋'}</span>
                <span style={{ fontSize: isMobile ? 9 : 12 }}>{t === 'client' ? 'Client' : t === 'corporate' ? 'Corp' : 'PT'}</span>
              </button>
            ))}
          </div>
          <div style={{ background: colors.cardBg, borderRadius: 20, padding: isMobile ? 20 : 32, border: `1px solid ${colors.borderColor}` }}>
            <div style={{ marginBottom: isMobile ? 16 : 20 }}>
              <label style={{ color: colors.textMuted, fontSize: isMobile ? 12 : 13, display: 'block', marginBottom: 8 }}><Mail size={14} style={{ marginRight: 6 }} />Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={getPlaceholder()} style={{ width: '100%', padding: isMobile ? 12 : 14, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} />
            </div>
            <div style={{ marginBottom: isMobile ? 16 : 24 }}>
              <label style={{ color: colors.textMuted, fontSize: isMobile ? 12 : 13, display: 'block', marginBottom: 8 }}><Lock size={14} style={{ marginRight: 6 }} />Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="demo123" style={{ width: '100%', padding: isMobile ? 12 : 14, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} />
            </div>
            {error && <div style={{ background: `${colors.danger}20`, padding: 12, borderRadius: 10, marginBottom: isMobile ? 16 : 20 }}><p style={{ color: colors.danger, margin: 0, fontSize: isMobile ? 11 : 13 }}>{error}</p></div>}
            <button onClick={handleLogin} style={{ width: '100%', padding: isMobile ? 14 : 16, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, border: 'none', borderRadius: 12, color: 'white', fontSize: isMobile ? 14 : 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><LogIn size={isMobile ? 18 : 20} />Sign In</button>
          </div>
        </div>
      </div>
    );
  };

  // ============ EXERCISE MODAL ============
  const ExerciseModal = ({ exercise, onClose }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div style={{ background: colors.cardBg, borderRadius: 24, width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ padding: 24, borderBottom: `1px solid ${colors.borderColor}`, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 36 }}>{exercise.demo}</span>
              <div>
                <h2 style={{ color: colors.text, margin: 0, fontSize: 22, fontWeight: 700 }}>{exercise.name}</h2>
                <p style={{ color: colors.textMuted, margin: 0, fontSize: 13 }}>{exercise.category}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <span style={{ background: `${colors.primary}20`, color: colors.primary, padding: '4px 12px', borderRadius: 20, fontSize: 11 }}>{exercise.equipment}</span>
              <span style={{ background: `${colors.secondary}20`, color: colors.secondary, padding: '4px 12px', borderRadius: 20, fontSize: 11, textTransform: 'capitalize' }}>{exercise.difficulty}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color={colors.textMuted} /></button>
        </div>
        <div style={{ background: colors.darker, margin: 24, borderRadius: 16, height: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `2px dashed ${colors.borderColor}` }}>
          <Video size={40} color={colors.textMuted} />
          <p style={{ color: colors.textMuted, marginTop: 12 }}>Video Demo</p>
          <button style={{ marginTop: 12, padding: '8px 20px', background: colors.primary, border: 'none', borderRadius: 20, color: 'white', fontSize: 13, cursor: 'pointer' }}><Play size={14} /> Watch</button>
        </div>
        <div style={{ padding: '0 24px 24px' }}>
          <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 14 }}><Check size={16} color={colors.success} style={{ marginRight: 6 }} />Form Cues</h4>
          {exercise.formCues?.map((cue, i) => (
            <div key={i} style={{ background: `${colors.success}10`, borderRadius: 8, padding: 10, marginBottom: 8, display: 'flex', gap: 10 }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: colors.success, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i+1}</span>
              <span style={{ color: colors.text, fontSize: 13 }}>{cue}</span>
            </div>
          ))}
          {exercise.commonMistakes && (
            <>
              <h4 style={{ color: colors.text, margin: '16px 0 12px', fontSize: 14 }}><AlertTriangle size={16} color={colors.warning} style={{ marginRight: 6 }} />Avoid</h4>
              {exercise.commonMistakes.map((m, i) => (
                <div key={i} style={{ background: `${colors.warning}10`, borderRadius: 8, padding: 10, marginBottom: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <X size={14} color={colors.warning} /><span style={{ color: colors.text, fontSize: 13 }}>{m}</span>
                </div>
              ))}
            </>
          )}
          {exercise.prescription && (
            <div style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`, borderRadius: 12, padding: 16, marginTop: 16 }}>
              <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 14 }}><Target size={16} color={colors.primary} style={{ marginRight: 6 }} />Your Prescription</h4>
              <div style={{ display: 'flex', gap: 24 }}>
                <div><p style={{ color: colors.textMuted, margin: 0, fontSize: 11 }}>Sets</p><p style={{ color: colors.text, fontSize: 24, fontWeight: 700, margin: 0 }}>{exercise.prescription.sets}</p></div>
                <div><p style={{ color: colors.textMuted, margin: 0, fontSize: 11 }}>Reps</p><p style={{ color: colors.text, fontSize: 24, fontWeight: 700, margin: 0 }}>{exercise.prescription.reps}</p></div>
                <div><p style={{ color: colors.textMuted, margin: 0, fontSize: 11 }}>Rest</p><p style={{ color: colors.text, fontSize: 24, fontWeight: 700, margin: 0 }}>{exercise.prescription.rest}s</p></div>
              </div>
              {exercise.prescription.progressNote && <p style={{ color: colors.secondary, marginTop: 12, fontSize: 13 }}>{exercise.prescription.progressNote}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ============ CHALLENGES TAB COMPONENT ============
  const ChallengesTab = ({ client, group, groups, colors, membershipRequests, setMembershipRequests }) => {
    const [showJoinGroup, setShowJoinGroup] = useState(false);
    const [showAllChallenges, setShowAllChallenges] = useState(false);
    
    // Determine client type
    const isInCorporate = group?.type === 'corporate';
    const isInClub = group?.type === 'club';
    const isGeneralClient = !group; // No group assigned
    
    // Get challenges the client is enrolled in
    const myEnrolledChallenges = [];
    groups.forEach(g => {
      g.challenges?.forEach(c => {
        if (c.participants?.includes(client.id)) {
          myEnrolledChallenges.push({ ...c, groupName: g.name, groupId: g.id, groupType: g.type });
        }
      });
    });

    // Get pending requests
    const myPendingRequests = membershipRequests.filter(r => r.clientId === client.id && r.status === 'pending');
    
    // Get available challenges based on client type
    const availableChallenges = [];
    
    if (isGeneralClient) {
      // General clients can see ONLY club challenges (open ones)
      // Corporate challenges are EXCLUSIVE to corporate members
      groups.forEach(g => {
        // Skip corporate groups - their challenges are exclusive to employees
        if (g.type === 'corporate') return;
        
        g.challenges?.forEach(c => {
          if (c.status === 'open' && !c.participants?.includes(client.id)) {
            const hasPendingRequest = myPendingRequests.some(r => r.challengeId === c.id && r.groupId === g.id);
            availableChallenges.push({ ...c, groupName: g.name, groupId: g.id, groupType: g.type, hasPendingRequest });
          }
        });
      });
    } else if (isInCorporate) {
      // Corporate members can ONLY see challenges from their own corporate group
      // They cannot see other companies' challenges
      group.challenges?.forEach(c => {
        if (c.status === 'open' && !c.participants?.includes(client.id)) {
          const hasPendingRequest = myPendingRequests.some(r => r.challengeId === c.id && r.groupId === group.id);
          availableChallenges.push({ ...c, groupName: group.name, groupId: group.id, groupType: group.type, hasPendingRequest });
        }
      });
    } else if (isInClub) {
      // Club members can see:
      // 1. Their own club's challenges
      // 2. Other clubs' open challenges (NOT corporate challenges)
      groups.forEach(g => {
        // Skip corporate groups - club members cannot see corporate challenges
        if (g.type === 'corporate') return;
        
        g.challenges?.forEach(c => {
          if (c.status === 'open' && !c.participants?.includes(client.id)) {
            const hasPendingRequest = myPendingRequests.some(r => r.challengeId === c.id && r.groupId === g.id);
            availableChallenges.push({ 
              ...c, 
              groupName: g.name, 
              groupId: g.id, 
              groupType: g.type,
              isOwnClub: g.name === client.group,
              hasPendingRequest
            });
          }
        });
      });
    }
    
    // Available groups - general clients can only join clubs, not corporate
    const availableGroups = isGeneralClient 
      ? groups.filter(g => g.type === 'club') 
      : isInClub 
        ? groups.filter(g => g.type === 'club' && g.name !== client.group)
        : []; // Corporate members cannot browse other groups

    const requestToJoinGroup = (g) => {
      const newRequest = {
        id: Date.now(),
        clientId: client.id,
        groupId: g.id,
        groupName: g.name,
        type: 'group',
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      };
      setMembershipRequests([...membershipRequests, newRequest]);
      setShowJoinGroup(false);
    };

    const requestToJoinChallenge = (challenge, groupId, groupName) => {
      const newRequest = {
        id: Date.now(),
        clientId: client.id,
        groupId: groupId,
        groupName: groupName,
        challengeId: challenge.id,
        challengeName: challenge.name,
        type: 'challenge',
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      };
      setMembershipRequests([...membershipRequests, newRequest]);
    };

    return (
      <>
        {/* Pending Requests */}
        {myPendingRequests.length > 0 && (
          <div style={{ background: `${colors.warning}15`, borderRadius: 14, padding: 20, marginBottom: 24, border: `1px solid ${colors.warning}30` }}>
            <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 15, fontWeight: 600 }}><Clock size={16} color={colors.warning} style={{ marginRight: 8 }} />Pending Requests</h4>
            {myPendingRequests.map(req => (
              <div key={req.id} style={{ background: colors.cardBg, borderRadius: 10, padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: colors.text, margin: 0, fontWeight: 500, fontSize: 14 }}>{req.type === 'challenge' ? req.challengeName : req.groupName}</p>
                  <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 12 }}>{req.type === 'challenge' ? 'Challenge' : 'Group'} • Requested {req.date}</p>
                </div>
                <span style={{ background: `${colors.warning}20`, color: colors.warning, padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600 }}>PENDING</span>
              </div>
            ))}
          </div>
        )}

        {/* General Client - Show available club challenges */}
        {isGeneralClient && (
          <>
            <div style={{ background: `linear-gradient(135deg, ${colors.secondary}15, ${colors.accent}15)`, borderRadius: 16, padding: 24, marginBottom: 24, border: `1px solid ${colors.secondary}30` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <Zap size={24} color={colors.secondary} />
                <h3 style={{ color: colors.text, margin: 0, fontSize: 18, fontWeight: 700 }}>Club Challenges</h3>
              </div>
              <p style={{ color: colors.textMuted, margin: 0, fontSize: 14 }}>Browse open challenges from running clubs and fitness communities. Corporate wellness challenges are exclusive to company employees.</p>
            </div>
            
            {availableChallenges.length === 0 ? (
              <div style={{ background: colors.cardBg, borderRadius: 14, padding: 40, textAlign: 'center', border: `1px solid ${colors.borderColor}` }}>
                <Trophy size={40} color={colors.textMuted} style={{ marginBottom: 12 }} />
                <p style={{ color: colors.textMuted, margin: 0 }}>No open challenges available right now</p>
              </div>
            ) : (
              <div style={{ marginBottom: 24 }}>
                {availableChallenges.map((challenge, i) => (
                  <div key={i} style={{ background: challenge.hasPendingRequest ? `${colors.warning}10` : `${colors.success}10`, borderRadius: 14, padding: 20, marginBottom: 12, border: `1px solid ${challenge.hasPendingRequest ? colors.warning : colors.success}30` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <h4 style={{ color: colors.text, margin: 0, fontSize: 15, fontWeight: 600 }}>{challenge.name}</h4>
                          {challenge.hasPendingRequest ? (
                            <span style={{ background: `${colors.warning}20`, color: colors.warning, padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600 }}>PENDING</span>
                          ) : (
                            <span style={{ background: `${colors.success}20`, color: colors.success, padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600 }}>OPEN</span>
                          )}
                          <span style={{ background: challenge.groupType === 'corporate' ? `${colors.warning}20` : `${colors.secondary}20`, color: challenge.groupType === 'corporate' ? colors.warning : colors.secondary, padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600 }}>{challenge.groupType === 'corporate' ? 'CORPORATE' : 'CLUB'}</span>
                        </div>
                        <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12, whiteSpace: 'pre-wrap' }}>{challenge.description}</p>
                        <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 11 }}>{challenge.groupName} • {challenge.participants?.length || 0} participants • {challenge.startDate} → {challenge.endDate}</p>
                      </div>
                      {challenge.hasPendingRequest ? (
                        <div style={{ padding: '10px 16px', background: `${colors.warning}20`, border: `1px solid ${colors.warning}`, borderRadius: 8, color: colors.warning, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginLeft: 12 }}>
                          <Clock size={14} />Pending
                        </div>
                      ) : (
                        <button onClick={() => requestToJoinChallenge(challenge, challenge.groupId, challenge.groupName)} style={{ padding: '10px 16px', background: colors.success, border: 'none', borderRadius: 8, color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', marginLeft: 12 }}><Plus size={14} style={{ marginRight: 4 }} />Request</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Join a Club */}
            <div style={{ marginTop: 24 }}>
              <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 14 }}>Want to join a club?</h4>
              <button onClick={() => setShowJoinGroup(true)} style={{ width: '100%', padding: 16, background: colors.cardBg, border: `1px dashed ${colors.borderColor}`, borderRadius: 12, color: colors.textMuted, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Flag size={18} />Browse Clubs to Join
              </button>
            </div>
          </>
        )}

        {/* Current Group Info (for group members) */}
        {group && (
          <>
            <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, borderRadius: 20, padding: 28, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                {group.type === 'corporate' ? <Briefcase size={28} color="white" /> : <Flag size={28} color="white" />}
                <div>
                  <h2 style={{ color: 'white', margin: 0, fontSize: 22, fontWeight: 700 }}>{group.name}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', margin: '4px 0 0', fontSize: 13 }}>{group.type === 'corporate' ? 'Corporate Wellness' : 'Sports Club'}</p>
                </div>
              </div>
              {isInCorporate && (
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: '12px 0 0', fontSize: 12, background: 'rgba(255,255,255,0.15)', padding: '8px 12px', borderRadius: 8 }}>
                  <Lock size={12} style={{ marginRight: 6 }} />Corporate challenges are exclusive to {group.name} members
                </p>
              )}
            </div>

            {/* My Enrolled Challenges */}
            {myEnrolledChallenges.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}><Trophy size={18} color={colors.accent} style={{ marginRight: 8 }} />My Challenges</h3>
                {myEnrolledChallenges.map((challenge, i) => (
                  <div key={i} style={{ background: colors.cardBg, borderRadius: 14, padding: 20, marginBottom: 12, border: `1px solid ${colors.borderColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <h4 style={{ color: colors.text, margin: 0, fontSize: 15, fontWeight: 600 }}>{challenge.name}</h4>
                        <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12, whiteSpace: 'pre-wrap' }}>{challenge.description}</p>
                        <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 11 }}>{challenge.groupName} • {challenge.startDate} → {challenge.endDate}</p>
                      </div>
                      <span style={{ background: `${colors.success}20`, color: colors.success, padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600 }}>ENROLLED</span>
                    </div>
                    {challenge.milestones?.length > 0 && (
                      <div style={{ background: colors.darker, borderRadius: 10, padding: 12 }}>
                        <p style={{ color: colors.textMuted, margin: '0 0 8px', fontSize: 11 }}>Milestones</p>
                        {challenge.milestones.slice(0, 2).map((m, j) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <Star size={12} color={colors.accent} />
                            <span style={{ color: colors.text, fontSize: 12 }}>Week {m.week}: {m.goal} → {m.reward}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Available Challenges in Group */}
            {availableChallenges.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}><Zap size={18} color={colors.success} style={{ marginRight: 8 }} />Open Challenges to Join</h3>
                {availableChallenges.map((challenge, i) => (
                  <div key={i} style={{ background: challenge.hasPendingRequest ? `${colors.warning}10` : `${colors.success}10`, borderRadius: 14, padding: 20, marginBottom: 12, border: `1px solid ${challenge.hasPendingRequest ? colors.warning : colors.success}30` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <h4 style={{ color: colors.text, margin: 0, fontSize: 15, fontWeight: 600 }}>{challenge.name}</h4>
                          {challenge.hasPendingRequest ? (
                            <span style={{ background: `${colors.warning}20`, color: colors.warning, padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600 }}>PENDING</span>
                          ) : (
                            <span style={{ background: `${colors.success}20`, color: colors.success, padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600 }}>OPEN</span>
                          )}
                          {isInClub && challenge.groupName !== client.group && (
                            <span style={{ background: `${colors.secondary}20`, color: colors.secondary, padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600 }}>{challenge.groupName}</span>
                          )}
                        </div>
                        <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12, whiteSpace: 'pre-wrap' }}>{challenge.description}</p>
                        <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 11 }}>{challenge.participants?.length || 0} participants • {challenge.startDate} → {challenge.endDate}</p>
                      </div>
                      {challenge.hasPendingRequest ? (
                        <div style={{ padding: '10px 16px', background: `${colors.warning}20`, border: `1px solid ${colors.warning}`, borderRadius: 8, color: colors.warning, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock size={14} />Awaiting Approval
                        </div>
                      ) : (
                        <button onClick={() => requestToJoinChallenge(challenge, challenge.groupId, challenge.groupName)} style={{ padding: '10px 16px', background: colors.success, border: 'none', borderRadius: 8, color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}><Plus size={14} style={{ marginRight: 4 }} />Request to Join</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No available challenges message */}
            {availableChallenges.length === 0 && myEnrolledChallenges.length === 0 && (
              <div style={{ background: colors.cardBg, borderRadius: 14, padding: 40, textAlign: 'center', border: `1px solid ${colors.borderColor}`, marginBottom: 24 }}>
                <Trophy size={40} color={colors.textMuted} style={{ marginBottom: 12 }} />
                <p style={{ color: colors.textMuted, margin: 0 }}>
                  {isInCorporate ? `No challenges available in ${group.name} right now` : 'No club challenges available right now'}
                </p>
              </div>
            )}

            {/* Browse Other Clubs (only for club members) */}
            {isInClub && (
              <button onClick={() => setShowJoinGroup(true)} style={{ width: '100%', padding: 16, background: colors.cardBg, border: `1px dashed ${colors.borderColor}`, borderRadius: 12, color: colors.textMuted, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Users size={18} />Browse Other Clubs
              </button>
            )}
          </>
        )}

        {/* Join Group Modal */}
        {showJoinGroup && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: colors.cardBg, borderRadius: 20, width: '90%', maxWidth: 500, maxHeight: '80vh', overflow: 'auto', padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ color: colors.text, margin: 0, fontSize: 20, fontWeight: 700 }}>Join a Club</h2>
                <button onClick={() => setShowJoinGroup(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color={colors.textMuted} /></button>
              </div>
              
              <p style={{ color: colors.textMuted, fontSize: 13, marginBottom: 20 }}>
                {isGeneralClient ? 'Browse available clubs to join. Corporate groups require employee verification.' : 'You can request to join other clubs.'}
              </p>
              
              {availableGroups.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <Users size={40} color={colors.textMuted} style={{ marginBottom: 12 }} />
                  <p style={{ color: colors.textMuted, margin: 0 }}>No clubs available to join</p>
                </div>
              ) : (
                availableGroups.map(g => {
                  const hasPendingRequest = myPendingRequests.some(r => r.groupId === g.id && r.type === 'group');
                  const openChallenges = g.challenges?.filter(c => c.status === 'open').length || 0;
                  return (
                    <div key={g.id} style={{ background: colors.darker, borderRadius: 14, padding: 16, marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <div style={{ width: 50, height: 50, borderRadius: 12, background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Flag size={24} color="white" />
                          </div>
                          <div>
                            <h4 style={{ color: colors.text, margin: 0, fontSize: 15, fontWeight: 600 }}>{g.name}</h4>
                            <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12 }}>Club • Started {g.startDate}</p>
                            {openChallenges > 0 && <p style={{ color: colors.success, margin: '4px 0 0', fontSize: 11 }}>{openChallenges} open challenge{openChallenges > 1 ? 's' : ''}</p>}
                          </div>
                        </div>
                        {hasPendingRequest ? (
                          <span style={{ background: `${colors.warning}20`, color: colors.warning, padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Pending</span>
                        ) : (
                          <button onClick={() => requestToJoinGroup(g)} style={{ padding: '8px 14px', background: colors.primary, border: 'none', borderRadius: 8, color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><Plus size={14} style={{ marginRight: 4 }} />Request</button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  // ============ NUTRITION TAB COMPONENT ============
  const NutritionTab = ({ client, colors }) => {
    const [activeSection, setActiveSection] = useState('overview');
    const nutritionPlan = useMemo(() => generateNutritionPlan(client), [client]);
    
    return (
      <>
        {/* Summary Card */}
        <div style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent})`, borderRadius: 20, padding: isMobile ? 20 : 28, marginBottom: isMobile ? 12 : 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          <Utensils size={isMobile ? 24 : 32} color="white" style={{ marginBottom: 12 }} />
          <h2 style={{ color: 'white', margin: '0 0 8px', fontSize: isMobile ? 18 : 22, fontWeight: 700 }}>Your Personalized Nutrition Plan</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: isMobile ? 12 : 14 }}>{nutritionPlan.summary}</p>
        </div>

        {/* Nutrition Disclaimer */}
        <div style={{ background: `${colors.warning}10`, borderRadius: 12, padding: 14, marginBottom: isMobile ? 16 : 24, border: `1px solid ${colors.warning}25`, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <AlertCircle size={18} color={colors.warning} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ color: colors.text, margin: 0, fontSize: 12, fontWeight: 500 }}>
              This nutrition guidance is for general wellness only. Consult a healthcare professional or registered dietitian before making significant dietary changes, especially if you have medical conditions, food allergies, or are pregnant/nursing.
            </p>
          </div>
        </div>

        {/* Macro Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 10 : 16, marginBottom: isMobile ? 16 : 24 }}>
          <div style={{ background: colors.cardBg, borderRadius: 14, padding: isMobile ? 14 : 20, textAlign: 'center', border: `1px solid ${colors.borderColor}` }}>
            <Flame size={isMobile ? 20 : 24} color={colors.primary} style={{ marginBottom: 8 }} />
            <p style={{ color: colors.text, margin: 0, fontSize: isMobile ? 22 : 28, fontWeight: 800 }}>{nutritionPlan.calories.target}</p>
            <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: isMobile ? 10 : 12 }}>Daily Calories</p>
            {nutritionPlan.calories.deficit > 0 && <p style={{ color: colors.secondary, margin: '4px 0 0', fontSize: isMobile ? 9 : 11 }}>-{nutritionPlan.calories.deficit} cal deficit</p>}
            {nutritionPlan.calories.surplus > 0 && <p style={{ color: colors.success, margin: '4px 0 0', fontSize: isMobile ? 9 : 11 }}>+{nutritionPlan.calories.surplus} cal surplus</p>}
          </div>
          <div style={{ background: colors.cardBg, borderRadius: 14, padding: isMobile ? 14 : 20, textAlign: 'center', border: `1px solid ${colors.borderColor}` }}>
            <div style={{ width: isMobile ? 20 : 24, height: isMobile ? 20 : 24, background: colors.danger, borderRadius: 6, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: isMobile ? 10 : 12 }}>P</div>
            <p style={{ color: colors.text, margin: 0, fontSize: isMobile ? 22 : 28, fontWeight: 800 }}>{nutritionPlan.macros.protein}g</p>
            <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: isMobile ? 10 : 12 }}>Protein</p>
          </div>
          <div style={{ background: colors.cardBg, borderRadius: 14, padding: isMobile ? 14 : 20, textAlign: 'center', border: `1px solid ${colors.borderColor}` }}>
            <div style={{ width: isMobile ? 20 : 24, height: isMobile ? 20 : 24, background: colors.warning, borderRadius: 6, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: isMobile ? 10 : 12 }}>C</div>
            <p style={{ color: colors.text, margin: 0, fontSize: isMobile ? 22 : 28, fontWeight: 800 }}>{nutritionPlan.macros.carbs}g</p>
            <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: isMobile ? 10 : 12 }}>Carbs</p>
          </div>
          <div style={{ background: colors.cardBg, borderRadius: 14, padding: isMobile ? 14 : 20, textAlign: 'center', border: `1px solid ${colors.borderColor}` }}>
            <div style={{ width: isMobile ? 20 : 24, height: isMobile ? 20 : 24, background: colors.accent, borderRadius: 6, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.dark, fontWeight: 700, fontSize: isMobile ? 10 : 12 }}>F</div>
            <p style={{ color: colors.text, margin: 0, fontSize: isMobile ? 22 : 28, fontWeight: 800 }}>{nutritionPlan.macros.fat}g</p>
            <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: isMobile ? 10 : 12 }}>Fat</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
          {[{ id: 'overview', label: 'Overview' }, { id: 'meals', label: 'Sample Meals' }, { id: 'timing', label: 'Meal Timing' }, { id: 'supplements', label: 'Supplements' }, { id: 'hydration', label: 'Hydration' }].map(t => (
            <button key={t.id} onClick={() => setActiveSection(t.id)} style={{ padding: isMobile ? '8px 12px' : '10px 18px', background: activeSection === t.id ? colors.secondary : colors.cardBg, border: `1px solid ${activeSection === t.id ? colors.secondary : colors.borderColor}`, borderRadius: 10, color: activeSection === t.id ? 'white' : colors.text, fontSize: isMobile ? 11 : 13, fontWeight: activeSection === t.id ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{t.label}</button>
          ))}
        </div>

        {activeSection === 'overview' && (
          <>
            {nutritionPlan.specialFocus.map((focus, i) => (
              <div key={i} style={{ background: colors.cardBg, borderRadius: 14, padding: 20, marginBottom: 16, border: `1px solid ${colors.borderColor}` }}>
                <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 15, fontWeight: 600 }}><Star size={16} color={colors.accent} style={{ marginRight: 8 }} />{focus.title}</h4>
                {focus.tips.map((tip, j) => (
                  <div key={j} style={{ background: colors.darker, borderRadius: 8, padding: 12, marginBottom: 8, display: 'flex', gap: 10 }}>
                    <Check size={16} color={colors.success} style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ color: colors.textMuted, margin: 0, fontSize: 13 }}>{tip}</p>
                  </div>
                ))}
              </div>
            ))}
            <div style={{ background: `${colors.primary}10`, borderRadius: 14, padding: 20, border: `1px solid ${colors.primary}30` }}>
              <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 15, fontWeight: 600 }}>Weekly Tips</h4>
              {nutritionPlan.weeklyTips.map((tip, i) => (
                <p key={i} style={{ color: colors.textMuted, margin: '0 0 8px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: colors.primary }}>•</span> {tip}</p>
              ))}
            </div>
          </>
        )}

        {activeSection === 'meals' && (
          <>
            <div style={{ background: `${colors.secondary}15`, borderRadius: 12, padding: 16, marginBottom: 20, border: `1px solid ${colors.secondary}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Calendar size={20} color={colors.secondary} />
                <div>
                  <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 14 }}>Week {nutritionPlan.mealWeek} Meal Suggestions</p>
                  <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 12 }}>New meal ideas rotate each week to keep things fresh!</p>
                </div>
              </div>
              <span style={{ background: colors.secondary, color: 'white', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>🔄 Auto-rotates</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[{ name: 'Breakfast', icon: '🌅', meals: nutritionPlan.sampleMeals.breakfast }, { name: 'Lunch', icon: '☀️', meals: nutritionPlan.sampleMeals.lunch }, { name: 'Dinner', icon: '🌙', meals: nutritionPlan.sampleMeals.dinner }, { name: 'Snacks', icon: '🍎', meals: nutritionPlan.sampleMeals.snacks }].map((meal, i) => (
                <div key={i} style={{ background: colors.cardBg, borderRadius: 14, padding: 20, border: `1px solid ${colors.borderColor}` }}>
                  <h4 style={{ color: colors.text, margin: '0 0 14px', fontSize: 15, fontWeight: 600 }}>{meal.icon} {meal.name}</h4>
                  {meal.meals.map((m, j) => (
                    <div key={j} style={{ background: colors.darker, borderRadius: 8, padding: 12, marginBottom: 8 }}>
                      <p style={{ color: colors.text, margin: 0, fontSize: 13 }}>{m}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {activeSection === 'timing' && (
          <div style={{ background: colors.cardBg, borderRadius: 14, padding: 24, border: `1px solid ${colors.borderColor}` }}>
            <h4 style={{ color: colors.text, margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}><Clock size={18} color={colors.primary} style={{ marginRight: 8 }} />Optimal Meal Timing</h4>
            {nutritionPlan.mealTiming.map((timing, i) => (
              <div key={i} style={{ background: colors.darker, borderRadius: 10, padding: 14, marginBottom: 10, display: 'flex', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${colors.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary, fontWeight: 700, fontSize: 13 }}>{i + 1}</div>
                <p style={{ color: colors.text, margin: 0, fontSize: 14, display: 'flex', alignItems: 'center' }}>{timing}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'supplements' && (
          <div style={{ background: colors.cardBg, borderRadius: 14, padding: 24, border: `1px solid ${colors.borderColor}` }}>
            <h4 style={{ color: colors.text, margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}><Shield size={18} color={colors.secondary} style={{ marginRight: 8 }} />Recommended Supplements</h4>
            <p style={{ color: colors.textMuted, fontSize: 12, marginBottom: 16 }}>Based on your profile and goals. Always consult a healthcare provider before starting supplements.</p>
            {nutritionPlan.supplements.map((supp, i) => (
              <div key={i} style={{ background: colors.darker, borderRadius: 10, padding: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.success }} />
                <p style={{ color: colors.text, margin: 0, fontSize: 14 }}>{supp}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'hydration' && (
          <div style={{ background: colors.cardBg, borderRadius: 14, padding: 24, border: `1px solid ${colors.borderColor}` }}>
            <h4 style={{ color: colors.text, margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}><Droplets size={18} color={colors.secondary} style={{ marginRight: 8 }} />Hydration Guide</h4>
            {nutritionPlan.hydration.map((h, i) => (
              <div key={i} style={{ background: `${colors.secondary}10`, borderRadius: 10, padding: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Droplets size={18} color={colors.secondary} />
                <p style={{ color: colors.text, margin: 0, fontSize: 14 }}>{h}</p>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  // ============ WORKOUT TAB COMPONENT ============
  // Exercise Log Card - separate component to prevent focus loss
  const ExerciseLogCard = ({ ex, initialLog, onUpdate, colors }) => {
    const [log, setLog] = useState(initialLog);
    
    const handleChange = (field, value) => {
      const updated = { ...log, [field]: value };
      setLog(updated);
      onUpdate(ex.name, updated);
    };

    return (
      <div style={{ background: log.completed ? `${colors.success}15` : colors.darker, borderRadius: 14, padding: 16, marginBottom: 12, border: `2px solid ${log.completed ? colors.success : 'transparent'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <button 
            onClick={() => handleChange('completed', !log.completed)}
            style={{ width: 28, height: 28, borderRadius: 8, background: log.completed ? colors.success : colors.borderColor, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {log.completed && <Check size={16} color="white" />}
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 14 }}>{ex.name}</p>
            {ex.prescription && <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 12 }}>Target: {ex.prescription.sets}×{ex.prescription.reps}</p>}
          </div>
          <span style={{ fontSize: 24 }}>{ex.demo}</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <div>
            <label style={{ color: colors.textMuted, fontSize: 10, display: 'block', marginBottom: 4 }}>WEIGHT (kg)</label>
            <input 
              type="number" 
              value={log.weight || ''} 
              onChange={e => handleChange('weight', e.target.value)}
              placeholder="—"
              style={{ width: '100%', padding: 10, background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.text, fontSize: 14, textAlign: 'center' }} 
            />
          </div>
          <div>
            <label style={{ color: colors.textMuted, fontSize: 10, display: 'block', marginBottom: 4 }}>SETS</label>
            <input 
              type="number" 
              value={log.sets || ''} 
              onChange={e => handleChange('sets', e.target.value)}
              placeholder={ex.prescription?.sets || '—'}
              style={{ width: '100%', padding: 10, background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.text, fontSize: 14, textAlign: 'center' }} 
            />
          </div>
          <div>
            <label style={{ color: colors.textMuted, fontSize: 10, display: 'block', marginBottom: 4 }}>REPS</label>
            <input 
              value={log.reps || ''} 
              onChange={e => handleChange('reps', e.target.value)}
              placeholder={ex.prescription?.reps || '—'}
              style={{ width: '100%', padding: 10, background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.text, fontSize: 14, textAlign: 'center' }} 
            />
          </div>
        </div>
        
        <input 
          value={log.notes || ''} 
          onChange={e => handleChange('notes', e.target.value)}
          placeholder="Add notes (optional)..."
          style={{ width: '100%', padding: 10, background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.text, fontSize: 13, marginTop: 8 }} 
        />
      </div>
    );
  };

  const WorkoutTab = ({ client, workout, colors, setSelectedExercise, setClients, clients, setLoggedInUser, workoutViewMode, setWorkoutViewMode }) => {
    const [showAddWorkout, setShowAddWorkout] = useState(false);
    const [editingWorkout, setEditingWorkout] = useState(null);
    const [newWorkout, setNewWorkout] = useState({ day: 'Monday', name: '', type: 'strength', duration: 45, exercises: [] });
    const [newExercise, setNewExercise] = useState({ name: '', sets: 3, reps: '10', notes: '' });
    const [trackingDay, setTrackingDay] = useState(null); // Which day's workout we're logging
    const exerciseLogsRef = useRef({}); // Use ref to avoid re-renders
    const [completedCount, setCompletedCount] = useState(0); // Only for progress display

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const workoutTypes = [{ id: 'strength', label: 'Strength', icon: '🏋️' }, { id: 'cardio', label: 'Cardio', icon: '🏃' }, { id: 'hybrid', label: 'Hybrid', icon: '⚡' }, { id: 'recovery', label: 'Recovery', icon: '🧘' }];

    // Today's day name
    const todayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
    const todayDate = new Date().toISOString().slice(0, 10);

    // Use lifted state for toggle
    const useCustom = workoutViewMode === 'custom';
    const toggleMode = (custom) => setWorkoutViewMode(custom ? 'custom' : 'suggested');

    // Check if a day's workout was already logged today
    const getWorkoutLog = (dayName) => {
      return (client.workoutLogs || []).find(log => log.date === todayDate && log.dayName === dayName);
    };

    // Start tracking a workout day
    const startTracking = (day) => {
      const existingLog = getWorkoutLog(day.day);
      if (existingLog) {
        const logs = {};
        existingLog.exercises.forEach(ex => {
          logs[ex.name] = ex;
        });
        exerciseLogsRef.current = logs;
        setCompletedCount(Object.values(logs).filter(e => e.completed).length);
      } else {
        const logs = {};
        day.exercises.forEach(ex => {
          logs[ex.name] = { completed: false, weight: '', reps: '', sets: '', notes: '' };
        });
        exerciseLogsRef.current = logs;
        setCompletedCount(0);
      }
      setTrackingDay(day);
    };

    // Update exercise log (called by ExerciseLogCard)
    const handleExerciseUpdate = (exName, data) => {
      exerciseLogsRef.current[exName] = data;
      // Only update completed count for progress bar
      const newCount = Object.values(exerciseLogsRef.current).filter(e => e.completed).length;
      if (newCount !== completedCount) {
        setCompletedCount(newCount);
      }
    };

    // Save workout log
    const saveWorkoutLog = () => {
      const logEntry = {
        date: todayDate,
        dayName: trackingDay.day,
        workoutName: trackingDay.name,
        exercises: Object.entries(exerciseLogsRef.current).map(([name, data]) => ({ name, ...data })),
        completedAt: new Date().toISOString()
      };

      // Update or add log
      let updatedLogs = [...(client.workoutLogs || [])];
      const existingIndex = updatedLogs.findIndex(l => l.date === todayDate && l.dayName === trackingDay.day);
      if (existingIndex >= 0) {
        updatedLogs[existingIndex] = logEntry;
      } else {
        updatedLogs.push(logEntry);
      }

      const updated = clients.map(c => c.id === client.id ? { ...c, workoutLogs: updatedLogs } : c);
      setClients(updated);
      setLoggedInUser({ ...client, workoutLogs: updatedLogs });
      setTrackingDay(null);
      exerciseLogsRef.current = {};
      setCompletedCount(0);
    };

    const addExercise = () => {
      if (newExercise.name) {
        setNewWorkout({ ...newWorkout, exercises: [...newWorkout.exercises, { ...newExercise }] });
        setNewExercise({ name: '', sets: 3, reps: '10', notes: '' });
      }
    };

    const saveWorkout = () => {
      const workoutToSave = { ...newWorkout, id: editingWorkout ? editingWorkout.id : Date.now() };
      let updatedCustomWorkouts;
      
      if (editingWorkout) {
        updatedCustomWorkouts = client.customWorkouts.map(w => w.id === editingWorkout.id ? workoutToSave : w);
      } else {
        updatedCustomWorkouts = [...(client.customWorkouts || []), workoutToSave];
      }
      
      const updated = clients.map(c => c.id === client.id ? { ...c, customWorkouts: updatedCustomWorkouts } : c);
      setClients(updated);
      setLoggedInUser({ ...client, customWorkouts: updatedCustomWorkouts });
      setShowAddWorkout(false);
      setEditingWorkout(null);
      setNewWorkout({ day: 'Monday', name: '', type: 'strength', duration: 45, exercises: [] });
    };

    const deleteWorkout = (workoutId) => {
      const updatedCustomWorkouts = client.customWorkouts.filter(w => w.id !== workoutId);
      const updated = clients.map(c => c.id === client.id ? { ...c, customWorkouts: updatedCustomWorkouts } : c);
      setClients(updated);
      setLoggedInUser({ ...client, customWorkouts: updatedCustomWorkouts });
    };

    const editWorkout = (w) => {
      setEditingWorkout(w);
      setNewWorkout({ ...w });
      setShowAddWorkout(true);
    };

    const totalCount = trackingDay ? trackingDay.exercises.length : 0;

    return (
      <>
        {/* Workout Tracking Modal */}
        {trackingDay && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
            <div style={{ background: colors.cardBg, borderRadius: 20, width: '100%', maxWidth: 500, maxHeight: '90vh', overflow: 'auto', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h2 style={{ color: colors.text, margin: 0, fontSize: 20, fontWeight: 700 }}>Log Workout</h2>
                  <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 13 }}>{trackingDay.day} • {trackingDay.name}</p>
                </div>
                <button onClick={() => setTrackingDay(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color={colors.textMuted} /></button>
              </div>

              {/* Progress */}
              <div style={{ background: colors.darker, borderRadius: 12, padding: 14, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ color: colors.textMuted, fontSize: 13 }}>Progress</span>
                  <span style={{ color: completedCount === totalCount ? colors.success : colors.text, fontWeight: 600 }}>{completedCount}/{totalCount} exercises</span>
                </div>
                <div style={{ height: 6, background: colors.borderColor, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${totalCount > 0 ? (completedCount/totalCount)*100 : 0}%`, background: `linear-gradient(90deg, ${colors.primary}, ${colors.success})`, borderRadius: 3, transition: 'width 0.3s' }} />
                </div>
              </div>

              {/* Exercises - using ExerciseLogCard for stable inputs */}
              <div style={{ marginBottom: 20 }}>
                {trackingDay.exercises.map((ex) => (
                  <ExerciseLogCard
                    key={ex.name}
                    ex={ex}
                    initialLog={exerciseLogsRef.current[ex.name] || { completed: false, weight: '', reps: '', sets: '', notes: '' }}
                    onUpdate={handleExerciseUpdate}
                    colors={colors}
                  />
                ))}
              </div>

              <button 
                onClick={saveWorkoutLog} 
                style={{ width: '100%', padding: 16, background: `linear-gradient(135deg, ${colors.primary}, ${colors.success})`, border: 'none', borderRadius: 12, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
              >
                <Save size={18} style={{ marginRight: 8 }} />Save Workout Log
              </button>
            </div>
          </div>
        )}
        
        {/* Mode Toggle */}
        <div style={{ display: 'flex', gap: 8, background: colors.darker, padding: 4, borderRadius: 12, marginBottom: 16 }}>
          <button onClick={() => toggleMode(false)} style={{ flex: 1, padding: 14, background: !useCustom ? colors.cardBg : 'transparent', border: 'none', borderRadius: 10, color: !useCustom ? colors.text : colors.textMuted, fontSize: 14, fontWeight: !useCustom ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Dumbbell size={18} /> Suggested Plan
          </button>
          <button onClick={() => toggleMode(true)} style={{ flex: 1, padding: 14, background: useCustom ? colors.cardBg : 'transparent', border: 'none', borderRadius: 10, color: useCustom ? colors.text : colors.textMuted, fontSize: 14, fontWeight: useCustom ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Target size={18} /> Custom Plan
          </button>
        </div>

        {/* Health Safety Disclaimer */}
        <div style={{ background: `${colors.warning}10`, borderRadius: 12, padding: 14, marginBottom: 16, border: `1px solid ${colors.warning}25`, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <AlertCircle size={18} color={colors.warning} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ color: colors.text, margin: 0, fontSize: 12, fontWeight: 500 }}>
              Always warm up before exercising and listen to your body. Stop immediately if you feel pain, dizziness, or shortness of breath. Consult your doctor before starting any new exercise program.
            </p>
          </div>
        </div>

        {/* PT Session Encouragement */}
        <div style={{ background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`, borderRadius: 12, padding: 14, marginBottom: 24, border: `1px solid ${colors.primary}20`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${colors.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={20} color={colors.primary} />
          </div>
          <div>
            <p style={{ color: colors.text, margin: 0, fontSize: 13, fontWeight: 600 }}>Need help with form or technique?</p>
            <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12 }}>Book a session with your PT for personalized guidance and to maximize your results!</p>
          </div>
        </div>

        {!useCustom ? (
          /* Suggested Workouts */
          <>
            <div style={{ background: `linear-gradient(135deg, ${colors.secondary}15, ${colors.accent}15)`, borderRadius: 16, padding: 24, marginBottom: 24, border: `1px solid ${colors.secondary}30` }}>
              <h3 style={{ color: colors.text, margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>Your Philosophy</h3>
              <p style={{ color: colors.textMuted, margin: 0, fontSize: 14 }}>{workout.philosophy}</p>
            </div>
            <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: 18, fontWeight: 600 }}>Weekly Plan</h3>
            {workout.schedule.map((day, i) => {
              const todayLog = getWorkoutLog(day.day);
              const isToday = day.day === todayName;
              return (
                <div key={i} style={{ background: colors.cardBg, borderRadius: 16, border: `1px solid ${todayLog ? colors.success : isToday ? colors.primary : colors.borderColor}`, marginBottom: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 20px', background: todayLog ? `${colors.success}15` : day.type === 'recovery' ? `${colors.secondary}15` : `${colors.primary}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {todayLog && <Check size={20} color={colors.success} />}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: isToday ? colors.primary : colors.textMuted, fontWeight: 700, fontSize: 12 }}>{day.day}</span>
                          {isToday && <span style={{ background: colors.primary, color: 'white', padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600 }}>TODAY</span>}
                          {todayLog && <span style={{ background: colors.success, color: 'white', padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600 }}>LOGGED</span>}
                        </div>
                        <h4 style={{ color: colors.text, margin: '4px 0 0', fontSize: 16, fontWeight: 600 }}>{day.name}</h4>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: colors.textMuted, fontSize: 13 }}><Clock size={14} /> {day.duration}min</span>
                      <button 
                        onClick={() => startTracking(day)}
                        style={{ padding: '8px 14px', background: todayLog ? colors.success : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, border: 'none', borderRadius: 8, color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        {todayLog ? <><FileText size={14} />Edit</> : <><Plus size={14} />Log</>}
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: 20 }}>
                    {day.exercises.map((ex, j) => {
                      const logged = todayLog?.exercises?.find(e => e.name === ex.name);
                      return (
                        <div key={j} onClick={() => ex.id && setSelectedExercise(ex)} style={{ background: logged?.completed ? `${colors.success}10` : colors.darker, borderRadius: 12, padding: 14, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: ex.id ? 'pointer' : 'default' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            {logged?.completed && <Check size={16} color={colors.success} />}
                            <span style={{ fontSize: 24 }}>{ex.demo}</span>
                            <div>
                              <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 14 }}>{ex.name}</p>
                              {ex.prescription && <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 12 }}>{ex.prescription.sets}×{ex.prescription.reps} • {ex.prescription.rest}s</p>}
                              {logged && logged.weight && <p style={{ color: colors.success, margin: '2px 0 0', fontSize: 11 }}>Logged: {logged.weight}kg × {logged.sets || '—'}×{logged.reps || '—'}</p>}
                            </div>
                          </div>
                          {ex.id && <Eye size={18} color={colors.primary} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* PT Custom Workouts for This Client */}
            {client.ptWorkouts && client.ptWorkouts.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${colors.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star size={16} color={colors.accent} />
                  </div>
                  <div>
                    <h3 style={{ color: colors.text, margin: 0, fontSize: 16, fontWeight: 600 }}>Workouts From Your PT</h3>
                    <p style={{ color: colors.textMuted, margin: 0, fontSize: 12 }}>Custom workouts designed specifically for you</p>
                  </div>
                </div>
                {client.ptWorkouts.map((w, i) => (
                  <div key={w.id} style={{ background: colors.cardBg, borderRadius: 16, border: `2px solid ${colors.accent}40`, marginBottom: 16, overflow: 'hidden' }}>
                    <div style={{ padding: '14px 20px', background: `${colors.accent}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 24 }}>{w.type === 'cardio' ? '🏃' : w.type === 'mobility' ? '🧘' : w.type === 'rehab' ? '💪' : '🏋️'}</span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: colors.accent, fontWeight: 700, fontSize: 12 }}>{w.day}</span>
                            <span style={{ background: colors.accent, color: 'white', padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600 }}>FROM YOUR PT</span>
                          </div>
                          <h4 style={{ color: colors.text, margin: '4px 0 0', fontSize: 16, fontWeight: 600 }}>{w.name}</h4>
                        </div>
                      </div>
                      <span style={{ color: colors.textMuted, fontSize: 13 }}><Clock size={14} /> {w.duration}min</span>
                    </div>
                    <div style={{ padding: 20 }}>
                      {w.exercises.map((ex, j) => (
                        <div key={j} style={{ background: colors.darker, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 14 }}>{ex.name}</p>
                            <span style={{ color: colors.accent, fontSize: 13, fontWeight: 600 }}>{ex.sets} × {ex.reps}</span>
                          </div>
                        </div>
                      ))}
                      {w.notes && (
                        <div style={{ background: `${colors.accent}10`, borderRadius: 10, padding: 12, marginTop: 8, borderLeft: `3px solid ${colors.accent}` }}>
                          <p style={{ color: colors.text, margin: 0, fontSize: 13, fontStyle: 'italic' }}>💬 {w.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Custom Workouts */
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ color: colors.text, margin: 0, fontSize: 18, fontWeight: 600 }}>My Custom Plan</h3>
                <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 13 }}>Create your own workout schedule</p>
              </div>
              <button onClick={() => { setShowAddWorkout(true); setEditingWorkout(null); setNewWorkout({ day: 'Monday', name: '', type: 'strength', duration: 45, exercises: [] }); }} style={{ padding: '12px 20px', background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, border: 'none', borderRadius: 10, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><Plus size={16} style={{ marginRight: 6 }} />Add Workout</button>
            </div>

            {(!client.customWorkouts || client.customWorkouts.length === 0) ? (
              <div style={{ background: colors.cardBg, borderRadius: 16, padding: 60, textAlign: 'center', border: `1px solid ${colors.borderColor}` }}>
                <Calendar size={48} color={colors.textMuted} style={{ marginBottom: 16 }} />
                <h3 style={{ color: colors.text, margin: '0 0 8px' }}>No Custom Workouts Yet</h3>
                <p style={{ color: colors.textMuted, margin: '0 0 20px' }}>Build your own schedule by adding workout days</p>
                <button onClick={() => setShowAddWorkout(true)} style={{ padding: '12px 24px', background: colors.primary, border: 'none', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}><Plus size={16} style={{ marginRight: 6 }} />Create First Workout</button>
              </div>
            ) : (
              <>
                {days.map(day => {
                  const dayWorkouts = client.customWorkouts.filter(w => w.day === day);
                  if (dayWorkouts.length === 0) return null;
                  return dayWorkouts.map(w => (
                    <div key={w.id} style={{ background: colors.cardBg, borderRadius: 16, border: `1px solid ${colors.borderColor}`, marginBottom: 16, overflow: 'hidden' }}>
                      <div style={{ padding: '14px 20px', background: w.type === 'recovery' ? `${colors.secondary}15` : w.type === 'cardio' ? `${colors.danger}15` : `${colors.primary}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 24 }}>{workoutTypes.find(t => t.id === w.type)?.icon || '🏋️'}</span>
                          <div>
                            <span style={{ color: colors.primary, fontWeight: 700, fontSize: 12 }}>{w.day}</span>
                            <h4 style={{ color: colors.text, margin: '4px 0 0', fontSize: 16, fontWeight: 600 }}>{w.name}</h4>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ color: colors.textMuted, fontSize: 13 }}><Clock size={14} /> {w.duration}min</span>
                          <button onClick={() => editWorkout(w)} style={{ padding: 8, background: colors.darker, border: 'none', borderRadius: 8, cursor: 'pointer' }}><FileText size={14} color={colors.textMuted} /></button>
                          <button onClick={() => deleteWorkout(w.id)} style={{ padding: 8, background: `${colors.danger}20`, border: 'none', borderRadius: 8, cursor: 'pointer' }}><X size={14} color={colors.danger} /></button>
                        </div>
                      </div>
                      <div style={{ padding: 20 }}>
                        {w.exercises.map((ex, j) => (
                          <div key={j} style={{ background: colors.darker, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 14 }}>{ex.name}</p>
                              <span style={{ color: colors.primary, fontSize: 13, fontWeight: 600 }}>{ex.sets} × {ex.reps}</span>
                            </div>
                            {ex.notes && <p style={{ color: colors.textMuted, margin: '6px 0 0', fontSize: 12 }}>{ex.notes}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })}
              </>
            )}
          </>
        )}

        {/* Add/Edit Workout Modal */}
        {showAddWorkout && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            <div style={{ background: colors.cardBg, borderRadius: 20, width: '100%', maxWidth: 550, maxHeight: '90vh', overflow: 'auto', padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ color: colors.text, margin: 0, fontSize: 20, fontWeight: 700 }}>{editingWorkout ? 'Edit Workout' : 'Add Custom Workout'}</h2>
                <button onClick={() => { setShowAddWorkout(false); setEditingWorkout(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color={colors.textMuted} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Day</label>
                  <select value={newWorkout.day} onChange={e => setNewWorkout({...newWorkout, day: e.target.value})} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }}>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Duration (min)</label>
                  <input type="number" value={newWorkout.duration} onChange={e => setNewWorkout({...newWorkout, duration: parseInt(e.target.value) || 0})} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Workout Name</label>
                  <input value={newWorkout.name} onChange={e => setNewWorkout({...newWorkout, name: e.target.value})} placeholder="e.g. Upper Body, Long Run, HIIT" style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 8 }}>Workout Type</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {workoutTypes.map(t => (
                    <button key={t.id} onClick={() => setNewWorkout({...newWorkout, type: t.id})} style={{ flex: 1, padding: 12, background: newWorkout.type === t.id ? `${colors.primary}20` : colors.darker, border: `2px solid ${newWorkout.type === t.id ? colors.primary : 'transparent'}`, borderRadius: 10, color: newWorkout.type === t.id ? colors.text : colors.textMuted, fontSize: 12, cursor: 'pointer' }}>
                      <span style={{ fontSize: 20, display: 'block', marginBottom: 4 }}>{t.icon}</span>{t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: colors.darker, borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 14 }}>Exercises ({newWorkout.exercises.length})</h4>
                
                {newWorkout.exercises.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    {newWorkout.exercises.map((ex, i) => (
                      <div key={i} style={{ background: colors.cardBg, borderRadius: 8, padding: 10, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ color: colors.text, fontWeight: 500 }}>{ex.name}</span>
                          <span style={{ color: colors.textMuted, marginLeft: 8, fontSize: 12 }}>{ex.sets}×{ex.reps}</span>
                        </div>
                        <button onClick={() => setNewWorkout({...newWorkout, exercises: newWorkout.exercises.filter((_, idx) => idx !== i)})} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={14} color={colors.danger} /></button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                  <input value={newExercise.name} onChange={e => setNewExercise({...newExercise, name: e.target.value})} placeholder="Exercise name" style={{ padding: 10, background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.text, fontSize: 13 }} />
                  <input type="number" value={newExercise.sets} onChange={e => setNewExercise({...newExercise, sets: parseInt(e.target.value) || 0})} placeholder="Sets" style={{ padding: 10, background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.text, fontSize: 13 }} />
                  <input value={newExercise.reps} onChange={e => setNewExercise({...newExercise, reps: e.target.value})} placeholder="Reps" style={{ padding: 10, background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.text, fontSize: 13 }} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={newExercise.notes} onChange={e => setNewExercise({...newExercise, notes: e.target.value})} placeholder="Notes (optional)" style={{ flex: 1, padding: 10, background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.text, fontSize: 13 }} />
                  <button onClick={addExercise} style={{ padding: '10px 16px', background: colors.secondary, border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer' }}><Plus size={16} /></button>
                </div>
              </div>

              <button onClick={saveWorkout} disabled={!newWorkout.name || newWorkout.exercises.length === 0} style={{ width: '100%', padding: 14, background: newWorkout.name && newWorkout.exercises.length > 0 ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.borderColor, border: 'none', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 600, cursor: newWorkout.name && newWorkout.exercises.length > 0 ? 'pointer' : 'not-allowed' }}>
                <Save size={18} style={{ marginRight: 8 }} />{editingWorkout ? 'Update Workout' : 'Save Workout'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  // ============ CLIENT DASHBOARD ============
  const ClientDashboard = () => {
    const client = loggedInUser;
    const activeTab = clientActiveTab; // Use lifted state
    const setActiveTab = setClientActiveTab; // Use lifted setter
    const [showLog, setShowLog] = useState(false);
    const [logData, setLogData] = useState({ energy: 7, mood: 7, workoutsCompleted: 3, notes: '' });
    const [showProfileEdit, setShowProfileEdit] = useState(false);
    const [profileEditSection, setProfileEditSection] = useState(null); // 'weight', 'injuries', 'goals'
    const [editFormData, setEditFormData] = useState({});
    const workout = useMemo(() => generateDynamicWorkout(client), [client]);
    const group = groups.find(g => g.name === client.group);

    // Re-assessment logic - every 12 weeks
    const cycleLength = 12;
    const currentCycle = Math.ceil(client.currentWeek / cycleLength);
    const weeksIntoCycle = client.currentWeek % cycleLength || cycleLength;
    const weeksUntilReassessment = cycleLength - weeksIntoCycle;
    const isReassessmentDue = weeksUntilReassessment === 0 || client.currentWeek >= cycleLength && weeksIntoCycle === cycleLength;
    const isReassessmentSoon = weeksUntilReassessment <= 2 && weeksUntilReassessment > 0;

    const saveLog = () => {
      const updated = clients.map(c => c.id === client.id ? { ...c, weeklyLogs: [...c.weeklyLogs, { week: c.weeklyLogs.length + 1, ...logData }], currentWeek: c.currentWeek + 1 } : c);
      setClients(updated);
      setLoggedInUser({ ...client, weeklyLogs: [...client.weeklyLogs, { week: client.weeklyLogs.length + 1, ...logData }], currentWeek: client.currentWeek + 1 });
      setShowLog(false);
    };

    const updateClientProfile = (field, value) => {
      const updatedClient = { ...client, [field]: value };
      const updated = clients.map(c => c.id === client.id ? updatedClient : c);
      setClients(updated);
      setLoggedInUser(updatedClient);
    };

    const updateInjuryStatus = (injuryIndex, newStatus) => {
      const updatedInjuries = client.injuries.map((inj, i) => 
        i === injuryIndex ? { ...inj, status: newStatus, recoveredDate: newStatus === 'recovered' ? new Date().toISOString().slice(0, 10) : inj.recoveredDate } : inj
      );
      updateClientProfile('injuries', updatedInjuries);
    };

    const addNewInjury = (injury) => {
      const updatedInjuries = [...(client.injuries || []), { ...injury, date: new Date().toISOString().slice(0, 7) }];
      updateClientProfile('injuries', updatedInjuries);
    };

    const requestReassessment = () => {
      // Mark that client has requested reassessment
      const updatedClient = { ...client, reassessmentRequested: true, reassessmentRequestDate: new Date().toISOString().split('T')[0] };
      const updated = clients.map(c => c.id === client.id ? updatedClient : c);
      setClients(updated);
      setLoggedInUser(updatedClient);
    };

    return (
      <div style={{ minHeight: '100vh', background: colors.dark, fontFamily: 'Inter, sans-serif', overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@700;800&display=swap'); * { box-sizing: border-box; } html, body { margin: 0; padding: 0; overflow-x: hidden; width: 100%; max-width: 100vw; }`}</style>
        <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, padding: isMobile ? '16px 16px 12px' : '24px 32px', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16 }}>
              <div style={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50, borderRadius: isMobile ? 10 : 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Dumbbell size={isMobile ? 20 : 26} color="white" /></div>
              <div><h1 style={{ color: 'white', margin: 0, fontSize: isMobile ? 16 : 20, fontWeight: 700 }}>Hi, {client.name.split(' ')[0]}! 💪</h1><p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: isMobile ? 11 : 13 }}>Week {client.currentWeek}</p></div>
            </div>
            <div style={{ display: 'flex', gap: isMobile ? 8 : 12, flexShrink: 0 }}>
              <button onClick={() => setShowLog(true)} style={{ padding: isMobile ? '8px 12px' : '10px 20px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10, color: 'white', fontSize: isMobile ? 11 : 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={isMobile ? 14 : 16} />{isMobile ? 'Log' : 'Log Week'}</button>
              <button onClick={() => { setUserType(null); setLoggedInUser(null); setCurrentView('login'); }} style={{ padding: isMobile ? 8 : 10, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, color: 'white', cursor: 'pointer' }}><LogOut size={isMobile ? 16 : 18} /></button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: isMobile ? 6 : 8, marginTop: isMobile ? 12 : 20, overflowX: 'auto', paddingBottom: 4, marginLeft: 0, marginRight: 0 }}>
            {['overview', 'workout', 'progress', 'challenges', 'nutrition'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ padding: isMobile ? '8px 14px' : '10px 18px', background: activeTab === t ? 'white' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 20, color: activeTab === t ? colors.primary : 'white', fontSize: isMobile ? 12 : 13, fontWeight: activeTab === t ? 600 : 400, cursor: 'pointer', textTransform: 'capitalize', whiteSpace: 'nowrap', flexShrink: 0 }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ padding: isMobile ? 16 : 32, maxWidth: 1200, margin: '0 auto' }}>
          {activeTab === 'overview' && (
            <>
              {/* Welcome Banner for New Clients (Week 1-3) */}
              {client.currentWeek <= 3 && (
                <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, borderRadius: 16, padding: isMobile ? 16 : 24, marginBottom: isMobile ? 16 : 24, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', bottom: -40, left: -40, width: 100, height: 100, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 32 }}>🎉</span>
                    <div>
                      <h3 style={{ color: 'white', margin: 0, fontSize: isMobile ? 16 : 20, fontWeight: 700 }}>
                        {client.currentWeek === 1 ? 'Welcome to Your Fitness Journey!' : `Week ${client.currentWeek} — You're Building Momentum!`}
                      </h3>
                      <p style={{ color: 'rgba(255,255,255,0.9)', margin: '4px 0 0', fontSize: isMobile ? 12 : 14 }}>
                        {client.currentWeek === 1 ? 'Your personalized program is ready. Let\'s get started!' : 
                         client.currentWeek === 2 ? 'Great job on week 1! Consistency is the key to success.' :
                         'You\'re establishing great habits. Keep it up!'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Onboarding Tips */}
                  <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 14 }}>
                    <p style={{ color: 'white', margin: 0, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>💡 Tip for Week {client.currentWeek}:</p>
                    <p style={{ color: 'rgba(255,255,255,0.95)', margin: 0, fontSize: 13 }}>
                      {client.currentWeek === 1 ? 'Start by exploring your Workout tab. Your PT has designed a plan just for you. Don\'t worry about being perfect — just show up!' :
                       client.currentWeek === 2 ? 'Log your workouts using the "Log" button on each day. Tracking helps you see your progress and helps your PT adjust your program.' :
                       'Check the Nutrition tab for meal ideas tailored to your goals. Small dietary changes can make a big difference!'}
                    </p>
                  </div>
                </div>
              )}

              {/* Re-assessment Banner */}
              {isReassessmentDue && (
                <div style={{ background: `linear-gradient(135deg, ${colors.warning}, ${colors.accent})`, borderRadius: 16, padding: isMobile ? 16 : 24, marginBottom: isMobile ? 16 : 24, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clipboard size={isMobile ? 20 : 24} color="white" />
                      </div>
                      <div>
                        <h3 style={{ color: 'white', margin: 0, fontSize: isMobile ? 14 : 18, fontWeight: 700 }}>🎉 Cycle {currentCycle} Complete!</h3>
                        <p style={{ color: 'rgba(255,255,255,0.9)', margin: '4px 0 0', fontSize: isMobile ? 12 : 14 }}>Time for your 12-week reassessment</p>
                      </div>
                    </div>
                    {!client.reassessmentRequested ? (
                      <button onClick={requestReassessment} style={{ padding: isMobile ? '10px 20px' : '12px 24px', background: 'white', border: 'none', borderRadius: 10, color: colors.warning, fontSize: isMobile ? 12 : 14, fontWeight: 600, cursor: 'pointer', width: isMobile ? '100%' : 'auto' }}>Request Reassessment</button>
                    ) : (
                      <span style={{ background: 'rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: 10, color: 'white', fontSize: 13, fontWeight: 600 }}>✓ Requested</span>
                    )}
                  </div>
                </div>
              )}

              {/* Upcoming Re-assessment Notice */}
              {isReassessmentSoon && !isReassessmentDue && (
                <div style={{ background: `${colors.secondary}15`, borderRadius: 12, padding: isMobile ? 12 : 16, marginBottom: isMobile ? 16 : 24, border: `1px solid ${colors.secondary}30`, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Clock size={isMobile ? 16 : 20} color={colors.secondary} />
                  <p style={{ color: colors.text, margin: 0, fontSize: isMobile ? 12 : 14 }}>
                    <strong>Reassessment in {weeksUntilReassessment} week{weeksUntilReassessment > 1 ? 's' : ''}</strong> — End of Cycle {currentCycle}
                  </p>
                </div>
              )}

              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 12 : 16, marginBottom: isMobile ? 16 : 24 }}>
                {[
                  { label: 'Week', value: client.currentWeek, icon: Calendar, color: colors.primary, sub: `Cycle ${currentCycle}` },
                  { label: 'Workouts', value: client.weeklyLogs.reduce((a, l) => a + l.workoutsCompleted, 0), icon: Dumbbell, color: colors.secondary, sub: 'Total completed' },
                  { label: 'Avg Energy', value: client.weeklyLogs.length > 0 ? (client.weeklyLogs.reduce((a, l) => a + l.energy, 0) / client.weeklyLogs.length).toFixed(1) : '—', icon: Zap, color: colors.accent, sub: 'Out of 10' },
                  { label: 'This Week', value: client.weeklyLogs[client.weeklyLogs.length - 1]?.workoutsCompleted || 0, icon: Flame, color: colors.success, sub: 'workouts' }
                ].map((s, i) => (
                  <div key={i} style={{ background: colors.cardBg, borderRadius: 16, padding: 20, border: `1px solid ${colors.borderColor}` }}>
                    <s.icon size={24} color={s.color} style={{ marginBottom: 12 }} />
                    <p style={{ color: colors.textMuted, margin: 0, fontSize: 12 }}>{s.label}</p>
                    <p style={{ color: colors.text, margin: '4px 0 0', fontSize: 28, fontWeight: 700 }}>{s.value}</p>
                    <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 11 }}>{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Profile & Health Section */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 20, marginBottom: isMobile ? 16 : 24 }}>
                {/* Health Metrics */}
                <div style={{ background: colors.cardBg, borderRadius: 16, padding: isMobile ? 16 : 24, border: `1px solid ${colors.borderColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? 12 : 20, flexWrap: 'wrap', gap: 8 }}>
                    <h3 style={{ color: colors.text, margin: 0, fontSize: isMobile ? 14 : 16, fontWeight: 600 }}><Heart size={isMobile ? 16 : 18} color={colors.danger} style={{ marginRight: 8 }} />Health Metrics</h3>
                    <span style={{ background: `${colors.secondary}15`, padding: '4px 10px', borderRadius: 8, color: colors.secondary, fontSize: isMobile ? 9 : 11 }}>Updated at reassessment</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : '1fr 1fr', gap: isMobile ? 8 : 12 }}>
                    {[
                      { label: 'Height', value: client.height ? `${client.height} cm` : '—', icon: '📏' },
                      { label: 'Weight', value: client.weight ? `${client.weight} kg` : '—', icon: '⚖️', highlight: true },
                      { label: 'Target', value: client.targetWeight ? `${client.targetWeight} kg` : '—', icon: '🎯' },
                      { label: 'BP', value: client.bloodPressure || '—', icon: '💓' },
                      { label: 'Resting HR', value: client.restingHR ? `${client.restingHR} bpm` : '—', icon: '❤️' },
                      { label: 'Progress', value: client.weight && client.targetWeight ? `${Math.abs(client.weight - client.targetWeight)} kg` : '—', icon: client.weight > client.targetWeight ? '📉' : '📈' }
                    ].map((m, i) => (
                      <div key={i} style={{ background: colors.darker, borderRadius: 10, padding: isMobile ? 10 : 12 }}>
                        <span style={{ fontSize: isMobile ? 14 : 16 }}>{m.icon}</span>
                        <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: isMobile ? 9 : 11 }}>{m.label}</p>
                        <p style={{ color: m.highlight ? colors.primary : colors.text, margin: '2px 0 0', fontSize: isMobile ? 13 : 15, fontWeight: 600 }}>{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* My Profile Card */}
                <div style={{ background: colors.cardBg, borderRadius: 16, padding: isMobile ? 16 : 24, border: `1px solid ${colors.borderColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? 12 : 20 }}>
                    <h3 style={{ color: colors.text, margin: 0, fontSize: isMobile ? 14 : 16, fontWeight: 600 }}><User size={isMobile ? 16 : 18} color={colors.primary} style={{ marginRight: 8 }} />My Profile</h3>
                    <button onClick={() => { setProfileEditSection('profile'); setEditFormData({ name: client.name, email: client.email, phone: client.phone || '' }); setShowProfileEdit(true); }} style={{ background: `${colors.primary}15`, border: 'none', borderRadius: 8, padding: isMobile ? '5px 10px' : '6px 12px', color: colors.primary, fontSize: isMobile ? 11 : 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><FileText size={12} />Edit</button>
                  </div>
                  
                  {/* Profile Photo Placeholder */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 24, fontWeight: 700 }}>
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ color: colors.text, margin: 0, fontSize: 18, fontWeight: 600 }}>{client.name}</p>
                      <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12 }}>Member since Week 1</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div style={{ display: 'grid', gap: 10 }}>
                    <div style={{ background: colors.darker, borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Mail size={16} color={colors.textMuted} />
                      <div>
                        <p style={{ color: colors.textMuted, margin: 0, fontSize: 10 }}>EMAIL</p>
                        <p style={{ color: colors.text, margin: '2px 0 0', fontSize: 13 }}>{client.email}</p>
                      </div>
                    </div>
                    <div style={{ background: colors.darker, borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Phone size={16} color={colors.textMuted} />
                      <div>
                        <p style={{ color: colors.textMuted, margin: 0, fontSize: 10 }}>PHONE</p>
                        <p style={{ color: colors.text, margin: '2px 0 0', fontSize: 13 }}>{client.phone || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assessment Scores */}
              <div style={{ background: colors.cardBg, borderRadius: 16, padding: isMobile ? 16 : 24, border: `1px solid ${colors.borderColor}`, marginBottom: isMobile ? 16 : 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? 12 : 20 }}>
                  <h3 style={{ color: colors.text, margin: 0, fontSize: isMobile ? 14 : 16, fontWeight: 600 }}><Clipboard size={isMobile ? 16 : 18} color={colors.secondary} style={{ marginRight: 8 }} />Assessment Scores</h3>
                  <span style={{ background: `${colors.secondary}15`, padding: '4px 10px', borderRadius: 8, color: colors.secondary, fontSize: isMobile ? 9 : 11 }}>Cycle {currentCycle}</span>
                </div>
                {client.assessmentScores ? (
                  <div style={{ display: 'grid', gap: 10 }}>
                    {[
                      { label: 'Movement (FMS)', value: client.assessmentScores.movement, max: 21, color: colors.primary },
                      { label: 'Cardio', value: client.assessmentScores.cardio, max: 100, color: colors.secondary, suffix: '%ile' },
                      { label: 'Strength', value: client.assessmentScores.strength, max: 100, color: colors.accent, suffix: '%ile' },
                      { label: 'Flexibility', value: client.assessmentScores.flexibility, max: 100, color: colors.success, suffix: '%ile' },
                      { label: 'Balance', value: client.assessmentScores.balance, max: 100, color: colors.warning, suffix: '%ile' }
                    ].map((a, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ color: colors.textMuted, fontSize: 12 }}>{a.label}</span>
                          <span style={{ color: colors.text, fontSize: 12, fontWeight: 600 }}>{a.value}{a.suffix || `/${a.max}`}</span>
                        </div>
                        <div style={{ background: colors.darker, borderRadius: 4, height: 6 }}>
                          <div style={{ width: `${(a.value / a.max) * 100}%`, height: '100%', background: a.color, borderRadius: 4 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 20 }}>
                    <p style={{ color: colors.textMuted, margin: 0 }}>No assessment data yet</p>
                  </div>
                )}
              </div>

              {/* Injuries Section */}
              <div style={{ background: colors.cardBg, borderRadius: 16, padding: isMobile ? 16 : 24, border: `1px solid ${colors.borderColor}`, marginBottom: isMobile ? 16 : 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? 12 : 20, flexWrap: 'wrap', gap: 8 }}>
                  <h3 style={{ color: colors.text, margin: 0, fontSize: isMobile ? 14 : 16, fontWeight: 600 }}><Shield size={isMobile ? 16 : 18} color={colors.warning} style={{ marginRight: 8 }} />Injury Status</h3>
                  <button onClick={() => { setProfileEditSection('injury'); setEditFormData({ type: '', status: 'managing', notes: '' }); setShowProfileEdit(true); }} style={{ background: `${colors.warning}15`, border: 'none', borderRadius: 8, padding: isMobile ? '5px 10px' : '6px 12px', color: colors.warning, fontSize: isMobile ? 11 : 12, cursor: 'pointer' }}><Plus size={12} style={{ marginRight: 4 }} />Report</button>
                </div>
                {client.injuries && client.injuries.length > 0 ? (
                  <div style={{ display: 'grid', gap: 10 }}>
                    {client.injuries.map((inj, i) => (
                      <div key={i} style={{ background: inj.status === 'recovered' ? `${colors.success}10` : `${colors.warning}10`, borderRadius: 12, padding: 16, border: `1px solid ${inj.status === 'recovered' ? colors.success : colors.warning}30` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 14 }}>{inj.type}</p>
                              <span style={{ background: inj.status === 'recovered' ? colors.success : colors.warning, color: 'white', padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, textTransform: 'uppercase' }}>{inj.status}</span>
                            </div>
                            <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12 }}>{inj.notes}</p>
                            <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 11 }}>Reported: {inj.date}{inj.recoveredDate ? ` • Recovered: ${inj.recoveredDate}` : ''}</p>
                          </div>
                          {inj.status === 'managing' && (
                            <button onClick={() => updateInjuryStatus(i, 'recovered')} style={{ background: colors.success, border: 'none', borderRadius: 8, padding: '8px 14px', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><Check size={12} style={{ marginRight: 4 }} />Mark Healed</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ background: `${colors.success}10`, borderRadius: 10, padding: 20, textAlign: 'center' }}>
                    <Check size={24} color={colors.success} style={{ marginBottom: 8 }} />
                    <p style={{ color: colors.text, margin: 0, fontWeight: 500 }}>No current injuries</p>
                    <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12 }}>Keep up the great work!</p>
                  </div>
                )}
              </div>

              {/* Goals Section */}
              <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.borderColor}`, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ color: colors.text, margin: 0, fontSize: 16, fontWeight: 600 }}><Target size={18} color={colors.primary} style={{ marginRight: 8 }} />Your Goals</h3>
                  <span style={{ background: `${colors.primary}15`, padding: '4px 10px', borderRadius: 8, color: colors.primary, fontSize: 11 }}>Set with your PT</span>
                </div>
                
                {/* Fitness Level Badge */}
                {client.fitnessLevel && (
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ background: colors.darker, padding: '8px 14px', borderRadius: 10, color: colors.text, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{client.fitnessLevel === 'beginner' ? '🌱' : client.fitnessLevel === 'intermediate' ? '💪' : '🔥'}</span>
                      <span style={{ textTransform: 'capitalize' }}>{client.fitnessLevel}</span>
                      {client.isRunner && <span style={{ marginLeft: 8, background: `${colors.secondary}20`, padding: '2px 8px', borderRadius: 6, fontSize: 11, color: colors.secondary }}>🏃 Runner</span>}
                    </span>
                  </div>
                )}

                {((client.goals && client.goals.length > 0) || (client.runnerGoals && client.runnerGoals.length > 0)) ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {(client.goals || []).map((g, i) => (
                      <span key={`g-${i}`} style={{ background: `${colors.primary}15`, color: colors.text, padding: '10px 16px', borderRadius: 20, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><Star size={14} color={colors.primary} />{g}</span>
                    ))}
                    {(client.runnerGoals || []).map((g, i) => (
                      <span key={`r-${i}`} style={{ background: `${colors.secondary}15`, color: colors.text, padding: '10px 16px', borderRadius: 20, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>🏃 {g}</span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: colors.textMuted, margin: 0 }}>No goals set yet — discuss with your PT at your next session!</p>
                )}
              </div>

              {/* Progress Chart */}
              {client.weeklyLogs.length > 0 && (
                <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.borderColor}`, marginBottom: 24 }}>
                  <h3 style={{ color: colors.text, margin: '0 0 20px', fontSize: 16, fontWeight: 600 }}>Weekly Progress</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={client.weeklyLogs.map(l => ({ ...l, name: `W${l.week}` }))}>
                      <defs><linearGradient id="cE" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/><stop offset="95%" stopColor={colors.primary} stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.borderColor} />
                      <XAxis dataKey="name" stroke={colors.textMuted} fontSize={12} />
                      <YAxis stroke={colors.textMuted} fontSize={12} domain={[0, 10]} />
                      <Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8 }} />
                      <Area type="monotone" dataKey="energy" stroke={colors.primary} fill="url(#cE)" strokeWidth={2} />
                      <Line type="monotone" dataKey="mood" stroke={colors.secondary} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* This Week's Focus */}
              <div style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`, borderRadius: 16, padding: 24, border: `1px solid ${colors.primary}30` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}><Target size={24} color={colors.primary} /><h3 style={{ color: colors.text, margin: 0, fontSize: 16, fontWeight: 600 }}>This Week's Focus</h3></div>
                <p style={{ color: colors.text, margin: 0, fontSize: 14 }}>{workout.progressiveOverload.recommendation}</p>
              </div>

          {/* Profile Edit Modal - Injury Only */}
          {showProfileEdit && profileEditSection === 'injury' && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
              <div style={{ background: colors.cardBg, borderRadius: 20, width: '100%', maxWidth: 450, padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ color: colors.text, margin: 0, fontSize: 20, fontWeight: 700 }}>Report Injury Status</h2>
                  <button onClick={() => setShowProfileEdit(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color={colors.textMuted} /></button>
                </div>

                {/* No Injuries Option */}
                <div 
                  onClick={() => setEditFormData({ ...editFormData, noInjuries: !editFormData.noInjuries, type: '' })} 
                  style={{ background: editFormData.noInjuries ? `${colors.success}15` : colors.darker, borderRadius: 12, padding: 16, marginBottom: 20, border: `2px solid ${editFormData.noInjuries ? colors.success : 'transparent'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: editFormData.noInjuries ? colors.success : colors.borderColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {editFormData.noInjuries && <Check size={16} color="white" />}
                  </div>
                  <div>
                    <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 15 }}>✓ No injuries to report</p>
                    <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12 }}>I'm injury-free and ready to train at full capacity</p>
                  </div>
                </div>

                {!editFormData.noInjuries && (
                  <>
                    <div style={{ borderTop: `1px solid ${colors.borderColor}`, paddingTop: 20, marginBottom: 16 }}>
                      <p style={{ color: colors.textMuted, fontSize: 12, marginBottom: 16 }}>Or report a new injury:</p>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Injury Type</label>
                        <input value={editFormData.type || ''} onChange={e => setEditFormData({ ...editFormData, type: e.target.value })} placeholder="e.g. Lower back pain, Knee strain" style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Status</label>
                        <select value={editFormData.status} onChange={e => setEditFormData({ ...editFormData, status: e.target.value })} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }}>
                          <option value="managing">Currently Managing</option>
                          <option value="recovered">Recovered</option>
                        </select>
                      </div>
                      <div style={{ marginBottom: 24 }}>
                        <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Notes for PT</label>
                        <textarea value={editFormData.notes || ''} onChange={e => setEditFormData({ ...editFormData, notes: e.target.value })} placeholder="Any details about the injury, limitations, etc." style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14, height: 80, resize: 'none' }} />
                      </div>
                    </div>
                  </>
                )}

                <button 
                  onClick={() => { 
                    if (editFormData.noInjuries) {
                      // Clear all injuries
                      updateClientProfile('injuries', []);
                      setShowProfileEdit(false);
                    } else if (editFormData.type) { 
                      addNewInjury(editFormData); 
                      setShowProfileEdit(false); 
                    } 
                  }} 
                  disabled={!editFormData.noInjuries && !editFormData.type}
                  style={{ width: '100%', padding: 14, background: (editFormData.noInjuries || editFormData.type) ? `linear-gradient(135deg, ${editFormData.noInjuries ? colors.success : colors.warning}, ${editFormData.noInjuries ? colors.primary : colors.accent})` : colors.borderColor, border: 'none', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 600, cursor: (editFormData.noInjuries || editFormData.type) ? 'pointer' : 'not-allowed' }}
                >
                  {editFormData.noInjuries ? <><Check size={18} style={{ marginRight: 8 }} />Confirm No Injuries</> : <><Plus size={18} style={{ marginRight: 8 }} />Report Injury</>}
                </button>
              </div>
            </div>
          )}

          {/* Profile Edit Modal - Name, Photo, Contact */}
          {showProfileEdit && profileEditSection === 'profile' && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
              <div style={{ background: colors.cardBg, borderRadius: 20, width: '100%', maxWidth: 450, maxHeight: '90vh', overflow: 'auto', padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ color: colors.text, margin: 0, fontSize: 20, fontWeight: 700 }}>Edit Profile</h2>
                  <button onClick={() => setShowProfileEdit(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color={colors.textMuted} /></button>
                </div>

                {/* Photo Placeholder */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <div style={{ width: 100, height: 100, borderRadius: 24, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 36, fontWeight: 700, margin: '0 auto 12px' }}>
                    {(editFormData.name || client.name).split(' ').map(n => n[0]).join('')}
                  </div>
                  <p style={{ color: colors.textMuted, margin: 0, fontSize: 12 }}>Photo upload coming soon</p>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Full Name</label>
                  <input value={editFormData.name || ''} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} placeholder="Your full name" style={{ width: '100%', padding: 14, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 16 }} />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Email Address</label>
                  <input type="email" value={editFormData.email || ''} onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} placeholder="your@email.com" style={{ width: '100%', padding: 14, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 16 }} />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Phone Number</label>
                  <input type="tel" value={editFormData.phone || ''} onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })} placeholder="+256 700 000 000" style={{ width: '100%', padding: 14, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 16 }} />
                </div>

                <button 
                  onClick={() => { 
                    if (editFormData.name) updateClientProfile('name', editFormData.name);
                    if (editFormData.email) updateClientProfile('email', editFormData.email);
                    updateClientProfile('phone', editFormData.phone || '');
                    setShowProfileEdit(false);
                  }}
                  disabled={!editFormData.name || !editFormData.email}
                  style={{ width: '100%', padding: 14, background: editFormData.name && editFormData.email ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.borderColor, border: 'none', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 600, cursor: editFormData.name && editFormData.email ? 'pointer' : 'not-allowed' }}
                >
                  <Save size={18} style={{ marginRight: 8 }} />Save Profile
                </button>
              </div>
            </div>
          )}
            </>
          )}

          {activeTab === 'workout' && (
            <WorkoutTab client={client} workout={workout} colors={colors} setSelectedExercise={setSelectedExercise} setClients={setClients} clients={clients} setLoggedInUser={setLoggedInUser} workoutViewMode={workoutViewMode} setWorkoutViewMode={setWorkoutViewMode} />
          )}

          {activeTab === 'progress' && (
            <>
              {client.weeklyLogs.length === 0 ? (
                /* Empty state for new clients */
                <div style={{ background: colors.cardBg, borderRadius: 16, padding: 40, border: `1px solid ${colors.borderColor}`, textAlign: 'center' }}>
                  <Activity size={48} color={colors.textMuted} style={{ marginBottom: 16 }} />
                  <h3 style={{ color: colors.text, margin: '0 0 8px', fontSize: 18 }}>No Progress Data Yet</h3>
                  <p style={{ color: colors.textMuted, margin: '0 0 24px', fontSize: 14 }}>Start logging your weeks to track your fitness journey!</p>
                  <button onClick={() => setShowLog(true)} style={{ padding: '12px 24px', background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, border: 'none', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}><Plus size={16} style={{ marginRight: 6 }} />Log Your First Week</button>
                  
                  {/* Starting metrics */}
                  <div style={{ marginTop: 32, textAlign: 'left' }}>
                    <h4 style={{ color: colors.text, margin: '0 0 16px', fontSize: 14 }}>Your Starting Point</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                      {[
                        { label: 'Weight', value: client.weight ? `${client.weight}kg` : '—', target: client.targetWeight ? `Target: ${client.targetWeight}kg` : '' },
                        { label: 'Fitness Level', value: client.fitnessLevel || '—', target: '' },
                        { label: 'Week', value: client.currentWeek || 1, target: 'Just starting!' }
                      ].map((m, i) => (
                        <div key={i} style={{ background: colors.darker, borderRadius: 10, padding: 14, textAlign: 'center' }}>
                          <p style={{ color: colors.textMuted, margin: 0, fontSize: 11 }}>{m.label}</p>
                          <p style={{ color: colors.text, margin: '4px 0 0', fontSize: 18, fontWeight: 700, textTransform: 'capitalize' }}>{m.value}</p>
                          {m.target && <p style={{ color: colors.secondary, margin: '4px 0 0', fontSize: 11 }}>{m.target}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Goals display */}
                  {((client.goals && client.goals.length > 0) || (client.runnerGoals && client.runnerGoals.length > 0)) && (
                    <div style={{ marginTop: 24, textAlign: 'left' }}>
                      <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 14 }}>Your Goals</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {(client.goals || []).map((g, i) => (
                          <span key={`g-${i}`} style={{ background: `${colors.primary}15`, color: colors.text, padding: '8px 14px', borderRadius: 20, fontSize: 13 }}><Target size={12} style={{ marginRight: 6 }} />{g}</span>
                        ))}
                        {(client.runnerGoals || []).map((g, i) => (
                          <span key={`r-${i}`} style={{ background: `${colors.secondary}15`, color: colors.text, padding: '8px 14px', borderRadius: 20, fontSize: 13 }}>🏃 {g}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Year in Fitness Summary - show if at least 12 weeks */}
                  {client.currentWeek >= 12 && (
                    <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, borderRadius: 20, padding: 28, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                      <div style={{ position: 'absolute', bottom: -50, left: -50, width: 120, height: 120, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <Trophy size={32} color="white" />
                        <div>
                          <h2 style={{ color: 'white', margin: 0, fontSize: 22, fontWeight: 700 }}>🎉 Your Fitness Journey</h2>
                          <p style={{ color: 'rgba(255,255,255,0.8)', margin: '4px 0 0', fontSize: 14 }}>Cycle {Math.ceil(client.currentWeek / 12)} • {client.currentWeek} weeks of progress</p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
                        {[
                          { label: 'Total Workouts', value: client.weeklyLogs.reduce((a, l) => a + l.workoutsCompleted, 0), icon: '🏋️' },
                          { label: 'Est. Calories Burned', value: `${(client.weeklyLogs.reduce((a, l) => a + l.workoutsCompleted, 0) * 350).toLocaleString()}`, icon: '🔥' },
                          { label: 'Active Weeks', value: client.weeklyLogs.filter(l => l.workoutsCompleted >= 2).length, icon: '✅' },
                          { label: 'Avg Energy', value: (client.weeklyLogs.reduce((a, l) => a + l.energy, 0) / client.weeklyLogs.length).toFixed(1), icon: '⚡' }
                        ].map((stat, i) => (
                          <div key={i} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                            <span style={{ fontSize: 24 }}>{stat.icon}</span>
                            <p style={{ color: 'white', margin: '8px 0 0', fontSize: 24, fontWeight: 700 }}>{stat.value}</p>
                            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '4px 0 0', fontSize: 11 }}>{stat.label}</p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Strength Gains */}
                      {client.strengthProgress && (
                        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16 }}>
                          <h4 style={{ color: 'white', margin: '0 0 12px', fontSize: 14 }}>💪 Strength Gains</h4>
                          <div style={{ display: 'flex', gap: 20 }}>
                            {[
                              { lift: 'Squat', data: client.strengthProgress.squat },
                              { lift: 'Deadlift', data: client.strengthProgress.deadlift },
                              { lift: 'Bench', data: client.strengthProgress.bench }
                            ].map((lift, i) => {
                              const start = lift.data[0]?.weight || 0;
                              const current = lift.data[lift.data.length - 1]?.weight || 0;
                              const gain = current - start;
                              return (
                                <div key={i} style={{ flex: 1 }}>
                                  <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: 11 }}>{lift.lift}</p>
                                  <p style={{ color: 'white', margin: '4px 0 0', fontSize: 16, fontWeight: 600 }}>
                                    {start}kg → {current}kg 
                                    <span style={{ color: gain > 0 ? '#2ECC71' : 'rgba(255,255,255,0.5)', marginLeft: 6, fontSize: 12 }}>
                                      {gain > 0 ? `+${gain}kg` : '—'}
                                    </span>
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Highlights */}
                      <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {client.weeklyLogs.filter(l => l.workoutsCompleted >= 4).length > 0 && (
                          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 20, color: 'white', fontSize: 12 }}>
                            ⭐ {client.weeklyLogs.filter(l => l.workoutsCompleted >= 4).length} weeks with 4+ workouts
                          </span>
                        )}
                        {client.weeklyLogs.filter(l => l.energy >= 8).length > 0 && (
                          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 20, color: 'white', fontSize: 12 }}>
                            ⚡ {client.weeklyLogs.filter(l => l.energy >= 8).length} high energy weeks
                          </span>
                        )}
                        {!client.injuries?.some(i => i.status === 'managing') && (
                          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 20, color: 'white', fontSize: 12 }}>
                            💚 Injury-free
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.borderColor}`, marginBottom: 24 }}>
                    <h3 style={{ color: colors.text, margin: '0 0 20px', fontSize: 16, fontWeight: 600 }}>Strength Progress 📈</h3>
                    {client.strengthProgress.squat.length > 0 || client.strengthProgress.deadlift.length > 0 || client.strengthProgress.bench.length > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart>
                          <CartesianGrid strokeDasharray="3 3" stroke={colors.borderColor} />
                          <XAxis dataKey="week" stroke={colors.textMuted} fontSize={12} type="number" domain={[1, client.currentWeek]} />
                          <YAxis stroke={colors.textMuted} fontSize={12} />
                          <Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8 }} />
                          <Line data={client.strengthProgress.squat} type="monotone" dataKey="weight" stroke={colors.primary} strokeWidth={2} dot={{ fill: colors.primary }} name="Squat" />
                          <Line data={client.strengthProgress.deadlift} type="monotone" dataKey="weight" stroke={colors.secondary} strokeWidth={2} dot={{ fill: colors.secondary }} name="Deadlift" />
                          <Line data={client.strengthProgress.bench} type="monotone" dataKey="weight" stroke={colors.accent} strokeWidth={2} dot={{ fill: colors.accent }} name="Bench" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ textAlign: 'center', padding: 20, background: colors.darker, borderRadius: 10 }}>
                        <p style={{ color: colors.textMuted, margin: 0 }}>No strength data yet. Log weights in your workouts to track progress.</p>
                      </div>
                    )}
                  </div>
                  <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.borderColor}` }}>
                    <h3 style={{ color: colors.text, margin: '0 0 20px', fontSize: 16, fontWeight: 600 }}>Weekly Logs</h3>
                    {[...client.weeklyLogs].reverse().slice(0, 5).map((l, i) => (
                      <div key={i} style={{ background: colors.darker, borderRadius: 12, padding: 14, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${colors.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.text, fontWeight: 700 }}>W{l.week}</div>
                          <div><p style={{ color: colors.text, margin: 0, fontWeight: 500, fontSize: 14 }}>{l.notes || 'No notes'}</p><p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 12 }}>{l.workoutsCompleted} workouts</p></div>
                        </div>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <div style={{ textAlign: 'center' }}><p style={{ color: colors.textMuted, margin: 0, fontSize: 10 }}>Energy</p><p style={{ color: colors.primary, margin: 0, fontSize: 18, fontWeight: 700 }}>{l.energy}</p></div>
                          <div style={{ textAlign: 'center' }}><p style={{ color: colors.textMuted, margin: 0, fontSize: 10 }}>Mood</p><p style={{ color: colors.secondary, margin: 0, fontSize: 18, fontWeight: 700 }}>{l.mood}</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === 'challenges' && (
            <ChallengesTab client={client} group={group} groups={groups} colors={colors} membershipRequests={membershipRequests} setMembershipRequests={setMembershipRequests} />
          )}

          {activeTab === 'nutrition' && (
            <NutritionTab client={client} colors={colors} />
          )}
        </div>

        {showLog && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
            <div style={{ background: colors.cardBg, borderRadius: 20, width: '100%', maxWidth: 500, maxHeight: '90vh', overflow: 'auto', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ color: colors.text, margin: 0, fontSize: 20, fontWeight: 700 }}>Week {client.currentWeek + 1} Check-in</h2>
                <button onClick={() => setShowLog(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color={colors.textMuted} /></button>
              </div>
              
              {/* Motivational Message */}
              <div style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`, borderRadius: 12, padding: 14, marginBottom: 20, border: `1px solid ${colors.primary}20` }}>
                <p style={{ color: colors.text, margin: 0, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>
                    {client.weeklyLogs.length === 0 ? '🌟' : 
                     client.weeklyLogs.length < 4 ? '💪' : 
                     client.weeklyLogs.length < 8 ? '🔥' : '🏆'}
                  </span>
                  <span>
                    {client.weeklyLogs.length === 0 ? 'Your first check-in! Every journey begins with a single step.' : 
                     client.weeklyLogs.length < 4 ? `${client.weeklyLogs.length} weeks logged! You're building great habits.` : 
                     client.weeklyLogs.length < 8 ? 'You\'re on a roll! Consistency is your superpower.' : 
                     `${client.weeklyLogs.length} weeks strong! You're an inspiration.`}
                  </span>
                </p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ color: colors.textMuted, fontSize: 13, display: 'block', marginBottom: 12 }}>
                  Energy Level: <span style={{ color: colors.text, fontWeight: 600 }}>{logData.energy}/10</span>
                  <span style={{ marginLeft: 8, fontSize: 16 }}>{logData.energy >= 8 ? '⚡' : logData.energy >= 5 ? '😊' : '😴'}</span>
                </label>
                <input type="range" min="1" max="10" value={logData.energy} onChange={e => setLogData({...logData, energy: parseInt(e.target.value)})} style={{ width: '100%', accentColor: colors.primary }} />
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <label style={{ color: colors.textMuted, fontSize: 13, display: 'block', marginBottom: 12 }}>
                  Mood: <span style={{ color: colors.text, fontWeight: 600 }}>{logData.mood}/10</span>
                  <span style={{ marginLeft: 8, fontSize: 16 }}>{logData.mood >= 8 ? '😄' : logData.mood >= 5 ? '🙂' : '😔'}</span>
                </label>
                <input type="range" min="1" max="10" value={logData.mood} onChange={e => setLogData({...logData, mood: parseInt(e.target.value)})} style={{ width: '100%', accentColor: colors.secondary }} />
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <label style={{ color: colors.textMuted, fontSize: 13, display: 'block', marginBottom: 12 }}>
                  Workouts Completed: <span style={{ color: colors.text, fontWeight: 600 }}>{logData.workoutsCompleted}</span>
                  {logData.workoutsCompleted >= 4 && <span style={{ marginLeft: 8, color: colors.success, fontSize: 12 }}>🎯 Great week!</span>}
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[0,1,2,3,4,5,6,7].map(n => (
                    <button key={n} onClick={() => setLogData({...logData, workoutsCompleted: n})} style={{ width: 40, height: 40, borderRadius: 8, background: logData.workoutsCompleted === n ? colors.primary : colors.darker, border: 'none', color: logData.workoutsCompleted === n ? 'white' : colors.text, cursor: 'pointer', fontWeight: 600 }}>{n}</button>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <label style={{ color: colors.textMuted, fontSize: 13, display: 'block', marginBottom: 8 }}>Notes & Highlights</label>
                <textarea value={logData.notes} onChange={e => setLogData({...logData, notes: e.target.value})} placeholder="What went well? Any challenges? Wins to celebrate?" style={{ width: '100%', height: 80, padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14, resize: 'none' }} />
              </div>
              
              <button onClick={saveLog} style={{ width: '100%', padding: 14, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, border: 'none', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                <Save size={18} style={{ marginRight: 8 }} />Complete Check-in
              </button>
            </div>
          </div>
        )}
        {selectedExercise && <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />}
      </div>
    );
  };

  // ============ PT SIDEBAR (Desktop) & MOBILE NAV ============
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'clients', icon: Users, label: 'Clients' },
    { id: 'groups', icon: Flag, label: 'Groups' },
    { id: 'reports', icon: BarChart2, label: 'Reports' },
    { id: 'assessments', icon: Clipboard, label: 'Assessments' }
  ];

  const PTSidebar = () => (
    <div style={{ width: 260, background: `linear-gradient(180deg, ${colors.darker}, ${colors.dark})`, borderRight: `1px solid ${colors.borderColor}`, position: 'fixed', height: '100vh', display: isMobile ? 'none' : 'flex', flexDirection: 'column', zIndex: 100 }}>
      <div style={{ padding: 24, borderBottom: `1px solid ${colors.borderColor}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Dumbbell size={24} color="white" /></div>
          <div><h1 style={{ fontSize: 18, fontWeight: 800, color: colors.text, margin: 0, fontFamily: 'Outfit' }}>FitForge</h1><p style={{ fontSize: 11, color: colors.textMuted, margin: 0, letterSpacing: 1 }}>PT DASHBOARD</p></div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: 16 }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => { setCurrentView(item.id); setSelectedClient(null); }} style={{ width: '100%', padding: '14px 16px', marginBottom: 6, background: currentView === item.id ? `${colors.primary}20` : 'transparent', border: 'none', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderLeft: currentView === item.id ? `3px solid ${colors.primary}` : '3px solid transparent' }}>
            <item.icon size={20} color={currentView === item.id ? colors.primary : colors.textMuted} />
            <span style={{ color: currentView === item.id ? colors.text : colors.textMuted, fontWeight: currentView === item.id ? 600 : 400, fontSize: 14 }}>{item.label}</span>
          </button>
        ))}
      </nav>
      <div style={{ padding: 16, borderTop: `1px solid ${colors.borderColor}` }}>
        <div style={{ background: `${colors.primary}15`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Trophy size={18} color={colors.accent} /><span style={{ color: colors.text, fontWeight: 600, fontSize: 13 }}>Active Challenges</span></div>
          <p style={{ color: colors.textMuted, fontSize: 12, margin: 0 }}>2 running • {clients.length} participants</p>
        </div>
        <button onClick={() => {
          if (window.confirm('Reset all test data? This will restore default clients, groups, and challenges.')) {
            localStorage.removeItem('fitforge-clients');
            localStorage.removeItem('fitforge-groups');
            localStorage.removeItem('fitforge-requests');
            window.location.reload();
          }
        }} style={{ width: '100%', padding: 12, marginBottom: 8, background: 'transparent', border: `1px solid ${colors.warning}50`, borderRadius: 10, color: colors.warning, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>🔄 Reset Test Data</button>
        <button onClick={() => { setUserType(null); setLoggedInUser(null); setCurrentView('login'); }} style={{ width: '100%', padding: 12, background: 'transparent', border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.textMuted, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}><LogOut size={18} /> Sign Out</button>
      </div>
    </div>
  );

  // Mobile Header
  const PTMobileHeader = () => (
    <div style={{ display: isMobile ? 'flex' : 'none', position: 'fixed', top: 0, left: 0, right: 0, height: 60, background: colors.darker, borderBottom: `1px solid ${colors.borderColor}`, alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Dumbbell size={20} color="white" /></div>
        <span style={{ color: colors.text, fontWeight: 700, fontSize: 16 }}>FitForge</span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setShowMobileMenu(!showMobileMenu)} style={{ width: 40, height: 40, background: colors.cardBg, border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {showMobileMenu ? <X size={20} color={colors.text} /> : <Monitor size={20} color={colors.text} />}
        </button>
      </div>
    </div>
  );

  // Mobile Bottom Navigation
  const PTMobileNav = () => (
    <div style={{ display: isMobile ? 'flex' : 'none', position: 'fixed', bottom: 0, left: 0, right: 0, height: 70, background: colors.darker, borderTop: `1px solid ${colors.borderColor}`, justifyContent: 'space-around', alignItems: 'center', zIndex: 100, paddingBottom: 10 }}>
      {navItems.slice(0, 5).map(item => (
        <button key={item.id} onClick={() => { setCurrentView(item.id); setSelectedClient(null); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px' }}>
          <item.icon size={22} color={currentView === item.id ? colors.primary : colors.textMuted} />
          <span style={{ fontSize: 10, color: currentView === item.id ? colors.primary : colors.textMuted, fontWeight: currentView === item.id ? 600 : 400 }}>{item.label}</span>
        </button>
      ))}
    </div>
  );

  // Mobile Menu Dropdown
  const PTMobileMenu = () => (
    <div style={{ display: showMobileMenu && isMobile ? 'block' : 'none', position: 'fixed', top: 60, left: 0, right: 0, background: colors.darker, borderBottom: `1px solid ${colors.borderColor}`, padding: 16, zIndex: 99 }}>
      <div style={{ background: `${colors.primary}15`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}><Trophy size={16} color={colors.accent} /><span style={{ color: colors.text, fontWeight: 600, fontSize: 13 }}>Active Challenges</span></div>
        <p style={{ color: colors.textMuted, fontSize: 12, margin: 0 }}>2 running • {clients.length} participants</p>
      </div>
      <button onClick={() => {
        if (window.confirm('Reset all test data?')) {
          localStorage.removeItem('fitforge-clients');
          localStorage.removeItem('fitforge-groups');
          localStorage.removeItem('fitforge-requests');
          window.location.reload();
        }
      }} style={{ width: '100%', padding: 12, marginBottom: 8, background: 'transparent', border: `1px solid ${colors.warning}50`, borderRadius: 10, color: colors.warning, fontSize: 12, cursor: 'pointer' }}>🔄 Reset Test Data</button>
      <button onClick={() => { setUserType(null); setLoggedInUser(null); setCurrentView('login'); setShowMobileMenu(false); }} style={{ width: '100%', padding: 12, background: 'transparent', border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.textMuted, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><LogOut size={18} /> Sign Out</button>
    </div>
  );

  // ============ PT DASHBOARD ============
  const PTDashboardView = () => {
    const totalWorkouts = clients.reduce((a, c) => a + c.weeklyLogs.reduce((b, l) => b + l.workoutsCompleted, 0), 0);
    const avgCompliance = Math.round(clients.reduce((a, c) => a + (c.weeklyLogs.reduce((b, l) => b + l.workoutsCompleted, 0) / (c.weeklyLogs.length * 4)) * 100, 0) / clients.length);
    const weeklyData = [{ week: 'W1', workouts: 10 }, { week: 'W2', workouts: 14 }, { week: 'W3', workouts: 17 }, { week: 'W4', workouts: 16 }, { week: 'W5', workouts: 14 }, { week: 'W6', workouts: 19 }];

    // Find clients due for reassessment (every 12 weeks)
    const cycleLength = 12;
    const clientsDueForReassessment = clients.filter(c => {
      if (c.status !== 'active') return false;
      const weeksIntoCycle = c.currentWeek % cycleLength;
      return weeksIntoCycle === 0 && c.currentWeek >= cycleLength;
    });
    
    const clientsRequestedReassessment = clients.filter(c => c.reassessmentRequested);
    const clientsApproachingReassessment = clients.filter(c => {
      if (c.status !== 'active') return false;
      const weeksIntoCycle = c.currentWeek % cycleLength || cycleLength;
      const weeksUntil = cycleLength - weeksIntoCycle;
      return weeksUntil <= 2 && weeksUntil > 0;
    });

    const markReassessmentComplete = (clientId) => {
      const updated = clients.map(c => c.id === clientId ? { 
        ...c, 
        reassessmentRequested: false, 
        lastReassessment: new Date().toISOString().split('T')[0],
        reassessmentHistory: [...(c.reassessmentHistory || []), { date: new Date().toISOString().split('T')[0], week: c.currentWeek }]
      } : c);
      setClients(updated);
    };

    const handlePTProfileSave = () => {
      setLoggedInUser({ ...loggedInUser, ...ptProfileForm });
      setShowPTProfileEdit(false);
    };

    return (
      <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
        <div style={{ marginBottom: isMobile ? 20 : 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: colors.text, margin: 0, fontFamily: 'Outfit' }}>Welcome{isMobile ? '' : `, ${loggedInUser?.name}`}! 👋</h1>
            <p style={{ color: colors.textMuted, marginTop: 8, fontSize: isMobile ? 13 : 14 }}>Here's your fitness community overview</p>
          </div>
          <button onClick={() => { setPtProfileForm({ name: loggedInUser?.name || '', email: loggedInUser?.email || '', phone: loggedInUser?.phone || '' }); setShowPTProfileEdit(true); }} style={{ padding: '10px 16px', background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={16} /> Edit Profile
          </button>
        </div>

        {/* PT Profile Edit Modal */}
        {showPTProfileEdit && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            <div style={{ background: colors.cardBg, borderRadius: 20, padding: 24, width: '100%', maxWidth: 450, maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ color: colors.text, margin: 0, fontSize: 18, fontWeight: 700 }}>Edit Your Profile</h3>
                <button onClick={() => setShowPTProfileEdit(false)} style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer' }}><X size={20} /></button>
              </div>
              
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Full Name</label>
                  <input type="text" value={ptProfileForm.name} onChange={e => setPtProfileForm({ ...ptProfileForm, name: e.target.value })} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Email Address</label>
                  <input type="email" value={ptProfileForm.email} onChange={e => setPtProfileForm({ ...ptProfileForm, email: e.target.value })} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Phone Number</label>
                  <input type="tel" value={ptProfileForm.phone} onChange={e => setPtProfileForm({ ...ptProfileForm, phone: e.target.value })} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14, boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button onClick={() => setShowPTProfileEdit(false)} style={{ flex: 1, padding: 12, background: 'transparent', border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
                <button onClick={handlePTProfileSave} style={{ flex: 1, padding: 12, background: colors.primary, border: 'none', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {/* Reassessment Alerts */}
        {(clientsRequestedReassessment.length > 0 || clientsDueForReassessment.length > 0) && (
          <div style={{ background: `linear-gradient(135deg, ${colors.warning}15, ${colors.accent}15)`, borderRadius: 16, padding: 20, marginBottom: 24, border: `1px solid ${colors.warning}30` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: colors.warning, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clipboard size={20} color="white" />
              </div>
              <div>
                <h3 style={{ color: colors.text, margin: 0, fontSize: 16, fontWeight: 700 }}>Reassessments Due</h3>
                <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 13 }}>{clientsRequestedReassessment.length + clientsDueForReassessment.length} client{clientsRequestedReassessment.length + clientsDueForReassessment.length > 1 ? 's' : ''} at 12-week cycle end</p>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {clientsRequestedReassessment.map(c => (
                <div key={c.id} style={{ background: colors.cardBg, borderRadius: 12, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: 13 }}>{c.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 14 }}>{c.name}</p>
                      <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 12 }}>Week {c.currentWeek} • Requested {c.reassessmentRequestDate}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setSelectedClient(c); setCurrentView('assessments'); }} style={{ padding: '8px 14px', background: colors.primary, border: 'none', borderRadius: 8, color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Start Assessment</button>
                    <button onClick={() => markReassessmentComplete(c.id)} style={{ padding: '8px 14px', background: colors.success, border: 'none', borderRadius: 8, color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><Check size={14} /></button>
                  </div>
                </div>
              ))}
              {clientsDueForReassessment.filter(c => !c.reassessmentRequested).map(c => (
                <div key={c.id} style={{ background: colors.cardBg, borderRadius: 12, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: 13 }}>{c.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 14 }}>{c.name}</p>
                      <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 12 }}>Week {c.currentWeek} • Cycle complete</p>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedClient(c); setCurrentView('assessments'); }} style={{ padding: '8px 14px', background: `${colors.warning}20`, border: `1px solid ${colors.warning}`, borderRadius: 8, color: colors.warning, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Schedule</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approaching Reassessment Notice */}
        {clientsApproachingReassessment.length > 0 && (
          <div style={{ background: `${colors.secondary}10`, borderRadius: 12, padding: 16, marginBottom: 24, border: `1px solid ${colors.secondary}30` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock size={18} color={colors.secondary} />
              <p style={{ color: colors.text, margin: 0, fontSize: 14 }}>
                <strong>{clientsApproachingReassessment.length} client{clientsApproachingReassessment.length > 1 ? 's' : ''}</strong> approaching 12-week reassessment: {clientsApproachingReassessment.map(c => c.name.split(' ')[0]).join(', ')}
              </p>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 12 : 20, marginBottom: 32 }}>
          {[{ label: 'Clients', value: clients.length, icon: Users, color: colors.primary, sub: '+3 this month' }, { label: 'Workouts', value: totalWorkouts, icon: Dumbbell, color: colors.secondary, sub: '+12 this week' }, { label: 'Compliance', value: `${avgCompliance}%`, icon: Target, color: colors.success, sub: '+5% vs last month' }, { label: 'Groups', value: groups.length, icon: Flag, color: colors.accent, sub: '2 challenges' }].map((s, i) => (
            <div key={i} style={{ background: colors.cardBg, borderRadius: 16, padding: isMobile ? 16 : 24, border: `1px solid ${colors.borderColor}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: `${s.color}10`, borderRadius: '50%' }} />
              <div style={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, background: `${s.color}20`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: isMobile ? 12 : 16 }}><s.icon size={isMobile ? 20 : 24} color={s.color} /></div>
              <p style={{ color: colors.textMuted, fontSize: isMobile ? 11 : 13, margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</p>
              <p style={{ color: colors.text, fontSize: isMobile ? 24 : 32, fontWeight: 800, margin: '8px 0 4px', fontFamily: 'Outfit' }}>{s.value}</p>
              <p style={{ color: s.color, fontSize: isMobile ? 10 : 12, margin: 0, fontWeight: 500 }}>{s.sub}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: isMobile ? 16 : 20, marginBottom: isMobile ? 24 : 32 }}>
          <div style={{ background: colors.cardBg, borderRadius: 16, padding: isMobile ? 16 : 24, border: `1px solid ${colors.borderColor}` }}>
            <h3 style={{ color: colors.text, margin: '0 0 20px', fontSize: isMobile ? 14 : 16, fontWeight: 600 }}>Weekly Trends</h3>
            <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
              <AreaChart data={weeklyData}><defs><linearGradient id="cW" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/><stop offset="95%" stopColor={colors.primary} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={colors.borderColor} /><XAxis dataKey="week" stroke={colors.textMuted} fontSize={isMobile ? 10 : 12} /><YAxis stroke={colors.textMuted} fontSize={isMobile ? 10 : 12} /><Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8 }} /><Area type="monotone" dataKey="workouts" stroke={colors.primary} fill="url(#cW)" strokeWidth={2} /></AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: colors.cardBg, borderRadius: 16, padding: isMobile ? 16 : 24, border: `1px solid ${colors.borderColor}` }}>
            <h3 style={{ color: colors.text, margin: '0 0 20px', fontSize: isMobile ? 14 : 16, fontWeight: 600 }}>Groups</h3>
            <ResponsiveContainer width="100%" height={isMobile ? 150 : 220}>
              <PieChart><Pie data={groups.map(g => ({ name: g.name, value: g.members || 1 }))} innerRadius={isMobile ? 35 : 50} outerRadius={isMobile ? 60 : 80} paddingAngle={5} dataKey="value">{groups.map((_, i) => <Cell key={i} fill={[colors.primary, colors.secondary, colors.accent][i % 3]} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 12 : 16, flexWrap: 'wrap' }}>{groups.map((g, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: [colors.primary, colors.secondary, colors.accent][i % 3] }} /><span style={{ color: colors.textMuted, fontSize: isMobile ? 10 : 12 }}>{g.name}</span></div>)}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 20 }}>
          <div style={{ background: colors.cardBg, borderRadius: 16, padding: isMobile ? 16 : 24, border: `1px solid ${colors.borderColor}` }}>
            <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: isMobile ? 14 : 16, fontWeight: 600 }}>Recent Activity</h3>
            {clients.slice(0, 3).map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 2 ? `1px solid ${colors.borderColor}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: 14 }}>{c.name.split(' ').map(n => n[0]).join('')}</div>
                  <div><p style={{ color: colors.text, margin: 0, fontWeight: 500, fontSize: 14 }}>{c.name}</p><p style={{ color: colors.textMuted, margin: 0, fontSize: 12 }}>{c.weeklyLogs[c.weeklyLogs.length - 1]?.notes}</p></div>
                </div>
                <div style={{ background: `${colors.success}20`, color: colors.success, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>Week {c.weeklyLogs.length}</div>
              </div>
            ))}
          </div>
          <div style={{ background: colors.cardBg, borderRadius: 16, padding: isMobile ? 16 : 24, border: `1px solid ${colors.borderColor}` }}>
            <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: isMobile ? 14 : 16, fontWeight: 600 }}>Quick Actions</h3>
            {[{ icon: Plus, label: 'Add Client', action: () => setShowNewClientForm(true), color: colors.primary }, { icon: FileText, label: 'Generate Report', action: () => setCurrentView('reports'), color: colors.secondary }, { icon: Clipboard, label: 'Assessments', action: () => setCurrentView('assessments'), color: colors.accent }].map((a, i) => (
              <button key={i} onClick={a.action} style={{ width: '100%', padding: isMobile ? 12 : 16, marginBottom: isMobile ? 8 : 10, background: `${a.color}10`, border: `1px solid ${a.color}30`, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <a.icon size={isMobile ? 18 : 20} color={a.color} /><span style={{ color: colors.text, fontWeight: 500, fontSize: isMobile ? 13 : 14 }}>{a.label}</span><ChevronRight size={isMobile ? 16 : 18} color={colors.textMuted} style={{ marginLeft: 'auto' }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ============ PT CLIENTS VIEW ============
  const PTClientsView = () => {
    const deleteClient = (clientId, e) => {
      e.stopPropagation(); // Prevent opening client detail
      if (window.confirm('Are you sure you want to delete this client? This cannot be undone.')) {
        setClients(clients.filter(c => c.id !== clientId));
      }
    };

    return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? 20 : 32, flexWrap: 'wrap', gap: 12 }}>
        <div><h1 style={{ color: colors.text, margin: 0, fontSize: isMobile ? 20 : 26, fontWeight: 800, fontFamily: 'Outfit' }}>Clients</h1><p style={{ color: colors.textMuted, marginTop: 4, fontSize: isMobile ? 12 : 14 }}>{clients.length} enrolled ({clients.filter(c => c.status === 'onboarding').length} onboarding)</p></div>
        <button onClick={() => setShowNewClientForm(true)} style={{ padding: isMobile ? '10px 16px' : '12px 24px', background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, border: 'none', borderRadius: 12, color: 'white', fontSize: isMobile ? 13 : 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Plus size={isMobile ? 16 : 18} style={{ marginRight: 6 }} />{isMobile ? 'Add' : 'Add Client'}</button>
      </div>
      {clients.map(c => (
        <div key={c.id} onClick={() => { setSelectedClient(c); setCurrentView('client-detail'); }} style={{ background: colors.cardBg, borderRadius: 16, padding: isMobile ? 14 : 20, border: `1px solid ${c.status === 'onboarding' ? colors.warning : colors.borderColor}`, marginBottom: isMobile ? 12 : 16, cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16, flex: 1, minWidth: 0 }}>
              <div style={{ width: isMobile ? 44 : 56, height: isMobile ? 44 : 56, borderRadius: isMobile ? 10 : 14, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: isMobile ? 14 : 18, position: 'relative', flexShrink: 0 }}>
                {c.name.split(' ').map(n => n[0]).join('')}
                {c.status === 'onboarding' && <div style={{ position: 'absolute', bottom: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: colors.warning, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${colors.cardBg}` }}><AlertTriangle size={8} color="white" /></div>}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h3 style={{ color: colors.text, margin: 0, fontSize: isMobile ? 14 : 16, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</h3>
                  {c.status === 'onboarding' && <span style={{ background: `${colors.warning}20`, color: colors.warning, padding: '2px 6px', borderRadius: 8, fontSize: 9, fontWeight: 600 }}>ONBOARDING</span>}
                </div>
                {!isMobile && <p style={{ color: colors.textMuted, margin: '4px 0', fontSize: 13 }}>{c.email}</p>}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: isMobile ? 4 : 0 }}>
                  <span style={{ background: `${colors.primary}15`, color: colors.primary, padding: '2px 8px', borderRadius: 10, fontSize: isMobile ? 10 : 11, fontWeight: 500 }}>{c.gender === 'female' ? '♀' : '♂'} {c.age || '—'}y</span>
                  <span style={{ background: `${colors.secondary}15`, color: colors.secondary, padding: '2px 8px', borderRadius: 10, fontSize: isMobile ? 10 : 11, fontWeight: 500, textTransform: 'capitalize' }}>{c.fitnessLevel}</span>
                  {c.group && !isMobile && <span style={{ background: `${colors.accent}15`, color: colors.accent, padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 500 }}>{c.group}</span>}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16, flexShrink: 0 }}>
              {c.status === 'onboarding' ? (
                <div style={{ textAlign: 'center' }}><p style={{ color: colors.textMuted, margin: 0, fontSize: isMobile ? 9 : 11 }}>Setup</p><p style={{ color: colors.warning, margin: 0, fontSize: isMobile ? 16 : 18, fontWeight: 700 }}>{c.onboardingComplete ? Object.values(c.onboardingComplete).filter(Boolean).length : 0}/5</p></div>
              ) : (
                <>
                  <div style={{ textAlign: 'center' }}><p style={{ color: colors.textMuted, margin: 0, fontSize: isMobile ? 9 : 11 }}>Week</p><p style={{ color: colors.text, margin: 0, fontSize: isMobile ? 16 : 20, fontWeight: 700 }}>{c.currentWeek}</p></div>
                  {!isMobile && <div style={{ textAlign: 'center' }}><p style={{ color: colors.textMuted, margin: 0, fontSize: 11 }}>Workouts</p><p style={{ color: colors.primary, margin: 0, fontSize: 20, fontWeight: 700 }}>{c.weeklyLogs.reduce((a, l) => a + l.workoutsCompleted, 0)}</p></div>}
                </>
              )}
              <button onClick={(e) => deleteClient(c.id, e)} style={{ padding: isMobile ? 6 : 8, background: `${colors.danger}15`, border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete client"><X size={isMobile ? 14 : 16} color={colors.danger} /></button>
              <ChevronRight size={isMobile ? 20 : 24} color={colors.textMuted} />
            </div>
          </div>
        </div>
      ))}
    </div>
    );
  };

  // ============ PT CLIENT DETAIL ============
  const PTClientDetail = ({ client }) => {
    const [tab, setTab] = useState(client.status === 'onboarding' ? 'onboarding' : 'overview');
    const [editingSection, setEditingSection] = useState(null);
    const [editData, setEditData] = useState({});
    const [workoutViewMode, setWorkoutViewMode] = useState('week'); // 'week' or 'program'
    const [showAddPTWorkout, setShowAddPTWorkout] = useState(false);
    const [newPTWorkout, setNewPTWorkout] = useState({ day: 'Monday', name: '', type: 'strength', duration: 45, exercises: [], notes: '' });
    const [newPTExercise, setNewPTExercise] = useState({ name: '', sets: 3, reps: '10' });
    
    // Use the SAME generators as client view for synchronization
    const currentWorkout = client.status === 'active' ? generateDynamicWorkout(client) : null;
    const nutritionPlan = client.status === 'active' ? generateNutritionPlan(client) : null;
    const programOverview = client.status === 'active' ? generateWorkoutPlan(client) : null;
    
    // Assessment radar data - only show if assessments completed
    const hasAssessments = client.assessmentScores !== null;
    const radarData = hasAssessments ? [
      { metric: 'Movement', score: Math.round((client.assessmentScores.movement / 21) * 100), label: `FMS: ${client.assessmentScores.movement}/21` },
      { metric: 'Cardio', score: client.assessmentScores.cardio, label: `${client.assessmentScores.cardio}th %ile` },
      { metric: 'Strength', score: client.assessmentScores.strength, label: `${client.assessmentScores.strength}th %ile` },
      { metric: 'Flexibility', score: client.assessmentScores.flexibility, label: `${client.assessmentScores.flexibility}th %ile` },
      { metric: 'Balance', score: client.assessmentScores.balance, label: `${client.assessmentScores.balance}th %ile` }
    ] : [];

    const onboardingSteps = [
      { key: 'health', label: 'Health Metrics', icon: Heart, desc: 'Blood pressure, heart rate, measurements' },
      { key: 'lifestyle', label: 'Lifestyle Assessment', icon: Briefcase, desc: 'Occupation, sleep, stress, activity level' },
      { key: 'injuries', label: 'Injury History', icon: Shield, desc: 'Current and past injuries' },
      { key: 'goals', label: 'Goals & Targets', icon: Target, desc: 'Fitness goals and target weight' },
      { key: 'assessments', label: 'Fitness Assessments', icon: Clipboard, desc: 'FMS, cardio, strength, flexibility, balance tests' }
    ];

    const completedSteps = client.onboardingComplete ? Object.values(client.onboardingComplete).filter(Boolean).length : 0;
    const totalSteps = 5;

    const updateClientData = (section, data) => {
      const updatedClient = { ...client };
      
      if (section === 'health') {
        updatedClient.bloodPressure = data.bloodPressure;
        updatedClient.restingHR = data.restingHR;
        updatedClient.height = data.height;
        updatedClient.weight = data.weight;
        updatedClient.targetWeight = data.targetWeight;
        updatedClient.onboardingComplete = { ...updatedClient.onboardingComplete, health: true };
      } else if (section === 'lifestyle') {
        updatedClient.lifestyle = data;
        updatedClient.onboardingComplete = { ...updatedClient.onboardingComplete, lifestyle: true };
      } else if (section === 'injuries') {
        updatedClient.injuries = data.injuries || [];
        updatedClient.onboardingComplete = { ...updatedClient.onboardingComplete, injuries: true };
      } else if (section === 'goals') {
        updatedClient.goals = data.goals || [];
        updatedClient.isRunner = data.isRunner || false;
        updatedClient.runningClub = data.runningClub || '';
        updatedClient.runnerGoals = data.runnerGoals || [];
        updatedClient.onboardingComplete = { ...updatedClient.onboardingComplete, goals: true };
      } else if (section === 'assessments') {
        updatedClient.assessmentScores = data;
        updatedClient.onboardingComplete = { ...updatedClient.onboardingComplete, assessments: true };
      }

      // Check if all onboarding complete
      const allComplete = Object.values(updatedClient.onboardingComplete).every(Boolean);
      if (allComplete) {
        updatedClient.status = 'active';
        updatedClient.currentWeek = 1;
      }

      setClients(clients.map(c => c.id === client.id ? updatedClient : c));
      setSelectedClient(updatedClient);
      setEditingSection(null);
    };

    // Add PT custom workout for this client
    const addPTWorkout = () => {
      const workoutToAdd = { ...newPTWorkout, id: Date.now(), addedBy: 'PT', addedAt: new Date().toISOString() };
      const updatedClient = { 
        ...client, 
        ptWorkouts: [...(client.ptWorkouts || []), workoutToAdd]
      };
      setClients(clients.map(c => c.id === client.id ? updatedClient : c));
      setSelectedClient(updatedClient);
      setShowAddPTWorkout(false);
      setNewPTWorkout({ day: 'Monday', name: '', type: 'strength', duration: 45, exercises: [], notes: '' });
    };

    const deletePTWorkout = (workoutId) => {
      const updatedClient = {
        ...client,
        ptWorkouts: (client.ptWorkouts || []).filter(w => w.id !== workoutId)
      };
      setClients(clients.map(c => c.id === client.id ? updatedClient : c));
      setSelectedClient(updatedClient);
    };

    // Onboarding Section Editor
    const OnboardingEditor = ({ section }) => {
      const [formData, setFormData] = useState(() => {
        if (section === 'health') return { bloodPressure: client.bloodPressure || '', restingHR: client.restingHR || '', height: client.height || '', weight: client.weight || '', targetWeight: client.targetWeight || '' };
        if (section === 'lifestyle') return client.lifestyle || { occupation: '', workType: 'mixed', hoursSeated: 6, sleepHours: 7, stressLevel: 5, waterIntake: 2 };
        if (section === 'injuries') return { injuries: client.injuries || [], newInjury: { type: '', status: 'managing', notes: '' } };
        if (section === 'goals') return { goals: client.goals || [], newGoal: '', isRunner: client.isRunner || false, runningClub: client.runningClub || '', runnerGoals: client.runnerGoals || [] };
        if (section === 'assessments') return client.assessmentScores || { movement: '', cardio: '', strength: '', flexibility: '', balance: '' };
        return {};
      });

      return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: colors.cardBg, borderRadius: 20, width: '90%', maxWidth: 550, maxHeight: '85vh', overflow: 'auto', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: colors.text, margin: 0, fontSize: 20, fontWeight: 700 }}>{onboardingSteps.find(s => s.key === section)?.label}</h2>
              <button onClick={() => setEditingSection(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color={colors.textMuted} /></button>
            </div>

            {section === 'health' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Blood Pressure</label><input value={formData.bloodPressure} onChange={e => setFormData({...formData, bloodPressure: e.target.value})} placeholder="e.g. 120/80" style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} /></div>
                <div><label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Resting Heart Rate (bpm)</label><input type="number" value={formData.restingHR} onChange={e => setFormData({...formData, restingHR: parseInt(e.target.value) || ''})} placeholder="e.g. 72" style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} /></div>
                <div><label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Height (cm)</label><input type="number" value={formData.height} onChange={e => setFormData({...formData, height: parseInt(e.target.value) || ''})} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} /></div>
                <div><label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Weight (kg)</label><input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: parseInt(e.target.value) || ''})} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} /></div>
                <div style={{ gridColumn: 'span 2' }}><label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Target Weight (kg)</label><input type="number" value={formData.targetWeight} onChange={e => setFormData({...formData, targetWeight: parseInt(e.target.value) || ''})} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} /></div>
              </div>
            )}

            {section === 'lifestyle' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: 'span 2' }}><label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Occupation</label><input value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} placeholder="e.g. Software Developer" style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} /></div>
                <div><label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Work Type</label><select value={formData.workType} onChange={e => setFormData({...formData, workType: e.target.value})} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }}><option value="sedentary">Sedentary (desk job)</option><option value="mixed">Mixed (some movement)</option><option value="active">Active (on feet)</option></select></div>
                <div><label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Hours Seated/Day</label><input type="number" value={formData.hoursSeated} onChange={e => setFormData({...formData, hoursSeated: parseInt(e.target.value) || 0})} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} /></div>
                <div><label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Sleep (hours/night)</label><input type="number" step="0.5" value={formData.sleepHours} onChange={e => setFormData({...formData, sleepHours: parseFloat(e.target.value) || 0})} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} /></div>
                <div><label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Stress Level (1-10)</label><input type="range" min="1" max="10" value={formData.stressLevel} onChange={e => setFormData({...formData, stressLevel: parseInt(e.target.value)})} style={{ width: '100%' }} /><span style={{ color: colors.text }}>{formData.stressLevel}/10</span></div>
                <div><label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Water Intake (L/day)</label><input type="number" step="0.5" value={formData.waterIntake} onChange={e => setFormData({...formData, waterIntake: parseFloat(e.target.value) || 0})} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} /></div>
              </div>
            )}

            {section === 'injuries' && (
              <div>
                {formData.injuries.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    {formData.injuries.map((inj, i) => (
                      <div key={i} style={{ background: colors.darker, borderRadius: 10, padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div><p style={{ color: colors.text, margin: 0, fontWeight: 500 }}>{inj.type}</p><p style={{ color: colors.textMuted, margin: 0, fontSize: 12 }}>{inj.status} - {inj.notes}</p></div>
                        <button onClick={() => setFormData({...formData, injuries: formData.injuries.filter((_, idx) => idx !== i)})} style={{ background: `${colors.danger}20`, border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer' }}><X size={14} color={colors.danger} /></button>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ background: `${colors.primary}10`, borderRadius: 12, padding: 16 }}>
                  <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 14 }}>Add Injury</h4>
                  <input value={formData.newInjury.type} onChange={e => setFormData({...formData, newInjury: {...formData.newInjury, type: e.target.value}})} placeholder="Injury type (e.g. Lower back pain)" style={{ width: '100%', padding: 10, marginBottom: 8, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.text, fontSize: 13 }} />
                  <select value={formData.newInjury.status} onChange={e => setFormData({...formData, newInjury: {...formData.newInjury, status: e.target.value}})} style={{ width: '100%', padding: 10, marginBottom: 8, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.text, fontSize: 13 }}><option value="managing">Currently Managing</option><option value="recovered">Recovered</option></select>
                  <input value={formData.newInjury.notes} onChange={e => setFormData({...formData, newInjury: {...formData.newInjury, notes: e.target.value}})} placeholder="Notes (e.g. avoid high impact)" style={{ width: '100%', padding: 10, marginBottom: 8, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.text, fontSize: 13 }} />
                  <button onClick={() => { if (formData.newInjury.type) { setFormData({...formData, injuries: [...formData.injuries, {...formData.newInjury, date: new Date().toISOString().slice(0,7)}], newInjury: { type: '', status: 'managing', notes: '' }}); } }} style={{ padding: '8px 16px', background: colors.primary, border: 'none', borderRadius: 8, color: 'white', fontSize: 13, cursor: 'pointer' }}><Plus size={14} /> Add</button>
                </div>
                <p style={{ color: colors.textMuted, fontSize: 12, marginTop: 12 }}>No injuries? Just save to mark complete.</p>
              </div>
            )}

            {section === 'goals' && (
              <div>
                {/* Runner Toggle */}
                <div style={{ background: `${colors.secondary}15`, borderRadius: 12, padding: 16, marginBottom: 20, border: `1px solid ${colors.secondary}30` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: formData.isRunner ? 12 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 24 }}>🏃</span>
                      <div>
                        <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 14 }}>Is this client a runner?</p>
                        <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 12 }}>Enable runner-specific workouts and nutrition</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setFormData({...formData, isRunner: !formData.isRunner})}
                      style={{ 
                        width: 50, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
                        background: formData.isRunner ? colors.success : colors.darker,
                        position: 'relative', transition: 'background 0.2s'
                      }}
                    >
                      <div style={{ 
                        width: 24, height: 24, borderRadius: '50%', background: 'white',
                        position: 'absolute', top: 2, left: formData.isRunner ? 24 : 2, transition: 'left 0.2s'
                      }} />
                    </button>
                  </div>
                  
                  {formData.isRunner && (
                    <>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ color: colors.textMuted, fontSize: 11, display: 'block', marginBottom: 6 }}>Running Club (optional)</label>
                        <input 
                          value={formData.runningClub || ''} 
                          onChange={e => setFormData({...formData, runningClub: e.target.value})} 
                          placeholder="e.g. City Runners Club, Parkrun, etc." 
                          style={{ width: '100%', padding: 10, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.text, fontSize: 13 }} 
                        />
                      </div>
                      <div>
                        <label style={{ color: colors.textMuted, fontSize: 11, display: 'block', marginBottom: 6 }}>Runner Goals (select any that apply)</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {['Sub-4hr marathon', 'Sub-2hr half', 'Run first 5K', 'Improve 5K time', 'Improve 10K time', 'Build endurance', 'Injury prevention', 'Race preparation'].map(rg => (
                            <button 
                              key={rg} 
                              onClick={() => {
                                const runnerGoals = formData.runnerGoals || [];
                                setFormData({...formData, runnerGoals: runnerGoals.includes(rg) ? runnerGoals.filter(g => g !== rg) : [...runnerGoals, rg]});
                              }}
                              style={{ 
                                background: (formData.runnerGoals || []).includes(rg) ? colors.secondary : colors.darker, 
                                border: `1px solid ${(formData.runnerGoals || []).includes(rg) ? colors.secondary : colors.borderColor}`, 
                                borderRadius: 16, padding: '6px 12px', 
                                color: (formData.runnerGoals || []).includes(rg) ? 'white' : colors.textMuted, 
                                fontSize: 12, cursor: 'pointer' 
                              }}
                            >
                              {rg}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 14 }}>General Fitness Goals</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {formData.goals.map((g, i) => (
                    <span key={i} style={{ background: `${colors.primary}20`, color: colors.text, padding: '6px 12px', borderRadius: 20, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>{g}<button onClick={() => setFormData({...formData, goals: formData.goals.filter((_, idx) => idx !== i)})} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={12} color={colors.textMuted} /></button></span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <input value={formData.newGoal} onChange={e => setFormData({...formData, newGoal: e.target.value})} placeholder="Add a goal..." onKeyPress={e => { if (e.key === 'Enter' && formData.newGoal) { setFormData({...formData, goals: [...formData.goals, formData.newGoal], newGoal: ''}); } }} style={{ flex: 1, padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} />
                  <button onClick={() => { if (formData.newGoal) { setFormData({...formData, goals: [...formData.goals, formData.newGoal], newGoal: ''}); } }} style={{ padding: '0 16px', background: colors.primary, border: 'none', borderRadius: 10, color: 'white', cursor: 'pointer' }}><Plus size={18} /></button>
                </div>
                <p style={{ color: colors.textMuted, fontSize: 12 }}>Common goals:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {['Lose weight', 'Build muscle', 'Improve strength', 'Better cardio', 'Increase flexibility', 'Reduce pain', 'Better posture', 'More energy'].filter(g => !formData.goals.includes(g)).map(g => (
                    <button key={g} onClick={() => setFormData({...formData, goals: [...formData.goals, g]})} style={{ background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 16, padding: '6px 12px', color: colors.textMuted, fontSize: 12, cursor: 'pointer' }}>{g}</button>
                  ))}
                </div>
              </div>
            )}

            {section === 'assessments' && (
              <div>
                <p style={{ color: colors.textMuted, fontSize: 13, marginBottom: 20 }}>Enter assessment results. These create the fitness profile radar chart.</p>
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ background: colors.darker, borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}><label style={{ color: colors.text, fontWeight: 600, fontSize: 14 }}>Functional Movement Screen (FMS)</label><span style={{ color: colors.primary, fontWeight: 700 }}>{formData.movement || '—'}/21</span></div>
                    <input type="range" min="0" max="21" value={formData.movement || 0} onChange={e => setFormData({...formData, movement: parseInt(e.target.value)})} style={{ width: '100%' }} />
                    <p style={{ color: colors.textMuted, fontSize: 11, margin: '4px 0 0' }}>Sum of 7 movement patterns (0-3 each). ≥14 = low injury risk</p>
                  </div>
                  <div style={{ background: colors.darker, borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}><label style={{ color: colors.text, fontWeight: 600, fontSize: 14 }}>Cardiovascular Fitness</label><span style={{ color: colors.secondary, fontWeight: 700 }}>{formData.cardio || '—'}th %ile</span></div>
                    <input type="range" min="0" max="100" value={formData.cardio || 0} onChange={e => setFormData({...formData, cardio: parseInt(e.target.value)})} style={{ width: '100%' }} />
                    <p style={{ color: colors.textMuted, fontSize: 11, margin: '4px 0 0' }}>Percentile from step test, VO2 estimate, or similar</p>
                  </div>
                  <div style={{ background: colors.darker, borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}><label style={{ color: colors.text, fontWeight: 600, fontSize: 14 }}>Strength Baseline</label><span style={{ color: colors.accent, fontWeight: 700 }}>{formData.strength || '—'}th %ile</span></div>
                    <input type="range" min="0" max="100" value={formData.strength || 0} onChange={e => setFormData({...formData, strength: parseInt(e.target.value)})} style={{ width: '100%' }} />
                    <p style={{ color: colors.textMuted, fontSize: 11, margin: '4px 0 0' }}>Based on push-ups, squats, plank hold relative to age/gender</p>
                  </div>
                  <div style={{ background: colors.darker, borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}><label style={{ color: colors.text, fontWeight: 600, fontSize: 14 }}>Flexibility</label><span style={{ color: colors.success, fontWeight: 700 }}>{formData.flexibility || '—'}th %ile</span></div>
                    <input type="range" min="0" max="100" value={formData.flexibility || 0} onChange={e => setFormData({...formData, flexibility: parseInt(e.target.value)})} style={{ width: '100%' }} />
                    <p style={{ color: colors.textMuted, fontSize: 11, margin: '4px 0 0' }}>Sit-and-reach, shoulder mobility tests</p>
                  </div>
                  <div style={{ background: colors.darker, borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}><label style={{ color: colors.text, fontWeight: 600, fontSize: 14 }}>Balance & Stability</label><span style={{ color: colors.warning, fontWeight: 700 }}>{formData.balance || '—'}th %ile</span></div>
                    <input type="range" min="0" max="100" value={formData.balance || 0} onChange={e => setFormData({...formData, balance: parseInt(e.target.value)})} style={{ width: '100%' }} />
                    <p style={{ color: colors.textMuted, fontSize: 11, margin: '4px 0 0' }}>Single-leg stance, Y-balance test</p>
                  </div>
                </div>
              </div>
            )}

            <button onClick={() => {
              // Auto-add unsaved injury if there's data
              let finalData = formData;
              if (section === 'injuries' && formData.newInjury?.type) {
                finalData = { ...formData, injuries: [...formData.injuries, {...formData.newInjury, date: new Date().toISOString().slice(0,7)}] };
              }
              if (section === 'goals' && formData.newGoal) {
                finalData = { ...formData, goals: [...formData.goals, formData.newGoal] };
              }
              // Handle goals section with runner data
              if (section === 'goals') {
                updateClientData(section, { 
                  goals: finalData.goals, 
                  isRunner: finalData.isRunner, 
                  runningClub: finalData.runningClub, 
                  runnerGoals: finalData.runnerGoals 
                });
              } else {
                updateClientData(section, section === 'injuries' ? { injuries: finalData.injuries } : finalData);
              }
            }} style={{ width: '100%', marginTop: 24, padding: 14, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, border: 'none', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}><Save size={18} style={{ marginRight: 8 }} />Save</button>
          </div>
        </div>
      );
    };

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-start', marginBottom: isMobile ? 20 : 32, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 16 : 0 }}>
          <div style={{ display: 'flex', gap: isMobile ? 12 : 20 }}>
            <div style={{ width: isMobile ? 56 : 80, height: isMobile ? 56 : 80, borderRadius: isMobile ? 12 : 16, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: isMobile ? 20 : 28, flexShrink: 0 }}>{client.name.split(' ').map(n => n[0]).join('')}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 style={{ color: colors.text, margin: 0, fontSize: isMobile ? 18 : 26, fontWeight: 700, fontFamily: 'Outfit' }}>{client.name}</h1>
                {client.status === 'onboarding' && <span style={{ background: `${colors.warning}20`, color: colors.warning, padding: '3px 10px', borderRadius: 16, fontSize: 11, fontWeight: 600 }}>Onboarding</span>}
              </div>
              {!isMobile && <p style={{ color: colors.textMuted, margin: '6px 0', fontSize: 14 }}>{client.email}</p>}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: isMobile ? 6 : 0 }}>
                <span style={{ background: `${colors.primary}20`, color: colors.primary, padding: '3px 10px', borderRadius: 16, fontSize: 11 }}>{client.gender === 'female' ? '♀' : '♂'} {client.age || '—'}y</span>
                <span style={{ background: `${colors.secondary}20`, color: colors.secondary, padding: '3px 10px', borderRadius: 16, fontSize: 11, textTransform: 'capitalize' }}>{client.fitnessLevel}</span>
                {client.group && !isMobile && <span style={{ background: `${colors.accent}20`, color: colors.accent, padding: '3px 10px', borderRadius: 16, fontSize: 11 }}>{client.group}</span>}
              </div>
            </div>
          </div>
          {client.status === 'active' && !isMobile && <button style={{ padding: '12px 20px', background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14, cursor: 'pointer' }}><Download size={18} style={{ marginRight: 8 }} />Export</button>}
        </div>

        {/* Onboarding Progress Bar */}
        {client.status === 'onboarding' && (
          <div style={{ background: `${colors.warning}15`, borderRadius: 12, padding: isMobile ? 12 : 16, marginBottom: isMobile ? 16 : 24, border: `1px solid ${colors.warning}30` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ color: colors.text, fontWeight: 600, fontSize: isMobile ? 13 : 14 }}>Onboarding Progress</span>
              <span style={{ color: colors.warning, fontWeight: 700, fontSize: isMobile ? 13 : 14 }}>{completedSteps}/{totalSteps}</span>
            </div>
            <div style={{ background: colors.darker, borderRadius: 6, height: 8 }}>
              <div style={{ width: `${(completedSteps/totalSteps) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${colors.warning}, ${colors.success})`, borderRadius: 6, transition: 'width 0.3s' }} />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 4, background: colors.darker, padding: 4, borderRadius: 12, marginBottom: isMobile ? 16 : 24, overflowX: 'auto' }}>
          {client.status === 'onboarding' && <button onClick={() => setTab('onboarding')} style={{ flex: isMobile ? 'none' : 1, padding: isMobile ? '10px 14px' : 12, background: tab === 'onboarding' ? colors.cardBg : 'transparent', border: 'none', borderRadius: 10, color: tab === 'onboarding' ? colors.text : colors.textMuted, fontSize: isMobile ? 12 : 14, fontWeight: tab === 'onboarding' ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap' }}>Setup</button>}
          {['overview', 'workout', 'progress', 'nutrition', 'logs'].map(t => <button key={t} onClick={() => setTab(t)} disabled={client.status === 'onboarding' && t !== 'overview'} style={{ flex: isMobile ? 'none' : 1, padding: isMobile ? '10px 14px' : 12, background: tab === t ? colors.cardBg : 'transparent', border: 'none', borderRadius: 10, color: tab === t ? colors.text : colors.textMuted, fontSize: isMobile ? 12 : 14, fontWeight: tab === t ? 600 : 400, cursor: client.status === 'onboarding' && t !== 'overview' ? 'not-allowed' : 'pointer', opacity: client.status === 'onboarding' && t !== 'overview' ? 0.5 : 1, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{t === 'logs' ? 'Workout Logs' : t}</button>)}
        </div>

        {/* Onboarding Tab */}
        {tab === 'onboarding' && (
          <div>
            <h3 style={{ color: colors.text, margin: '0 0 20px', fontSize: 18, fontWeight: 600 }}>Complete Client Profile</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {onboardingSteps.map((step, i) => {
                const isComplete = client.onboardingComplete?.[step.key];
                return (
                  <div key={step.key} onClick={() => setEditingSection(step.key)} style={{ background: colors.cardBg, borderRadius: 14, padding: 20, border: `1px solid ${isComplete ? colors.success : colors.borderColor}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: isComplete ? `${colors.success}20` : `${colors.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isComplete ? <Check size={24} color={colors.success} /> : <step.icon size={24} color={colors.primary} />}
                      </div>
                      <div>
                        <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 15 }}>{step.label}</p>
                        <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 13 }}>{step.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} color={colors.textMuted} />
                  </div>
                );
              })}
            </div>
            {completedSteps === totalSteps && (
              <div style={{ background: `${colors.success}15`, borderRadius: 14, padding: 20, marginTop: 20, border: `1px solid ${colors.success}30`, textAlign: 'center' }}>
                <Check size={32} color={colors.success} style={{ marginBottom: 8 }} />
                <h3 style={{ color: colors.text, margin: '0 0 8px' }}>Onboarding Complete!</h3>
                <p style={{ color: colors.textMuted, margin: 0 }}>Client is now active and can start their program.</p>
              </div>
            )}
          </div>
        )}

        {tab === 'overview' && (
          <>
            {/* Health Metrics - show placeholder if not filled */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
              {[{ l: 'Age', v: client.age, u: 'yrs' }, { l: 'Height', v: client.height, u: 'cm' }, { l: 'Weight', v: client.weight, u: 'kg' }, { l: 'BP', v: client.bloodPressure, u: '' }, { l: 'HR', v: client.restingHR, u: 'bpm' }].map((s, i) => (
                <div key={i} style={{ background: colors.cardBg, borderRadius: 12, padding: 16, border: `1px solid ${colors.borderColor}` }}>
                  <p style={{ color: colors.textMuted, margin: 0, fontSize: 12 }}>{s.l}</p>
                  {s.v ? <p style={{ color: colors.text, margin: '4px 0 0', fontSize: 22, fontWeight: 700 }}>{s.v}<span style={{ fontSize: 12, fontWeight: 400, marginLeft: 4 }}>{s.u}</span></p> : <p style={{ color: colors.borderColor, margin: '4px 0 0', fontSize: 16, fontStyle: 'italic' }}>Not set</p>}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 20, marginBottom: isMobile ? 16 : 24 }}>
              {/* Lifestyle */}
              <div style={{ background: colors.cardBg, borderRadius: 16, padding: isMobile ? 16 : 24, border: `1px solid ${colors.borderColor}` }}>
                <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: isMobile ? 14 : 16, fontWeight: 600 }}>Lifestyle</h3>
                {client.lifestyle ? (
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr', gap: isMobile ? 12 : 16 }}>
                    {[{ i: Briefcase, l: 'Job', v: client.lifestyle.occupation }, { i: Monitor, l: 'Type', v: `${client.lifestyle.workType} (${client.lifestyle.hoursSeated}h)` }, { i: Moon, l: 'Sleep', v: `${client.lifestyle.sleepHours}h` }, { i: Zap, l: 'Stress', v: `${client.lifestyle.stressLevel}/10` }].map((x, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 }}><div style={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, borderRadius: 8, background: `${colors.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><x.i size={isMobile ? 14 : 18} color={colors.primary} /></div><div><p style={{ color: colors.textMuted, margin: 0, fontSize: isMobile ? 10 : 12 }}>{x.l}</p><p style={{ color: colors.text, margin: '2px 0 0', fontSize: isMobile ? 12 : 14, fontWeight: 500, textTransform: 'capitalize' }}>{x.v}</p></div></div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 20, background: colors.darker, borderRadius: 12 }}>
                    <p style={{ color: colors.textMuted, margin: 0 }}>Complete lifestyle assessment</p>
                    {client.status === 'onboarding' && <button onClick={() => setEditingSection('lifestyle')} style={{ marginTop: 12, padding: '8px 16px', background: colors.primary, border: 'none', borderRadius: 8, color: 'white', fontSize: 13, cursor: 'pointer' }}>Add Now</button>}
                  </div>
                )}
              </div>
              {/* Injuries */}
              <div style={{ background: colors.cardBg, borderRadius: 16, padding: isMobile ? 16 : 24, border: `1px solid ${colors.borderColor}` }}>
                <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: isMobile ? 14 : 16, fontWeight: 600 }}>Injuries</h3>
                {client.onboardingComplete?.injuries ? (
                  client.injuries.length === 0 ? <div style={{ textAlign: 'center', padding: 20, background: `${colors.success}10`, borderRadius: 12 }}><Check size={24} color={colors.success} /><p style={{ color: colors.success, margin: '8px 0 0', fontWeight: 500 }}>None reported</p></div> : client.injuries.map((inj, i) => (
                    <div key={i} style={{ background: colors.darker, borderRadius: 10, padding: 14, marginBottom: 10, borderLeft: `3px solid ${inj.status === 'managing' ? colors.warning : colors.success}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 14 }}>{inj.type}</p><span style={{ background: inj.status === 'managing' ? `${colors.warning}20` : `${colors.success}20`, color: inj.status === 'managing' ? colors.warning : colors.success, padding: '3px 10px', borderRadius: 12, fontSize: 11, textTransform: 'capitalize' }}>{inj.status}</span></div>
                      <p style={{ color: colors.textMuted, margin: '6px 0 0', fontSize: 12 }}>{inj.notes}</p>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: 20, background: colors.darker, borderRadius: 12 }}>
                    <p style={{ color: colors.textMuted, margin: 0 }}>Complete injury history</p>
                    {client.status === 'onboarding' && <button onClick={() => setEditingSection('injuries')} style={{ marginTop: 12, padding: '8px 16px', background: colors.primary, border: 'none', borderRadius: 8, color: 'white', fontSize: 13, cursor: 'pointer' }}>Add Now</button>}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 20 }}>
              {/* Goals */}
              <div style={{ background: colors.cardBg, borderRadius: 16, padding: isMobile ? 16 : 24, border: `1px solid ${colors.borderColor}` }}>
                <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: isMobile ? 14 : 16, fontWeight: 600 }}>Goals</h3>
                {((client.goals && client.goals.length > 0) || (client.runnerGoals && client.runnerGoals.length > 0)) ? (
                  <>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {(client.goals || []).map((g, i) => <span key={`g-${i}`} style={{ background: `${colors.primary}15`, border: `1px solid ${colors.primary}30`, color: colors.text, padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500 }}><Target size={14} style={{ marginRight: 6 }} />{g}</span>)}
                      {(client.runnerGoals || []).map((g, i) => <span key={`r-${i}`} style={{ background: `${colors.secondary}15`, border: `1px solid ${colors.secondary}30`, color: colors.text, padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500 }}>🏃 {g}</span>)}
                    </div>
                    {client.weight && client.targetWeight && (
                      <div style={{ marginTop: 20 }}>
                        <p style={{ color: colors.textMuted, fontSize: 12, marginBottom: 8 }}>Weight Progress</p>
                        <div style={{ background: colors.darker, borderRadius: 8, height: 12 }}><div style={{ width: `${Math.max(0, Math.min(100, ((client.weight - client.targetWeight) / (client.weight * 0.15)) * 100))}%`, height: '100%', background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`, borderRadius: 8 }} /></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}><span style={{ color: colors.textMuted, fontSize: 11 }}>Current: {client.weight}kg</span><span style={{ color: colors.secondary, fontSize: 11, fontWeight: 500 }}>Target: {client.targetWeight}kg</span></div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: 20, background: colors.darker, borderRadius: 12 }}>
                    <p style={{ color: colors.textMuted, margin: 0 }}>Set client goals</p>
                    {client.status === 'onboarding' && <button onClick={() => setEditingSection('goals')} style={{ marginTop: 12, padding: '8px 16px', background: colors.primary, border: 'none', borderRadius: 8, color: 'white', fontSize: 13, cursor: 'pointer' }}>Add Now</button>}
                  </div>
                )}
              </div>
              {/* Assessment Radar - only show if assessments completed */}
              <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.borderColor}` }}>
                <h3 style={{ color: colors.text, margin: '0 0 10px', fontSize: 16, fontWeight: 600 }}>Fitness Assessment</h3>
                {hasAssessments ? (
                  <>
                    <ResponsiveContainer width="100%" height={200}><RadarChart data={radarData}><PolarGrid stroke={colors.borderColor} /><PolarAngleAxis dataKey="metric" tick={{ fill: colors.textMuted, fontSize: 11 }} /><PolarRadiusAxis tick={{ fill: colors.textMuted, fontSize: 10 }} domain={[0, 100]} /><Radar dataKey="score" stroke={colors.primary} fill={colors.primary} fillOpacity={0.3} strokeWidth={2} /></RadarChart></ResponsiveContainer>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, marginTop: 8 }}>
                      {radarData.map((d, i) => <div key={i} style={{ textAlign: 'center' }}><p style={{ color: colors.textMuted, margin: 0, fontSize: 9 }}>{d.metric}</p><p style={{ color: colors.text, margin: 0, fontSize: 11, fontWeight: 600 }}>{d.label}</p></div>)}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40, background: colors.darker, borderRadius: 12 }}>
                    <Clipboard size={32} color={colors.textMuted} style={{ marginBottom: 12 }} />
                    <p style={{ color: colors.textMuted, margin: 0, fontSize: 14 }}>No assessment data yet</p>
                    <p style={{ color: colors.borderColor, margin: '8px 0 0', fontSize: 12 }}>Complete fitness assessments to see profile</p>
                    {client.status === 'onboarding' && <button onClick={() => setEditingSection('assessments')} style={{ marginTop: 16, padding: '10px 20px', background: colors.primary, border: 'none', borderRadius: 8, color: 'white', fontSize: 13, cursor: 'pointer' }}>Run Assessments</button>}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {tab === 'workout' && currentWorkout && (
          <>
            {/* View Toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <button onClick={() => setWorkoutViewMode('week')} style={{ padding: '10px 20px', background: workoutViewMode === 'week' ? colors.primary : colors.cardBg, border: `1px solid ${workoutViewMode === 'week' ? colors.primary : colors.borderColor}`, borderRadius: 10, color: workoutViewMode === 'week' ? 'white' : colors.text, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                📅 This Week (Client View)
              </button>
              <button onClick={() => setWorkoutViewMode('program')} style={{ padding: '10px 20px', background: workoutViewMode === 'program' ? colors.primary : colors.cardBg, border: `1px solid ${workoutViewMode === 'program' ? colors.primary : colors.borderColor}`, borderRadius: 10, color: workoutViewMode === 'program' ? 'white' : colors.text, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                📋 12-Week Program
              </button>
            </div>

            {workoutViewMode === 'week' && (
              <>
                {/* Current Week Summary - Same as Client */}
                <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, borderRadius: 20, padding: 28, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 4px', fontSize: 13 }}>Week {client.currentWeek} of 12</p>
                      <h2 style={{ color: 'white', margin: '0 0 8px', fontSize: 24, fontWeight: 700 }}>{currentWorkout.weekFocus}</h2>
                      <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: 14 }}>{currentWorkout.recommendation}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: 'white', margin: 0, fontSize: 36, fontWeight: 800 }}>{currentWorkout.sessionsPerWeek}</p>
                      <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: 12 }}>sessions/week</p>
                    </div>
                  </div>
                </div>

                {/* Injury Alerts */}
                {currentWorkout.injuryPrevention.some(i => i.includes('ACTIVE')) && (
                  <div style={{ background: `${colors.warning}15`, borderRadius: 14, padding: 16, marginBottom: 20, border: `1px solid ${colors.warning}30` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <AlertTriangle size={20} color={colors.warning} />
                      <span style={{ color: colors.warning, fontWeight: 600 }}>Active Injury Adaptations</span>
                    </div>
                    {currentWorkout.injuryPrevention.filter(i => i.includes('ACTIVE')).map((note, i) => (
                      <p key={i} style={{ color: colors.text, margin: '4px 0', fontSize: 13 }}>{note}</p>
                    ))}
                  </div>
                )}

                {/* Weekly Schedule */}
                <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.borderColor}`, marginBottom: 20 }}>
                  <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Weekly Schedule</h3>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {currentWorkout.schedule.map((day, i) => (
                      <div key={i} style={{ background: colors.darker, borderRadius: 12, padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${colors.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ color: colors.primary, fontWeight: 700, fontSize: 12 }}>{day.day.slice(0, 3).toUpperCase()}</span>
                            </div>
                            <div>
                              <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 14 }}>{day.name}</p>
                              <p style={{ color: colors.textMuted, margin: 0, fontSize: 12 }}>{day.duration}</p>
                            </div>
                          </div>
                          <span style={{ color: colors.textMuted, fontSize: 12 }}>{day.exercises?.length || 0} exercises</span>
                        </div>
                        {day.exercises && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {day.exercises.slice(0, 5).map((ex, j) => (
                              <span key={j} style={{ background: colors.cardBg, padding: '6px 10px', borderRadius: 6, fontSize: 11, color: colors.textMuted }}>{ex.name}</span>
                            ))}
                            {day.exercises.length > 5 && <span style={{ color: colors.secondary, fontSize: 11, padding: '6px 0' }}>+{day.exercises.length - 5} more</span>}
                          </div>
                        )}
                        {day.notes && <p style={{ color: colors.secondary, margin: '8px 0 0', fontSize: 12, fontStyle: 'italic' }}>{day.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div style={{ background: `${colors.secondary}10`, borderRadius: 14, padding: 16, border: `1px solid ${colors.secondary}30`, marginBottom: 24 }}>
                  <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>Weekly Tips</h4>
                  {currentWorkout.weeklyTips.map((tip, i) => (
                    <p key={i} style={{ color: colors.textMuted, margin: '0 0 6px', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ color: colors.secondary }}>•</span> {tip}
                    </p>
                  ))}
                </div>

                {/* PT Custom Workouts Section */}
                <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.borderColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                      <h3 style={{ color: colors.text, margin: 0, fontSize: 16, fontWeight: 600 }}>Custom Workouts for {client.name.split(' ')[0]}</h3>
                      <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12 }}>Add personalized workouts beyond the AI-generated plan</p>
                    </div>
                    <button onClick={() => setShowAddPTWorkout(true)} style={{ padding: '10px 16px', background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, border: 'none', borderRadius: 10, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Plus size={16} />Add Workout
                    </button>
                  </div>

                  {(client.ptWorkouts && client.ptWorkouts.length > 0) ? (
                    <div style={{ display: 'grid', gap: 12 }}>
                      {client.ptWorkouts.map((w, i) => (
                        <div key={w.id} style={{ background: colors.darker, borderRadius: 12, padding: 16, borderLeft: `4px solid ${colors.accent}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span style={{ color: colors.primary, fontSize: 11, fontWeight: 600 }}>{w.day}</span>
                                <span style={{ background: `${colors.accent}20`, color: colors.accent, padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600 }}>PT CUSTOM</span>
                              </div>
                              <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 15 }}>{w.name}</p>
                              <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12 }}>{w.duration} min • {w.type}</p>
                            </div>
                            <button onClick={() => deletePTWorkout(w.id)} style={{ background: `${colors.danger}15`, border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer' }}>
                              <X size={14} color={colors.danger} />
                            </button>
                          </div>
                          {w.exercises.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                              {w.exercises.map((ex, j) => (
                                <span key={j} style={{ background: colors.cardBg, padding: '6px 10px', borderRadius: 6, fontSize: 11, color: colors.text }}>
                                  {ex.name} ({ex.sets}×{ex.reps})
                                </span>
                              ))}
                            </div>
                          )}
                          {w.notes && <p style={{ color: colors.secondary, margin: '10px 0 0', fontSize: 12, fontStyle: 'italic' }}>{w.notes}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ background: colors.darker, borderRadius: 12, padding: 24, textAlign: 'center' }}>
                      <Dumbbell size={32} color={colors.textMuted} style={{ marginBottom: 12 }} />
                      <p style={{ color: colors.textMuted, margin: 0, fontSize: 13 }}>No custom workouts added yet</p>
                      <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 11 }}>Add workouts tailored specifically for this client</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Add PT Workout Modal */}
            {showAddPTWorkout && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
                <div style={{ background: colors.cardBg, borderRadius: 20, width: '100%', maxWidth: 550, maxHeight: '90vh', overflow: 'auto', padding: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 style={{ color: colors.text, margin: 0, fontSize: 20, fontWeight: 700 }}>Add Custom Workout for {client.name.split(' ')[0]}</h2>
                    <button onClick={() => setShowAddPTWorkout(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color={colors.textMuted} /></button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div>
                      <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Day</label>
                      <select value={newPTWorkout.day} onChange={e => setNewPTWorkout({...newPTWorkout, day: e.target.value})} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }}>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Duration (min)</label>
                      <input type="number" value={newPTWorkout.duration} onChange={e => setNewPTWorkout({...newPTWorkout, duration: parseInt(e.target.value) || 0})} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Workout Name *</label>
                    <input value={newPTWorkout.name} onChange={e => setNewPTWorkout({...newPTWorkout, name: e.target.value})} placeholder="e.g. Hip Strength Focus, Core Stability" style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Type</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[{ id: 'strength', label: 'Strength', icon: '🏋️' }, { id: 'cardio', label: 'Cardio', icon: '🏃' }, { id: 'mobility', label: 'Mobility', icon: '🧘' }, { id: 'rehab', label: 'Rehab', icon: '💪' }].map(t => (
                        <button key={t.id} onClick={() => setNewPTWorkout({...newPTWorkout, type: t.id})} style={{ flex: 1, padding: 12, background: newPTWorkout.type === t.id ? `${colors.primary}20` : colors.darker, border: `2px solid ${newPTWorkout.type === t.id ? colors.primary : 'transparent'}`, borderRadius: 10, cursor: 'pointer', textAlign: 'center' }}>
                          <span style={{ fontSize: 20, display: 'block', marginBottom: 4 }}>{t.icon}</span>
                          <span style={{ color: colors.text, fontSize: 11 }}>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Exercises */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 8 }}>Exercises</label>
                    {newPTWorkout.exercises.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        {newPTWorkout.exercises.map((ex, i) => (
                          <div key={i} style={{ background: colors.darker, borderRadius: 8, padding: 10, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: colors.text, fontSize: 13 }}>{ex.name} — {ex.sets}×{ex.reps}</span>
                            <button onClick={() => setNewPTWorkout({...newPTWorkout, exercises: newPTWorkout.exercises.filter((_, idx) => idx !== i)})} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={14} color={colors.danger} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8 }}>
                      <input value={newPTExercise.name} onChange={e => setNewPTExercise({...newPTExercise, name: e.target.value})} placeholder="Exercise name" style={{ padding: 10, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.text, fontSize: 13 }} />
                      <input type="number" value={newPTExercise.sets} onChange={e => setNewPTExercise({...newPTExercise, sets: parseInt(e.target.value) || 0})} placeholder="Sets" style={{ padding: 10, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.text, fontSize: 13 }} />
                      <input value={newPTExercise.reps} onChange={e => setNewPTExercise({...newPTExercise, reps: e.target.value})} placeholder="Reps" style={{ padding: 10, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.text, fontSize: 13 }} />
                      <button onClick={() => { if (newPTExercise.name) { setNewPTWorkout({...newPTWorkout, exercises: [...newPTWorkout.exercises, {...newPTExercise}]}); setNewPTExercise({ name: '', sets: 3, reps: '10' }); }}} style={{ padding: '10px 14px', background: colors.secondary, border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer' }}><Plus size={16} /></button>
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Notes for Client</label>
                    <textarea value={newPTWorkout.notes} onChange={e => setNewPTWorkout({...newPTWorkout, notes: e.target.value})} placeholder="Any special instructions, focus areas, or tips..." style={{ width: '100%', height: 80, padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14, resize: 'none' }} />
                  </div>

                  <button onClick={addPTWorkout} disabled={!newPTWorkout.name} style={{ width: '100%', padding: 14, background: newPTWorkout.name ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.borderColor, border: 'none', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 600, cursor: newPTWorkout.name ? 'pointer' : 'not-allowed' }}>
                    <Save size={18} style={{ marginRight: 8 }} />Add Custom Workout
                  </button>
                </div>
              </div>
            )}

            {workoutViewMode === 'program' && programOverview && (
              <>
                <div style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`, borderRadius: 16, padding: 24, marginBottom: 24, border: `1px solid ${colors.primary}30` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}><div style={{ width: 48, height: 48, borderRadius: 12, background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Dumbbell size={24} color="white" /></div><div><h3 style={{ color: colors.text, margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>{client.gender === 'female' ? 'Dr. Stacy Sims Approach' : 'Training Philosophy'}</h3><p style={{ color: colors.textMuted, margin: 0, fontSize: 14 }}>{programOverview.philosophy}</p></div></div>
                </div>
                <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, marginBottom: 24, border: `1px solid ${colors.borderColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}><div><h3 style={{ color: colors.text, margin: 0, fontSize: 18, fontWeight: 700 }}>Q1: {programOverview.quarter1.focus}</h3><p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 13 }}>12-week program</p></div><span style={{ background: `${colors.success}20`, color: colors.success, padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Active</span></div>
                  {programOverview.quarter1.weeks.map((phase, pi) => (
                    <div key={pi} style={{ background: colors.darker, borderRadius: 12, padding: 20, marginBottom: pi < programOverview.quarter1.weeks.length - 1 ? 16 : 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}><div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, borderRadius: 8, padding: '6px 12px' }}><span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>WEEKS {phase.weeks}</span></div><span style={{ color: colors.text, fontSize: 15, fontWeight: 600 }}>{phase.theme}</span></div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                        {phase.sessions.map((s, si) => (
                          <div key={si} style={{ background: colors.cardBg, borderRadius: 10, padding: 14, border: `1px solid ${colors.borderColor}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><span style={{ color: colors.primary, fontSize: 12, fontWeight: 600 }}>{s.day}</span>{s.duration && <span style={{ color: colors.textMuted, fontSize: 11 }}><Clock size={12} /> {s.duration}min</span>}</div>
                            <p style={{ color: colors.text, margin: '0 0 10px', fontSize: 14, fontWeight: 600 }}>{s.type}</p>
                            <ul style={{ margin: 0, paddingLeft: 16 }}>{s.exercises.slice(0, 4).map((e, ei) => <li key={ei} style={{ color: colors.textMuted, fontSize: 12, marginBottom: 4 }}>{e}</li>)}{s.exercises.length > 4 && <li style={{ color: colors.secondary, fontSize: 12 }}>+{s.exercises.length - 4} more</li>}</ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {tab === 'progress' && client.weeklyLogs.length > 0 && (
          <>
            <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.borderColor}`, marginBottom: 24 }}>
              <h3 style={{ color: colors.text, margin: '0 0 20px', fontSize: 16, fontWeight: 600 }}>Weekly Progress</h3>
              <ResponsiveContainer width="100%" height={250}><LineChart data={client.weeklyLogs.map(l => ({ ...l, name: `W${l.week}` }))}><CartesianGrid strokeDasharray="3 3" stroke={colors.borderColor} /><XAxis dataKey="name" stroke={colors.textMuted} fontSize={12} /><YAxis stroke={colors.textMuted} fontSize={12} domain={[0, 10]} /><Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8 }} /><Line type="monotone" dataKey="energy" stroke={colors.primary} strokeWidth={2} dot={{ fill: colors.primary }} /><Line type="monotone" dataKey="mood" stroke={colors.secondary} strokeWidth={2} dot={{ fill: colors.secondary }} /><Line type="monotone" dataKey="workoutsCompleted" stroke={colors.accent} strokeWidth={2} dot={{ fill: colors.accent }} /></LineChart></ResponsiveContainer>
            </div>
          </>
        )}

        {tab === 'nutrition' && nutritionPlan && (
          <>
            {/* Summary Card */}
            <div style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent})`, borderRadius: 20, padding: 28, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
              <Utensils size={32} color="white" style={{ marginBottom: 12 }} />
              <h2 style={{ color: 'white', margin: '0 0 8px', fontSize: 22, fontWeight: 700 }}>Personalized Nutrition Plan</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: 14 }}>{nutritionPlan.summary}</p>
            </div>

            {/* Macro Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              <div style={{ background: colors.cardBg, borderRadius: 14, padding: 20, textAlign: 'center', border: `1px solid ${colors.borderColor}` }}>
                <Flame size={24} color={colors.primary} style={{ marginBottom: 8 }} />
                <p style={{ color: colors.text, margin: 0, fontSize: 28, fontWeight: 800 }}>{nutritionPlan.calories.target}</p>
                <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12 }}>Daily Calories</p>
                {nutritionPlan.calories.deficit > 0 && <p style={{ color: colors.secondary, margin: '4px 0 0', fontSize: 11 }}>-{nutritionPlan.calories.deficit} cal deficit</p>}
                {nutritionPlan.calories.surplus > 0 && <p style={{ color: colors.success, margin: '4px 0 0', fontSize: 11 }}>+{nutritionPlan.calories.surplus} cal surplus</p>}
              </div>
              <div style={{ background: colors.cardBg, borderRadius: 14, padding: 20, textAlign: 'center', border: `1px solid ${colors.borderColor}` }}>
                <div style={{ width: 24, height: 24, background: colors.danger, borderRadius: 6, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 12 }}>P</div>
                <p style={{ color: colors.text, margin: 0, fontSize: 28, fontWeight: 800 }}>{nutritionPlan.macros.protein}g</p>
                <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12 }}>Protein</p>
              </div>
              <div style={{ background: colors.cardBg, borderRadius: 14, padding: 20, textAlign: 'center', border: `1px solid ${colors.borderColor}` }}>
                <div style={{ width: 24, height: 24, background: colors.warning, borderRadius: 6, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 12 }}>C</div>
                <p style={{ color: colors.text, margin: 0, fontSize: 28, fontWeight: 800 }}>{nutritionPlan.macros.carbs}g</p>
                <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12 }}>Carbs</p>
              </div>
              <div style={{ background: colors.cardBg, borderRadius: 14, padding: 20, textAlign: 'center', border: `1px solid ${colors.borderColor}` }}>
                <div style={{ width: 24, height: 24, background: colors.accent, borderRadius: 6, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.dark, fontWeight: 700, fontSize: 12 }}>F</div>
                <p style={{ color: colors.text, margin: 0, fontSize: 28, fontWeight: 800 }}>{nutritionPlan.macros.fat}g</p>
                <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12 }}>Fat</p>
              </div>
            </div>

            {/* Sample Meals */}
            <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, marginBottom: 24, border: `1px solid ${colors.borderColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ color: colors.text, margin: 0, fontSize: 16, fontWeight: 600 }}>Week {nutritionPlan.mealWeek} Sample Meals</h3>
                <span style={{ background: `${colors.secondary}20`, color: colors.secondary, padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>🔄 Rotates Weekly</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[{ name: 'Breakfast', icon: '🌅', meals: nutritionPlan.sampleMeals.breakfast }, { name: 'Lunch', icon: '☀️', meals: nutritionPlan.sampleMeals.lunch }, { name: 'Dinner', icon: '🌙', meals: nutritionPlan.sampleMeals.dinner }, { name: 'Snacks', icon: '🍎', meals: nutritionPlan.sampleMeals.snacks }].map((meal, i) => (
                  <div key={i} style={{ background: colors.darker, borderRadius: 12, padding: 16 }}>
                    <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>{meal.icon} {meal.name}</h4>
                    {meal.meals.slice(0, 2).map((m, j) => (
                      <p key={j} style={{ color: colors.textMuted, margin: '0 0 6px', fontSize: 12, lineHeight: 1.4 }}>• {m}</p>
                    ))}
                    {meal.meals.length > 2 && <p style={{ color: colors.secondary, margin: 0, fontSize: 11 }}>+{meal.meals.length - 2} more options</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Special Focus Areas */}
            {nutritionPlan.specialFocus.length > 0 && (
              <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, marginBottom: 24, border: `1px solid ${colors.borderColor}` }}>
                <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Special Focus Areas</h3>
                {nutritionPlan.specialFocus.map((focus, i) => (
                  <div key={i} style={{ background: colors.darker, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                    <h4 style={{ color: colors.text, margin: '0 0 10px', fontSize: 14, fontWeight: 600 }}><Star size={14} color={colors.accent} style={{ marginRight: 6 }} />{focus.title}</h4>
                    {focus.tips.slice(0, 3).map((tip, j) => (
                      <p key={j} style={{ color: colors.textMuted, margin: '0 0 4px', fontSize: 12 }}>• {tip}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Hydration & Supplements */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: `${colors.primary}10`, borderRadius: 14, padding: 20, border: `1px solid ${colors.primary}30` }}>
                <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}><Droplets size={16} color={colors.primary} style={{ marginRight: 6 }} />Hydration</h4>
                {nutritionPlan.hydration.map((h, i) => (
                  <p key={i} style={{ color: colors.textMuted, margin: '0 0 4px', fontSize: 12 }}>• {h}</p>
                ))}
              </div>
              <div style={{ background: `${colors.secondary}10`, borderRadius: 14, padding: 20, border: `1px solid ${colors.secondary}30` }}>
                <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}><Shield size={16} color={colors.secondary} style={{ marginRight: 6 }} />Supplements</h4>
                {nutritionPlan.supplements.slice(0, 4).map((s, i) => (
                  <p key={i} style={{ color: colors.textMuted, margin: '0 0 4px', fontSize: 12 }}>• {s}</p>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Workout Logs Tab - PT can see client's logged workouts */}
        {tab === 'logs' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h3 style={{ color: colors.text, margin: 0, fontSize: 18, fontWeight: 600 }}>Workout Logs</h3>
                <p style={{ color: colors.textMuted, marginTop: 4, fontSize: 13 }}>{client.name}'s exercise tracking history</p>
              </div>
              <div style={{ background: colors.cardBg, padding: '8px 16px', borderRadius: 10, border: `1px solid ${colors.borderColor}` }}>
                <span style={{ color: colors.textMuted, fontSize: 12 }}>Total Logs: </span>
                <span style={{ color: colors.text, fontWeight: 700 }}>{(client.workoutLogs || []).length}</span>
              </div>
            </div>

            {(!client.workoutLogs || client.workoutLogs.length === 0) ? (
              <div style={{ background: colors.cardBg, borderRadius: 16, padding: 60, textAlign: 'center', border: `1px solid ${colors.borderColor}` }}>
                <FileText size={48} color={colors.textMuted} style={{ marginBottom: 16 }} />
                <h3 style={{ color: colors.text, margin: '0 0 8px' }}>No Workout Logs Yet</h3>
                <p style={{ color: colors.textMuted, margin: 0 }}>Client hasn't logged any workouts. They can track exercises from their Workout tab.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {[...client.workoutLogs].reverse().map((log, i) => {
                  const completedExercises = log.exercises.filter(e => e.completed).length;
                  const totalExercises = log.exercises.length;
                  return (
                    <div key={i} style={{ background: colors.cardBg, borderRadius: 16, border: `1px solid ${colors.borderColor}`, overflow: 'hidden' }}>
                      <div style={{ padding: '16px 20px', background: `${colors.primary}10`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.borderColor}` }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: colors.primary, fontWeight: 700, fontSize: 12 }}>{log.dayName}</span>
                            <span style={{ color: colors.textMuted, fontSize: 12 }}>•</span>
                            <span style={{ color: colors.textMuted, fontSize: 12 }}>{log.date}</span>
                          </div>
                          <h4 style={{ color: colors.text, margin: '4px 0 0', fontSize: 16, fontWeight: 600 }}>{log.workoutName}</h4>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ background: completedExercises === totalExercises ? `${colors.success}20` : `${colors.warning}20`, color: completedExercises === totalExercises ? colors.success : colors.warning, padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                            {completedExercises}/{totalExercises} completed
                          </div>
                        </div>
                      </div>
                      <div style={{ padding: 16 }}>
                        <div style={{ display: 'grid', gap: 10 }}>
                          {log.exercises.map((ex, j) => (
                            <div key={j} style={{ background: ex.completed ? `${colors.success}08` : colors.darker, borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: `3px solid ${ex.completed ? colors.success : colors.borderColor}` }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                {ex.completed ? <Check size={18} color={colors.success} /> : <X size={18} color={colors.textMuted} />}
                                <div>
                                  <p style={{ color: colors.text, margin: 0, fontWeight: 500, fontSize: 14 }}>{ex.name}</p>
                                  {ex.notes && <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 11, fontStyle: 'italic' }}>"{ex.notes}"</p>}
                                </div>
                              </div>
                              {(ex.weight || ex.sets || ex.reps) && (
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                  {ex.weight && <div style={{ textAlign: 'center' }}><p style={{ color: colors.textMuted, margin: 0, fontSize: 9 }}>WEIGHT</p><p style={{ color: colors.text, margin: 0, fontSize: 14, fontWeight: 700 }}>{ex.weight}kg</p></div>}
                                  {ex.sets && <div style={{ textAlign: 'center' }}><p style={{ color: colors.textMuted, margin: 0, fontSize: 9 }}>SETS</p><p style={{ color: colors.text, margin: 0, fontSize: 14, fontWeight: 700 }}>{ex.sets}</p></div>}
                                  {ex.reps && <div style={{ textAlign: 'center' }}><p style={{ color: colors.textMuted, margin: 0, fontSize: 9 }}>REPS</p><p style={{ color: colors.text, margin: 0, fontSize: 14, fontWeight: 700 }}>{ex.reps}</p></div>}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {editingSection && <OnboardingEditor section={editingSection} />}
      </div>
    );
  };

  // ============ PT GROUPS VIEW ============
  const PTGroupsView = () => {
    const [viewingGroup, setViewingGroup] = useState(null);
    const [showAddMember, setShowAddMember] = useState(false);
    const [showRequests, setShowRequests] = useState(false);
    const [addingChallengeToGroup, setAddingChallengeToGroup] = useState(null);
    const [newChallenge, setNewChallenge] = useState({ name: '', description: '', challengeType: 'general', status: 'open', startDate: '', endDate: '', milestones: [] });
    const [newMilestone, setNewMilestone] = useState({ week: '', goal: '', reward: '' });
    
    const challengeTypes = [
      { id: 'general', label: 'General Fitness', icon: '💪' },
      { id: 'walking', label: 'Walking', icon: '🚶' },
      { id: 'running', label: 'Running', icon: '🏃' },
      { id: 'strength', label: 'Strength', icon: '🏋️' },
      { id: 'wellness', label: 'Wellness', icon: '🧘' }
    ];
    
    const pendingRequests = membershipRequests.filter(r => r.status === 'pending');
    
    const addMemberToGroup = (clientId, groupName) => {
      const updated = clients.map(c => c.id === clientId ? { ...c, group: groupName } : c);
      setClients(updated);
      setShowAddMember(false);
    };

    const handleRequest = (requestId, approved) => {
      const request = membershipRequests.find(r => r.id === requestId);
      if (!request) return;
      
      if (approved) {
        if (request.type === 'group') {
          // Add client to group
          const updated = clients.map(c => c.id === request.clientId ? { ...c, group: request.groupName } : c);
          setClients(updated);
        } else if (request.type === 'challenge') {
          // Add client to challenge
          const updatedGroups = groups.map(g => {
            if (g.id === request.groupId) {
              return {
                ...g,
                challenges: g.challenges.map(c => {
                  if (c.id === request.challengeId) {
                    return { ...c, participants: [...(c.participants || []), request.clientId] };
                  }
                  return c;
                })
              };
            }
            return g;
          });
          setGroups(updatedGroups);
        }
      }
      
      // Update request status
      setMembershipRequests(membershipRequests.map(r => r.id === requestId ? { ...r, status: approved ? 'approved' : 'denied' } : r));
    };

    const toggleChallengeStatus = (groupId, challengeId) => {
      setGroups(groups.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            challenges: g.challenges.map(c => c.id === challengeId ? { ...c, status: c.status === 'open' ? 'closed' : 'open' } : c)
          };
        }
        return g;
      }));
    };
    
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div><h1 style={{ color: colors.text, margin: 0, fontSize: 26, fontWeight: 800, fontFamily: 'Outfit' }}>Groups & Challenges</h1><p style={{ color: colors.textMuted, marginTop: 8 }}>Corporate wellness & club activities</p></div>
          <div style={{ display: 'flex', gap: 12 }}>
            {pendingRequests.length > 0 && (
              <button onClick={() => setShowRequests(true)} style={{ padding: '12px 20px', background: `${colors.warning}20`, border: `1px solid ${colors.warning}`, borderRadius: 12, color: colors.warning, fontSize: 14, fontWeight: 600, cursor: 'pointer', position: 'relative' }}>
                <Mail size={18} style={{ marginRight: 8 }} />Requests
                <span style={{ position: 'absolute', top: -8, right: -8, background: colors.danger, color: 'white', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{pendingRequests.length}</span>
              </button>
            )}
            <button onClick={() => setShowNewGroupForm(true)} style={{ padding: '12px 24px', background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, border: 'none', borderRadius: 12, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}><Plus size={18} style={{ marginRight: 8 }} />Add Group</button>
          </div>
        </div>

        {/* Pending Requests Modal */}
        {showRequests && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: colors.cardBg, borderRadius: 20, width: '90%', maxWidth: 500, maxHeight: '80vh', overflow: 'auto', padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ color: colors.text, margin: 0, fontSize: 20, fontWeight: 700 }}>Membership Requests</h2>
                <button onClick={() => setShowRequests(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color={colors.textMuted} /></button>
              </div>
              {pendingRequests.length === 0 ? (
                <p style={{ color: colors.textMuted, textAlign: 'center', padding: 20 }}>No pending requests</p>
              ) : (
                pendingRequests.map(req => {
                  const client = clients.find(c => c.id === req.clientId);
                  return (
                    <div key={req.id} style={{ background: colors.darker, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div>
                          <p style={{ color: colors.text, margin: 0, fontWeight: 600 }}>{client?.name || 'Unknown'}</p>
                          <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12 }}>
                            Wants to join: <span style={{ color: colors.primary }}>{req.type === 'challenge' ? req.challengeName : req.groupName}</span>
                          </p>
                          <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 11 }}>{req.date}</p>
                        </div>
                        <span style={{ background: `${colors.warning}20`, color: colors.warning, padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600 }}>PENDING</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleRequest(req.id, true)} style={{ flex: 1, padding: 10, background: colors.success, border: 'none', borderRadius: 8, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><Check size={14} style={{ marginRight: 4 }} />Approve</button>
                        <button onClick={() => handleRequest(req.id, false)} style={{ flex: 1, padding: 10, background: colors.danger, border: 'none', borderRadius: 8, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><X size={14} style={{ marginRight: 4 }} />Deny</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {groups.length === 0 ? (
          <div style={{ background: colors.cardBg, borderRadius: 16, padding: 60, textAlign: 'center', border: `1px solid ${colors.borderColor}` }}>
            <Flag size={48} color={colors.textMuted} style={{ marginBottom: 16 }} />
            <h3 style={{ color: colors.text, margin: '0 0 8px' }}>No Groups Yet</h3>
            <p style={{ color: colors.textMuted, margin: '0 0 20px' }}>Create a corporate wellness program or club group</p>
            <button onClick={() => setShowNewGroupForm(true)} style={{ padding: '12px 24px', background: colors.primary, border: 'none', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}><Plus size={16} style={{ marginRight: 6 }} />Create First Group</button>
          </div>
        ) : groups.map(g => {
          const groupClients = clients.filter(c => c.group === g.name && c.status === 'active');
          const totalWorkouts = groupClients.reduce((a, c) => a + c.weeklyLogs.reduce((b, l) => b + l.workoutsCompleted, 0), 0);
          const avgCompliance = groupClients.length > 0 ? Math.round(groupClients.reduce((a, c) => a + (c.weeklyLogs.length > 0 ? (c.weeklyLogs.reduce((b, l) => b + l.workoutsCompleted, 0) / (c.weeklyLogs.length * 4)) * 100 : 0), 0) / groupClients.length) : 0;
          const openChallenges = g.challenges?.filter(c => c.status === 'open').length || 0;
          
          return (
            <div key={g.id} style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.borderColor}`, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 60, height: 60, borderRadius: 14, background: g.type === 'corporate' ? `linear-gradient(135deg, ${colors.primary}, ${colors.warning})` : `linear-gradient(135deg, ${colors.secondary}, ${colors.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{g.type === 'corporate' ? <Briefcase size={28} color="white" /> : <Flag size={28} color="white" />}</div>
                  <div>
                    <h3 style={{ color: colors.text, margin: 0, fontSize: 18, fontWeight: 700 }}>{g.name}</h3>
                    <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 13 }}>{g.type === 'corporate' ? 'Corporate' : 'Club'} • Started {g.startDate}</p>
                    {openChallenges > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, background: `${colors.success}15`, padding: '4px 10px', borderRadius: 10, fontSize: 11, color: colors.success, fontWeight: 600 }}><Trophy size={12} />{openChallenges} open challenge{openChallenges > 1 ? 's' : ''}</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}><p style={{ color: colors.textMuted, margin: 0, fontSize: 12 }}>PT Contact</p><p style={{ color: colors.text, margin: '4px 0 0', fontSize: 14, fontWeight: 500 }}>{g.ptContact || loggedInUser?.name}</p></div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
                {[{ l: 'Members', v: groupClients.length, i: Users }, { l: 'Workouts', v: totalWorkouts, i: Dumbbell }, { l: 'Compliance', v: `${avgCompliance}%`, i: Target }, { l: 'Days', v: Math.floor((new Date() - new Date(g.startDate)) / 86400000), i: Calendar }].map((s, i) => (
                  <div key={i} style={{ background: colors.darker, borderRadius: 12, padding: 16, textAlign: 'center' }}><s.i size={20} color={colors.textMuted} style={{ marginBottom: 8 }} /><p style={{ color: colors.text, margin: 0, fontSize: 22, fontWeight: 700 }}>{s.v}</p><p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 11 }}>{s.l}</p></div>
                ))}
              </div>

              {/* Challenges Section */}
              {g.challenges && g.challenges.length > 0 && (
                <div style={{ background: colors.darker, borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}><Trophy size={14} style={{ marginRight: 6 }} />Challenges</h4>
                  {g.challenges.map(challenge => (
                    <div key={challenge.id} style={{ background: colors.cardBg, borderRadius: 10, padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 14 }}>{challenge.name}</p>
                          <button onClick={() => toggleChallengeStatus(g.id, challenge.id)} style={{ background: challenge.status === 'open' ? `${colors.success}20` : `${colors.textMuted}20`, border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: challenge.status === 'open' ? colors.success : colors.textMuted }} />
                            <span style={{ color: challenge.status === 'open' ? colors.success : colors.textMuted, fontSize: 10, fontWeight: 600, textTransform: 'uppercase' }}>{challenge.status}</span>
                          </button>
                        </div>
                        <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12, whiteSpace: 'pre-wrap' }}>{challenge.description}</p>
                        <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 11 }}>{challenge.participants?.length || 0} participants • {challenge.startDate} → {challenge.endDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={() => { setSelectedGroupForReport(g); setShowReportPreview(true); }} style={{ flex: 1, minWidth: 100, padding: 12, background: colors.primary, border: 'none', borderRadius: 10, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><FileText size={16} style={{ marginRight: 6 }} />Report</button>
                <button onClick={() => setViewingGroup(g)} style={{ flex: 1, minWidth: 100, padding: 12, background: 'transparent', border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 13, cursor: 'pointer' }}><Users size={16} style={{ marginRight: 6 }} />View Members</button>
                <button onClick={() => setAddingMemberToGroup(g)} style={{ flex: 1, minWidth: 100, padding: 12, background: `${colors.success}20`, border: `1px solid ${colors.success}`, borderRadius: 10, color: colors.success, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><Plus size={16} style={{ marginRight: 6 }} />Add Member</button>
                <button onClick={() => setAddingChallengeToGroup(g)} style={{ flex: 1, minWidth: 100, padding: 12, background: `${colors.accent}20`, border: `1px solid ${colors.accent}`, borderRadius: 10, color: colors.accent, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><Trophy size={16} style={{ marginRight: 6 }} />Add Challenge</button>
              </div>
            </div>
          );
        })}

        {/* View Members Modal */}
        {viewingGroup && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: colors.cardBg, borderRadius: 20, width: '90%', maxWidth: 550, maxHeight: '80vh', overflow: 'auto', padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h2 style={{ color: colors.text, margin: 0, fontSize: 20, fontWeight: 700 }}>{viewingGroup.name} Members</h2>
                  <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 13 }}>{clients.filter(c => c.group === viewingGroup.name).length} total members</p>
                </div>
                <button onClick={() => setViewingGroup(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color={colors.textMuted} /></button>
              </div>
              
              {clients.filter(c => c.group === viewingGroup.name).length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <Users size={40} color={colors.textMuted} style={{ marginBottom: 12 }} />
                  <p style={{ color: colors.textMuted, margin: 0 }}>No members yet</p>
                  <button onClick={() => { setViewingGroup(null); setAddingMemberToGroup(viewingGroup); }} style={{ marginTop: 16, padding: '10px 20px', background: colors.primary, border: 'none', borderRadius: 8, color: 'white', fontSize: 13, cursor: 'pointer' }}><Plus size={14} style={{ marginRight: 6 }} />Add First Member</button>
                </div>
              ) : (
                clients.filter(c => c.group === viewingGroup.name).map(member => (
                  <div key={member.id} style={{ background: colors.darker, borderRadius: 12, padding: 14, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: 14 }}>{member.name.split(' ').map(n => n[0]).join('')}</div>
                      <div>
                        <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 14 }}>{member.name}</p>
                        <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 12 }}>{member.email}</p>
                        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                          <span style={{ background: member.status === 'active' ? `${colors.success}20` : `${colors.warning}20`, color: member.status === 'active' ? colors.success : colors.warning, padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, textTransform: 'uppercase' }}>{member.status}</span>
                          <span style={{ background: `${colors.secondary}20`, color: colors.secondary, padding: '2px 8px', borderRadius: 6, fontSize: 10, textTransform: 'capitalize' }}>{member.fitnessLevel}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: colors.text, margin: 0, fontSize: 18, fontWeight: 700 }}>{member.weeklyLogs.reduce((a, l) => a + l.workoutsCompleted, 0)}</p>
                      <p style={{ color: colors.textMuted, margin: 0, fontSize: 11 }}>workouts</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Add Member Modal */}
        {addingMemberToGroup && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: colors.cardBg, borderRadius: 20, width: '90%', maxWidth: 500, maxHeight: '80vh', overflow: 'auto', padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h2 style={{ color: colors.text, margin: 0, fontSize: 20, fontWeight: 700 }}>Add Member to {addingMemberToGroup.name}</h2>
                  <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 13 }}>Select a client to add to this group</p>
                </div>
                <button onClick={() => setAddingMemberToGroup(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color={colors.textMuted} /></button>
              </div>
              
              {clients.filter(c => !c.group || c.group !== addingMemberToGroup.name).length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <User size={40} color={colors.textMuted} style={{ marginBottom: 12 }} />
                  <p style={{ color: colors.textMuted, margin: 0 }}>All clients are already in this group or have other groups assigned</p>
                </div>
              ) : (
                clients.filter(c => !c.group || c.group !== addingMemberToGroup.name).map(availableClient => (
                  <div key={availableClient.id} onClick={() => addMemberToGroup(availableClient.id, addingMemberToGroup.name)} style={{ background: colors.darker, borderRadius: 12, padding: 14, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: `1px solid transparent` }} onMouseOver={e => e.currentTarget.style.borderColor = colors.primary} onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: 14 }}>{availableClient.name.split(' ').map(n => n[0]).join('')}</div>
                      <div>
                        <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 14 }}>{availableClient.name}</p>
                        <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 12 }}>{availableClient.group ? `Currently in: ${availableClient.group}` : 'No group assigned'}</p>
                      </div>
                    </div>
                    <Plus size={20} color={colors.primary} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Add Challenge to Group Modal */}
        {addingChallengeToGroup && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
            <div style={{ background: colors.cardBg, borderRadius: 20, width: '100%', maxWidth: 500, maxHeight: '90vh', overflow: 'auto', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h2 style={{ color: colors.text, margin: 0, fontSize: 20, fontWeight: 700 }}>Add Challenge</h2>
                  <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 13 }}>to {addingChallengeToGroup.name}</p>
                </div>
                <button onClick={() => { setAddingChallengeToGroup(null); setNewChallenge({ name: '', description: '', challengeType: 'general', status: 'open', startDate: '', endDate: '', milestones: [] }); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color={colors.textMuted} /></button>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 8 }}>Challenge Name *</label>
                <input value={newChallenge.name} onChange={e => setNewChallenge({...newChallenge, name: e.target.value})} placeholder="e.g. Q1 Fitness Challenge" style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 8 }}>Challenge Type</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {challengeTypes.map(t => (
                    <button key={t.id} onClick={() => setNewChallenge({...newChallenge, challengeType: t.id})} style={{ padding: '8px 14px', background: newChallenge.challengeType === t.id ? `${colors.primary}20` : colors.darker, border: `1px solid ${newChallenge.challengeType === t.id ? colors.primary : colors.borderColor}`, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{t.icon}</span>
                      <span style={{ color: newChallenge.challengeType === t.id ? colors.primary : colors.text, fontSize: 12 }}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 8 }}>Description</label>
                <textarea value={newChallenge.description} onChange={e => setNewChallenge({...newChallenge, description: e.target.value})} placeholder="What's the challenge about?" rows={2} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14, resize: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 8 }}>Start Date *</label>
                  <input type="date" value={newChallenge.startDate} onChange={e => setNewChallenge({...newChallenge, startDate: e.target.value})} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 8 }}>End Date *</label>
                  <input type="date" value={newChallenge.endDate} onChange={e => setNewChallenge({...newChallenge, endDate: e.target.value})} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} />
                </div>
              </div>

              {/* Milestones */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 8 }}>Milestones & Rewards (optional)</label>
                {newChallenge.milestones.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    {newChallenge.milestones.map((m, i) => (
                      <div key={i} style={{ background: colors.darker, padding: 10, borderRadius: 8, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: colors.text, fontSize: 12 }}>Week {m.week}: {m.goal} → 🎁 {m.reward}</span>
                        <button onClick={() => setNewChallenge({...newChallenge, milestones: newChallenge.milestones.filter((_, idx) => idx !== i)})} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={14} color={colors.danger} /></button>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr auto', gap: 6 }}>
                  <input type="number" value={newMilestone.week} onChange={e => setNewMilestone({...newMilestone, week: e.target.value})} placeholder="Wk" style={{ padding: 8, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 6, color: colors.text, fontSize: 12 }} />
                  <input value={newMilestone.goal} onChange={e => setNewMilestone({...newMilestone, goal: e.target.value})} placeholder="Goal (e.g. 10 workouts)" style={{ padding: 8, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 6, color: colors.text, fontSize: 12 }} />
                  <input value={newMilestone.reward} onChange={e => setNewMilestone({...newMilestone, reward: e.target.value})} placeholder="Reward" style={{ padding: 8, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 6, color: colors.text, fontSize: 12 }} />
                  <button onClick={() => { if (newMilestone.week && newMilestone.goal) { setNewChallenge({...newChallenge, milestones: [...newChallenge.milestones, {...newMilestone}]}); setNewMilestone({ week: '', goal: '', reward: '' }); }}} style={{ padding: 8, background: colors.secondary, border: 'none', borderRadius: 6, cursor: 'pointer' }}><Plus size={14} color="white" /></button>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (newChallenge.name && newChallenge.startDate && newChallenge.endDate) {
                    const challenge = { ...newChallenge, id: Date.now(), participants: [] };
                    const updatedGroups = groups.map(g => g.id === addingChallengeToGroup.id ? { ...g, challenges: [...(g.challenges || []), challenge] } : g);
                    setGroups(updatedGroups);
                    setAddingChallengeToGroup(null);
                    setNewChallenge({ name: '', description: '', challengeType: 'general', status: 'open', startDate: '', endDate: '', milestones: [] });
                  }
                }}
                disabled={!newChallenge.name || !newChallenge.startDate || !newChallenge.endDate}
                style={{ width: '100%', padding: 14, background: newChallenge.name && newChallenge.startDate && newChallenge.endDate ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.borderColor, border: 'none', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 600, cursor: newChallenge.name && newChallenge.startDate && newChallenge.endDate ? 'pointer' : 'not-allowed' }}
              >
                <Trophy size={18} style={{ marginRight: 8 }} />Create Challenge
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============ PT REPORTS VIEW ============
  const PTReportsView = () => {
    const [reportType, setReportType] = useState('individual');
    const [selectedClient, setSelectedClientLocal] = useState(null);
    const [selectedGroup, setSelectedGroupLocal] = useState(null);
    const [generatedReport, setGeneratedReport] = useState(null);

    const generateIndividualReport = (client) => {
      if (!client || client.status === 'onboarding') return null;
      const totalWorkouts = client.weeklyLogs.reduce((a, l) => a + l.workoutsCompleted, 0);
      const avgEnergy = client.weeklyLogs.length > 0 ? (client.weeklyLogs.reduce((a, l) => a + l.energy, 0) / client.weeklyLogs.length).toFixed(1) : 0;
      const avgMood = client.weeklyLogs.length > 0 ? (client.weeklyLogs.reduce((a, l) => a + l.mood, 0) / client.weeklyLogs.length).toFixed(1) : 0;
      const compliance = client.weeklyLogs.length > 0 ? Math.round((totalWorkouts / (client.weeklyLogs.length * 4)) * 100) : 0;
      
      const strengthGains = {};
      ['squat', 'deadlift', 'bench'].forEach(lift => {
        const data = client.strengthProgress[lift];
        if (data && data.length >= 2) {
          const first = data[0].weight;
          const last = data[data.length - 1].weight;
          strengthGains[lift] = { start: first, current: last, gain: last - first, percent: Math.round(((last - first) / first) * 100) };
        }
      });

      return {
        type: 'individual',
        client,
        generatedAt: new Date().toLocaleDateString(),
        summary: { totalWorkouts, avgEnergy, avgMood, compliance, weeksActive: client.weeklyLogs.length },
        strengthGains,
        weeklyData: client.weeklyLogs,
        assessmentScores: client.assessmentScores
      };
    };

    const generateGroupReport = (group) => {
      if (!group) return null;
      const groupClients = clients.filter(c => c.group === group.name && c.status === 'active');
      const totalWorkouts = groupClients.reduce((a, c) => a + c.weeklyLogs.reduce((b, l) => b + l.workoutsCompleted, 0), 0);
      const avgCompliance = groupClients.length > 0 ? Math.round(groupClients.reduce((a, c) => a + (c.weeklyLogs.length > 0 ? (c.weeklyLogs.reduce((b, l) => b + l.workoutsCompleted, 0) / (c.weeklyLogs.length * 4)) * 100 : 0), 0) / groupClients.length) : 0;
      
      const leaderboard = groupClients.map(c => ({
        name: c.name,
        workouts: c.weeklyLogs.reduce((a, l) => a + l.workoutsCompleted, 0),
        avgEnergy: c.weeklyLogs.length > 0 ? (c.weeklyLogs.reduce((a, l) => a + l.energy, 0) / c.weeklyLogs.length).toFixed(1) : 0
      })).sort((a, b) => b.workouts - a.workouts);

      // Aggregate weekly data
      const weeklyTotals = {};
      groupClients.forEach(c => {
        c.weeklyLogs.forEach(l => {
          if (!weeklyTotals[l.week]) weeklyTotals[l.week] = { week: l.week, workouts: 0, energy: 0, count: 0 };
          weeklyTotals[l.week].workouts += l.workoutsCompleted;
          weeklyTotals[l.week].energy += l.energy;
          weeklyTotals[l.week].count++;
        });
      });
      const weeklyData = Object.values(weeklyTotals).map(w => ({ ...w, avgEnergy: (w.energy / w.count).toFixed(1) })).sort((a, b) => a.week - b.week);

      return {
        type: 'group',
        group,
        generatedAt: new Date().toLocaleDateString(),
        summary: { totalMembers: groupClients.length, totalWorkouts, avgCompliance, daysActive: Math.floor((new Date() - new Date(group.startDate)) / 86400000) },
        leaderboard,
        weeklyData,
        milestones: group.milestones
      };
    };

    const handleGenerate = () => {
      if (reportType === 'individual' && selectedClient) {
        setGeneratedReport(generateIndividualReport(clients.find(c => c.id === parseInt(selectedClient))));
      } else if (reportType === 'group' && selectedGroup) {
        setGeneratedReport(generateGroupReport(groups.find(g => g.id === parseInt(selectedGroup))));
      }
    };

    return (
      <div>
        <div style={{ marginBottom: isMobile ? 20 : 32 }}><h1 style={{ color: colors.text, margin: 0, fontSize: isMobile ? 22 : 26, fontWeight: 800, fontFamily: 'Outfit' }}>Reports & Analytics</h1><p style={{ color: colors.textMuted, marginTop: 8, fontSize: isMobile ? 12 : 14 }}>Generate progress reports for clients and groups</p></div>
        
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: isMobile ? 16 : 24 }}>
          {/* Report Configuration */}
          <div style={{ background: colors.cardBg, borderRadius: 16, padding: isMobile ? 16 : 24, border: `1px solid ${colors.borderColor}`, height: 'fit-content' }}>
            <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: isMobile ? 14 : 16, fontWeight: 600 }}>Configure Report</h3>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 8 }}>Report Type</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ id: 'individual', label: 'Individual', icon: User }, { id: 'group', label: 'Group', icon: Users }].map(t => (
                  <button key={t.id} onClick={() => { setReportType(t.id); setGeneratedReport(null); }} style={{ flex: 1, padding: isMobile ? 10 : 12, background: reportType === t.id ? `${colors.primary}20` : colors.darker, border: `1px solid ${reportType === t.id ? colors.primary : colors.borderColor}`, borderRadius: 10, color: reportType === t.id ? colors.primary : colors.text, fontSize: isMobile ? 12 : 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><t.icon size={isMobile ? 14 : 16} />{t.label}</button>
                ))}
              </div>
            </div>

            {reportType === 'individual' ? (
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 8 }}>Select Client</label>
                <select value={selectedClient || ''} onChange={e => { setSelectedClientLocal(e.target.value); setGeneratedReport(null); }} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }}>
                  <option value="">Choose a client...</option>
                  {clients.filter(c => c.status === 'active').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {clients.filter(c => c.status === 'active').length === 0 && <p style={{ color: colors.warning, fontSize: 12, marginTop: 8 }}>No active clients. Complete onboarding first.</p>}
              </div>
            ) : (
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 8 }}>Select Group</label>
                <select value={selectedGroup || ''} onChange={e => { setSelectedGroupLocal(e.target.value); setGeneratedReport(null); }} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }}>
                  <option value="">Choose a group...</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                {groups.length === 0 && <p style={{ color: colors.warning, fontSize: 12, marginTop: 8 }}>No groups yet. Create one first.</p>}
              </div>
            )}

            <button onClick={handleGenerate} disabled={(reportType === 'individual' && !selectedClient) || (reportType === 'group' && !selectedGroup)} style={{ width: '100%', padding: 14, background: ((reportType === 'individual' && selectedClient) || (reportType === 'group' && selectedGroup)) ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.borderColor, border: 'none', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 600, cursor: ((reportType === 'individual' && selectedClient) || (reportType === 'group' && selectedGroup)) ? 'pointer' : 'not-allowed' }}><FileText size={18} style={{ marginRight: 8 }} />Generate Report</button>
          </div>

          {/* Report Preview */}
          <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.borderColor}` }}>
            {!generatedReport ? (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <FileText size={48} color={colors.textMuted} style={{ marginBottom: 16 }} />
                <h3 style={{ color: colors.text, margin: '0 0 8px' }}>Report Preview</h3>
                <p style={{ color: colors.textMuted, margin: 0 }}>Select options and generate to see report</p>
              </div>
            ) : generatedReport.type === 'individual' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <h2 style={{ color: colors.text, margin: 0, fontSize: 20, fontWeight: 700 }}>{generatedReport.client.name} - Progress Report</h2>
                    <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 13 }}>Generated {generatedReport.generatedAt} • {generatedReport.summary.weeksActive} weeks of data</p>
                  </div>
                  <button style={{ padding: '10px 16px', background: colors.primary, border: 'none', borderRadius: 8, color: 'white', fontSize: 13, cursor: 'pointer' }}><Download size={14} style={{ marginRight: 6 }} />Export PDF</button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                  {[{ l: 'Workouts', v: generatedReport.summary.totalWorkouts, c: colors.primary }, { l: 'Compliance', v: `${generatedReport.summary.compliance}%`, c: colors.success }, { l: 'Avg Energy', v: generatedReport.summary.avgEnergy, c: colors.accent }, { l: 'Avg Mood', v: generatedReport.summary.avgMood, c: colors.secondary }].map((s, i) => (
                    <div key={i} style={{ background: colors.darker, borderRadius: 10, padding: 14, textAlign: 'center' }}>
                      <p style={{ color: colors.textMuted, margin: 0, fontSize: 11 }}>{s.l}</p>
                      <p style={{ color: s.c, margin: '4px 0 0', fontSize: 24, fontWeight: 700 }}>{s.v}</p>
                    </div>
                  ))}
                </div>

                {generatedReport.weeklyData.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 14 }}>Weekly Progress</h4>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={generatedReport.weeklyData.map(w => ({ name: `W${w.week}`, ...w }))}>
                        <defs><linearGradient id="rptG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/><stop offset="95%" stopColor={colors.primary} stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={colors.borderColor} />
                        <XAxis dataKey="name" stroke={colors.textMuted} fontSize={11} />
                        <YAxis stroke={colors.textMuted} fontSize={11} />
                        <Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8 }} />
                        <Area type="monotone" dataKey="workoutsCompleted" stroke={colors.primary} fill="url(#rptG)" strokeWidth={2} name="Workouts" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {Object.keys(generatedReport.strengthGains).length > 0 && (
                  <div>
                    <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 14 }}>Strength Gains</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                      {Object.entries(generatedReport.strengthGains).map(([lift, data]) => (
                        <div key={lift} style={{ background: colors.darker, borderRadius: 10, padding: 14 }}>
                          <p style={{ color: colors.textMuted, margin: 0, fontSize: 11, textTransform: 'capitalize' }}>{lift}</p>
                          <p style={{ color: colors.text, margin: '4px 0', fontSize: 18, fontWeight: 700 }}>{data.start}kg → {data.current}kg</p>
                          <p style={{ color: colors.success, margin: 0, fontSize: 13, fontWeight: 600 }}>+{data.gain}kg ({data.percent}%)</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <h2 style={{ color: colors.text, margin: 0, fontSize: 20, fontWeight: 700 }}>{generatedReport.group.name} - Group Report</h2>
                    <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 13 }}>Generated {generatedReport.generatedAt} • {generatedReport.summary.daysActive} days active</p>
                  </div>
                  <button style={{ padding: '10px 16px', background: colors.primary, border: 'none', borderRadius: 8, color: 'white', fontSize: 13, cursor: 'pointer' }}><Download size={14} style={{ marginRight: 6 }} />Export PDF</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                  {[{ l: 'Members', v: generatedReport.summary.totalMembers, c: colors.primary }, { l: 'Workouts', v: generatedReport.summary.totalWorkouts, c: colors.secondary }, { l: 'Compliance', v: `${generatedReport.summary.avgCompliance}%`, c: colors.success }, { l: 'Days Active', v: generatedReport.summary.daysActive, c: colors.accent }].map((s, i) => (
                    <div key={i} style={{ background: colors.darker, borderRadius: 10, padding: 14, textAlign: 'center' }}>
                      <p style={{ color: colors.textMuted, margin: 0, fontSize: 11 }}>{s.l}</p>
                      <p style={{ color: s.c, margin: '4px 0 0', fontSize: 24, fontWeight: 700 }}>{s.v}</p>
                    </div>
                  ))}
                </div>

                {generatedReport.weeklyData.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 14 }}>Group Activity</h4>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={generatedReport.weeklyData.map(w => ({ name: `W${w.week}`, ...w }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke={colors.borderColor} />
                        <XAxis dataKey="name" stroke={colors.textMuted} fontSize={11} />
                        <YAxis stroke={colors.textMuted} fontSize={11} />
                        <Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8 }} />
                        <Bar dataKey="workouts" fill={colors.primary} radius={[4, 4, 0, 0]} name="Workouts" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {generatedReport.leaderboard.length > 0 && (
                  <div>
                    <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 14 }}>Leaderboard</h4>
                    {generatedReport.leaderboard.slice(0, 5).map((m, i) => (
                      <div key={i} style={{ background: colors.darker, borderRadius: 8, padding: 12, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? colors.accent : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : colors.borderColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: i < 3 ? colors.dark : colors.text, fontWeight: 700, fontSize: 12 }}>{i + 1}</div>
                          <span style={{ color: colors.text, fontWeight: 500 }}>{m.name}</span>
                        </div>
                        <span style={{ color: colors.primary, fontWeight: 700 }}>{m.workouts} workouts</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ============ PT ASSESSMENTS VIEW ============
  const PTAssessmentsView = () => {
    const [selectedClientForAssessment, setSelectedClientForAssessment] = useState(null);
    const [runningAssessment, setRunningAssessment] = useState(null);
    const [assessmentResults, setAssessmentResults] = useState({});

    const clientForAssessment = selectedClientForAssessment ? clients.find(c => c.id === parseInt(selectedClientForAssessment)) : null;

    const saveAssessmentResults = () => {
      if (!clientForAssessment) return;
      
      const updatedClient = { ...clientForAssessment };
      updatedClient.assessmentScores = {
        movement: assessmentResults.movement || 0,
        cardio: assessmentResults.cardio || 0,
        strength: assessmentResults.strength || 0,
        flexibility: assessmentResults.flexibility || 0,
        balance: assessmentResults.balance || 0
      };
      if (updatedClient.onboardingComplete) {
        updatedClient.onboardingComplete.assessments = true;
      }
      
      // Check if all onboarding complete
      if (updatedClient.status === 'onboarding' && updatedClient.onboardingComplete) {
        const allComplete = Object.values(updatedClient.onboardingComplete).every(Boolean);
        if (allComplete) {
          updatedClient.status = 'active';
          updatedClient.currentWeek = 1;
        }
      }

      setClients(clients.map(c => c.id === clientForAssessment.id ? updatedClient : c));
      setRunningAssessment(null);
      setAssessmentResults({});
      setSelectedClientForAssessment(null);
    };

    const assessmentTypes = [
      { id: 'movement', name: 'Functional Movement Screen (FMS)', desc: '7 movement patterns scored 0-3 each', icon: Activity, color: colors.primary, maxScore: 21, unit: '/21',
        tests: ['Deep Squat', 'Hurdle Step', 'In-line Lunge', 'Shoulder Mobility', 'Active Straight Leg Raise', 'Trunk Stability Push-up', 'Rotary Stability'] },
      { id: 'cardio', name: 'Cardiovascular Fitness', desc: 'Step test or VO2 estimate', icon: Heart, color: colors.danger, maxScore: 100, unit: 'th %ile',
        tests: ['3-minute step test', 'Calculate recovery HR', 'Determine percentile for age/gender'] },
      { id: 'strength', name: 'Strength Baseline', desc: 'Push-ups, squats, plank', icon: Dumbbell, color: colors.accent, maxScore: 100, unit: 'th %ile',
        tests: ['Max push-ups in 1 minute', 'Max bodyweight squats in 1 minute', 'Max plank hold', 'Compare to age/gender norms'] },
      { id: 'flexibility', name: 'Flexibility Assessment', desc: 'Sit-and-reach, shoulder mobility', icon: Activity, color: colors.success, maxScore: 100, unit: 'th %ile',
        tests: ['Sit-and-reach test', 'Shoulder flexibility (hands behind back)', 'Hip flexor length', 'Ankle dorsiflexion'] },
      { id: 'balance', name: 'Balance & Stability', desc: 'Single-leg stance, Y-balance', icon: Target, color: colors.warning, maxScore: 100, unit: 'th %ile',
        tests: ['Single-leg stance (eyes open)', 'Single-leg stance (eyes closed)', 'Y-balance test anterior', 'Y-balance test posterior'] }
    ];

    return (
      <div>
        <div style={{ marginBottom: 32 }}><h1 style={{ color: colors.text, margin: 0, fontSize: 26, fontWeight: 800, fontFamily: 'Outfit' }}>Assessments</h1><p style={{ color: colors.textMuted, marginTop: 8 }}>Run fitness assessments and track client baselines</p></div>
        
        {/* Client Selection */}
        <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.borderColor}`, marginBottom: 24 }}>
          <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Select Client to Assess</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, alignItems: 'end' }}>
            <div>
              <select value={selectedClientForAssessment || ''} onChange={e => { setSelectedClientForAssessment(e.target.value); setAssessmentResults({}); }} style={{ width: '100%', padding: 14, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }}>
                <option value="">Choose a client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name} {c.assessmentScores ? '✓' : c.status === 'onboarding' ? '(onboarding)' : ''}</option>)}
              </select>
            </div>
            {clientForAssessment && (
              <div style={{ background: colors.darker, borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>{clientForAssessment.name.split(' ').map(n => n[0]).join('')}</div>
                <div>
                  <p style={{ color: colors.text, margin: 0, fontWeight: 500, fontSize: 14 }}>{clientForAssessment.name}</p>
                  <p style={{ color: clientForAssessment.assessmentScores ? colors.success : colors.warning, margin: 0, fontSize: 12 }}>{clientForAssessment.assessmentScores ? 'Has assessment data' : 'No assessments yet'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assessment Types */}
        <div style={{ background: `${colors.accent}15`, borderRadius: 12, padding: 16, marginBottom: 24, border: `1px solid ${colors.accent}30`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertTriangle size={24} color={colors.accent} />
          <div><p style={{ color: colors.text, margin: 0, fontWeight: 600 }}>Assessment Protocol</p><p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 13 }}>Complete PAR-Q clearance before physical testing. Allow adequate rest between tests.</p></div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          {assessmentTypes.map(assessment => {
            const hasResult = clientForAssessment?.assessmentScores?.[assessment.id] !== undefined;
            const currentResult = assessmentResults[assessment.id];
            
            return (
              <div key={assessment.id} style={{ background: colors.cardBg, borderRadius: 14, border: `1px solid ${colors.borderColor}`, overflow: 'hidden' }}>
                <div style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${assessment.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <assessment.icon size={24} color={assessment.color} />
                    </div>
                    <div>
                      <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 15 }}>{assessment.name}</p>
                      <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 13 }}>{assessment.desc}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {hasResult && !currentResult && (
                      <div style={{ background: `${colors.success}15`, padding: '6px 12px', borderRadius: 8 }}>
                        <span style={{ color: colors.success, fontWeight: 600 }}>{clientForAssessment.assessmentScores[assessment.id]}{assessment.unit}</span>
                      </div>
                    )}
                    {currentResult !== undefined && (
                      <div style={{ background: `${assessment.color}15`, padding: '6px 12px', borderRadius: 8 }}>
                        <span style={{ color: assessment.color, fontWeight: 600 }}>{currentResult}{assessment.unit}</span>
                      </div>
                    )}
                    <button 
                      onClick={() => setRunningAssessment(runningAssessment === assessment.id ? null : assessment.id)}
                      disabled={!clientForAssessment}
                      style={{ padding: '10px 20px', background: runningAssessment === assessment.id ? colors.darker : clientForAssessment ? assessment.color : colors.borderColor, border: 'none', borderRadius: 8, color: 'white', fontSize: 13, fontWeight: 600, cursor: clientForAssessment ? 'pointer' : 'not-allowed' }}
                    >
                      {runningAssessment === assessment.id ? 'Close' : hasResult ? 'Re-test' : 'Run Test'}
                    </button>
                  </div>
                </div>
                
                {runningAssessment === assessment.id && (
                  <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${colors.borderColor}`, marginTop: 0, paddingTop: 20 }}>
                    <h4 style={{ color: colors.text, margin: '0 0 12px', fontSize: 14 }}>Test Protocol:</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, marginBottom: 16 }}>
                      {assessment.tests.map((test, i) => (
                        <div key={i} style={{ background: colors.darker, borderRadius: 8, padding: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 20, height: 20, borderRadius: '50%', background: assessment.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i + 1}</div>
                          <span style={{ color: colors.text, fontSize: 12 }}>{test}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: colors.darker, borderRadius: 12, padding: 16 }}>
                      <label style={{ color: colors.text, fontWeight: 600, fontSize: 14, display: 'block', marginBottom: 12 }}>
                        Enter Result: <span style={{ color: assessment.color }}>{assessmentResults[assessment.id] || 0}{assessment.unit}</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max={assessment.maxScore} 
                        value={assessmentResults[assessment.id] || 0}
                        onChange={e => setAssessmentResults({...assessmentResults, [assessment.id]: parseInt(e.target.value)})}
                        style={{ width: '100%', accentColor: assessment.color }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ color: colors.textMuted, fontSize: 11 }}>0</span>
                        <span style={{ color: colors.textMuted, fontSize: 11 }}>{assessment.maxScore}{assessment.unit}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Save Button */}
        {clientForAssessment && Object.keys(assessmentResults).length > 0 && (
          <div style={{ marginTop: 24, background: `${colors.success}15`, borderRadius: 14, padding: 20, border: `1px solid ${colors.success}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: colors.text, margin: 0, fontWeight: 600 }}>Ready to Save</p>
              <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 13 }}>{Object.keys(assessmentResults).length} assessment(s) recorded for {clientForAssessment.name}</p>
            </div>
            <button onClick={saveAssessmentResults} style={{ padding: '12px 24px', background: colors.success, border: 'none', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}><Save size={16} style={{ marginRight: 6 }} />Save Results</button>
          </div>
        )}
      </div>
    );
  };

  // ============ NEW CLIENT FORM ============
  const NewClientForm = () => {
    const [form, setForm] = useState({ name: '', email: '', gender: 'female', age: '', height: '', weight: '', fitnessLevel: 'beginner', group: '', selectedChallenges: [] });
    
    const selectedGroup = form.group ? groups.find(g => g.name === form.group) : null;
    const openChallenges = selectedGroup?.challenges?.filter(c => c.status === 'open') || [];

    const toggleChallenge = (challengeId) => {
      if (form.selectedChallenges.includes(challengeId)) {
        setForm({...form, selectedChallenges: form.selectedChallenges.filter(id => id !== challengeId)});
      } else {
        setForm({...form, selectedChallenges: [...form.selectedChallenges, challengeId]});
      }
    };

    const submit = () => {
      const newClientId = clients.length + 1;
      const newClient = {
        ...form,
        id: newClientId,
        age: parseInt(form.age) || null,
        height: parseInt(form.height) || null,
        weight: parseInt(form.weight) || null,
        targetWeight: null,
        status: 'onboarding',
        onboardingComplete: { health: false, lifestyle: false, injuries: false, goals: false, assessments: false },
        bloodPressure: null,
        restingHR: null,
        injuries: [],
        lifestyle: { occupation: '', workType: 'mixed', hoursSeated: 6, sleepHours: 7, stressLevel: 5, waterIntake: 2 }, // Default lifestyle
        goals: [],
        assessmentScores: null,
        startDate: new Date().toISOString().split('T')[0],
        currentWeek: 1,
        isRunner: false,
        useCustomWorkout: false,
        customWorkouts: [],
        weeklyLogs: [],
        strengthProgress: { squat: [], deadlift: [], bench: [] },
        password: 'demo123'
      };
      
      // Add client to selected challenges
      if (selectedGroup && form.selectedChallenges.length > 0) {
        const updatedGroups = groups.map(g => {
          if (g.name === form.group) {
            return {
              ...g,
              challenges: g.challenges.map(c => {
                if (form.selectedChallenges.includes(c.id)) {
                  return { ...c, participants: [...(c.participants || []), newClientId] };
                }
                return c;
              })
            };
          }
          return g;
        });
        setGroups(updatedGroups);
      }
      
      setClients([...clients, newClient]);
      setShowNewClientForm(false);
      setSelectedClient(newClient);
      setCurrentView('client-detail');
    };

    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: isMobile ? 16 : 0 }}>
        <div style={{ background: colors.cardBg, borderRadius: 20, width: isMobile ? '100%' : '90%', maxWidth: 550, maxHeight: '90vh', overflow: 'auto', padding: isMobile ? 20 : 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}><h2 style={{ color: colors.text, margin: 0, fontSize: isMobile ? 18 : 22, fontWeight: 700 }}>New Client</h2><button onClick={() => setShowNewClientForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color={colors.textMuted} /></button></div>
          <p style={{ color: colors.textMuted, marginBottom: 20, fontSize: isMobile ? 12 : 14 }}>Enter basic info. You'll complete their full profile in the onboarding wizard.</p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}><label style={{ color: colors.textMuted, fontSize: 13, display: 'block', marginBottom: 8 }}>Full Name *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Jane Smith" style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} /></div>
            <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}><label style={{ color: colors.textMuted, fontSize: 13, display: 'block', marginBottom: 8 }}>Email *</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="jane@example.com" style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} /></div>
            <div><label style={{ color: colors.textMuted, fontSize: 13, display: 'block', marginBottom: 8 }}>Gender *</label><div style={{ display: 'flex', gap: 12 }}>{['female', 'male'].map(g => <button key={g} onClick={() => setForm({...form, gender: g})} style={{ flex: 1, padding: 12, background: form.gender === g ? colors.primary : colors.darker, border: `1px solid ${form.gender === g ? colors.primary : colors.borderColor}`, borderRadius: 10, color: form.gender === g ? 'white' : colors.text, fontSize: 14, cursor: 'pointer', textTransform: 'capitalize' }}>{g}</button>)}</div></div>
            <div><label style={{ color: colors.textMuted, fontSize: 13, display: 'block', marginBottom: 8 }}>Age</label><input type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} placeholder="Optional" style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} /></div>
            <div><label style={{ color: colors.textMuted, fontSize: 13, display: 'block', marginBottom: 8 }}>Group (Optional)</label><select value={form.group} onChange={e => setForm({...form, group: e.target.value, selectedChallenges: []})} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }}><option value="">None</option>{groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}</select></div>
            <div><label style={{ color: colors.textMuted, fontSize: 13, display: 'block', marginBottom: 8 }}>Fitness Level</label><select value={form.fitnessLevel} onChange={e => setForm({...form, fitnessLevel: e.target.value})} style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div>
          </div>
          
          {/* Open Challenges Section */}
          {selectedGroup && openChallenges.length > 0 && (
            <div style={{ background: `${colors.success}10`, borderRadius: 14, padding: 20, marginBottom: 24, border: `1px solid ${colors.success}30` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Trophy size={20} color={colors.success} />
                <h4 style={{ color: colors.text, margin: 0, fontSize: 15, fontWeight: 600 }}>Join Open Challenges</h4>
                <span style={{ background: colors.success, color: 'white', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{openChallenges.length} available</span>
              </div>
              <p style={{ color: colors.textMuted, fontSize: 12, marginBottom: 12 }}>Enroll this client in active {selectedGroup.name} challenges:</p>
              {openChallenges.map(challenge => (
                <div 
                  key={challenge.id} 
                  onClick={() => toggleChallenge(challenge.id)}
                  style={{ background: form.selectedChallenges.includes(challenge.id) ? `${colors.success}20` : colors.darker, borderRadius: 10, padding: 14, marginBottom: 8, cursor: 'pointer', border: `2px solid ${form.selectedChallenges.includes(challenge.id) ? colors.success : 'transparent'}`, display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: form.selectedChallenges.includes(challenge.id) ? colors.success : colors.borderColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {form.selectedChallenges.includes(challenge.id) && <Check size={14} color="white" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 14 }}>{challenge.name}</p>
                    <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 12, whiteSpace: 'pre-wrap' }}>{challenge.description}</p>
                    <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 11 }}>📅 {challenge.startDate} → {challenge.endDate} • {challenge.participants?.length || 0} enrolled</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedGroup && openChallenges.length === 0 && (
            <div style={{ background: colors.darker, borderRadius: 14, padding: 16, marginBottom: 24, textAlign: 'center' }}>
              <p style={{ color: colors.textMuted, margin: 0, fontSize: 13 }}>No open challenges in {selectedGroup.name} right now</p>
            </div>
          )}
          
          <button onClick={submit} disabled={!form.name || !form.email} style={{ width: '100%', padding: 14, background: form.name && form.email ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.borderColor, border: 'none', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 600, cursor: form.name && form.email ? 'pointer' : 'not-allowed' }}>
            {form.selectedChallenges.length > 0 ? `Create & Join ${form.selectedChallenges.length} Challenge${form.selectedChallenges.length > 1 ? 's' : ''}` : 'Create & Start Onboarding'}
          </button>
        </div>
      </div>
    );
  };

  // ============ NEW GROUP FORM ============
  const NewGroupForm = () => {
    const [form, setForm] = useState({
      name: '',
      type: 'corporate',
      challenges: []
    });
    const [showAddChallenge, setShowAddChallenge] = useState(false);
    const [newChallenge, setNewChallenge] = useState({ name: '', description: '', status: 'open', challengeType: 'general', startDate: '', endDate: '', milestones: [] });
    const [newMilestone, setNewMilestone] = useState({ week: '', goal: '', reward: '' });

    const challengeTypes = [
      { id: 'general', label: 'General Fitness', icon: '💪', desc: 'Complete workouts' },
      { id: 'walking', label: 'Walking', icon: '🚶', desc: 'Step count goals' },
      { id: 'running', label: 'Running', icon: '🏃', desc: 'Distance or pace goals' },
      { id: 'strength', label: 'Strength', icon: '🏋️', desc: 'Strength milestones' },
      { id: 'wellness', label: 'Wellness', icon: '🧘', desc: 'Mindfulness & recovery' }
    ];

    const addMilestone = () => {
      if (newMilestone.week && newMilestone.goal && newMilestone.reward) {
        setNewChallenge({ ...newChallenge, milestones: [...newChallenge.milestones, { ...newMilestone, week: parseInt(newMilestone.week) }] });
        setNewMilestone({ week: '', goal: '', reward: '' });
      }
    };

    const saveChallenge = () => {
      if (newChallenge.name) {
        setForm({ ...form, challenges: [...form.challenges, { ...newChallenge, id: Date.now(), participants: [] }] });
        setNewChallenge({ name: '', description: '', status: 'open', challengeType: 'general', startDate: '', endDate: '', milestones: [] });
        setShowAddChallenge(false);
      }
    };

    const submit = () => {
      const newGroup = {
        id: groups.length + 1,
        name: form.name,
        type: form.type,
        startDate: new Date().toISOString().split('T')[0],
        challenges: form.challenges,
        ptContact: loggedInUser?.name || 'PT'
      };
      setGroups([...groups, newGroup]);
      setShowNewGroupForm(false);
    };

    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <div style={{ background: colors.cardBg, borderRadius: 20, width: '90%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto', padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ color: colors.text, margin: 0, fontSize: 22, fontWeight: 700 }}>Create New Group</h2>
            <button onClick={() => setShowNewGroupForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color={colors.textMuted} /></button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Group Name *</label>
            <input 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              placeholder="e.g. Acme Corp Wellness, City Runners Club" 
              style={{ width: '100%', padding: 12, background: colors.darker, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: 14 }} 
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ color: colors.textMuted, fontSize: 12, display: 'block', marginBottom: 6 }}>Group Type</label>
            <div style={{ display: 'flex', gap: 12 }}>
              {[{ id: 'corporate', label: 'Corporate', icon: Briefcase, desc: 'Company wellness program' }, { id: 'club', label: 'Club', icon: Flag, desc: 'Sports club or community' }].map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setForm({...form, type: t.id})} 
                  style={{ flex: 1, padding: 16, background: form.type === t.id ? `${colors.primary}15` : colors.darker, border: `2px solid ${form.type === t.id ? colors.primary : colors.borderColor}`, borderRadius: 12, cursor: 'pointer', textAlign: 'left' }}
                >
                  <t.icon size={24} color={form.type === t.id ? colors.primary : colors.textMuted} style={{ marginBottom: 8 }} />
                  <p style={{ color: form.type === t.id ? colors.text : colors.textMuted, margin: 0, fontWeight: 600, fontSize: 14 }}>{t.label}</p>
                  <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 11 }}>{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Challenges Section */}
          <div style={{ background: `${colors.secondary}10`, borderRadius: 12, padding: 16, marginBottom: 20, border: `1px solid ${colors.secondary}30` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4 style={{ color: colors.text, margin: 0, fontSize: 14 }}><Trophy size={16} color={colors.secondary} style={{ marginRight: 6 }} />Challenges</h4>
              <button onClick={() => setShowAddChallenge(true)} style={{ padding: '6px 12px', background: colors.secondary, border: 'none', borderRadius: 6, color: 'white', fontSize: 12, cursor: 'pointer' }}><Plus size={12} /> Add</button>
            </div>
            
            {form.challenges.length === 0 ? (
              <p style={{ color: colors.textMuted, fontSize: 13, margin: 0 }}>No challenges yet. Add one to engage your members!</p>
            ) : (
              form.challenges.map((c, i) => (
                <div key={i} style={{ background: colors.darker, borderRadius: 10, padding: 14, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{challengeTypes.find(t => t.id === c.challengeType)?.icon || '💪'}</span>
                    <span style={{ background: c.status === 'open' ? `${colors.success}20` : `${colors.textMuted}20`, color: c.status === 'open' ? colors.success : colors.textMuted, padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, textTransform: 'uppercase' }}>{c.status}</span>
                    <div>
                      <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 13 }}>{c.name}</p>
                      <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 11 }}>{c.description} • {challengeTypes.find(t => t.id === c.challengeType)?.label || 'General'}</p>
                    </div>
                  </div>
                  <button onClick={() => setForm({...form, challenges: form.challenges.filter((_, idx) => idx !== i)})} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={14} color={colors.textMuted} /></button>
                </div>
              ))
            )}
          </div>

          {/* Add Challenge Modal */}
          {showAddChallenge && (
            <div style={{ background: colors.darker, borderRadius: 12, padding: 16, marginBottom: 20, border: `2px solid ${colors.secondary}` }}>
              <h4 style={{ color: colors.text, margin: '0 0 16px', fontSize: 14 }}>New Challenge</h4>
              
              <input value={newChallenge.name} onChange={e => setNewChallenge({...newChallenge, name: e.target.value})} placeholder="Challenge name" style={{ width: '100%', padding: 10, marginBottom: 8, background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.text, fontSize: 13 }} />
              <textarea value={newChallenge.description} onChange={e => setNewChallenge({...newChallenge, description: e.target.value})} placeholder="Description (use Enter for new lines)" style={{ width: '100%', padding: 10, marginBottom: 8, background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.text, fontSize: 13, resize: 'vertical', minHeight: 80 }} />
              
              {/* Challenge Type Selector */}
              <label style={{ color: colors.textMuted, fontSize: 11, display: 'block', marginBottom: 8 }}>Challenge Type</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {challengeTypes.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setNewChallenge({...newChallenge, challengeType: t.id})}
                    style={{ 
                      padding: '8px 12px', 
                      background: newChallenge.challengeType === t.id ? `${colors.secondary}30` : colors.cardBg, 
                      border: `2px solid ${newChallenge.challengeType === t.id ? colors.secondary : colors.borderColor}`, 
                      borderRadius: 8, 
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{t.icon}</span>
                    <span style={{ color: newChallenge.challengeType === t.id ? colors.text : colors.textMuted, fontSize: 12, fontWeight: 500 }}>{t.label}</span>
                  </button>
                ))}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                <div>
                  <label style={{ color: colors.textMuted, fontSize: 10, display: 'block', marginBottom: 4 }}>Status</label>
                  <select value={newChallenge.status} onChange={e => setNewChallenge({...newChallenge, status: e.target.value})} style={{ width: '100%', padding: 8, background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 6, color: colors.text, fontSize: 12 }}>
                    <option value="open">🟢 Open</option>
                    <option value="closed">🔴 Closed</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: colors.textMuted, fontSize: 10, display: 'block', marginBottom: 4 }}>Start Date</label>
                  <input type="date" value={newChallenge.startDate} onChange={e => setNewChallenge({...newChallenge, startDate: e.target.value})} style={{ width: '100%', padding: 8, background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 6, color: colors.text, fontSize: 12 }} />
                </div>
                <div>
                  <label style={{ color: colors.textMuted, fontSize: 10, display: 'block', marginBottom: 4 }}>End Date</label>
                  <input type="date" value={newChallenge.endDate} onChange={e => setNewChallenge({...newChallenge, endDate: e.target.value})} style={{ width: '100%', padding: 8, background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 6, color: colors.text, fontSize: 12 }} />
                </div>
              </div>

              {/* Milestones */}
              <div style={{ background: `${colors.accent}10`, borderRadius: 8, padding: 12, marginBottom: 12 }}>
                <p style={{ color: colors.text, margin: '0 0 8px', fontSize: 12, fontWeight: 600 }}><Star size={12} color={colors.accent} /> Milestones (Optional)</p>
                {newChallenge.milestones.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    {newChallenge.milestones.map((m, i) => (
                      <div key={i} style={{ background: colors.cardBg, borderRadius: 6, padding: 8, marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                        <span style={{ color: colors.text }}>Week {m.week}: {m.goal} → {m.reward}</span>
                        <button onClick={() => setNewChallenge({...newChallenge, milestones: newChallenge.milestones.filter((_, idx) => idx !== i)})} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={12} color={colors.textMuted} /></button>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 1fr auto', gap: 6 }}>
                  <input type="number" value={newMilestone.week} onChange={e => setNewMilestone({...newMilestone, week: e.target.value})} placeholder="Wk" style={{ padding: 6, background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 4, color: colors.text, fontSize: 11 }} />
                  <input value={newMilestone.goal} onChange={e => setNewMilestone({...newMilestone, goal: e.target.value})} placeholder="Goal" style={{ padding: 6, background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 4, color: colors.text, fontSize: 11 }} />
                  <input value={newMilestone.reward} onChange={e => setNewMilestone({...newMilestone, reward: e.target.value})} placeholder="Reward" style={{ padding: 6, background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 4, color: colors.text, fontSize: 11 }} />
                  <button onClick={addMilestone} style={{ padding: '6px 10px', background: colors.accent, border: 'none', borderRadius: 4, color: colors.dark, cursor: 'pointer' }}><Plus size={12} /></button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowAddChallenge(false)} style={{ flex: 1, padding: 10, background: 'transparent', border: `1px solid ${colors.borderColor}`, borderRadius: 8, color: colors.textMuted, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                <button onClick={saveChallenge} disabled={!newChallenge.name} style={{ flex: 1, padding: 10, background: newChallenge.name ? colors.secondary : colors.borderColor, border: 'none', borderRadius: 8, color: 'white', fontSize: 13, cursor: newChallenge.name ? 'pointer' : 'not-allowed' }}>Add Challenge</button>
              </div>
            </div>
          )}

          <button 
            onClick={submit} 
            disabled={!form.name}
            style={{ width: '100%', padding: 14, background: form.name ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.borderColor, border: 'none', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 600, cursor: form.name ? 'pointer' : 'not-allowed' }}
          >
            <Flag size={18} style={{ marginRight: 8 }} />Create Group{form.challenges.length > 0 ? ` with ${form.challenges.length} Challenge${form.challenges.length > 1 ? 's' : ''}` : ''}
          </button>
        </div>
      </div>
    );
  };

  // ============ CORPORATE DASHBOARD ============
  const CorporateDashboard = () => {
    const [corpView, setCorpView] = useState('overview');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const corp = loggedInUser; // The corporate group object
    
    // Get employees belonging to this corporate
    const employees = clients.filter(c => c.group === corp.name);
    
    // Calculate stats
    const totalWorkouts = employees.reduce((sum, e) => sum + e.weeklyLogs.reduce((s, l) => s + l.workoutsCompleted, 0), 0);
    const avgEnergy = employees.length > 0 
      ? (employees.reduce((sum, e) => sum + (e.weeklyLogs.length > 0 ? e.weeklyLogs[e.weeklyLogs.length - 1].energy : 0), 0) / employees.length).toFixed(1)
      : 0;
    const activeEmployees = employees.filter(e => e.weeklyLogs.length > 0 && e.weeklyLogs[e.weeklyLogs.length - 1].workoutsCompleted >= 2).length;
    const openChallenges = corp.challenges?.filter(c => c.status === 'open').length || 0;

    const challengeTypes = [
      { id: 'general', label: 'General Fitness', icon: '💪' },
      { id: 'walking', label: 'Walking', icon: '🚶' },
      { id: 'running', label: 'Running', icon: '🏃' },
      { id: 'strength', label: 'Strength', icon: '🏋️' },
      { id: 'wellness', label: 'Wellness', icon: '🧘' }
    ];

    return (
      <div style={{ minHeight: '100vh', background: colors.dark, fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@700;800&display=swap'); * { box-sizing: border-box; } body { overflow-x: hidden; }`}</style>
        
        {/* Header */}
        <div style={{ background: colors.darker, borderBottom: `1px solid ${colors.borderColor}`, padding: isMobile ? '16px' : '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16 }}>
            <div style={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Briefcase size={isMobile ? 20 : 24} color="white" />
            </div>
            <div>
              <h1 style={{ color: colors.text, margin: 0, fontSize: isMobile ? 16 : 22, fontWeight: 700, fontFamily: 'Outfit' }}>{corp.name}</h1>
              <p style={{ color: colors.textMuted, margin: 0, fontSize: isMobile ? 11 : 13 }}>Corporate Wellness Dashboard</p>
            </div>
          </div>
          <button onClick={() => { setUserType(null); setLoggedInUser(null); setCurrentView('login'); }} style={{ padding: isMobile ? '8px 12px' : '10px 20px', background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 10, color: colors.text, fontSize: isMobile ? 12 : 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <LogOut size={isMobile ? 16 : 18} /> {isMobile ? '' : 'Sign Out'}
          </button>
        </div>

        {/* Navigation */}
        <div style={{ background: colors.darker, padding: isMobile ? '0 16px' : '0 32px', borderBottom: `1px solid ${colors.borderColor}`, overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: isMobile ? 4 : 8 }}>
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              { id: 'employees', label: 'Employees', icon: Users },
              { id: 'challenges', label: 'Challenges', icon: Trophy },
              { id: 'reports', label: 'Reports', icon: BarChart2 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setCorpView(tab.id); setSelectedEmployee(null); }}
                style={{
                  padding: isMobile ? '12px 14px' : '16px 24px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: corpView === tab.id ? `3px solid ${colors.primary}` : '3px solid transparent',
                  color: corpView === tab.id ? colors.text : colors.textMuted,
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: corpView === tab.id ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? 4 : 8,
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <tab.icon size={isMobile ? 16 : 18} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: isMobile ? 16 : 32 }}>
          {corpView === 'overview' && (
            <>
              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 12 : 20, marginBottom: isMobile ? 20 : 32 }}>
                {[
                  { label: 'Total Employees', value: employees.length, icon: Users, color: colors.primary },
                  { label: 'Active This Week', value: activeEmployees, icon: Activity, color: colors.success },
                  { label: 'Total Workouts', value: totalWorkouts, icon: Dumbbell, color: colors.secondary },
                  { label: 'Avg Energy Level', value: avgEnergy, icon: Zap, color: colors.warning }
                ].map((stat, i) => (
                  <div key={i} style={{ background: colors.cardBg, borderRadius: 16, padding: isMobile ? 16 : 24, border: `1px solid ${colors.borderColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ width: isMobile ? 36 : 44, height: isMobile ? 36 : 44, borderRadius: 12, background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <stat.icon size={isMobile ? 18 : 22} color={stat.color} />
                      </div>
                    </div>
                    <p style={{ color: colors.text, margin: 0, fontSize: isMobile ? 24 : 32, fontWeight: 800 }}>{stat.value}</p>
                    <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: isMobile ? 11 : 13 }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Company Info + Active Challenges */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 24 }}>
                <div style={{ background: colors.cardBg, borderRadius: 16, padding: isMobile ? 16 : 24, border: `1px solid ${colors.borderColor}` }}>
                  <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: isMobile ? 14 : 16, fontWeight: 600 }}>Company Information</h3>
                  <div style={{ display: 'grid', gap: 16 }}>
                    <div style={{ background: colors.darker, borderRadius: 10, padding: 14 }}>
                      <p style={{ color: colors.textMuted, margin: 0, fontSize: 12 }}>Industry</p>
                      <p style={{ color: colors.text, margin: '4px 0 0', fontSize: 15, fontWeight: 500 }}>{corp.companyInfo?.industry || 'Technology'}</p>
                    </div>
                    <div style={{ background: colors.darker, borderRadius: 10, padding: 14 }}>
                      <p style={{ color: colors.textMuted, margin: 0, fontSize: 12 }}>PT Contact</p>
                      <p style={{ color: colors.text, margin: '4px 0 0', fontSize: 15, fontWeight: 500 }}>{corp.ptContact}</p>
                    </div>
                    <div style={{ background: colors.darker, borderRadius: 10, padding: 14 }}>
                      <p style={{ color: colors.textMuted, margin: 0, fontSize: 12 }}>Wellness Goal</p>
                      <p style={{ color: colors.text, margin: '4px 0 0', fontSize: 15, fontWeight: 500 }}>{corp.companyInfo?.fitnessGoal || 'Improve employee health'}</p>
                    </div>
                    <div style={{ background: colors.darker, borderRadius: 10, padding: 14 }}>
                      <p style={{ color: colors.textMuted, margin: 0, fontSize: 12 }}>Program Start Date</p>
                      <p style={{ color: colors.text, margin: '4px 0 0', fontSize: 15, fontWeight: 500 }}>{corp.startDate}</p>
                    </div>
                  </div>
                </div>

                <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.borderColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ color: colors.text, margin: 0, fontSize: 16, fontWeight: 600 }}>Active Challenges</h3>
                    <span style={{ background: `${colors.success}20`, color: colors.success, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{openChallenges} Open</span>
                  </div>
                  {corp.challenges?.filter(c => c.status === 'open').length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 30 }}>
                      <Trophy size={32} color={colors.textMuted} style={{ marginBottom: 8 }} />
                      <p style={{ color: colors.textMuted, margin: 0 }}>No active challenges</p>
                    </div>
                  ) : (
                    corp.challenges?.filter(c => c.status === 'open').map((c, i) => (
                      <div key={i} style={{ background: colors.darker, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <span style={{ fontSize: 20 }}>{challengeTypes.find(t => t.id === c.challengeType)?.icon || '💪'}</span>
                          <h4 style={{ color: colors.text, margin: 0, fontSize: 14, fontWeight: 600 }}>{c.name}</h4>
                        </div>
                        <p style={{ color: colors.textMuted, margin: '0 0 8px', fontSize: 12, whiteSpace: 'pre-wrap' }}>{c.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: colors.textMuted, fontSize: 11 }}>{c.participants?.length || 0} participants</span>
                          <span style={{ color: colors.secondary, fontSize: 11 }}>{c.endDate}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Top Performers */}
              <div style={{ background: colors.cardBg, borderRadius: 16, padding: isMobile ? 16 : 24, border: `1px solid ${colors.borderColor}`, marginTop: isMobile ? 16 : 24 }}>
                <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: isMobile ? 14 : 16, fontWeight: 600 }}>🏆 Top Performers This Month</h3>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 12 : 16 }}>
                  {employees
                    .map(e => ({
                      ...e,
                      recentWorkouts: e.weeklyLogs.slice(-4).reduce((s, l) => s + l.workoutsCompleted, 0)
                    }))
                    .sort((a, b) => b.recentWorkouts - a.recentWorkouts)
                    .slice(0, 3)
                    .map((e, i) => (
                      <div key={i} style={{ background: colors.darker, borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: i === 0 ? `linear-gradient(135deg, #FFD700, #FFA500)` : i === 1 ? `linear-gradient(135deg, #C0C0C0, #A0A0A0)` : `linear-gradient(135deg, #CD7F32, #8B4513)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 18 }}>
                          {i + 1}
                        </div>
                        <div>
                          <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 14 }}>{e.name}</p>
                          <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 12 }}>{e.recentWorkouts} workouts (4 weeks)</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}

          {corpView === 'employees' && !selectedEmployee && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? 16 : 24, flexWrap: 'wrap', gap: 8 }}>
                <h2 style={{ color: colors.text, margin: 0, fontSize: isMobile ? 18 : 22, fontWeight: 700 }}>Employee Wellness</h2>
                <div style={{ color: colors.textMuted, fontSize: isMobile ? 12 : 14 }}>{employees.length} enrolled employees</div>
              </div>
              
              {isMobile ? (
                /* Mobile: Card layout */
                <div style={{ display: 'grid', gap: 12 }}>
                  {employees.map((emp, i) => {
                    const lastLog = emp.weeklyLogs[emp.weeklyLogs.length - 1];
                    const totalWk = emp.weeklyLogs.reduce((s, l) => s + l.workoutsCompleted, 0);
                    return (
                      <div key={i} style={{ background: colors.cardBg, borderRadius: 14, padding: 16, border: `1px solid ${colors.borderColor}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: 14 }}>
                              {emp.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p style={{ color: colors.text, margin: 0, fontWeight: 600, fontSize: 14 }}>{emp.name}</p>
                              <p style={{ color: colors.textMuted, margin: 0, fontSize: 11, textTransform: 'capitalize' }}>{emp.fitnessLevel}</p>
                            </div>
                          </div>
                          <span style={{ background: emp.injuries?.some(inj => inj.status === 'managing') ? `${colors.warning}20` : `${colors.success}20`, color: emp.injuries?.some(inj => inj.status === 'managing') ? colors.warning : colors.success, padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600 }}>
                            {emp.injuries?.some(inj => inj.status === 'managing') ? 'Injury' : 'Healthy'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: colors.darker, borderRadius: 10, padding: 12 }}>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ color: colors.textMuted, margin: 0, fontSize: 10 }}>Week</p>
                            <p style={{ color: colors.text, margin: 0, fontSize: 16, fontWeight: 700 }}>{emp.currentWeek}</p>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ color: colors.textMuted, margin: 0, fontSize: 10 }}>Workouts</p>
                            <p style={{ color: colors.text, margin: 0, fontSize: 16, fontWeight: 700 }}>{totalWk}</p>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ color: colors.textMuted, margin: 0, fontSize: 10 }}>Energy</p>
                            <p style={{ color: lastLog?.energy >= 7 ? colors.success : lastLog?.energy >= 5 ? colors.warning : colors.danger, margin: 0, fontSize: 16, fontWeight: 700 }}>{lastLog?.energy || '—'}/10</p>
                          </div>
                          <button onClick={() => setSelectedEmployee(emp)} style={{ padding: '10px 16px', background: colors.primary, border: 'none', borderRadius: 8, color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Desktop: Table layout */
                <div style={{ background: colors.cardBg, borderRadius: 16, overflow: 'hidden', border: `1px solid ${colors.borderColor}` }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px', padding: '14px 20px', background: colors.darker, borderBottom: `1px solid ${colors.borderColor}` }}>
                    <span style={{ color: colors.textMuted, fontSize: 12, fontWeight: 600 }}>EMPLOYEE</span>
                    <span style={{ color: colors.textMuted, fontSize: 12, fontWeight: 600 }}>WEEK</span>
                    <span style={{ color: colors.textMuted, fontSize: 12, fontWeight: 600 }}>WORKOUTS</span>
                    <span style={{ color: colors.textMuted, fontSize: 12, fontWeight: 600 }}>ENERGY</span>
                    <span style={{ color: colors.textMuted, fontSize: 12, fontWeight: 600 }}>STATUS</span>
                    <span style={{ color: colors.textMuted, fontSize: 12, fontWeight: 600 }}></span>
                  </div>
                  {employees.map((emp, i) => {
                    const lastLog = emp.weeklyLogs[emp.weeklyLogs.length - 1];
                    const totalWk = emp.weeklyLogs.reduce((s, l) => s + l.workoutsCompleted, 0);
                    return (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px', padding: '16px 20px', borderBottom: `1px solid ${colors.borderColor}`, alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: 14 }}>
                            {emp.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p style={{ color: colors.text, margin: 0, fontWeight: 500, fontSize: 14 }}>{emp.name}</p>
                            <p style={{ color: colors.textMuted, margin: 0, fontSize: 12 }}>{emp.fitnessLevel}</p>
                          </div>
                        </div>
                        <span style={{ color: colors.text, fontSize: 14 }}>Week {emp.currentWeek}</span>
                        <span style={{ color: colors.text, fontSize: 14 }}>{totalWk} total</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Zap size={14} color={lastLog?.energy >= 7 ? colors.success : lastLog?.energy >= 5 ? colors.warning : colors.danger} />
                          <span style={{ color: colors.text, fontSize: 14 }}>{lastLog?.energy || '—'}/10</span>
                        </div>
                        <span style={{ background: emp.injuries?.some(inj => inj.status === 'managing') ? `${colors.warning}20` : `${colors.success}20`, color: emp.injuries?.some(inj => inj.status === 'managing') ? colors.warning : colors.success, padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                          {emp.injuries?.some(inj => inj.status === 'managing') ? 'Injury' : 'Healthy'}
                        </span>
                        <button onClick={() => setSelectedEmployee(emp)} style={{ padding: '8px 14px', background: colors.primary, border: 'none', borderRadius: 8, color: 'white', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>View</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {corpView === 'employees' && selectedEmployee && (
            <>
              <button onClick={() => setSelectedEmployee(null)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: colors.textMuted, fontSize: 14, cursor: 'pointer', marginBottom: 24 }}>
                <ChevronLeft size={18} /> Back to Employees
              </button>
              
              <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                <div style={{ width: 80, height: 80, borderRadius: 16, background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 28 }}>
                  {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 style={{ color: colors.text, margin: 0, fontSize: 24, fontWeight: 700 }}>{selectedEmployee.name}</h2>
                  <p style={{ color: colors.textMuted, margin: '4px 0', fontSize: 14 }}>{selectedEmployee.email}</p>
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <span style={{ background: `${colors.primary}20`, color: colors.primary, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>Week {selectedEmployee.currentWeek}</span>
                    <span style={{ background: `${colors.secondary}20`, color: colors.secondary, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, textTransform: 'capitalize' }}>{selectedEmployee.fitnessLevel}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 12 : 16, marginBottom: isMobile ? 16 : 24 }}>
                {[
                  { label: 'Total Workouts', value: selectedEmployee.weeklyLogs.reduce((s, l) => s + l.workoutsCompleted, 0), color: colors.primary },
                  { label: 'Current Weight', value: `${selectedEmployee.weight}kg`, color: colors.secondary },
                  { label: 'Target Weight', value: `${selectedEmployee.targetWeight}kg`, color: colors.accent },
                  { label: 'Latest Energy', value: `${selectedEmployee.weeklyLogs[selectedEmployee.weeklyLogs.length - 1]?.energy || 0}/10`, color: colors.success }
                ].map((stat, i) => (
                  <div key={i} style={{ background: colors.cardBg, borderRadius: 12, padding: isMobile ? 14 : 20, border: `1px solid ${colors.borderColor}`, textAlign: 'center' }}>
                    <p style={{ color: colors.text, margin: 0, fontSize: isMobile ? 22 : 28, fontWeight: 700 }}>{stat.value}</p>
                    <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: isMobile ? 10 : 12 }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 24 }}>
                <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.borderColor}` }}>
                  <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Goals</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {selectedEmployee.goals?.map((g, i) => (
                      <span key={i} style={{ background: `${colors.primary}15`, color: colors.text, padding: '8px 14px', borderRadius: 20, fontSize: 13 }}>{g}</span>
                    ))}
                  </div>
                </div>
                <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.borderColor}` }}>
                  <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Injuries</h3>
                  {selectedEmployee.injuries?.length === 0 ? (
                    <div style={{ background: `${colors.success}15`, borderRadius: 10, padding: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Check size={18} color={colors.success} />
                      <span style={{ color: colors.text, fontSize: 14 }}>No current injuries</span>
                    </div>
                  ) : (
                    selectedEmployee.injuries?.map((inj, i) => (
                      <div key={i} style={{ background: inj.status === 'managing' ? `${colors.warning}15` : `${colors.success}15`, borderRadius: 10, padding: 12, marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: colors.text, fontWeight: 500, fontSize: 14 }}>{inj.type}</span>
                          <span style={{ color: inj.status === 'managing' ? colors.warning : colors.success, fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>{inj.status}</span>
                        </div>
                        <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12 }}>{inj.notes}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.borderColor}`, marginTop: 24 }}>
                <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Recent Activity</h3>
                {[...selectedEmployee.weeklyLogs].reverse().slice(0, 5).map((log, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 4 ? `1px solid ${colors.borderColor}` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: colors.darker, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.text, fontWeight: 600, fontSize: 12 }}>W{log.week}</div>
                      <p style={{ color: colors.textMuted, margin: 0, fontSize: 13 }}>{log.notes || 'No notes'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                      <div style={{ textAlign: 'center' }}><p style={{ color: colors.textMuted, margin: 0, fontSize: 10 }}>Workouts</p><p style={{ color: colors.text, margin: 0, fontSize: 16, fontWeight: 600 }}>{log.workoutsCompleted}</p></div>
                      <div style={{ textAlign: 'center' }}><p style={{ color: colors.textMuted, margin: 0, fontSize: 10 }}>Energy</p><p style={{ color: colors.primary, margin: 0, fontSize: 16, fontWeight: 600 }}>{log.energy}</p></div>
                      <div style={{ textAlign: 'center' }}><p style={{ color: colors.textMuted, margin: 0, fontSize: 10 }}>Mood</p><p style={{ color: colors.secondary, margin: 0, fontSize: 16, fontWeight: 600 }}>{log.mood}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {corpView === 'challenges' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ color: colors.text, margin: 0, fontSize: 22, fontWeight: 700 }}>Company Challenges</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {corp.challenges?.map((challenge, i) => (
                  <div key={i} style={{ background: colors.cardBg, borderRadius: 16, overflow: 'hidden', border: `1px solid ${colors.borderColor}` }}>
                    <div style={{ background: `linear-gradient(135deg, ${challenge.status === 'open' ? colors.success : colors.textMuted}30, ${colors.cardBg})`, padding: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 28 }}>{challengeTypes.find(t => t.id === challenge.challengeType)?.icon || '💪'}</span>
                          <div>
                            <h3 style={{ color: colors.text, margin: 0, fontSize: 18, fontWeight: 600 }}>{challenge.name}</h3>
                            <p style={{ color: colors.textMuted, margin: '4px 0 0', fontSize: 12 }}>{challengeTypes.find(t => t.id === challenge.challengeType)?.label || 'General'}</p>
                          </div>
                        </div>
                        <span style={{ background: challenge.status === 'open' ? `${colors.success}20` : `${colors.textMuted}20`, color: challenge.status === 'open' ? colors.success : colors.textMuted, padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>{challenge.status}</span>
                      </div>
                      <p style={{ color: colors.textMuted, margin: 0, fontSize: 13, whiteSpace: 'pre-wrap' }}>{challenge.description}</p>
                    </div>
                    <div style={{ padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div>
                          <p style={{ color: colors.textMuted, margin: 0, fontSize: 11 }}>Duration</p>
                          <p style={{ color: colors.text, margin: '2px 0 0', fontSize: 13 }}>{challenge.startDate} → {challenge.endDate}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ color: colors.textMuted, margin: 0, fontSize: 11 }}>Participants</p>
                          <p style={{ color: colors.text, margin: '2px 0 0', fontSize: 13 }}>{challenge.participants?.length || 0} employees</p>
                        </div>
                      </div>
                      
                      {challenge.milestones?.length > 0 && (
                        <>
                          <p style={{ color: colors.textMuted, margin: '0 0 8px', fontSize: 11 }}>Milestones & Rewards</p>
                          {challenge.milestones.map((m, j) => (
                            <div key={j} style={{ background: colors.darker, borderRadius: 8, padding: 10, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: colors.text, fontSize: 12 }}>Week {m.week}: {m.goal}</span>
                              <span style={{ color: colors.accent, fontSize: 11 }}>🎁 {m.reward}</span>
                            </div>
                          ))}
                        </>
                      )}

                      {challenge.participants?.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                          <p style={{ color: colors.textMuted, margin: '0 0 8px', fontSize: 11 }}>Participating Employees</p>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {challenge.participants.map(pId => {
                              const emp = clients.find(c => c.id === pId);
                              return emp ? (
                                <span key={pId} style={{ background: colors.darker, padding: '6px 12px', borderRadius: 20, color: colors.text, fontSize: 12 }}>{emp.name}</span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {corpView === 'reports' && (
            <>
              <h2 style={{ color: colors.text, margin: '0 0 24px', fontSize: 22, fontWeight: 700 }}>Wellness Reports</h2>
              
              <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, borderRadius: 20, padding: 32, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                <h3 style={{ color: 'white', margin: '0 0 20px', fontSize: 20, fontWeight: 700 }}>📊 Company Wellness Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                  {[
                    { label: 'Total Workouts Completed', value: totalWorkouts },
                    { label: 'Est. Calories Burned', value: `${(totalWorkouts * 350).toLocaleString()}` },
                    { label: 'Avg Workouts/Employee', value: employees.length > 0 ? (totalWorkouts / employees.length).toFixed(1) : 0 },
                    { label: 'Employee Participation', value: `${employees.length > 0 ? Math.round((activeEmployees / employees.length) * 100) : 0}%` }
                  ].map((stat, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                      <p style={{ color: 'white', margin: 0, fontSize: 28, fontWeight: 700 }}>{stat.value}</p>
                      <p style={{ color: 'rgba(255,255,255,0.7)', margin: '4px 0 0', fontSize: 12 }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.borderColor}` }}>
                  <h3 style={{ color: colors.text, margin: '0 0 20px', fontSize: 16, fontWeight: 600 }}>Employee Breakdown by Status</h3>
                  <div style={{ display: 'grid', gap: 12 }}>
                    <div style={{ background: colors.darker, borderRadius: 10, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.success }} />
                        <span style={{ color: colors.text, fontSize: 14 }}>Active (2+ workouts/week)</span>
                      </div>
                      <span style={{ color: colors.text, fontWeight: 700 }}>{activeEmployees}</span>
                    </div>
                    <div style={{ background: colors.darker, borderRadius: 10, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.warning }} />
                        <span style={{ color: colors.text, fontSize: 14 }}>Managing Injury</span>
                      </div>
                      <span style={{ color: colors.text, fontWeight: 700 }}>{employees.filter(e => e.injuries?.some(inj => inj.status === 'managing')).length}</span>
                    </div>
                    <div style={{ background: colors.darker, borderRadius: 10, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.textMuted }} />
                        <span style={{ color: colors.text, fontSize: 14 }}>Less Active</span>
                      </div>
                      <span style={{ color: colors.text, fontWeight: 700 }}>{employees.length - activeEmployees}</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: colors.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${colors.borderColor}` }}>
                  <h3 style={{ color: colors.text, margin: '0 0 20px', fontSize: 16, fontWeight: 600 }}>Fitness Level Distribution</h3>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {['beginner', 'intermediate', 'advanced'].map(level => {
                      const count = employees.filter(e => e.fitnessLevel === level).length;
                      const pct = employees.length > 0 ? (count / employees.length) * 100 : 0;
                      return (
                        <div key={level} style={{ background: colors.darker, borderRadius: 10, padding: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ color: colors.text, fontSize: 14, textTransform: 'capitalize' }}>{level}</span>
                            <span style={{ color: colors.textMuted, fontSize: 13 }}>{count} ({pct.toFixed(0)}%)</span>
                          </div>
                          <div style={{ background: colors.cardBg, borderRadius: 4, height: 8 }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: level === 'beginner' ? colors.secondary : level === 'intermediate' ? colors.primary : colors.success, borderRadius: 4 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // ============ MAIN RENDER ============
  if (currentView === 'login') return <LoginScreen />;
  if (userType === 'client') return <ClientDashboard />;
  if (userType === 'corporate') return <CorporateDashboard />;

  const renderPT = () => {
    if (selectedClient) return <PTClientDetail client={selectedClient} />;
    switch (currentView) {
      case 'dashboard': return <PTDashboardView />;
      case 'clients': return <PTClientsView />;
      case 'groups': return <PTGroupsView />;
      case 'reports': return <PTReportsView />;
      case 'assessments': return <PTAssessmentsView />;
      default: return <PTDashboardView />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.dark, fontFamily: 'Inter, sans-serif', overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@700;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } html, body { overflow-x: hidden; width: 100%; max-width: 100vw; } @media (max-width: 768px) { .responsive-grid-4 { grid-template-columns: repeat(2, 1fr) !important; } .responsive-grid-2 { grid-template-columns: 1fr !important; } }`}</style>
      <PTSidebar />
      <PTMobileHeader />
      <PTMobileMenu />
      <div style={{ marginLeft: isMobile ? 0 : 260, padding: isMobile ? '76px 16px 86px' : 32, overflowX: 'hidden', width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? '100vw' : 'none', boxSizing: 'border-box' }}>
        {selectedClient && <button onClick={() => setSelectedClient(null)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: colors.textMuted, fontSize: 14, cursor: 'pointer', marginBottom: 24 }}>← Back</button>}
        {renderPT()}
      </div>
      <PTMobileNav />
      {showNewClientForm && <NewClientForm />}
      {showNewGroupForm && <NewGroupForm />}
      {selectedExercise && <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />}
    </div>
  );
};

export default FitnessApp;
