'use client'

import { Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { MESSAGES } from '@/constants/messages';

interface ShareButtonProps {
  title?: string;
  className?: string;
}

export default function ShareButton({ title = "Share", className }: ShareButtonProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      
      toast({
        title: MESSAGES.SHARE.SUCCESS.TITLE,
        description: MESSAGES.SHARE.SUCCESS.DESCRIPTION,
      });
    } catch (error) {
      toast({
        title: MESSAGES.SHARE.ERROR.TITLE,
        description: MESSAGES.SHARE.ERROR.DESCRIPTION,
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleShare} 
      className={`cursor-pointer ${className}`}
    >
      <Share className="h-4 w-4 mr-2" />
      {title}
    </Button>
  );
}