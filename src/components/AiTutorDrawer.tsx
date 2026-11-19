import React, { useState } from "react";
import {
  GraduationCap,
  Loader2,
  MessageSquare,
  Send,
  Volume2,
  X,
} from "lucide-react";
import { LanguageCode, TopicMastery, TutorMessage } from "../types";
import { generateRuleBasedTutorReply } from "../data/seedData";
import { AuthRepo } from "../db/repository";

interface AiTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  learnerName: string;
  topics: TopicMastery[];
  language: LanguageCode;
  offlineFallbackOnly: boolean;
  onSpeakText: (text: string) => void;
}

const QUICK_PROMPTS = [
  "Explain Python Loops simply",
  "Difference between return and print?",
  "What should I study in 10 minutes?",
];

export const AiTutorDrawer: React.FC<AiTutorDrawerProps> = ({
  isOpen,
  onClose,
  learnerName,
  topics,
  language,
  offlineFallbackOnly,
  onSpeakText,
}) => {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: "m-welcome",
      sender: "assistant",
      text: `Hi ${learnerName.split(" ")[0]}! I see your Variables mastery is 90%, while Functions (30%) and Loops (45%) are your best opportunities tonight. What can I break down with a quick Socratic hint?`,
      source: "rule-based",
      timestamp: "Now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMsg: TutorMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    let replyText: string | null = null;
    let source: "gemini" | "rule-based" = "rule-based";

    if (!offlineFallbackOnly) {
      try {
        const token = AuthRepo.getToken();
        const res = await fetch("/api/ai/tutor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            message: trimmed,
            learnerName,
            topicMastery: topics.map((t) => ({
              name: t.name,
              mastery: t.mastery,
            })),
            activeCourse: "Python Programming",
            language,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.reply) {
            replyText = data.reply;
            source = "gemini";
          }
        }
      } catch {
        // Fallback below
      }
    }

    if (!replyText) {
      replyText = generateRuleBasedTutorReply(trimmed, language, topics);
      source = "rule-based";
    }

    const aiMsg: TutorMessage = {
      id: `a-${Date.now()}`,
      sender: "assistant",
      text: replyText,
      source,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="SkillLoop Study Assistant"
    >
      <div className="hc-card flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between bg-slate-900 border-b border-slate-800 px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold">Study Assistant</div>
              <div className="text-[11px] text-slate-300">
                Ask anything about Python syntax, logic, or concepts
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Close Assistant"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => sendMessage(q)}
              className="rounded-lg border border-indigo-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed sm:text-sm ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-800"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>
                {msg.sender === "assistant" && (
                  <>
                    <span>·</span>
                    <span>
                      {msg.source === "gemini" ? "Gemini AI" : "Rule-Based"}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSpeakText(msg.text)}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                      aria-label="Listen to tutor reply"
                    >
                      <Volume2 className="h-3 w-3" />
                      <span>Listen</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              <span>Finding explanation...</span>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="border-t border-slate-200 p-3 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about loops, functions, or study tips..."
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none sm:text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="hc-btn-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
