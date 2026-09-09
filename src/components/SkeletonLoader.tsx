export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-muted rounded-lg p-6 space-y-3">
        <div className="h-5 bg-muted-foreground/20 rounded w-3/4" />
        <div className="h-3 bg-muted-foreground/10 rounded w-1/2" />
        <div className="h-3 bg-muted-foreground/10 rounded w-full" />
        <div className="h-3 bg-muted-foreground/10 rounded w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="animate-pulse flex flex-col items-center mb-12 space-y-4">
      <div className="w-32 h-32 rounded-full bg-muted-foreground/10" />
      <div className="h-5 bg-muted-foreground/20 rounded w-48" />
      <div className="flex gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-6 h-6 rounded bg-muted-foreground/10" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonPost() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-muted-foreground/20 rounded w-2/3" />
      <div className="h-4 bg-muted-foreground/10 rounded w-1/3" />
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-3 bg-muted-foreground/10 rounded" style={{ width: `${80 + Math.random() * 20}%` }} />
        ))}
      </div>
    </div>
  );
}
