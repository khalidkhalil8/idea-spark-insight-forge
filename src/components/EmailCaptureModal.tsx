
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmailCaptureModal: React.FC<EmailCaptureModalProps> = ({ open, onOpenChange }) => {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate sending
    setTimeout(() => {
      setSending(false);
      onOpenChange(false);
      toast({
        title: "Results saved!",
        description: "We've sent the analysis to your email.",
        duration: 5000,
      });
    }, 1500);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Save className="w-5 h-5 mr-2 text-brand-600" />
            Save Your Analysis
          </DialogTitle>
          <DialogDescription>
            Get a copy of your idea validation results sent to your inbox for future reference.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your-email@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={sending || !email}
              className="bg-brand-600 hover:bg-brand-700"
            >
              {sending ? (
                <>
                  <span className="animate-spin mr-2">⧖</span>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send to My Inbox
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailCaptureModal;
