import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Mail } from 'lucide-react';

interface AuthorCardProps {
  name: string;
  email: string;
  location?: string;
  bio?: string;
  social?: Array<{ name: string; url: string; icon: string }>;
}

export default function AuthorCard({ name, email, location, bio, social }: AuthorCardProps) {
  const initials = name.split(' ').map(n => n?.[0] ?? '').join('').substring(0, 2).toUpperCase();

  return (
    <Card className="mt-12 pt-8 border-t">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <Avatar className="w-16 h-16 flex-shrink-0">
          <AvatarImage src="" alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg font-bold">{name}</h3>
          {location && <p className="text-sm text-muted-foreground">{location}</p>}
          {bio && <p className="text-sm mt-2 leading-relaxed">{bio}</p>}
          <div className="flex items-center gap-3 mt-3">
            <a
              href={`mailto:${email}`}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            {social?.map(link => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={link.name}
                title={link.name}
              >
                <span className="text-xs">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
