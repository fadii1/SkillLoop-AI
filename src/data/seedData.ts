import {
  ActivityItem,
  CohortTopicHeatmapRow,
  CohortWeekPoint,
  ConceptualFeedback,
  Course,
  EducatorDraftItem,
  LanguageCode,
  MicroSessionStep,
  NotificationItem,
  QuizQuestion,
  RecoveryLogEntry,
  SimulatedCohortLearner,
  TopicMastery,
  UserRecord,
} from "../types";

export const ASSETS = {
  heroIllustration:
    "/src/assets/images/hero_developer_illustration_1794897686428.jpg",
  pythonThumb: "/src/assets/images/course_python_thumb_1794897686081.jpg",
  dataScienceThumb:
    "/src/assets/images/course_datascience_thumb_1794897687488.jpg",
  webDevThumb: "/src/assets/images/course_webdev_thumb_1794897687700.jpg",
  fahadAvatar: "/src/assets/images/avatar_fahad_ali_1794897687597.jpg",
};

export const DEMO_USERS: UserRecord[] = [
  {
    id: "user-fahad",
    name: "Fahad Ali",
    email: "fahad@skillloop.ai",
    role: "learner",
    avatar: ASSETS.fahadAvatar,
    preferred_language: "en",
    accessibility_prefs: {
      fontSize: "normal",
      highContrast: false,
      ttsEnabled: true,
    },
    streak_days: 7,
    last_active_at: new Date().toISOString(),
  },
  {
    id: "user-sarah",
    name: "Dr. Sarah Khan",
    email: "sarah@skillloop.ai",
    role: "educator",
    avatar: ASSETS.fahadAvatar,
    preferred_language: "en",
    accessibility_prefs: {
      fontSize: "normal",
      highContrast: false,
      ttsEnabled: true,
    },
    streak_days: 14,
    last_active_at: new Date().toISOString(),
  },
  {
    id: "user-admin",
    name: "Admin Console",
    email: "admin@skillloop.ai",
    role: "admin",
    avatar: ASSETS.fahadAvatar,
    preferred_language: "en",
    accessibility_prefs: {
      fontSize: "normal",
      highContrast: false,
      ttsEnabled: false,
    },
    streak_days: 30,
    last_active_at: new Date().toISOString(),
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: "python-101",
    title: "Python Programming",
    titleUr: "پائتھون پروگرامنگ",
    titleRomanUr: "Python Programming",
    subtitle: "Beginner to Advanced · 18 micro-lessons",
    status: "In Progress",
    progress: 68,
    thumbnail: ASSETS.pythonThumb,
    totalLessons: 18,
    completedLessons: 12,
    estimatedWeeklyMin: 60,
    modules: [
      {
        id: "py-m1",
        title: "Variables & Memory Binding",
        durationMin: 8,
        completed: true,
        conceptNotes:
          "Variables in Python act as labeled references pointing to objects in memory. Assigning x = 5 binds the name x to the integer 5.",
        codeExample: `hours_studied = 2\nrate_per_day = 15\ntotal_minutes = hours_studied * rate_per_day\nprint(total_minutes)  # 30`,
        captions: [
          "[00:00] Welcome back! In this 8-minute micro-lesson we cover variable binding.",
          "[01:45] Python names point to objects in memory rather than fixed boxes.",
          "[04:10] Notice how two variables can reference the same list object.",
        ],
        offlineSummary:
          "Variables & Memory Binding Summary:\n- Use snake_case names (e.g. study_minutes = 15).\n- Assignment (=) binds a label to an object.\n- List aliasing shares the underlying object unless copied with .copy().",
      },
      {
        id: "py-m2",
        title: "Data Types & Arithmetic vs Strings",
        durationMin: 10,
        completed: true,
        conceptNotes:
          "Python treats numbers (int/float) differently from text (str). Using + on integers adds numerically (5 + 3 = 8), whereas + on strings concatenates ('5' + '3' = '53').",
        codeExample: `print(5 + 3)      # 8 (integer addition)\nprint("5" + "3")  # "53" (string concatenation)`,
        captions: [
          "[00:00] Why does print(5 + 3) give 8 while '5' + '3' gives '53'?",
          "[02:30] Quotes turn digits into text strings, changing what + does.",
          "[06:15] Use int() to convert user input text into numbers safely.",
        ],
        offlineSummary:
          "Data Types Quick Card:\n- int/float: unquoted numbers (5 + 3 = 8).\n- str: quoted text ('5' + '3' = '53').\n- Convert safely with int('5') + 3 = 8.",
      },
      {
        id: "py-m3",
        title: "For Loops & Range Iteration",
        durationMin: 12,
        completed: false,
        conceptNotes:
          "A for loop repeats a block of code for each item in a sequence. Remember range(n) starts at 0 and stops before n.",
        codeExample: `for day in range(1, 4):\n    print(f"Day {day}: 15-min review")`,
        captions: [
          "[00:00] Loops automate repetitive checks without copy-pasting code.",
          "[03:20] range(3) yields 0, 1, 2 — always stops right before the limit.",
          "[07:50] Always initialize accumulators like total = 0 outside the loop.",
        ],
        offlineSummary:
          "For Loops & Range Summary:\n- range(n) starts at 0 and ends at n-1.\n- range(start, stop, step) controls bounds and stride.\n- Initialize counters before the loop begins.",
      },
      {
        id: "py-m4",
        title: "Reusable Functions & Return Values",
        durationMin: 15,
        completed: false,
        conceptNotes:
          "Functions encapsulate logic with parameters and return values. Always distinguish between printing inside a function and returning a value for reuse.",
        codeExample: `def calc_mastery(correct, total):\n    return round((correct / total) * 100)\n\nscore = calc_mastery(8, 10)`,
        captions: [
          "[00:00] Functions package reusable steps so you can test them cleanly.",
          "[04:05] print() displays on screen; return hands the value back to callers.",
          "[09:30] Missing return produces None.",
        ],
        offlineSummary:
          "Functions & Return Values Summary:\n- Define with def name(params):\n- Use return to pass results back.\n- Without return, Python returns None.",
      },
    ],
  },
  {
    id: "data-science-101",
    title: "Data Science Basics",
    titleUr: "ڈیٹا سائنس کی بنیادی باتیں",
    titleRomanUr: "Data Science Basics",
    subtitle: "Data Analysis & ML · 14 micro-lessons",
    status: "Not Started",
    progress: 0,
    thumbnail: ASSETS.dataScienceThumb,
    totalLessons: 14,
    completedLessons: 0,
    estimatedWeeklyMin: 45,
    modules: [
      {
        id: "ds-m1",
        title: "Tabular Data & Pandas DataFrames",
        durationMin: 10,
        completed: false,
        conceptNotes:
          "DataFrames store rows and columns like a programmable spreadsheet. Use .head() and .describe() to inspect datasets quickly.",
        codeExample: `import pandas as pd\ndf = pd.DataFrame({"hours": [1, 2, 3], "score": [62, 74, 86]})\nprint(df["score"].mean())`,
        captions: [
          "[00:00] Pandas DataFrames bring spreadsheet power into Python scripts.",
          "[03:40] Inspect columns cleanly using df.head() and df.describe().",
        ],
        offlineSummary:
          "Pandas DataFrames Summary:\n- 2D labeled rows & columns.\n- df['col'].mean() computes column averages.",
      },
      {
        id: "ds-m2",
        title: "Train / Test Splits & Overfitting",
        durationMin: 12,
        completed: false,
        conceptNotes:
          "Holding out a test set verifies whether your model generalizes to unseen adult learner schedules rather than memorizing noise.",
        codeExample: `from sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)`,
        captions: [
          "[00:00] Why you should never evaluate accuracy on training data alone.",
          "[05:10] An 80/20 split checks real-world generalization.",
        ],
        offlineSummary:
          "Train / Test Split Summary:\n- Keep 20% unseen test data.\n- Prevents overfitting.",
      },
    ],
  },
  {
    id: "web-dev-101",
    title: "Web Development",
    titleUr: "ویب ڈویلپمنٹ",
    titleRomanUr: "Web Development",
    subtitle: "HTML, CSS & JavaScript · 16 micro-lessons",
    status: "In Progress",
    progress: 45,
    thumbnail: ASSETS.webDevThumb,
    totalLessons: 16,
    completedLessons: 7,
    estimatedWeeklyMin: 50,
    modules: [
      {
        id: "wd-m1",
        title: "Semantic HTML & Accessible Landmarks",
        durationMin: 8,
        completed: true,
        conceptNotes:
          "Using <main>, <nav>, <button>, and aria-labels makes interfaces keyboard-friendly and screen-reader ready.",
        codeExample: `<button type="button" aria-label="Read lesson aloud">Listen</button>`,
        captions: [
          "[00:00] Semantic landmarks help screen readers jump cleanly between sections.",
          "[03:15] Native <button> gives keyboard Enter/Space support automatically.",
        ],
        offlineSummary:
          "Semantic HTML Summary:\n- Prefer <button> over clickable <div>.\n- Provide aria-label on icon buttons.",
      },
      {
        id: "wd-m2",
        title: "DOM Events & State Updates",
        durationMin: 12,
        completed: false,
        conceptNotes:
          "Event listeners respond to user clicks and keyboard shortcuts without reloading the page.",
        codeExample: `button.addEventListener("click", () => {\n  statusEl.textContent = "Session started";\n});`,
        captions: [
          "[00:00] Connecting UI actions to state without page reloads.",
          "[04:50] addEventListener allows multiple non-conflicting handlers.",
        ],
        offlineSummary:
          "DOM Events Summary:\n- Use addEventListener('click', fn).\n- Update DOM text safely via textContent.",
      },
    ],
  },
];

