import * as React from 'react';

export function HalloweenEgg() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    let typed = '';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      typed = (typed + event.key.toLowerCase()).slice(-7);
      if (typed === 'pumpkin') { setOpen(true); typed = ''; }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  if (!open) return null;
  return <div role="dialog" aria-modal="true" aria-label="Halloween surprise" className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4" onClick={() => setOpen(false)}>
    <div className="max-w-sm rounded-2xl border border-orange-200/30 bg-background p-7 text-center shadow-2xl" onClick={event => event.stopPropagation()}>
      <div className="text-5xl" aria-hidden="true">🎃 👻</div>
      <h2 className="mt-3 text-xl font-semibold">A spooky little thread!</h2>
      <p className="mt-2 text-sm text-muted-foreground">You found the CForum Halloween easter egg. May your posts be lively and your bugs stay asleep.</p>
      <button type="button" className="mt-5 rounded-lg bg-primary px-4 py-2 text-primary-foreground" onClick={() => setOpen(false)}>Back to the forum</button>
    </div>
  </div>;
}
