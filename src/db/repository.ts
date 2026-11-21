import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleAuthProvider } from "../lib/firebase";
import {
  ActivityItem,
  AutoSavedQuizState,
  ConceptualFeedback,
  Course,
  EducatorDraftItem,
  QuizAttemptRecord,
  QuizQuestion,
  RecoveryLogEntry,
  SignupCodeRequestResult,
  StudyPlanRecord,
  TopicMastery,
  UserRecord,
  UserRole,
} from "../types";
import {
  ADMIN_RECOVERY_LOGS,
  DEMO_USERS,
  INITIAL_ACTIVITY,
  INITIAL_COURSES,
  INITIAL_EDUCATOR_DRAFTS,
  INITIAL_TOPIC_MASTERY,
  QUIZ_BANK,
} from "../data/seedData";

const KEYS = {
  SESSION: "skillloop_db_session_v1",
  TOKEN: "skillloop_auth_token_v1",
  COURSES: "skillloop_db_courses_v1",
  QUESTIONS: "skillloop_db_questions_v1",
  ATTEMPTS: "skillloop_db_attempts_v1",
  MASTERY: "skillloop_db_mastery_v1",
  STUDY_PLAN: "skillloop_db_study_plan_v1",
  AUTO_SAVED_QUIZ: "skillloop_db_autosaved_quiz_v1",
  RECOVERY_LOGS: "skillloop_db_recovery_logs_v1",
  DRAFTS: "skillloop_db_educator_drafts_v1",
  ACTIVITIES: "skillloop_db_activities_v1",
  FEEDBACK: "skillloop_db_feedback_v1",
  METRICS: "skillloop_db_metrics_v1",
};

// Firebase ID tokens are kept strictly in memory (never persisted to localStorage)
let inMemoryFirebaseToken: string | null = null;

/** Resets all user-specific app data to a clean blank slate in localStorage.
 *  Called on every login/signup so a new account never sees another user's data.
 *  We write explicit zero/empty values so readJson() never falls back to seeded dummy data. */
export function clearUserData(): void {
  if (typeof window === "undefined") return;

  // Reset courses to catalog but with all progress zeroed out
  const freshCourses = INITIAL_COURSES.map((c) => ({
    ...c,
    progress: 0,
    completedLessons: 0,
    status: "Not Started" as const,
    modules: c.modules?.map((m) => ({ ...m, completed: false })) ?? [],
  }));
  writeJson(KEYS.COURSES, freshCourses);

  // Topics with 0% initial mastery
  const freshTopics = INITIAL_TOPIC_MASTERY.map((t) => ({
    ...t,
    mastery: 0,
    retention_health: "Needs Review" as const,
    lastPracticedDaysAgo: 0,
  }));
  writeJson(KEYS.MASTERY, freshTopics);

  // Everything else starts completely empty
  writeJson(KEYS.ATTEMPTS, []);
  writeJson(KEYS.RECOVERY_LOGS, []);
  writeJson(KEYS.DRAFTS, []);
  writeJson(KEYS.ACTIVITIES, []);
  writeJson(KEYS.FEEDBACK, []);
  writeJson(KEYS.METRICS, { overallProgress: 0, quizAccuracy: 0, studyMinutesTotal: 0 });
  writeJson(KEYS.STUDY_PLAN, {
    selectedMinutes: 15,
    isRecoveryMode: false,
    completedStepIds: [],
    updatedAt: new Date().toISOString(),
  });
  window.localStorage.removeItem(KEYS.AUTO_SAVED_QUIZ);
  window.localStorage.removeItem(KEYS.QUESTIONS);
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or restricted
  }
}

function getAuthToken(): string | null {
  if (inMemoryFirebaseToken) return inMemoryFirebaseToken;
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEYS.TOKEN);
}

function setAuthToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(KEYS.TOKEN, token);
  } else {
    window.localStorage.removeItem(KEYS.TOKEN);
  }
}

