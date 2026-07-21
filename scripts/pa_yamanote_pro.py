#!/usr/bin/env python3
"""
Futsudoro PA — Yamanote PRO chain (basada en sugerencia GPT para Yamanote real).

Aplica el filter chain "pro" de GPT sobre los mp3 cacheados y genera wavs
alternativos para comparar contra el v5 actual.

Filter chain PRO:
- EQ agresivo: highpass 300Hz 24dB/oct + lowpass 4.2kHz 24dB/oct
- Mid scoop: -2dB @ 500Hz, +3dB @ 1.8kHz, +1dB @ 3kHz
- Compressor 4:1 con attack rápido
- Crunch sutil bits=14
- Reverb corto 30ms
- Haas effect para simular múltiples parlantes

Output: /tmp/futsudoro-pa-sample/yamanote_pro/<name>_pa.wav
"""
import sys
import subprocess
from pathlib import Path

OUT_DIR = Path("/tmp/futsudoro-pa-sample")
PRO_DIR = OUT_DIR / "yamanote_pro"
PRO_DIR.mkdir(parents=True, exist_ok=True)

# Filter chain "PRO Yamanote" — basada en sugerencia GPT para PA real de Yamanote
PA_PRO_FILTER = (
    # EQ agresivo (PA chico, banda limitada)
    # poles=2 es default = 24 dB/oct en highpass/lowpass de ffmpeg
    "highpass=f=300,"       # 24 dB/oct
    "lowpass=f=4200,"       # 24 dB/oct
    "equalizer=f=500:width_type=q:w=1:g=-2,"   # mid scoop
    "equalizer=f=1800:width_type=q:w=1:g=3,"   # presence boost
    "equalizer=f=3000:width_type=q:w=1:g=1,"   # air boost sutil
    # Compresor fuerte para nivel consistente
    "acompressor=threshold=-18dB:ratio=4:attack=5:release=80,"
    # Crunch sutil
    "acrusher=level_in=1:level_out=0.7:bits=14:mode=lin:aa=0.3,"
    # Reverb muy corto (small room)
    "aecho=0.05:0.05:30:0.4,"
    # Haas effect para simular múltiples speakers
    "haas=right_delay=15:right_gain=0.3:right_balance=0.4,"
    # Volume boost final
    "volume=1.5"
)


def apply_pa_pro(mp3_path: Path) -> Path:
    pa_path = PRO_DIR / f"{mp3_path.stem}_pa.wav"
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", str(mp3_path),
        "-af", PA_PRO_FILTER,
        "-ar", "32000",
        "-ac", "1",  # mono (Haas no funciona bien en mono — pero por ahora mono)
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

    # Filtrar solo Yamanote para comparar
    yamanote_mp3s = [m for m in mp3s if m.name.startswith("yamanote_")]
    print(f"Aplicando PRO chain a {len(yamanote_mp3s)} mp3s de Yamanote...")

    for mp3 in yamanote_mp3s:
        pa = apply_pa_pro(mp3)
        if pa:
            print(f"  {pa.name}")

    print(f"\n✓ Wavs en {PRO_DIR}/")
    print(f"  Filter: {PA_PRO_FILTER}")


if __name__ == "__main__":
    main()