export const INITIAL_TOPIC_MASTERY: TopicMastery[] = [
  {
    id: "topic-variables",
    courseId: "python-101",
    name: "Variables",
    nameUr: "ویری ایبلز (Variables)",
    nameRomanUr: "Variables",
    mastery: 90,
    retention_health: "Healthy",
    lastPracticedDaysAgo: 1,
    summary: "Strong command of assignment, naming rules, and dynamic types.",
  },
  {
    id: "topic-datatypes",
    courseId: "python-101",
    name: "Data Types",
    nameUr: "ڈیٹا ٹائپس (Data Types)",
    nameRomanUr: "Data Types",
    mastery: 80,
    retention_health: "Healthy",
    lastPracticedDaysAgo: 2,
    summary:
      "Solid grasp of int, float, str; occasional slip on implicit vs explicit casting.",
  },
  {
    id: "topic-loops",
    courseId: "python-101",
    name: "Loops",
    nameUr: "لوپس (Loops)",
    nameRomanUr: "Loops",
    mastery: 45,
    retention_health: "Needs Review",
    lastPracticedDaysAgo: 4,
    summary:
      "Needs scaffolded practice on range() boundaries and accumulator variables.",
  },
  {
    id: "topic-functions",
    courseId: "python-101",
    name: "Functions",
    nameUr: "فنکشنز (Functions)",
    nameRomanUr: "Functions",
    mastery: 30,
    retention_health: "At Risk",
    lastPracticedDaysAgo: 5,
    summary:
      "Priority focus: return vs print() and passing arguments cleanly.",
  },
  {
    id: "topic-dom",
    courseId: "web-dev-101",
    name: "DOM & Events",
    nameUr: "DOM اور ایونٹس",
    nameRomanUr: "DOM & Events",
    mastery: 52,
    retention_health: "Needs Review",
    lastPracticedDaysAgo: 3,
    summary: "Understands selectors; practicing event delegation and state sync.",
  },
];

