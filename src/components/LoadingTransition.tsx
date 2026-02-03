'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingTransitionProps {
  companyName?: string;
}

const loadingMessages = [
  'Scanning your website...',
  'Learning about your business...',
  'Training your agent...',
  'Almost ready...',
];

export function LoadingTransition({ companyName }: LoadingTransitionProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-20 animate-in fade-in duration-300">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-gray-200" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-gray-900 transition-opacity duration-300">
          {loadingMessages[messageIndex]}
        </p>
        {companyName && (
          <p className="text-sm text-gray-500">
            Setting up agent for {companyName}
          </p>
        )}
      </div>
    </div>
  );
}
