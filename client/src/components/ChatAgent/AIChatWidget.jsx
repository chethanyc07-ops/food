import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Trash2,
} from 'lucide-react';
import api from '../../services/api';

const SAMPLE_PROMPTS = [
  'What is the best packaging material for vacuum-packed fresh paneer?',
  'Suggest biodegradable & compostable packaging for dried turmeric powder.',
  'What packaging should I use for exporting fresh Alphonso mangoes?',
  'Explain why aluminium foil retort pouch is used for Ready-to-Eat meals.',
];

export default function AIChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => 'session_' + Math.random().toString(36).substring(2, 9));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Initial scientific welcome message
    setMessages([
      {
        role: 'assistant',
        content: `Hello. I am FoodPack AI, the scientific packaging advisory agent for the Ministry of Food Processing Industries (MoFPI).

I have real-time access to the indexed materials database and barrier permeability kinetics. You can inquire about:
· Oxygen & moisture barrier optimization (OTR / WVTR)
· Active & Modified Atmosphere Packaging (MAP)
· Biodegradable bio-polymers (PLA, PBS, bio-PE)
· FSSAI IS 9845 migration and temperature compliance

How can I assist your packaging formulation today?`,
        createdAt: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input.trim();
    if (!text || loading) return;

    setInput('');
    const userMsg = {
      role: 'user',
      content: text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.post('/chat/message', {
        message: text,
        sessionId,
      });

      const assistantMsg = res.data.message;
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Unable to reach the advisory server. Please check network connectivity or backend service.',
          createdAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Session cleared. Inquire about any food packaging barrier requirements or commodity specifications.',
        createdAt: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[820px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">FoodPack AI Scientific Advisor</h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">· Online</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              ASTM OTR/WVTR & FSSAI Standards Knowledge Base
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                  isUser
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.content.split('\n\n').map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>

                {/* Engine meta tag */}
                {msg.metadata?.engine && (
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center space-x-1.5 text-[10px] text-slate-400 font-mono">
                    <span>Engine:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{msg.metadata.engine}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-2.5 text-xs text-slate-400 font-mono p-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
            <span>Calculating barrier equations & querying database...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 2 && (
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto">
          <span className="text-[10px] uppercase font-semibold text-slate-400 font-mono whitespace-nowrap">Suggested:</span>
          {SAMPLE_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-xs whitespace-nowrap px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything (e.g. 'Compare PLA vs EVOH film for coffee' or 'FSSAI limits for dairy')..."
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition active:scale-95 disabled:opacity-50 flex items-center space-x-1"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