export const QUIZ_BANK: QuizQuestion[] = [
  {
    id: "q-datatypes-add",
    courseId: "python-101",
    topicId: "topic-datatypes",
    topicName: "Data Types",
    difficulty: "Easy",
    question: "What will this Python statement print to the console?",
    questionUr: "یہ پائتھون کوڈ کنسول پر کیا پرنٹ کرے گا؟",
    questionRomanUr: "Yeh Python code console par kya print karega?",
    codeSnippet: "print(5 + 3)",
    options: ["8", "53", "5 + 3", "TypeError"],
    correctAnswer: "8",
    allowFreeInput: true,
    defaultMisconceptionInput: "53",
    conceptHint: "Look carefully: are 5 and 3 integers or quoted strings?",
    approved_by_educator: true,
  },
  {
    id: "q-datatypes-hard",
    courseId: "python-101",
    topicId: "topic-datatypes",
    topicName: "Data Types",
    difficulty: "Hard",
    question:
      "With Data Types at 80%+, solve this challenge: what does print(int('5') + len('abc')) output?",
    questionUr:
      "80%+ مہارت کے ساتھ یہ چیلنج حل کریں: print(int('5') + len('abc')) کیا پرنٹ کرے گا؟",
    questionRomanUr:
      "80%+ mastery ke saath yeh challenge solve karein: print(int('5') + len('abc')) kya output dega?",
    codeSnippet: "print(int('5') + len('abc'))",
    options: ["8", "53", "5abc", "TypeError"],
    correctAnswer: "8",
    allowFreeInput: true,
    conceptHint: "int('5') converts string '5' to integer 5; len('abc') returns 3.",
    approved_by_educator: true,
  },
  {
    id: "q-loops-easy",
    courseId: "python-101",
    topicId: "topic-loops",
    topicName: "Loops",
    difficulty: "Easy",
    question:
      "How many times does the print statement run in this scaffolded loop?",
    questionUr: "اس لوپ میں print کتنی بار چلے گا؟",
    questionRomanUr: "Is loop mein print kitni baar chalega?",
    codeSnippet: `for i in range(3):\n    print("Step", i)`,
    options: [
      "3 times (0, 1, 2)",
      "4 times (0, 1, 2, 3)",
      "2 times (1, 2)",
      "1 time",
    ],
    correctAnswer: "3 times (0, 1, 2)",
    conceptHint: "Python's range(3) starts at 0 and stops right before 3.",
    approved_by_educator: true,
  },
  {
    id: "q-functions-easy",
    courseId: "python-101",
    topicId: "topic-functions",
    topicName: "Functions",
    difficulty: "Easy",
    question: "What value is stored in total after calling add_bonus(10)?",
    questionUr:
      "add_bonus(10) کال کرنے کے بعد total میں کون سی ویلیو محفوظ ہوگی؟",
    questionRomanUr:
      "add_bonus(10) call karne ke baad total mein kya value store hogi?",
    codeSnippet: `def add_bonus(points):\n    return points + 5\n\ntotal = add_bonus(10)`,
    options: ["15", "10", "None", "points + 5"],
    correctAnswer: "15",
    allowFreeInput: true,
    conceptHint: "return sends the computed value back to the caller.",
    approved_by_educator: true,
  },
  {
    id: "q-functions-med",
    courseId: "python-101",
    topicId: "topic-functions",
    topicName: "Functions",
    difficulty: "Medium",
    question: "Why does result equal None in this snippet?",
    questionUr: "اس کوڈ میں result کی ویلیو None کیوں آتی ہے؟",
    questionRomanUr: "Is snippet mein result ki value None kyun aati hai?",
    codeSnippet: `def double(n):\n    print(n * 2)\n\nresult = double(4)`,
    options: [
      "The function prints instead of using return",
      "n * 2 is invalid syntax",
      "double(4) needs two arguments",
      "print() returns 8 only in Python 2",
    ],
    correctAnswer: "The function prints instead of using return",
    conceptHint: "Without an explicit return statement, Python functions return None.",
    approved_by_educator: true,
  },
  {
    id: "q-loops-med",
    courseId: "python-101",
    topicId: "topic-loops",
    topicName: "Loops",
    difficulty: "Medium",
    question: "What is the final value of total after the loop completes?",
    questionUr: "لوپ مکمل ہونے کے بعد total کی آخری ویلیو کیا ہوگی؟",
    questionRomanUr: "Loop mukammal hone ke baad total ki aakhri value kya hogi?",
    codeSnippet: `total = 0\nfor num in [2, 4, 6]:\n    total += num\nprint(total)`,
    options: ["12", "6", "246", "0"],
    correctAnswer: "12",
    allowFreeInput: true,
    conceptHint: "Trace total on each pass: 0+2 -> 2+4 -> 6+6.",
    approved_by_educator: true,
  },
  {
    id: "q-variables-hard",
    courseId: "python-101",
    topicId: "topic-variables",
    topicName: "Variables",
    difficulty: "Hard",
    question:
      "Since your Variables mastery is >=80%, solve this challenge: what does print(a, b) output?",
    questionUr:
      "چونکہ Variables میں آپ کی مہارت 80%+ ہے، یہ چیلنج حل کریں: print(a, b) کیا آؤٹ پٹ دے گا؟",
    questionRomanUr:
      "Variables mein aapki mastery 80%+ hai, yeh challenge solve karein: print(a, b) kya output dega?",
    codeSnippet: `a = [1, 2]\nb = a\nb.append(3)\nprint(a, b)`,
    options: [
      "[1, 2, 3] [1, 2, 3]",
      "[1, 2] [1, 2, 3]",
      "[1, 2] [3]",
      "Error: lists cannot be aliased",
    ],
    correctAnswer: "[1, 2, 3] [1, 2, 3]",
    conceptHint: "Both variables reference the exact same list object in memory.",
    approved_by_educator: true,
  },
  {
    id: "q-dom-med",
    courseId: "web-dev-101",
    topicId: "topic-dom",
    topicName: "DOM & Events",
    difficulty: "Medium",
    question:
      "Which DOM method attaches a click handler without overwriting existing listeners?",
    questionUr:
      "کون سا DOM میتھڈ پرانے لسنرز کو ہٹائے بغیر کلک ہینڈلر لگاتا ہے؟",
    questionRomanUr:
      "Kaunsa DOM method purane listeners ko hataye baghair click handler lagata hai?",
    codeSnippet: `const btn = document.querySelector("#start-btn");`,
    options: [
      "btn.addEventListener('click', handler)",
      "btn.onclick = handler",
      "btn.setAttribute('click', handler)",
      "btn.on('click', handler)",
    ],
    correctAnswer: "btn.addEventListener('click', handler)",
    conceptHint: "Assignment to .onclick replaces any prior handler.",
    approved_by_educator: true,
  },
];

