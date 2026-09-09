import { Helmet, HelmetProvider } from 'react-helmet-async';

const SITE_TITLE = "Dwid's Space";
const SITE_DESCRIPTION = "Personal reflections on AI, economics, and unconventional thinking by Doowoong Lee";
const SITE_URL = "https://fritzprix.github.io";
const SITE_IMAGE = "/fav.png";

interface SiteHelmetProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  articleTags?: string[];
  publishedTime?: string;
}

export function SiteHelmet({
  title,
  description = SITE_DESCRIPTION,
  image = SITE_IMAGE,
  url,
  type = 'website',
  articleTags,
  publishedTime,
}: SiteHelmetProps) {
  const fullTitle = title ? `${title} | ${SITE_TITLE}` : SITE_TITLE;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="language" content="en" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${SITE_URL}${image}`} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={SITE_TITLE} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}${image}`} />

      {/* JSON-LD Structured Data */}
      {type === 'article' && publishedTime && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": description,
            "image": fullUrl + image,
            "author": {
              "@type": "Person",
              "name": "Doowoong Lee",
              "url": "https://fritzprix.github.io"
            },
            "publisher": {
              "@type": "Organization",
              "name": SITE_TITLE,
              "logo": {
                "@type": "ImageObject",
                "url": SITE_URL + image
              }
            },
            "datePublished": publishedTime,
            "dateModified": publishedTime,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": fullUrl
            },
            ...(articleTags && articleTags.length > 0 && {
              keywords: articleTags.join(', ')
            })
          })}
        </script>
      )}
    </Helmet>
  );
}

export { HelmetProvider };