async function parseApiJson(
  res: Response
): Promise<Record<string, unknown> | null> {
  try {
    const raw = await res.text();
    if (!raw) return null;
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getHttpFallbackError(res: Response, defaultMsg: string): string {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    return `${defaultMsg} Backend server not running or API route returned HTML. Please ensure Render is deployed as a Web Service (Node.js) and not a Static Site.`;
  }
  if (res.status === 502 || res.status === 504) {
    return `Server request timed out (HTTP ${res.status}). Please retry.`;
  }
  return `${defaultMsg} (HTTP ${res.status})`;
}

// 1. Backend-Authenticated Users & Signed Session Repository
export const AuthRepo = {
  getSession(): UserRecord | null {
    return readJson<UserRecord | null>(KEYS.SESSION, null);
  },

  getToken(): string | null {
    return getAuthToken();
  },

  async verifySessionOnServer(): Promise<UserRecord | null> {
    if (auth.currentUser && !inMemoryFirebaseToken) {
      try {
        inMemoryFirebaseToken = await auth.currentUser.getIdToken();
      } catch {
        // Ignore refresh error
      }
    }
    const token = getAuthToken();
    if (!token) return this.getSession();
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 404) {
        this.logout();
        return null;
      }
      if (!res.ok) return this.getSession();
      const data = await parseApiJson(res);
      if (data?.user) {
        writeJson(KEYS.SESSION, data.user);
        return data.user as UserRecord;
      }
    } catch {
      // Offline fallback keeps cached session
    }
    return this.getSession();
  },

  async loginWithGoogle(): Promise<{ user?: UserRecord; error?: string }> {
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await cred.user.getIdToken();
      inMemoryFirebaseToken = idToken;

      const res = await fetch("/api/auth/firebase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data = await parseApiJson(res);
      if (!res.ok || !data?.user) {
        inMemoryFirebaseToken = null;
        return {
          error:
            (typeof data?.error === "string" && data.error) ||
            getHttpFallbackError(res, "Unable to verify Google account."),
        };
      }
      clearUserData();
      writeJson(KEYS.SESSION, data.user);
      return { user: data.user as UserRecord };
    } catch (err) {
      inMemoryFirebaseToken = null;
      const msg =
        err instanceof Error && err.message.includes("popup-closed-by-user")
          ? "Google sign-in popup was closed."
          : "Google sign-in could not be completed. Please try again.";
      return { error: msg };
    }
  },

  async loginWithEmail(
    email: string,
    password: string
  ): Promise<{ user?: UserRecord; error?: string }> {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await parseApiJson(res);
      if (!res.ok || !data) {
        return {
          error:
            (typeof data?.error === "string" && data.error) ||
            getHttpFallbackError(res, "Invalid email or password."),
        };
      }
      inMemoryFirebaseToken = null;
      clearUserData();
      setAuthToken(String(data.token ?? ""));
      writeJson(KEYS.SESSION, data.user);
      return { user: data.user as UserRecord };
    } catch {
      return {
        error:
          "Unable to reach authentication server. Please check connection or use Demo Access.",
      };
    }
  },

  async loginDemo(role: UserRole): Promise<{ user: UserRecord; offline?: boolean }> {
    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        const data = await parseApiJson(res);
        if (data?.user && data?.token) {
          inMemoryFirebaseToken = null;
          setAuthToken(String(data.token));
          writeJson(KEYS.SESSION, data.user);
          return { user: data.user as UserRecord };
        }
      }
    } catch {
      // Offline fallback below
    }
    const fallback =
      DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    const updatedUser: UserRecord = {
      ...fallback,
      last_active_at: new Date().toISOString(),
    };
    writeJson(KEYS.SESSION, updatedUser);
    return { user: updatedUser, offline: true };
  },

  async requestSignupCode(params: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }): Promise<SignupCodeRequestResult> {
    try {
      const res = await fetch("/api/auth/signup/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await parseApiJson(res);
      if (!res.ok || !data) {
        return {
          error:
            (typeof data?.error === "string" && data.error) ||
            getHttpFallbackError(res, "Unable to send verification code."),
        };
      }
      return data as unknown as SignupCodeRequestResult;
    } catch {
      return {
        error:
          "Unable to connect to the verification server. Please wait a moment and retry.",
      };
    }
  },

  async verifySignupCode(params: {
    email: string;
    code: string;
  }): Promise<{ user?: UserRecord; error?: string }> {
    try {
      const res = await fetch("/api/auth/signup/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await parseApiJson(res);
      if (!res.ok || !data) {
        return {
          error:
            (typeof data?.error === "string" && data.error) ||
            getHttpFallbackError(res, "Verification failed."),
        };
      }
      inMemoryFirebaseToken = null;
      clearUserData();
      setAuthToken(String(data.token ?? ""));
      writeJson(KEYS.SESSION, data.user);
      return { user: data.user as UserRecord };
    } catch {
      return {
        error:
          "Unable to connect to the verification server. Please wait a moment and retry.",
      };
    }
  },

  async signup(params: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }): Promise<{ user?: UserRecord; error?: string }> {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await parseApiJson(res);
      if (!res.ok || !data) {
        return {
          error:
            (typeof data?.error === "string" && data.error) ||
            getHttpFallbackError(res, "Unable to create account."),
        };
      }
      inMemoryFirebaseToken = null;
      clearUserData();
      setAuthToken(String(data.token ?? ""));
      writeJson(KEYS.SESSION, data.user);
      return { user: data.user as UserRecord };
    } catch {
      return {
        error:
          "Unable to connect to the verification server. Please wait a moment and retry.",
      };
    }
  },

  updateCurrentUser(patch: Partial<UserRecord>): UserRecord | null {
    const current = this.getSession();
    if (!current) return null;
    const updated: UserRecord = { ...current, ...patch };
    writeJson(KEYS.SESSION, updated);

    const token = getAuthToken();
    if (token) {
      void fetch("/api/auth/preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          preferred_language: updated.preferred_language,
          accessibility_prefs: updated.accessibility_prefs,
          last_active_at: updated.last_active_at,
          avatar: updated.avatar,
        }),
      }).catch(() => {});
    }

    return updated;
  },

  async updateAvatar(avatarDataUrl: string): Promise<UserRecord | null> {
    const current = this.getSession();
    if (!current) return null;
    const updated: UserRecord = { ...current, avatar: avatarDataUrl };
    writeJson(KEYS.SESSION, updated);

    const token = getAuthToken();
    if (token) {
      try {
        const res = await fetch("/api/auth/avatar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar: avatarDataUrl }),
        });
        if (res.ok) {
          const data = await parseApiJson(res);
          if (data?.user) {
            writeJson(KEYS.SESSION, data.user);
            return data.user as UserRecord;
          }
        }
      } catch {
        // Cached locally if offline
      }
    }
    return updated;
  },

  logout(): void {
    inMemoryFirebaseToken = null;
    setAuthToken(null);
    if (auth.currentUser) {
      void signOut(auth).catch(() => {});
    }
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(KEYS.SESSION);
      clearUserData();
    }
  },
};