export const DIAGNOSTIC_QUESTIONS: QuizQuestion[] = [
  QUIZ_BANK[2], // Loops easy
  QUIZ_BANK[3], // Functions easy
  QUIZ_BANK[0], // Data types print(5+3)
];

export const WEEKLY_PROGRESS_CHART = [
  { day: "Mon", thisWeek: 58, lastWeek: 48, minutes: 15 },
  { day: "Tue", thisWeek: 62, lastWeek: 51, minutes: 20 },
  { day: "Wed", thisWeek: 65, lastWeek: 54, minutes: 10 },
  { day: "Thu", thisWeek: 67, lastWeek: 56, minutes: 15 },
  { day: "Fri", thisWeek: 70, lastWeek: 58, minutes: 20 },
  { day: "Sat", thisWeek: 73, lastWeek: 60, minutes: 30 },
  { day: "Sun", thisWeek: 76, lastWeek: 64, minutes: 15 },
];

export const INITIAL_ACTIVITY: ActivityItem[] = [
  {
    id: "act-1",
    title: "Completed Data Types Micro-Quiz",
    meta: "Python Programming · 4/5 correct",
    score: "80%",
    timeAgo: "2h ago",
    type: "quiz",
  },
  {
    id: "act-2",
    title: "Reviewed Loops Visual Guide",
    meta: "Python Programming · 12 min session",
    score: "+6% mastery",
    timeAgo: "Yesterday",
    type: "concept",
  },
  {
    id: "act-3",
    title: "7-Day Flexible Streak Achieved",
    meta: "Evening 15-min slot consistency",
    score: "7 Days",
    timeAgo: "2 days ago",
    type: "streak",
  },
  {
    id: "act-4",
    title: "DOM & Events Practice",
    meta: "Web Development · 3/4 correct",
    score: "75%",
    timeAgo: "3 days ago",
    type: "quiz",
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    title: "15-min Evening Slot Ready",
    detail:
      "Your adaptive plan prioritizes Loops (45%) and Functions (30%) tonight.",
    time: "12m ago",
    unread: true,
  },
  {
    id: "n-2",
    title: "Mastery Milestone: Variables 90%",
    detail: "Harder challenge questions unlocked for Python Variables.",
    time: "3h ago",
    unread: true,
  },
  {
    id: "n-3",
    title: "Zero-Penalty Flex Mode Active",
    detail:
      "Busy workday? Switch anytime between 10, 15, 20, or 30 min sessions.",
    time: "1d ago",
    unread: false,
  },
];

export const SIMULATED_COHORT_WEEKLY: CohortWeekPoint[] = [
  { week: "Week 1", mastery: 35, accuracy: 42, activeLearners: 21, retentionScore: 38 },
  { week: "Week 2", mastery: 49, accuracy: 56, activeLearners: 23, retentionScore: 52 },
  { week: "Week 3", mastery: 62, accuracy: 68, activeLearners: 24, retentionScore: 64 },
  { week: "Week 4", mastery: 72, accuracy: 76, activeLearners: 25, retentionScore: 71 },
];

export const SIMULATED_COHORT_HEATMAP: CohortTopicHeatmapRow[] = [
  { topic: "Variables", week1: 54, week2: 71, week3: 83, week4: 91, retentionCheck: 88 },
  { topic: "Data Types", week1: 44, week2: 60, week3: 74, week4: 82, retentionCheck: 79 },
  { topic: "Loops", week1: 24, week2: 38, week3: 52, week4: 65, retentionCheck: 62 },
  { topic: "Functions", week1: 18, week2: 29, week3: 41, week4: 54, retentionCheck: 51 },
];

// Full 30 simulated adult learners across 3 courses over 4 weeks
const NAMES_30 = [
  "Fahad Ali", "Ayesha Tariq", "Bilal Ahmed", "Zainab Malik", "Usman Raza",
  "Hira Siddiqui", "Hamza Sheikh", "Mariam Qureshi", "Saad Farooq", "Nida Javed",
  "Omar Farooq", "Sanaullah Khan", "Fatima Noor", "Kamran Iqbal", "Anum Zahra",
  "Taimoor Hasan", "Mehwish Nawaz", "Danish Butt", "Rabia Mansoor", "Salman Haider",
  "Kiran Aslam", "Waqas Mahmood", "Sadia Akram", "Junaid Nasir", "Iqra Yousuf",
  "Zeeshan Altaf", "Maham Sohail", "Asad Ullah", "Hina Pervez", "Naveed Akhtar",
];
const SCHEDULES = ["Evening Shift", "Commute 15m", "Weekend Flex", "Night Owl 10m"];
const COURSES_3 = ["Python Programming", "Data Science Basics", "Web Development"];

