#!/usr/bin/env python3
from pathlib import Path
import re

p = Path("src/components/InfiniteMenu.jsx")
src = p.read_text()

for old, new in [
    (
        "export default function InfiniteMenu({ items = [], scale = 1.0, backgroundColor = '#000000' }) {",
        "export default function InfiniteMenu({ items = [], scale = 1.0, backgroundColor = '#000000', onAction }) {",
    ),
    (
        'export default function InfiniteMenu({ items = [], scale = 1.0, backgroundColor = "#000000" }) {',
        'export default function InfiniteMenu({ items = [], scale = 1.0, backgroundColor = "#000000", onAction }) {',
    ),
]:
    if old in src:
        src = src.replace(old, new, 1)

new_click = """  const handleButtonClick = () => {
    if (!activeItem) return;
    if (typeof onAction === 'function') {
      onAction(activeItem);
      return;
    }
    if (!activeItem?.link) return;
    if (activeItem.link.startsWith('http')) {
      window.open(activeItem.link, '_blank');
    } else {
      console.log('Internal route:', activeItem.link);
    }
  };"""

m = re.search(r"const handleButtonClick = \(\) => \{.*?\n  \};", src, re.S)
if m:
    src = src[: m.start()] + new_click + src[m.end() :]

# dpr always 1
src = re.sub(r"const dpr = Math\.min\([^)]+\);", "const dpr = 1;", src)

src = src.replace(
    "this.gl = this.canvas.getContext('webgl2', { antialias: true, alpha: true });",
    "this.gl = this.canvas.getContext('webgl2', { antialias: false, alpha: true, powerPreference: 'high-performance', desynchronized: true });",
)

# Quality: 256 atlas (sharp icons) — not 128 blurry, not 512 heavy
src = src.replace("const cellSize = 512;", "const cellSize = 256;")
src = src.replace("const cellSize = 128;", "const cellSize = 256;")

# Geometry balance
src = src.replace("this.discGeo = new DiscGeometry(56, 1);", "this.discGeo = new DiscGeometry(28, 1);")
src = src.replace("this.discGeo = new DiscGeometry(32, 1);", "this.discGeo = new DiscGeometry(28, 1);")
src = src.replace("this.discGeo = new DiscGeometry(24, 1);", "this.discGeo = new DiscGeometry(28, 1);")

# Mobile ~30fps target to cut lag without killing motion
if "TARGET_FRAME_DURATION" in src and "_mobileCap" not in src:
    src = src.replace(
        "this.TARGET_FRAME_DURATION",
        "this._mobileCap = (typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches); this.TARGET_FRAME_DURATION",
        1,
    )
    # After assignment of TARGET if it's a class field, also patch run
    src = src.replace(
        "run(time = 0) {\n    this.#deltaTime = Math.min(32, time - this.#time);",
        "run(time = 0) {\n    if (this._stopped) return;\n    if (this._mobileCap) {\n      this._fs = !this._fs;\n      if (this._fs) { requestAnimationFrame(t => this.run(t)); return; }\n    }\n    this.#deltaTime = Math.min(32, time - this.#time);",
    )

if "if (this._stopped) return;" not in src:
    src = src.replace(
        "run(time = 0) {",
        "run(time = 0) {\n    if (this._stopped) return;",
        1,
    )

if "sketch._stopped" not in src:
    src = src.replace(
        """    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [items, scale]);""",
        """    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sketch) {
        sketch._stopped = true;
        try {
          sketch.gl?.getExtension('WEBGL_lose_context')?.loseContext();
        } catch (_) {}
      }
    };
  }, [items, scale]);""",
    )

# Sharper atlas draws
if "imageSmoothingEnabled" not in src and "drawImage(img" in src:
    src = src.replace(
        "ctx.drawImage(img,",
        "ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img,",
    )

p.write_text(src)

css = """/* InfiniteMenu — gray CTA, labels under sphere */

#infinite-grid-menu-canvas {
  cursor: grab;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  outline: none;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
}

#infinite-grid-menu-canvas:active {
  cursor: grabbing;
}

.face-title {
  user-select: none;
  position: absolute;
  left: 50%;
  bottom: clamp(7.5rem, 18vh, 9.5rem);
  transform: translateX(-50%);
  margin: 0;
  width: min(90vw, 28rem);
  text-align: center;
  font-weight: 700;
  font-size: clamp(1.35rem, 4.2vw, 2.4rem);
  letter-spacing: -0.02em;
  color: #f2f2f2;
  pointer-events: none;
  z-index: 8;
}

.face-title.active {
  opacity: 1;
  transition: opacity 0.35s ease, transform 0.35s ease;
  transform: translateX(-50%) translateY(0);
}

.face-title.inactive {
  opacity: 0;
  transition: opacity 0.12s ease;
  transform: translateX(-50%) translateY(6px);
  pointer-events: none;
}

.face-description {
  user-select: none;
  position: absolute;
  left: 50%;
  bottom: clamp(5.6rem, 14vh, 7.2rem);
  transform: translateX(-50%);
  margin: 0;
  width: min(88vw, 22rem);
  max-width: none;
  text-align: center;
  font-size: clamp(0.85rem, 2.4vw, 1.05rem);
  font-weight: 400;
  letter-spacing: 0.04em;
  color: rgba(232, 232, 232, 0.7);
  pointer-events: none;
  z-index: 8;
}

.face-description.active {
  opacity: 1;
  transition: opacity 0.35s ease, transform 0.35s ease;
  transform: translateX(-50%) translateY(0);
}

.face-description.inactive {
  opacity: 0;
  transition: opacity 0.12s ease;
  transform: translateX(-50%) translateY(4px);
  pointer-events: none;
}

.action-button {
  position: absolute;
  left: 50%;
  z-index: 10;
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  background: #c8c8c8;
  border: 4px solid rgba(10, 10, 10, 0.85);
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}

.action-button:hover {
  background: #e0e0e0;
}

.action-button-icon {
  user-select: none;
  position: relative;
  color: #1a1a1a;
  top: 1px;
  font-size: 22px;
  line-height: 1;
  margin: 0;
}

.action-button.active {
  bottom: clamp(1.2rem, 4vh, 2.2rem);
  transform: translateX(-50%) scale(1);
  opacity: 1;
  pointer-events: auto;
  transition: 0.4s ease;
}

.action-button.inactive {
  bottom: -80px;
  transform: translateX(-50%) scale(0);
  opacity: 0;
  pointer-events: none;
  transition: 0.12s ease;
}

@media (max-width: 640px) {
  .face-title {
    bottom: 7.2rem;
    font-size: 1.25rem;
  }

  .face-description {
    bottom: 5.5rem;
    font-size: 0.8rem;
  }

  .action-button {
    width: 48px;
    height: 48px;
  }

  .action-button-icon {
    font-size: 18px;
  }

  .action-button.active {
    bottom: max(1rem, env(safe-area-inset-bottom, 0px));
  }
}
"""
Path("src/components/InfiniteMenu.css").write_text(css)
print("InfiniteMenu patched")
