'use client';

import { useState } from 'react';
import { DemoForm } from '@/components/DemoForm';
import { DemoChat } from '@/components/DemoChat';
import { BookingPopup } from '@/components/BookingPopup';
import { LoadingTransition } from '@/components/LoadingTransition';

type AgentType = 'recovery' | 'support' | 'claims';

interface DemoSession {
  sessionId: string;
  companyName: string;
  agentType: AgentType;
  email: string;
}

type ViewState = 'form' | 'loading' | 'chat';

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>('form');
  const [session, setSession] = useState<DemoSession | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDismissed, setBookingDismissed] = useState(false);
  const [loadingCompany, setLoadingCompany] = useState<string>('');

  const handleSubmit = async (data: { website: string; email: string; agentType: AgentType }) => {
    setViewState('loading');
    setLoadingCompany(data.website.replace(/^https?:\/\//, '').replace(/\/$/, ''));
    
    try {
      const response = await fetch('/api/create-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create demo');

      const result = await response.json();
      setSession({
        sessionId: result.sessionId,
        companyName: result.companyName,
        agentType: result.agentType,
        email: data.email,
      });
      
      // Small delay before showing chat for smooth transition
      setTimeout(() => {
        setViewState('chat');
      }, 500);
    } catch (error) {
      console.error('Error creating demo:', error);
      alert('Failed to create demo. Please try again.');
      setViewState('form');
    }
  };

  const handleMessageCount = (count: number) => {
    if (count >= 6 && !bookingDismissed && !showBooking) {
      setShowBooking(true);
    }
  };

  const handleCloseBooking = () => {
    setShowBooking(false);
    setBookingDismissed(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {viewState === 'form' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div className="text-center space-y-4">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <img 
                  src="https://ybbditrpfopzeygtommj.supabase.co/storage/v1/object/public/ProjectPublicAssets/App/REC.svg" 
                  alt="Logo" 
                  className="h-10"
                />
              </div>
              {/* Badge */}
              <p className="text-xs text-blue-500 tracking-widest uppercase font-medium">
                Live in 60 seconds · No signup
              </p>
              <h1 className="text-4xl font-semibold text-gray-900 tracking-tight leading-tight">
                See Your AI Agent in Action
              </h1>
              <p className="text-base text-gray-500 max-w-md mx-auto leading-relaxed">
                Drop your website. We&apos;ll build a working SMS agent trained on your business.
              </p>
            </div>
            <DemoForm onSubmit={handleSubmit} isLoading={false} />
          </div>
        )}

        {viewState === 'loading' && (
          <LoadingTransition companyName={loadingCompany} />
        )}

        {viewState === 'chat' && session && (
          <div className="animate-in fade-in duration-500">
            <DemoChat
              sessionId={session.sessionId}
              companyName={session.companyName}
              agentType={session.agentType}
              onMessageCount={handleMessageCount}
            />
          </div>
        )}
      </div>

      {session && (
        <BookingPopup
          open={showBooking}
          onClose={handleCloseBooking}
          email={session.email}
        />
      )}
    </div>
  );
}