export const SIMULATED_30_LEARNERS: SimulatedCohortLearner[] = NAMES_30.map(
  (name, i) => ({
    id: `cohort-l-${i + 1}`,
    name,
    scheduleType: SCHEDULES[i % SCHEDULES.length],
    course: COURSES_3[i % COURSES_3.length],
    week1Mastery: 28 + ((i * 3) % 15),
    week4Mastery: 64 + ((i * 5) % 21),
    quizAccuracy: 68 + ((i * 4) % 20),
    delayedRetention: 63 + ((i * 3) % 19),
    activeThisWeek: i < 25,
  })
);

export const INITIAL_EDUCATOR_DRAFTS: EducatorDraftItem[] = [
  {
    id: "draft-1",
    courseTitle: "Python Programming",
    topicName: "Loops",
    question:
      "Which keyword exits a Python for-loop immediately when a target item is found?",
    codeSnippet: `for item in tasks:\n    if item == "urgent":\n        # stop here`,
    options: ["break", "continue", "pass", "return"],
    correctAnswer: "break",
    difficulty: "Easy",
    explanation:
      "break terminates the nearest enclosing loop immediately, whereas continue skips only the current iteration.",
    status: "Pending Review",
    createdAt: "Today, 09:40 AM",
  },
  {
    id: "draft-2",
    courseTitle: "Python Programming",
    topicName: "Loops",
    question:
      "What does range(2, 10, 3) generate when converted to a list?",
    codeSnippet: "list(range(2, 10, 3))",
    options: ["[2, 5, 8]", "[2, 5, 8, 11]", "[3, 6, 9]", "[2, 4, 6, 8]"],
    correctAnswer: "[2, 5, 8]",
    difficulty: "Medium",
    explanation:
      "Starting at 2 and stepping by 3 gives 2, 5, 8. The next value (11) exceeds the stop boundary 10.",
    status: "Pending Review",
    createdAt: "Today, 09:40 AM",
  },
  {
    id: "draft-3",
    courseTitle: "Python Programming",
    topicName: "Functions",
    question:
      "Why should default mutable arguments like def add_item(lst=[]): be avoided in Python?",
    codeSnippet: `def add_item(val, lst=[]):\n    lst.append(val)\n    return lst`,
    options: [
      "The default list is created once and shared across function calls",
      "Python forbids lists inside function signatures",
      "append() creates a syntax error inside functions",
      "It always returns None",
    ],
    correctAnswer:
      "The default list is created once and shared across function calls",
    difficulty: "Hard",
    explanation:
      "Default parameter objects are evaluated once at function definition time. Use lst=None and initialize inside the function.",
    status: "Approved",
    createdAt: "Yesterday",
  },
];

export const ADMIN_LANGUAGE_USAGE = [
  { name: "English", learners: 412, share: 54 },
  { name: "Roman Urdu", learners: 229, share: 30 },
  { name: "Urdu (اردو)", learners: 122, share: 16 },
];

export const ADMIN_RECOVERY_LOGS: RecoveryLogEntry[] = [
  {
    id: "log-1",
    timestamp: "10:14 AM",
    event: "5-Day Inactivity Recovery Triggered",
    component: "Adaptive Recovery Engine",
    severity: "Resolved",
    detail:
      "Preserved 68% mastery; issued 3-question diagnostic + 10-min catch-up plan.",
  },
  {
    id: "log-2",
    timestamp: "09:52 AM",
    event: "AI Offline Rule-Based Fallback Verified",
    component: "Conceptual Feedback Router",
    severity: "Fallback Active",
    detail:
      "Switched seamlessly to deterministic Python AST/pattern explainer during simulated offline test.",
  },
  {
    id: "log-3",
    timestamp: "09:05 AM",
    event: "Educator Human-in-the-Loop Gate",
    component: "Content Approval Queue",
    severity: "Info",
    detail:
      "2 AI-generated Loops drafts held in Pending Review prior to learner release.",
  },
  {
    id: "log-4",
    timestamp: "Yesterday",
    event: "Urdu RTL Layout & Web Speech Sync",
    component: "Accessibility Controller",
    severity: "Resolved",
    detail:
      "Dynamic RTL switch and ur-PK voice synthesis verified without state reset.",
  },
];

