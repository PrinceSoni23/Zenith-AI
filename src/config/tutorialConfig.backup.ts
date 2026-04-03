import { PageTutorial } from "@/context/TutorialContext";

/**
 * COMPONENT-FOCUSED TUTORIALS
 * Each step highlights ONE specific component and explains:
 * - What it is (title with emoji)
 * - What it does (description)
 * - How to use it (actionable instructions)
 * 
 * Add data-tutorial="component-name" to HTML elements for targeting
 */

export const dashboardTutorials: Record<string, PageTutorial> = {
  dashboard: {
    pageId: "dashboard",
    pageName: "Dashboard",
    steps: [
      {
        id: "help-intro",
        title: "Welcome! Let's Learn This Dashboard 👋",
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
        id: "streakHero",
        title: "🔥 Your Study Streak",
        description:
          "This is your streak counter! It shows consecutive days you've studied. Every 7 days you earn Shield rewards. Keep this burning by studying daily!",
        target: "[data-tutorial='streak-hero']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "powerHourBanner",
        title: "⚡ Power Hour - 2x XP Boost",
        description:
          "When Power Hour is active, you earn 2x XP for 60 minutes! You can lock in your preferred time each month. If active, it will show a countdown here.",
        target: "[data-tutorial='power-hour-banner']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "missionsSection",
        title: "✅ Today's Missions - Daily Tasks",
        description:
          "AI creates personalized tasks for you daily based on your subjects. Click on a task to mark it complete and earn XP rewards. Shows color-coded priority levels.",
        target: "[data-tutorial='missions-section']",
        position: "right",
        highlightPadding: 12,
      },
      {
        id: "quickAccess",
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
        title: "Welcome to Study Planner! 📅",
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
          "Once you have tasks, click the checkbox ☐ next to each one to mark it complete. Completed tasks turn green and contribute to your daily progress bar. Earn XP for each task!",
        target: "[data-tutorial='plan-results']",
        position: "top",
        highlightPadding: 12,
      },
      {
        id: "study-planner-end",
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
        title: "Smart Notes - AI Note Summarizer 📝",
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
        id: "output",
        title: "✨ Your AI Summary",
        description:
          "This is your smart summary! It shows bullet points of key concepts. Use this for quick revision before exams. Copy it or save it to your notes!",
        target: "[data-tutorial='output']",
        position: "top",
        highlightPadding: 12,
      },
      {
        id: "smart-notes-end",
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
        title: "Maths Helper - Your AI Tutor 🧮",
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
        id: "solution",
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
        title: "Question Generator - Test Yourself 📚",
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
        title: "Leaderboard - Compete & Motivate 🏆",
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
        id: "top-students",
        title: "👑 Top Performers",
        description:
          "See the students at the top! #1 gets a Gold medal 🥇, #2 gets Silver 🥈, #3 gets Bronze 🥉. These badges showcase their amazing performance!",
        target: "[data-tutorial='top-students']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "student-list",
        title: "📈 Full Rankings List",
        description:
          "Scroll to see all students' ranks, scores, and streaks. You can see who's doing well and use it as motivation to improve your own performance!",
        target: "[data-tutorial='student-list']",
        position: "top",
        highlightPadding: 12,
      },
      {
        id: "leaderboard-end",
        title: "🎉 Leaderboard Explained! 🏅",
        description:
          "Use this to track your progress weekly. Compete fairly, build healthy habits, and celebrate everyone's hard work! Good luck climbing to #1!",
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
        title: "Power Hour - Boost Your XP! ⚡",
        description:
          "Power Hour is an exclusive feature where you get 2x XP multiplier for 60 minutes. Use it strategically to rank up faster!",
        position: "center",
      },
      {
        id: "status",
        title: "📊 Current Status",
        description:
          "See if Power Hour is active, when it ends, or if you haven't activated it yet this month. The countdown shows remaining time if active!",
        target: "[data-tutorial='status']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "time-selector",
        title: "🕐 Lock In Your Time",
        description:
          "Choose what time you want Power Hour to activate. You can only lock it once per month! Choose a time when you'll be studying actively.",
        target: "[data-tutorial='time-selector']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "confirm-button",
        title: "✅ Confirm & Lock",
        description:
          "Click to lock in your chosen time. Once locked, Power Hour will automatically activate at that time every day for the rest of the month!",
        target: "[data-tutorial='confirm-button']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "power-hour-end",
        title: "🚀 Power Hour Activated! 💪",
        description:
          "You're all set! When Power Hour is active, all your study actions earn 2x XP. Use it wisely and watch your level skyrocket!",
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
        title: "Revision - Master Your Topics 🎓",
        description:
          "This tool helps you revise specific topics systematically. Choose a topic, practice questions, and see your progress improve over time!",
        position: "center",
      },
      {
        id: "topic-selector",
        title: "📚 Select Topic to Revise",
        description:
          "Pick a topic you want to revise. The system will create revision material, practice questions, and mock tests to help you master it!",
        target: "[data-tutorial='topic-selector']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "materials",
        title: "📖 Revision Materials",
        description:
          "This section shows notes, key points, and important concepts for your chosen topic. Study these carefully before attempting questions!",
        target: "[data-tutorial='materials']",
        position: "top",
        highlightPadding: 12,
      },
      {
        id: "practice-button",
        title: "✍️ Practice Questions",
        description:
          "Test your understanding with practice questions. Try to answer WITHOUT looking back at the materials first - that's how you learn best!",
        target: "[data-tutorial='practice-button']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "revision-end",
        title: "✅ Revision Ready! 📝",
        description:
          "Revise topics regularly using this tool. Consistent revision helps convert short-term memory to long-term knowledge. You've got this!",
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
        title: "Class Translator - Simplify Concepts 🧠",
        description:
          "Struggling to understand a concept from class? Paste it here and get a simple, easy-to-understand explanation with real-life examples!",
        position: "center",
      },
      {
        id: "concept-input",
        title: "💡 Paste Your Concept",
        description:
          "Paste the confusing concept from your textbook, lecture notes, or class materials. Be as detailed as possible for better explanations!",
        target: "[data-tutorial='concept-input']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "language-select",
        title: "🌐 Choose Language",
        description:
          "Select English for detailed explanations, or Hinglish for easier Hindi-English mix. Choose whatever helps you understand better!",
        target: "[data-tutorial='language-select']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "explain-button",
        title: "⚡ Get Explanation",
        description:
          "Click to get AI to translate complex concepts into simple, understandable language with real-life examples and analogies!",
        target: "[data-tutorial='explain-button']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "translator-end",
        title: "✨ No More Confusion! 🎯",
        description:
          "Now you can understand any complex concept. Use this before exams to clarify confusing topics. Knowledge made simple!",
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
        title: "Writing Coach - Improve Your Writing ✍️",
        description:
          "Paste any essay, answer, or letter, and get AI feedback on grammar, clarity, and structure. Become a better writer instantly!",
        position: "center",
      },
      {
        id: "writing-input",
        title: "📝 Paste Your Writing",
        description:
          "Paste your essay, exam answer, letter, or any writing. The AI will analyze it for grammar, spelling, structure, and clarity issues.",
        target: "[data-tutorial='writing-input']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "analyze-button",
        title: "🔍 Analyze Writing",
        description:
          "Click to get detailed feedback. You'll see grammar corrections, suggestions for better phrasing, and tips for improving clarity!",
        target: "[data-tutorial='analyze-button']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "feedback",
        title: "✅ Feedback & Corrections",
        description:
          "Review the AI's feedback carefully. Each correction shows what was wrong and why. Use these suggestions to rewrite and improve!",
        target: "[data-tutorial='feedback']",
        position: "top",
        highlightPadding: 12,
      },
      {
        id: "writing-coach-end",
        title: "🎉 Writing Skills Leveled Up! 📚",
        description:
          "Use this tool before submitting any important writing. With practice and feedback, your writing will improve significantly!",
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
        title: "Your Profile - Customize Your Learning 👤",
        description:
          "Here's where you manage your personal info, learning preferences, and track your achievements. Let's explore each section!",
        position: "center",
      },
      {
        id: "account-info",
        title: "👤 Account Information",
        description:
          "View your name and email. This is connected to your login. Keep it accurate so you don't lose access to your account!",
        target: "[data-tutorial='account-info']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "learning-settings",
        title: "⚙️ Learning Settings",
        description:
          "Configure your class level, board, subjects, and learning style. These help AI personalize recommendations and plans just for you!",
        target: "[data-tutorial='learning-settings']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "achievements",
        title: "🏆 Badges & Achievements",
        description:
          "See all the badges and achievements you've earned! Each badge represents a milestone. Keep grinding to unlock more!",
        target: "[data-tutorial='achievements']",
        position: "top",
        highlightPadding: 12,
      },
      {
        id: "stats",
        title: "📊 Your Statistics",
        description:
          "View your total study minutes, current streak, level, and ranking. This is YOUR progress dashboard. See how far you've come!",
        target: "[data-tutorial='stats']",
        position: "top",
        highlightPadding: 12,
      },
      {
        id: "profile-end",
        title: "✅ Profile Complete! 🎉",
        description:
          "Keep your profile updated for better personalization. Your data is private and secure. Enjoy your learning journey!",
        position: "center",
      },
    ],
  },

  mentor: {
    pageId: "mentor",
    pageName: "Mentor",
    steps: [
      {
        id: "intro",
        title: "AI Mentor - Ask Anything 🤖",
        description:
          "Got questions? Your AI Mentor is here 24/7 to explain concepts, answer queries, and guide your learning. Ask anything!",
        position: "center",
      },
      {
        id: "chat-input",
        title: "💬 Ask Your Question",
        description:
          "Type any question about any topic. Be specific and detailed for better answers. The AI will understand and respond helpfully!",
        target: "[data-tutorial='chat-input']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "send-button",
        title: "📤 Send Message",
        description:
          "Click to send your question. The AI will analyze it and respond with a detailed, easy-to-understand answer. Wait a moment for the response!",
        target: "[data-tutorial='send-button']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "chat-history",
        title: "📜 Conversation History",
        description:
          "Your entire chat history is saved. You can scroll back to review previous answers. Use this for revision before exams!",
        target: "[data-tutorial='chat-history']",
        position: "left",
        highlightPadding: 12,
      },
      {
        id: "mentor-end",
        title: "🎓 Meet Your Mentor! 👋",
        description:
          "Your AI Mentor is always available. Ask questions whenever you get stuck. This is your personalized tutoring service, anytime!",
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
        title: "Story Mode - Learn Through Stories 📖",
        description:
          "Make learning fun! Select a topic and learn through engaging, memorable stories with characters and plotlines. Knowledge through storytelling!",
        position: "center",
      },
      {
        id: "subject-input",
        title: "📚 Enter Subject",
        description:
          "Type a subject (e.g., 'Science', 'History', 'Literature'). The AI will create an engaging story that teaches concepts of this subject!",
        target: "[data-tutorial='subject-input']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "topic-input",
        title: "🎯 Enter Topic",
        description:
          "Specify a topic within the subject (e.g., 'Evolution', 'French Revolution', 'Shakespeare'). Stories are tailored to this exact topic!",
        target: "[data-tutorial='topic-input']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "generate-button",
        title: "✨ Generate Story",
        description:
          "Click to create an AI-generated educational story. You'll get characters, plot, moral, and learning points all wrapped in an engaging narrative!",
        target: "[data-tutorial='generate-button']",
        position: "bottom",
        highlightPadding: 10,
      },
      {
        id: "story-end",
        title: "📚 Story Learning Unlocked! 🌟",
        description:
          "Stories make learning stick! Use this for any topic you want to remember. Knowledge wrapped in narrative is knowledge that lasts!",
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
        title: "System Monitoring - Track Performance 📊",
        description:
          "This is a developer/admin tool to monitor system health, API performance, and cache statistics. View real-time system data here!",
        position: "center",
      },
      {
        id: "request-tracker",
        title: "📈 Request Tracker",
        description:
          "See all API requests in real-time. Monitor which endpoints are being used, response times, and error rates. Helps identify slow features!",
        target: "[data-tutorial='request-tracker']",
        position: "bottom",
        highlightPadding: 12,
      },
      {
        id: "cache-monitor",
        title: "⚡ Cache Monitor",
        description:
          "View cache hit/miss rates and performance stats. Good cache performance = faster app! Monitor what's being cached and how effective it is.",
        target: "[data-tutorial='cache-monitor']",
        position: "bottom",
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
