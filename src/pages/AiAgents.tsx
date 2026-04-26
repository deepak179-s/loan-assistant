import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useUser } from '../context/UserContext';
import { Clock, MessageSquare, Save, Trash2 } from 'lucide-react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  confidenceScore?: number;
}

interface ChatSession {
  id: string;
  date: string;
  messages: Message[];
}

export default function AiAgents() {
  const { activeUser } = useUser();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const defaultMessage: Message = { 
    id: 1, 
    sender: 'ai', 
    text: `Hello ${activeUser.name.split(' ')[0]}! I am your Debt Optimizer Agent. I analyze macroeconomic trends and RBI repo rates to help minimize your debt. How can I help you today?` 
  };

  const [messages, setMessages] = useState<Message[]>([defaultMessage]);
  const [histories, setHistories] = useState<ChatSession[]>([]);
  const [viewingHistoryId, setViewingHistoryId] = useState<string | null>(null);
  const [dbLoaded, setDbLoaded] = useState(false);

  // Load state from Firebase
  useEffect(() => {
    if (!activeUser?.id) return;
    setDbLoaded(false);

    const docRef = doc(db, "chat_histories", activeUser.id);
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setMessages(data.activeMessages?.length > 0 ? data.activeMessages : [defaultMessage]);
        setHistories(data.historicalSessions || []);
      } else {
        setMessages([defaultMessage]);
        setHistories([]);
      }
      setDbLoaded(true);
    }, (error) => {
      console.error("Error fetching chat histories:", error);
      setDbLoaded(true);
    });

    return () => unsub();
  }, [activeUser.id]);

  // Save state to Firebase whenever messages or histories change, but only if db is loaded 
  // and we are NOT viewing a read-only history.
  useEffect(() => {
    if (!dbLoaded || viewingHistoryId !== null) return;
    
    // Use a small debounce or direct setDoc since it's a demo
    const saveToDb = async () => {
      try {
        await setDoc(doc(db, "chat_histories", activeUser.id), {
          activeMessages: messages,
          historicalSessions: histories
        }, { merge: true });
      } catch (err) {
        console.error("Failed to save chat to DB:", err);
      }
    };
    saveToDb();
  }, [messages, histories, activeUser.id, dbLoaded, viewingHistoryId]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, viewingHistoryId]);

  const handleSend = async () => {
    if (!input.trim() || viewingHistoryId) return;
    
    const userMessage: Message = { id: Date.now(), sender: 'user', text: input };
    const conversation = [...messages, userMessage];
    
    setMessages(conversation);
    setInput('');
    setIsTyping(true);

    try {
      // Get CIBIL data straight from Firebase to pass to AI context
      const cibilSnap = await getDoc(doc(db, "credit_profiles", activeUser.id));
      const parsedCibil = cibilSnap.exists() ? cibilSnap.data() : "No specific profile data available.";

      const userData = {
        name: activeUser.name,
        pan: activeUser.pan,
        creditProfile: parsedCibil
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversation,
          agentType: 'Optimizer',
          userData: userData
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'LLM Error');

      const textOutput = data.finalAdvice || data.text || "Sorry, I couldn't process this.";
      const confidence = data.confidenceScore;

      const aiMessage: Message = { id: Date.now() + 1, sender: 'ai', text: textOutput, confidenceScore: confidence };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { id: Date.now() + 1, sender: 'ai', text: "Sorry, I am currently unable to reach the LLM API." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleSaveAndClear = () => {
    if (messages.length <= 1) return; 
    const newSession: ChatSession = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      messages: [...messages]
    };
    
    const newHistories = [newSession, ...histories];
    const resetMessage = { ...defaultMessage, text: `Hello ${activeUser.name.split(' ')[0]}! Previous chat saved to history. How can I assist you further?` };
    
    setHistories(newHistories);
    setMessages([resetMessage]);
    setViewingHistoryId(null);
  };

  const handleDeleteHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistories(prev => prev.filter(h => h.id !== id));
    if (viewingHistoryId === id) {
      setViewingHistoryId(null);
    }
  };

  const activeMessages = viewingHistoryId 
    ? histories.find(h => h.id === viewingHistoryId)?.messages || []
    : messages;

  return (
    <div className="animate-fade-in flex-chat" style={{ padding: '0 24px 24px' }}>
      {/* Sidebar: Chat History */}
      <div className="card chat-sidebar">
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)' }}>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="var(--electric-bright)" />
            Past Histories
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
             Records for {activeUser.name}
          </p>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setViewingHistoryId(null)}
            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', background: viewingHistoryId === null ? 'var(--electric-bright)' : '', color: viewingHistoryId === null ? '#fff' : '' }}
          >
            <MessageSquare size={16} /> Current Active Chat
          </button>
          
          <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '8px 0' }} />

          {histories.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '16px 0' }}>No past histories saved.</div>
          ) : (
            histories.map(h => (
              <div 
                key={h.id}
                onClick={() => setViewingHistoryId(h.id)}
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: viewingHistoryId === h.id ? 'var(--electric-bright)' : 'var(--glass-border)',
                  background: viewingHistoryId === h.id ? 'rgba(122, 162, 247, 0.1)' : 'transparent',
                  transition: 'all 0.2s',
                  fontSize: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Session {new Date(h.date).toLocaleDateString()}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{new Date(h.date).toLocaleTimeString()}</div>
                </div>
                <button 
                  onClick={(e) => handleDeleteHistory(e, h.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                  title="Delete chat"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="card chat-main">
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--electric-bright)', boxShadow: '0 0 10px currentColor' }} />
              Debt Optimizer Agent
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Analyzing {activeUser.name}'s Profile</span>
          </div>
          
          {!viewingHistoryId && (
            <button className="btn btn-secondary" onClick={handleSaveAndClear} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <Save size={16} /> Save & Clear
            </button>
          )}
          {viewingHistoryId && (
            <div style={{ padding: '6px 12px', background: 'rgba(255,165,0,0.1)', color: 'orange', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Clock size={16} /> Viewing Read-Only History
            </div>
          )}
        </div>
        
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
           <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.85rem' }}>Session Started. State synchronized via Firebase Firestore.</p>
           
           {activeMessages.map((msg) => (
             <div key={msg.id} style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
               <div style={{ 
                 width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                 background: msg.sender === 'user' ? 'transparent' : 'var(--glass-border)', 
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 fontWeight: 'bold', fontSize: '0.9rem', overflow: 'hidden', border: msg.sender === 'user' ? '1px solid var(--glass-border)' : 'none'
               }}>
                 {msg.sender === 'user' ? (
                   <img src={activeUser.image} onError={(e) => { e.currentTarget.src = '/me.png' }} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover', background: 'var(--bg-surface)' }} />
                 ) : 'AI'}
               </div>
               
               <div style={{ 
                 background: msg.sender === 'user' ? 'rgba(122, 162, 247, 0.15)' : 'var(--bg-raised)', 
                 padding: '16px', borderRadius: '12px', 
                 borderTopRightRadius: msg.sender === 'user' ? '0' : '12px',
                 borderTopLeftRadius: msg.sender === 'user' ? '12px' : '0', 
                 maxWidth: '85%',
                 border: msg.sender === 'user' ? '1px solid rgba(122, 162, 247, 0.2)' : 'none'
               }}>
                  <div className="markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text.replace(/```markdown\n?/g, '').replace(/```\n?/g, '')}
                    </ReactMarkdown>

                    {msg.sender === 'ai' && msg.confidenceScore !== undefined && msg.confidenceScore < 80 && (
                      <div style={{ marginTop: '16px', padding: '12px', background: msg.confidenceScore <= 30 ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 165, 0, 0.1)', border: msg.confidenceScore <= 30 ? '1px solid red' : '1px solid rgba(255,165,0,0.5)', borderRadius: '8px' }}>
                        <h4 style={{ color: msg.confidenceScore <= 30 ? 'red' : 'orange', margin: '0 0 8px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {msg.confidenceScore <= 30 ? `🚨 High Risk / Scam Detected (${msg.confidenceScore}%)` : `⚠️ Low Confidence Detected (${msg.confidenceScore}%)`}
                        </h4>
                        <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {msg.confidenceScore <= 30 
                            ? 'The multi-agent protocol flagged this interaction as a potential scam, fraud, or extreme mathematical impossibility.'
                            : 'The multi-agent protocol verified this response, but anomaly detection flagged it as outside strict mathematical bounds.'}
                        </p>
                        <Link to="/advisor" className="btn btn-secondary" style={{ textDecoration: 'none', display: 'inline-block', fontSize: '0.8rem', padding: '6px 12px', background: msg.confidenceScore <= 30 ? 'red' : 'orange', color: msg.confidenceScore <= 30 ? 'white' : 'black', fontWeight: 'bold' }}>
                          Talk to Human Advisor
                        </Link>
                      </div>
                    )}
                  </div>
               </div>
             </div>
           ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>AI</div>
                <div style={{ background: 'var(--bg-raised)', padding: '16px', borderRadius: '12px', borderTopLeftRadius: '0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    The Strategist and Critic agents are verifying your optimal plan...
                  </div>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--electric-bright)', animation: 'pulse-glow 1s infinite' }} />
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--electric-bright)', animation: 'pulse-glow 1s infinite 0.2s' }} />
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--electric-bright)', animation: 'pulse-glow 1s infinite 0.4s' }} />
                  </div>
                </div>
              </div>
            )}

           <div ref={chatEndRef} />
        </div>
        
        <div style={{ padding: '24px', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <input 
              type="text" 
              placeholder={viewingHistoryId ? "Return to active chat to send a message..." : "Ask your Debt Optimizer..."} 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={viewingHistoryId !== null}
              style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px 16px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', opacity: viewingHistoryId ? 0.5 : 1 }} 
            />
            <button className="btn btn-primary" onClick={handleSend} disabled={!input.trim() || isTyping || viewingHistoryId !== null} style={{ padding: '0 24px', opacity: (!input.trim() || isTyping || viewingHistoryId) ? 0.5 : 1 }}>
              Send Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