export function buildMicroSession(
  totalMinutes: number,
  topics: TopicMastery[],
  isRecoveryMode = false
): MicroSessionStep[] {
  const sortedWeak = [...topics].sort((a, b) => a.mastery - b.mastery);
  const weakest = sortedWeak[0]?.name || "Functions";
  const secondWeak = sortedWeak[1]?.name || "Loops";

  if (totalMinutes === 10) {
    return [
      {
        id: "step-1",
        title: isRecoveryMode
          ? `Gentle Warmup: ${secondWeak}`
          : `Quick Revision: ${secondWeak}`,
        type: "revision",
        minutes: 2,
        topicName: secondWeak,
        description: "Zero-pressure recall card of key syntax & patterns.",
      },
      {
        id: "step-2",
        title: "Adaptive Practice Quiz",
        type: "quiz",
        minutes: 4,
        topicName: weakest,
        description: "2 scaffolded questions targeting your highest-leverage gap.",
      },
      {
        id: "step-3",
        title: "AI Conceptual Explanation",
        type: "explanation",
        minutes: 2,
        topicName: weakest,
        description: "Instant mental-model breakdown of any tricky step.",
      },
      {
        id: "step-4",
        title: "Guided Mini-Exercise",
        type: "guided",
        minutes: 2,
        topicName: secondWeak,
        description: "One confidence-building code trace to lock in retention.",
      },
    ];
  }

  if (totalMinutes === 15) {
    return [
      {
        id: "step-1",
        title: `Quick Revision: ${secondWeak}`,
        type: "revision",
        minutes: 3,
        topicName: secondWeak,
        description: "Review range() boundaries and loop iteration patterns.",
      },
      {
        id: "step-2",
        title: "Practice Quiz",
        type: "quiz",
        minutes: 5,
        topicName: weakest,
        description: "3 adaptive questions weighted toward Loops & Functions.",
      },
      {
        id: "step-3",
        title: "AI Explanation",
        type: "explanation",
        minutes: 4,
        topicName: weakest,
        description: "Deep dive on return vs print and type coercion.",
      },
      {
        id: "step-4",
        title: "Guided Practice",
        type: "guided",
        minutes: 3,
        topicName: secondWeak,
        description: "Apply the concept on a practical real-world snippet.",
      },
    ];
  }

  if (totalMinutes === 20) {
    return [
      {
        id: "step-1",
        title: `Quick Revision: ${secondWeak} & ${weakest}`,
        type: "revision",
        minutes: 4,
        topicName: secondWeak,
        description: "Spaced repetition flash summary of core rules.",
      },
      {
        id: "step-2",
        title: "Adaptive Practice Quiz",
        type: "quiz",
        minutes: 7,
        topicName: weakest,
        description: "4 adaptive questions scaling from Easy to Medium.",
      },
      {
        id: "step-3",
        title: "AI Explanation & Misconception Check",
        type: "explanation",
        minutes: 5,
        topicName: weakest,
        description: "Interactive conceptual comparison with follow-up prompt.",
      },
      {
        id: "step-4",
        title: "Guided Practice Challenge",
        type: "guided",
        minutes: 4,
        topicName: secondWeak,
        description: "Solve a realistic workplace automation loop.",
      },
    ];
  }

  return [
    {
      id: "step-1",
      title: `Concept Refresher: ${secondWeak}`,
      type: "revision",
      minutes: 6,
      topicName: secondWeak,
      description: "Annotated walkthrough of loop accumulators and control flow.",
    },
    {
      id: "step-2",
      title: "Extended Adaptive Quiz",
      type: "quiz",
      minutes: 10,
      topicName: weakest,
      description: "5 progressive questions adapting to live accuracy.",
    },
    {
      id: "step-3",
      title: "AI Deep-Dive Explanation",
      type: "explanation",
      minutes: 7,
      topicName: weakest,
      description:
        "Personalized conceptual feedback & Urdu/English mental model notes.",
    },
    {
      id: "step-4",
      title: "Guided Capstone Mini-Lab",
      type: "guided",
      minutes: 7,
      topicName: weakest,
      description: "Combine Loops + Functions in a clean 6-line script.",
    },
  ];
}

export function selectAdaptiveDifficultyForMastery(
  mastery: number
): "Easy" | "Medium" | "Hard" {
  if (mastery < 50) return "Easy";
  if (mastery < 80) return "Medium";
  return "Hard";
}

