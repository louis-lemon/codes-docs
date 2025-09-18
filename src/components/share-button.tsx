'use client'

import { Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

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
        title: "링크가 복사되었습니다!",
        description: "URL이 클립보드에 저장되었습니다.",
      });
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했습니다. 다시 시도해 주세요.",
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