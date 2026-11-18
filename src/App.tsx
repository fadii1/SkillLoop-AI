import { useEffect, useState } from "react";
import {
  ActivityItem,
  AutoSavedQuizState,
  ConceptualFeedback,
  Course,
  EducatorDraftItem,
  LanguageCode,
  NavTab,
  QuizAttemptRecord,
  QuizQuestion,
  RecoveryLogEntry,
  TopicMastery,
  UserRecord,
  UserRole,
} from "./types";
import { TRANSLATIONS } from "./data/translations";
import {
  AppStateRepo,
  AuthRepo,
  CourseRepo,
  MasteryRepo,
  QuestionRepo,
  StudyPlanRepo,
} from "./db/repository";
import { speakText, stopSpeaking } from "./utils/speech";
import {
  evaluateRouteAccess,
  getAllowedRolesForUser,
  getDefaultPathForRole,
  normalizePathname,
  routeStateToPath,
} from "./utils/router";
import { ShieldAlert, X } from "lucide-react";
import { AuthScreen } from "./components/AuthScreen";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { LearnerDashboard } from "./components/LearnerDashboard";
import { SmartPracticeView } from "./components/SmartPracticeView";
import { InactivityRecoveryModal } from "./components/InactivityRecoveryModal";
import { EducatorPortal } from "./components/EducatorPortal";
import { AdminDashboard } from "./components/AdminDashboard";
import { AiTutorDrawer } from "./components/AiTutorDrawer";
import {
  CoursesView,
  FeedbackHistoryView,
  PlannerView,
  ProgressView,
  ResourcesView,
  SettingsView,
} from "./components/SecondaryViews";

