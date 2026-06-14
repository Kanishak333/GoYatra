import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendChatMessage, type ChatMessage } from '../services/chatService';

export default function SaathiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hi! I am **Saathi**, your GoYatra AI assistant. How can I help you plan your trip today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const replyText = await sendChatMessage(messages, userMsg.text);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: replyText }]);
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            className="floating-chat"
            onClick={() => setIsOpen(true)}
            style={{ 
              position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, cursor: 'pointer', 
              background: 'linear-gradient(135deg, #ff5a00, #ff8a00)', color: 'white', 
              width: '64px', height: '64px', borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              boxShadow: '0 12px 30px rgba(255, 90, 0, 0.4)', border: '2px solid rgba(255,255,255,0.1)'
            }}
          >
            <MessageSquare size={28} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="chatbot-window glass-panel"
            style={{ 
              position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000,
              width: '380px', height: '600px', display: 'flex', flexDirection: 'column',
              padding: 0, overflow: 'hidden', borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)',
              background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(20px)'
            }}
          >
            {/* Header */}
            <div className="chat-header" style={{ 
              background: 'linear-gradient(135deg, rgba(25,33,48,0.9), rgba(15,23,42,0.95))', 
              padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', 
              alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(255,90,0,0.2), rgba(255,90,0,0.05))', 
                  padding: '0.6rem', borderRadius: '12px', border: '1px solid rgba(255,90,0,0.2)' 
                }}>
                  <Sparkles size={20} color="#ff5a00" />
                </div>
                <div>
                  <h3 style={{ color: 'white', margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>Saathi AI</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px #22c55e' }}></div>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>Online & Ready</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ 
                background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', 
                cursor: 'pointer', padding: '0.4rem', borderRadius: '50%', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' 
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="chat-messages custom-scrollbar" style={{ 
              flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', 
              flexDirection: 'column', gap: '1.25rem' 
            }}>
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={msg.id} 
                    style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}
                  >
                    {!isUser && (
                      <div style={{ 
                        marginRight: '0.75rem', width: '28px', height: '28px', 
                        borderRadius: '50%', background: 'rgba(255,90,0,0.1)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        border: '1px solid rgba(255,90,0,0.2)', flexShrink: 0, marginTop: '2px'
                      }}>
                        <Sparkles size={14} color="#ff5a00" />
                      </div>
                    )}
                    <div style={{ 
                      background: isUser ? 'linear-gradient(135deg, #ff5a00, #e04f00)' : 'rgba(30,41,59,0.8)', 
                      color: isUser ? 'white' : '#e2e8f0', 
                      padding: '0.85rem 1.25rem', borderRadius: '18px',
                      borderBottomRightRadius: isUser ? '4px' : '18px',
                      borderTopLeftRadius: !isUser ? '4px' : '18px',
                      maxWidth: isUser ? '75%' : '85%', fontSize: '0.95rem', lineHeight: '1.5',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: isUser ? 'none' : '1px solid rgba(255,255,255,0.05)'
                    }}>
                      {isUser ? (
                        msg.text
                      ) : (
                        <div className="markdown-body">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', justifyContent: 'flex-start' }}
                >
                   <div style={{ 
                      marginRight: '0.75rem', width: '28px', height: '28px', 
                      borderRadius: '50%', background: 'rgba(255,90,0,0.1)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      border: '1px solid rgba(255,90,0,0.2)', flexShrink: 0
                    }}>
                      <Sparkles size={14} color="#ff5a00" />
                    </div>
                  <div style={{ 
                    background: 'rgba(30,41,59,0.8)', padding: '1rem 1.25rem', 
                    borderRadius: '18px', borderTopLeftRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' 
                  }}>
                    <div className="typing-indicator" style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '8px' }}>
                      <span style={{ width: '8px', height: '8px', background: '#ff5a00', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></span>
                      <span style={{ width: '8px', height: '8px', background: '#ff5a00', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.16s' }}></span>
                      <span style={{ width: '8px', height: '8px', background: '#ff5a00', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.32s' }}></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-input" style={{ 
              padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', 
              background: 'rgba(15,23,42,0.95)', display: 'flex', gap: '0.75rem', alignItems: 'center' 
            }}>
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask Saathi anything..."
                style={{ 
                  flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', 
                  borderRadius: '24px', padding: '0.85rem 1.25rem', color: 'white', outline: 'none', 
                  fontSize: '0.95rem', transition: 'border 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(255,90,0,0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                style={{ 
                  background: input.trim() ? '#ff5a00' : 'rgba(255,255,255,0.08)', 
                  color: input.trim() ? 'white' : 'rgba(255,255,255,0.4)', 
                  border: 'none', borderRadius: '50%', minWidth: '48px', height: '48px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed', 
                  transition: 'all 0.2s', boxShadow: input.trim() ? '0 4px 12px rgba(255,90,0,0.3)' : 'none'
                }}
              >
                <Send size={20} style={{ transform: 'translateX(1px)' }} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
