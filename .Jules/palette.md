## 2025-05-15 - [Improving Accessibility in Live Shopping Components]
**Learning:** Live shopping components often rely on icon-only buttons (like emojis or symbols) and custom input fields within overlays, which can be inaccessible to screen readers and keyboard users if not explicitly handled with ARIA labels and focus rings.
**Action:** Always add `aria-label` to icon-only buttons and ensures `focus:ring` or `focus:outline` styles are present on all interactive elements to maintain accessibility within complex UI overlays.