export default function App() {
  const initialSession = AuthRepo.getSession();
  const initialEval = evaluateRouteAccess(
    typeof window !== "undefined" ? window.location.pathname : "/",
    initialSession?.role ?? null
  );

  const [currentUser, setCurrentUser] = useState<UserRecord | null>(
    initialSession
  );
  const [role, setRole] = useState<UserRole>(initialEval.resolved.portal);
  const [educatorSubTab, setEducatorSubTab] = useState<"generator" | "cohort">(
    initialEval.resolved.educatorSubTab
  );
  const [activeTab, setActiveTab] = useState<NavTab>(
    initialEval.resolved.learnerTab
  );
  const [routeNotice, setRouteNotice] = useState<string | null>(
    initialEval.deniedReason
  );
  const [language, setLanguage] = useState<LanguageCode>(
    () => AuthRepo.getSession()?.preferred_language || "en"
  );
  const [largerText, setLargerText] = useState(
    () => AuthRepo.getSession()?.accessibility_prefs.fontSize === "large"
  );
  const [highContrast, setHighContrast] = useState(
    () => AuthRepo.getSession()?.accessibility_prefs.highContrast || false
  );
  const [ttsEnabled, setTtsEnabled] = useState(
    () => AuthRepo.getSession()?.accessibility_prefs.ttsEnabled ?? true
  );
  const [, setIsSpeaking] = useState(false);
  const [offlineFallbackOnly, setOfflineFallbackOnly] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persistent Repository State
  const [courses, setCourses] = useState<Course[]>(() => CourseRepo.getAll());
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    QuestionRepo.getAll()
  );
  const [topics, setTopics] = useState<TopicMastery[]>(() =>
    MasteryRepo.getTopics()
  );
  const [activities, setActivities] = useState<ActivityItem[]>(() =>
    AppStateRepo.getActivities()
  );

  const initialMetrics = AppStateRepo.getMetrics();
  const [overallProgress, setOverallProgress] = useState(
    initialMetrics.overallProgress
  );
  const [quizAccuracy, setQuizAccuracy] = useState(initialMetrics.quizAccuracy);
  const [studyMinutesTotal, setStudyMinutesTotal] = useState(
    initialMetrics.studyMinutesTotal
  );

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    "python-101"
  );
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<ConceptualFeedback[]>(
    () => AppStateRepo.getFeedback()
  );
  const [autoSavedQuiz, setAutoSavedQuiz] = useState<AutoSavedQuizState | null>(
    () => StudyPlanRepo.getAutoSavedQuiz()
  );

  const [tutorOpen, setTutorOpen] = useState(false);
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);
  const [recoveryBannerActive, setRecoveryBannerActive] = useState(
    () => StudyPlanRepo.getPlan().isRecoveryMode
  );

  const [educatorDrafts, setEducatorDrafts] = useState<EducatorDraftItem[]>(
    () => AppStateRepo.getDrafts()
  );
  const [adminLogs, setAdminLogs] = useState<RecoveryLogEntry[]>(() =>
    StudyPlanRepo.getRecoveryLogs()
  );

  const t = TRANSLATIONS[language];

  // Enforce URL Route Protection on mount, auth changes, and browser Back/Forward
  useEffect(() => {
    const syncWithCurrentUrl = (replace = false) => {
      const check = evaluateRouteAccess(
        window.location.pathname,
        currentUser?.role ?? null
      );
      if (check.redirectPath) {
        if (replace) {
          window.history.replaceState(null, "", check.redirectPath);
        } else {
          window.history.pushState(null, "", check.redirectPath);
        }
      }
      if (check.deniedReason) {
        setRouteNotice(check.deniedReason);
      }
      if (currentUser) {
        setRole(check.resolved.portal);
        setActiveTab(check.resolved.learnerTab);
        setEducatorSubTab(check.resolved.educatorSubTab);
      }
    };

    syncWithCurrentUrl(true);

    const onPopState = () => syncWithCurrentUrl(true);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [currentUser?.id, currentUser?.role]);

  // Keep browser URL synchronized when navigating within authorized portals
  useEffect(() => {
    if (!currentUser) return;
    const allowedPortals = getAllowedRolesForUser(currentUser.role);
    const safePortal = allowedPortals.includes(role) ? role : currentUser.role;
    const targetPath = routeStateToPath({
      portal: safePortal,
      learnerTab: activeTab,
      educatorSubTab,
    });
    if (normalizePathname(window.location.pathname) !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  }, [currentUser, role, activeTab, educatorSubTab]);

  // Verify stored Bearer session token with backend on mount
  useEffect(() => {
    void AuthRepo.verifySessionOnServer().then((verifiedUser) => {
      if (!verifiedUser) {
        setCurrentUser(null);
      } else {
        setCurrentUser(verifiedUser);
        const permitted = getAllowedRolesForUser(verifiedUser.role);
        setRole((prev) =>
          permitted.includes(prev) ? prev : verifiedUser.role
        );
      }
    });
  }, []);

  // Sync accessibility & RTL attributes on <html>
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("larger-text", largerText);
    html.classList.toggle("high-contrast", highContrast);
    html.dir = language === "ur" ? "rtl" : "ltr";
    html.lang = language === "ur" ? "ur" : "en";

    if (currentUser) {
      AuthRepo.updateCurrentUser({
        preferred_language: language,
        accessibility_prefs: {
          fontSize: largerText ? "large" : "normal",
          highContrast,
          ttsEnabled,
        },
      });
    }
  }, [largerText, highContrast, ttsEnabled, language, currentUser?.id]);

  // Persist repository updates cleanly
  useEffect(() => {
    CourseRepo.saveAll(courses);
  }, [courses]);

  useEffect(() => {
    MasteryRepo.saveTopics(topics);
  }, [topics]);

  useEffect(() => {
    AppStateRepo.saveActivities(activities);
  }, [activities]);

  useEffect(() => {
    AppStateRepo.saveFeedback(feedbackHistory);
  }, [feedbackHistory]);

  useEffect(() => {
    AppStateRepo.saveMetrics({
      overallProgress,
      quizAccuracy,
      studyMinutesTotal,
    });
  }, [overallProgress, quizAccuracy, studyMinutesTotal]);

  useEffect(() => {
    AppStateRepo.saveDrafts(educatorDrafts);
  }, [educatorDrafts]);

  useEffect(() => {
    StudyPlanRepo.saveRecoveryLogs(adminLogs);
  }, [adminLogs]);

  const handleAuthenticated = (user: UserRecord) => {
    setCurrentUser(user);
    setRole(user.role);
    setEducatorSubTab("generator");
    setLanguage(user.preferred_language || "en");
    setLargerText(user.accessibility_prefs?.fontSize === "large");
    setHighContrast(Boolean(user.accessibility_prefs?.highContrast));
    setTtsEnabled(user.accessibility_prefs?.ttsEnabled ?? true);
    setActiveTab("dashboard");
    setRouteNotice(null);
    window.history.replaceState(null, "", getDefaultPathForRole(user.role));
  };

  const handleLogout = () => {
    stopSpeaking();
    AuthRepo.logout();
    setCurrentUser(null);
    setRouteNotice(null);
    window.history.replaceState(null, "", "/login");
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F4F7FE]">
        {routeNotice && (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-xs font-semibold text-amber-900">
            {routeNotice}
          </div>
        )}
        <AuthScreen onAuthenticated={handleAuthenticated} />
      </div>
    );
  }

  const allowedRoles = getAllowedRolesForUser(currentUser.role);
  const effectiveRole: UserRole = allowedRoles.includes(role)
    ? role
    : currentUser.role;

  const handleRoleChange = (nextRole: UserRole) => {
    if (!allowedRoles.includes(nextRole)) {
      setRouteNotice("Access denied: You do not have permission for that portal.");
      return;
    }
    setRouteNotice(null);
    setRole(nextRole);
  };

  const handleSpeak = (text: string) => {
    if (!ttsEnabled) {
      setTtsEnabled(true);
    }
    speakText(
      text,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleUpdateMastery = (topicId: string, delta: number) => {
    setTopics((prev) =>
      prev.map((tp) => {
        if (tp.id !== topicId) return tp;
        const nextVal = Math.min(100, tp.mastery + delta);
        const health: TopicMastery["retention_health"] =
          nextVal >= 75
            ? "Healthy"
            : nextVal >= 45
            ? "Needs Review"
            : "At Risk";
        return {
          ...tp,
          mastery: nextVal,
          retention_health: health,
          lastPracticedDaysAgo: 0,
        };
      })
    );
    setOverallProgress((prev) => Math.min(100, prev + 1));
    setQuizAccuracy((prev) => Math.min(99, prev + 1));
  };

  const handleRecordAttempt = (attempt: QuizAttemptRecord) => {
    MasteryRepo.recordAttempt(attempt);
  };

  const handleRecordFeedback = (fb: ConceptualFeedback) => {
    setFeedbackHistory((prev) => [fb, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: `Smart Practice: ${fb.topicName}`,
        meta: fb.isCorrect
          ? "Answered accurately · Mastery boosted"
          : "Conceptual misconception clarified",
        score: fb.isCorrect ? "+6% mastery" : "Reviewed",
        timeAgo: "Just now",
        type: "quiz",
      },
      ...prev,
    ]);
  };

  const handleAutoSaveQuiz = (state: AutoSavedQuizState | null) => {
    setAutoSavedQuiz(state);
    StudyPlanRepo.saveAutoSavedQuiz(state);
  };

  const handleCompleteSessionMinutes = (minutes: number, topicName: string) => {
    setStudyMinutesTotal((prev) => prev + minutes);
    StudyPlanRepo.savePlan({
      selectedMinutes: minutes,
      isRecoveryMode: recoveryBannerActive,
      completedStepIds: [],
      updatedAt: new Date().toISOString(),
    });
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: `Completed ${minutes}-min Micro-Session`,
        meta: `Study Planner · Focus: ${topicName}`,
        score: `+${minutes}m`,
        timeAgo: "Just now",
        type: "concept",
      },
      ...prev,
    ]);
  };

  const handleCompleteLesson = (courseId: string, moduleId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const updatedModules = c.modules.map((m) =>
          m.id === moduleId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedModules.filter((m) => m.completed).length;
        const ratio = Math.round(
          (completedCount / Math.max(updatedModules.length, 1)) * 100
        );
        return {
          ...c,
          modules: updatedModules,
          completedLessons: completedCount,
          status: ratio > 0 ? "In Progress" : "Not Started",
          progress: c.id === "python-101" ? Math.max(68, ratio) : ratio,
        };
      })
    );
  };

  const handleApplyRecoveryPlan = (gaps: string[]) => {
    setRecoveryBannerActive(true);
    StudyPlanRepo.savePlan({
      selectedMinutes: 10,
      isRecoveryMode: true,
      completedStepIds: [],
      updatedAt: new Date().toISOString(),
    });
    const updated = AuthRepo.updateCurrentUser({
      last_active_at: new Date().toISOString(),
    });
    if (updated) setCurrentUser(updated);

    setActivities((prev) => [
      {
        id: `act-rec-${Date.now()}`,
        title: "5-Day Absence Recovery Completed",
        meta: `68% progress preserved · 10-min catch-up for ${gaps.join(" & ")}`,
        score: "Zero Penalty",
        timeAgo: "Just now",
        type: "recovery",
      },
      ...prev,
    ]);
    setAdminLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: "Just now",
        event: "Learner Completed Absence Recovery Diagnostic",
        component: "Adaptive Recovery Engine",
        severity: "Resolved",
        detail: `Preserved 68% Python progress; saved 10-min catch-up plan for ${gaps.join(
          ", "
        )}.`,
      },
      ...prev,
    ]);
  };

  const handleUpdateDraftStatus = (
    id: string,
    status: "Approved" | "Rejected"
  ) => {
    setEducatorDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
    if (status === "Approved") {
      const target = educatorDrafts.find((d) => d.id === id);
      if (target) {
        const published = QuestionRepo.publishEducatorDraft(target, topics);
        setQuestions((prev) => {
          const rest = prev.filter((q) => q.id !== published.id);
          return [published, ...rest];
        });
      }
    }
  };

  const pythonCourse = courses.find((c) => c.id === "python-101");

  return (
    <div className="hc-canvas flex min-h-screen bg-[#F4F7FE] text-slate-900">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          role={effectiveRole}
          allowedRoles={allowedRoles}
          onRoleChange={handleRoleChange}
          educatorSubTab={educatorSubTab}
          onSelectEducatorSubTab={setEducatorSubTab}
          language={language}
          onOpenTutor={() => setTutorOpen(true)}
          t={t}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            currentUser={currentUser}
            role={effectiveRole}
            allowedRoles={allowedRoles}
            onRoleChange={handleRoleChange}
            onLogout={handleLogout}
            courses={courses}
            topics={topics}
            onSelectCourse={(courseId) => {
              if (!allowedRoles.includes("learner")) return;
              setSelectedCourseId(courseId);
              setActiveTab("courses");
            }}
            onSelectTopicPractice={(topicId) => {
              if (!allowedRoles.includes("learner")) return;
              setSelectedTopicId(topicId);
              setActiveTab("practice");
            }}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            t={t}
          />

        <main className="mx-auto w-full max-w-[1380px] flex-1 p-3.5 sm:p-6 lg:p-7">
          {routeNotice && (
            <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                <span>{routeNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setRouteNotice(null)}
                className="rounded-lg p-1 text-amber-700 hover:bg-amber-100"
                aria-label="Dismiss route warning"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          {effectiveRole === "educator" ? (
            <EducatorPortal
              drafts={educatorDrafts}
              onAddDrafts={(newItems) =>
                setEducatorDrafts((prev) => [...newItems, ...prev])
              }
              onUpdateDraftStatus={handleUpdateDraftStatus}
              onEditDraft={(id, updated) =>
                setEducatorDrafts((prev) =>
                  prev.map((d) => (d.id === id ? { ...d, ...updated } : d))
                )
              }
              offlineFallbackOnly={offlineFallbackOnly}
              activeSubTab={educatorSubTab}
              onSubTabChange={setEducatorSubTab}
            />
          ) : effectiveRole === "admin" ? (
            <AdminDashboard
              logs={adminLogs}
              approvedDraftsCount={
                educatorDrafts.filter((d) => d.status === "Approved").length
              }
              feedbackCount={feedbackHistory.length}
            />
          ) : activeTab === "dashboard" ? (
            <LearnerDashboard
              userName={currentUser.name}
              courses={courses}
              topics={topics}
              activities={activities}
              overallProgress={overallProgress}
              quizAccuracy={quizAccuracy}
              streakDays={currentUser.streak_days || 7}
              studyMinutesTotal={studyMinutesTotal}
              language={language}
              t={t}
              onNavigateTab={setActiveTab}
              onOpenCourse={(courseId) => {
                setSelectedCourseId(courseId);
                setActiveTab("courses");
              }}
              onStartTopicPractice={(topicId) => {
                setSelectedTopicId(topicId);
                setActiveTab("practice");
              }}
              onCompleteSessionMinutes={handleCompleteSessionMinutes}
              recoveryPlanBanner={recoveryBannerActive}
              onOpenRecoveryModal={() => setRecoveryModalOpen(true)}
            />
          ) : activeTab === "practice" ? (
            <SmartPracticeView
              userId={currentUser.id}
              questions={questions}
              topics={topics}
              selectedTopicId={selectedTopicId}
              onSelectTopicId={setSelectedTopicId}
              autoSavedQuiz={autoSavedQuiz}
              onAutoSaveQuiz={handleAutoSaveQuiz}
              language={language}
              t={t}
              offlineFallbackOnly={offlineFallbackOnly}
              onUpdateMastery={handleUpdateMastery}
              onRecordFeedback={handleRecordFeedback}
              onRecordAttempt={handleRecordAttempt}
              onSpeakText={handleSpeak}
            />
          ) : activeTab === "courses" ? (
            <CoursesView
              courses={courses}
              selectedCourseId={selectedCourseId}
              onSelectCourse={setSelectedCourseId}
              onCompleteLesson={handleCompleteLesson}
              onPracticeCourse={() => setActiveTab("practice")}
              onSpeakText={handleSpeak}
            />
          ) : activeTab === "planner" ? (
            <PlannerView
              topics={topics}
              onCompleteSessionMinutes={handleCompleteSessionMinutes}
              onStartPractice={() => setActiveTab("practice")}
            />
          ) : activeTab === "progress" ? (
            <ProgressView
              topics={topics}
              overallProgress={overallProgress}
              quizAccuracy={quizAccuracy}
            />
          ) : activeTab === "feedback" ? (
            <FeedbackHistoryView
              history={feedbackHistory}
              onGoToPractice={() => setActiveTab("practice")}
              onSpeakText={handleSpeak}
            />
          ) : activeTab === "resources" ? (
            <ResourcesView
              onSpeakText={handleSpeak}
              onStartPractice={() => setActiveTab("practice")}
            />
          ) : (
            <SettingsView
              largerText={largerText}
              onToggleLargerText={() => setLargerText((p) => !p)}
              highContrast={highContrast}
              onToggleHighContrast={() => setHighContrast((p) => !p)}
              ttsEnabled={ttsEnabled}
              onToggleTts={() => {
                if (ttsEnabled) stopSpeaking();
                setIsSpeaking(false);
                setTtsEnabled((p) => !p);
              }}
              language={language}
              onLanguageChange={setLanguage}
              offlineFallbackOnly={offlineFallbackOnly}
              onToggleOfflineMode={() => setOfflineFallbackOnly((p) => !p)}
              onOpenRecoveryModal={() => setRecoveryModalOpen(true)}
            />
          )}
        </main>
      </div>

      <InactivityRecoveryModal
        isOpen={recoveryModalOpen}
        onClose={() => setRecoveryModalOpen(false)}
        pythonProgress={pythonCourse?.progress ?? 68}
        topics={topics}
        onApplyRecoveryPlan={handleApplyRecoveryPlan}
      />

      <AiTutorDrawer
        isOpen={tutorOpen}
        onClose={() => setTutorOpen(false)}
        learnerName={currentUser.name}
        topics={topics}
        language={language}
        offlineFallbackOnly={offlineFallbackOnly}
        onSpeakText={handleSpeak}
      />
    </div>
  );
}
