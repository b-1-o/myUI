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

src = src.replace(
    "const dpr = Math.min(2, window.devicePixelRatio);",
    "const dpr = 1;",
)
# Transparent canvas so back.png shows through
src = src.replace(
    "this.gl = this.canvas.getContext('webgl2', { antialias: true, alpha: true });",
    "this.gl = this.canvas.getContext('webgl2', { antialias: false, alpha: true, powerPreference: 'high-performance', desynchronized: true });",
)
src = src.replace("const cellSize = 512;", "const cellSize = 256;")
src = src.replace("this.discGeo = new DiscGeometry(56, 1);", "this.discGeo = new DiscGeometry(32, 1);")

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
    src = src.replace(
        "run(time = 0) {\nthis.#deltaTime = Math.min(32, time - this.#time);",
        "run(time = 0) {\nif (this._stopped) return;\nthis.#deltaTime = Math.min(32, time - this.#time);",
    )

p.write_text(src)

css_path = Path("src/components/InfiniteMenu.css")
css = css_path.read_text()
css = css.replace(
    """@media (max-width: 1500px) {
  .face-title,
  .face-description {
    display: none;
  }
}""",
    """@media (max-width: 640px) {
  .face-title {
    font-size: 1.35rem;
    left: 0.6em;
  }
  .face-description {
    font-size: 0.85rem;
    max-width: 12ch;
  }
  .action-button {
    width: 52px;
    height: 52px;
  }
}""",
)
css_path.write_text(css)
print("InfiniteMenu patched")
