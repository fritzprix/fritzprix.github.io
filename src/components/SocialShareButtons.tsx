import { Linkedin, Twitter, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { shareOnX, shareOnLinkedIn, copyToClipboard } from '@/lib/blogUtils';

interface SocialShareButtonsProps {
  title: string;
  url: string;
}

export default function SocialShareButtons({ title, url }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = url.startsWith('http') ? url : `https://fritzprix.github.io${url}`;

  const handleCopy = () => {
    copyToClipboard(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">공유:</span>

      <button
        onClick={() => shareOnX(title, fullUrl)}
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Share on X (Twitter)"
        title="X (Twitter)에 공유"
      >
        <Twitter className="w-4 h-4" />
      </button>

      <button
        onClick={() => shareOnLinkedIn(title, fullUrl)}
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Share on LinkedIn"
        title="LinkedIn에 공유"
      >
        <Linkedin className="w-4 h-4" />
      </button>

      <button
        onClick={handleCopy}
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Copy link"
        title="링크 복사"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}
