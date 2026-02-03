'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';

interface BookingPopupProps {
  open: boolean;
  onClose: () => void;
  email: string;
}

export function BookingPopup({ open, onClose, email }: BookingPopupProps) {
  const calLink = process.env.NEXT_PUBLIC_CAL_LINK || 'cove.dev';
  const bookingUrl = `https://cal.com/${calLink}?email=${encodeURIComponent(email)}`;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🎉</span> Like what you see?
          </DialogTitle>
          <DialogDescription>
            Book a call to set this up for your team. We&apos;ll help you get started in minutes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button asChild className="w-full">
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
              <Calendar className="mr-2 h-4 w-4" />
              Book a Meeting
            </a>
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            <X className="mr-2 h-4 w-4" />
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
