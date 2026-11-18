import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { UserRecord, UserRole } from "../types";
import { AuthRepo } from "../db/repository";

interface AuthScreenProps {
  onAuthenticated: (user: UserRecord) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [signupStep, setSignupStep] = useState<"form" | "verify">("form");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("fahad@skillloop.ai");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);
  const [signupRole, setSignupRole] = useState<UserRole>("learner");

  const [otpDigits, setOtpDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleOtpChange = (index: number, rawVal: string) => {
    const cleaned = rawVal.replace(/\D/g, "");
    if (!cleaned) {
      const next = [...otpDigits];
      next[index] = "";
      setOtpDigits(next);
      return;
    }

    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split("");
      const next = ["", "", "", "", "", ""];
      chars.forEach((ch, idx) => {
        next[idx] = ch;
      });
      setOtpDigits(next);
      const focusIdx = Math.min(5, chars.length);
      otpInputRefs.current[focusIdx]?.focus();
      return;
    }

    const next = [...otpDigits];
    next[index] = cleaned;
    setOtpDigits(next);
    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length > 0) {
      e.preventDefault();
      const next = ["", "", "", "", "", ""];
      pasted.split("").forEach((ch, idx) => {
        next[idx] = ch;
      });
      setOtpDigits(next);
      otpInputRefs.current[Math.min(5, pasted.length - 1)]?.focus();
    }
  };

  const handleRequestCode = async () => {
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError(
        "Please enter your full name, a valid email, and a password (min 6 characters)."
      );
      return;
    }
    setError(null);
    setInfoMsg(null);
    setSubmitting(true);

    try {
      const res = await AuthRepo.requestSignupCode({
        name: name.trim(),
        email: email.trim(),
        password,
        role: signupRole,
      });

      if (res.error || !res.ok) {
        setError(res.error || "Unable to send verification code.");
        return;
      }

      setSignupStep("verify");
      setOtpDigits(["", "", "", "", "", ""]);
      setResendCooldown(20);
      setInfoMsg(
        `A 6-digit verification code has been sent to ${res.email}. Please check your Inbox or Spam folder.`
      );
      setTimeout(() => otpInputRefs.current[0]?.focus(), 80);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const code = otpDigits.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits of your verification code.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const res = await AuthRepo.verifySignupCode({
        email: email.trim(),
        code,
      });
      if (res.error || !res.user) {
        setError(res.error || "Invalid verification code.");
        return;
      }
      onAuthenticated(res.user);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    if (mode === "login") {
      setSubmitting(true);
      try {
        const res = await AuthRepo.loginWithEmail(email, password);
        if (res.error || !res.user) {
          setError(res.error || "Unable to sign in.");
          return;
        }
        onAuthenticated(res.user);
      } finally {
        setSubmitting(false);
      }
    } else {
      await handleRequestCode();
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const { user } = await AuthRepo.loginDemo(role);
      onAuthenticated(user);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await AuthRepo.loginWithGoogle();
      if (res.error || !res.user) {
        setError(res.error || "Google sign-in failed.");
        return;
      }
      onAuthenticated(res.user);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F7FE] lg:flex-row">
      {/* Clean Brand Left Panel */}
      <div className="flex flex-col justify-center bg-[#0F172A] px-7 py-10 text-white sm:px-12 lg:w-[42%] lg:px-14">
        <div className="max-w-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white">
              SkillLoop AI
            </span>
          </div>

          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl text-balance">
            Adaptive learning built for busy schedules.
          </h1>
          <p className="text-sm leading-relaxed text-slate-300">
            Focused 10–30 minute study plans, zero-penalty catch-up, and conceptual AI feedback.
          </p>
        </div>
      </div>

      {/* Right Clean Auth Form Card */}
      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-[410px]">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8 space-y-5">
            {signupStep === "verify" && mode === "signup" ? (
              <form onSubmit={handleVerifyCode} className="space-y-5">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setSignupStep("form");
                      setError(null);
                      setInfoMsg(null);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>
                  <span className="text-[11px] font-semibold text-indigo-600">
                    Step 2 of 2
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                    Check your email
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Enter the 6-digit verification code sent to{" "}
                    <span className="font-semibold text-slate-800">
                      {email}
                    </span>
                    .
                  </p>
                </div>

                {error && (
                  <div className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-800">
                    {error}
                  </div>
                )}

                {infoMsg && !error && (
                  <div className="rounded-xl bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-900">
                    {infoMsg}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Verification Code
                  </label>
                  <div className="grid grid-cols-6 gap-2" dir="ltr">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        aria-label={`Verification digit ${idx + 1}`}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 text-center font-mono text-lg font-extrabold text-slate-900 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || otpDigits.join("").length !== 6}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify &amp; Create Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Didn&apos;t get the code?</span>
                  <button
                    type="button"
                    disabled={submitting || resendCooldown > 0}
                    onClick={handleRequestCode}
                    className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-700 disabled:text-slate-400"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>
                      {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : "Resend Code"}
                    </span>
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                    {mode === "login" ? "Sign in" : "Create account"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {mode === "login"
                      ? "Continue to your SkillLoop workspace."
                      : "We will email a 6-digit verification code."}
                  </p>
                </div>

                <div
                  className="grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-100/80 p-1"
                  role="tablist"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "login"}
                    onClick={() => {
                      setMode("login");
                      setSignupStep("form");
                      setError(null);
                      setInfoMsg(null);
                    }}
                    className={`rounded-lg py-2 text-xs font-bold transition-all ${
                      mode === "login"
                        ? "bg-white text-indigo-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "signup"}
                    onClick={() => {
                      setMode("signup");
                      setSignupStep("form");
                      setEmail("");
                      setPassword("");
                      setError(null);
                      setInfoMsg(null);
                    }}
                    className={`rounded-lg py-2 text-xs font-bold transition-all ${
                      mode === "signup"
                        ? "bg-white text-indigo-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {error && (
                  <div className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-800">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {mode === "signup" && (
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Ayesha Tariq"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 ps-9 pe-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 ps-9 pe-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 ps-9 pe-10 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {mode === "signup" && (
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Role
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(
                          [
                            { id: "learner", label: "Learner", icon: UserCheck },
                            { id: "educator", label: "Educator", icon: Users },
                            { id: "admin", label: "Admin", icon: ShieldCheck },
                          ] as const
                        ).map(({ id, label, icon: Icon }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setSignupRole(id)}
                            className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition-colors ${
                              signupRole === id
                                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>
                          {mode === "login"
                            ? "Signing in..."
                            : "Sending code..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          {mode === "login"
                            ? "Sign In"
                            : "Send Verification Code"}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="relative flex items-center py-0.5">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="mx-3 shrink-0 text-[11px] font-medium text-slate-400">
                    or
                  </span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleGoogleSignIn}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.3 0 6.08-1.09 8.11-2.96l-3.88-3.05c-1.09.73-2.48 1.16-4.23 1.16-3.25 0-6-2.2-6.98-5.15H1.01v3.14C3.03 21.15 7.21 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.02 14c-.25-.73-.39-1.52-.39-2.34s.14-1.61.39-2.34V6.18H1.01C.37 7.45 0 8.88 0 11.66s.37 4.21 1.01 5.48L5.02 14z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.65c1.8 0 3.41.62 4.68 1.83l3.51-3.51C18.07 1.19 15.3 0 12 0 7.21 0 3.03 2.85 1.01 6.84l4.01 3.14C6 6.85 8.75 4.65 12 4.65z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {mode === "login" && (
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 text-[11px] text-slate-400">
                    <span>Demo:</span>
                    <div className="flex items-center gap-3 font-semibold text-indigo-600">
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => handleDemoLogin("learner")}
                        className="hover:underline disabled:opacity-50"
                      >
                        Learner
                      </button>
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => handleDemoLogin("educator")}
                        className="hover:underline disabled:opacity-50"
                      >
                        Educator
                      </button>
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => handleDemoLogin("admin")}
                        className="hover:underline disabled:opacity-50"
                      >
                        Admin
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
