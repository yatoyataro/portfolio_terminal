/**
 * Fills each skill bar the first time it scrolls into view (CSS in animations.css).
 *
 * Bars are watched individually rather than as one big panel, so cells further down
 * still animate when the visitor actually reaches them. Cells that appear in the same
 * observer batch (one screenful) get a short increasing delay, so a row reads left to
 * right instead of all at once.
 *
 * The hidden "before" state only applies while <html> has `js-reveal` (added by an
 * inline script in index.astro's head, before first paint). Removing that class shows
 * every bar full, which is the fallback whenever this script cannot do its job.
 */
const STAGGER_MS = 60;
const MAX_STAGGER_STEPS = 6;
const REVEAL_CLASS = "js-reveal";

export function initSkillReveal(): () => void {
  const root = document.documentElement;
  const bars = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

  if (bars.length === 0 || !("IntersectionObserver" in window)) {
    root.classList.remove(REVEAL_CLASS);
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const appearing = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => entry.target as HTMLElement)
        // Observer batches are not guaranteed to be in document order.
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

      appearing.forEach((bar, index) => {
        bar.style.setProperty(
          "--reveal-delay",
          `${Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS}ms`
        );
        bar.classList.add("is-revealed");
        observer.unobserve(bar);
      });
    },
    // Trigger once a cell is a little way into the viewport, not on its first pixel.
    { rootMargin: "0px 0px -8% 0px", threshold: 0.35 }
  );

  for (const bar of bars) observer.observe(bar);
  // Tells the failsafe timer in index.astro that the reveal is handled.
  root.setAttribute("data-reveal-ready", "");

  return () => {
    observer.disconnect();
    // A page restored from the back/forward cache does not re-run this script:
    // show every bar full rather than leaving unrevealed ones empty.
    root.classList.remove(REVEAL_CLASS);
  };
}