// 2. Courses & Lessons Repository
export const CourseRepo = {
  getAll(): Course[] {
    const saved = readJson<Course[]>(KEYS.COURSES, INITIAL_COURSES);
    // Merge new courses or modules seamlessly if local cache is from an older version
    if (!saved || saved.length < INITIAL_COURSES.length) {
      const merged = INITIAL_COURSES.map((init) => {
        const found = saved?.find((s) => s.id === init.id);
        if (!found) return init;
        return {
          ...init,
          progress: found.progress ?? 0,
          status: found.status ?? "Not Started",
          completedLessons: found.completedLessons ?? 0,
          modules: init.modules.map((m) => {
            const savedMod = found.modules?.find((sm) => sm.id === m.id);
            return savedMod ? { ...m, completed: savedMod.completed } : m;
          }),
        };
      });
      writeJson(KEYS.COURSES, merged);
      return merged;
    }
    return saved;
  },
  saveAll(courses: Course[]): void {
    writeJson(KEYS.COURSES, courses);
  },
};

// 3. Questions Repository
export const QuestionRepo = {
  getAll(): QuizQuestion[] {
    return readJson<QuizQuestion[]>(KEYS.QUESTIONS, QUIZ_BANK);
  },
  saveAll(questions: QuizQuestion[]): void {
    writeJson(KEYS.QUESTIONS, questions);
  },
  publishEducatorDraft(
    draft: EducatorDraftItem,
    topics: TopicMastery[]
  ): QuizQuestion {
    const matchedTopic =
      topics.find(
        (t) => t.name.toLowerCase() === draft.topicName.toLowerCase()
      ) || topics[2];

    const newQuestion: QuizQuestion = {
      id: `q-edu-${draft.id}`,
      courseId: matchedTopic?.courseId || "python-101",
      topicId: matchedTopic?.id || "topic-loops",
      topicName: draft.topicName,
      difficulty: draft.difficulty,
      question: draft.question,
      questionUr: draft.question,
      questionRomanUr: draft.question,
      codeSnippet: draft.codeSnippet,
      options: draft.options,
      correctAnswer: draft.correctAnswer,
      conceptHint: draft.explanation,
      approved_by_educator: true,
    };

    const existing = this.getAll();
    const filtered = existing.filter((q) => q.id !== newQuestion.id);
    const next = [newQuestion, ...filtered];
    this.saveAll(next);
    return newQuestion;
  },
};

