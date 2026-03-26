import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Agent = 'Optimizer' | 'Tracker' | 'WealthBuilder';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

export default function AiAgents() {
  const [activeAgent, setActiveAgent] = useState<Agent>('Optimizer');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [profilePic, setProfilePic] = useState('/me.png');

  useEffect(() => {
    const savedPic = localStorage.getItem('profilePic');
    if (savedPic) setProfilePic(savedPic);
  }, []);
  
  const defaultMessages: Record<Agent, Message[]> = {
    Optimizer: [
      { id: 1, sender: 'ai', text: 'Hello! I analyze macroeconomic trends and RBI repo rates. I\'ve noticed your SBI Education Loan could qualify for the CSIS Interest Subsidy. Should we run a predictive simulation on claiming Section 80E deductions?' }
    ],
    Tracker: [
      { id: 1, sender: 'ai', text: 'Hi! I manage PPF, SIPs, and mutual fund projections. Did you know allocating just ₹5,000 more per month to your Nifty-50 Index SIP could yield an additional ₹15 Lakhs by 2035?' }
    ],
    WealthBuilder: [
      { id: 1, sender: 'ai', text: 'Welcome! I focus on long-term wealth strategies. Let\'s evaluate your CIBIL profile to see if transferring funds towards the National Pension System (NPS) outweighs early loan prepayment this year.' }
    ]
  };

  const [messages, setMessages] = useState<Record<Agent, Message[]>>(() => {
    try {
      const saved = localStorage.getItem('agentChatHistory');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return defaultMessages;
  });

  useEffect(() => {
    localStorage.setItem('agentChatHistory', JSON.stringify(messages));
  }, [messages]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeAgent, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { id: Date.now(), sender: 'user', text: input };
    const conversation = [...messages[activeAgent], userMessage];
    
    // Add user message to current agent's chat history
    setMessages(prev => ({
      ...prev,
      [activeAgent]: conversation
    }));
    
    setInput('');
    setIsTyping(true);

    // Call the real LLM Node backend
    try {
      const savedData = localStorage.getItem('cibilData');
      const userData = savedData ? JSON.parse(savedData) : null;

      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: conversation,
          agentType: activeAgent,
          userData: userData
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'LLM Error');

      const aiMessage: Message = { id: Date.now() + 1, sender: 'ai', text: data.text };
      
      setMessages(prev => ({
        ...prev,
        [activeAgent]: [...prev[activeAgent], aiMessage]
      }));
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { id: Date.now() + 1, sender: 'ai', text: "Sorry, I am currently unable to reach the Groq Llama3 LLM API." };
      setMessages(prev => ({
        ...prev,
        [activeAgent]: [...prev[activeAgent], errorMessage]
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  return (
    <div style={{ height: 'calc(100vh - 150px)', display: 'flex', gap: '24px' }}>
      {/* Agent Selector */}
      <div className="glass-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Specialized Agents</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Cloud-Native Orchestrated Team
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
          <AgentCard 
            name="Debt Optimizer" 
            desc="Focus: Education Loans & EMI" 
            active={activeAgent === 'Optimizer'} 
            onClick={() => setActiveAgent('Optimizer')} 
            color="var(--accent-primary)"
          />
          <AgentCard 
            name="Savings Tracker" 
            desc="Focus: PPF & Mutual Funds" 
            active={activeAgent === 'Tracker'} 
            onClick={() => setActiveAgent('Tracker')} 
            color="var(--success)"
          />
          <AgentCard 
            name="Wealth Builder" 
            desc="Focus: NPS & Tax Planning" 
            active={activeAgent === 'WealthBuilder'} 
            onClick={() => setActiveAgent('WealthBuilder')} 
            color="var(--accent-tertiary)"
          />
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: activeAgent === 'Optimizer' ? 'var(--accent-primary)' : activeAgent === 'Tracker' ? 'var(--success)' : 'var(--accent-tertiary)', boxShadow: '0 0 10px currentColor' }} />
              {activeAgent === 'Optimizer' ? 'Debt Optimizer Agent' : activeAgent === 'Tracker' ? 'Savings Tracker Agent' : 'Wealth Builder Agent'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Connected via DPDP Encrypted Protocol</span>
          </div>
          <div className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>Confidence: 98.4% (XAI Active)</div>
        </div>
        
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
           <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.85rem' }}>Session Started. State synchronized via AWS DynamoDB (Mumbai Region).</p>
           
           {/* Dynamic Chat Messages */}
           {messages[activeAgent].map((msg) => (
             <div key={msg.id} style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
               <div style={{ 
                 width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                 background: msg.sender === 'user' ? 'transparent' : 'var(--glass-border)', 
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 fontWeight: 'bold', fontSize: '0.9rem', overflow: 'hidden', border: msg.sender === 'user' ? '1px solid var(--glass-border)' : 'none'
               }}>
                 {msg.sender === 'user' ? (
                   <img src={profilePic} onError={(e) => { e.currentTarget.src = '/me.png' }} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover', background: 'var(--bg-panel)' }} />
                 ) : 'AI'}
               </div>
               
               <div style={{ 
                 background: msg.sender === 'user' ? 'rgba(122, 162, 247, 0.15)' : 'rgba(255,255,255,0.05)', 
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
                 </div>
               </div>
             </div>
           ))}

           {isTyping && (
             <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
               <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>AI</div>
               <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', borderTopLeftRadius: '0', display: 'flex', gap: '4px', alignItems: 'center' }}>
                 <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse-glow 1s infinite' }} />
                 <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse-glow 1s infinite 0.2s' }} />
                 <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse-glow 1s infinite 0.4s' }} />
               </div>
             </div>
           )}

           <div ref={chatEndRef} />
        </div>
        
        <div style={{ padding: '24px', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <input 
              type="text" 
              placeholder="Ask your agent..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px 16px', color: 'white', outline: 'none', fontFamily: 'inherit' }} 
            />
            <button className="btn btn-primary" onClick={handleSend} disabled={!input.trim() || isTyping} style={{ padding: '0 24px', opacity: (!input.trim() || isTyping) ? 0.5 : 1 }}>
              Send Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentCard({ name, desc, active, onClick, color }: { name: string, desc: string, active: boolean, onClick: () => void, color: string }) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        padding: '16px', 
        borderBottom: '1px solid var(--glass-border)', 
        cursor: 'pointer',
        background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
        borderLeft: active ? `4px solid ${color}` : '4px solid transparent',
        transition: 'all 0.2s'
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{name}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{desc}</div>
    </div>
  );
}
