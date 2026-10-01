#!/usr/bin/env python3
"""Mobile-only performance tuning for the React Bits OptionWheel.

Desktop wheel/touchpad behavior is intentionally left unchanged. Mobile drag
keeps the same visual curve/inertia, but avoids repeatedly cancelling and
restarting the rAF loop for every pointer event.
"""
from pathlib import Path

p = Path("src/components/OptionWheel.jsx")
src = p.read_text()

needle = "    soundVolume\n  };"
if "mobile:" not in src:
    replacement = """    soundVolume,
    mobile: typeof window !== 'undefined' and False
  };"""
    replacement = replacement.replace("typeof window !== 'undefined' and False", "typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches")
    if needle not in src:
        raise SystemExit("OptionWheel cfg block not found")
    src = src.replace(needle, replacement, 1)

old_start = """  const startLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
    }
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);"""

new_start = """  const startLoop = useCallback(() => {
    // Desktop behavior remains exactly as before.
    if (!cfgRef.current.mobile) {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
      lastRef.current = performance.now();
      rafRef.current = requestAnimationFrame(runFrame);
      return;
    }

    // Mobile pointer events can arrive faster than a frame. Keep one rAF
    // alive instead of cancelling/rescheduling it for every touch event.
    if (rafRef.current == null) {
      lastRef.current = performance.now();
      rafRef.current = requestAnimationFrame(runFrame);
    }
  }, [runFrame]);"""

if old_start not in src:
    raise SystemExit("OptionWheel startLoop block not found")
src = src.replace(old_start, new_start, 1)

old_transform = "      el.style.transform = __BT__translate(__DOLLAR__{x.toFixed(2)}px, calc(__DOLLAR__{y.toFixed(2)}px - 50%)) rotate(__DOLLAR__{rot.toFixed(3)}deg)__BT__;"
new_transform = "      el.style.transform = __BT__translate3d(__DOLLAR__{x.toFixed(2)}px, __DOLLAR__{y.toFixed(2)}px, 0) translateY(-50%) rotate(__DOLLAR__{rot.toFixed(3)}deg)__BT__;"
src = src.replace(old_transform, new_transform, 1)

old_filter = """      el.style.opacity = String(Math.max(cfg.minOpacity, 1 - dist * cfg.fade));
      el.style.filter = cfg.blur > 0 ? __BT__blur(__DOLLAR__{(dist * cfg.blur).toFixed(2)}px)__BT__ : 'none';
      el.style.setProperty('--ow-p', Math.max(0, 1 - Math.min(dist, 1)).toFixed(4));"""

new_filter = """      el.style.opacity = String(Math.max(cfg.minOpacity, 1 - dist * cfg.fade));
      const nextFilter = cfg.blur > 0 ? __BT__blur(__DOLLAR__{(dist * cfg.blur).toFixed(2)}px)__BT__ : 'none';
      if (el.__owFilter !== nextFilter) {
        el.style.filter = nextFilter;
        el.__owFilter = nextFilter;
      }
      el.style.setProperty('--ow-p', Math.max(0, 1 - Math.min(dist, 1)).toFixed(4));"""

if old_filter not in src:
    raise SystemExit("OptionWheel filter block not found")
src = src.replace(old_filter, new_filter, 1)

src = src.replace("__BT__", chr(96)).replace("__DOLLAR__", "$")
p.write_text(src)

css = Path("src/components/OptionWheel.css")
c = css.read_text()
needle_css = "  will-change: transform, opacity, filter;"
if "backface-visibility: hidden;" not in c and needle_css in c:
    c = c.replace(
        needle_css,
        needle_css + "\n  backface-visibility: hidden;\n  -webkit-backface-visibility: hidden;",
        1,
    )
css.write_text(c)
print("OptionWheel mobile patch applied")
