'use client';

import { useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';

type AgentType = 'recovery' | 'support' | 'claims';

interface DemoFormProps {
  onSubmit: (data: { website: string; email: string; agentType: AgentType }) => void;
  isLoading: boolean;
}

const agentTypes: { type: AgentType; label: string; description: string }[] = [
  { type: 'recovery', label: 'Recovery', description: 'Payment collection' },
  { type: 'support', label: 'Support', description: 'Customer service' },
  { type: 'claims', label: 'Claims', description: 'Documentation' },
];

export function DemoForm({ onSubmit, isLoading }: DemoFormProps) {
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [agentType, setAgentType] = useState<AgentType | null>(null);
  const [errors, setErrors] = useState<{ website?: string; email?: string; agentType?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!website) {
      newErrors.website = 'Website is required';
    } else if (!website.includes('.')) {
      newErrors.website = 'Please enter a valid website';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!agentType) {
      newErrors.agentType = 'Please select an agent type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && agentType) {
      let url = website;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      onSubmit({ website: url, email, agentType });
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Input Fields */}
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[15px] font-medium text-gray-700 block mb-1">
              Company website
            </label>
            <input
              type="text"
              placeholder="yourcompany.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-300 transition-all disabled:opacity-50"
            />
            {errors.website && (
              <p className="text-sm text-red-500 mt-1">{errors.website}</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-[15px] font-medium text-gray-700 block mb-1">
              Your email
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-300 transition-all disabled:opacity-50"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Agent Type Selection */}
        <div className="space-y-4">
          <label className="text-[15px] font-medium text-gray-700 block mb-1">
            Choose your agent
          </label>
          <div className="grid grid-cols-3 gap-4">
            {agentTypes.map(({ type, label, description }) => (
              <button
                key={type}
                type="button"
                onClick={() => setAgentType(type)}
                disabled={isLoading}
                className={`relative p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                  agentType === type
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-900'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="font-medium text-sm">{label}</div>
                <div className={`text-xs mt-1 ${agentType === type ? 'text-blue-600' : 'text-gray-500'}`}>
                  {description}
                </div>
              </button>
            ))}
          </div>
          {errors.agentType && (
            <p className="text-sm text-red-500">{errors.agentType}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating your agent...</span>
            </>
          ) : (
            <>
              <span>Generate Demo</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
