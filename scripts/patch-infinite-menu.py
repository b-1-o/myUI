#!/usr/bin/env python3
"""Apply the small compatibility patch and keep InfiniteMenu CSS in sync with its JSX."""
from pathlib import Path
import re

component_path = Path("src/components/InfiniteMenu.jsx")
source = component_path.read_text(encoding="utf-8")

old_handler = re.compile(
    r"""const handleAction = event => \{
\s*if \(!current\) return;
\s*if \(onItemClick\) \{
\s*onItemClick\(current, active % items\.length\);
\s*if \(!current\.link\) event\.preventDefault\(\);
\s*\}
\s*\};""",
    re.MULTILINE,
)
replacement = """const handleAction = event => {
    if (!current || !onItemClick) return;
    event.preventDefault();
    onItemClick(current, active % items.length);
  };"""

source, changed = old_handler.subn(replacement, source, count=1)
if changed:
    component_path.write_text(source, encoding="utf-8")
elif "if (!current || !onItemClick) return;" not in source:
    raise SystemExit(
        "InfiniteMenu action handler no longer matches the expected API. "
        "Review src/components/InfiniteMenu.jsx before updating this patch."
    )

css = r'''/* InfiniteMenu — custom layout for the myUI Works page */
.infinite-menu {
  position: relative;
  isolation: isolate;
  display: block;
  width: 100%;
  height: 100%;
  min-height: 100svh;
  overflow: hidden;
  outline: none;
  container-type: inline-size;
  color: var(--infinite-menu-text, #f2f2f2);
  -webkit-tap-highlight-color: transparent;
}

.infinite-menu:focus-visible {
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.72);
}

.infinite-menu__canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  cursor: grab;
  touch-action: none;
}

.infinite-menu__canvas:active {
  cursor: grabbing;
}

.infinite-menu__info,
.infinite-menu__custom {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.infinite-menu__title,
.infinite-menu__description,
.infinite-menu__action {
  transition:
    opacity 0.36s ease,
    transform 0.36s cubic-bezier(0.22, 1, 0.36, 1);
}

.infinite-menu__title {
  position: absolute;
  top: auto;
  right: auto;
  bottom: clamp(7.5rem, 18vh, 9.5rem);
  left: 50%;
  width: min(90vw, 28rem);
  max-width: min(90vw, 28rem);
  margin: 0;
  color: #f2f2f2;
  font-size: clamp(1.35rem, 4.2vw, 2.4rem);
  font-weight: 650;
  line-height: 1.05;
  letter-spacing: -0.025em;
  text-align: center;
  text-wrap: balance;
  text-shadow: var(--infinite-menu-shadow, 0 2px 18px rgba(0, 0, 0, 0.45));
  transform: translateX(-50%);
  user-select: none;
}

.infinite-menu__description {
  position: absolute;
  top: auto;
  right: auto;
  bottom: clamp(5.4rem, 13vh, 7.2rem);
  left: 50%;
  width: min(88vw, 22rem);
  max-width: min(88vw, 22rem);
  margin: 0;
  color: rgba(232, 232, 232, 0.72);
  font-size: clamp(0.82rem, 2.4vw, 1.02rem);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.025em;
  text-align: center;
  text-shadow: var(--infinite-menu-shadow, 0 2px 18px rgba(0, 0, 0, 0.45));
  transform: translateX(-50%);
  user-select: none;
}

.infinite-menu__action {
  position: absolute;
  bottom: clamp(1.15rem, 4vh, 2.2rem);
  left: 50%;
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  padding: 0;
  border: 4px solid rgba(10, 10, 10, 0.85);
  border-radius: 50%;
  background: #c8c8c8;
  color: #111;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
  transform: translateX(-50%);
  text-decoration: none;
}

.infinite-menu__action svg {
  width: 20px;
  height: 20px;
  pointer-events: none;
}

.infinite-menu__action:hover {
  background: #e0e0e0;
  transform: translateX(-50%) scale(1.06);
}

.infinite-menu__action:focus-visible {
  outline: 2px solid #f2f2f2;
  outline-offset: 4px;
}

.infinite-menu__info[data-moving='true'] .infinite-menu__title,
.infinite-menu__info[data-moving='true'] .infinite-menu__description {
  opacity: 0;
  transform: translate(-50%, 12px);
  transition-duration: 0.18s;
}

.infinite-menu__info[data-moving='true'] .infinite-menu__action {
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 16px) scale(0.6);
  transition-duration: 0.18s;
}

@media (max-width: 640px) {
  .infinite-menu__title {
    bottom: 7.2rem;
    font-size: 1.25rem;
  }

  .infinite-menu__description {
    bottom: 5.25rem;
    width: min(88vw, 22rem);
    max-width: min(88vw, 22rem);
    font-size: 0.8rem;
  }

  .infinite-menu__action {
    bottom: max(1rem, env(safe-area-inset-bottom, 0px));
    width: 48px;
    height: 48px;
  }

  .infinite-menu__action svg {
    width: 18px;
    height: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .infinite-menu__title,
  .infinite-menu__description,
  .infinite-menu__action {
    transition-duration: 0.01ms !important;
  }
}
'''

Path("src/components/InfiniteMenu.css").write_text(css, encoding="utf-8")
print("InfiniteMenu CSS and click behavior patched.")
