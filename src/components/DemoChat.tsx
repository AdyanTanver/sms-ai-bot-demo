'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface DemoChatProps {
  sessionId: string;
  companyName: string;
  agentType: string;
  onMessageCount: (count: number) => void;
}

export function DemoChat({ sessionId, companyName, agentType, onMessageCount }: DemoChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const greeting = getGreeting(agentType, companyName);
    setMessages([{ role: 'assistant', content: greeting }]);
  }, [agentType, companyName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getGreeting = (type: string, company: string): string => {
    switch (type) {
      case 'recovery':
        return `Hey, this is ${company}. Reaching out about your account—wanted to see if we can work something out. What's a good time to chat?`;
      case 'support':
        return `Hey! ${company} here. What can I help you with?`;
      case 'claims':
        return `Hi, this is ${company}. Need help with a claim or have questions? Just let me know what's going on.`;
      default:
        return `Hey, ${company} here. What's up?`;
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: userMessage,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      onMessageCount(data.messageCount);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full max-w-[430px] mx-auto p-4">
      {/* iPhone 15 Pro Frame */}
      <div className="relative">
        {/* Outer frame with titanium finish */}
        <div 
          className="relative rounded-[55px] p-[12px]"
          style={{
            background: 'linear-gradient(145deg, #2a2a2e 0%, #1a1a1c 50%, #2a2a2e 100%)',
            boxShadow: `
              0 50px 100px -20px rgba(0, 0, 0, 0.5),
              0 30px 60px -30px rgba(0, 0, 0, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -1px 0 rgba(0, 0, 0, 0.3)
            `,
          }}
        >
          {/* Side buttons - Volume */}
          <div className="absolute -left-[2px] top-[120px] w-[3px] h-[30px] bg-[#2a2a2e] rounded-l-sm" />
          <div className="absolute -left-[2px] top-[160px] w-[3px] h-[60px] bg-[#2a2a2e] rounded-l-sm" />
          <div className="absolute -left-[2px] top-[230px] w-[3px] h-[60px] bg-[#2a2a2e] rounded-l-sm" />
          {/* Side button - Power */}
          <div className="absolute -right-[2px] top-[180px] w-[3px] h-[80px] bg-[#2a2a2e] rounded-r-sm" />
          
          {/* Inner bezel */}
          <div 
            className="rounded-[47px] p-[2px]"
            style={{
              background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
            }}
          >
            {/* Screen */}
            <div 
              className="bg-white rounded-[45px] overflow-hidden relative"
              style={{ height: '780px' }}
            >
              {/* Dynamic Island */}
              <div 
                className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-[20px] z-20"
                style={{
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
                }}
              />
              
              {/* Messages Header - starts right after Dynamic Island */}
              <div className="pt-[58px] pb-3 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                    style={{
                      background: 'linear-gradient(180deg, #B0B0B0 0%, #808080 100%)',
                    }}
                  >
                    {companyName.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-[13px] font-medium text-black mt-1" style={{ fontFamily: '-apple-system, SF Pro Text, sans-serif' }}>
                    {companyName}
                  </p>
                </div>
              </div>

              {/* Messages Area */}
              <div 
                className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-white"
                style={{ height: 'calc(100% - 180px)' }}
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-[10px] text-[15px] leading-[1.35] ${
                        message.role === 'user'
                          ? 'bg-[#007AFF] text-white rounded-[18px] rounded-br-[4px]'
                          : 'bg-[#E9E9EB] text-black rounded-[18px] rounded-bl-[4px]'
                      }`}
                      style={{ fontFamily: '-apple-system, SF Pro Text, sans-serif' }}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#E9E9EB] rounded-[18px] rounded-bl-[4px] px-4 py-3">
                      <div className="flex gap-[3px]">
                        <div className="w-[7px] h-[7px] bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-[7px] h-[7px] bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-[7px] h-[7px] bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div 
                className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-2 pb-8"
                style={{ borderTop: '1px solid #E5E5E5' }}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="flex-1 flex items-center rounded-full px-4 py-[10px] bg-[#F2F2F7]"
                  >
                    <input
                      type="text"
                      placeholder="Text Message"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="flex-1 bg-transparent outline-none text-[16px] text-black placeholder-gray-500"
                      style={{ fontFamily: '-apple-system, SF Pro Text, sans-serif' }}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      input.trim() && !isLoading
                        ? 'bg-[#007AFF] text-white'
                        : 'bg-[#E5E5EA] text-gray-400'
                    }`}
                  >
                    <ArrowUp className="h-4 w-4" strokeWidth={3} />
                  </button>
                </div>
                {/* Home Indicator */}
                <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-black rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
