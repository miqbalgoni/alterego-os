"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

interface Msg { role: "user" | "assistant"; content: string; }

export function AskMeWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Ask Me — your HIVE guide. If any question in the form feels unclear, ask me and I'll explain in plain language. I can also help with the Italian Startup Act, the Business Model Canvas, IRL stages, and more.",
    },
  ]);
  const [streaming, setStreaming] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    const next = [...messages, { role: "user", content: text } as Msg];
    setMessages(next);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages([...next, { role: "assistant", content: "" }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Sorry — I couldn't reach the AI just now. Please try again." },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ask Me"
          className="fixed right-4 sm:right-6 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] sm:bottom-6 z-50 group inline-flex items-center gap-2 rounded-full bg-hive-orange text-white px-4 sm:px-5 h-12 sm:h-auto sm:py-3.5 shadow-soft hover:bg-hive-amber transition pulse-glow"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold text-sm hidden sm:inline">Ask Me</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-x-3 sm:inset-x-auto sm:right-6 bottom-3 sm:bottom-6 z-50 sm:w-[380px] max-w-[calc(100vw-1.5rem)] h-[min(70dvh,520px)] sm:h-[520px] bg-white rounded-3xl shadow-2xl border border-hive-cream flex flex-col overflow-hidden fade-up">
          <div className="flex items-center justify-between bg-gradient-to-r from-hive-orange to-hive-amber px-5 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-sm">Ask Me</div>
                <div className="text-[11px] opacity-90">HIVE Assistant</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div ref={scrollerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-hive-cream/20">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-hive-orange text-white rounded-br-sm"
                      : "bg-white text-hive-dark border border-hive-cream rounded-bl-sm"
                  }`}
                >
                  {m.content || (streaming && i === messages.length - 1 ? "…" : "")}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-hive-cream bg-white">
            <div className="flex items-center gap-2 rounded-full border border-hive-cream px-3 py-2 focus-within:ring-2 focus-within:ring-hive-orange/40 focus-within:border-hive-orange transition">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Ask anything about the form…"
                className="flex-1 text-sm outline-none"
                disabled={streaming}
              />
              <button
                onClick={send}
                disabled={streaming || !input.trim()}
                className="w-8 h-8 rounded-full bg-hive-orange text-white flex items-center justify-center hover:bg-hive-amber transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
