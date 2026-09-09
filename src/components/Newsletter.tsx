import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface NewsletterProps {
  email: string;
}

export default function Newsletter({ email }: NewsletterProps) {
  const { lang, t } = useLanguage();
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !address.includes('@')) return;
    setLoading(true);
    const subject = encodeURIComponent(lang === 'ko' ? 'Newsletter 구독 신청' : 'Newsletter Subscription');
    const body = encodeURIComponent(lang === 'ko' ? `이메일: ${address}` : `Email: ${address}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="mt-12 p-6 rounded-xl border bg-muted/30">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold">{t('newsletterTitle')}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {t('newsletterDesc')}
      </p>
      {submitted ? (
        <div className="text-sm text-green-500 font-medium">
          ✅ {t('newsletterSuccess')}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder={t('newsletterPlaceholder')}
            className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {t('newsletterButton')}
          </button>
        </form>
      )}
    </section>
  );
}
