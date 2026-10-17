import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Check } from "lucide-react";
import { interpretMessage, EXAMPLE_COMMANDS } from "../utils/assistant.js";

// Floating chat. The assistant only PROPOSES a change; nothing happens until the user clicks Apply.
export default function ChatAssistant({ itinerary, onApply }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! I can suggest changes to your itinerary. This is demo mode, so I understand a few simple commands.",
    },
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function send(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const result = interpretMessage(trimmed, itinerary);
    setMessages((prev) => [
      ...prev,
      { from: "user", text: trimmed },
      { from: "bot", text: result.reply, proposal: result.proposal, status: result.proposal ? "pending" : null },
    ]);
    setInput("");
  }

  function resolve(index, status) {
    const message = messages[index];
    if (status === "applied") onApply(message.proposal);
    setMessages((prev) => prev.map((m, i) => (i === index ? { ...m, status } : m)));
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700"
        >
          <MessageCircle size={18} /> Ask assistant
        </button>
      )}

      {open && (
        <div className="fixed bottom-0 right-0 z-40 flex h-[34rem] max-h-[100vh] w-full flex-col rounded-t-2xl border border-line bg-white shadow-2xl sm:bottom-5 sm:right-5 sm:w-96 sm:rounded-2xl">
          <div className="flex items-center justify-between border-b border-line p-4">
            <div className="flex items-center gap-2 font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><Bot size={16} /></span>
              Trip assistant
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Demo</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat"><X size={18} /></button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${m.from === "user" ? "bg-emerald-600 text-white" : "bg-cream"}`}>
                  <p>{m.text}</p>
                  {m.proposal && (
                    <div className="mt-2 rounded-xl border border-line bg-white p-2.5 text-navy">
                      <p className="text-xs font-semibold">{m.proposal.label}</p>
                      {m.status === "pending" && (
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => resolve(i, "applied")} className="btn-primary !px-3 !py-1 !text-xs"><Check size={12} /> Apply</button>
                          <button onClick={() => resolve(i, "dismissed")} className="btn-outline !px-3 !py-1 !text-xs">Dismiss</button>
                        </div>
                      )}
                      {m.status === "applied" && <p className="mt-1 text-xs text-emerald-700">Applied</p>}
                      {m.status === "dismissed" && <p className="mt-1 text-xs text-navy-soft">Dismissed</p>}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-line p-3">
            <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1">
              {EXAMPLE_COMMANDS.map((c) => (
                <button key={c} onClick={() => send(c)} className="shrink-0 rounded-full border border-line px-3 py-1 text-xs text-navy-soft hover:border-emerald-600 hover:text-emerald-700">
                  {c}
                </button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
              <input className="input" placeholder="Ask for a change..." value={input} onChange={(e) => setInput(e.target.value)} />
              <button type="submit" className="btn-primary !px-3" aria-label="Send"><Send size={16} /></button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
