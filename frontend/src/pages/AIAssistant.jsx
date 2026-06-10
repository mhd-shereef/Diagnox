import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Trash2, Wifi, WifiOff, Copy, Check, Paperclip, Mic, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './AIAssistant.css';

const SYSTEM_PROMPT =
  'You are Diagnox AI, a professional healthcare assistant. ' +
  'Answer health-related questions clearly and with empathy. ' +
  'Use markdown formatting: use **bold** for important terms, bullet lists for steps or options, ' +
  'numbered lists when order matters, `code` for medical values/units, and ### headers to separate sections. ' +
  'Keep answers well-structured and easy to scan. ' +
  'Always recommend consulting a doctor for serious concerns.';

const ALL_SUGGESTIONS = [
  // Sleep
  "How can I improve my sleep quality?",
  "What are the stages of sleep?",
  "How much sleep do I really need for optimal health?",
  // Mental Wellbeing
  "What are some ways to reduce stress?",
  "How can I practice mindfulness daily?",
  "What are the early signs of burnout?",
  // Women's Health
  "What are common symptoms of PCOS?",
  "How does menstrual cycle tracking work?",
  "What are the guidelines for mammograms?",
  // Diabetes & General
  "What does my latest glucose reading mean?",
  "Explain the symptoms of type 2 diabetes.",
  "What are standard blood pressure ranges?"
];

function getRandomSuggestions(count) {
  const shuffled = [...ALL_SUGGESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function Timestamp({ date }) {
  const fmt = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return <span className="msg-timestamp">{fmt}</span>;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {/* silent */}
  }, [text]);

  return (
    <button className="copy-btn" onClick={handleCopy} title={copied ? 'Copied!' : 'Copy message'} aria-label={copied ? 'Copied message' : 'Copy message'}>
      {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
    </button>
  );
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm **Diagnox AI**, your personal health companion. 👋\n\nI can help you with:\n- Understanding symptoms and conditions\n- General health & wellness advice\n- Medication information\n- Interpreting diagnostic results\n\n> ⚠️ Always consult a qualified doctor for personalised medical decisions.\n\nHow can I help you today?",
      ts: new Date(),
    },
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [online, setOnline]   = useState(true);
  const [activeSuggestions, setActiveSuggestions] = useState([]);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    setActiveSuggestions(getRandomSuggestions(4));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const sendMessage = useCallback(async (forcedText = null) => {
    const text = (typeof forcedText === 'string' ? forcedText : input).trim();
    if (!text || loading || !online) return;

    const userMsg = { role: 'user', content: text, ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    if (typeof forcedText !== 'string') setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setLoading(true);

    try {
      const backendUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:10000'}/api/chat`;

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-oss:120b',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: userMsg.role, content: userMsg.content },
          ],
        }),
      });

      if (!response.ok) throw new Error('AI service unavailable');

      const data = await response.json();
      const reply = data.content || "I couldn't parse that response.";

      setMessages(prev => [...prev, { role: 'assistant', content: reply, ts: new Date() }]);
      setOnline(true);
    } catch {
      setOnline(false);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            '> ⚠️ **Connection error**\n\n' +
            "I'm having trouble reaching the AI service right now.\n\n" +
            'Please verify that the backend server is running and the AI proxy is correctly configured.',
          ts: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, online, messages]);

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat cleared. How can I help you?',
        ts: new Date(),
      },
    ]);
    setActiveSuggestions(getRandomSuggestions(4));
  };

  const isInitialState = messages.length === 1 && messages[0].role === 'assistant';

  return (
    <div className="ai-root">
      <div className="page-container ai-container">

        {/* Header */}
        <div className="ai-header glass-panel">
          <div className="ai-header-left">
            <div className="ai-logo" style={{ overflow: 'hidden', padding: 0 }}>
              <img src="/logo.png" alt="AI Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h1 className="ai-title">Diagnox AI</h1>
              <div className={`ai-status ${online ? 'online' : 'offline'}`}>
                {online ? <Wifi size={12} /> : <WifiOff size={12} />}
                {online ? 'Connected and ready' : 'Disconnected'}
              </div>
            </div>
          </div>
          <button className="btn-secondary ai-clear" onClick={clearChat} title="Clear conversation" aria-label="Clear conversation">
            <Trash2 size={16} aria-hidden="true" />
            <span className="clear-text">Clear Chat</span>
          </button>
        </div>

        {/* Messages */}
        <div className="ai-messages-area">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                className={`ai-msg-row ${msg.role === 'user' ? 'user-row' : 'ai-row'}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {msg.role === 'assistant' && (
                  <div className="ai-avatar" style={{ overflow: 'hidden', padding: '2px', background: 'var(--bg-elevated)' }}>
                    <img src="/logo.png" alt="AI Avatar" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                )}

                <div className={`ai-bubble ${msg.role === 'user' ? 'user-bubble' : 'ai-bubble-content'}`}>
                  {msg.role === 'assistant' ? (
                    <div className="markdown-body">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <span className="user-text">{msg.content}</span>
                  )}

                  <div className="msg-meta">
                    {msg.ts && <Timestamp date={msg.ts} />}
                    {msg.role === 'assistant' && <CopyButton text={msg.content} />}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="user-avatar">
                    <User size={16} color="var(--ink-900)" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {loading && (
            <motion.div
              className="ai-msg-row ai-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="ai-avatar" style={{ overflow: 'hidden', padding: '2px', background: 'var(--bg-elevated)' }}>
                <img src="/logo.png" alt="AI Avatar" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div className="ai-bubble ai-bubble-content ai-typing">
                <div className="typing-dots">
                  <span className="dot dot-1" />
                  <span className="dot dot-2" />
                  <span className="dot dot-3" />
                </div>
                <span className="typing-label">Analyzing...</span>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested Prompts (only show at start) */}
        {isInitialState && (
          <motion.div 
            className="ai-suggestions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {activeSuggestions.map((suggestion, i) => (
              <button 
                key={i}
                className="ai-suggestion-chip"
                onClick={() => sendMessage(suggestion)}
              >
                <Sparkles size={14} /> {suggestion}
              </button>
            ))}
          </motion.div>
        )}

        {/* Input bar */}
        <div className="ai-input-bar glass-panel">
          <button className="btn-ghost ai-action-btn" aria-label="Attach file">
            <Paperclip size={20} />
          </button>
          
          <textarea
            ref={inputRef}
            className="ai-input"
            placeholder="Ask Diagnox AI anything about your health..."
            value={input}
            onChange={handleInput}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
                // Reset height
                e.target.style.height = 'auto';
              }
            }}
            disabled={loading}
            aria-label="Type your message"
            rows={1}
          />

          <button className="btn-ghost ai-action-btn" aria-label="Voice input">
            <Mic size={20} />
          </button>
          <motion.button
            className="btn-primary ai-send"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            whileTap={{ scale: 0.93 }}
            aria-label="Send message"
          >
            <Send size={18} aria-hidden="true" />
          </motion.button>
        </div>

        <p className="ai-disclaimer">
          Diagnox AI provides general health information only. Always consult a qualified healthcare professional for medical decisions.
        </p>
      </div>
    </div>
  );
}