export function generateRuleBasedFeedback(params: {
  question: string;
  codeSnippet?: string;
  userAnswer: string;
  correctAnswer: string;
  topic: string;
  language: LanguageCode;
}): Omit<ConceptualFeedback, "id" | "timestamp" | "masteryDelta"> {
  const { question, codeSnippet, userAnswer, correctAnswer, topic, language } =
    params;
  const trimmedUser = userAnswer.trim();
  const isCorrect =
    trimmedUser.toLowerCase() === correctAnswer.trim().toLowerCase();

  const isAddMisconception =
    (codeSnippet?.includes("5 + 3") || question.includes("5 + 3")) &&
    trimmedUser === "53";

  if (isAddMisconception) {
    if (language === "ur") {
      return {
        topicName: topic,
        question,
        userAnswer,
        correctAnswer,
        isCorrect: false,
        source: "rule-based",
        whyOutcome:
          "آپ کا جواب 53 اس لیے آیا کہ آپ نے 5 اور 3 کو ٹیکسٹ (Strings) سمجھ کر آپس میں جوڑ دیا، جبکہ پائتھون میں بغیر کوٹس (' ') کے 5 اور 3 اعداد (Integers) ہیں۔",
        coreConcept:
          "پائتھون میں + کی علامت اعداد کو جمع کرتی ہے (5 + 3 = 8)، لیکن اگر کوٹس ہوں ('5' + '3') تو وہ ٹیکسٹ کو جوڑ کر '53' بناتی ہے۔",
        stepByStep:
          "1) Python نے دیکھا کہ 5 اور 3 بغیر quotes کے ہیں، اس لیے دونوں integers ہیں۔ 2) + نے عددی جمع کیا اور نتیجہ 8 پرنٹ ہوا۔",
        followUpQuestion: 'اب بتائیں: print("5" + "3") کیا پرنٹ کرے گا؟',
        followUpOptions: ['"53"', "8", "Error"],
        followUpAnswer: '"53"',
      };
    }
    if (language === "roman_ur") {
      return {
        topicName: topic,
        question,
        userAnswer,
        correctAnswer,
        isCorrect: false,
        source: "rule-based",
        whyOutcome:
          "Aapne 53 is liye likha kyunke aapne 5 aur 3 ko text (strings) samajh kar mila diya. Python mein quotes (' ') ke baghair 5 aur 3 numbers (integers) hain.",
        coreConcept:
          "Numbers par + arithmetic addition karta hai (5 + 3 = 8), jabke quoted strings par + concatenation karta hai ('5' + '3' = '53').",
        stepByStep:
          "1) Python 5 aur 3 ko integers pehchanta hai. 2) + dono ko jama karke 8 banata hai aur print(8) console par 8 dikhata hai.",
        followUpQuestion: 'Ab check karein: print("5" + "3") kya output dega?',
        followUpOptions: ['"53"', "8", "TypeError"],
        followUpAnswer: '"53"',
      };
    }
    return {
      topicName: topic,
      question,
      userAnswer,
      correctAnswer,
      isCorrect: false,
      source: "rule-based",
      whyOutcome:
        "You answered 53 because you treated 5 and 3 as text strings being glued together (concatenation) instead of numeric integers.",
      coreConcept:
        "In Python, unquoted numbers (5 and 3) are integers, so + performs arithmetic addition (8). Quotes ('5' + '3') are required for string concatenation ('53').",
      stepByStep:
        "1) Python evaluates 5 and 3 as int values. 2) The + operator adds 5 + 3 to produce 8, which print() displays.",
      followUpQuestion: 'Quick check: what does print("5" + "3") output?',
      followUpOptions: ['"53"', "8", "TypeError"],
      followUpAnswer: '"53"',
    };
  }

  if (isCorrect) {
    if (language === "ur") {
      return {
        topicName: topic,
        question,
        userAnswer,
        correctAnswer,
        isCorrect: true,
        source: "rule-based",
        whyOutcome: `شاباش! آپ کا جواب "${userAnswer}" بالکل درست ہے اور ${topic} کا بنیادی تصور واضح ہے۔`,
        coreConcept: `آپ نے ${topic} کے قواعد کو درست طریقے سے لاگو کیا، جس سے آپ کی مہارت میں اضافہ ہوا۔`,
        stepByStep:
          "1) کوڈ کے ہر حصے کو ترتیب وار پڑھا گیا۔ 2) متوقع آؤٹ پٹ درست طور پر نکالا گیا۔",
        followUpQuestion:
          "اگلا قدم: جب آپ کسی کوڈ کو دوبارہ استعمال کرنا چاہیں تو کون سا keyword ویلیو واپس بھیجتا ہے؟",
        followUpOptions: ["return", "print", "break"],
        followUpAnswer: "return",
      };
    }
    if (language === "roman_ur") {
      return {
        topicName: topic,
        question,
        userAnswer,
        correctAnswer,
        isCorrect: true,
        source: "rule-based",
        whyOutcome: `Shabash! Aapka jawab "${userAnswer}" bilkul sahi hai aur ${topic} par aapki samajh mazboot ho rahi hai.`,
        coreConcept: `Aapne ${topic} ka rule sahi trace kiya, is liye aapki topic mastery barh gayi hai.`,
        stepByStep:
          "1) Input aur data types sahi pehchane gaye. 2) Execution order ke mutabiq exact output nikala gaya.",
        followUpQuestion:
          "Agla check: function se value wapas bhejne ke liye kya use hota hai?",
        followUpOptions: ["return", "print", "stop"],
        followUpAnswer: "return",
      };
    }
    return {
      topicName: topic,
      question,
      userAnswer,
      correctAnswer,
      isCorrect: true,
      source: "rule-based",
      whyOutcome: `Spot on! "${userAnswer}" is correct — your mental model for ${topic} is locked in.`,
      coreConcept: `You accurately traced how Python evaluates ${topic} without falling for common syntax traps.`,
      stepByStep:
        "1) Identified the exact data/control flow rule. 2) Evaluated the expression cleanly to match runtime output.",
      followUpQuestion:
        "Quick retention check: if you need to reuse a computed result outside a function, what should you use?",
      followUpOptions: ["return", "print", "break"],
      followUpAnswer: "return",
    };
  }

  if (language === "ur") {
    return {
      topicName: topic,
      question,
      userAnswer,
      correctAnswer,
      isCorrect: false,
      source: "rule-based",
      whyOutcome: `آپ کا جواب "${userAnswer}" درست جواب "${correctAnswer}" سے مختلف ہے۔ ${topic} میں ترتیب اور اقسام پر توجہ دیں۔`,
      coreConcept: `${topic} کو سمجھنے کے لیے ہر لائن کو اس کے اصل ڈیٹا ٹائپ اور رینج کے ساتھ مرحلہ وار ٹریس کریں۔`,
      stepByStep: `1) ان پٹ یا شروعاتی ویلیو چیک کریں۔ 2) درست منطق کے مطابق نتیجہ "${correctAnswer}" بنتا ہے۔`,
      followUpQuestion: `کیا آپ "${correctAnswer}" کے اصول کو ایک اور مختصر مثال میں آزمانا چاہیں گے؟`,
      followUpOptions: [correctAnswer, userAnswer || "None", "SyntaxError"],
      followUpAnswer: correctAnswer,
    };
  }

  if (language === "roman_ur") {
    return {
      topicName: topic,
      question,
      userAnswer,
      correctAnswer,
      isCorrect: false,
      source: "rule-based",
      whyOutcome: `Aapka jawab "${userAnswer}" sahi jawab "${correctAnswer}" se mukhtalif hai. ${topic} mein execution order aur type check karein.`,
      coreConcept: `${topic} mein har step ko line-by-line trace karne se aisi ghaltiyan foran pakri jaati hain.`,
      stepByStep: `1) Shuruati values aur boundaries dekhein. 2) Step-by-step chalane par sahi nateeja "${correctAnswer}" aata hai.`,
      followUpQuestion: `Confirm karein ke is snippet ka sahi output kya hai:`,
      followUpOptions: [correctAnswer, userAnswer || "None", "SyntaxError"],
      followUpAnswer: correctAnswer,
    };
  }

  return {
    topicName: topic,
    question,
    userAnswer,
    correctAnswer,
    isCorrect: false,
    source: "rule-based",
    whyOutcome: `You selected "${userAnswer}", whereas Python evaluates this to "${correctAnswer}". This usually happens when boundary conditions or return behavior are overlooked.`,
    coreConcept: `In ${topic}, trace each line's exact state and data type rather than guessing the surface pattern.`,
    stepByStep: `1) Check the starting value or range boundary. 2) Walk through each execution step to reach "${correctAnswer}".`,
    followUpQuestion: `Verify your updated mental model — which output is accurate for this ${topic} pattern?`,
    followUpOptions: [correctAnswer, userAnswer || "None", "SyntaxError"],
    followUpAnswer: correctAnswer,
  };
}

