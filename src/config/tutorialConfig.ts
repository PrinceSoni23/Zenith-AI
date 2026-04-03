import { PageTutorial } from "@/context/TutorialContext";

/**
 * COMPONENT-FOCUSED TUTORIALS
 * Each step highlights ONE specific component and explains what it does and how to use it.
 * Add data-tutorial="component-name" to HTML elements to make them targetable.
 */

export const dashboardTutorials: Record<string, PageTutorial> = {
  dashboard: {
    pageId: "dashboard",
    pageName: "Dashboard",
    steps: [
      {
        id: "help-intro",
        title: "👋 Welcome! Let's Learn This Dashboard",
        description:
          "I'll guide you through each button and feature on this page. Click NEXT to begin learning what each component does and how to use them!",
        position: "center",
      },
      {
        id: "help-button",
        title: "🆘 Help Button - Your Guide",
        description:
          "This blue button (?) shows tutorials like this one! Click it anytime to learn about the current page. It turns gray when you've completed the tutorial.",
        target: "[data-tutorial='help-button']",
        position: "left",
        highlightPadding: 8,
      },
      {
        id: "level-badge",
        title: "🏆 Level-Up Mode Badge",
        description:
          "This shows you're in Level-Up Mode, where every study action earns XP and points. Your progress is tracked automatically as you study!",
        target: "[data-tutorial='level-badge']",
        position: "left",
        highlightPadding: 8,
      },
      {
        id: "streak-hero",
        title: "🔥 Your Study Streak",
        description:
          "This is your streak counter! It shows consecutive days you've studied. Every 7 days you earn Shield rewards. Keep this burning by studying daily!",
        target: "[data-tutorial='streak-hero']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "power-hour-banner",
        title: "⚡ Power Hour - 2x XP Boost",
        description:
          "When Power Hour is active, you earn 2x XP for 60 minutes! You can lock in your preferred time each month. If active, it will show a countdown here.",
        target: "[data-tutorial='power-hour-banner']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "missions-section",
        title: "✅ Today's Missions - Daily Tasks",
        description:
          "AI creates personalized tasks for you daily based on your subjects. Click on a task to mark it complete and earn XP rewards. Shows color-coded priority levels.",
        target: "[data-tutorial='missions-section']",
        position: "right",
        highlightPadding: 12,
      },
      {
        id: "quick-access",
        title: "🚀 Quick Access Tools",
        description:
          "One-click access to all 11+ AI learning tools like Study Planner, Maths Helper, Questions Generator, Smart Notes, etc. Use these to boost your learning!",
        target: "[data-tutorial='quick-access']",
        position: "left",
        highlightPadding: 12,
      },
      {
        id: "dashboard-end",
        title: "✨ Dashboard Tutorial Complete! 🎉",
        description:
          "You now know the main features. Click any tool above to dive deeper, or come back to this tutorial anytime by clicking the Help button!",
        position: "center",
      },
    ],
  },

  studyPlanner: {
    pageId: "study-planner",
    pageName: "Study Planner",
    steps: [
      {
        id: "intro",
        title: "📅 Welcome to Study Planner",
        description:
          "This tool creates a personalized daily study plan just for you. AI analyzes your subjects, level, and goals to suggest what you should study today. Let's learn how to use it!",
        position: "center",
      },
      {
        id: "generate-button",
        title: "✨ Generate Plan Button",
        description:
          "Click this button to create your AI-powered study plan for today. The AI will suggest tasks with time estimates, helping you focus on what matters most. Try clicking it now!",
        target: "[data-tutorial='generate-plan-button']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "plan-results",
        title: "✅ Complete Your Tasks",
        description:
          "Once you have tasks, click the checkbox next to each one to mark it complete. Completed tasks turn green and contribute to your daily progress bar. Earn XP for each task!",
        target: "[data-tutorial='plan-results']",
        position: "top",
        highlightPadding: 12,
      },
      {
        id: "planner-end",
        title: "🎉 Study Planner Mastered! 🎓",
        description:
          "Now you know how to generate plans and track daily tasks. Use this regularly to stay organized and focused. Each plan is customized for YOUR learning journey!",
        position: "center",
      },
    ],
  },

  smartNotes: {
    pageId: "smart-notes",
    pageName: "Smart Notes",
    steps: [
      {
        id: "intro",
        title: "📝 Smart Notes - AI Note Summarizer",
        description:
          "Paste your notes or upload an image, and our AI immediately creates a concise summary highlighting the most important concepts. Perfect for revision!",
        position: "center",
      },
      {
        id: "input-area",
        title: "📋 Paste or Upload Your Notes",
        description:
          "Enter your notes here - copy-paste from your notebook, or upload an image of handwritten/printed notes. The more detailed, the better the summary!",
        target: "[data-tutorial='input-area']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "summarize-button",
        title: "⚡ Generate Summary",
        description:
          "Click this to let AI analyze your notes and extract key points. It identifies the most important concepts, definitions, and relationships automatically!",
        target: "[data-tutorial='summarize-button']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "summary-output",
        title: "✨ Your AI Summary",
        description:
          "This is your smart summary! It shows bullet points of key concepts. Use this for quick revision before exams. Copy it or save it to your notes!",
        target: "[data-tutorial='output']",
        position: "top",
        highlightPadding: 12,
      },
      {
        id: "notes-end",
        title: "🎉 Smart Notes Tutorial Done! ✅",
        description:
          "You can now quickly summarize any notes into bite-sized chunks. Save time on studying and focus on understanding concepts!",
        position: "center",
      },
    ],
  },

  mathsHelper: {
    pageId: "maths-helper",
    pageName: "Maths Helper",
    steps: [
      {
        id: "intro",
        title: "🧮 Maths Helper - Your AI Tutor",
        description:
          "Stuck on a math problem? Upload a photo of the problem or type it out, and get step-by-step solutions with clear explanations!",
        position: "center",
      },
      {
        id: "problem-input",
        title: "📸 Input Your Problem",
        description:
          "Type your math problem or upload an image. Include all details like equations, diagrams, or given values. Be specific for better solutions!",
        target: "[data-tutorial='problem-input']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "solve-button",
        title: "🚀 Solve Problem",
        description:
          "Click to get an instant solution. The AI breaks it down into clear steps so you understand HOW to solve it, not just the answer!",
        target: "[data-tutorial='solve-button']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "solution-output",
        title: "📖 Step-by-Step Solution",
        description:
          "Each step is explained clearly with the reasoning behind it. Read carefully to learn the concept, then try a similar problem yourself!",
        target: "[data-tutorial='solution']",
        position: "top",
        highlightPadding: 12,
      },
      {
        id: "maths-end",
        title: "🎉 Maths Helper Unlocked! 🔓",
        description:
          "Never get stuck on math again! Use this whenever you need help. Try to understand the steps, then apply them to practice more problems!",
        position: "center",
      },
    ],
  },

  questionGenerator: {
    pageId: "question-generator",
    pageName: "Question Generator",
    steps: [
      {
        id: "intro",
        title: "📚 Question Generator - Test Yourself",
        description:
          "Enter any subject and topic to get AI-generated practice questions at different difficulty levels. Perfect for self-testing and exam prep!",
        position: "center",
      },
      {
        id: "subject-input",
        title: "📖 Enter Subject",
        description:
          "Type your subject here (e.g., 'Biology', 'History', 'Algebra'). Be specific so the AI generates relevant questions for that topic.",
        target: "[data-tutorial='subject-input']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "topic-input",
        title: "🎯 Enter Topic",
        description:
          "Specify what topic within that subject (e.g., 'Photosynthesis', 'World War 2', 'Quadratic Equations'). This helps AI focus on exactly what you need!",
        target: "[data-tutorial='topic-input']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "difficulty-select",
        title: "⭐ Choose Difficulty Level",
        description:
          "Select from Easy, Medium, Hard, or Thinking level. Start with Easy to build basics, then progress to harder questions to challenge yourself!",
        target: "[data-tutorial='difficulty-select']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "generate-questions",
        title: "⚡ Generate Questions",
        description:
          "Click to get AI-generated practice questions. You'll get multiple choice and short-answer questions with explanations for correct answers.",
        target: "[data-tutorial='generate-questions']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "qgen-end",
        title: "✅ Question Generator Ready! 🎓",
        description:
          "Now you can generate unlimited practice questions for any subject. Test yourself regularly to improve your understanding and exam readiness!",
        position: "center",
      },
    ],
  },

  leaderboard: {
    pageId: "leaderboard",
    pageName: "Leaderboard",
    steps: [
      {
        id: "intro",
        title: "🏆 Leaderboard - Compete & Motivate",
        description:
          "See how you rank against classmates this week. The leaderboard updates every week and shows top performers. Push yourself to climb higher!",
        position: "center",
      },
      {
        id: "your-rank",
        title: "📊 Your Current Rank",
        description:
          "This shows YOUR position on the leaderboard this week. Your weekly score determines your rank. Study more to earn points and climb up!",
        target: "[data-tutorial='your-rank']",
        position: "right",
        highlightPadding: 12,
      },
      {
        id: "top-performers",
        title: "👑 Top Performers",
        description:
          "See who's leading the leaderboard this week. Learn from their study patterns and set personal goals to join the top ranks!",
        target: "[data-tutorial='top-performers']",
        position: "left",
        highlightPadding: 12,
      },
      {
        id: "student-list",
        title: "📋 Full Student Rankings",
        description:
          "View everyone's scores and rankings. Find friends on the list and compete with them! Points update with every achievement you complete.",
        target: "[data-tutorial='student-list']",
        position: "top",
        highlightPadding: 12,
      },
      {
        id: "leaderboard-end",
        title: "✨ Leaderboard Explored! 🚀",
        description:
          "You know how to track your progress and compete! Remember: consistency beats intensity. Study a little every day to climb the ranks!",
        position: "center",
      },
    ],
  },

  powerHour: {
    pageId: "power-hour",
    pageName: "Power Hour",
    steps: [
      {
        id: "intro",
        title: "⚡ Power Hour - 2x XP Boost Time",
        description:
          "Power Hour gives you 2x XP for 60 minutes! You can choose when to use it each month. This page shows your Power Hour status and settings.",
        position: "center",
      },
      {
        id: "power-status",
        title: "📊 Power Hour Status",
        description:
          "This shows whether Power Hour is currently active or when it will activate next. When active, all your study earns 2x XP for the next 60 minutes!",
        target: "[data-tutorial='power-status']",
        position: "right",
        highlightPadding: 12,
      },
      {
        id: "time-selector",
        title: "⏰ Choose Your Time",
        description:
          "Pick a specific time slot for your Power Hour. You can choose your preferred hour of the day when you study best. Change it anytime!",
        target: "[data-tutorial='time-selector']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "confirm-button",
        title: "✅ Confirm Time",
        description:
          "Click to lock in your Power Hour time. Once confirmed, you'll get a reminder at that time to start studying and maximize your XP gains!",
        target: "[data-tutorial='confirm-button']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "ph-end",
        title: "🎉 Power Hour Ready! ⚡",
        description:
          "Now you know how to set up your Power Hour. Use it wisely to boost your XP when studying important topics!",
        position: "center",
      },
    ],
  },

  revision: {
    pageId: "revision",
    pageName: "Revision",
    steps: [
      {
        id: "intro",
        title: "📚 Revision - Deep Dive Learning",
        description:
          "This tool helps you deeply study specific topics. It creates revision notes, flashcards, and practice problems to reinforce learning!",
        position: "center",
      },
      {
        id: "topic-selector",
        title: "🎯 Select Topic to Revise",
        description:
          "Choose a subject and specific topic you want to study deeply. The system will generate comprehensive study materials for that topic.",
        target: "[data-tutorial='topic-selector']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "study-materials",
        title: "📖 Study Materials",
        description:
          "Here are your study notes and flashcards for this topic. Read through carefully and understand the concepts deeply.",
        target: "[data-tutorial='study-materials']",
        position: "top",
        highlightPadding: 12,
      },
      {
        id: "practice-problems",
        title: "✏️ Practice Problems",
        description:
          "Test your understanding by completing these practice problems. Try solving without looking at notes first, then check your answers.",
        target: "[data-tutorial='practice-problems']",
        position: "top",
        highlightPadding: 12,
      },
      {
        id: "revision-end",
        title: "✅ Deep Learning Started! 🎓",
        description:
          "Regular revision with these tools will significantly boost your understanding and exam performance. Make revision a daily habit!",
        position: "center",
      },
    ],
  },

  classTranslator: {
    pageId: "class-translator",
    pageName: "Class Translator",
    steps: [
      {
        id: "intro",
        title: "🌍 Class Translator - Learn in Your Language",
        description:
          "Enter complex concepts in any language, and get clear, simplified explanations in your preferred language. Perfect for understanding difficult topics!",
        position: "center",
      },
      {
        id: "concept-input",
        title: "💭 Enter Complex Concept",
        description:
          "Paste a difficult concept, formula, or theory you're struggling with. Type it exactly as it appears in your textbook or class notes.",
        target: "[data-tutorial='concept-input']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "language-select",
        title: "🌐 Choose Language",
        description:
          "Select your preferred language for the explanation. The AI will simplify and translate the concept to make it easy to understand!",
        target: "[data-tutorial='language-select']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "explanation",
        title: "✨ Your Simplified Explanation",
        description:
          "Here's the concept explained in simple terms in your language! Save this for future reference or share it with classmates who need help.",
        target: "[data-tutorial='explanation']",
        position: "top",
        highlightPadding: 12,
      },
      {
        id: "translator-end",
        title: "🎉 Translator Ready! 🗣️",
        description:
          "No more struggling with language barriers in learning! Use this anytime a concept is too complex to understand.",
        position: "center",
      },
    ],
  },

  writingCoach: {
    pageId: "writing-coach",
    pageName: "Writing Coach",
    steps: [
      {
        id: "intro",
        title: "✍️ Writing Coach - Improve Your Writing",
        description:
          "Get AI feedback on your essays, assignments, and writing. Improve grammar, clarity, structure, and style with detailed suggestions!",
        position: "center",
      },
      {
        id: "writing-input",
        title: "📝 Paste Your Writing",
        description:
          "Enter the text you want feedback on - essays, essays, creative writing, or assignments. The more you paste, the better the analysis!",
        target: "[data-tutorial='writing-input']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "analyze-button",
        title: "🔍 Analyze Writing",
        description:
          "Click to get comprehensive feedback. The AI checks grammar, structure, clarity, vocabulary, and overall quality.",
        target: "[data-tutorial='analyze-button']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "feedback-output",
        title: "💡 Detailed Feedback",
        description:
          "Review the AI's suggestions for improvement. Understand what you did well and what to work on for better writing!",
        target: "[data-tutorial='feedback-output']",
        position: "top",
        highlightPadding: 12,
      },
      {
        id: "coach-end",
        title: "✅ Writing Coach Ready! 📚",
        description:
          "Use this regularly to improve your writing skills. Better writing = better grades! Apply the feedback to your next assignment.",
        position: "center",
      },
    ],
  },

  profile: {
    pageId: "profile",
    pageName: "Profile",
    steps: [
      {
        id: "intro",
        title: "👤 Your Profile - Track Your Progress",
        description:
          "Your profile shows all your achievements, statistics, and learning progress. See how far you've come in your learning journey!",
        position: "center",
      },
      {
        id: "account-info",
        title: "📋 Account Information",
        description:
          "Your basic profile information is here - name, email, grade level, and subjects. Keeps your profile up to date!",
        target: "[data-tutorial='account-info']",
        position: "right",
        highlightPadding: 12,
      },
      {
        id: "learning-stats",
        title: "📊 Learning Statistics",
        description:
          "Track your total study hours, daily streaks, XP earned, and progress across all subjects. Watch these numbers grow!",
        target: "[data-tutorial='learning-stats']",
        position: "left",
        highlightPadding: 12,
      },
      {
        id: "achievements",
        title: "🏆 Your Achievements",
        description:
          "All the badges and milestones you've earned are displayed here. Unlock more badges by completing challenges and studying regularly!",
        target: "[data-tutorial='achievements']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "settings",
        title: "⚙️ Account Settings",
        description:
          "Customize your profile here - privacy settings, notification preferences, language, and more. Make the app work for YOU!",
        target: "[data-tutorial='settings']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "profile-end",
        title: "✨ Profile Explored! 🌟",
        description:
          "Your profile is your achievement showcase! Keep studying to earn more badges and climb the ranks. Come back often to celebrate your progress!",
        position: "center",
      },
    ],
  },

  mentor: {
    pageId: "mentor",
    pageName: "AI Mentor",
    steps: [
      {
        id: "intro",
        title: "🤖 AI Mentor - Your Personalized Tutor",
        description:
          "Chat with your AI mentor anytime for help with concepts, problem-solving, exam prep, or motivation. Available 24/7!",
        position: "center",
      },
      {
        id: "chat-input",
        title: "💬 Type Your Question",
        description:
          "Enter any question about your studies. Ask for concept explanations, problem solutions, or study advice. Be specific for better answers!",
        target: "[data-tutorial='chat-input']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "send-button",
        title: "✉️ Send Message",
        description:
          "Click to send your question to the AI mentor. Wait a moment for the personalized response!",
        target: "[data-tutorial='send-button']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "chat-history",
        title: "📜 Conversation History",
        description:
          "Your previous questions and answers are saved here. Review past conversations or continue a topic discussion!",
        target: "[data-tutorial='chat-history']",
        position: "top",
        highlightPadding: 12,
      },
      {
        id: "mentor-end",
        title: "🎉 Mentor Ready to Help! 🚀",
        description:
          "Never study alone! Your AI mentor is here 24/7 to answer questions and guide your learning journey!",
        position: "center",
      },
    ],
  },

  storyMode: {
    pageId: "story-mode",
    pageName: "Story Mode",
    steps: [
      {
        id: "intro",
        title: "📖 Story Mode - Learning Through Stories",
        description:
          "Convert any boring concept into an engaging story! Learn faster by connecting concepts to interesting narratives!",
        position: "center",
      },
      {
        id: "subject-select",
        title: "📚 Select Subject",
        description:
          "Choose a subject you want to learn about. This helps the AI create relevant and engaging stories for that topic.",
        target: "[data-tutorial='subject-select']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "topic-enter",
        title: "🎯 Enter Topic to Storytify",
        description:
          "Type the specific concept or topic you want to learn. The AI will convert it into an engaging story with examples!",
        target: "[data-tutorial='topic-enter']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "generate-story",
        title: "✨ Generate Story",
        description:
          "Click to create an engaging story version of your topic. The AI makes complex concepts memorable through storytelling!",
        target: "[data-tutorial='generate-story']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "story-end",
        title: "🎉 Story Mode Unlocked! 📖",
        description:
          "Stories help us remember better! Use this to make difficult topics fun and easy to understand. Share stories with friends!",
        position: "center",
      },
    ],
  },

  monitoring: {
    pageId: "monitoring",
    pageName: "Monitoring",
    steps: [
      {
        id: "intro",
        title: "🔧 System Monitoring - Behind the Scenes",
        description:
          "This page shows system performance, request tracking, and API health. It helps us keep the app running smoothly for everyone!",
        position: "center",
      },
      {
        id: "request-tracker",
        title: "📊 Request Tracker",
        description:
          "See incoming requests, response times, and API performance. This helps us monitor if everything is running fast and smooth!",
        target: "[data-tutorial='request-tracker']",
        position: "right",
        highlightPadding: 12,
      },
      {
        id: "cache-monitor",
        title: "💾 Cache Monitor",
        description:
          "Monitor cached data and hit rates. Good caching means faster app performance for everyone using the platform!",
        target: "[data-tutorial='cache-monitor']",
        position: "right",
        highlightPadding: 12,
      },
      {
        id: "redis-stats",
        title: "🔴 Redis Statistics",
        description:
          "See Redis server performance, memory usage, and key statistics. This helps us maintain optimal performance for all users.",
        target: "[data-tutorial='redis-stats']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "monitoring-end",
        title: "✅ System Monitoring Explained! 🔧",
        description:
          "This tool helps us keep the system fast and reliable. Regular monitoring ensures everyone has a smooth learning experience!",
        position: "center",
      },
    ],
  },
};
