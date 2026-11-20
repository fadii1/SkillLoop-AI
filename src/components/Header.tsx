import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  Loader2,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import {
  Course,
  TopicMastery,
  UserRecord,
  UserRole,
} from "../types";
import { TranslationSet } from "../data/translations";
import { ASSETS } from "../data/seedData";
import { readImageAsAvatar } from "../utils/image";

interface HeaderProps {
  currentUser: UserRecord;
  role: UserRole;
  allowedRoles: UserRole[];
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
  onUpdateAvatar?: (dataUrl: string) => Promise<void> | void;
  courses: Course[];
  topics: TopicMastery[];
  onSelectCourse: (courseId: string) => void;
  onSelectTopicPractice: (topicId: string) => void;
  onOpenMobileMenu: () => void;
  t: TranslationSet;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  role,
  allowedRoles,
  onRoleChange,
  onLogout,
  onUpdateAvatar,
  courses,
  topics,
  onSelectCourse,
  onSelectTopicPractice,
  onOpenMobileMenu,
  t,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateAvatar) return;
    try {
      setUploadingAvatar(true);
      const dataUrl = await readImageAsAvatar(file);
      await onUpdateAvatar(dataUrl);
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
  };

  const canSwitchRoles = allowedRoles.length > 1;
  const canAccessLearner = allowedRoles.includes("learner");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearchFocused(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || !canAccessLearner) return { courses: [], topics: [] };
    return {
      courses: courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q)
      ),
      topics: topics.filter(
        (tp) =>
          tp.name.toLowerCase().includes(q) ||
          tp.summary.toLowerCase().includes(q)
      ),
    };
  }, [searchQuery, courses, topics, canAccessLearner]);

  const roleLabel =
    role === "learner"
      ? t.roles.learner
      : role === "educator"
      ? t.roles.educator
      : t.roles.admin;

  const roleOptions = (
    [
      { id: "learner", label: t.roles.learner, icon: UserCheck },
      { id: "educator", label: t.roles.educator, icon: Users },
      { id: "admin", label: t.roles.admin, icon: ShieldCheck },
    ] as const
  ).filter((opt) => allowedRoles.includes(opt.id));

  return (
    <header className="hc-card sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex flex-1 items-center gap-2.5 min-w-0 max-w-xs">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {canAccessLearner ? (
          <div className="relative flex-1 min-w-0">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
              placeholder="Search courses or topics..."
              aria-label="Search courses or topics"
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/80 ps-9 pe-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
            />

            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="hc-card absolute start-0 end-0 top-full z-40 mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                {searchResults.courses.length === 0 &&
                searchResults.topics.length === 0 ? (
                  <div className="px-3 py-4 text-center text-xs text-slate-500">
                    No results found.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {searchResults.courses.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onMouseDown={() => {
                          onRoleChange("learner");
                          onSelectCourse(c.id);
                          setSearchQuery("");
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-start text-xs hover:bg-indigo-50"
                      >
                        <span className="font-semibold text-slate-800 truncate pe-2">
                          {c.title}
                        </span>
                        <span className="tabular-nums font-semibold text-indigo-600 shrink-0">
                          {c.progress}%
                        </span>
                      </button>
                    ))}
                    {searchResults.topics.map((tp) => (
                      <button
                        key={tp.id}
                        type="button"
                        onMouseDown={() => {
                          onRoleChange("learner");
                          onSelectTopicPractice(tp.id);
                          setSearchQuery("");
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-start text-xs hover:bg-indigo-50"
                      >
                        <span className="font-semibold text-slate-800 truncate pe-2">
                          Practice: {tp.name}
                        </span>
                        <span className="tabular-nums font-semibold text-slate-600 shrink-0">
                          {tp.mastery}%
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm font-bold text-slate-800 truncate">
            Educator Workspace
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {canSwitchRoles && (
          <div
            className="hidden sm:flex h-9 items-center rounded-xl border border-slate-200 bg-slate-100/80 p-0.5"
            role="group"
            aria-label="Switch portal view"
          >
            {roleOptions.map(({ id, label, icon: Icon }) => {
              const active = role === id;
              const portalHref =
                id === "admin"
                  ? "/admin"
                  : id === "educator"
                  ? "/educator"
                  : "/dashboard";
              return (
                <a
                  key={id}
                  href={portalHref}
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                      e.preventDefault();
                      onRoleChange(id);
                    }
                  }}
                  className={`flex h-7 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    active
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{label}</span>
                </a>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <div className="relative group">
            <img
              src={currentUser.avatar || ASSETS.fahadAvatar}
              alt={`${currentUser.name || "Learner"} profile avatar`}
              width={36}
              height={36}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = ASSETS.fahadAvatar;
              }}
              className="h-9 w-9 rounded-full object-cover border-2 border-indigo-200/80 shadow-xs transition-transform group-hover:scale-105"
            />
            {onUpdateAvatar && (
              <>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  title="Change profile picture (Select from gallery)"
                  aria-label="Change profile picture"
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {uploadingAvatar ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <Camera className="h-4 w-4 text-white" />
                  )}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFile}
                />
              </>
            )}
            <span
              onClick={() => avatarInputRef.current?.click()}
              title="Change profile picture"
              className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white ring-2 ring-white shadow-xs cursor-pointer hover:bg-indigo-700 transition-colors"
            >
              <Camera className="h-2.5 w-2.5" />
            </span>
          </div>
          <div className="hidden md:block leading-tight">
            <div className="text-xs font-bold text-slate-900 whitespace-nowrap max-w-[130px] truncate">
              {currentUser.name}
            </div>
            <div className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
              {roleLabel}
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            title="Sign out"
            aria-label="Sign out"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
