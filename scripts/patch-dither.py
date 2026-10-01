#!/usr/bin/env python3
"""Optimize Dither WebGL without removing wave/dither animation or mouse interaction."""
from pathlib import Path

p = Path("src/components/Dither.jsx")
src = p.read_text()

# Cheaper GL context (animation + mouse unchanged)
src = src.replace(
    "gl={{ antialias: true, preserveDrawingBuffer: true }}",
    "gl={{ antialias: false, powerPreference: 'high-performance', alpha: false, stencil: false, depth: false }}",
)

# Ensure dpr stays 1
src = src.replace("dpr={1}", "dpr={1}")
if "dpr={Math.min" in src:
    src = src.replace("dpr={Math.min(window.devicePixelRatio, 2)}", "dpr={1}")

# Document-level pointer so mouse works through glass/UI
if "window.addEventListener('pointermove'" not in src:
    old_handler = """  const handlePointerMove = e => {
    if (!enableMouseInteraction) return;
    const rect = gl.domElement.getBoundingClientRect();
    const dpr = gl.getPixelRatio();
    mouseRef.current.set((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);
  };"""
    new_handler = """  useEffect(() => {
    if (!enableMouseInteraction) return undefined;
    const onMove = e => {
      const rect = gl.domElement.getBoundingClientRect();
      const dpr = gl.getPixelRatio();
      mouseRef.current.set((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enableMouseInteraction, gl]);

  const handlePointerMove = e => {
    if (!enableMouseInteraction) return;
    const rect = gl.domElement.getBoundingClientRect();
    const dpr = gl.getPixelRatio();
    mouseRef.current.set((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);
  };"""
    if old_handler in src:
        src = src.replace(old_handler, new_handler)

p.write_text(src)
print("Dither optimized")
