
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
import { supabase } from "@/integrations/supabase/client";

interface EmailCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resultsData?: {
    userIdea: string;
    competitors: {
      name: string;
      description: string;
      website: string;
    }[];
    marketGaps?: string[];
    gapAnalysis?: string;
    positioningSuggestions: string[];
  };
}

const EmailCaptureModal: React.FC<EmailCaptureModalProps> = ({ 
  open, 
  onOpenChange,
  resultsData 
}) => {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resultsData) {
      toast({
        title: "Error",
        description: "No results data available to send.",
        variant: "destructive",
      });
      return;
    }
    
    setSending(true);
    
    try {
      // Format the results data for email
      const marketGapsText = resultsData.marketGaps ? 
        `\n\n## Market Gaps:\n${resultsData.marketGaps.map((gap, i) => `${i+1}. ${gap}`).join('\n')}` :
        `\n\n## Market Gap Analysis:\n${resultsData.gapAnalysis}`;
      
      const competitorsText = `\n\n## What's Out There:\n${resultsData.competitors.map((c, i) => 
        `${i+1}. [${c.name}](${c.website})`
      ).join('\n')}`;
      
      const suggestionsText = `\n\n## Positioning Suggestions:\n${resultsData.positioningSuggestions.map((s, i) => 
        `${i+1}. ${s}`
      ).join('\n')}`;
      
      const formattedResults = `# Idea Validation Results\n\n## Your Idea:\n${resultsData.userIdea}${marketGapsText}${competitorsText}${suggestionsText}`;
      
      // Send the email using Supabase Functions
      const { error } = await supabase.functions.invoke('send-validation-email', {
        body: { 
          email,
          results: formattedResults,
          subject: "Your Mogulate Idea Validation Results"
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Results sent!",
        description: "We've sent the analysis to your email.",
        duration: 5000,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error sending email",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
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