// 4. Mastery Records & Quiz Attempts Repository
export const MasteryRepo = {
  getTopics(): TopicMastery[] {
    const saved = readJson<TopicMastery[]>(KEYS.MASTERY, INITIAL_TOPIC_MASTERY);
    if (!saved || saved.length < INITIAL_TOPIC_MASTERY.length) {
      const merged = INITIAL_TOPIC_MASTERY.map((init) => {
        const found = saved?.find((s) => s.id === init.id);
        return found ? { ...init, ...found } : init;
      });
      writeJson(KEYS.MASTERY, merged);
      return merged;
    }
    return saved;
  },
  saveTopics(topics: TopicMastery[]): void {
    writeJson(KEYS.MASTERY, topics);
  },
  getAttempts(): QuizAttemptRecord[] {
    return readJson<QuizAttemptRecord[]>(KEYS.ATTEMPTS, []);
  },
  recordAttempt(attempt: QuizAttemptRecord): QuizAttemptRecord[] {
    const next = [attempt, ...this.getAttempts()].slice(0, 100);
    writeJson(KEYS.ATTEMPTS, next);

    const token = getAuthToken();
    if (token) {
      void fetch("/api/attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(attempt),
      }).catch(() => {});
    }

    return next;
  },
};

// 5. Study Plans, Auto-Saved Quiz State, & Recovery Logs Repository
export const StudyPlanRepo = {
  getPlan(): StudyPlanRecord {
    return readJson<StudyPlanRecord>(KEYS.STUDY_PLAN, {
      selectedMinutes: 15,
      isRecoveryMode: false,
      completedStepIds: [],
      updatedAt: new Date().toISOString(),
    });
  },
  savePlan(plan: StudyPlanRecord): void {
    writeJson(KEYS.STUDY_PLAN, plan);
  },
  getAutoSavedQuiz(): AutoSavedQuizState | null {
    return readJson<AutoSavedQuizState | null>(KEYS.AUTO_SAVED_QUIZ, null);
  },
  saveAutoSavedQuiz(state: AutoSavedQuizState | null): void {
    if (!state) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(KEYS.AUTO_SAVED_QUIZ);
      }
      return;
    }
    writeJson(KEYS.AUTO_SAVED_QUIZ, state);
  },
  getRecoveryLogs(): RecoveryLogEntry[] {
    return readJson<RecoveryLogEntry[]>(KEYS.RECOVERY_LOGS, ADMIN_RECOVERY_LOGS);
  },
  saveRecoveryLogs(logs: RecoveryLogEntry[]): void {
    writeJson(KEYS.RECOVERY_LOGS, logs);
  },
};