export function generateRuleBasedTutorReply(
  userMessage: string,
  language: LanguageCode,
  topics: TopicMastery[]
): string {
  const lower = userMessage.toLowerCase();
  const weakest = [...topics].sort((a, b) => a.mastery - b.mastery)[0];

  if (lower.includes("loop") || lower.includes("range")) {
    if (language === "ur") {
      return "سوچیں: اگر `range(3)` صفر سے شروع ہو اور 3 سے پہلے رکے، تو یہ کتنے نمبر بنائے گا؟ (Hint: 0, 1, 2)۔ جب آپ یہ گن لیں تو لوپ کی تعداد خود واضح ہو جائے گی!";
    }
    if (language === "roman_ur") {
      return "Sochein: agar `range(3)` 0 se shuru ho aur 3 se pehle ruke, to kitne numbers banenge? (Hint: 0, 1, 2). Aap bataiye is loop mein print kitni baar chalega?";
    }
    return "Socratic Hint: If `range(3)` starts at `0` and stops right before `3`, which three numbers does it step through? Once you trace those indices, try running a 10-minute Loops drill!";
  }

  if (lower.includes("function") || lower.includes("return")) {
    if (language === "ur") {
      return "ایک اشارہ: `print()` صرف اسکرین پر دکھاتا ہے، جبکہ `return` نتیجہ واپس بھیجتا ہے۔ اگر آپ کسی ویری ایبل میں جواب محفوظ کرنا چاہیں تو کون سا استعمال کریں گے؟";
    }
    if (language === "roman_ur") {
      return "Ek hint: `print()` sirf screen par dikhata hai, jabke `return` value wapas code ko deta hai. Agar result variable mein save karna ho to kya use hoga?";
    }
    return "Socratic Hint: Imagine a calculator screen (`print`) versus copying the number onto your notepad (`return`). Which one lets the next line of code reuse the result?";
  }

  if (language === "ur") {
    return `فہد، آپ کا سب سے اہم اگلا ہدف "${weakest?.nameUr}" (${weakest?.mastery}%) ہے۔ آپ صرف 10 یا 15 منٹ کا مائیکرو سیشن منتخب کر کے آہستہ آہستہ مہارت بڑھا سکتے ہیں۔`;
  }
  if (language === "roman_ur") {
    return `Fahad, aapka next focus "${weakest?.name}" (${weakest?.mastery}%) hona chahiye. Study Planner mein 10 ya 15 min slot chunein aur Socratic hints ke saath practice karein.`;
  }
  return `Your highest-impact focus right now is **${weakest?.name}** (${weakest?.mastery}%). What part of ${weakest?.name} feels trickiest—syntax, boundaries, or tracing output? Tell me and I'll walk you through a tiny 1-line check.`;
}

export function generateRuleBasedDrafts(
  notes: string,
  courseTitle: string,
  topicName: string
): {
  extractedConcepts: string[];
  drafts: Omit<EducatorDraftItem, "id" | "status" | "createdAt">[];
} {
  const sentences = notes
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12);

  const concepts =
    sentences
      .slice(0, 3)
      .map((s) => (s.length > 52 ? s.slice(0, 52) + "..." : s)) || [
      `Core ${topicName} syntax`,
      "Execution trace",
      "Edge cases",
    ];

  return {
    extractedConcepts:
      concepts.length > 0
        ? concepts
        : [`${topicName} fundamentals`, "Control flow", "Common pitfalls"],
    drafts: [
      {
        courseTitle,
        topicName,
        question: `Based on the ${topicName} notes, which statement best describes the primary rule?`,
        codeSnippet: `for idx in range(4):\n    print(idx)`,
        options: [
          "Executes cleanly for indices 0, 1, 2, 3",
          "Executes for indices 1, 2, 3, 4",
          "Runs infinitely without break",
          "Raises an index error",
        ],
        correctAnswer: "Executes cleanly for indices 0, 1, 2, 3",
        difficulty: "Easy",
        explanation:
          "Scaffolded check extracted from uploaded course notes for initial recall.",
      },
      {
        courseTitle,
        topicName,
        question: `How can you safely accumulate values across iterations in ${topicName}?`,
        codeSnippet: `total = 0\nfor x in [3, 5, 2]:\n    total += x`,
        options: [
          "Initialize total = 0 before the loop and update with +=",
          "Reset total = 0 inside the loop body",
          "Use print(x) instead of assignment",
          "Remove the colon after the loop header",
        ],
        correctAnswer:
          "Initialize total = 0 before the loop and update with +=",
        difficulty: "Medium",
        explanation:
          "Initializing outside the loop preserves accumulated state across passes.",
      },
      {
        courseTitle,
        topicName,
        question: `When refactoring repeated ${topicName} logic into a helper, what prevents silent None bugs?`,
        codeSnippet: `def sum_items(items):\n    total = sum(items)\n    return total`,
        options: [
          "Explicitly returning the computed value with return",
          "Using global variables for every counter",
          "Printing inside the loop without returning",
          "Omitting parameters",
        ],
        correctAnswer: "Explicitly returning the computed value with return",
        difficulty: "Hard",
        explanation:
          "Explicit returns ensure downstream functions receive structured values rather than None.",
      },
    ],
  };
}
