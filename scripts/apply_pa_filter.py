#!/usr/bin/env python3
"""
Re-aplica el filter chain PA actual sobre los mp3 cacheados en
/tmp/futsudoro-pa-sample/ y guarda los wavs en pa-sample/.

Útil para iterar el filter chain sin gastar cuota de MiniMax TTS.
"""
import sys
import subprocess
from pathlib import Path

OUT_DIR = Path("/tmp/futsudoro-pa-sample")
WORKSPACE_DIR = Path.home() / ".openclaw/workspace/projects/Futsudoro/pa-sample"
WORKSPACE_DIR.mkdir(parents=True, exist_ok=True)

# Filter chain PA v4 — leerlo del script principal
sys.path.insert(0, str(Path(__file__).parent))
from pa_sample_pilot import PA_FILTER  # noqa: E402


def apply_pa(mp3_path: Path) -> Path:
    fname = mp3_path.stem
    pa_path = WORKSPACE_DIR / f"{fname}_pa.wav"
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", str(mp3_path),
        "-af", PA_FILTER,
        "-ar", "32000",
        "-ac", "1",
        str(pa_path),
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  error {mp3_path.name}: {r.stderr[-200:]}", file=sys.stderr)
        return None
    return pa_path


def main():
    mp3s = sorted(OUT_DIR.glob("*.mp3"))
    if not mp3s:
        print(f"Sin mp3 en {OUT_DIR}. Corré pa_sample_pilot.py primero.")
        sys.exit(1)
    print(f"Re-aplicando filter chain v4 a {len(mp3s)} mp3s...")
    for mp3 in mp3s:
        pa = apply_pa(mp3)
        if pa:
            print(f"  {pa.name}")
    print(f"\n✓ Wavs en {WORKSPACE_DIR}/")
    print(f"  Filter: {PA_FILTER}")


if __name__ == "__main__":
    main()
