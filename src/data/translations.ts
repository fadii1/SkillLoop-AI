import { LanguageCode, NavTab } from "../types";

export interface TranslationSet {
  brandTagline: string;
  nav: Record<NavTab, string>;
  accessibilityTitle: string;
  largerText: string;
  highContrast: string;
  textToSpeech: string;
  ttsSpeakPage: string;
  ttsStop: string;
  languageLabel: string;
  helpCardTitle: string;
  helpCardBody: string;
  chatNow: string;
  searchPlaceholder: string;
  simulateAbsence: string;
  roles: {
    learner: string;
    educator: string;
    admin: string;
  };
  welcomeBack: string;
  heroSubtitle: string;
  resumeLearning: string;
  currentMasteryLabel: string;
  kpis: {
    overallProgress: string;
    quizAccuracy: string;
    studyStreak: string;
    studyStreakSub: string;
    totalStudyTime: string;
  };
  myCourses: string;
  continueLearning: string;
  startCourse: string;
  studyPlannerTitle: string;
  studyPlannerSubtitle: string;
  startSession: string;
  adaptiveTopicMastery: string;
  learningProgressTitle: string;
  thisWeek: string;
  lastWeek: string;
  recentActivity: string;
  achievementTitle: string;
  achievementBody: string;
  viewProgress: string;
  practiceTitle: string;
  practiceSubtitle: string;
  submitAnswer: string;
  nextQuestion: string;
  readAloud: string;
  aiFeedbackTitle: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationSet> = {
  en: {
    brandTagline: "Learn · Practice · Master",
    nav: {
      dashboard: "Dashboard",
      courses: "My Courses",
      practice: "Smart Practice",
      planner: "Study Planner",
      progress: "My Progress",
      feedback: "AI Feedback",
      resources: "Resources",
      settings: "Settings",
    },
    accessibilityTitle: "Accessibility & Language",
    largerText: "Larger Text",
    highContrast: "High Contrast",
    textToSpeech: "Text-to-Speech",
    ttsSpeakPage: "Read Screen",
    ttsStop: "Stop Audio",
    languageLabel: "Language",
    helpCardTitle: "Need Help? Our AI Tutor is here!",
    helpCardBody: "Stuck on loops or functions? Get instant step-by-step guidance.",
    chatNow: "Chat Now",
    searchPlaceholder: "Search courses, topics...",
    simulateAbsence: "Simulate 5-Day Absence",
    roles: {
      learner: "Learner",
      educator: "Educator",
      admin: "Admin",
    },
    welcomeBack: "Welcome back, Fahad!",
    heroSubtitle:
      "Your adaptive schedule is tuned for focused micro-sessions. Pick up right where you left off without losing momentum.",
    resumeLearning: "Resume Learning",
    currentMasteryLabel: "Your current mastery",
    kpis: {
      overallProgress: "Overall Progress",
      quizAccuracy: "Quiz Accuracy",
      studyStreak: "Study Streak",
      studyStreakSub: "You're on fire!",
      totalStudyTime: "Total Study Time",
    },
    myCourses: "My Courses",
    continueLearning: "Continue Learning",
    startCourse: "Start Course",
    studyPlannerTitle: "Smart Study Planner",
    studyPlannerSubtitle:
      "Pick how much time you have right now — we adapt the session to your weakest topics.",
    startSession: "Start Session",
    adaptiveTopicMastery: "Topic Mastery Profile",
    learningProgressTitle: "Your Learning Progress",
    thisWeek: "This Week",
    lastWeek: "Last Week",
    recentActivity: "Recent Activity",
    achievementTitle: "You're doing great!",
    achievementBody:
      "Your retention on core Python concepts climbed +12% this week across short evening sessions.",
    viewProgress: "View Progress",
    practiceTitle: "Adaptive Smart Practice",
    practiceSubtitle:
      "Questions adapt in real time to strengthen weaker concepts like Loops and Functions first.",
    submitAnswer: "Submit Answer",
    nextQuestion: "Next Adaptive Question",
    readAloud: "Read Aloud",
    aiFeedbackTitle: "AI Conceptual Diagnosis",
  },
  ur: {
    brandTagline: "سیکھیں · مشق کریں · مہارت پائیں",
    nav: {
      dashboard: "ڈیش بورڈ",
      courses: "میرے کورسز",
      practice: "سمارٹ پریکٹس",
      planner: "اسٹڈی پلانر",
      progress: "میری پیش رفت",
      feedback: "اے آئی فیڈبیک",
      resources: "وسائل",
      settings: "ترتیبات",
    },
    accessibilityTitle: "رسائی اور زبان",
    largerText: "بڑا متن",
    highContrast: "ہائی کنٹراسٹ",
    textToSpeech: "ٹیکسٹ ٹو اسپیچ",
    ttsSpeakPage: "اسکرین سنیں",
    ttsStop: "آواز روکیں",
    languageLabel: "زبان",
    helpCardTitle: "مدد چاہیے؟ ہمارا اے آئی ٹیوٹر حاضر ہے!",
    helpCardBody: "لوپس یا فنکشنز میں مشکل ہو؟ فوری قدم بہ قدم رہنمائی حاصل کریں۔",
    chatNow: "ابھی بات کریں",
    searchPlaceholder: "کورسز یا موضوعات تلاش کریں...",
    simulateAbsence: "5 دن کی غیر حاضری آزمائیں",
    roles: {
      learner: "طالب علم",
      educator: "استاد",
      admin: "ایڈمن",
    },
    welcomeBack: "خوش آمدید، فہد!",
    heroSubtitle:
      "آپ کا شیڈول مختصر اور مؤثر سیشنز کے لیے ترتیب دیا گیا ہے۔ بغیر کسی نقصان کے وہیں سے جاری رکھیں جہاں چھوڑا تھا۔",
    resumeLearning: "سیکھنا جاری رکھیں",
    currentMasteryLabel: "آپ کی موجودہ مہارت",
    kpis: {
      overallProgress: "مجموعی پیش رفت",
      quizAccuracy: "کوئز کی درستگی",
      studyStreak: "مطالعہ تسلسل",
      studyStreakSub: "شاندار کارکردگی!",
      totalStudyTime: "کل مطالعہ کا وقت",
    },
    myCourses: "میرے کورسز",
    continueLearning: "جاری رکھیں",
    startCourse: "کورس شروع کریں",
    studyPlannerTitle: "سمارٹ اسٹڈی پلانر",
    studyPlannerSubtitle:
      "ابھی آپ کے پاس جتنا وقت ہے منتخب کریں — ہم کمزور موضوعات کے مطابق سیشن ترتیب دیں گے۔",
    startSession: "سیشن شروع کریں",
    adaptiveTopicMastery: "موضوعات میں مہارت",
    learningProgressTitle: "آپ کی سیکھنے کی پیش رفت",
    thisWeek: "اس ہفتے",
    lastWeek: "پچھلے ہفتے",
    recentActivity: "حالیہ سرگرمی",
    achievementTitle: "آپ بہترین جا رہے ہیں!",
    achievementBody:
      "مختصر شام کے سیشنز کی بدولت اس ہفتے بنیادی پائتھون تصورات میں آپ کی مہارت +12% بڑھی ہے۔",
    viewProgress: "پیش رفت دیکھیں",
    practiceTitle: "اڈاپٹیو سمارٹ پریکٹس",
    practiceSubtitle:
      "سوالات خودکار طور پر آپ کے کمزور موضوعات جیسے Loops اور Functions کو مضبوط بنانے کے لیے ڈھلتے ہیں۔",
    submitAnswer: "جواب جمع کرائیں",
    nextQuestion: "اگلا سوال",
    readAloud: "بلند آواز میں سنیں",
    aiFeedbackTitle: "اے آئی تصوراتی وضاحت",
  },
  roman_ur: {
    brandTagline: "Seekhein · Mashq Karein · Maharat Payein",
    nav: {
      dashboard: "Dashboard",
      courses: "Mere Courses",
      practice: "Smart Practice",
      planner: "Study Planner",
      progress: "Meri Progress",
      feedback: "AI Feedback",
      resources: "Resources",
      settings: "Settings",
    },
    accessibilityTitle: "Accessibility aur Zaban",
    largerText: "Bara Text",
    highContrast: "High Contrast",
    textToSpeech: "Text-to-Speech",
    ttsSpeakPage: "Screen Sunein",
    ttsStop: "Audio Rokein",
    languageLabel: "Zaban (Language)",
    helpCardTitle: "Madad chahiye? Hamara AI Tutor tayyar hai!",
    helpCardBody: "Loops ya Functions samajhne mein mushkil hai? Fori step-by-step madad lein.",
    chatNow: "Chat Karein",
    searchPlaceholder: "Courses ya topics search karein...",
    simulateAbsence: "5-Din Absence Test Karein",
    roles: {
      learner: "Learner",
      educator: "Educator",
      admin: "Admin",
    },
    welcomeBack: "Khush amdeed, Fahad!",
    heroSubtitle:
      "Aapka schedule chhote micro-sessions ke liye tuned hai. Jahan chhora tha wahin se bina kisi nuqsan ke shuru karein.",
    resumeLearning: "Seekhna Jari Rakhein",
    currentMasteryLabel: "Aapki maujooda maharat",
    kpis: {
      overallProgress: "Kul Progress",
      quizAccuracy: "Quiz Accuracy",
      studyStreak: "Study Streak",
      studyStreakSub: "Zabardast raftaar!",
      totalStudyTime: "Kul Study Waqt",
    },
    myCourses: "Mere Courses",
    continueLearning: "Jari Rakhein",
    startCourse: "Course Shuru Karein",
    studyPlannerTitle: "Smart Study Planner",
    studyPlannerSubtitle:
      "Abhi jitna waqt hai chunein — hum aapke kamzor topics ke mutabiq session banayenge.",
    startSession: "Session Shuru Karein",
    adaptiveTopicMastery: "Topic Mastery Profile",
    learningProgressTitle: "Aapki Learning Progress",
    thisWeek: "Is Hafte",
    lastWeek: "Pichle Hafte",
    recentActivity: "Haliya Sargarmi",
    achievementTitle: "Aap bohot acha kar rahe hain!",
    achievementBody:
      "Chhote evening sessions ki wajah se is hafte Python concepts mein aapki mastery +12% barhi hai.",
    viewProgress: "Progress Dekhein",
    practiceTitle: "Adaptive Smart Practice",
    practiceSubtitle:
      "Sawalat khud-ba-khud Loops aur Functions jaise kamzor topics ko mazboot karne ke liye adjust hote hain.",
    submitAnswer: "Jawab Submit Karein",
    nextQuestion: "Agla Adaptive Sawal",
    readAloud: "Buland Awaz Mein Sunein",
    aiFeedbackTitle: "AI Conceptual Diagnosis",
  },
};