// 6. Drafts, Activities, Feedback, Metrics Repository
export const AppStateRepo = {
  getDrafts(): EducatorDraftItem[] {
    return readJson<EducatorDraftItem[]>(KEYS.DRAFTS, INITIAL_EDUCATOR_DRAFTS);
  },
  saveDrafts(drafts: EducatorDraftItem[]): void {
    writeJson(KEYS.DRAFTS, drafts);
  },
  getActivities(): ActivityItem[] {
    return readJson<ActivityItem[]>(KEYS.ACTIVITIES, INITIAL_ACTIVITY);
  },
  saveActivities(items: ActivityItem[]): void {
    writeJson(KEYS.ACTIVITIES, items);
  },
  getFeedback(): ConceptualFeedback[] {
    return readJson<ConceptualFeedback[]>(KEYS.FEEDBACK, []);
  },
  saveFeedback(items: ConceptualFeedback[]): void {
    writeJson(KEYS.FEEDBACK, items);
  },
  getMetrics(): {
    overallProgress: number;
    quizAccuracy: number;
    studyMinutesTotal: number;
  } {
    return readJson(KEYS.METRICS, {
      overallProgress: 0,
      quizAccuracy: 0,
      studyMinutesTotal: 0,
    });
  },
  saveMetrics(metrics: {
    overallProgress: number;
    quizAccuracy: number;
    studyMinutesTotal: number;
  }): void {
    writeJson(KEYS.METRICS, metrics);
  },
};

export interface UserWorkspaceData {
  courses?: Course[];
  topics?: TopicMastery[];
  activities?: ActivityItem[];
  feedback?: ConceptualFeedback[];
  metrics?: {
    overallProgress: number;
    quizAccuracy: number;
    studyMinutesTotal: number;
  };
  drafts?: EducatorDraftItem[];
  recoveryLogs?: RecoveryLogEntry[];
}

// 7. Cloud SQL / PostgreSQL User Workspace Repository
export const WorkspaceRepo = {
  async loadFromServer(): Promise<UserWorkspaceData | null> {
    const token = getAuthToken();
    if (!token) return null;
    try {
      const res = await fetch("/api/workspace", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const data = await parseApiJson(res);
      if (
        data?.workspace &&
        typeof data.workspace === "object" &&
        !Array.isArray(data.workspace)
      ) {
        const ws = data.workspace as UserWorkspaceData;
        if (ws.courses && Array.isArray(ws.courses)) {
          writeJson(KEYS.COURSES, ws.courses);
        }
        if (ws.topics && Array.isArray(ws.topics)) {
          writeJson(KEYS.MASTERY, ws.topics);
        }
        if (ws.activities && Array.isArray(ws.activities)) {
          writeJson(KEYS.ACTIVITIES, ws.activities);
        }
        if (ws.feedback && Array.isArray(ws.feedback)) {
          writeJson(KEYS.FEEDBACK, ws.feedback);
        }
        if (ws.metrics) {
          writeJson(KEYS.METRICS, ws.metrics);
        }
        if (ws.drafts && Array.isArray(ws.drafts)) {
          writeJson(KEYS.DRAFTS, ws.drafts);
        }
        if (ws.recoveryLogs && Array.isArray(ws.recoveryLogs)) {
          writeJson(KEYS.RECOVERY_LOGS, ws.recoveryLogs);
        }
        return ws;
      }
    } catch {
      // Offline fallback
    }
    return null;
  },

  async saveToServer(workspace: UserWorkspaceData): Promise<boolean> {
    const token = getAuthToken();
    if (!token) return false;
    try {
      const res = await fetch("/api/workspace", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ workspace }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};

