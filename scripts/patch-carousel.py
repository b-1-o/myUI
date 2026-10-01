#!/usr/bin/env python3
"""Light touch perf on CircularCarousel without changing animation logic."""
from pathlib import Path
p = Path('src/components/CircularCarousel.jsx')
if not p.exists():
    raise SystemExit(0)
src = p.read_text()
# Prefer cheaper image decode path already; ensure no extra work
if "will-change: transform" not in Path('src/components/CircularCarousel.css').read_text():
    css = Path('src/components/CircularCarousel.css')
    t = css.read_text()
    if '.circular-carousel__card' in t and 'will-change' not in t:
        t = t.replace(
            '.circular-carousel__card {',
            '.circular-carousel__card {\n  will-change: transform;\n',
        )
        css.write_text(t)
print('carousel patch ok')
